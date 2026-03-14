interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({ data, columns, emptyMessage = 'Khong co du lieu' }: Props<T>) {
  if (data.length === 0) {
    return <div className='text-center py-8 text-sm text-gray-400'>{emptyMessage}</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200'>
            {columns.map((col) => (
              <th key={String(col.key)} className='text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className='border-b border-gray-100 hover:bg-gray-50 transition'>
              {columns.map((col) => (
                <td key={String(col.key)} className='py-3 px-4 text-gray-700'>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}