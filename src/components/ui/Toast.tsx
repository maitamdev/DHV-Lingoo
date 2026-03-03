'use client';
import { useEffect } from 'react';
const colors={success:'bg-emerald-500',error:'bg-red-500',info:'bg-blue-500'};
export default function Toast({message,type='info',duration=3000,onClose}:{message:string;type?:'success'|'error'|'info';duration?:number;onClose:()=>void}) { useEffect(() => { const t=setTimeout(onClose,duration); return ()=>clearTimeout(t); }, [duration,onClose]); return (<div className={'fixed bottom-6 right-6 z-50 text-white px-6 py-3 shadow-lg flex items-center gap-3 '+colors[type]}><span>{message}</span><button onClick={onClose}>X</button></div>); }
