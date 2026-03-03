export default function FileSize({bytes}:{bytes:number}){const u=['B','KB','MB','GB'];let i=0;let s=bytes;while(s>=1024&&i<u.length-1){s/=1024;i++}return(<span>{s.toFixed(i>0?1:0)} {u[i]}</span>)}
