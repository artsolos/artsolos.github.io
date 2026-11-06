import { deliverMessage, DeliveryError } from '../lib/contact-delivery';

export function initContactForm(form:HTMLFormElement,signal:AbortSignal){
  const fields=[...form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('.form-fields input,.form-fields textarea')];
  const status=form.querySelector<HTMLElement>('[data-form-status]')!;
  const button=form.querySelector<HTMLButtonElement>('[type=submit]')!;
  let sending=false,request:AbortController|null=null;
  const setStatus=(text:string,state:string)=>{status.textContent=text;status.dataset.state=state;};
  const validate=(field:HTMLInputElement|HTMLTextAreaElement)=>{
    const error=form.querySelector<HTMLElement>(`#${field.id}-error`)!;
    let message='';
    if(!field.value.trim())message=field.name==='name'?'Please enter your name.':field.name==='email'?'Please enter your email address.':'Please enter a message.';
    else if(field.validity.typeMismatch)message='Enter a valid email address, such as name@example.com.';
    else if(field.value.length>field.maxLength)message=`Please use no more than ${field.maxLength.toLocaleString()} characters.`;
    field.setAttribute('aria-invalid',String(!!message));error.textContent=message;error.hidden=!message;
    return !message;
  };
  form.noValidate=true;
  fields.forEach(field=>field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(field);if(status.dataset.state==='success')setStatus('','');},{signal}));
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(sending)return;
    const invalid=fields.filter(field=>!validate(field));
    if(invalid.length){setStatus('Please check the highlighted fields.','error');invalid[0].focus();return;}
    const values=new FormData(form);
    fields.forEach(field=>values.set(field.name,field.value.trim()));
    sending=true;request=new AbortController();const timeout=window.setTimeout(()=>request?.abort(),20000);
    button.disabled=true;button.textContent='Sending…';form.setAttribute('aria-busy','true');fields.forEach(f=>f.readOnly=true);setStatus('Sending your message…','loading');
    try{
      await deliverMessage(form.action,values,request.signal);
      form.reset();setStatus('Your message was accepted. Thank you for getting in touch.','success');
    }catch(error){
      const reason=error instanceof DeliveryError?error.reason:'unconfirmed';
      const errorMessage={
        rejected:'The delivery service did not accept your message.',
        unavailable:'The contact form service is temporarily unavailable.',
        unconfirmed:'We couldn’t confirm that your message was sent.',
      }[reason];
      setStatus(`${errorMessage} Your message is still here. You can use the email link below to contact me directly.`,'error');
    }finally{
      clearTimeout(timeout);sending=false;request=null;button.disabled=false;button.innerHTML='Send message <span aria-hidden="true">↗</span>';form.removeAttribute('aria-busy');fields.forEach(f=>f.readOnly=false);status.focus({preventScroll:true});
    }
  },{signal});
  // A cancelled in-flight request must not leave cached form controls disabled.
  return ()=>request?.abort();
}
