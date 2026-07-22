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
  const drawChart=()=>{
    const chart=document.getElementById('slaChart');
    if(!chart)return;
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
    const r=document.querySelector('[data-kpi="requests"]');
    const o=document.querySelector('[data-kpi="online"]');
    const c=document.querySelector('[data-kpi="critical"]');
    if(r)r.textContent=requests;
    if(o)o.textContent=online;
    if(c)c.textContent=critical;
  },3800);

  // AI status
  const statuses=['Обрабатываются события компании…','Анализируется загрузка подразделений…','Проверяются риски нарушения SLA…','Формируются рекомендации руководителю…'];
  let si=0;setInterval(()=>{si=(si+1)%statuses.length;document.getElementById('aiStatus').textContent=statuses[si]},2600);


  // v0.6.1 — interactive request lifecycle
  const workflowData=[
    {
      title:'Заявка поступила',status:'НОВАЯ',
      cards:[
        ['Карточка обращения','Клиент сообщил о неисправности оборудования. ESMS зарегистрировала событие и присвоила уникальный номер.',[['Заявка','#ES-2148'],['Канал','Web / API'],['Приоритет','Обычный'],['SLA','4 часа']]],
        ['Автоматическая проверка','Система проверила клиента, объект, договор и доступный уровень обслуживания.',[['Клиент','Альфа Сервис'],['Объект','Москва · Север'],['Договор','Активен'],['Риск','Низкий']]]
      ],
      ai:'Отклонений не обнаружено. Заявка соответствует условиям договора.'
    },
    {
      title:'Менеджер подтвердил данные',status:'ПОДТВЕРЖДЕНА',
      cards:[
        ['Проверка менеджера','Уточнены описание проблемы, контактное лицо и доступ на объект.',[['Ответственный','Анна Орлова'],['Категория','Оборудование'],['Приоритет','Высокий'],['Срок','До 12:03']]],
        ['Следующее действие','Заявка передана в планирование и распределение ресурсов.',[['Очередь','Сервис'],['Регион','Север'],['Навыки','Уровень L2'],['Статус','Готова к назначению']]]
      ],
      ai:'Вероятность нарушения SLA — 6%. Рекомендуется назначить специалиста в течение 12 минут.'
    },
    {
      title:'ESMS рассчитала маршрут',status:'СПЛАНИРОВАНА',
      cards:[
        ['Оптимальный маршрут','Система сравнила местоположение, загрузку и компетенции доступных сотрудников.',[['Расстояние','18 км'],['ETA','35 минут'],['Экономия','14 км'],['Пробки','Средние']]],
        ['Планирование','Выбран маршрут с минимальным риском нарушения SLA.',[['Сектор','Север-2'],['Окно','08:07–08:42'],['Резерв','12 минут'],['Риск','4%']]]
      ],
      ai:'Оптимальный вариант найден. Ожидаемая экономия времени — 26 минут.'
    },
    {
      title:'Назначен специалист',status:'В ПУТИ',
      cards:[
        ['Исполнитель','Задача назначена специалисту с подходящими навыками и свободным временным окном.',[['Сотрудник','Иван Петров'],['Роль','Специалист'],['Рейтинг','4,9'],['Загрузка','72%']]],
        ['Контроль движения','ESMS отслеживает подтверждение, начало маршрута и расчётное время прибытия.',[['Статус','В пути'],['ETA','08:42'],['Связь','Онлайн'],['Отклонение','0 мин']]]
      ],
      ai:'Назначение оптимально. Резерв по SLA сохранён.'
    },
    {
      title:'Прибытие на объект',status:'НА ОБЪЕКТЕ',
      cards:[
        ['Факт прибытия','Время и геопозиция автоматически зафиксированы системой.',[['Прибыл','08:42'],['GPS','Подтверждён'],['Отклонение','0 мин'],['SLA','В норме']]],
        ['Начало работ','Специалист получил чек-лист, документы и историю объекта.',[['Чек-лист','12 пунктов'],['Документы','4 файла'],['История','7 работ'],['Риск','Низкий']]]
      ],
      ai:'Прибытие подтверждено. Прогноз завершения — 09:21.'
    },
    {
      title:'Фото «До»',status:'В РАБОТЕ',
      cards:[
        ['Фотофиксация','Состояние объекта зафиксировано до начала работ.',[['Фотографии','3'],['Время','08:45'],['GPS','Подтверждён'],['Качество','Достаточное']]],
        ['Диагностика','Специалист выбрал выявленную неисправность и способ устранения.',[['Причина','Износ узла'],['Решение','Замена'],['Материал','Доступен'],['Оценка','32 минуты']]]
      ],
      ai:'Фото соответствует требованиям. Повторная съёмка не требуется.'
    },
    {
      title:'Работа выполнена',status:'ВЫПОЛНЕНО',
      cards:[
        ['Результат работы','Чек-лист закрыт, использованные материалы и операции сохранены.',[['Выполнено','12 из 12'],['Материалы','2 позиции'],['Время работ','33 минуты'],['Отклонение','+1 мин']]],
        ['Контроль качества','Система проверила полноту обязательных данных перед закрытием.',[['Чек-лист','Полный'],['Фото','Есть'],['Комментарий','Есть'],['Ошибки','0']]]
      ],
      ai:'Работа выполнена в нормативе. Риск повторного обращения — низкий.'
    },
    {
      title:'Фото «После»',status:'ПРОВЕРКА',
      cards:[
        ['Подтверждение результата','Итоговое состояние объекта зафиксировано после выполнения работ.',[['Фотографии','4'],['Время','09:20'],['Сравнение','Пройдено'],['Качество','Высокое']]],
        ['Автопроверка','ESMS сопоставила фотографии «До» и «После» и проверила обязательные ракурсы.',[['Ракурсы','4 из 4'],['Различия','Подтверждены'],['Дубликаты','Нет'],['Статус','Принято']]]
      ],
      ai:'Результат подтверждён. Все обязательные фотографии получены.'
    },
    {
      title:'Клиент принял работу',status:'ПРИНЯТА',
      cards:[
        ['Подписание','Клиент ознакомился с результатом и подписал электронный акт.',[['Подпись','Получена'],['Время','09:22'],['Оценка','5 из 5'],['Комментарий','Без замечаний']]],
        ['Документы','Акт, фотографии и история действий сохранены в карточке заявки.',[['Акт','Сформирован'],['Архив','Создан'],['Уведомление','Отправлено'],['Заявка','Готова к закрытию']]]
      ],
      ai:'Клиент подтвердил качество. Дополнительных действий не требуется.'
    },
    {
      title:'Dashboard обновился',status:'ЗАКРЫТА',
      cards:[
        ['Автоматический пересчёт','После закрытия заявки система обновила операционные и управленческие показатели.',[['SLA','98,7%'],['Выполнено','+1'],['KPI сотрудника','+2,4'],['Выручка','Обновлена']]],
        ['Новый управленческий факт','Руководитель и владелец видят результат без подготовки ручного отчёта.',[['Dashboard','Обновлён'],['Отчёты','Синхронизированы'],['Аналитика','Пересчитана'],['Событие','Завершено']]]
      ],
      ai:'Заявка завершена успешно. Данные включены в аналитику подразделения.'
    }
  ];

  const workflowPreview=document.getElementById('workflowPreview');
  const workflowTitle=document.getElementById('workflowTitle');
  const workflowStatus=document.getElementById('workflowStatus');
  const workflowProgress=document.getElementById('workflowProgress');
  const workflowAi=document.querySelector('#workflowAi p');
  let workflowIndex=0;

  const renderWorkflow=index=>{
    workflowIndex=Math.max(0,Math.min(workflowData.length-1,index));
    const data=workflowData[workflowIndex];
    workflowTitle.textContent=data.title;
    workflowStatus.textContent=data.status;
    workflowProgress.textContent=`Этап ${workflowIndex+1} из ${workflowData.length}`;
    workflowAi.textContent=data.ai;
    workflowPreview.classList.remove('is-changing');
    void workflowPreview.offsetWidth;
    workflowPreview.classList.add('is-changing');
    workflowPreview.innerHTML=data.cards.map(([title,text,items])=>`
      <article class="workflow-card">
        <div class="workflow-card-head"><b>${title}</b><span class="workflow-status">${data.status}</span></div>
        <p>${text}</p>
        <div class="workflow-data-grid">
          ${items.map(([k,v])=>`<div class="workflow-data"><span>${k}</span><b>${v}</b></div>`).join('')}
        </div>
      </article>`).join('');
    document.querySelectorAll('.workflow-step').forEach((step,i)=>{
      step.classList.toggle('active',i===workflowIndex);
      step.classList.toggle('done',i<workflowIndex);
    });
    document.getElementById('workflowPrev').disabled=workflowIndex===0;
    document.getElementById('workflowNext').disabled=workflowIndex===workflowData.length-1;
  };
  renderWorkflow(0);
  document.querySelectorAll('.workflow-step').forEach(btn=>btn.addEventListener('click',()=>renderWorkflow(Number(btn.dataset.step))));
  document.getElementById('workflowPrev').addEventListener('click',()=>renderWorkflow(workflowIndex-1));
  document.getElementById('workflowNext').addEventListener('click',()=>renderWorkflow(workflowIndex+1));

  // Scroll-linked activation
  if('IntersectionObserver' in window && !reduce){
    const stepObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting)renderWorkflow(Number(entry.target.dataset.step));
      });
    },{rootMargin:'-42% 0px -42% 0px',threshold:0});
    document.querySelectorAll('.workflow-step').forEach(step=>stepObserver.observe(step));
  }

  // v0.6.1 — interactive dashboard views
  const dashboardViews={
    kpi:{
      title:'Ключевые показатели',
      subtitle:'Обновление данных в реальном времени',
      summaryTitle:'Операционная картина стабильна',
      summaryText:'ESMS контролирует сроки, загрузку сотрудников и отклонения по SLA.',
      html:`
        <div class="dashboard-kpis">
          <div class="kpi"><span>Заявки в работе</span><b data-kpi="requests">284</b><small>−12 за час</small></div>
          <div class="kpi"><span>SLA</span><b>98,7%</b><small>выше цели</small></div>
          <div class="kpi"><span>Сотрудники онлайн</span><b data-kpi="online">47</b><small>из 52</small></div>
          <div class="kpi alert"><span>Критические события</span><b data-kpi="critical">3</b><small>требуют внимания</small></div>
        </div>
        <div class="chart-card">
          <div class="chart-head"><strong>Динамика SLA и закрытых заявок</strong><span>Последние 12 часов</span></div>
          <canvas id="slaChart" aria-label="График SLA"></canvas>
        </div>`
    },
    requests:{
      title:'Очередь заявок',
      subtitle:'Приоритеты, сроки и ответственные',
      summaryTitle:'Две заявки требуют внимания',
      summaryText:'Система выделила заявки с минимальным резервом по SLA.',
      html:`
        <div class="requests-table">
          <div class="requests-row header"><span>Номер</span><span>Клиент / объект</span><span>Ответственный</span><span>Статус</span></div>
          <div class="requests-row"><b>#2148</b><span>Альфа Сервис · Север</span><span>Иван Петров</span><span class="badge green">В работе</span></div>
          <div class="requests-row"><b>#2147</b><span>Вектор · Центр</span><span>Анна Орлова</span><span class="badge yellow">Ожидает</span></div>
          <div class="requests-row"><b>#2146</b><span>Статус · Восток</span><span>Мария Климова</span><span class="badge red">Риск SLA</span></div>
          <div class="requests-row"><b>#2145</b><span>Горизонт · Юг</span><span>Сергей Волков</span><span class="badge green">Назначена</span></div>
          <div class="requests-row"><b>#2144</b><span>Профиль · Запад</span><span>Олег Смирнов</span><span class="badge green">Закрыта</span></div>
        </div>`
    },
    map:{
      title:'Карта объектов и маршрутов',
      subtitle:'Текущая загрузка и перемещения',
      summaryTitle:'Маршрут оптимизирован',
      summaryText:'Перестроение сократило общий пробег смены на 18 км.',
      html:`
        <div class="map-demo">
          <div class="map-route"></div>
          <span class="map-pin p1"></span><span class="map-pin p2"></span><span class="map-pin p3"></span>
          <div class="map-info"><b>Маршрут специалиста</b><span>3 объекта · 42 км · экономия 18 км</span></div>
        </div>`
    },
    people:{
      title:'Сотрудники и загрузка',
      subtitle:'Статусы, роли и текущие задачи',
      summaryTitle:'Доступно восемь специалистов',
      summaryText:'Распределение ресурсов соответствует текущему объёму заявок.',
      html:`
        <div class="people-grid">
          ${[
            ['ИП','Иван Петров','Специалист · В пути','Онлайн'],
            ['АО','Анна Орлова','Менеджер · Заявки','Онлайн'],
            ['МК','Мария Климова','Руководитель · Контроль','Онлайн'],
            ['СВ','Сергей Волков','Специалист · На объекте','Занят'],
            ['ОС','Олег Смирнов','Координатор · Планирование','Онлайн'],
            ['ЕЛ','Елена Лебедева','Аналитик · Отчёты','Онлайн']
          ].map(([a,b,c,d])=>`<article class="person-card"><span class="person-avatar">${a}</span><div><b>${b}</b><small>${c}</small></div><span class="person-state">${d}</span></article>`).join('')}
        </div>`
    },
    ai:{
      title:'Интеллектуальные рекомендации',
      subtitle:'Анализ отклонений и прогноз нагрузки',
      summaryTitle:'AI предлагает три действия',
      summaryText:'Рекомендации рассчитаны по текущей загрузке и истории выполнения.',
      html:`
        <div class="ai-dashboard">
          <div class="ai-score"><div><strong>87</strong><span>Индекс операционной устойчивости</span></div></div>
          <div class="ai-list-mini">
            <article class="ai-mini"><b>Перераспределить двух специалистов</b><p>Северный сектор перегружен на 18%. Ожидаемое улучшение SLA: +3,4%.</p></article>
            <article class="ai-mini"><b>Изменить порядок маршрута</b><p>Экономия пробега — 18 км, времени — 36 минут.</p></article>
            <article class="ai-mini"><b>Проверить повторные обращения</b><p>Выявлен рост по одной категории оборудования.</p></article>
          </div>
        </div>`
    }
  };

  const dashboardView=document.getElementById('dashboardView');
  let activeDashboardView='kpi';
  const renderDashboardView=view=>{
    activeDashboardView=view;
    const data=dashboardViews[view];
    document.getElementById('dashboardViewTitle').textContent=data.title;
    document.getElementById('dashboardViewSubtitle').textContent=data.subtitle;
    document.getElementById('sideSummaryTitle').textContent=data.summaryTitle;
    document.getElementById('sideSummaryText').textContent=data.summaryText;
    dashboardView.classList.remove('is-changing');
    void dashboardView.offsetWidth;
    dashboardView.classList.add('is-changing');
    dashboardView.innerHTML=data.html;
    document.querySelectorAll('[data-dashboard-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.dashboardView===view));
    renderFeed(view==='ai'?'ai':'events');
    if(view==='kpi')requestAnimationFrame(drawChart);
  };
  renderDashboardView('kpi');
  document.querySelectorAll('[data-dashboard-view]').forEach(btn=>btn.addEventListener('click',()=>renderDashboardView(btn.dataset.dashboardView)));

  // contact
  const dialog=document.getElementById('contactDialog');
  document.querySelectorAll('[data-action="contact"]').forEach(btn=>btn.addEventListener('click',()=>dialog.showModal()));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.dialog-ok').addEventListener('click',()=>dialog.close());
});
