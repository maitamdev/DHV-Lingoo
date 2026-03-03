'use client';
export default function GlobalError({error,reset}:{error:Error;reset:()=>void}) { return (<html><body><div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}><h2>Da xay ra loi</h2><p>{error.message}</p><button onClick={reset}>Thu lai</button></div></body></html>); }
