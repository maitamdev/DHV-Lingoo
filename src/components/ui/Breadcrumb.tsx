'use client';
import Link from 'next/link';
interface Item{label:string;href?:string}
export default function Breadcrumb({items}:{items:Item[]}) { return (<nav aria-label='Breadcrumb' className='text-sm text-gray-500 mb-4'><ol className='flex items-center gap-2'>{items.map((item,i)=>(<li key={i} className='flex items-center gap-2'>{i>0&&<span>/</span>}{item.href?<Link href={item.href} className='hover:text-blue-600'>{item.label}</Link>:<span className='text-gray-900 font-medium'>{item.label}</span>}</li>))}</ol></nav>); }
