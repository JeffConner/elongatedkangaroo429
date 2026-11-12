/* core: state, memory, sound, voice, faces, scene manager, router */
(()=>{
"use strict";
const J=window.J={};J.VERSION="2.3";J.C={bone:"#d9cfb8",ink:"#d9cfb8",rust:"#9a3a1c"};
const $=s=>document.querySelector(s);
J.$=$;
J.el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
J.txt=(tag,cls,t)=>{const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=t;return e};
J.reduce=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);

/* ---------- random ---------- */
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
J.mk=mulberry;
const qs=new URLSearchParams(location.search);
J.seed=qs.get("seed")?(+qs.get("seed")>>>0):((Date.now()^Math.floor(Math.random()*1e9))>>>0);
J.rnd=mulberry(J.seed);
J.pick=a=>a[Math.floor(J.rnd()*a.length)];
J.ri=(a,b)=>a+Math.floor(J.rnd()*(b-a+1));
J.shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(J.rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

/* ---------- state and memory ---------- */
const LS="jeffbook6";
let prev=null;try{prev=JSON.parse(localStorage.getItem(LS)||"null")}catch(e){}
try{const qv=+qs.get("v"),qk=qs.get("k");if(qv>1&&(!prev||(prev.visits||0)<qv-1)){prev=Object.assign(qk?JSON.parse(decodeURIComponent(escape(atob(qk.replace(/-/g,"+").replace(/_/g,"/"))))):{},{visits:qv-1,last:Date.now()-60000})}}catch(e){}
const S=J.S={raw:"",face:1,no:0,teeth:32,inv:[],done:0,run:[],seen:(prev&&prev.seen)||[],away:0,awayMs:0,fast:0,slow:0,defy:0,t0:0,
  visits:((prev&&prev.visits)||0)+1,prev:prev,called:false,invite:null,delivered:false,callAt:2,msgAt:1};
J.RUN=qs.get("run")?+qs.get("run"):7;
J.save=()=>{try{localStorage.setItem(LS,JSON.stringify({visits:S.visits,no:S.no,face:S.face,teeth:S.teeth,inv:S.inv,last:Date.now(),raw:S.raw,seen:S.seen,order:S.order,tb:S.tb,lastRun:S.run,lastF:S.frames||[],mem:S.memo||{}}))}catch(e){}};
try{
  const m=location.hash.match(/j=([\w-]+)/);
  if(m){const o=JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g,"+").replace(/_/g,"/")))));S.invite={n:Math.abs(parseInt(o.n,10)||0),m:String(o.m||"").slice(0,110)}}
}catch(e){}
J.inviteURL=msg=>{
  const b=btoa(unescape(encodeURIComponent(JSON.stringify({n:S.no,m:(msg||"").slice(0,110)})))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
  return location.origin+location.pathname+"#j="+b;
};
J.mem=1204+J.ri(0,900);
J.carry=()=>{const k=btoa(unescape(encodeURIComponent(JSON.stringify({no:S.no,face:S.face,raw:S.raw,teeth:S.teeth,order:S.order,tb:S.tb,seen:S.seen,lastRun:S.run,lastF:S.frames||[],mem:S.memo||{}})))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");return location.pathname+"?v="+(S.visits+1)+"&k="+k};

/* ---------- things your own browser says about you ---------- */
J.clock=(off)=>{const d=new Date(Date.now()+(off||0)*6e4);const h=d.getHours(),m=d.getMinutes();return((h%12)||12)+":"+(m<10?"0":"")+m+(h<12?" am":" pm")};
J.city=(()=>{try{const z=Intl.DateTimeFormat().resolvedOptions().timeZone||"";const c=z.split("/").pop().replace(/_/g," ");return c&&c!=="UTC"?c:"your town"}catch(e){return"your town"}})();
J.dev=/iPhone/.test(navigator.userAgent)?"iPhone":/iPad/.test(navigator.userAgent)?"iPad":/Android/.test(navigator.userAgent)?"phone":"computer";
J.ago=ms=>{const m=Math.round(ms/6e4);return m<2?"about a minute":m<120?m+" minutes":m<2880?Math.round(m/60)+" hours":Math.round(m/1440)+" days"};
J.fill=s=>s.replace(/\{(\w+)\}/g,(m,k)=>{
  const o={t:J.clock(),t4:J.clock(4),city:J.city,dev:J.dev,teeth:S.teeth,teeth1:S.teeth+1,no:S.no,raw:S.raw||"nothing",w:window.innerWidth,
    mem:J.mem.toLocaleString("en-US"),item:S.inv[S.inv.length-1]||"nothing yet",day:new Date().toLocaleDateString("en-US",{weekday:"long"})};
  if(J.D&&k in J.D){if(J.D[k]==null){J._miss=1;return""}return J.D[k]}return k in o?o[k]:m;
});
J.rot=(s,lvl)=>s.split(" ").map(w=>w.length>3&&w.indexOf("\n")<0&&J.rnd()<lvl*0.03?(J.rnd()<.6?"teeth":"jeff"):w).join(" ");

/* ---------- timers that die with the scene ---------- */
let timers=[];
J.after=(ms,f)=>{const id=setTimeout(f,ms);timers.push(()=>clearTimeout(id));return id};
J.every=(ms,f)=>{const id=setInterval(f,ms);timers.push(()=>clearInterval(id));return id};
J.onClean=f=>timers.push(f);
J.wait=ms=>new Promise(r=>J.after(ms,r));
J.raf=f=>{let on=true,last=0;const loop=t=>{if(!on)return;const dt=Math.min(0.1,(t-last)/1000||0.016);last=t;f(t/1000,dt);requestAnimationFrame(loop)};requestAnimationFrame(loop);timers.push(()=>{on=false})};

/* ---------- scenes ---------- */
const scenes={};
J.scene=(n,f)=>{scenes[n]=f};
J.go=(n,arg)=>{
  timers.forEach(f=>{try{f()}catch(e){}});timers=[];
  const st=$("#stage");st.innerHTML="";st.className="s-"+n;window.scrollTo(0,0);J.cur=n;
  try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}
  A.static(0);A.ring(false);
  scenes[n](st,arg);
};
const POOL=J.POOL=["mouth","dm","market","live","memory","mirror","confess","ghost","hold","event"];
J.nextScene=list=>{
  const left=(list||POOL).filter(p=>S.run.indexOf(p)<0);
  const old=(S.prev&&S.prev.seen)||[];
  const w=left.map(p=>{let x=1;if(old.indexOf(p)<0)x+=1.6;if(S.fast>2&&(p==="hold"||p==="confess"))x+=1.4;if(S.defy>1&&(p==="ghost"||p==="mirror"))x+=1.2;if(S.away>0&&(p==="live"||p==="event"))x+=1.2;if(S.slow>1&&(p==="dm"||p==="live"))x+=1;return x});
  let r=J.rnd()*w.reduce((a,b)=>a+b,0);
  for(let i=0;i<left.length;i++){r-=w[i];if(r<=0)return left[i]}
  return left[0];
};
J.finish=name=>J.unitDone(name);

/* ---------- sound ---------- */
const A=J.A={};let ac=null,master=null,noiseBuf=null,brown=null,lp=null,dg=null,stG=null,ringT=0;
J.sound=true;
A.init=()=>{
  if(ac){if(ac.state==="suspended")ac.resume();return}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  try{ac=new C()}catch(e){ac=null;return}
  master=ac.createGain();master.gain.value=J.sound?1:0;master.connect(ac.destination);
  lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=150;lp.Q.value=5;
  dg=ac.createGain();dg.gain.value=0.0001;dg.gain.exponentialRampToValueAtTime(0.13,ac.currentTime+7);
  const TH=J.TH||{f:55,w:"sawtooth",lp:150};lp.frequency.value=TH.lp;[[TH.f,TH.w],[TH.f*1.011,TH.w],[TH.f/2,"sine"],[TH.f*1.507,"triangle"]].forEach(d=>{const o=ac.createOscillator();o.type=d[1];o.frequency.value=d[0];o.connect(lp);o.start()});
  const lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=0.06;lg.gain.value=70;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
  lp.connect(dg);dg.connect(master);
  noiseBuf=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);const ch=noiseBuf.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;
  const s=ac.createBufferSource();s.buffer=noiseBuf;s.loop=true;const bp=ac.createBiquadFilter();bp.type="bandpass";bp.frequency.value=1800;bp.Q.value=0.6;
  stG=ac.createGain();stG.gain.value=0;s.connect(bp);bp.connect(stG);stG.connect(master);s.start();
  (function sched(){setTimeout(()=>{if(!document.hidden&&J.cur!=="gate")A.clank(0.15+Math.random()*0.25);sched()},6000+Math.random()*11000)})();
};
A.level=n=>{if(!ac)return;try{lp.frequency.setTargetAtTime((J.TH?J.TH.lp:150)+n*45,ac.currentTime,2);dg.gain.setTargetAtTime(0.13+n*0.02,ac.currentTime,2)}catch(e){}};
A.static=v=>{if(!ac||!stG)return;stG.gain.setTargetAtTime(v,ac.currentTime,0.15)};
A.blip=(f,d,type,vol,slide,when)=>{
  if(!ac)return;const t=ac.currentTime+(when||0),o=ac.createOscillator(),g=ac.createGain();
  const pm=J.TH?J.TH.pm:1;o.type=type||"sine";o.frequency.setValueAtTime(f*pm,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide*pm,t+d);
  g.gain.setValueAtTime(vol||0.2,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+0.03);
};
A.clank=vol=>{
  if(!ac)return;const t=ac.currentTime,s=ac.createBufferSource(),bp=ac.createBiquadFilter(),g=ac.createGain();
  s.buffer=noiseBuf;bp.type="bandpass";bp.frequency.value=500+Math.random()*2200;bp.Q.value=14;
  g.gain.setValueAtTime(vol||0.5,t);g.gain.exponentialRampToValueAtTime(0.0001,t+0.4);s.connect(bp);bp.connect(g);g.connect(master);s.start(t);s.stop(t+0.45);
};
A.click=()=>A.blip(1500+Math.random()*900,0.025,"square",0.05);
A.thump=()=>{A.blip(72,0.22,"sine",0.5,38);J.buzz(30)};
A.beat=()=>{A.blip(60,0.16,"sine",0.55,40);A.blip(52,0.18,"sine",0.4,36,0.22);J.buzz([25,180,25])};
A.crunch=()=>{A.clank(0.5);A.blip(180,0.08,"square",0.12,60);J.buzz(50)};
A.pop=()=>A.blip(160+Math.random()*40,0.12,"triangle",0.08);
A.ring=on=>{
  clearInterval(ringT);if(!on)return;
  const r=()=>{A.blip(880,0.35,"sine",0.12);A.blip(1100,0.35,"sine",0.1);A.blip(880,0.35,"sine",0.12,null,0.5);A.blip(1100,0.35,"sine",0.1,null,0.5);J.buzz([300,200,300])};
  r();ringT=setInterval(r,2400);
};
J.buzz=p=>{if(!S.t0)return;try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
$("#snd").addEventListener("click",function(){J.sound=!J.sound;this.textContent="sound: "+(J.sound?"on":"off");if(ac)master.gain.value=J.sound?1:0;if(!J.sound){try{speechSynthesis.cancel()}catch(e){}}});

/* ---------- the voice ---------- */
J.say=(t,o)=>{
  o=o||{};
  try{
    if(!("speechSynthesis" in window)||!J.sound)return;
    const u=new SpeechSynthesisUtterance(t);u.pitch=Math.max(0,Math.min(2,(o.pitch==null?0.2:o.pitch)+(J.TH?J.TH.vp:0)));u.rate=Math.max(0.4,(o.rate==null?0.7:o.rate)*(J.TH?J.TH.vr:1));u.volume=o.vol==null?0.9:o.vol;u.lang="en-US";
    speechSynthesis.speak(u);
  }catch(e){}
};

/* ---------- toasts and cuts ---------- */
J.toast=(text,ms,head)=>{
  const t=J.el("div","toast");t.appendChild(J.txt("b","",head||"JEFFBOOK  now"));t.appendChild(document.createTextNode(text));
  $("#toasts").appendChild(t);A.blip(1250,0.07,"sine",0.06);A.blip(1650,0.1,"sine",0.05,null,0.08);
  setTimeout(()=>t.remove(),ms||4200);
};
let lastCut=0;
J.cut=(word,ms)=>{
  if(J.reduce)return;const now=Date.now();if(now-lastCut<2500)return;lastCut=now;
  $("#cut").textContent=word;document.body.classList.add("cut");A.clank(0.6);J.buzz(40);
  setTimeout(()=>document.body.classList.remove("cut"),ms||80);
};
const AMBIENT=["Jeff poked you.","Jeff poked you. From the inside of the screen.","Jeff liked a photo you haven't taken yet.","Jeff is {w} pixels away.","Jeff changed your relationship status to 'contained'.",
  "Your {dev} is warm. That's him.","Jeff mentioned you in a comment: 'soon'.","Jeff and 1,203 others are looking at this notification with you.","Reminder: you have {teeth} teeth. Jeff has the rest.",
  "Jeff is typing.","Jeff is typing on something that isn't a keyboard.","It is {t} in {city}. Jeff is also in {city}.","Jeff updated his profile picture. It's yours.","You have a memory with Jeff from tomorrow.",
  "Jeff shared a location: the other side of your door.","Jeff reacted to your breathing.","Someone you may know: you."];
setInterval(()=>{if(!(S.t0&&!document.hidden&&J.cur!=="call"&&J.cur!=="final"&&!J.quiet&&Math.random()<0.5))return;for(let i=0;i<6;i++){J._miss=0;const t=J.fill(J.draw("amb",J.mock?J.MOCKT:J.AMB));if(!J._miss){if(!(J.toastHook&&J.toastHook(t)))J.toast(t,0,J.TOASTHEAD);break}}},24000);
setInterval(()=>{if(S.t0&&!document.hidden&&S.done>1&&Math.random()<0.25)J.cut(["MORE","UNDER","COUNT","JEFF","STILL HERE","YOURS","OPEN"][Math.floor(Math.random()*7)])},15000);

/* ---------- it notices when you look away ---------- */
let hidAt=0;const realTitle=document.title;
document.addEventListener("visibilitychange",()=>{
  if(document.hidden){hidAt=Date.now();document.title="come back jeff"}
  else{
    document.title=realTitle;
    if(hidAt&&S.t0){const ms=Date.now()-hidAt;S.away++;S.awayMs+=ms;const s=Math.max(1,Math.round(ms/1000));
      const AW=["You were gone {s}. We used them.","{s} away. The apps rearranged themselves while you were out.","{s} off air. The broadcast did not stop for you. It never stops for anyone.","{s} gone. The house moved one room closer.","{s}. Again. You keep doing that."];
      const aw=(AW[S.ed<4?S.ed:4]||AW[0]).replace("{s}",s+(s===1?" second":" seconds"));setTimeout(()=>{if(!(J.toastHook&&J.toastHook(aw)))J.toast(aw,0,J.TOASTHEAD)},600)}
    hidAt=0;
  }
});

/* ---------- grain ---------- */
(()=>{const gr=$("#grain"),gx=gr.getContext("2d"),gi=gx.createImageData(96,170);
  const draw=()=>{const d=gi.data;for(let i=0;i<d.length;i+=4){const v=Math.random()*255|0;d[i]=v;d[i+1]=v*0.94|0;d[i+2]=v*0.82|0;d[i+3]=255}gx.putImageData(gi,0,0)};
  draw();if(!J.reduce)setInterval(()=>{if(!document.hidden)draw()},110)})();

/* ---------- faces ---------- */
J.face=(c,seed,wrong,o)=>{
  o=o||{};wrong=wrong||0;
  const g=c.getContext("2d"),w=c.width,h=c.height,r=mulberry((seed|0)*7919+13),cx=w/2,cy=h/2,R=Math.min(w,h)*0.42;
  g.fillStyle=o.bg||"#14110d";g.fillRect(0,0,w,h);
  g.strokeStyle=J.C.ink;g.lineWidth=Math.max(1,w/90);g.fillStyle="rgba(217,207,184,.08)";
  g.beginPath();g.ellipse(cx,cy,R*(0.78+r()*0.12),R*(1+r()*0.06),0,0,6.3);g.fill();g.stroke();
  const ne=2+(wrong>0.35?Math.floor(r()*wrong*5):0),ey=cy-R*(0.2+r()*0.1),ex=R*(0.3+r()*0.08);
  const eyes=[[cx-ex,ey],[cx+ex,ey]];for(let i=2;i<ne;i++)eyes.push([cx+(r()-0.5)*R*1.1,cy+(r()-0.8)*R*1.1]);
  eyes.forEach((p,i)=>{
    const er=R*(0.11+r()*0.05)*(i>1?0.7:1),x=p[0]+(r()-0.5)*R*wrong*0.25,y=p[1]+(r()-0.5)*R*wrong*0.2;
    g.fillStyle="#050403";g.beginPath();g.ellipse(x,y,er*1.3,er,0,0,6.3);g.fill();g.stroke();
    g.fillStyle=J.C.ink;g.beginPath();g.arc(x+(o.lx||0)*er*0.6,y+(o.ly||0)*er*0.45,er*0.28,0,6.3);g.fill();
  });
  const open=o.open==null?wrong:o.open,mw=R*(0.36+wrong*0.42+r()*0.08),mo=R*(0.035+open*0.33),my=cy+R*0.5;
  g.fillStyle="#050403";g.beginPath();g.ellipse(cx,my,mw,mo+R*0.03,0,0,6.3);g.fill();g.stroke();
  const nt=Math.floor(6+wrong*16),th=mo*0.55+R*0.02,tw=mw*1.7/nt*0.8;g.fillStyle=J.C.ink;
  for(let i=0;i<nt;i++){
    const t=(i+0.5)/nt*2-1,s=Math.sqrt(Math.max(0,1-t*t)),x=cx+t*mw*0.92;
    g.fillRect(x-tw/2,my-mo*s,tw,th*s+1);
    if(wrong>0.3)g.fillRect(x-tw/2,my+mo*s-th*s,tw,th*s);
    if(wrong>0.7&&i%2)g.fillRect(x-tw/2,my-mo*s*0.3,tw*0.8,th*s*0.6);
  }
};
J.avatar=(seed,size,wrong)=>{const c=document.createElement("canvas");c.width=c.height=size||72;J.face(c,seed,wrong||0);return c};
J.wrong=()=>Math.min(1,S.done/J.RUN*0.9+(S.visits>1?0.1:0));
})();
