const req=new Map<string,number[]>();
export function rateLimit(key:string,max:number=10,windowMs:number=60000):boolean{const now=Date.now();const ts=req.get(key)||[];const recent=ts.filter(t=>now-t<windowMs);if(recent.length>=max)return false;recent.push(now);req.set(key,recent);return true}
