import Link from 'next/link';
export default function NotFound() { return (<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Inter,sans-serif'}}><h1 style={{fontSize:'96px',fontWeight:900,color:'#e5e7eb',margin:0}}>404</h1><h2>Khong tim thay trang</h2><Link href='/'>Ve trang chu</Link></div>); }
