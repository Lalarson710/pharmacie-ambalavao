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
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  emptyMessage = 'Aucune donnée disponible.',
  striped = true,
}: DataTableProps<T>) {
  return (
    <div className="table-container">
      <table className={`data-table ${striped ? 'striped' : ''}`}>
        <thead>
          <tr>
            {columns.map((col) => (
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
              <td colSpan={columns.length} className="empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render
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
