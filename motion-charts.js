/* CheetahCharts — dependency-free SVG motion charts. Source dates are publication dates. */
(function (global) {
  'use strict';
  var serial = 0, DURATION = 4400;
  var NS = 'http://www.w3.org/2000/svg';
  var definitions = {
    'm-distribution': {
      title: 'M 型分布', eyebrow: 'A CONCEPT, VISUALIZED', unit: '無（概念示意）',
      year: '不適用', source: '製作企劃 A-04 教學概念，未提供統計資料', url: '',
      methodology: '曲線為視覺示意，沒有樣本數或實測比例；不能據此推論任何國家中產人口的變化。',
      description: 'M型分布的概念帶狀曲線；非統計實測，沒有真實數值。'
    },
    'science-admission': {
      title: '每一份投入，都被看見', eyebrow: 'SCIENCE CLASS ADMISSIONS · 2025', unit: '錄取人數（人）',
      year: '2025', source: '獵豹科教成果原文 · 2025/05/05',
      url: 'https://www.facebook.com/groups/695697124716309/posts/1741258423493502/',
      methodology: '23位正式課程學員＋6位模考營學員＝29位錄取。4位榜首另列，並非額外錄取人數或另一個分母。',
      description: '2025科學班：正式課程23人，模考營6人，合計錄取29人；其中榜首4人另列。',
      bars: [{label:'正式課程', sub:'FORMAL PROGRAM', value:23, x:190},
             {label:'模考營', sub:'MOCK EXAM CAMP', value:6, x:530},
             {label:'合計錄取', sub:'TOTAL ADMISSIONS', value:29, x:1010}],
      width:160, base:460, scale:9.3, max:30, ticks:[0,10,20,30]
    },
    'ijso-gold': {
      title: '向世界，綻放科學的光', eyebrow: 'IJSO GOLD MEDALS · SELECTED YEARS', unit: '金牌數（面）',
      year: '2022、2023、2025', source: '獵豹科教 IJSO 歷年成果原文 · 2025/12/13',
      url: 'https://www.facebook.com/groups/695697124716309/posts/1928829028069773/',
      methodology: '僅比較已提供的三個年度金牌數：2022年1金（另1銀）、2023年3金、2025年3金。未呈現的年度不代表0面。',
      description: 'IJSO金牌：2022年1面，2023年3面，2025年3面；2022年另有1面銀牌。',
      bars: [{label:'2022', sub:'另有 1 面銀牌', value:1, x:235},
             {label:'2023', sub:'3 GOLD MEDALS', value:3, x:635},
             {label:'2025', sub:'3 GOLD MEDALS', value:3, x:1035}],
      width:150, base:460, scale:92, max:3, ticks:[0,1,2,3]
    }
  };
  function esc(s) {return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function points(a) {return a.map(function(p){return p[0].toFixed(2)+','+p[1].toFixed(2);}).join(' ');}
  function path(a, close) {return a.map(function(p,i){return (i?'L':'M')+p[0].toFixed(2)+','+p[1].toFixed(2);}).join(' ')+(close?'Z':'');}
  function easing(t) {return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function clamp(t) {return Math.max(0,Math.min(1,t));}
  function defs(id) {
    return '<defs>'+
      '<linearGradient id="'+id+'-front" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#806039"/><stop offset=".24" stop-color="#c39d5d"/><stop offset=".49" stop-color="#efd7a0"/><stop offset=".63" stop-color="#c2a068"/><stop offset="1" stop-color="#896439"/></linearGradient>'+
      '<linearGradient id="'+id+'-side" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8b693a"/><stop offset=".45" stop-color="#b3945d"/><stop offset="1" stop-color="#574427"/></linearGradient>'+
      '<linearGradient id="'+id+'-top" x1="0" y1="1" x2=".7" y2="0"><stop stop-color="#d7b87c"/><stop offset=".55" stop-color="#fae7bd"/><stop offset="1" stop-color="#a17e43"/></linearGradient>'+
      '<linearGradient id="'+id+'-curtain" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c9a76b" stop-opacity=".25"/><stop offset="1" stop-color="#c9a76b" stop-opacity=".015"/></linearGradient>'+
      '<linearGradient id="'+id+'-shine" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#ffffff" stop-opacity="0"/><stop offset=".44" stop-color="#fff5d6" stop-opacity=".04"/><stop offset=".5" stop-color="#fff5d6" stop-opacity=".26"/><stop offset=".56" stop-color="#fff5d6" stop-opacity=".04"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>'+
      '<radialGradient id="'+id+'-floor"><stop stop-color="#c9a76b" stop-opacity=".14"/><stop offset="1" stop-color="#c9a76b" stop-opacity="0"/></radialGradient>'+
      '<filter id="'+id+'-blur" x="-50%" y="-150%" width="200%" height="400%"><feGaussianBlur stdDeviation="9"/></filter>'+
      '<filter id="'+id+'-ribbon-shadow" x="-10%" y="-40%" width="120%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>'+
      '</defs>';
  }
  function floor(id) {
    var s='<ellipse cx="730" cy="477" rx="650" ry="105" fill="url(#'+id+'-floor)"/><g class="cc-floor-grid">';
    for(var i=0;i<9;i++){var x=80+i*155;s+='<path d="M'+(670+(x-670)*.76)+',449 L'+x+',574"/>';}
    [449,470,497,531,574].forEach(function(y){var half=440+(y-449)*1.6;s+='<path d="M'+(710-half)+','+y+' H'+(710+half)+'"/>';});
    return s+'</g>';
  }
  function barsMarkup(cfg,id) {
    var s=floor(id)+'<g class="cc-value-grid">';
    cfg.ticks.forEach(function(v){var y=cfg.base-v*cfg.scale;s+='<path d="M130,'+y+' H1280"/><text x="100" y="'+(y+7)+'" text-anchor="end">'+v+'</text>';});
    s+='</g><text class="cc-axis-unit" x="130" y="112">'+esc(cfg.unit)+'</text>';
    cfg.bars.forEach(function(b,i){
      s+='<g data-cc-bar="'+i+'" class="cc-bar"><ellipse class="cc-bar-shadow" cx="'+(b.x+cfg.width/2+28)+'" cy="475" rx="'+(cfg.width*.8)+'" ry="16" fill="#000" filter="url(#'+id+'-blur)"/>'+
      '<polygon data-face="side" fill="url(#'+id+'-side)"/><polygon data-face="front" fill="url(#'+id+'-front)"/><polygon data-face="gloss" fill="url(#'+id+'-shine)"/><polygon data-face="top" fill="url(#'+id+'-top)"/>'+
      '<path data-face="edge" class="cc-metal-edge"/><text data-face="count" x="'+(b.x+cfg.width/2+18)+'" y="420" class="cc-count" text-anchor="middle">0</text>'+
      '<text class="cc-bar-label" x="'+(b.x+cfg.width/2+15)+'" y="535" text-anchor="middle">'+esc(b.label)+'</text><text class="cc-bar-sub" x="'+(b.x+cfg.width/2+15)+'" y="570" text-anchor="middle">'+esc(b.sub)+'</text></g>';
    });
    if(cfg===definitions['science-admission']) {
      s+='<g class="cc-total-separator"><path d="M864 210V475"/><text x="861" y="345" text-anchor="middle">=</text></g>'+
      '<g class="cc-laureate"><rect x="1110" y="35" width="230" height="73" rx="12"/><text x="1225" y="64" text-anchor="middle">4 人榜首</text><text x="1225" y="88" text-anchor="middle" class="cc-laureate-note">另列・不加進錄取總數</text></g>'+
      '<text class="cc-formula" x="555" y="618" text-anchor="middle">23 位正式課程 ＋ 6 位模考營 ＝ 29 位錄取</text>';
    } else {
      s+='<text class="cc-formula" x="720" y="618" text-anchor="middle">2022 年另獲 1 銀；未顯示的年度不代表零面</text>';
    }
    return s;
  }
  function curveMarkup(id) {
    return floor(id)+'<g class="cc-concept-mark"><rect x="435" y="18" width="550" height="54" rx="27"/><text x="710" y="53" text-anchor="middle">概念示意 · 非統計實測</text></g>'+
      '<g class="cc-curve"><path data-curve="shadow" fill="#000" opacity=".35" filter="url(#'+id+'-ribbon-shadow)"/><path data-curve="curtain" fill="url(#'+id+'-curtain)"/><path data-curve="back" fill="none" stroke="#c9a76b" stroke-opacity=".25" stroke-width="1"/><path data-curve="top" fill="url(#'+id+'-top)" stroke="#e7d3a6" stroke-opacity=".5" stroke-width="1"/><path data-curve="front" fill="url(#'+id+'-front)"/><path data-curve="edge" fill="none" stroke="#f4dfb0" stroke-width="2.5"/><circle data-curve="left-dot" r="7" fill="#f6e4b8"/><circle data-curve="right-dot" r="7" fill="#f6e4b8"/></g>'+
      '<path class="cc-concept-axis" d="M140 480H1285"/><text class="cc-concept-axislabel" x="1280" y="523" text-anchor="end">所得位置 →</text>'+
      '<text class="cc-bar-label" x="275" y="566" text-anchor="middle">低所得端</text><text class="cc-bar-label" x="710" y="566" text-anchor="middle">中間區間</text><text class="cc-bar-label" x="1145" y="566" text-anchor="middle">高所得端</text>'+
      '<text class="cc-formula" x="710" y="618" text-anchor="middle">這是討論結構變化的視覺概念，不是人口比例統計。</text>';
  }
  function render(type) {
    var cfg=definitions[type];if(!cfg)throw new RangeError('Unknown Cheetah chart type: '+type);
    var id='cc-svg-'+(++serial);
    var source=cfg.url?'<a href="'+esc(cfg.url)+'" target="_blank" rel="noopener noreferrer">'+esc(cfg.source)+' ↗</a>':esc(cfg.source);
    return '<section class="cc-chart" data-charttype="'+type+'" data-chart-state="idle" data-chart-id="'+id+'">'+
      '<header class="cc-chart-header"><span class="cc-eyebrow">'+esc(cfg.eyebrow)+'</span><div><h3>'+esc(cfg.title)+'</h3><span class="cc-unit">'+esc(cfg.unit)+'</span></div></header>'+
      '<svg class="cc-chart-svg" viewBox="0 0 1420 650" role="img" aria-labelledby="'+id+'-title '+id+'-desc"><title id="'+id+'-title">'+esc(cfg.title)+'</title><desc id="'+id+'-desc">'+esc(cfg.description)+'</desc>'+defs(id)+(type==='m-distribution'?curveMarkup(id):barsMarkup(cfg,id))+'</svg>'+
      '<div class="cc-chart-controls cc-internal-controls"><div><button type="button" data-chart-action="toggle" aria-label="暫停圖表動畫">暫停</button><button type="button" data-chart-action="replay">重播</button><button type="button" data-chart-action="finish">顯示全部</button></div><span class="cc-status" aria-live="off">準備播放</span></div>'+
      '<footer class="cc-chart-source"><div><span>年份：'+esc(cfg.year)+'</span><span>單位：'+esc(cfg.unit)+'</span><span>來源：'+source+'</span></div><p>'+esc(cfg.methodology)+'</p></footer></section>';
  }
  function curveY(t,progress) {
    var a=Math.exp(-Math.pow((t-.19)/.145,2)),b=Math.exp(-Math.pow((t-.81)/.145,2));
    return 459-(24+238*(a+b))*progress;
  }
  function drawCurve(el,p) {
    var upper=[],lower=[],back=[],shadow=[],n=100;
    for(var i=0;i<=n;i++){var t=i/n,x=150+t*1100,y=curveY(t,p);upper.push([x,y]);lower.push([x,y+21]);back.push([x+33,y-28]);shadow.push([x+20,477+(y-459)*.08]);}
    function set(name,value){var node=el.querySelector('[data-curve="'+name+'"]');if(node)node.setAttribute('d',value);}
    set('front',path(upper.concat(lower.slice().reverse()),true));
    set('top',path(upper.concat(back.slice().reverse()),true));set('back',path(back,false));set('edge',path(upper,false));
    set('curtain',path(upper.concat([[1250,480],[150,480]]),true));
    set('shadow',path(shadow.concat(shadow.slice().reverse().map(function(v){return [v[0],v[1]+17];})),true));
    [['left-dot',.19],['right-dot',.81]].forEach(function(v){var node=el.querySelector('[data-curve="'+v[0]+'"]');if(node){node.setAttribute('cx',150+v[1]*1100);node.setAttribute('cy',curveY(v[1],p));node.setAttribute('opacity',Math.min(1,p*2));}});
  }
  function drawBars(el,cfg,progress) {
    var groups=el.querySelectorAll('[data-cc-bar]');
    cfg.bars.forEach(function(b,i){
      var group=groups[i];if(!group)return;
      var q=easing(clamp((progress-.105*i)/.76)),height=b.value*cfg.scale*q,x=b.x,w=cfg.width,y=cfg.base,top=y-height,dx=36,dy=-23;
      var faces={
        front:[[x,y],[x+w,y],[x+w,top],[x,top]],
        gloss:[[x,y],[x+w,y],[x+w,top],[x,top]],
        side:[[x+w,y],[x+w+dx,y+dy],[x+w+dx,top+dy],[x+w,top]],
        top:[[x,top],[x+w,top],[x+w+dx,top+dy],[x+dx,top+dy]]
      };
      Object.keys(faces).forEach(function(key){var node=group.querySelector('[data-face="'+key+'"]');if(node)node.setAttribute('points',points(faces[key]));});
      var edge=group.querySelector('[data-face="edge"]');if(edge)edge.setAttribute('d','M'+x+','+y+'V'+top+'H'+(x+w)+'L'+(x+w+dx)+','+(top+dy));
      var count=group.querySelector('[data-face="count"]');if(count){count.textContent=String(Math.round(b.value*q));count.setAttribute('y',top-43);count.setAttribute('opacity',.35+.65*q);}
    });
  }
  function createController(el) {
    if(el.__cheetahChart)el.__cheetahChart.destroy();
    var type=el.getAttribute('data-charttype'),cfg=definitions[type];if(!cfg)throw new RangeError('Unknown chart '+type);
    var duration=type==='m-distribution'?4200:DURATION,elapsed=0,origin=0,frame=0,state='idle',dead=false;
    var buttons=Array.from(el.querySelectorAll('[data-chart-action]')),status=el.querySelector('.cc-status'),toggle=el.querySelector('[data-chart-action="toggle"]');
    function draw(value){if(type==='m-distribution')drawCurve(el,easing(value));else drawBars(el,cfg,value);el.style.setProperty('--cc-progress',value);if(status)status.textContent=state==='complete'?'完整呈現':state==='paused'?'已暫停 · '+(elapsed/1000).toFixed(1)+' 秒':(elapsed/1000).toFixed(1)+' / '+(duration/1000).toFixed(1)+' 秒';}
    function setState(next){state=next;el.setAttribute('data-chart-state',state);if(toggle){toggle.textContent=state==='running'?'暫停':state==='complete'?'重新播放':'繼續';toggle.setAttribute('aria-label',state==='running'?'暫停圖表動畫':state==='complete'?'重新播放圖表動畫':'繼續圖表動畫');}}
    function stopFrame(){if(frame)global.cancelAnimationFrame(frame);frame=0;}
    function tick(now){frame=0;if(dead||state!=='running')return;elapsed=Math.min(duration,Math.max(0,now-origin));if(elapsed>=duration){setState('complete');draw(1);el.dispatchEvent(new CustomEvent('cheetah:chart-complete',{bubbles:true,detail:{type:type}}));return;}draw(elapsed/duration);frame=global.requestAnimationFrame(tick);}
    function play(){if(dead||state==='running')return;if(state==='complete')elapsed=0;setState('running');origin=global.performance.now()-elapsed;draw(elapsed/duration);frame=global.requestAnimationFrame(tick);}
    function pause(){if(dead||state!=='running')return;elapsed=Math.min(duration,Math.max(0,global.performance.now()-origin));stopFrame();setState('paused');draw(elapsed/duration);}
    function finish(){if(dead)return;stopFrame();elapsed=duration;setState('complete');draw(1);}
    function seek(progress){if(dead)return;var p=Number(progress);if(!Number.isFinite(p))throw new TypeError('Chart progress must be finite.');var wasRunning=state==='running';stopFrame();elapsed=clamp(p)*duration;setState(elapsed>=duration?'complete':wasRunning?'running':'paused');draw(elapsed/duration);if(state==='running'){origin=global.performance.now()-elapsed;frame=global.requestAnimationFrame(tick);}}
    function replay(){if(dead)return;stopFrame();elapsed=0;setState('idle');draw(0);play();}
    function onClick(e){var action=e.currentTarget.getAttribute('data-chart-action');if(action==='toggle'){if(state==='running')pause();else play();}else if(action==='replay')replay();else if(action==='finish')finish();}
    function onVisibility(){if(global.document.hidden)pause();}
    function destroy(){if(dead)return;stopFrame();dead=true;buttons.forEach(function(b){b.removeEventListener('click',onClick);});global.document.removeEventListener('visibilitychange',onVisibility);delete el.__cheetahChart;}
    buttons.forEach(function(b){b.addEventListener('click',onClick);});global.document.addEventListener('visibilitychange',onVisibility);
    var api={play:play,replay:replay,pause:pause,resume:play,finish:finish,seek:seek,destroy:destroy};
    el.__cheetahChart=api;draw(0);
    if(global.document&&global.document.body&&global.document.body.dataset.motion==='reduced')finish();else play();
    return api;
  }
  function mount(root) {
    if(typeof root==='string')root=global.document.querySelector(root);
    if(!root)throw new TypeError('CheetahCharts.mount requires an existing root element.');
    var elements=root.matches&&root.matches('.cc-chart[data-charttype]')?[root]:Array.from(root.querySelectorAll('.cc-chart[data-charttype]'));
    var controllers=elements.map(createController),group={};
    ['play','replay','pause','resume','finish','destroy'].forEach(function(method){group[method]=function(){controllers.forEach(function(c){c[method]();});};});
    group.seek=function(progress){controllers.forEach(function(c){c.seek(progress);});};
    return group;
  }
  global.CheetahCharts={render:render,mount:mount};
})(window);

