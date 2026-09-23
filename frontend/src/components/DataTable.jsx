import EmptyState from "./EmptyState";

// components/DataTable.jsx — generic table driven by a columns config.
// columns: [{ key, header, render?(row) }]
export default function DataTable({ columns, data, onRowClick, emptyMessage }) {
  if (data.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className={onRowClick ? "clickable" : ""} onClick={() => onRowClick?.(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
