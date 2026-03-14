import { Search } from 'lucide-react';

interface Props {
  query: string;
  suggestion?: string;
}

export default function EmptySearch({ query, suggestion }: Props) {
  return (
    <div className='py-12 text-center'>
      <Search className='w-10 h-10 text-gray-200 mx-auto mb-3' />
      <p className='text-sm text-gray-500'>Khong tim thay ket qua cho <strong>\"{query}\"</strong></p>
      {suggestion && <p className='text-xs text-gray-400 mt-1'>Thu: {suggestion}</p>}
    </div>
  );
}