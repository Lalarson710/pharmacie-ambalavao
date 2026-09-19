import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import type { Permission, User, Role } from '@/types';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { permissionsApi } from '@/features/personnel/api/permissions';
import { userPermissionsApi } from '@/features/personnel/api/permissions';
import { utilisateursApi } from '@/features/personnel/api/utilisateurs';
import { useToast } from '@/components/Toast';

interface UserPermissionState {
  permissionId: number;
  allowed: boolean;
}

function _getPermissionLabel(permission: Permission): string {
  const map: Record<string, string> = {
    'produit.view': 'Voir les produits',
    'produit.create': 'Créer un produit',
    'produit.update': 'Modifier un produit',
    'produit.delete': 'Supprimer un produit',

    'stock.view': 'Voir le stock',
    'stock.entry': 'Gérer Stock Entrée',
    'stock.exit': 'Gérer Stock Sortie',
    'stock.inventory': 'Réaliser Inventaire',

    'achat.view': 'Voir les achats',
    'achat.create': 'Créer un achat',

    'vente.view': 'Voir les ventes',
    'vente.create': 'Créer une vente',
    'vente.confirm': 'Confirmer une vente',

    'caisse.open': 'Ouvrir la caisse',
    'caisse.close': 'Fermer la caisse',

    'rapport.view': 'Voir les rapports',
    'rapport.export': 'Exporter un rapport',

    'statistique.view': 'Voir les statistiques',
    'alerte.view': 'Voir les alertes',

    'personnel.view': 'Voir le personnel',
    'personnel.create': 'Créer du personnel',

    'user.view': 'Voir les utilisateurs',
    'user.create': 'Créer un utilisateur',

    'permission.manage': 'Gérer les permissions',

    'fournisseur.view': 'Voir les fournisseurs',
    'fournisseur.create': 'Créer un fournisseur',

    'client.view': 'Voir les clients',
    'client.create': 'Créer un client',

    'facture.print': 'Imprimer une facture',

    'sauvegarde.view': 'Voir les sauvegardes',
    'sauvegarde.create': 'Créer une sauvegarde',
    'sauvegarde.restore': 'Restaurer une sauvegarde',
  };

  return map[permission.code] ?? permission.nom;
}

/* =========================================================
   PAGE — 100% DYNAMIQUE (aucune donnée statique)
   ========================================================= */

