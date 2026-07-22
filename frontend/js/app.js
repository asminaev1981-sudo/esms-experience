document.addEventListener('DOMContentLoaded',()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const reveals=document.querySelectorAll('.reveal');
 if('IntersectionObserver'in window&&!reduce){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});reveals.forEach(e=>io.observe(e))}else reveals.forEach(e=>e.classList.add('visible'));
 const canvas=document.getElementById('network'),ctx=canvas.getContext('2d');let nodes=[];
 function resize(){const r=Math.max(1,devicePixelRatio||1),w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*r;canvas.height=h*r;ctx.setTransform(r,0,0,r,0,0);nodes=Array.from({length:Math.min(60,Math.max(24,Math.floor(w/20)))},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16}))}resize();addEventListener('resize',resize);
 function draw(){const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);nodes.forEach(n=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;ctx.fillStyle='rgba(103,206,255,.55)';ctx.beginPath();ctx.arc(n.x,n.y,1.3,0,Math.PI*2);ctx.fill()});for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<130){ctx.strokeStyle=`rgba(65,158,255,${.15*(1-d/130)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}if(!reduce)requestAnimationFrame(draw)}draw();
 const data=[
 {title:'Создана задача',status:'НОВАЯ',text:'Событие зарегистрировано. Система создала карточку процесса и зафиксировала исходные данные.',items:[['Номер','#ES-2148'],['Источник','Web / API'],['Приоритет','Обычный'],['Срок','Сегодня']]},
 {title:'Менеджер уточнил данные',status:'ПОДТВЕРЖДЕНА',text:'Ответственный проверил информацию, определил приоритет и ожидаемый результат.',items:[['Ответственный','Анна Орлова'],['Приоритет','Высокий'],['Категория','Операционная'],['Контроль','Включён']]},
 {title:'Назначен специалист',status:'НАЗНАЧЕНА',text:'Система сохранила ответственность, сроки и все необходимые материалы для выполнения.',items:[['Сотрудник','Иван Петров'],['Роль','Специалист'],['Срок','09:30'],['Статус','Принято']]},
 {title:'Работа начата',status:'В РАБОТЕ',text:'Статус изменился в реальном времени. Руководитель видит текущий этап без звонков и уточнений.',items:[['Начало','08:42'],['Прогресс','45%'],['Отклонение','0 мин'],['Риск','Низкий']]},
 {title:'Результат подтверждён',status:'ПРОВЕРКА',text:'Результат, комментарии и документы сохранены в единой истории процесса.',items:[['Чек-лист','Выполнен'],['Документы','4 файла'],['Комментарий','Добавлен'],['Ошибки','0']]},
 {title:'Показатели обновлены',status:'ЗАВЕРШЕНА',text:'KPI, отчётность и показатели подразделения пересчитаны автоматически.',items:[['SLA','98,7%'],['Выполнено','+1'],['KPI','Обновлён'],['Отчёт','Готов']]}
 ];let idx=0;const preview=document.getElementById('workflowPreview');
 function render(i){idx=Math.max(0,Math.min(data.length-1,i));const d=data[idx];document.getElementById('workflowTitle').textContent=d.title;document.getElementById('workflowStatus').textContent=d.status;document.getElementById('workflowProgress').textContent=`Этап ${idx+1} из ${data.length}`;preview.innerHTML=`<article class="workflow-card"><p>${d.text}</p><div class="workflow-data-grid">${d.items.map(([k,v])=>`<div class="workflow-data"><span>${k}</span><b>${v}</b></div>`).join('')}</div></article>`;document.querySelectorAll('.workflow-step').forEach((s,n)=>{s.classList.toggle('active',n===idx);s.classList.toggle('done',n<idx)});document.getElementById('workflowPrev').disabled=idx===0;document.getElementById('workflowNext').disabled=idx===data.length-1}
 render(0);document.querySelectorAll('.workflow-step').forEach(b=>b.onclick=()=>render(+b.dataset.step));document.getElementById('workflowPrev').onclick=()=>render(idx-1);document.getElementById('workflowNext').onclick=()=>render(idx+1);

 const screenDialog=document.getElementById('screenDialog'),screenDialogImage=document.getElementById('screenDialogImage');
 document.querySelectorAll('[data-lightbox]').forEach(btn=>btn.addEventListener('click',()=>{screenDialogImage.src=btn.dataset.lightbox;screenDialog.showModal()}));
 screenDialog.querySelector('.screen-dialog-close').addEventListener('click',()=>screenDialog.close());
 screenDialog.addEventListener('click',e=>{if(e.target===screenDialog)screenDialog.close()});

 const menuToggle=document.getElementById('menuToggle'),mainNav=document.getElementById('mainNav');
 if(menuToggle&&mainNav){
  menuToggle.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuToggle.classList.toggle('active',open);menuToggle.setAttribute('aria-expanded',String(open))});
  mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('open');menuToggle.classList.remove('active');menuToggle.setAttribute('aria-expanded','false')}));
 }
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(screenDialog?.open)screenDialog.close();mainNav?.classList.remove('open');menuToggle?.classList.remove('active')}});

});