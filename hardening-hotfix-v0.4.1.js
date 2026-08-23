(()=>{"use strict";
if(window.__BLACKBOX_HOTFIX_042__)return;window.__BLACKBOX_HOTFIX_042__=true;
const CDN_HOWLER="https://cdn.jsdelivr.net/npm/howler@2.2.4/dist/howler.min.js";
const load=src=>new Promise(resolve=>{const s=document.createElement("script");s.src=src;s.onload=()=>resolve(true);s.onerror=()=>resolve(false);document.head.appendChild(s)});
const waitFor=(fn,limit=600)=>new Promise(resolve=>{let n=0;const tick=()=>{const v=fn();if(v||n++>limit)return resolve(v||null);requestAnimationFrame(tick)};tick()});

const held=new Set();
const keyName={ArrowLeft:"ArrowLeft",ArrowRight:"ArrowRight",ArrowUp:"ArrowUp",ArrowDown:"ArrowDown"};
function setKey(code,on){
 if(on&&!held.has(code)){held.add(code);window.dispatchEvent(new KeyboardEvent("keydown",{key:keyName[code],code,bubbles:true,cancelable:true}))}
 else if(!on&&held.has(code)){held.delete(code);window.dispatchEvent(new KeyboardEvent("keyup",{key:keyName[code],code,bubbles:true,cancelable:true}))}
}
function clearKeys(){for(const code of [...held])setKey(code,false)}
function applyVector(dx,dy){const d=.14;setKey("ArrowLeft",dx<-d);setKey("ArrowRight",dx>d);setKey("ArrowUp",dy<-d);setKey("ArrowDown",dy>d)}
function bindStick(zone){
 if(!zone||zone.dataset.keyboardBridge)return;zone.dataset.keyboardBridge="1";
 zone.style.touchAction="none";zone.style.webkitUserSelect="none";
 let pointerId=null;
 const pos=(x,y)=>{const r=zone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=(x-cx)/(r.width*.32),dy=(y-cy)/(r.height*.32),m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}applyVector(dx,dy);zone.style.boxShadow="0 0 22px rgba(255,180,84,.28) inset,0 0 18px rgba(255,180,84,.15)"};
 const end=()=>{pointerId=null;clearKeys();zone.style.boxShadow=""};
 zone.addEventListener("pointerdown",e=>{e.preventDefault();pointerId=e.pointerId;try{zone.setPointerCapture(e.pointerId)}catch(_){}pos(e.clientX,e.clientY)},{capture:true,passive:false});
 zone.addEventListener("pointermove",e=>{if(pointerId===e.pointerId){e.preventDefault();pos(e.clientX,e.clientY)}},{capture:true,passive:false});
 zone.addEventListener("pointerup",e=>{if(pointerId===e.pointerId){e.preventDefault();end()}},{capture:true,passive:false});
 zone.addEventListener("pointercancel",end,{capture:true,passive:false});
 zone.addEventListener("touchstart",e=>{if(!e.touches.length)return;e.preventDefault();const t=e.touches[0];pos(t.clientX,t.clientY)},{capture:true,passive:false});
 zone.addEventListener("touchmove",e=>{if(!e.touches.length)return;e.preventDefault();const t=e.touches[0];pos(t.clientX,t.clientY)},{capture:true,passive:false});
 zone.addEventListener("touchend",end,{capture:true,passive:false});
 zone.addEventListener("touchcancel",end,{capture:true,passive:false});
 window.addEventListener("blur",clearKeys);document.addEventListener("visibilitychange",()=>{if(document.hidden)clearKeys()});
}

function toneURI(freq=440,duration=.08,volume=.9,slide=0){const sr=11025,n=Math.max(1,Math.floor(sr*duration)),buf=new Uint8Array(44+n),dv=new DataView(buf.buffer),w=(o,t)=>{for(let i=0;i<t.length;i++)buf[o+i]=t.charCodeAt(i)};w(0,"RIFF");dv.setUint32(4,36+n,true);w(8,"WAVE");w(12,"fmt ");dv.setUint32(16,16,true);dv.setUint16(20,1,true);dv.setUint16(22,1,true);dv.setUint32(24,sr,true);dv.setUint32(28,sr,true);dv.setUint16(32,1,true);dv.setUint16(34,8,true);w(36,"data");dv.setUint32(40,n,true);for(let i=0;i<n;i++){const t=i/sr,f=freq+slide*i/n,env=Math.exp(-4*i/n),v=Math.sin(Math.PI*2*f*t)+.28*Math.sin(Math.PI*4*f*t);buf[44+i]=Math.max(0,Math.min(255,128+v*72*volume*env))}let bin="";for(let i=0;i<buf.length;i++)bin+=String.fromCharCode(buf[i]);return"data:audio/wav;base64,"+btoa(bin)}

(async()=>{
 const zone=await waitFor(()=>document.getElementById("joystick-zone"));if(zone)bindStick(zone);
 if(!window.Howl)await load(CDN_HOWLER);if(!window.Howl)return;
 const unlock=()=>{try{if(window.Howler&&window.Howler.ctx&&window.Howler.ctx.state!=="running")window.Howler.ctx.resume()}catch(e){}};
 document.addEventListener("pointerdown",unlock,{capture:true});document.addEventListener("touchstart",unlock,{capture:true,passive:true});document.addEventListener("keydown",unlock,{capture:true});
 const sfx={fire:new Howl({src:[toneURI(820,.055,.95,-150)],volume:.42}),hit:new Howl({src:[toneURI(150,.16,1,-80)],volume:.55}),kill:new Howl({src:[toneURI(310,.11,.95,250)],volume:.42}),pickup:new Howl({src:[toneURI(640,.16,.95,560)],volume:.48}),bomb:new Howl({src:[toneURI(95,.4,1,-35)],volume:.68}),shield:new Howl({src:[toneURI(940,.13,.8,-190)],volume:.42})};
 const play=n=>{try{unlock();sfx[n]&&sfx[n].play()}catch(e){}};
 await waitFor(()=>typeof firePlayer==="function"&&typeof applyPowerup==="function"&&typeof hitPlayer==="function"&&typeof useBomb==="function"&&typeof killEnemy==="function");
 if(window.__BLACKBOX_AUDIO_PATCHED_042__)return;window.__BLACKBOX_AUDIO_PATCHED_042__=true;
 const f=firePlayer;firePlayer=function(){f();play("fire")};const a=applyPowerup;applyPowerup=function(type){a(type);play(type==="shield"?"shield":"pickup")};const h=hitPlayer;hitPlayer=function(){play("hit");h()};const b=useBomb;useBomb=function(){const before=player.bombs;b();if(player.bombs<before)play("bomb")};const k=killEnemy;killEnemy=function(e,award){k(e,award);if(award)play("kill")};
})();
})();
