/* Time, not frame count, determines the complete 300-second trip. */
class TimelineClock {
  static DURATION_MS=300000;
  constructor(elapsedMs=0){this.elapsedMs=Math.max(0,Math.min(300000,elapsedMs));this.running=false;this.lastTime=null;this.repeat=false;}
  get progress(){return this.elapsedMs/TimelineClock.DURATION_MS;}
  play(now){if(this.elapsedMs>=300000)this.elapsedMs=0;this.running=true;this.lastTime=now;}
  pause(now){if(this.running&&Number.isFinite(now))this.tick(now);this.running=false;this.lastTime=null;}
  seek(progress){this.elapsedMs=Math.max(0,Math.min(1,progress))*300000;this.lastTime=null;}
  restart(){this.elapsedMs=0;this.running=false;this.lastTime=null;}
  tick(now){if(!this.running)return this.progress;if(this.lastTime!==null){this.elapsedMs+=Math.max(0,now-this.lastTime);if(this.elapsedMs>=300000){if(this.repeat)this.elapsedMs%=300000;else{this.elapsedMs=300000;this.running=false;}}}this.lastTime=now;return this.progress;}
  position(stageWidth,imageWidth){return -imageWidth*(1-this.progress);}
}
if(typeof window!=='undefined')window.TimelineClock=TimelineClock;
if(typeof module!=='undefined')module.exports=TimelineClock;
