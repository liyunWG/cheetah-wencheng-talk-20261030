/* Presentation adapter only. The four copied core files remain byte-identical. */
(function(){
 'use strict';
 var STORAGE_KEY='cheetah-presentation:views-state:v1';
 var active=!document.hidden,restoring=false,restoredOver=false,undoBoundary=0;
 var nativeInterval=window.setInterval,storageAvailable=true,statusNode=null;
 window.setInterval=function(fn,delay){var args=Array.prototype.slice.call(arguments,2);return nativeInterval(function(){if(active&&!restoring&&!restoredOver){fn.apply(window,args);if(delay>=500)save();}},delay);};
 function notify(type,data){if(window.parent===window)return;window.parent.postMessage(Object.assign({type:type,game:'views'},data||{}),location.origin==='null'?'*':location.origin);}
 function status(message){if(statusNode)statusNode.textContent=message;}
 function game(){return document.querySelector('.pgv-card')?window.__views:null;}
 function snapshot(){var g=game();if(!g)return {version:1,screen:'menu'};var s=g.state;return {version:1,screen:'game',level:s.Z.li,qno:s.qno,h:s.h.slice(),sec:s.sec,wrong:s.wrong,timed:s.timed,over:s.over||restoredOver,mode:s.mode,target:s.TGT,savedAt:Date.now()};}
 function save(){if(restoring)return;var s=snapshot();if(s.screen==='game')undoBoundary=Math.min(undoBoundary,window.__views.state.hist);try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch(e){storageAvailable=false;status('瀏覽器未允許儲存；本次操作仍可繼續。');}if(s.screen==='game')notify('cheetah-game-state',{state:Object.assign({},window.__views.state,{over:s.over}),persisted:storageAvailable});}
 function stored(){try{var s=JSON.parse(localStorage.getItem(STORAGE_KEY));if(!s||s.version!==1)return null;if(s.screen==='menu')return s;if(s.screen!=='game'||!Number.isInteger(s.level)||s.level<0||s.level>2||!Number.isInteger(s.qno)||s.qno<1||s.qno>1000000||!Array.isArray(s.h)||s.h.length!==9||s.h.some(function(x){return !Number.isInteger(x)||x<0||x>3;})||!Number.isFinite(s.sec)||s.sec<0||s.sec>86400||!Number.isInteger(s.wrong)||s.wrong<0||s.wrong>1000||typeof s.timed!=='boolean')return null;return s;}catch(e){return null;}}
 function completedLock(value){restoredOver=!!value;var card=document.querySelector('.pgv-card');if(card){card.classList.toggle('views-restored-complete',restoredOver);card.querySelectorAll('.pgv-pad button,.pgv-acts button').forEach(function(b){b.disabled=restoredOver;});}}
 function restore(s){
  if(!s||s.screen!=='game')return false;
  restoring=true;var previousActive=active,restored=false;active=false;
  try{
   var levels=document.querySelectorAll('.pgm-level');if(!levels[s.level])throw new Error('找不到原遊戲難度選單');levels[s.level].click();
   var g=window.__views;
   // load() avoids the previous model. Move away first if the saved model is already current.
   if(g.state.qno===s.qno||JSON.stringify(g.state.TGT)===JSON.stringify(s.target))g.load(s.qno+1,true,false);
   g.load(s.qno,true,false);
   if(g.state.qno!==s.qno||JSON.stringify(g.state.TGT)!==JSON.stringify(s.target))throw new Error('原題目與保存記錄不一致');
   if(g.state.timed!==s.timed)g.bMode.click();
   g.mAdd.click();
   // One cube cannot solve an original puzzle. Replay failed submissions to restore penalties.
   if(s.wrong){g.keys[0].click();for(var j=0;j<s.wrong;j++)g.bSub.click();g.bClr.click();}
   s.h.forEach(function(height,i){for(var z=0;z<height;z++)g.keys[i].click();});
   g.tick(s.sec);
   if(s.mode==='rem')g.mRem.click();
   var actual=g.state;
   if(actual.qno!==s.qno||actual.h.join(',')!==s.h.join(',')||actual.sec!==s.sec||actual.wrong!==s.wrong||actual.timed!==s.timed)throw new Error('盤面驗證未通過');
   undoBoundary=actual.hist;completedLock(s.over);
   status(s.over?'已恢復上次結束盤面，計分不重送；按「重設」開始新一輪。':'已恢復題號、難度、盤面、模式、時間與錯誤次數。');
   g.msg.textContent=s.over?'已恢復結束盤面，供講解查看。按下方「重設」重新開始。':'已恢復上次盤面；重新載入前的還原歷程與視角未保存。';
   restored=true;
  }catch(e){completedLock(false);status('無法完整恢復：'+e.message+'。可重新選題繼續。');notify('cheetah-game-restore-error',{message:e.message});}
  finally{restoring=false;active=previousActive;if(restored)save();}
  return restored;
 }
 function run(action){
  if(action==='exit'){save();notify('cheetah-game-exit');return;}
  var g=game();if(!g){status('請先選擇暖身、中等或困難。');return;}
  if(action==='reset'){completedLock(false);g.bRe.click();undoBoundary=0;status('已重設本題；可重新開始。');}
  if(action==='undo')g.bUndo.click();
  if(action==='check'&&!restoredOver)g.bSub.click();
  if(action==='answer'){
   // Teacher demonstration uses the generated valid model in unscored practice mode.
   completedLock(false);g.bRe.click();undoBoundary=0;
   if(g.state.timed)g.bMode.click();g.bClr.click();g.mAdd.click();
   g.state.Z.h.forEach(function(height,i){for(var z=0;z<height;z++)g.keys[i].click();});
   g.msg.textContent='老師示範：這是符合三視圖的一種拼法。也可能有其他正確答案。';status('答案示範已切換為不計分的練習模式。');
  }
  save();
 }
 window.addEventListener('message',function(e){if(e.source!==window.parent||e.origin!==location.origin)return;var d=e.data||{};if(d.type==='cheetah-game-visibility'){save();active=!!d.active;return;}if(d.type==='cheetah-game-action')run(d.action);});
 document.addEventListener('click',function(e){
  var back=e.target.closest('.pl-head__back');if(back){e.preventDefault();save();notify('cheetah-game-exit');return;}
  var undo=e.target.closest('.pgv-undo'),g=game();
  if(undo&&g&&g.state.hist<=undoBoundary){e.preventDefault();e.stopImmediatePropagation();g.msg.textContent='已回到恢復時的盤面；重新載入前的還原歷程未保存。';return;}
  if(e.target.closest('.pgm-level')){undoBoundary=0;completedLock(false);}
  if(g&&(e.target===g.bRe||e.target===g.bMode||e.target===g.bSwap)){undoBoundary=0;completedLock(false);}
  if(!e.target.closest('.views-teacher-controls'))setTimeout(save,0);
 },true);
 document.addEventListener('pointerup',function(){setTimeout(save,0);},{passive:true});
 document.addEventListener('visibilitychange',function(){save();active=!document.hidden;});
 window.addEventListener('pagehide',save);
 window.addEventListener('load',function(){
  var bar=document.createElement('footer');bar.className='views-teacher-controls';bar.setAttribute('aria-label','老師遊戲控制列');
  var buttons=document.createElement('div');buttons.className='views-teacher-buttons';
  [['reset','↻ 重設'],['undo','↶ 還原一步'],['check','✓ 檢查'],['answer','顯示答案'],['exit','退出本關']].forEach(function(pair){var b=document.createElement('button');b.type='button';b.textContent=pair[1];b.dataset.teacherAction=pair[0];b.onclick=function(){run(pair[0]);};buttons.appendChild(b);});
  statusNode=document.createElement('span');statusNode.className='views-save-status';statusNode.setAttribute('aria-live','polite');statusNode.textContent='自動保存題號與盤面；重新載入前的還原歷程與視角不保存。';bar.appendChild(buttons);bar.appendChild(statusNode);document.body.appendChild(bar);
  var saved=stored(),didRestore=saved?restore(saved):false;notify('cheetah-game-ready',{persisted:storageAvailable,restored:didRestore});
 });
 window.CheetahViewsBridge={action:run,setActive:function(value){save();active=!!value;},save:save,getSnapshot:snapshot};
})();
