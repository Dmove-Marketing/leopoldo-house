/* Scripts extraídos de index.html */

/* reveal no scroll */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:.12, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* envio do formulário (placeholder — conectar ao backend/CRM/e-mail) */
function enviar(ev){
  ev.preventDefault();
  // TODO: integrar com endpoint, e-mail ou CRM
  document.getElementById('leadForm').style.display='none';
  document.getElementById('formOk').classList.add('show');
  return false;
}