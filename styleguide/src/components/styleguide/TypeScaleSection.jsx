import PageSection from '../framework/PageSection'
import Table from '../organisms/Table'

const defaultColumns = (family) => [
  { header: 'Token',    accessor: 'token',  className: 'kol-table-cell-title' },
  { header: 'Weight',   accessor: 'weight' },
  { header: 'Size / LH', accessor: 'size', render: (r) => `${r.size} / ${r.lh}` },
  {
    header: 'Preview',
    accessor: 'preview',
    render: (r) => (
      <span style={{
        fontFamily: `"${family}", sans-serif`,
        fontWeight: r.weight,
        fontSize: `${Math.min(r.size, 20)}px`,
        lineHeight: 1.2,
      }}>
        The quick brown fox
      </span>
    ),
    className: 'kol-table-cell-text',
    style: { whiteSpace: 'normal' },
  },
]

export default function TypeScaleSection({ id, label, title, body, family, rows, columns, children }) {
  const cols = columns ?? defaultColumns(family)
  return (
    <PageSection id={id} label={label} title={title} body={body}>
      <Table className="kol-table--simple" columns={cols} rows={rows} />
      {children && <div className="mt-12">{children}</div>}
    </PageSection>
  )
}
