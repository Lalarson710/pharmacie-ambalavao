import { useAuth } from '@/features/auth/store/authStore';
import { useCallback, useMemo } from 'react';

/**
 * Hook pour vérifier les permissions de l'utilisateur connecté
 * Utilise les permissions chargées depuis l'API /user (user.permissions[])
 */
export function usePermissions() {
  const { user } = useAuth();

  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param code - Code de la permission (ex: 'produit.view', 'categorie.create')
   * @returns true si l'utilisateur a la permission autorisée
   */
  const hasPermission = useCallback((code: string): boolean => {
    if (!user?.permissions) return false;
    
    const perm = user.permissions.find((p) => p.code === code);
    return perm?.pivot?.autorise === true;
  }, [user?.permissions]);

  /**
   * Vérifie si l'utilisateur a au moins une des permissions données
   * @param codes - Array de codes de permission
   * @returns true si l'utilisateur a au moins une permission
   */
  const hasAnyPermission = useCallback((codes: string[]): boolean => {
    return codes.some((code) => hasPermission(code));
  }, [hasPermission]);

  /**
   * Vérifie si l'utilisateur a toutes les permissions données
   * @param codes - Array de codes de permission
   * @returns true si l'utilisateur a toutes les permissions
   */
  const hasAllPermissions = useCallback((codes: string[]): boolean => {
    return codes.every((code) => hasPermission(code));
  }, [hasPermission]);

  const permissions = useMemo(() => user?.permissions ?? [], [user?.permissions]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
  };
}

/**
 * Hook pour obtenir les permissions d'un module spécifique
 * @param module - Nom du module (ex: 'produit', 'categorie', 'unite', 'lot')
 * @returns Objet avec les permissions CRUD du module
 */
export function useModulePermissions(module: string) {
  const { hasPermission } = usePermissions();

  return useMemo(() => ({
    view: hasPermission(`${module}.view`),
    create: hasPermission(`${module}.create`),
    update: hasPermission(`${module}.update`),
    delete: hasPermission(`${module}.delete`),
    // Permissions spéciales
    print: hasPermission(`${module}.print`),
    export: hasPermission(`${module}.export`),
    confirm: hasPermission(`${module}.confirm`),
    cancel: hasPermission(`${module}.cancel`),
    open: hasPermission(`${module}.open`),
    close: hasPermission(`${module}.close`),
    restore: hasPermission(`${module}.restore`),
    import: hasPermission(`${module}.import`),
    manage: hasPermission(`${module}.manage`),
    entry: hasPermission(`${module}.entry`),
    exit: hasPermission(`${module}.exit`),
    inventory: hasPermission(`${module}.inventory`),
  }), [hasPermission, module]);
}