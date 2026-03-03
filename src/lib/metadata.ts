import type{Metadata}from'next';
export function createMetadata(title:string,desc:string):Metadata{return{title:title+' | DHV-Lingoo',description:desc,openGraph:{title,description:desc,siteName:'DHV-Lingoo'}}}
