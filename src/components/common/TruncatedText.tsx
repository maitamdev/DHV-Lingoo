export default function TruncatedText({text,max=100}:{text:string;max?:number}){return(<span title={text}>{text.length>max?text.slice(0,max)+'...':text}</span>)}