export function PermissionsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const userIdFromUrl = Number(searchParams.get('user_id')) || 1;

  // ── ÉTATS ──
  const [selectedUserId, setSelectedUserId] = useState<number>(userIdFromUrl);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermissionState[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<UserPermissionState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [permissionsSaved, setPermissionsSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const { showToast } = useToast();

  // ═══════════════════════════════════════════════════════
  // EFFECT 1 : Observer les changements de location → mettre à jour selectedUserId
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    const newUserId = Number(new URLSearchParams(location.search).get('user_id')) || 1;
    setSelectedUserId(newUserId);
  }, [location]);

  // ═══════════════════════════════════════════════════════
  // EFFECT 2 : Charger TOUTES les données quand selectedUserId change
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    setPermissionsSaved(false);
    setLoading(true);

    const loadAll = async () => {
      try {
        // Charger en parallèle : permissions disponibles + permissions utilisateur + infos utilisateur
        const [allPerms, userPerms, user] = await Promise.all([
          permissionsApi.getAll(),
          userPermissionsApi.getByUser(selectedUserId),
          utilisateursApi.getById(selectedUserId),
        ]);

        setAllPermissions(allPerms);
        setSelectedUser(user);
        setSelectedRole(user?.role ?? null);

        // Construire une map permissionId → autorise depuis les permissions utilisateur
        const permMap = new Map<number, boolean>();
        userPerms.forEach((p) => {
          permMap.set(p.id, p.pivot?.autorise ?? true);
        });

        // Appliquer le statut à TOUTES les permissions
        const states: UserPermissionState[] = allPerms.map((p) => ({
          permissionId: p.id,
          allowed: permMap.get(p.id) ?? false,
        }));

        setUserPermissions(states);
        setOriginalPermissions([...states]);
      } catch (error) {
        console.error('Erreur lors du chargement des permissions :', error);
        showToast('Erreur lors du chargement des permissions', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [selectedUserId, showToast]);

  // ── Permissions triées ──
  const sortedPermissions = useMemo(() => {
    const menuOrder = [
      'fournisseur', 'produit', 'client', 'achat', 'stock', 'vente',
      'caisse', 'personnel', 'user', 'permission', 'alerte', 'statistique',
      'rapport', 'sauvegarde', 'facture',
    ];

    const permissionOrder: Record<string, number> = {
      view: 1, create: 2, update: 3, delete: 4, entry: 5, exit: 6,
      inventory: 7, confirm: 8, open: 9, close: 10, export: 11, print: 12,
      restore: 13, manage: 14,
    };

    return [...allPermissions].sort((a, b) => {
      const [aMenu, aAction] = a.code.split('.');
      const [bMenu, bAction] = b.code.split('.');

      const aMenuIndex = menuOrder.indexOf(aMenu);
      const bMenuIndex = menuOrder.indexOf(bMenu);

      if (aMenuIndex !== bMenuIndex) return aMenuIndex - bMenuIndex;

      return (
        (permissionOrder[aAction] ?? 99) -
        (permissionOrder[bAction] ?? 99)
      );
    });
  }, [allPermissions]);

  // ── Toggle une permission ──
  const togglePermission = (permissionId: number) => {
    setPermissionsSaved(false);
    setUserPermissions((prev) =>
      prev.map((up) =>
        up.permissionId === permissionId
          ? { ...up, allowed: !up.allowed }
          : up
      )
    );
  };

  // ── Vérifier s'il y a des changements ──
  const hasChanges = useMemo(() => {
    if (userPermissions.length !== originalPermissions.length) return true;
    return userPermissions.some(
      (up, index) => up.allowed !== originalPermissions[index]?.allowed
    );
  }, [userPermissions, originalPermissions]);

  // ═══════════════════════════════════════════════════════
  // SAUVEGARDER LES PERMISSIONS
  // ═══════════════════════════════════════════════════════
  const saveUserPermissions = async () => {
    setSaving(true);
    try {
      const changedPerms = userPermissions.filter((up, index) => {
        const original = originalPermissions[index];
        return !original || up.allowed !== original.allowed;
      });

      if (changedPerms.length === 0) {
        setPermissionsSaved(true);
        showToast('Aucun changement à sauvegarder', 'info');
        return;
      }

      const promises = changedPerms.map((up) =>
        userPermissionsApi.definir(selectedUserId, up.permissionId, up.allowed)
      );

      await Promise.all(promises);

      setOriginalPermissions([...userPermissions]);
      setPermissionsSaved(true);
      showToast(`${changedPerms.length} permission(s) enregistrée(s) avec succès`, 'success');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des permissions :', error);
      showToast('Erreur lors de la sauvegarde des permissions', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // RÉINITIALISER LES PERMISSIONS
  // ═══════════════════════════════════════════════════════
  const resetPermissions = async () => {
    try {
      const userPerms = await userPermissionsApi.getByUser(selectedUserId);

      const permMap = new Map<number, boolean>();
      userPerms.forEach((p) => {
        permMap.set(p.id, p.pivot?.autorise ?? true);
      });

      const states: UserPermissionState[] = allPermissions.map((p) => ({
        permissionId: p.id,
        allowed: permMap.get(p.id) ?? false,
      }));

      setUserPermissions(states);
      setOriginalPermissions([...states]);
      setPermissionsSaved(false);
      setConfirmReset(false);
      showToast('Permissions réinitialisées', 'success');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation :', error);
      showToast('Erreur lors de la réinitialisation', 'error');
    }
  };

  const allowedCount = userPermissions.filter((up) => up.allowed).length;
  const totalCount = allPermissions.length;

  // ── Loading ──
  if (loading) {
    return (
      <div className="page-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
          }}
        >
          <div className="loading-spinner" />
          <p>Chargement des permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <PageHeader
        title="Permissions"
        subtitle={`${allowedCount} sur ${totalCount} permissions`}
      />

      <PageToolbar
        actions={
          <Link to="/personnels?tab=utilisateurs" className="btn-primary">
            <ArrowLeft size={15} /> Retour
          </Link>
        }
      />

      {/* =====================================================
          INFORMATIONS UTILISATEUR (100% DYNAMIQUE — API)
      ===================================================== */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 px-6 py-5">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'center', width: '100%' }}>

          {/* GAUCHE — UTILISATEUR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }}>
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Shield size={22} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Utilisateur</div>
              <div className="font-semibold text-gray-900">
                {selectedUser?.name ?? '—'}
              </div>
            </div>
          </div>

          {/* CENTRE — EMAIL */}
          <div style={{ textAlign: 'center', padding: '0 24px', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
            <div className="text-xs text-gray-400 mb-1">Adresse email</div>
            <div className="text-sm text-gray-600 truncate">
              {selectedUser?.email ?? '—'}
            </div>
          </div>

          {/* DROITE — RÔLE */}
          <div style={{ textAlign: 'right', paddingLeft: '24px' }}>
            <div className="text-xs text-gray-400 mb-1">Rôle</div>
            <div className="font-medium text-gray-800">
              {selectedRole?.nom_affichage ?? '—'}
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          PERMISSIONS
      ===================================================== */}
      <SectionCard
        title="Permissions utilisateur"
        subtitle={`${allowedCount} sur ${totalCount} permissions autorisées`}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: '100%', maxWidth: '1200px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridAutoFlow: 'column',
              gridTemplateRows: `repeat(${Math.ceil(sortedPermissions.length / 3)}, auto)`,
              gap: '16px',
            }}
          >
            {sortedPermissions.map((permission) => {
              const up = userPermissions.find((p) => p.permissionId === permission.id);
              const isAllowed = up?.allowed ?? false;
              const label = _getPermissionLabel(permission);

              return (
                <div
                  key={permission.id}
                  className={`min-h-[64px] px-4 py-3 rounded-lg border transition-all duration-200 ${isAllowed ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'}`}
                  style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 36px', alignItems: 'center', columnGap: '12px' }}
                >
                  <span style={{ minWidth: 0, fontSize: '14px', fontWeight: 500, lineHeight: '20px' }}>
                    {label}
                  </span>
                  <div style={{ width: '36px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ToggleSwitch
                      checked={isAllowed}
                      onChange={() => togglePermission(permission.id)}
                      ariaLabel={`Permission : ${label}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BOUTONS
        ================================================= */}
        <div className="flex items-center justify-center gap-3" style={{ marginTop: '32px' }}>
          <button
            type="button"
            className="btn-primary min-w-[220px] justify-center"
            onClick={saveUserPermissions}
            disabled={saving || !hasChanges}
          >
            <span className="flex items-center gap-1">
              {saving ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Enregistrement...
                </>
              ) : permissionsSaved ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Enregistré
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Enregistrer les changements
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() => setConfirmReset(true)}
            disabled={saving || !hasChanges}
          >
            Réinitialiser
          </button>
        </div>
      </SectionCard>

      {/* =====================================================
          CONFIRMATION
      ===================================================== */}
      <ConfirmModal
        open={confirmReset}
        title="Réinitialiser les permissions"
        message="Voulez-vous vraiment réinitialiser les permissions de cet utilisateur ?"
        onConfirm={resetPermissions}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
