'use client';
export default function CopyButton({text}:{text:string}){const [c,s]=require('react').useState(false);const f=async()=>{await navigator.clipboard.writeText(text);s(true);setTimeout(()=>s(false),2000)};return(<button onClick={f} className='text-sm font-medium'>{c?'Copied':'Copy'}</button>)}
