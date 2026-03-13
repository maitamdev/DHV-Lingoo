export async function getProfile(supabase:any,userId:string){const{data}=await supabase.from('profiles').select('*').eq('id',userId).single();return data}
export async function getCourses(supabase:any){const{data}=await supabase.from('courses').select('*').order('title');return data||[]}
// Retry logic resilience
