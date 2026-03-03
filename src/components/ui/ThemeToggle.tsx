'use client';
import{useState}from'react';
export default function ThemeToggle(){const[d,s]=useState(false);return(<button onClick={()=>s(!d)} className='p-2 hover:bg-gray-100'>Theme</button>)}
