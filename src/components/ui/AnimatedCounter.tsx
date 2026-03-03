'use client';
import{useState,useEffect}from'react';
export default function AnimatedCounter({value,className=''}:{value:number;className?:string}){const[d,s]=useState(0);useEffect(()=>{const t=Date.now();const step=()=>{const p=Math.min((Date.now()-t)/1000,1);s(Math.floor(value*p));if(p<1)requestAnimationFrame(step)};step()},[value]);return(<span className={className}>{d.toLocaleString('vi-VN')}</span>)}
