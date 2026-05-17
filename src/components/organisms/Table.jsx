/**
 * Table — data table.
 * Styles: src/ds/components/organisms.css.
 *
 * Variants:
 *   default — bordered, column dividers, header bg
 *   simple  — borderless, flush, no column dividers
 */
const Table = ({ caption, columns, rows, variant = 'default', className = '' }) => {
  const variantClass = variant === 'simple' ? 'ac-table--simple' : ''
  const wrapperClass = ['ac-table-wrapper', variantClass, className].filter(Boolean).join(' ')
  return (
  <div className={wrapperClass}>
    <table className="ac-table">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead className="ac-table-thead">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              scope="col"
              className={column.headerClassName ?? 'ac-table-cell-title'}
              style={column.style}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={row.id ?? row.token ?? rowIndex} className="ac-table-row">
            {columns.map((column) => (
              <td key={column.accessor} className={(typeof column.className === 'function' ? column.className(row) : column.className) ?? 'ac-table-cell-text'} style={column.style}>
                {column.render ? column.render(row) : row[column.accessor] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Table
