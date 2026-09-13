import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SectionCard } from '@/components/SectionCard';
import { PageTabs } from '@/components/PageTabs';
import { personnel, utilisateurs } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import type { Personnel, User } from '@/types';

const personnelTabs = [
  { id: 'personnel', label: 'Personnel' },
  { id: 'utilisateurs', label: 'Utilisateurs' },
];

export function PersonnelPage() {
  const [activeTab, setActiveTab] = useState('personnel');

  const personnelColumns: Column<Personnel>[] = [
    { key: 'id', label: '#' },
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'email', label: 'Email' },
    { key: 'adresse', label: 'Adresse' },
    { key: 'fonction', label: 'Fonction' },
    {
      key: 'date_embauche',
      label: 'Date d’embauche',
      render: (row) => (row.date_embauche ? formatDate(row.date_embauche) : '—'),
    },
    {
      key: 'actif',
      label: 'Actif',
      render: (row) => (
        <span className={`badge ${row.actif ? 'badge-active' : 'badge-inactive'}`}>
          {row.actif ? 'Oui' : 'Non'}
        </span>
      ),
    },
  ];

  const utilisateurColumns: Column<User>[] = [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Rôle',
      render: (row) => row.role?.nom_affichage ?? '—',
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Personnel"
        subtitle={`${personnel.length} membre(s) enregistré(s)`}
      />

      <PageTabs
        tabs={personnelTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'personnel' && (
        <SectionCard title="Liste du personnel">
          <DataTable
            data={personnel}
            columns={personnelColumns}
            emptyMessage="Aucun membre du personnel."
          />
        </SectionCard>
      )}

      {activeTab === 'utilisateurs' && (
        <SectionCard title="Utilisateurs" subtitle={`${utilisateurs.length} utilisateur(s)`}>
          <DataTable
            data={utilisateurs}
            columns={utilisateurColumns}
            emptyMessage="Aucun utilisateur."
          />
        </SectionCard>
      )}
    </div>
  );
}
