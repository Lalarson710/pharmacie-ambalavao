import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { SectionCard } from '@/components/SectionCard';
import { PageToolbar } from '@/components/PageToolbar';
import { ConfirmModal } from '@/components/ConfirmModal';
import { permissions, utilisateurs, roles } from '@/data/mockData';
import type { Permission } from '@/types';
import { ToggleSwitch } from '@/components/ToggleSwitch';

interface UserPermissionState {
  permissionId: number;
  allowed: boolean;
}

function _getUserPermission(
  userId: number,
  permissionId: number
): boolean {
  if (userId === 3) return true;

  if (userId === 2) {
    const allowedCodes = [
      'produit.view',
      'stock.view',
      'achat.view',
      'vente.view',
      'caisse.open',
      'caisse.close',
      'rapport.view',
      'alerte.view',
      'personnel.view',
      'client.view',
      'fournisseur.view',
      'sauvegarde.view',
    ];

    const permission = permissions.find(
      (p) => p.id === permissionId
    );

    return permission
      ? allowedCodes.includes(permission.code)
      : false;
  }

  const allowedCodes = [
    'produit.view',
    'stock.view',
    'vente.view',
    'caisse.open',
    'caisse.close',
    'alerte.view',
    'client.view',
    'fournisseur.view',
  ];

  const permission = permissions.find(
    (p) => p.id === permissionId
  );

  return permission
    ? allowedCodes.includes(permission.code)
    : false;
}

