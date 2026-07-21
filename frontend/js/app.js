document.addEventListener('DOMContentLoaded',()=>{
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // reveal
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}
    }),{threshold:.12});
    reveals.forEach(el=>io.observe(el));
  }else reveals.forEach(el=>el.classList.add('visible'));

  // smooth scroll buttons
  document.querySelectorAll('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:reduce?'auto':'smooth'});
  }));

  // network
  const canvas=document.getElementById('network'),ctx=canvas.getContext('2d');
  let nodes=[];
  const resize=()=>{
    const ratio=Math.max(1,devicePixelRatio||1),w=canvas.clientWidth,h=canvas.clientHeight;
    canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);
    nodes=Array.from({length:Math.min(64,Math.max(24,Math.floor(w/18)))},()=>({
      x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.17,vy:(Math.random()-.5)*.17
    }));
  };
  resize();addEventListener('resize',resize);
  const draw=()=>{
    const w=canvas.clientWidth,h=canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    nodes.forEach(n=>{
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<0||n.x>w)n.vx*=-1;if(n.y<0||n.y>h)n.vy*=-1;
      ctx.fillStyle='rgba(103,206,255,.58)';
      ctx.beginPath();ctx.arc(n.x,n.y,1.35,0,Math.PI*2);ctx.fill();
    });
    for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<135){ctx.strokeStyle=`rgba(65,158,255,${.16*(1-d/135)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    }
    if(!reduce)requestAnimationFrame(draw);
  };
  draw();

  // role experience
  const roles={
    owner:{
      title:'Рабочее пространство владельца',
      metrics:[['Выручка сегодня','4,8 млн ₽','+7,4%'],['Рентабельность','18,6%','выше плана'],['Риски','2','под контролем'],['SLA сети','98,7%','стабильно']],
      story:[['08:00','Получена общая картина компании'],['08:35','Выявлен риск снижения SLA'],['09:05','Открыт прогноз загрузки'],['09:20','Принято управленческое решение']]
    },
    manager:{
      title:'Рабочее пространство руководителя',
      metrics:[['Заявки','284','−12 за час'],['SLA','98,7%','выше цели'],['Онлайн','47','из 52'],['События','12 847','за сегодня']],
      story:[['08:00','Открыт оперативный Dashboard'],['08:14','Получено критическое событие'],['08:17','Скорректирован приоритет'],['09:26','KPI обновились автоматически']]
    },
    dispatcher:{
      title:'Рабочее пространство диспетчера',
      metrics:[['Очередь','37','активных'],['Свободны','8','инженеров'],['В пути','21','сотрудник'],['Просрочка','0','сегодня']],
      story:[['08:14','Поступила аварийная заявка'],['08:15','Определён ближайший инженер'],['08:17','Назначен маршрут'],['08:19','Выезд подтверждён']]
    },
    engineer:{
      title:'Рабочее пространство инженера',
      metrics:[['Заявки','7','на смену'],['Выполнено','3','сегодня'],['Пробег','42 км','по маршруту'],['Рейтинг','4,9','из 5']],
      story:[['08:19','Получена новая заявка'],['08:22','Маршрут построен'],['08:56','Прибытие подтверждено'],['09:24','Работа закрыта с фото и актом']]
    },
    analyst:{
      title:'Рабочее пространство аналитика',
      metrics:[['Отчёты','18','сформировано'],['Аномалии','4','обнаружено'],['Прогнозы','7','активных'],['Экспорт','3','сегодня']],
      story:[['08:00','Обновлены ночные данные'],['08:24','Найден повторяющийся тренд'],['08:42','Сформирована выборка причин'],['09:10','Рекомендация передана руководителю']]
    }
  };
  const renderRole=role=>{
    const d=roles[role];
    document.getElementById('roleTitle').textContent=d.title;
    document.getElementById('roleMetrics').innerHTML=d.metrics.map(([a,b,c])=>`<div class="demo-metric"><span>${a}</span><b>${b}</b><small>${c}</small></div>`).join('');
    document.getElementById('roleStory').innerHTML=d.story.map(([t,x])=>`<div class="demo-event"><time>${t}</time><p>${x}</p></div>`).join('');
  };
  renderRole('owner');
  document.querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-role]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');renderRole(btn.dataset.role);
  }));

  // dashboard feed
  const feeds={
    events:[
      ['✓','Заявка #2148 закрыта','Фото и акт добавлены в карточку объекта',''],
      ['!','SLA под контролем','По двум заявкам осталось менее 40 минут','warn'],
      ['↗','Маршрут перестроен','Planner сократил пробег смены на 18 км',''],
      ['AI','Найдено отклонение','Рост повторных обращений по одному типу оборудования','ai']
    ],
    ai:[
      ['AI','Перераспределить инженеров','Северный сектор перегружен на 18%','ai'],
      ['AI','Проверить повторные работы','Обнаружен устойчивый недельный тренд','ai'],
      ['AI','Усилить утреннюю смену','На завтра прогнозируется пик нагрузки','ai']
    ]
  };
  const feed=document.getElementById('feed');
  const renderFeed=name=>{
    feed.innerHTML=feeds[name].map(([i,t,p,c])=>`<article class="feed-item ${c}"><div class="feed-icon">${i}</div><div><b>${t}</b><p>${p}</p></div></article>`).join('');
  };
  renderFeed('events');
  document.querySelectorAll('[data-feed]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-feed]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');renderFeed(btn.dataset.feed);
  }));

  // chart
  const chart=document.getElementById('slaChart');
  const drawChart=()=>{
    const ratio=Math.max(1,devicePixelRatio||1),w=chart.clientWidth,h=chart.clientHeight;
    chart.width=w*ratio;chart.height=h*ratio;
    const c=chart.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,w,h);
    const data=[93.8,94.4,95.0,94.7,95.8,96.2,96.0,97.1,97.5,97.8,98.2,98.7],pad=24,min=92,max=100;
    c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;
    for(let i=0;i<5;i++){const y=pad+(h-pad*2)*(i/4);c.beginPath();c.moveTo(pad,y);c.lineTo(w-pad,y);c.stroke()}
    const grad=c.createLinearGradient(0,0,w,0);grad.addColorStop(0,'#37b7ff');grad.addColorStop(1,'#67e6ff');
    c.strokeStyle=grad;c.lineWidth=3;c.lineJoin='round';c.lineCap='round';c.beginPath();
    data.forEach((v,i)=>{const x=pad+(w-pad*2)*(i/(data.length-1)),y=pad+(h-pad*2)*(1-(v-min)/(max-min));i?c.lineTo(x,y):c.moveTo(x,y)});
    c.stroke();
  };
  drawChart();addEventListener('resize',drawChart);

  // live numbers
  let requests=284,online=47,critical=3;
  setInterval(()=>{
    requests=Math.max(260,requests+(Math.random()>.52?1:-1));
    online=Math.min(52,Math.max(43,online+(Math.random()>.72?1:Math.random()<.2?-1:0)));
    critical=Math.min(5,Math.max(1,critical+(Math.random()>.84?1:Math.random()<.22?-1:0)));
    document.querySelector('[data-kpi="requests"]').textContent=requests;
    document.querySelector('[data-kpi="online"]').textContent=online;
    document.querySelector('[data-kpi="critical"]').textContent=critical;
  },3800);

  // AI status
  const statuses=['Обрабатываются события компании…','Анализируется загрузка подразделений…','Проверяются риски нарушения SLA…','Формируются рекомендации руководителю…'];
  let si=0;setInterval(()=>{si=(si+1)%statuses.length;document.getElementById('aiStatus').textContent=statuses[si]},2600);

  // contact
  const dialog=document.getElementById('contactDialog');
  document.querySelectorAll('[data-action="contact"]').forEach(btn=>btn.addEventListener('click',()=>dialog.showModal()));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.dialog-ok').addEventListener('click',()=>dialog.close());
});
