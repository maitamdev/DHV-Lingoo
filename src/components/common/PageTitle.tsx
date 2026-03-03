'use client';import{useEffect}from'react';export default function PageTitle({title}:{title:string}){useEffect(()=>{document.title=title+' | DHV-Lingoo'},[title]);return null}
