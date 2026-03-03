'use client';
import { useState, ReactNode } from 'react';
export default function Tooltip({content,children}:{content:string;children:ReactNode}) { const [v,s]=useState(false); return (<div className='relative inline-block' onMouseEnter={()=>s(true)} onMouseLeave={()=>s(false)}>{children}{v&&<div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs whitespace-nowrap z-50'>{content}</div>}</div>); }
