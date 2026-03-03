export default function Card({children,className=''}:{children:React.ReactNode;className?:string}){return(<div className={'bg-white border border-gray-200 '+className}>{children}</div>)}
