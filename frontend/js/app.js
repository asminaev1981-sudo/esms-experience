document.addEventListener('DOMContentLoaded',()=>{
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Counters
  document.querySelectorAll('[data-counter]').forEach(el=>{
    const target=Number(el.dataset.counter);
    const duration=reduceMotion?0:1400;
    const start=performance.now();
    const tick=now=>{
      const p=duration===0?1:Math.min((now-start)/duration,1);
      const v=Math.floor(target*(1-Math.pow(1-p,3)));
      el.textContent=target===968?(v/10).toFixed(1):v.toLocaleString('ru-RU');
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // Reveal
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduceMotion){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },{threshold:.12});
    reveals.forEach(el=>io.observe(el));
  }else{
    reveals.forEach(el=>el.classList.add('visible'));
  }

  // Animated network
  const canvas=document.getElementById('network');
  const ctx=canvas.getContext('2d');
  let nodes=[];
  const resizeNetwork=()=>{
    const ratio=Math.max(1,window.devicePixelRatio||1);
    const width=canvas.clientWidth;
    const height=canvas.clientHeight;
    canvas.width=width*ratio;
    canvas.height=height*ratio;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    nodes=Array.from({length:Math.min(62,Math.max(24,Math.floor(width/18)))},()=>({
      x:Math.random()*width,y:Math.random()*height,
      vx:(Math.random()-.5)*.17,vy:(Math.random()-.5)*.17
    }));
  };
  resizeNetwork();
  addEventListener('resize',resizeNetwork);
  const drawNetwork=()=>{
    const width=canvas.clientWidth,height=canvas.clientHeight;
    ctx.clearRect(0,0,width,height);
    nodes.forEach(n=>{
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<0||n.x>width)n.vx*=-1;
      if(n.y<0||n.y>height)n.vy*=-1;
      ctx.fillStyle='rgba(103,206,255,.58)';
      ctx.beginPath();ctx.arc(n.x,n.y,1.35,0,Math.PI*2);ctx.fill();
    });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<135){
          ctx.strokeStyle=`rgba(65,158,255,${.16*(1-d/135)})`;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }
    if(!reduceMotion)requestAnimationFrame(drawNetwork);
  };
  drawNetwork();

  // Chart
  const chart=document.getElementById('slaChart');
  const drawChart=()=>{
    const ratio=Math.max(1,window.devicePixelRatio||1);
    const width=chart.clientWidth,height=chart.clientHeight;
    chart.width=width*ratio;chart.height=height*ratio;
    const c=chart.getContext('2d');c.setTransform(ratio,0,0,ratio,0,0);
    c.clearRect(0,0,width,height);
    const data=[93.8,94.4,95.0,94.7,95.8,96.2,96.0,97.1,97.5,97.8,98.2,98.7];
    const pad=24,min=92,max=100;
    c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;
    for(let i=0;i<5;i++){
      const y=pad+(height-pad*2)*(i/4);
      c.beginPath();c.moveTo(pad,y);c.lineTo(width-pad,y);c.stroke();
    }
    const grad=c.createLinearGradient(0,0,width,0);
    grad.addColorStop(0,'#38b6ff');grad.addColorStop(1,'#53e2ff');
    c.strokeStyle=grad;c.lineWidth=3;c.lineJoin='round';c.lineCap='round';
    c.beginPath();
    data.forEach((v,i)=>{
      const x=pad+(width-pad*2)*(i/(data.length-1));
      const y=pad+(height-pad*2)*(1-(v-min)/(max-min));
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    });
    c.stroke();
    data.forEach((v,i)=>{
      const x=pad+(width-pad*2)*(i/(data.length-1));
      const y=pad+(height-pad*2)*(1-(v-min)/(max-min));
      c.fillStyle='#07111f';c.strokeStyle='#53e2ff';c.lineWidth=2;
      c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill();c.stroke();
    });
  };
  drawChart();addEventListener('resize',drawChart);

  // Command Center feed
  const eventFeed=[
    {icon:'✓',title:'Заявка #2148 закрыта',text:'Фото и акт автоматически добавлены в карточку объекта.'},
    {icon:'!',title:'SLA под контролем',text:'По двум заявкам осталось менее 40 минут.',alert:true},
    {icon:'↗',title:'Маршрут перестроен',text:'Planner сократил пробег смены на 18 км.'},
    {icon:'AI',title:'Найдено отклонение',text:'Рост повторных обращений по одному типу оборудования.',ai:true}
  ];
  const aiFeed=[
    {icon:'AI',title:'Перераспределить инженеров',text:'Северный сектор перегружен на 18%.',ai:true},
    {icon:'AI',title:'Проверить повторные работы',text:'Обнаружен устойчивый недельный тренд.',ai:true},
    {icon:'AI',title:'Усилить утреннюю смену',text:'На завтра прогнозируется пик нагрузки.',ai:true}
  ];
  const feed=document.getElementById('activityFeed');
  const renderFeed=items=>{
    feed.innerHTML=items.map(item=>`
      <article class="activity-item ${item.alert?'alert':''} ${item.ai?'ai':''}">
        <div class="activity-icon">${item.icon}</div>
        <div><b>${item.title}</b><p>${item.text}</p></div>
      </article>`).join('');
  };
  renderFeed(eventFeed);
  document.querySelectorAll('[data-feed]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-feed]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderFeed(btn.dataset.feed==='ai'?aiFeed:eventFeed);
    });
  });

  // Live KPI simulation
  let requests=284,online=47,critical=3;
  setInterval(()=>{
    requests=Math.max(260,requests+(Math.random()>.52?1:-1));
    online=Math.min(52,Math.max(43,online+(Math.random()>.72?1:Math.random()<.2?-1:0)));
    critical=Math.min(5,Math.max(1,critical+(Math.random()>.82?1:Math.random()<.22?-1:0)));
    document.querySelector('[data-live-kpi="requests"]').textContent=requests;
    document.querySelector('[data-live-kpi="online"]').textContent=online;
    document.querySelector('[data-live-kpi="critical"]').textContent=critical;
  },3800);

  // AI status rotation
  const aiStatuses=[
    'Обрабатываются события компании…',
    'Анализируется загрузка подразделений…',
    'Проверяются риски нарушения SLA…',
    'Формируются управленческие рекомендации…'
  ];
  let aiIndex=0;
  setInterval(()=>{
    aiIndex=(aiIndex+1)%aiStatuses.length;
    document.getElementById('aiStatus').textContent=aiStatuses[aiIndex];
  },2600);

  // Experience modal
  const overlay=document.getElementById('experienceOverlay');
  const roleData={
    owner:{
      heading:'Рабочий день владельца бизнеса',
      story:[['08:00','Получена общая картина компании'],['08:35','Выявлен риск снижения SLA'],['09:05','Открыт прогноз загрузки'],['09:20','Принято управленческое решение']],
      metrics:[['Выручка сегодня','4,8 млн ₽'],['Рентабельность','18,6%'],['Риски','2'],['SLA сети','98,7%']]
    },
    manager:{
      heading:'Рабочий день руководителя',
      story:[['08:00','Открыт оперативный Dashboard'],['08:14','Получено критическое событие'],['08:17','Скорректирован приоритет'],['09:26','KPI обновились автоматически']],
      metrics:[['Заявки','284'],['SLA','98,7%'],['Онлайн','47'],['События','12 847']]
    },
    dispatcher:{
      heading:'Рабочий день диспетчера',
      story:[['08:14','Поступила аварийная заявка'],['08:15','Определён ближайший инженер'],['08:17','Назначен маршрут'],['08:19','Выезд подтверждён']],
      metrics:[['Очередь','37'],['Свободны','8'],['В пути','21'],['Просрочка','0']]
    },
    engineer:{
      heading:'Рабочий день инженера',
      story:[['08:19','Получена новая заявка'],['08:22','Маршрут построен'],['08:56','Прибытие подтверждено'],['09:24','Работа закрыта']],
      metrics:[['Заявки','7'],['Выполнено','3'],['Пробег','42 км'],['Рейтинг','4,9']]
    },
    analyst:{
      heading:'Рабочий день аналитика',
      story:[['08:00','Обновлены ночные данные'],['08:24','Найден повторяющийся тренд'],['08:42','Сформирована выборка причин'],['09:10','Рекомендация передана руководителю']],
      metrics:[['Отчёты','18'],['Аномалии','4'],['Прогнозы','7'],['Экспорт','3']]
    }
  };
  const renderRole=role=>{
    const data=roleData[role];
    document.getElementById('roleHeading').textContent=data.heading;
    document.getElementById('storyList').innerHTML=data.story.map(([time,text])=>`<div class="story-item"><b>${time}</b>${text}</div>`).join('');
    document.getElementById('miniDashboard').innerHTML=data.metrics.map(([name,value])=>`<div class="mini-metric"><span>${name}</span><b>${value}</b></div>`).join('');
  };
  renderRole('manager');
  const openExperience=()=>{
    overlay.hidden=false;
    document.body.classList.add('experience-open');
  };
  const closeExperience=()=>{
    overlay.hidden=true;
    document.body.classList.remove('experience-open');
  };
  document.getElementById('startExperience').addEventListener('click',openExperience);
  document.querySelectorAll('[data-open-experience]').forEach(btn=>btn.addEventListener('click',openExperience));
  document.getElementById('closeExperience').addEventListener('click',closeExperience);
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeExperience()});
  addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden)closeExperience()});
  document.querySelectorAll('[data-role]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-role]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderRole(btn.dataset.role);
    });
  });

  // Contact dialog
  const dialog=document.getElementById('contactDialog');
  document.querySelectorAll('[data-action="contact"]').forEach(btn=>btn.addEventListener('click',()=>dialog.showModal()));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.dialog-ok').addEventListener('click',()=>dialog.close());
});
