interface Stat{label:string;value:string|number}
export default function StatsGrid({stats}:{stats:Stat[]}){return(<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>{stats.map((s,i)=>(<div key={i} className='bg-white border p-4'><div className='text-2xl font-black'>{s.value}</div><div className='text-xs font-semibold text-gray-500 uppercase mt-1'>{s.label}</div></div>))}</div>)}
