/* Browser-native cinematic timeline. Scene changes remain teacher controlled. */
(() => {
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  class Director {
    constructor({section,scene,onBeat,onTime}){
      this.section=section;this.scene=scene;this.onBeat=onBeat;this.onTime=onTime;this.time=0;this.last=null;this.running=false;this.finished=false;this.raf=0;this.beat=-1;this.animations=[];this.charts=[];
      this.sequence=scene.visualType==='comparison'||scene.visualType==='contest-gallery'||scene.controlMode==='gallery';
      this.hold=scene.motionHold||9000;
      this.duration=scene.motionDuration||(this.sequence?scene.beats*this.hold+800:Math.max(4600,1600+scene.beats*1150));
      this.reduced=document.body.dataset.motion==='reduced';
      this.setupEntry();this.bindCharts(section);this.update(0);
      if(this.reduced){this.finish();}else this.play();
    }
    setupEntry(){
      this.section.querySelectorAll('.reveal-item').forEach((el,i)=>this.addAnimation(el,[{opacity:0,transform:'translateY(22px)',clipPath:'inset(0 100% 0 0)'},{opacity:1,transform:'translateY(0)',clipPath:'inset(0 0% 0 0)'}],{duration:1000,delay:120+i*240,fill:'both',easing:'cubic-bezier(.2,.7,.2,1)'}));
      this.section.querySelectorAll('.middle-area,.middle-new').forEach(el=>this.addAnimation(el,[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)'}],{duration:2500,delay:200,fill:'both',easing:'ease-in-out'}));
      const elements=[...this.section.querySelectorAll('.scene-heading>.eyebrow,.scene-heading>h1,.scene-heading>.lead,.manifesto>h1,.question-scene h1,.lesson-intro h1')];
      elements.forEach((el,i)=>this.addAnimation(el,[{opacity:0,transform:'translate3d(0,30px,0) rotateX(8deg)',filter:'blur(7px)',clipPath:'inset(0 0 100% 0)'},{opacity:1,transform:'translate3d(0,0,0) rotateX(0deg)',filter:'blur(0px)',clipPath:'inset(0 0 0% 0)'}],{duration:1000,delay:100+i*160,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
      this.section.querySelectorAll('.cinema-art').forEach((el,i)=>this.addAnimation(el,[{transform:'scale(1.015) translate3d(-4px,4px,0)'},{transform:'scale(1.065) translate3d(5px,-5px,0)'}],{duration:this.hold*1.3,delay:i*this.hold,easing:'ease-in-out',fill:'both'}));
      this.section.querySelectorAll('.poster:not(.tower-thumb) img,.tower-thumb img').forEach(el=>this.addAnimation(el,[{transform:'scale(.96) rotateY(-4deg)'},{transform:'scale(1) rotateY(0deg)'}],{duration:1700,delay:250,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
      this.section.querySelectorAll('.hero-stat>strong').forEach(el=>{const final=Number(el.textContent.trim());if(Number.isFinite(final)){el.dataset.motionCount=final;el.dataset.finalText=el.textContent;}});
      const die=this.section.querySelector('.die-cube');if(die)this.addAnimation(die,[{transform:'rotateX(-190deg) rotateY(240deg) rotateZ(-18deg) translateY(-55px)'},{transform:'rotateX(-25deg) rotateY(35deg) rotateZ(0deg) translateY(0px)'}],{duration:3200,easing:'cubic-bezier(.15,.8,.2,1)',fill:'both'});
    }
    addAnimation(el,frames,options){const a=el.animate(frames,options);a.pause();a.currentTime=0;this.animations.push(a);return a;}
    bindCharts(root){if(!window.CheetahCharts)return;root.querySelectorAll('[data-charttype]').forEach(el=>{if(el.dataset.motionMounted)return;el.dataset.motionMounted='true';el.dataset.controls='external';const control=window.CheetahCharts.mount(el);this.charts.push(control);if(!this.running)control.pause();});}
    replaceCharts(root){for(const c of this.charts)c.destroy();this.charts=[];root.querySelectorAll('[data-charttype]').forEach(el=>delete el.dataset.motionMounted);this.bindCharts(root);if(this.running)for(const c of this.charts)c.play();}
    beatAt(t){return this.sequence?clamp(1+Math.floor(Math.max(0,t-800)/this.hold),1,this.scene.beats):clamp(t<650?0:1+Math.floor((t-650)/1150),0,this.scene.beats);}
    update(t){this.time=clamp(t,0,this.duration);const b=this.beatAt(this.time);if(b!==this.beat){this.beat=b;this.onBeat(b);}
      for(const a of this.animations)a.currentTime=this.time;
      this.section.querySelectorAll('[data-motion-count]').forEach(el=>{const panel=el.closest('[data-panel]');const offset=panel?(Number(panel.dataset.panel)-1)*this.hold+800:0;const p=clamp((this.time-offset)/1700,0,1);el.textContent=String(Math.round(Number(el.dataset.motionCount)*(1-Math.pow(1-p,3))));});
      this.section.querySelectorAll('[data-motion-panel]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.motionPanel)===this.beat));
      this.onTime(this.time,this.duration,this.running,this.finished);
    }
    tick(now){if(!this.running)return;if(this.last!==null)this.time+=Math.max(0,now-this.last);this.last=now;if(this.time>=this.duration){this.finish();return;}this.update(this.time);this.raf=requestAnimationFrame(n=>this.tick(n));}
    play(){if(this.finished){this.replay();return;}this.running=true;this.last=performance.now();for(const c of this.charts)c.resume();this.update(this.time);cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(n=>this.tick(n));}
    pause(){this.running=false;cancelAnimationFrame(this.raf);this.raf=0;this.last=null;for(const c of this.charts)c.pause();this.section.getAnimations({subtree:true}).forEach(a=>{if(!this.animations.includes(a)&&a.playState==='running')a.pause();});this.update(this.time);}
    resume(){this.section.getAnimations({subtree:true}).forEach(a=>{if(!this.animations.includes(a)&&a.playState==='paused')a.play();});this.play();}
    replay(){this.finished=false;this.running=false;this.time=0;this.beat=-1;for(const c of this.charts)c.replay();this.update(0);this.play();}
    finish(){this.running=false;this.finished=true;cancelAnimationFrame(this.raf);this.raf=0;for(const c of this.charts)c.finish();this.beat=-1;this.update(this.duration);}
    seek(progress){this.pause();this.finished=progress>=1;this.time=clamp(progress,0,1)*this.duration;for(const c of this.charts){if(c.seek)c.seek(clamp(this.time/4300,0,1));else if(progress>=.65)c.finish();}this.update(this.time);}
    jump(beat){this.finished=false;this.time=this.sequence?800+(clamp(beat,1,this.scene.beats)-1)*this.hold:650+(Math.max(1,beat)-1)*1150;this.beat=-1;this.update(this.time);this.last=performance.now();}
    destroy(){cancelAnimationFrame(this.raf);this.running=false;for(const a of this.animations)a.cancel();for(const c of this.charts)c.destroy();this.charts=[];this.section.querySelectorAll('[data-motion-count]').forEach(el=>{el.textContent=el.dataset.finalText||el.dataset.motionCount;});this.section.querySelectorAll('[data-charttype]').forEach(el=>delete el.dataset.motionMounted);}
  }
  window.CheetahMotion={create:options=>new Director(options)};
})();
