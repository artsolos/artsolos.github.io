export interface MessageValues { name: string; email: string; message: string; honey: string; url: string }
export class DeliveryError extends Error {
  reason:'activation'|'rejected'|'unconfirmed';
  constructor(reason:'activation'|'rejected'|'unconfirmed'){super(reason);this.reason=reason;}
}
/** HTTP 200 alone is not acceptance. FormSubmit also returns a success flag. */
export function acceptedSubmission(body: unknown): boolean {
  if(!body || typeof body!=='object')return false;
  const data=body as {success?:unknown;message?:unknown};
  return (data.success===true || data.success==='true') && !/activat|confirm.*(?:email|form)|captcha|error|fail/i.test(String(data.message??''));
}
export async function deliverMessage(endpoint:string, values:MessageValues, signal:AbortSignal, fetcher:typeof fetch=fetch):Promise<void>{
  if(values.honey)throw new DeliveryError('rejected');
  let response:Response;
  try{
    response=await fetcher(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal,body:JSON.stringify({
      name:values.name,email:values.email,message:values.message,_replyto:values.email,
      _subject:'New portfolio message — Arefin Mahmood',_honey:'',_url:values.url,
    })});
  }catch{throw new DeliveryError('unconfirmed');}
  let body:unknown;
  try{body=await response.json();}catch{throw new DeliveryError('unconfirmed');}
  if(/activat|confirm.*(?:email|form)/i.test(String((body as {message?:unknown})?.message??'')))throw new DeliveryError('activation');
  if(!response.ok || !acceptedSubmission(body))throw new DeliveryError('rejected');
}
