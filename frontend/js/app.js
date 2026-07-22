document.addEventListener('DOMContentLoaded',()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('visible'));

  document.querySelectorAll('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:reduce?'auto':'smooth'})));

  const toggle=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');
  toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const canvas=document.getElementById('network');
  if(canvas){
    const ctx=canvas.getContext('2d');let nodes=[];
    const resize=()=>{const ratio=Math.max(1,window.devicePixelRatio||1),w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);nodes=Array.from({length:Math.min(64,Math.max(24,Math.floor(w/18)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.17,vy:(Math.random()-.5)*.17}))};
    resize();addEventListener('resize',resize);
    const draw=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;ctx.fillStyle='rgba(103,206,255,.58)';ctx.beginPath();ctx.arc(n.x,n.y,1.35,0,Math.PI*2);ctx.fill()});for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<135){ctx.strokeStyle=`rgba(65,158,255,${.16*(1-d/135)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}if(!reduce)requestAnimationFrame(draw)};draw();
  }

  const journeyLinks=[...document.querySelectorAll('#journeyNav a')];
  const sectionMap=journeyLinks.map(a=>({a,el:document.querySelector(a.getAttribute('href'))})).filter(x=>x.el);
  if('IntersectionObserver' in window){
    const activeObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){journeyLinks.forEach(a=>a.classList.remove('active'));sectionMap.find(x=>x.el===e.target)?.a.classList.add('active')}})},{rootMargin:'-25% 0px -60% 0px',threshold:.01});
    sectionMap.forEach(x=>activeObserver.observe(x.el));
  }

  const workflowData=[
    ['ЭТАП 1','Событие зарегистрировано','Новая информация фиксируется в системе и становится доступна участникам процесса в соответствии с их ролями.'],
    ['ЭТАП 2','Ответственный назначен','Система сохраняет ответственного, срок и приоритет, формируя понятную зону ответственности.'],
    ['ЭТАП 3','Работа выполняется','Руководитель видит текущее состояние процесса и может реагировать до возникновения критического отклонения.'],
    ['ЭТАП 4','Результат подтверждён','Фактический результат, документы и комментарии сохраняются в общей истории.'],
    ['ЭТАП 5','Показатели обновлены','Данные операции автоматически становятся частью аналитики, KPI и управленческой отчётности.']
  ];
  const result=document.getElementById('workflowResult');
  document.querySelectorAll('#workflowCompact button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('#workflowCompact button').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const d=workflowData[Number(btn.dataset.step)];result.innerHTML=`<span class="eyebrow">${d[0]}</span><h3>${d[1]}</h3><p>${d[2]}</p>`}));

  const lightbox=document.getElementById('lightboxDialog'),lightboxImage=document.getElementById('lightboxImage');
  document.querySelectorAll('[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{lightboxImage.src=btn.dataset.lightbox;lightbox.showModal()}));

  const contact=document.getElementById('contactDialog');
  document.querySelectorAll('[data-action="contact"]').forEach(btn=>btn.addEventListener('click',()=>contact.showModal()));
  document.querySelectorAll('dialog .dialog-close, dialog .dialog-ok').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('dialog[open]').forEach(d=>d.close())});
});
