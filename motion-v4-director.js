/* One deterministic clock controls entrances, counters, bars, seeks and pauses. */
(() => {
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  class Director {
    constructor({section,scene,onBeat,onTime}){
      Object.assign(this,{section,scene,onBeat,onTime,time:0,last:null,running:false,finished:false,raf:0,beat:-1,animations:[],charts:[],counters:[]});
      this.sequence=scene.visualType==='comparison'||scene.visualType==='contest-gallery'||scene.controlMode==='gallery';
      this.hold=scene.motionHold||9000;this.duration=scene.motionDuration||(this.sequence?scene.beats*this.hold+800:Math.max(4600,1600+scene.beats*1150));
      this.setup();this.ambientAnimations=[...section.querySelectorAll('.coast-tracer')].map(el=>el.animate([{strokeDashoffset:'1000'},{strokeDashoffset:'0'}],{duration:3600,iterations:Infinity,easing:'linear'}));this.ambientAnimations.forEach(a=>a.pause());this.bindCharts(section);this.update(0);
      if(document.body.dataset.motion==='reduced')this.finish();else this.play();
    }
    add(el,frames,options){const a=el.animate(frames,{fill:'both',...options});a.pause();a.currentTime=0;this.animations.push(a);}
    setup(){
      const titles=[...this.section.querySelectorAll('.scene-heading>h1,.scene-heading>.lead,.v4-title,.manifesto>h1,.question-scene h1,.lesson-intro h1')];
      titles.forEach((el,i)=>this.add(el,[{opacity:0,transform:'translateY(26px)',filter:'blur(8px)'},{opacity:1,transform:'translateY(0)',filter:'blur(0)'}],{duration:1050,delay:90+i*110,easing:'cubic-bezier(.16,1,.3,1)'}));
      const selectors='.fx-entrance,.revision-photo,.poster,.v4-card-grid>article,.v4-play-gallery article';
      const entries=[...this.section.querySelectorAll(selectors)].filter(el=>!el.parentElement.closest(selectors));
      entries.forEach((el,i)=>{
        const panel=el.closest('[data-gallery-panel]');const panelIndex=Number(panel?.dataset.galleryPanel||0);const delay=this.scene.customCourseGallery?(panelIndex?800+panelIndex*this.hold+180:180):180+i*Math.min(220,1500/Math.max(1,entries.length-1));const fancy=el.classList.contains('spectacular');
        this.add(el,[{opacity:0,transform:`perspective(1800px) translate3d(${i%2?65:-65}px,${fancy?75:35}px,-120px) rotateY(${i%2?-14:14}deg) scale(${fancy?.78:.91})`,filter:'blur(13px) brightness(1.6)'},{offset:.75,opacity:1,transform:'perspective(1800px) translate3d(0,-3px,0) rotateY(0deg) scale(1.015)',filter:'blur(0px) brightness(1.12)'},{opacity:1,transform:'perspective(1800px) translate3d(0,0,0) rotateY(0deg) scale(1)',filter:'blur(0px) brightness(1)'}],{duration:fancy?1800:1400,delay,easing:'cubic-bezier(.16,1,.3,1)'});
      });
      this.section.querySelectorAll('.revision-photo,.poster').forEach((el,i)=>{
        let glint=el.querySelector('.poster-glint');if(!glint){glint=document.createElement('span');glint.className='poster-glint';glint.setAttribute('aria-hidden','true');el.appendChild(glint);}
        const panelIndex=Number(el.closest('[data-gallery-panel]')?.dataset.galleryPanel||0);const delay=this.scene.customCourseGallery?(panelIndex?800+panelIndex*this.hold+650:650):650+i*Math.min(200,1300/Math.max(1,entries.length));
        this.add(glint,[{opacity:0,transform:'translateX(-155%) skewX(-23deg)'},{offset:.25,opacity:.65},{offset:.65,opacity:.45},{opacity:0,transform:'translateX(155%) skewX(-23deg)'}],{duration:1300,delay,easing:'ease-in-out'});
      });
      this.section.querySelectorAll('.reveal-item').forEach((el,i)=>this.add(el,[{opacity:0,transform:'translateY(22px)',clipPath:'inset(0 100% 0 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0% 0 0)'}],{duration:1000,delay:120+i*240,easing:'cubic-bezier(.2,.7,.2,1)'}));
      this.section.querySelectorAll('.middle-area,.middle-new').forEach(el=>this.add(el,[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:2500,delay:200,easing:'ease-in-out'}));
      this.section.querySelectorAll('.wego-bars i,.opportunity-bars i').forEach((el,i)=>{el.style.transformOrigin='left center';this.add(el,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:1450,delay:350+i*130,easing:'cubic-bezier(.12,.72,.2,1)'});});
      this.section.querySelectorAll('[data-count]').forEach((el,i)=>this.counters.push({el,value:Number(el.dataset.count),decimals:Number(el.dataset.decimals||0),delay:350+i*110}));
      const die=this.section.querySelector('.die-cube');if(die)this.add(die,[{transform:'rotateX(-190deg) rotateY(240deg) rotateZ(-18deg) translateY(-55px)'},{transform:'rotateX(-25deg) rotateY(35deg) rotateZ(0deg) translateY(0px)'}],{duration:3200,easing:'cubic-bezier(.15,.8,.2,1)'});
    }
    bindCharts(root){if(!window.CheetahCharts)return;root.querySelectorAll('[data-charttype]').forEach(el=>{if(el.dataset.motionMounted)return;el.dataset.motionMounted='true';el.dataset.controls='external';const c=window.CheetahCharts.mount(el);c.pause();this.charts.push(c);});}
    replaceCharts(root){this.charts.forEach(c=>c.destroy());this.charts=[];root.querySelectorAll('[data-charttype]').forEach(el=>delete el.dataset.motionMounted);this.bindCharts(root);}
    beatAt(t){return this.sequence?clamp(1+Math.floor(Math.max(0,t-800)/this.hold),1,this.scene.beats):clamp(t<650?0:1+Math.floor((t-650)/1150),0,this.scene.beats);}
    update(t){this.time=clamp(t,0,this.duration);const b=this.beatAt(this.time);if(b!==this.beat){this.beat=b;this.onBeat(b);}this.animations.forEach(a=>a.currentTime=this.time);
      for(const c of this.counters){const p=clamp((this.time-c.delay)/1450);c.el.textContent=(c.value*(1-Math.pow(1-p,3))).toLocaleString('zh-TW',{minimumFractionDigits:c.decimals,maximumFractionDigits:c.decimals});}
      this.onTime(this.time,this.duration,this.running,this.finished);
    }
    ambient(state){this.section.querySelectorAll('.coast-tracer,.coast-halo').forEach(el=>el.style.animationPlayState=state?'running':'paused');this.ambientAnimations.forEach(a=>state?a.play():a.pause());}
    tick(now){if(!this.running)return;if(this.last!==null)this.time+=Math.max(0,now-this.last);this.last=now;if(this.time>=this.duration){if(!this.scene.ambientLoop){this.finish();return;}this.time=this.duration;}this.update(this.time);this.raf=requestAnimationFrame(n=>this.tick(n));}
    play(){if(this.finished){this.replay();return;}this.running=true;this.last=performance.now();this.ambient(true);this.charts.forEach(c=>c.resume());this.update(this.time);cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(n=>this.tick(n));}
    pause(){this.running=false;cancelAnimationFrame(this.raf);this.raf=0;this.last=null;this.ambient(false);this.charts.forEach(c=>c.pause());this.update(this.time);}
    resume(){this.play();}
    replay(){this.finished=false;this.running=false;this.time=0;this.beat=-1;this.charts.forEach(c=>c.replay());this.update(0);this.play();}
    finish(){this.running=false;this.finished=!this.scene.ambientLoop;cancelAnimationFrame(this.raf);this.raf=0;this.charts.forEach(c=>c.finish());this.beat=-1;this.update(this.duration);if(this.scene.ambientLoop)this.play();}
    seek(progress){this.pause();this.finished=progress>=1&&!this.scene.ambientLoop;this.charts.forEach(c=>c.seek?.(clamp(progress)));this.update(clamp(progress)*this.duration);}
    jump(beat){this.finished=false;this.update(this.sequence?800+(clamp(beat,1,this.scene.beats)-1)*this.hold:650+(Math.max(1,beat)-1)*1150);this.last=performance.now();if(this.scene.customCourseGallery)this.play();}
    destroy(){cancelAnimationFrame(this.raf);this.running=false;this.ambient(false);this.ambientAnimations.forEach(a=>a.cancel());this.animations.forEach(a=>a.cancel());this.charts.forEach(c=>c.destroy());this.section.querySelectorAll('[data-charttype]').forEach(el=>delete el.dataset.motionMounted);}
  }
  window.CheetahMotion={create:options=>new Director(options)};
})();
