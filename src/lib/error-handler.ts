export class AppError extends Error{constructor(public statusCode:number,message:string){super(message);this.name='AppError'}}
export function handleApiError(e:unknown){if(e instanceof AppError)return{message:e.message,status:e.statusCode};return{message:'Unexpected error',status:500}}
// Stack trace formatting