function _getPermissionLabel(
  permission: Permission
): string {
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
   PAGE
========================================================= */

export function PermissionsPage() {
  const [searchParams] = useSearchParams();

  const userIdFromUrl =
    Number(searchParams.get('user_id')) || 1;

  const [selectedUserId, setSelectedUserId] =
    useState<number>(userIdFromUrl);

  const [userPermissions, setUserPermissions] =
    useState<UserPermissionState[]>(() =>
      permissions.map((p) => ({
        permissionId: p.id,
        allowed: _getUserPermission(
          userIdFromUrl,
          p.id
        ),
      }))
    );

  const [permissionsSaved, setPermissionsSaved] =
    useState(false);

  const [confirmReset, setConfirmReset] =
    useState(false);

  const selectedUser =
    utilisateurs.find(
      (u) => u.id === selectedUserId
    ) ?? utilisateurs[0];

  const selectedRole =
    selectedUser?.role ?? roles[0];

  const sortedPermissions = useMemo(() => {
  const menuOrder = [
    'fournisseur',
    'produit',
    'client',
    'achat',
    'stock',
    'vente',
    'caisse',
    'personnel',
    'user',
    'permission',
    'alerte',
    'statistique',
    'rapport',
    'sauvegarde',
    'facture',
  ];

  const permissionOrder: Record<string, number> = {
    view: 1,
    create: 2,
    update: 3,
    delete: 4,
    entry: 5,
    exit: 6,
    inventory: 7,
    confirm: 8,
    open: 9,
    close: 10,
    export: 11,
    print: 12,
    restore: 13,
    manage: 14,
  };

  return [...permissions].sort((a, b) => {
    const [aMenu, aAction] = a.code.split('.');
    const [bMenu, bAction] = b.code.split('.');

    const aMenuIndex = menuOrder.indexOf(aMenu);
    const bMenuIndex = menuOrder.indexOf(bMenu);

    // D'abord par menu
    if (aMenuIndex !== bMenuIndex) {
      return aMenuIndex - bMenuIndex;
    }

    // Ensuite par action
    return (
      (permissionOrder[aAction] ?? 99) -
      (permissionOrder[bAction] ?? 99)
    );
  });
}, []);

  useEffect(() => {
    const newUserId =
      Number(searchParams.get('user_id')) || 1;

    setSelectedUserId(newUserId);
    setPermissionsSaved(false);

    setUserPermissions(
      permissions.map((p) => ({
        permissionId: p.id,
        allowed: _getUserPermission(
          newUserId,
          p.id
        ),
      }))
    );
  }, [searchParams]);

  const togglePermission = (
    permissionId: number
  ) => {
    setPermissionsSaved(false);

    setUserPermissions((prev) =>
      prev.map((up) =>
        up.permissionId === permissionId
          ? {
              ...up,
              allowed: !up.allowed,
            }
          : up
      )
    );
  };

  const saveUserPermissions = () => {
    setPermissionsSaved(true);

    alert(
      'Permissions enregistrées avec succès.'
    );
  };

  const resetPermissions = () => {
    setUserPermissions(
      permissions.map((p) => ({
        permissionId: p.id,
        allowed: _getUserPermission(
          selectedUserId,
          p.id
        ),
      }))
    );

    setPermissionsSaved(false);
    setConfirmReset(false);
  };

  const allowedCount =
    userPermissions.filter(
      (up) => up.allowed
    ).length;

  const totalCount = permissions.length;

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
          <Link
            to="/personnels?tab=utilisateurs"
            className="btn-primary"
          >
            <ArrowLeft size={15} />
            Retour
          </Link>
        }
      />

      {/* =====================================================
          INFORMATIONS UTILISATEUR
      ===================================================== */}

      <div className="mb-6 bg-white rounded-lg border border-gray-200 px-6 py-5">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            alignItems: 'center',
            width: '100%',
          }}
        >

          {/* GAUCHE — UTILISATEUR */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '12px',
            }}
          >
            <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Shield
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <div className="text-xs text-gray-400 mb-1">
                Utilisateur
              </div>

              <div className="font-semibold text-gray-900">
                {selectedUser.name}
              </div>
            </div>
          </div>


          {/* CENTRE — EMAIL */}
          <div
            style={{
              textAlign: 'center',
              padding: '0 24px',
              borderLeft: '1px solid #f3f4f6',
              borderRight: '1px solid #f3f4f6',
            }}
          >
            <div className="text-xs text-gray-400 mb-1">
              Adresse email
            </div>

            <div className="text-sm text-gray-600 truncate">
              {selectedUser.email}
            </div>
          </div>


          {/* DROITE — RÔLE */}
          <div
            style={{
              textAlign: 'right',
              paddingLeft: '24px',
            }}
          >
            <div className="text-xs text-gray-400 mb-1">
              Rôle
            </div>

            <div className="font-medium text-gray-800">
              {selectedRole.nom_affichage}
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

        {/* 3 COLONNES FIXES */}

        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(11, auto)',
            gap: '16px',
          }}
        >

            {sortedPermissions.map(
              (permission) => {

                const up =
                  userPermissions.find(
                    (p) =>
                      p.permissionId ===
                      permission.id
                  );

                const isAllowed =
                  up?.allowed ?? false;

                const label =
                  _getPermissionLabel(
                    permission
                  );

                return (
                  <div
                    key={permission.id}
                    className={`
                      min-h-[64px]
                      px-4
                      py-3
                      rounded-lg
                      border
                      transition-all
                      duration-200
                      ${
                        isAllowed
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-gray-200'
                      }
                    `}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) 36px',
                      alignItems: 'center',
                      columnGap: '12px',
                    }}
                  >
                    <span
                      style={{
                        minWidth: 0,
                        fontSize: '14px',
                        fontWeight: 500,
                        lineHeight: '20px',
                      }}
                    >
                      {label}
                    </span>

                    <div
                      style={{
                        width: '36px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <ToggleSwitch
                        checked={isAllowed}
                        onChange={() =>
                          togglePermission(permission.id)
                        }
                        ariaLabel={`Permission : ${label}`}
                      />
                    </div>
                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* =================================================
            BOUTONS
        ================================================= */}
          <div
            className="flex items-center justify-center gap-3"
            style={{
              marginTop: '32px',
            }}
          >
        

          <button
            type="button"
            className="btn-primary min-w-[220px] justify-center"
            onClick={
              saveUserPermissions
            }
            disabled={permissionsSaved}
          >
            <span className="flex items-center gap-1">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>

              {permissionsSaved
                ? 'Enregistré'
                : 'Enregistrer les changements'}

            </span>
          </button>

          <button
            type="button"
            className="btn-ghost"
            onClick={() =>
              setConfirmReset(true)
            }
            disabled={permissionsSaved}
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
        onCancel={() =>
          setConfirmReset(false)
        }
      />

    </div>
  );
}