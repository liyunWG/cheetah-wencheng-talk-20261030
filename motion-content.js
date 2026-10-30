/* Visual upgrade only; the A→B→C→D→E→R2 sequence is retained. */
(() => {
  const {slides,helpers}=window.CHEETAH;
  const get=id=>slides.find(s=>s.id===id);
  const head=(en,title,description='')=>`<div class="scene-heading"><span class="eyebrow">${en}</span><h1>${title}</h1>${description?`<p class="lead">${description}</p>`:''}</div>`;
  const chart=type=>window.CheetahCharts?.render(type)||`<div class="chart-fallback">圖表載入中</div>`;
  const a4=get('A-04');
  a4.html=head('A / THE CHANGING MIDDLE','M 型分布','教育，能為孩子打開什麼可能？')+`<div class="distribution-stage">${chart('m-distribution')}</div>`;
  a4.visualType='motion-chart';a4.motionDuration=7200;

  const b1=get('B-01');
  b1.html=head('B / STUDENTS & THEIR JOURNEYS','升學榜單<span class="gold">・國內</span>','人才培育計畫 → 科學班 → 頂大')+`<div class="admission-layout"><div class="admission-chart">${chart('science-admission')}</div><div class="student-timeline"><article class="beat" data-beat="1"><span>01</span><div><h2>張偉成</h2>${helpers.missing('學習經歷與照片待確認')}</div></article><article class="beat" data-beat="2"><span>02</span><div><h2>潘軒</h2><p class="gold">臺大電機 → 臺大電子所</p><small>2023/09/01 官網記錄：碩一</small><button class="text-button" data-image="assets/posters/cheetah-elite-88-body-1.png" data-caption="潘軒與老師合照・2023">查看原圖 ↗</button></div></article><article class="beat" data-beat="3"><span>03</span><div><h2>江光謙</h2>${helpers.missing('學習經歷與照片待確認')}</div></article></div></div>`;
  b1.motionDuration=8000;

  const a8=get('A-08');
  const oldNews=a8.html.match(/<article class="sequence-panel" data-panel="4">[\s\S]*?<\/article>/)?.[0]||'';
  const pairs=[
    ['calculator-abacus','手持計算機','打算盤','01 / TOOLS'],
    ['calculator-computer','計算機','電腦','02 / FROM TOOLS TO POSSIBILITY'],
    ['ai-studying','AI 時代','學生刷題','03 / THINKING IN A NEW ERA'],
    ['autonomous-driving','無人車','駕訓班學開車','04 / THE FUTURE IS HERE']
  ];
  a8.html=head('A / LEARNING IN AN AI WORLD','時代改變，<span class="gold">學習也需要前瞻。</span>')+`<div class="cinema-sequence panel-sequence">${pairs.map(([file,left,right,kicker],i)=>`<article class="sequence-panel cinema-comparison" data-panel="${i+1}"><img class="cinema-art" data-src="assets/artwork/${file}.webp" alt="${left}與${right}的原創3D情境插畫" decoding="async"><div class="cinema-shade"></div><div class="cinema-kicker">${kicker}</div><div class="cinema-labels"><h2>${left}</h2><span class="cinema-vs">VS</span><h2>${right}</h2></div><small class="illustration-label">原創 AI 情境插畫</small></article>`).join('')}${oldNews.replace('data-panel="4"','data-panel="5"')}</div><div class="cinema-chapters">${['計算機／算盤','計算機／電腦','AI／刷題','無人車／駕訓','人才結構'].map((t,i)=>`<button data-motion-panel="${i+1}"><span>0${i+1}</span>${t}</button>`).join('')}</div>`;
  a8.beats=5;a8.motionHold=9000;a8.assetIds.push(...pairs.map(x=>x[0]));
  a8.originalBullet+='；依使用者補充加入「計算機 vs 電腦」對比。';

  for(const [id,number,title] of [['R2-03','01','開關題'],['R2-04','02','三視圖']]){
    const s=get(id);s.title=`奇幻之旅：${title}【第${number==='01'?'一':'二'}關】`;
    s.html=head(`REPORT TWO / THE FANTASTIC JOURNEY · ${number}`,`${number==='01'?'第一關':'第二關'}<span class="gold">・${title}</span>`)+`<div class="journey-picture-slot" data-interactive><div class="journey-empty"><span class="journey-corner tl"></span><span class="journey-corner tr"></span><span class="journey-corner bl"></span><span class="journey-corner br"></span><div class="journey-emblem">◇</div><h2>獵豹奇幻之旅</h2><p>放入一張圖片，開啟數學的奇幻旅程。</p></div><img class="journey-picture" alt="獵豹奇幻之旅" hidden><button class="journey-remove-button outline-button" data-journey-remove hidden>移除圖片</button><button class="journey-upload-button outline-button" data-journey-upload>＋ 放入／更換圖片</button></div>`;
    s.controlMode='picture';s.visualType='journey-picture';s.assetIds=['fantasy-journey-picture'];s.motionDuration=4500;
    s.originalBullet=`${title}標題與獵豹奇幻之旅圖片位置；依使用者最新指示，現場另開 App 操作。`;
    s.fallback='未放入圖片時顯示圖片位置；不載入互動遊戲。';
  }
  const e4=get('E-04');
  const dots=n=>`<span class="pip-grid pip-${n}">${Array.from({length:n},()=>'<i></i>').join('')}</span>`;
  const dice=`<div class="die-stage" aria-label="公平骰子教學示意"><div class="die-shadow"></div><div class="die-cube">${[1,6,2,5,3,4].map((n,i)=>`<div class="die-face face-${i}">${dots(n)}</div>`).join('')}</div><div class="die-orbit"></div><span class="illustration-label">公平骰子・機率教學示意</span></div>`;
  e4.html=e4.html.replace(/<div class="dice-art">[\s\S]*?<\/div><div>/,dice+'<div>');
  for(const scene of slides){scene.motionHold ||= scene.controlMode==='gallery'?7500:scene.visualType==='contest-gallery'?6500:9500;}
})();
