export class DeliveryError extends Error {
  readonly reason:'rejected'|'unavailable'|'unconfirmed';
  constructor(reason:DeliveryError['reason']){super(reason);this.reason=reason;}
}
/** Formspree signals acceptance with a JSON next URL. The form stays on this page. */
export function acceptedSubmission(body: unknown): boolean {
  if(!body || typeof body!=='object')return false;
  const data=body as {next?:unknown;error?:unknown;errors?:unknown};
  return typeof data.next==='string' && data.next.length>0 && !data.error && !data.errors;
}
export async function deliverMessage(endpoint:string, values:FormData, signal:AbortSignal, fetcher:typeof fetch=fetch):Promise<void>{
  if(values.get('_gotcha'))throw new DeliveryError('rejected');
  let response:Response;
  try{
    response=await fetcher(endpoint,{method:'POST',headers:{Accept:'application/json'},signal,body:values});
  }catch{throw new DeliveryError('unconfirmed');}
  if(response.status===404 || response.status===429 || response.status>=500)throw new DeliveryError('unavailable');
  if(!response.ok)throw new DeliveryError('rejected');
  let body:unknown;
  try{body=await response.json();}catch{throw new DeliveryError('unconfirmed');}
  if(!acceptedSubmission(body))throw new DeliveryError('rejected');
}
