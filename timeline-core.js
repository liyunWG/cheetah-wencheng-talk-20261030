/* Time, not frame count, determines the trip; its length matches the background music (3:53.77). */
class TimelineClock {
  static DURATION_MS=233770;
  constructor(elapsedMs=0){this.elapsedMs=Math.max(0,Math.min(TimelineClock.DURATION_MS,elapsedMs));this.running=false;this.lastTime=null;this.repeat=false;}
  get progress(){return this.elapsedMs/TimelineClock.DURATION_MS;}
  play(now){if(this.elapsedMs>=TimelineClock.DURATION_MS)this.elapsedMs=0;this.running=true;this.lastTime=now;}
  pause(now){if(this.running&&Number.isFinite(now))this.tick(now);this.running=false;this.lastTime=null;}
  seek(progress){this.elapsedMs=Math.max(0,Math.min(1,progress))*TimelineClock.DURATION_MS;this.lastTime=null;}
  restart(){this.elapsedMs=0;this.running=false;this.lastTime=null;}
  tick(now){if(!this.running)return this.progress;if(this.lastTime!==null){this.elapsedMs+=Math.max(0,now-this.lastTime);if(this.elapsedMs>=TimelineClock.DURATION_MS){if(this.repeat)this.elapsedMs%=TimelineClock.DURATION_MS;else{this.elapsedMs=TimelineClock.DURATION_MS;this.running=false;}}}this.lastTime=now;return this.progress;}
  position(stageWidth,imageWidth,startX=0){return (startX-imageWidth)*(1-this.progress);}
}
if(typeof window!=='undefined')window.TimelineClock=TimelineClock;
if(typeof module!=='undefined')module.exports=TimelineClock;
