/**
 * Utilitaires de formatage — utilisés par toutes les pages statiques.
 */

export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR');
}

export function formatDateTime(dateTimeString: string): string {
  return new Date(dateTimeString).toLocaleString('fr-FR');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Ko';
  const k = 1024;
  const sizes = ['Ko', 'Mo', 'Go', 'To'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function formatStatut(statut: string): string {
  const map: Record<string, string> = {
    brouillon: 'Brouillon',
    confirme: 'Confirmé',
    confirmee: 'Confirmée',
    annule: 'Annulé',
    annulee: 'Annulée',
    impayee: 'Impayée',
    partiellement_payee: 'Partiellement payée',
    payee: 'Payée',
    ouverte: 'Ouverte',
    fermee: 'Fermée',
  };
  return map[statut] ?? statut;
}

export function getStatutBadgeClass(statut: string): string {
  switch (statut) {
    case 'brouillon':
      return 'badge-draft';
    case 'confirmee':
    case 'payee':
    case 'ouverte':
      return 'badge-active';
    case 'annule':
    case 'annulee':
    case 'rupture':
      return 'badge-inactive';
    case 'partiellement_payee':
      return 'badge-warning';
    case 'impayee':
      return 'badge-inactive';
    case 'fermee':
      return 'badge-closed';
    default:
      return 'badge';
  }
}
