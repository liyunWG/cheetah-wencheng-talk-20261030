/* 2026-10-31: speaker-requested revisions. Source images stay local. */
(() => {
  const {slides,helpers}=window.CHEETAH;
  const get=id=>slides.find(s=>s.id===id);
  const heading=title=>`<div class="scene-heading revision-heading"><h1>${title}</h1></div>`;
  const img=(src,title,cls='')=>`<button class="revision-photo ${cls}" data-image="${src}" data-caption="${title}" aria-label="放大：${title}"><img data-src="${src}" alt="${title}" decoding="async"></button>`;
  const photo=(name,title,cls='')=>img('assets/revision/'+name,title,cls);
  function change(id,title,html,extra={}){Object.assign(get(id),{title,html,beats:1,controlMode:'beats',visualType:'revision',motionDuration:3000,...extra});}
  function split(id,items){const at=slides.findIndex(s=>s.id===id),base=slides[at];slides.splice(at,1,...items.map((s,i)=>({...base,...s,id:`${id}-${String(i+1).padStart(2,'0')}`,beats:1,controlMode:'beats',visualType:'revision',motionDuration:3000})));}
  const web='https://cheetah-math-website.vercel.app/';
  const cite=(text,url)=>`<a class="revision-source" href="${url}" target="_blank" rel="noopener">${text} ↗</a>`;

  // A-01 is still the original 300-second artwork, now revealed from left to right.
  get('A-01').html=get('A-01').html.replace(/<div class="source-line">[\s\S]*?<\/div>/,'').replace('完整單趟','完整展開');
  const campus=(id,name)=>`<figure><img data-src="assets/revision/${id}.jpg" alt="${name}校園"><figcaption>${name}</figcaption></figure>`;
  const regions=[
    {name:'美國東岸',lon:-71.1,lat:42.36,x:25,y:15,w:460,schools:[['mit','MIT'],['harvard','哈佛'],['yale','耶魯'],['princeton','普林斯頓']]},
    {name:'美國西岸',lon:-122.17,lat:37.43,x:25,y:330,w:235,schools:[['stanford-campus','Stanford']]},
    {name:'英國',lon:-1.2,lat:52,x:630,y:0,w:315,schools:[['oxford-campus','牛津'],['cambridge','劍橋']]},
    {name:'法國',lon:2.2,lat:48.7,x:650,y:342,w:230,schools:[['polytechnique','高等理工學院']]},
    {name:'中國',lon:116.3,lat:40,x:1050,y:0,w:310,schools:[['peking','北京大學'],['tsinghua','清華大學']]},
    {name:'日本',lon:139.76,lat:35.71,x:1450,y:100,w:230,schools:[['tokyo','東京大學']]},
    {name:'臺灣',lon:121.53,lat:25.02,x:1420,y:334,w:260,schools:[['ntu','臺灣大學']]},
    {name:'香港・新加坡',lon:114.14,lat:22.28,x:1000,y:460,w:360,schools:[['hku','香港大學'],['nus','新加坡國立大學']]}
  ];
  const proj=([lon,lat])=>[(lon+180)*1728/360,(84-lat)*680/144];
  change('A-02','從數學出發，放眼世界',heading('從數學出發，<span class="gold">放眼世界。</span>')+`<div class="visual-surface campus-map"><svg viewBox="0 0 1728 680" aria-label="世界大學位置圖"><g transform="scale(1.44 1.1333)" class="campus-land">${window.MAPS.world}</g>${regions.map(r=>{const [x,y]=proj([r.lon,r.lat]);return `<path class="campus-leader" d="M${x},${y}L${r.x+r.w/2},${r.y+70}"/><circle class="campus-anchor" cx="${x}" cy="${y}" r="7"/>`;}).join('')}<path class="campus-leader" d="M${proj([103.78,1.3]).join(',')}L1180,520"/><circle class="campus-anchor" cx="${proj([103.78,1.3])[0]}" cy="${proj([103.78,1.3])[1]}" r="7"/></svg>${regions.map((r,i)=>`<article class="campus-cluster reveal-item" style="left:${r.x/1728*100}%;top:${r.y/680*100}%;width:${r.w/1728*100}%" data-reveal="${i}"><h2>${r.name}</h2><div class="campus-thumbs">${r.schools.map(x=>campus(...x)).join('')}</div></article>`).join('')}</div>`,{motionDuration:3000});

  const rust=['Wisconsin','Illinois','Indiana','Michigan','Ohio','Pennsylvania','New York','West Virginia'];
  const west=['California','Oregon','Washington'];
  const colors=['#2f718b','#568d88','#587bb2','#4d957e','#c19965','#717ca5','#7e9a75'];
  const sx=lon=>(lon+125)/59*1600,sy=lat=>(50.5-lat)/26.5*700;
  const icon=(type,x,y,color)=>`<g transform="translate(${x},${y})" class="region-icon" style="color:${color}"><circle r="41"/>${type==='ai'?'<rect x="-21" y="-21" width="42" height="42" rx="7"/><path d="M-32-14h11m-11 14h11m-11 14h11m42-28h11M21 0h11M21 14h11M-14-32v11M0-32v11M14-32v11M-14 21v11M0 21v11M14 21v11"/><text y="8" text-anchor="middle">AI</text>':type==='finance'?'<path d="M-26-11 0-29 26-11ZM-24 23h48M-18-8v27M-6-8v27M6-8v27M18-8v27"/>':'<path d="M-27 24v-32l17 10v-15L8-1v-31h13v56ZM-17 12h5M-2 12h5M13 12h4"/>'}</g>`;
  // Industrial corridor is clipped to actual state boundaries; it is not a federal administrative area.
  const corridor=[[ -89,44.2],[-86,43],[-84,44.5],[-82,42.5],[-79,43.5],[-75.5,43.1],[-75.5,41.6],[-78,40],[-80,39.5],[-81.5,38.5],[-84,39],[-87.8,40.1],[-90,41.3]];
  const beltPath=corridor.map(([x,y],i)=>(i?'L':'M')+sx(x)+','+sy(y)).join('')+'Z';
  change('A-03','美國：科技、金融與鐵鏽區',heading('同一個國度，<span class="gold">不同的發展軌跡。</span>')+`<div class="visual-surface us-regions"><svg viewBox="-20 -15 1660 760" aria-label="美國本土州界、科技西岸、華爾街與五大湖鐵鏽區"><defs><clipPath id="stateclip">${window.US_STATES.map(s=>`<path d="${s.d}"/>`).join('')}</clipPath><pattern id="rusthatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 9 9 0" stroke="#e6e9ee" stroke-opacity=".3" stroke-width="2"/></pattern></defs>${window.US_STATES.map((s,i)=>`<path class="state-area" d="${s.d}" fill="${west.includes(s.name)?'#13b5cc':rust.includes(s.name)?'#737b85':colors[i%colors.length]}"><title>${s.name}</title></path>`).join('')}<g clip-path="url(#stateclip)"><path d="${beltPath}" fill="#a6adb6" stroke="#e5e9ee" stroke-width="3" stroke-dasharray="8 7"/><path d="${beltPath}" fill="url(#rusthatch)"/><ellipse cx="${sx(-74.4)}" cy="${sy(40.8)}" rx="61" ry="66" fill="#ffb02f" fill-opacity=".95" stroke="#ffdd79" stroke-width="4"/></g>${window.US_STATES.map(s=>`<path d="${s.d}" fill="none" stroke="#e8f2f5" stroke-opacity=".7" stroke-width="1.8"/>`).join('')}${icon('ai',sx(-121.7),sy(37.6),'#52f2ff')}${icon('finance',sx(-73.9)+35,sy(40.7)+52,'#ffd36e')}${icon('factory',sx(-83.2),sy(42.3),'#edf0f3')}<g class="map-city-labels"><text x="${sx(-122)}" y="${sy(37.6)+83}">矽谷</text><text x="${sx(-74)+80}" y="${sy(40.7)+65}">紐約・華爾街</text><text x="${sx(-83.2)-20}" y="${sy(42.3)-64}">底特律</text><text x="${sx(-87.6)-50}" y="${sy(41.8)+48}">芝加哥</text><text x="${sx(-81.7)-20}" y="${sy(41.5)+73}">克里夫蘭</text><text x="${sx(-80)-10}" y="${sy(40.4)+92}">匹茲堡</text><text x="${sx(-78.9)+12}" y="${sy(42.9)-37}">水牛城</text></g><g class="state-abbreviations">${[['CA',-119,36],['WA',-120,47.3],['OR',-120.5,44],['WI',-89.5,45.5],['IL',-89,40],['IN',-86.1,39.9],['MI',-85,44.5],['OH',-82.7,40.6],['PA',-77.5,41.1],['NY',-75.5,44]].map(([t,x,y])=>`<text x="${sx(x)}" y="${sy(y)}">${t}</text>`).join('')}</g></svg><div class="map-legends"><div class="tech"><b>西岸｜科技／AI</b><span>矽谷・西雅圖</span></div><div class="industry"><b>五大湖工業帶｜鐵鏽區</b><span>製造業・鋼鐵・汽車工業</span></div><div class="finance"><b>東岸｜金融</b><span>紐約・華爾街</span></div></div></div>`,{source:{url:'https://www.bls.gov/opub/mlr/2002/09/art1full.pdf',methodology:'BLS核心五州，結合傳統工業走廊延伸至賓州、紐約西部；灰色斜線為工業帶概略範圍，非行政邊界。'}});

  change('A-04','消失的中產階級',`<div class="visual-surface middle-vanishing"><h1>消失的<span>中產階級</span></h1><svg viewBox="0 0 1700 650" aria-label="M型分佈圖：消失的中產階級"><defs><linearGradient id="middleFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dcb16f" stop-opacity=".8"/><stop offset="1" stop-color="#dcb16f" stop-opacity=".02"/></linearGradient></defs><path class="middle-old" d="M90 530C400 530 490 90 850 90S1300 530 1610 530"/><path class="middle-area" d="M90 530C220 530 220 115 440 115S650 510 850 510C1000 510 1110 520 1200 520C1335 520 1352 115 1380 115S1410 530 1430 530L1610 530Z" fill="url(#middleFill)"/><path class="middle-new" d="M90 530C220 530 220 115 440 115S650 510 850 510C1000 510 1110 520 1200 520C1335 520 1352 115 1380 115S1410 530 1430 530L1610 530"/><path class="middle-arrow" d="M910 225v180m-22-22 22 22 22-22"/><text x="910" y="460" class="middle-word">中產階級</text><path d="M90 534h1520" stroke="#675e51"/><g class="middle-axis"><text x="380" y="600">低所得</text><text x="1360" y="600">高所得</text></g></svg></div>`,{theme:'ivory',motionDuration:3000});

  const articleCard=(title,image,url,sub='')=>`<div class="visual-surface evidence-layout"><div class="evidence-copy"><h1>${title}</h1>${sub?`<p>${sub}</p>`:''}${cite('開啟原始資料',url)}</div>${photo(image,title,'evidence-image')}</div>`;
  split('A-05',[
    {title:'買進名校：美國大學舞弊風暴',html:articleCard('買進名校<br><span class="gold">美國大學舞弊風暴</span>','netflix.jpg','https://www.netflix.com/tw/title/81130691','Netflix 紀錄片｜2021')},
    {title:'哈羅／伊頓與牛津劍橋',html:heading('哈羅／伊頓公學<span class="gold">與牛津劍橋</span>')+`<div class="visual-surface school-evidence"><div class="school-proof">${photo('harrow.jpg','哈羅公學官方升學資料')}${cite('Harrow 官方升學資料','https://www.harrowschool.org.uk/welcome-to-harrow/university-destinations')}</div><div class="school-proof">${photo('eton.jpg','伊頓公學升學資料')}${cite('Eton 大學升學紀錄','https://theschoolsrecord.co.uk/schools/eton/university-destinations/')}</div><div class="school-stats"><span>哈羅 2025｜牛津、劍橋實際就讀</span><b>10 <small>人</small></b><span>伊頓 2025｜牛津、劍橋錄取接受</span><b>44 <small>人</small></b></div></div>`},
    {title:'薇閣：15位錄取台大醫學系',html:heading('薇閣高中<span class="gold">｜2026 升學成果</span>')+`<div class="visual-surface wego-evidence"><div><h1>台大醫學系</h1><strong>15<span>位</span></strong><div class="wego-bars"><div><span>臺大醫學系</span><i style="--bar:23.8%"></i><b>15人</b></div><div><span>陽明交通大學醫學系</span><i style="--bar:25.4%"></i><b>16人</b></div><div><span>總計醫學系<small>（含牙醫及中醫）</small></span><i style="--bar:100%"></i><b>共 <span data-count="63" data-decimals="0">63</span>人</b></div></div><p class="chart-unit">115年升學成果・人數</p></div><div>${photo('wego.jpg','薇閣官方115年升學成果')}${cite('薇閣高中官方升學公布','https://www.wghs.tp.edu.tw/nss/s/main/NTUgifted')}</div></div>`},
    {title:'台大新生：雙北與偏鄉',html:heading('臺大新生<span class="gold">｜雙北與偏鄉的距離</span>')+`<div class="visual-surface opportunity-evidence"><div><h2>入學機會差距</h2><div class="opportunity-bars"><div><span>臺北市</span><i style="--bar:100%"></i><b>7.37 倍</b></div><div><span>花蓮縣</span><i style="--bar:13.57%"></i><b>1 倍</b></div></div><p>2011–2014 年｜臺北市相對花蓮縣的入學機率</p>${cite('駱明慶研究相關報導（2016）','https://tw.news.yahoo.com/台大生雙北占半-大安區居冠-215003188.html')}</div><div>${photo('ntu-news.jpg','台大生雙北占半・大安區居冠新聞截圖')}</div></div>`}
  ]);
  get('A-05-02').html=heading('哈羅／伊頓公學<span class="gold">與牛津劍橋</span>')+`<div class="visual-surface school-evidence school-cards">${[
    ['哈羅公學','harrow-campus.jpg','10','2025｜牛津、劍橋實際就讀','harrow.jpg','https://www.harrowschool.org.uk/welcome-to-harrow/university-destinations'],
    ['伊頓公學','eton-campus.jpg','44','2025｜牛津、劍橋錄取接受','eton.jpg','https://theschoolsrecord.co.uk/schools/eton/university-destinations/']
  ].map(([name,campus,n,label,proof,url])=>`<article class="school-result-card"><img class="school-building" data-src="assets/revision/${campus}" alt="${name}校園"><div class="school-result-number"><div><h2>${name}</h2><p>${label}</p></div><strong>${n}<small>人</small></strong></div>${photo(proof,name+'升學資料截圖','school-proof-strip')}${cite('原始資料',url)}</article>`).join('')}</div>`;
  change('A-06','獵豹理念',`<div class="visual-surface belief-scene"><img data-src="assets/revision/belief.webp" alt="從鄉村到城市，以共享學習連結每個孩子"><div class="belief-copy"><h2>獵豹理念</h2><h1>菁英教育<span>平民化</span></h1><p>弭平城鄉差距<br>弭平經濟差距</p></div></div>`);

  const awards=[['assets/20260510_北車_MIT.png','獵豹學生｜MIT'],['assets/revision/oxford.jpg','吳玲誼｜牛津'],['assets/revision/caltech.png','吳玲誼｜Caltech'],['assets/revision/stanford.jpg','Ethan｜Stanford']];
  const honors=window.CHEETAH_HONORS;
  const contestFiles=['h001','h008','h032','h010','h003','h041'].map(id=>honors.find(x=>x.id===id)).filter(Boolean);
  split('A-07',[
    {title:'升學',html:`<div class="visual-surface admission-dream"><div class="campus-background">${['ntu','mit','harvard','oxford-campus'].map(id=>`<img data-src="assets/revision/${id}.jpg" alt="${{ntu:'臺大',mit:'MIT',harvard:'哈佛','oxford-campus':'牛津'}[id]}校園">`).join('')}</div><h1>升學</h1><div class="admission-awards">${awards.map(([file,label])=>`<article>${img(file,label)}<h2>${label}</h2></article>`).join('')}</div></div>`},
    {title:'素養',html:`<div class="visual-surface literacy-scene"><img data-src="assets/revision/literacy.webp" alt="積極樂觀、抗壓與終身學習，走向自學和新科技探索"><div class="literacy-copy"><h1>素養</h1><div><span>01</span><p>建立積極、樂觀、抗壓、<br>終身學習的態度</p></div><div><span>02</span><p>培養自學與探索新科技的能力</p></div><div><span>03</span><p>提升未來在升學與職場競爭力</p></div></div></div>`},
    {title:'競賽',html:heading('競賽<span class="gold">｜讓實力被看見</span>')+`<div class="visual-surface competition-wall"><div class="tower-half">${img('assets/competition_tower_original.jpeg','競賽寶塔原圖')}</div><div class="awards-half">${contestFiles.map(x=>`<article>${img(x.file,x.title)}<h3>${x.title}</h3></article>`).join('')}</div></div>`}
  ]);

  const pairs=[['assets/artwork/calculator-abacus.webp','手持計算機','打算盤'],['assets/artwork/calculator-computer.webp','計算機','電腦'],['assets/revision/tired-student.webp','AI 時代','學生刷題'],['assets/artwork/autonomous-driving.webp','無人車','駕訓班學開車']];
  split('A-08',[
    ...pairs.map(([file,a,b])=>({title:a+' vs '+b,html:`<div class="visual-surface standalone-comparison"><img class="comparison-full-image" data-src="${file}" alt="${a}與${b}"><div class="comparison-titles"><h1>${a}</h1><span>vs</span><h1>${b}</h1></div></div>`})),
    {title:'科技公司裁員新聞',html:heading('科技公司裁員<span class="gold">｜2026 年 10 月</span>')+`<div class="visual-surface layoffs-wall"><article><h2>Amazon｜10.29</h2>${photo('news-amazon.jpg','2026-10-29 亞馬遜裁員新聞截圖')}${cite('星島頭條｜2026.10.29','https://www.stheadline.com/stock-market/3631146/亞馬遜明天出業績-今日搶閘裁員')}</article><article><h2>Qualcomm｜10.21</h2>${photo('news-qualcomm.jpg','2026-10-21 高通全球裁員新聞截圖')}${cite('中央社｜2026.10.21','https://www.cna.com.tw/news/ait/202610210039.aspx')}</article><article><h2>Microsoft｜10.29</h2>${photo('news-microsoft.jpg','2026-10-29 微軟自願離職方案新聞截圖')}${cite('愛傳媒｜2026.10.29','https://www.i-media.tw/Article/Detail/52225')}</article></div>`}
  ]);
  change('A-09','AI 時代的學習',`<div class="visual-surface ai-future-scene"><img data-src="assets/revision/ai-future.webp" alt="學生面對璀璨的AI神經網絡與未來科技城市"><div><h1>AI 時代的<span>學習？</span></h1></div></div>`);

  const science=honors.filter(x=>/科學班/.test(x.title));
  change('B-01','升學榜單・國內',heading('升學榜單<span class="gold">・國內</span>')+`<div class="visual-surface domestic-results"><div class="student-identity">${img('assets/彥丞與瑋宸.jpg','彥丞與瑋宸合照')}<div class="corrected-names"><h2>張瑋宸</h2><h2>潘軒</h2><h2>姜光謙</h2></div></div><div class="science-gallery" data-interactive>${science.map(x=>`<article>${img(x.file,x.title)}<h3>${x.title}</h3></article>`).join('')}</div></div>`);
  change('B-02','升學榜單・國外',heading('升學榜單<span class="gold">・國外</span>')+`<div class="visual-surface international-posters">${img('assets/cheetah-elite-1741258423493502-1.webp','2025 MIT 與競賽升學榜單')}${img('assets/20260510_北車_MIT.png','20260510 北車 MIT 榜單')}</div>`);
  window.CHEETAH.revision={date:'2026-10-31',aliases:{'A-05':'A-05-01','A-07':'A-07-01','A-08':'A-08-01'}};
})();
