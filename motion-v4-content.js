/* Speaker's second revision: independent poster pages and shared cinematic controls. */
(() => {
  const {slides}=window.CHEETAH;
  const get=id=>slides.find(s=>s.id===id);
  const safe=x=>String(x).replace(/<[^>]*>/g,' ').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const image=(file,label,cls='')=>`<button class="revision-photo fx-entrance ${cls}" data-image="${file}" data-caption="${safe(label)}" aria-label="放大：${safe(label)}"><img data-src="${file}" alt="${safe(label)}" decoding="async"><span class="poster-glint" aria-hidden="true"></span></button>`;
  const local=(file,label,cls='')=>image('assets/motion-v4/'+file,label,cls);
  const title=text=>`<h1 class="v4-title">${text}</h1>`;
  const atlas=(file,count,index,label)=>`<div class="v4-icon fx-entrance" role="img" aria-label="${label}"><div class="atlas-cell" style="--cell-ratio:${count===4?.75:1}"><img data-src="assets/motion-v4/${file}" alt="" style="width:${count*100}%;left:${-index*100}%"></div></div>`;
  const set=(id,heading,html,extra={})=>Object.assign(get(id),{title:heading,html,beats:1,controlMode:'beats',visualType:'revision',motionDuration:4800,...extra});
  const fixedImage=(id,heading,file)=>set(id,heading,`<div class="visual-surface v4-photo-page">${title(heading)}${local(file,heading)}</div>`);

  const us=get('A-03'),west=['California','Oregon','Washington'],rust=['Wisconsin','Illinois','Indiana','Michigan','Ohio','Pennsylvania','New York','West Virginia'];
  us.html=us.html.replace(/(<path class="state-area" d="[^"]+" fill=")[^"]+("\s*>\s*<title>)([^<]+)(<\/title>)/g,(_m,a,b,name,c)=>a+(west.includes(name)?'#076d87':rust.includes(name)?'#727980':'#273949')+b+name+c).replaceAll('stroke="#e8f2f5" stroke-opacity=".7"','stroke="#8495a2" stroke-opacity=".25"');
  us.html=us.html.replace('</defs>','<filter id="west-neon" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><filter id="east-neon" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>');
  const coast=window.US_STATES.filter(s=>west.includes(s.name)).map(s=>`<path class="coast-glow west-glow coast-halo" d="${s.d}"/><path class="coast-tracer west-tracer" pathLength="1000" d="${s.d}"/>`).join('');
  const fx=(-74.4+125)/59*1600,fy=(50.5-40.8)/26.5*700;
  us.html=us.html.replace('<g class="map-city-labels">',`<g class="coast-effects">${coast}<ellipse class="coast-glow east-glow coast-halo" cx="${fx}" cy="${fy}" rx="61" ry="66"/><ellipse class="coast-tracer east-tracer" pathLength="1000" cx="${fx}" cy="${fy}" rx="61" ry="66"/></g><g class="map-city-labels">`);
  us.ambientLoop=true;us.motionDuration=3600;

  // Fix malformed attributes from the previous card's HTML title.
  set('A-05-01','買進名校：美國大學舞弊風暴',`<div class="visual-surface evidence-layout v4-film"><div class="evidence-copy">${title('買進名校<br><span class="gold">美國大學舞弊風暴</span>')}<p>Netflix 紀錄片｜2021</p></div>${image('assets/revision/netflix.jpg','買進名校・美國大學舞弊風暴','evidence-image')}</div>`);

  // Every bar and numeric value is driven by the same seekable timeline.
  for(const id of ['A-05-03','A-05-04']) {
    const s=get(id);
    s.html=s.html.replace(/<b>([\d.]+)([^<]*)<\/b>/g,(_m,n,suffix)=>`<b><span data-count="${n}" data-decimals="${n.includes('.')?n.split('.')[1].length:0}">${n}</span>${suffix}</b>`);
    s.html=s.html.replace('<strong>15<span>位</span></strong>','<strong><span data-count="15">15</span><span>位</span></strong>');
    s.html=s.html.replaceAll('class="revision-photo','class="revision-photo fx-entrance');
    s.motionDuration=4800;
  }
  get('A-05-03').html=get('A-05-03').html.replaceAll('assets/revision/wego.jpg','assets/motion-v4/wego-news.jpg').replaceAll('薇閣官方115年升學成果','薇閣升學新聞原圖・Yahoo新聞／上報');
  get('A-07-01').html=get('A-07-01').html.replaceAll('class="revision-photo','class="revision-photo fx-entrance spectacular');get('A-07-01').motionDuration=5200;
  get('A-08-01').html=get('A-08-01').html.replace('assets/artwork/calculator-abacus.webp','assets/motion-v4/calculator-glow.webp');
  slides.splice(slides.findIndex(s=>s.id==='A-08-02'),1);
  get('A-08-05').html=get('A-08-05').html.replaceAll('<article>','<article class="fx-entrance news-entrance">');get('A-08-05').motionDuration=5000;

  const honors=window.CHEETAH_HONORS;
  const science=honors.filter(x=>/科學班/.test(x.title)&&x.id!=='h049');
  set('B-01','升學榜單・國內',`<div class="visual-surface domestic-results v4-domestic"><div class="student-identity">${image('assets/彥丞與瑋宸.jpg','彥丞與瑋宸合照')}<div class="corrected-names"><h2>張瑋宸</h2><h2>潘軒</h2><h2>姜光謙</h2></div></div><div class="science-gallery">${science.map(x=>`<article class="fx-entrance">${image(x.file,x.title)}<h3>${x.title}</h3></article>`).join('')}</div></div>`,{motionDuration:5200});

  // B-03 is now the tower alone, followed by independent, full-resolution poster spreads.
  const base=get('B-03');
  set('B-03','競賽寶塔',`<div class="visual-surface v4-photo-page v4-tower">${title('競賽寶塔')}${image('assets/competition_tower_original.jpeg','競賽寶塔完整原圖')}</div>`);
  const byId=id=>{const x=honors.find(x=>x.id===id);if(!x)throw Error('Missing honor '+id);return x;};
  const nanshan={title:'2026 南山小奧／新加坡國際賽',file:'assets/motion-v4/nanshan-2026.png'};
  const groups=[
    ['南山小奧・國際小學競賽',[nanshan,byId('h091')]],
    ['九章・IMAS',['h013','h093','h101','h110'].map(byId)],
    ['IJSO・歷年得獎海報',['h083','h032','h008'].map(byId)],
    ['APX・數理挑戰',['h021','h095'].map(byId)],
    ['EGMO・歐洲女子數學奧林匹亞',['h010','h033'].map(byId)],
    ['AMC・AIME・歷年成果',['h003','h006','h014','h015','h016','h026','h041','h055','h077','h080','h108','h132'].map(byId)],
    ['APhO・IPhO・物理奧林匹亞',['h037','h009'].map(byId)],
    ['IMO・國際競賽成果',['h001','h011'].map(byId)]
  ];
  let n=0;const spreads=[];
  for(const [heading,items] of groups){const step=heading.startsWith('IJSO')?3:2;for(let start=0;start<items.length;start+=step){const batch=items.slice(start,start+step);n++;spreads.push({...base,id:'B-03-'+String(n).padStart(2,'0'),title:heading+(items.length>step?'・'+(start/step+1):''),html:`<div class="visual-surface v4-poster-spread columns-${batch.length}">${batch.map(x=>`<article>${image(x.file,x.title,'spectacular')}<h2>${x.title}</h2></article>`).join('')}</div>`,beats:1,controlMode:'beats',visualType:'revision',motionDuration:4800});}}
  slides.splice(slides.findIndex(s=>s.id==='B-03')+1,0,...spreads);

  set('B-04','讓能力，跨越學科邊界',`<div class="visual-surface v4-subjects">${title('讓能力，<span class="gold">跨越學科邊界。</span>')}<div class="v4-card-grid three"><article class="fx-entrance">${local('ggb-screen.jpg','GeoGebra 真實3D幾何操作畫面')}<h2>GGB</h2><p>電腦與數學結合<br>把抽象幾何變成可操作的探索</p></article><article class="fx-entrance">${atlas('literacy-art.webp',2,0,'語文、閱讀與AI協作')}<h2>語文</h2><p>吸收新知・表達溝通<br>與 AI 協作</p></article><article class="fx-entrance">${atlas('literacy-art.webp',2,1,'自然科學與分析思考')}<h2>自然</h2><p>自然科學基礎與分析能力<br>銜接科學班／頂大醫學電資</p></article></div></div>`);
  set('C-03','以目標，連結學習方向',`<div class="visual-surface v4-subjects">${title('以目標，<span class="gold">連結學習方向。</span>')}<div class="v4-card-grid four">${[['人才培育計畫','拓展學術探索'],['科學班','深化數理思考'],['數資班','累積資優能力'],['頂大二階筆試','整合知識與表達']].map(([heading,desc],i)=>`<article class="fx-entrance">${atlas('goals-icons.webp',4,i,heading)}<h2>${heading}</h2><p>${desc}</p></article>`).join('')}</div></div>`);
  const courseGallery=(id,heading,items)=>{
    const panels=items.map(([label,file,w,h],i)=>`<div class="gallery-panel" data-gallery-panel="${i}" data-ratio="${w/h}"><button class="poster spectacular" data-image="assets/courses-local/${file}" data-caption="${label}" aria-label="放大：${label}"><img data-src="assets/courses-local/${file}" alt="${label}" decoding="async"></button></div>`).join('');
    Object.assign(get(id),{title:heading,beats:items.length,visualType:'poster-gallery',controlMode:'gallery',customCourseGallery:true,motionHold:8000,html:`<div class="visual-surface local-course-surface"><div class="poster-gallery local-course-gallery" data-gallery="${id}"><div class="course-selector"><h1 class="v4-title course-heading">${heading==='能力提升與競賽'?'能力提升<br>與競賽':heading}</h1><div class="poster-thumbs">${items.map(([label],i)=>`<button data-gallery-index="${i}" aria-pressed="${i===0}"><span>${String(i+1).padStart(2,'0')}</span>${label}</button>`).join('')}</div></div><div class="course-view"><div class="poster-main">${panels}</div></div><div class="poster-gallery-caption"><div><button data-poster-prev aria-label="上一張海報">←</button><b data-poster-count>1 / ${items.length}</b><button data-poster-next aria-label="下一張海報">→</button></div></div></div></div>`});
  };
  courseGallery('C-01','課綱進度班',[
    ['P 國小','p.jpg',1024,1446],['J 國中','j.jpg',1459,2048],['S 高中','s.jpg',1452,2048],['實體課','onsite.jpg',1024,1536]
  ]);
  courseGallery('C-02','能力提升與競賽',[
    ['GGB','ggb-course.jpg',1452,2048],['AMC8','amc8.jpg',1122,1442],['AMC10','amc10.jpg',1055,1491],['FA00','fa00.jpg',1452,2048],['FA 高階賽 01','fa01.jpg',1122,1402],['FA 高階賽 02','fa02.jpg',1463,2048]
  ]);
  fixedImage('C-04','教材與教法・現場講解','notes.jpg');
  get('D-01').html=get('D-01').html.replace(/<aside class="pending">[\s\S]*?<\/aside>/g,'').replace(/<div class="source-line">[\s\S]*?<\/div>/g,'');

  set('E-01','坊間一般營隊',`<div class="visual-surface v4-camps">${title('坊間一般營隊：')}<div class="v4-camp-grid"><article class="fx-entrance">${local('camp-medical-science.webp','小朋友戴聽診器與做科學實驗的卡通圖')}<h2>一般刷題或安親<br>或華而不實的營隊</h2><p>醫學營、科學營⋯⋯</p></article><article class="fx-entrance">${local('camp-exam-fatigue.webp','小孩刷題刷得很累、頭昏腦脹的卡通圖')}<h2>考私中</h2><p>延x衝刺班、X閣刷題班</p></article></div></div>`,{motionDuration:5200});
  set('E-02','獵豹課程的體驗',`<div class="visual-surface v4-subjects">${title('獵豹課程的體驗')}<div class="v4-card-grid three">${[['數學','實體／線上<br>觀察問題，練習思考'],['GGB','電腦與數學結合<br>看見圖形的變化'],['語文','閱讀、理解、表達<br>讓思考被聽見']].map(([heading,desc],i)=>`<article class="fx-entrance">${atlas('experience-icons.webp',3,i,heading)}<h2>${heading}</h2><p>${desc}</p></article>`).join('')}</div></div>`);
  set('E-03','興趣的啟發',`<div class="visual-surface v4-play-gallery">${title('興趣的啟發')}<div>${['01','02','03'].map((n,i)=>`<article>${local('play'+n+'.jpg',['做中學','學中玩','玩中精進'][i])}<h2>${['做中學','學中玩','玩中精進'][i]}</h2></article>`).join('')}</div></div>`);
  get('E-04').html=get('E-04').html.replace(/<span class="illustration-label">公平骰子・機率教學示意<\/span>/g,'').replace(/<aside class="pending">[\s\S]*?<\/aside>/g,'');
  fixedImage('R2-01','將理論化為實踐，透過操作深化概念','notes2.png');
  fixedImage('R2-02','朱安強老師・GGB','teacher-ggb.jpg');
  fixedImage('R2-03','第一關・開關題','switch.jpg');
  fixedImage('R2-04','第二關・三視圖','play03.jpg');

  // The deliberately removed page redirects old bookmarks to the next comparison.
  window.CHEETAH.revision.aliases['A-08-02']='A-08-03';
  window.CHEETAH.revision.motionVersion=4;
  window.CHEETAH.revision.contestSpreads=spreads.map(x=>x.id);
})();
