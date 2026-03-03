'use client';
import { useState, useEffect } from 'react';
export default function ScrollToTop() { const [v, setV] = useState(false); useEffect(() => { const f = () => setV(window.scrollY > 300); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f); }, []); if (!v) return null; return (<button onClick={() => window.scrollTo({top:0,behavior:'smooth'})} className='fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600' aria-label='Scroll to top'>Up</button>); }
