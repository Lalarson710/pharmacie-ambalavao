import { type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  striped?: boolean;
  actions?: (row: T) => ReactNode;
  actionsHeaderLabel?: string;
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  emptyMessage = 'Aucune donnée disponible.',
  striped = true,
  actions,
  actionsHeaderLabel = 'Actions',
}: DataTableProps<T>) {
  const hasActions = !!actions;
  const allColumns = hasActions
    ? [...columns, { key: '__actions', label: actionsHeaderLabel, className: 'actions-col' }]
    : columns;

  return (
    <div className="table-container">
      <table className={`data-table ${striped ? 'striped' : ''}`}>
        <thead>
          <tr>
            {allColumns.map((col) => (
              <th
                key={col.key}
                className={col.headerClassName}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={allColumns.length} className="empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id}>
                {allColumns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.key === '__actions'
                      ? actions?.(row)
                      : col.render
                        ? col.render(row, index)
                        : (row as Record<string, unknown>)[col.key]?.toString() ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
