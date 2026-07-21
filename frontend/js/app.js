document.addEventListener('DOMContentLoaded',()=>{
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-counter]').forEach(el=>{
    const target=Number(el.dataset.counter);const duration=reduceMotion?0:1300;const start=performance.now();
    const tick=now=>{const p=duration===0?1:Math.min((now-start)/duration,1);const v=Math.floor(target*(1-Math.pow(1-p,3)));el.textContent=target===968?(v/10).toFixed(1):v.toLocaleString('ru-RU');if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)
  });

  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver'in window&&!reduceMotion){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});reveals.forEach(el=>io.observe(el))}else reveals.forEach(el=>el.classList.add('visible'));

  const experience=document.getElementById('experience');
  document.getElementById('startExperience').addEventListener('click',()=>experience.scrollIntoView({behavior:reduceMotion?'auto':'smooth'}));

  const roleData={
    owner:{title:'Владелец бизнеса',events:[['08:00','Компания начала рабочий день'],['08:12','Получены первые показатели подразделений'],['09:05','Выявлено отклонение по SLA'],['09:08','Назначено корректирующее действие']]},
    manager:{title:'Руководитель',events:[['08:00','Открыт оперативный Dashboard'],['08:05','Проверена загрузка инженеров'],['08:18','Скорректирован приоритет заявок'],['09:26','KPI обновились автоматически']]},
    dispatcher:{title:'Диспетчер',events:[['08:00','Поступила аварийная заявка'],['08:02','Определён ближайший инженер'],['08:04','Назначен маршрут и срок'],['08:06','Инженер подтвердил выезд']]},
    engineer:{title:'Инженер',events:[['08:06','Получена новая заявка'],['08:10','Маршрут построен'],['08:42','Прибытие подтверждено'],['09:24','Работа закрыта с фото и актом']]},
    analyst:{title:'Аналитик',events:[['08:00','Обновлены ночные данные'],['08:20','Найден тренд роста повторных работ'],['08:40','Сформирована выборка причин'],['09:10','Рекомендация передана руководителю']]}
  };
  const panel=document.getElementById('experiencePanel'),timeline=document.getElementById('timeline'),roleTitle=document.getElementById('roleTitle');
  document.querySelectorAll('.role-card').forEach(card=>card.addEventListener('click',()=>{const data=roleData[card.dataset.role];roleTitle.textContent=data.title;timeline.innerHTML=data.events.map(([time,text])=>`<div><b>${time}</b><span>${text}</span></div>`).join('');panel.hidden=false;panel.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'nearest'})}));
  document.getElementById('closeExperience').addEventListener('click',()=>{panel.hidden=true;document.getElementById('roleGrid').scrollIntoView({behavior:reduceMotion?'auto':'smooth'})});

  const dialog=document.getElementById('contactDialog');
  document.querySelectorAll('[data-action="contact"]').forEach(btn=>btn.addEventListener('click',()=>dialog.showModal()));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.dialog-ok').addEventListener('click',()=>dialog.close());

  const canvas=document.getElementById('network'),ctx=canvas.getContext('2d');let nodes=[];
  const resize=()=>{canvas.width=canvas.clientWidth*devicePixelRatio;canvas.height=canvas.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);nodes=Array.from({length:Math.min(58,Math.floor(canvas.clientWidth/18))},()=>({x:Math.random()*canvas.clientWidth,y:Math.random()*canvas.clientHeight,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16}))};resize();addEventListener('resize',resize);
  const draw=()=>{ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);for(const n of nodes){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>canvas.clientWidth)n.vx*=-1;if(n.y<0||n.y>canvas.clientHeight)n.vy*=-1;ctx.fillStyle='rgba(96,188,255,.55)';ctx.beginPath();ctx.arc(n.x,n.y,1.4,0,Math.PI*2);ctx.fill()}for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<130){ctx.strokeStyle=`rgba(58,157,255,${.13*(1-d/130)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}if(!reduceMotion)requestAnimationFrame(draw)};draw();
});
