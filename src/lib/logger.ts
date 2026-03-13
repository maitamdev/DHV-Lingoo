type Level='debug'|'info'|'warn'|'error';
export function log(level:Level,msg:string,data?:Record<string,unknown>){const e={timestamp:new Date().toISOString(),level,msg,...data};if(level==='error')console.error(JSON.stringify(e));else console.log(JSON.stringify(e))}
// Structured JSON output
// Achievement event logging
