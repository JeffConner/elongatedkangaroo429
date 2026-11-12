/* visit 3: WJEF 32. One overnight broadcast inside a television that does not scroll.
   You move through it with the remote: CH+ / CH- tune to programs, OK and the pad under it do everything else. */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;
const U=["t-poll","t-lullaby","t-seccam","t-panel","t-lottery","t-race","t-silence"];
const TK=[];let tkCur=null,tkX=0;const doneAt={};
J.frame("tv",{hub:"t-tv",end:"t-signoff",units:U,label:"the overnight broadcast",
  onEnter(){J.toastHook=t=>{TK.unshift(String(t).toUpperCase());return true}}});
Object.assign(J.DID,{"t-poll":"phoned in a vote made of teeth","t-lullaby":"sang back to Nana Jeff","t-seccam":"watched a parking lot until it watched back",
  "t-panel":"turned down nine of the same man","t-lottery":"won one Jeff in a lottery","t-race":"typed against a ghost of himself","t-silence":"held a moment of silence for himself"});

/* ---------- colors: the glass is always dark, the plastic follows the theme ---------- */
const hex=h=>{h=String(h).replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const lum=h=>{const c=hex(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const con=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,k)=>{const x=hex(a),y=hex(b);return"#"+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,"0")).join("")};
let P=null;
const pal=()=>{
  if(P)return P;const C=J.C,light=lum(C.bg)>.4;
  const sbg=light?C.bone:mix(C.bg,"#000000",.3),ink=light?C.bg:(C.ink||C.bone);
  let acc=C.rust;if(con(acc,sbg)<3.4)acc=mix(acc,ink,.45);
  let acc2=C.bile;if(con(acc2,sbg)<3)acc2=mix(acc2,ink,.4);
  let dim=light?mix(sbg,ink,.55):C.dim;if(con(dim,sbg)<3)dim=mix(dim,ink,.4);
  P={sbg:sbg,ink:ink,acc:acc,acc2:acc2,dim:dim,off:mix(sbg,"#000000",.55),light:light};return P;
};
const HEAD='"Arial Black","Helvetica Neue",Impact,Arial,sans-serif';

/* ---------- css ---------- */
(()=>{const s=document.createElement("style");s.textContent=`
html:has(body.fr-tv){overflow:hidden}
body.fr-tv{overflow:hidden;overscroll-behavior:none}
body.fr-tv #stage{padding:0;min-height:0}
body.fr-tv .tvw{position:fixed;inset:0;z-index:20;background:var(--bg);display:flex;flex-direction:column;align-items:center;gap:10px;
  padding:calc(10px + env(safe-area-inset-top)) 10px calc(42px + env(safe-area-inset-bottom));font-family:${HEAD};touch-action:none;user-select:none;-webkit-user-select:none}
body.fr-tv .cab{flex:1;min-height:0;width:100%;max-width:520px;background:var(--panel);border:2px solid var(--line);border-radius:28px;padding:14px 14px 6px;display:flex;flex-direction:column}
body.fr-tv .crt{position:relative;flex:1;min-height:0;border-radius:38px/28px;overflow:hidden;background:var(--sbg);border:3px solid var(--line)}
body.fr-tv .crt canvas{position:absolute;left:0;top:0}
body.fr-tv .ov{position:absolute;inset:0;padding:30px 12px 32px;display:flex;flex-direction:column;justify-content:space-between;gap:8px;color:var(--sink);pointer-events:none;text-align:center}
body.fr-tv .tp{min-height:0}
body.fr-tv .md{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:10px;min-height:0}
body.fr-tv .lo{display:flex;flex-direction:column;gap:6px}
body.fr-tv .ttl{font-family:${HEAD};font-weight:900;font-size:1.55rem;line-height:1.02;color:var(--sacc);text-transform:uppercase}
body.fr-tv .sub{font-family:${HEAD};font-weight:900;font-size:.82rem;line-height:1.15;color:var(--sink);text-transform:uppercase}
body.fr-tv .cp{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;font-weight:600;font-size:.99rem;line-height:1.38;background:rgba(0,0,0,.6);color:var(--sink);padding:9px 11px;border-left:5px solid var(--sacc);text-align:left;white-space:pre-line}
body.fr-tv .lt{display:flex;text-align:left;align-items:stretch}
body.fr-tv .lt i{background:var(--sacc);color:var(--sbg);font-style:normal;font-weight:900;padding:6px 8px;font-size:.7rem;display:flex;align-items:center}
body.fr-tv .lt span{background:rgba(0,0,0,.66);padding:6px 9px;font-size:.78rem;font-weight:700;flex:1;line-height:1.25;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif}
body.fr-tv .fl{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;font-size:.8rem;font-weight:700;background:var(--sacc);color:var(--sbg);padding:6px 8px;text-align:left}
body.fr-tv .big{font-family:${HEAD};font-weight:900;font-size:1.25rem;line-height:1.2;color:var(--sink);background:rgba(0,0,0,.55);padding:8px 10px;max-width:none;animation:none}
body.fr-tv .gh{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;font-weight:700;font-size:.86rem;color:var(--sink);background:rgba(0,0,0,.55);padding:6px 9px;min-height:1.8em;text-align:left;align-self:stretch}
body.fr-tv .gd{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;font-size:.8rem;line-height:1.38;text-align:left;background:rgba(0,0,0,.6);padding:10px 11px;align-self:stretch}
body.fr-tv .gd b{color:var(--sacc);font-family:${HEAD};font-weight:900}
body.fr-tv .gd p{margin-top:5px}
body.fr-tv .strip{display:flex;justify-content:space-between;align-items:center;padding:6px 12px 0;font-size:.6rem;color:var(--dim);font-weight:900}
body.fr-tv .led{width:8px;height:8px;border-radius:50%;background:var(--line);display:inline-block}
body.fr-tv .led.on{background:var(--rust)}
body.fr-tv .rem{width:88%;max-width:380px;background:var(--panel);border:2px solid var(--line);border-radius:22px 22px 32px 32px;padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px}
body.fr-tv .r1,body.fr-tv .r2{display:flex;align-items:center;justify-content:space-between;gap:10px}
body.fr-tv .rem button{background:var(--bg);color:var(--bone);border:1px solid var(--dim);border-radius:12px;font-family:${HEAD};font-weight:900;font-size:.72rem;padding:12px 0;min-width:66px;touch-action:manipulation}
body.fr-tv .rem button:active{background:var(--dried)}
body.fr-tv .rem button[disabled]{opacity:.32}
body.fr-tv .rem .pw{color:var(--rust);border:2px solid var(--rust);border-radius:50%;width:46px;height:46px;min-width:0;padding:0;font-size:.52rem}
body.fr-tv .rem .ok{width:76px;height:76px;border-radius:50%;font-size:.78rem;border-width:2px;padding:0}
body.fr-tv .rem .ok.hot{border-color:var(--rust);color:var(--rust)}
body.fr-tv .disp{flex:1;text-align:center;font-family:"Courier New",monospace;font-weight:700;font-size:1rem;color:var(--bone);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:7px}
body.fr-tv .pad{min-height:84px;display:flex;align-items:stretch;gap:6px;flex-wrap:wrap}
body.fr-tv .pad .lbl{flex:1;display:flex;align-items:center;justify-content:center;color:var(--dim);font-size:.62rem;border:1px dashed var(--line);border-radius:10px;text-align:center;padding:4px}
body.fr-tv .pad button{flex:1;min-width:0;padding:8px 4px}
body.fr-tv .pad input{flex:1 1 100%;font-size:16px;padding:9px 10px;background:var(--bg);color:var(--bone);border:1px solid var(--dim);border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,Arial,sans-serif;outline:none;min-width:0}
body.fr-tv .pad .trk{flex:1;border:1px solid var(--dim);border-radius:14px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--dim);font-size:.66rem;touch-action:none}
body.fr-tv .pad .fd{position:relative;flex:1;min-width:0;height:84px;border:1px solid var(--dim);border-radius:6px;background:var(--bg);touch-action:none;overflow:hidden}
body.fr-tv .pad .fd b{position:absolute;left:0;right:0;bottom:0;background:var(--dried)}
body.fr-tv .pad .fd i{position:absolute;left:2px;right:2px;height:10px;border-radius:3px;background:var(--bone)}
body.fr-tv .pad .hands{flex:1;border:2px dashed var(--rust);border-radius:14px;display:flex;align-items:center;justify-content:center;color:var(--rust);font-size:.8rem}
`;document.head.appendChild(s)})();

/* ---------- the set ---------- */
const HEADLINES=["LOCAL MAN COUNTS HIS TEETH TWICE, GETS TWO NUMBERS, KEEPS BOTH","{city} WEATHER: CLEAR, WITH A CHANCE OF SOMEONE IN THE BACK SEAT","STUDY: 9 OUT OF 10 JEFFS RECOMMEND JEFF",
  "POLICE SEEK MAN LAST SEEN BEING YOU","SCHOOLS CLOSED TOMORROW DUE TO JEFF","TRAFFIC: ALL LANES MOVING TOWARD YOUR HOUSE","SPORTS: JEFF 32, JEFF 32, GAME CONTINUES INTO A NINTH DAY",
  "MARKETS: TEETH UP, YOU DOWN","REMINDER: THIS STATION CAN SEE THE ROOM IT IS ON IN","LOST: ONE REMOTE. IF FOUND IT WILL FIND YOU","OVERNIGHT LOW: THE BASEMENT",
  "{model} OWNERS ASKED TO HOLD THEIR PHONES A LITTLE CLOSER","CITY COUNCIL VOTES 32-0 TO BECOME JEFF","LOCAL DENTIST FINDS A SECOND MOUTH, WILL NOT SAY WHOSE"];
let TB=null;
const nextHead=()=>{if(TK.length)return TK.shift();if(!TB||!TB.length)TB=J.shuffle(HEADLINES);for(let i=0;i<4;i++){J._miss=0;const h=J.fill(TB.pop()||"WJEF 32");if(!J._miss)return h.toUpperCase();if(!TB.length)TB=J.shuffle(HEADLINES)}return"WJEF 32 ALL NIGHT"};
const CH=u=>U.indexOf(u)+2;
let ch=1;
function tv(st,o){
  o=o||{};const p=pal();
  const w=el("div","tvw");st.appendChild(w);
  [["--sbg",p.sbg],["--sink",p.ink],["--sacc",p.acc],["--sacc2",p.acc2],["--sdim",p.dim]].forEach(v=>w.style.setProperty(v[0],v[1]));
  const cab=el("div","cab"),crt=el("div","crt"),cv=document.createElement("canvas"),ov=el("div","ov");
  const tp=el("div","tp"),md=el("div","md"),lo=el("div","lo");ov.appendChild(tp);ov.appendChild(md);ov.appendChild(lo);
  crt.appendChild(cv);crt.appendChild(ov);cab.appendChild(crt);
  const strip=el("div","strip"),led=el("i","led");strip.appendChild(txt("span","","JEFFTRON 32"));strip.appendChild(led);strip.appendChild(txt("span","","SOLID STATE (MOSTLY)"));cab.appendChild(strip);w.appendChild(cab);
  const rem=el("div","rem"),r1=el("div","r1"),r2=el("div","r2"),pad=el("div","pad");
  const pw=txt("button","pw","POWER"),disp=txt("div","disp","CH --"),dn=txt("button","","CH −"),ok=txt("button","ok","OK"),up=txt("button","","CH +");
  pw.type=dn.type=ok.type=up.type="button";
  r1.appendChild(pw);r1.appendChild(disp);r2.appendChild(dn);r2.appendChild(ok);r2.appendChild(up);rem.appendChild(r1);rem.appendChild(r2);rem.appendChild(pad);w.appendChild(rem);
  const T={w:w,ov:ov,tp:tp,md:md,lo:lo,pad:pad,pw:pw,ok:ok,up:up,dn:dn,disp:disp,led:led,on:o.on!==false,snow:o.snow==null?.6:o.snow,floor:0,pic:null,post:null,tick:o.tick!==false,bug:o.bug!==false,p:p};
  led.className="led"+(T.on?" on":"");
  const dpr=Math.min(2,window.devicePixelRatio||1),r=crt.getBoundingClientRect(),W=Math.max(160,Math.round(r.width-6)),H=Math.max(160,Math.round(r.height-6));
  cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+"px";cv.style.height=H+"px";const g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);T.W=W;T.H=H;T.g=g;
  const fx=document.createElement("canvas");fx.width=W;fx.height=H;{const q=fx.getContext("2d");q.fillStyle="rgba(0,0,0,.16)";for(let y=0;y<H;y+=3)q.fillRect(0,y,W,1);
    const vg=q.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.max(W,H)*.75);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.42)");q.fillStyle=vg;q.fillRect(0,0,W,H)}
  T.setCh=n=>{disp.textContent=n?("CH "+(n<10?"0":"")+n):"OFF"};
  T.power=v=>{T.on=v;led.className="led"+(v?" on":"")};
  T.setOk=(label,fn,act,mode)=>{
    ok.textContent=label||"OK";ok.onclick=null;ok.onpointerdown=null;ok.disabled=!fn;ok.classList.toggle("hot",!!fn);
    if(act)ok.dataset.act=act;else delete ok.dataset.act;ok.dataset.pri="2";
    if(fn){if(mode==="down")ok.onpointerdown=e=>{e.preventDefault();fn(e)};else ok.onclick=fn}
  };
  T.setOk(null);
  T.clear=()=>{tp.innerHTML="";md.innerHTML="";lo.innerHTML=""};
  T.cap=(t,where)=>{const c=txt("div","cp",t);(where||lo).innerHTML="";(where||lo).appendChild(c);return c};
  T.lt=(k,t,where)=>{const d=el("div","lt");d.appendChild(txt("i","",k));d.appendChild(txt("span","",t));(where||lo).appendChild(d);return d};
  T.title=(a,b)=>{tp.innerHTML="";tp.appendChild(txt("div","ttl",a));if(b)tp.appendChild(txt("div","sub",b))};
  let flT=null;T.flash=t=>{const f=txt("div","fl",t);f.dataset.bot="skip";tp.appendChild(f);clearTimeout(flT);flT=setTimeout(()=>f.remove(),3800)};
  T.padLabel=t=>{pad.innerHTML="";pad.appendChild(txt("div","lbl",t||"JEFFTRON UNIVERSAL REMOTE · WORKS ON EVERYTHING IN THE HOUSE"))};
  T.padLabel();
  T.setCh(o.ch==null?ch:o.ch);
  J.raf((t,dt)=>{
    if(T.on){g.fillStyle=p.sbg;g.fillRect(0,0,W,H);if(T.pic)T.pic(g,W,H,t,dt)}
    else{g.fillStyle=p.off;g.fillRect(0,0,W,H);if(T.pic&&T.picOff)T.pic(g,W,H,t,dt)}
    if(T.snow>0){const n=Math.round(420*T.snow);g.fillStyle=p.ink;for(let i=0;i<n;i++){g.globalAlpha=Math.random()*.55*Math.min(1,T.snow+.2);g.fillRect(Math.random()*W,Math.random()*H,1+Math.random()*3,1+Math.random()*2)}g.globalAlpha=1;T.snow=Math.max(T.floor,T.snow-dt*.9)}
    if(T.on&&T.bug){g.font="700 11px 'Courier New',monospace";g.fillStyle=p.ink;g.globalAlpha=.75;g.textAlign="left";g.fillText(J.clock().toUpperCase(),16,19);
      g.textAlign="right";g.font="900 13px "+HEAD;g.fillStyle=p.acc;g.fillText("WJEF 32",W-16,20);g.textAlign="left";g.globalAlpha=1}
    if(T.on&&T.tick){const y=H-24;g.fillStyle="rgba(0,0,0,.55)";g.fillRect(0,y,W,24);g.fillStyle=p.acc;g.fillRect(0,y,W,2);
      if(!tkCur){tkCur=nextHead();tkX=W}g.font="700 12px "+HEAD;tkX-=dt*58;const tw=g.measureText(tkCur).width;
      g.fillStyle=p.ink;g.fillText(tkCur,tkX,y+17);if(tkX+tw<64){tkCur=null}
      g.fillStyle=p.acc;g.fillRect(0,y+2,62,22);g.fillStyle=p.sbg;g.font="900 10px "+HEAD;g.fillText("WJEF NEWS",5,y+16)}
    g.drawImage(fx,0,0,W,H);
    if(T.post)T.post(g,W,H,t,dt);
  });
  return T;
}
/* captions advanced by OK */
const seq=(T,lines,done,label,speak)=>{let i=0;const show=()=>{
  if(i>=lines.length){T.setOk(null);return done()}
  const l=lines[i++];const s=typeof l==="function"?l():J.fill(l);T.cap(s);A.pop();if(speak&&i===1)J.say(s.split(".")[0],{pitch:.25,rate:.8});
  T.setOk(label||"OK",()=>{A.click();show()},"tap")};show()};
const nm=()=>S.raw&&!/^je?ff/i.test(S.raw)?S.raw:null;
const tooth=(g,cx,cy,w,h,fill,stroke)=>{const x=cx-w/2,y=cy-h/2;g.beginPath();g.moveTo(x+w*.1,y+h*.12);g.quadraticCurveTo(x+w*.25,y-h*.04,x+w*.5,y+h*.08);g.quadraticCurveTo(x+w*.75,y-h*.04,x+w*.9,y+h*.12);
  g.quadraticCurveTo(x+w*1.02,y+h*.35,x+w*.88,y+h*.55);g.quadraticCurveTo(x+w*.8,y+h,x+w*.68,y+h*.98);g.quadraticCurveTo(x+w*.6,y+h*.7,x+w*.5,y+h*.66);g.quadraticCurveTo(x+w*.4,y+h*.7,x+w*.32,y+h*.98);
  g.quadraticCurveTo(x+w*.2,y+h,x+w*.12,y+h*.55);g.quadraticCurveTo(x-w*.02,y+h*.35,x+w*.1,y+h*.12);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=Math.max(1,w*.05);g.stroke()}};
const picID=(T,yk)=>(g,W,H,t)=>{const p=T.p,cols=[J.C.rust,J.C.bile,p.ink,J.C.dim,p.acc2,J.C.rust,p.ink];g.globalAlpha=.09;cols.forEach((c,i)=>{g.fillStyle=c;g.fillRect(i*W/7,0,W/7+1,H)});g.globalAlpha=1;
  const s=Math.min(W,H)*.34,cx=W/2,cy=H*(yk||.3)+Math.sin(t*.7)*2;tooth(g,cx,cy,s,s*1.15,p.acc,p.ink);g.fillStyle=p.sbg;g.font="900 "+Math.round(s*.4)+"px "+HEAD;g.textAlign="center";g.textBaseline="middle";g.fillText("32",cx,cy-s*.1);
  g.fillStyle=p.ink;g.font="900 "+Math.round(s*.2)+"px "+HEAD;g.fillText("WJEF",cx,cy-s*.78);g.textBaseline="alphabetic";g.textAlign="left"};

/* every unit sits in the same set; changing the channel mid-program is allowed, it just ends the program for you */
const unitTV=(st,id)=>{
  ch=CH(id);const T=tv(st,{ch:ch,snow:.9});let warn=0;
  const chg=d=>{if(Date.now()-warn<4500){A.static(0);ch=Math.max(1,ch+d);doneAt[id]=Date.now();J.unitDone(id)}else{warn=Date.now();T.flash("Change the channel? This program ends for you. It keeps going for everyone else. Press it again if you mean it.")}};
  T.up.onclick=()=>chg(1);T.dn.onclick=()=>chg(-1);
  T.pw.onclick=()=>T.flash("The set stays on during programs. You can turn it off at sign-off. We'll remind you. We always remind you.");
  T.fin=()=>{doneAt[id]=Date.now();T.setOk(null);T.snow=1;A.clank(.3);J.after(700,()=>J.unitDone(id))};
  return T;
};

/* ---------- the hub: the set between programs ---------- */
const PROG={"t-poll":["THE PEOPLE'S POLL","Vote by phone. Count by mouth."],"t-lullaby":["LULLABY HOUR","Nana Jeff sings. You sing back. Bring your thumbs."],
  "t-seccam":["NIGHT WATCH","A parking lot, live, all night. Somebody's in it."],"t-panel":["FACE THE JEFFS","Nine experts. One face. Everybody talking at once."],
  "t-lottery":["THE JEFFPOT","Tonight's winning numbers are drawn from you."],"t-race":["BEAT YOUR GHOST","You versus you, but faster."],
  "t-silence":["A MOMENT OF SILENCE","For a viewer we lost tonight. Viewer discretion is the viewer."]};
const RERUN={"t-poll":"The bars are still teeth. Somebody brushed them during the break.","t-lullaby":"Nana's asleep. All of her mouths are still singing, very quietly, slightly off.",
  "t-seccam":"Lot B is empty now. The bench is still warm. The bench is always warm.","t-panel":"All nine of them are on mute, mouthing your name in nine slightly different accents.",
  "t-lottery":"The drum is empty. Something inside it is rolling anyway.","t-race":"Your ghost is practicing alone. It's gotten fast. It doesn't blink anymore.",
  "t-silence":"It's still going. Nobody has touched anything. Somebody is about to."};
const BACK={"t-poll":"The People's Poll has closed. The bars have been put in a glass on your nightstand. Don't drink from the glass.",
  "t-lullaby":"Nana Jeff is asleep. If you hear humming in the next few minutes, that's a rerun. Reruns come from the walls.",
  "t-seccam":"Night Watch has ended. CAM 2 is still on. We've just stopped showing it to you, as a courtesy.",
  "t-panel":"The panel has left the call. One of them didn't hang up. He's breathing on mute, and he has questions.",
  "t-lottery":"Jeffpot winners are notified in person. Listen for the stairs. He counts them out loud.",
  "t-race":"Beat Your Ghost will return after your ghost finishes stretching. It stretches further than you do.",
  "t-silence":"Silence has been restored to your area. Some of it is ours. We'll be back for it around four."};
const IDS=["You're watching WJEF 32. You've been watching it longer than it has been on.","WJEF 32: the only station in {city} that broadcasts from the inside of the set.",
  "Channel 32. Thirty-two teeth. That is not a coincidence. That is a dental plan.","Stay tuned. We can tell when you aren't. The picture gets worse on purpose.",
  "WJEF 32, proudly serving every room with a screen in it, and the rooms right next to those.","It's {t}. It has been {t} on this channel for a very long time.",
  "Our transmitter sits on the head of the tallest Jeff in {city}. Wave. He can see you. He's facing your way.","WJEF 32 is viewer supported. Thank you, viewer. You've been holding us up since you sat down."];
let idI=0,hubN=0;const adDone={};
const ADS=[null,null,/* only the Emergency Jeff test still airs; index kept */
  ["EMERGENCY JEFF SYSTEM",["This is a test of the Emergency Jeff System. This is only a test. For the next thirty seconds, every screen in {city} will display this message, including the ones that are turned off.",
    "If this had been an actual emergency, you would have been told to stay indoors, away from windows, and Jeff. You would already be Jeff. There would be no one left to tell.",
    "This concludes this test of the Emergency Jeff System. The tone you're about to hear is the sound of every Jeff in your area clearing his throat at once."]]];
const idLine=()=>{const l=IDS[idI%IDS.length];idI++;return J.fill(l)};

const opening=(st,T)=>{
  T.power(false);T.tick=false;T.bug=false;T.snow=0;T.picOff=true;ch=1;T.setCh(0);
  T.pic=(g,W,H,t)=>{/* the reflection in a dead screen: you, and someone taller behind you */
    const p=T.p;g.globalAlpha=.16;g.fillStyle=p.ink;const cx=W*.5,by=H*.98;
    g.beginPath();g.arc(cx,by-H*.42,W*.13,0,6.3);g.fill();g.fillRect(cx-W*.24,by-H*.3,W*.48,H*.32);
    g.globalAlpha=.08;g.beginPath();g.arc(cx+W*.2,by-H*.66,W*.1,0,6.3);g.fill();g.fillRect(cx+W*.12,by-H*.57,W*.17,H*.3);g.globalAlpha=1;
    const sh=g.createLinearGradient(0,0,W,H);sh.addColorStop(0,"rgba(255,255,255,.06)");sh.addColorStop(.4,"rgba(255,255,255,0)");g.fillStyle=sh;g.fillRect(0,0,W,H)};
  T.md.appendChild(txt("div","sub","Your television is off."));
  T.md.appendChild(txt("div","big","Something on it is not."));
  const warn=txt("div","cp",J.fill("WJEF 32 has been broadcasting to this {model} since you put it down last time. Expect a flashing picture, sudden sound, a voice, and teeth. Nothing you do here leaves the phone. Press POWER on the remote."));
  T.lo.appendChild(warn);
  T.pw.dataset.act="tap";T.pw.dataset.pri="5";
  T.padLabel("THE REMOTE WAS ALREADY IN YOUR HAND");
  T.pw.onclick=()=>{
    delete T.pw.dataset.act;T.pw.onclick=null;J.start();T.power(true);T.snow=1.2;T.floor=0;A.static(.07);A.clank(.5);J.buzz(40);J.after(900,()=>A.static(0));T.setCh(1);
    T.clear();T.pic=picID(T,.26);T.tick=true;
    J.after(1100,()=>{
      T.title("WE INTERRUPT THIS PROGRAM","A special report from WJEF 32");J.say("we interrupt this program",{pitch:.2,rate:.75});
      const did=J.lastDid().slice(0,3),dl=did.length?did.length===1?did[0]:did.slice(0,-1).join(", ")+" and "+did[did.length-1]:"opened every app on his phone and found the group living in all of them";
      const who=nm();
      seq(T,[
        "This is WJEF 32, the overnight station for {city}, with a special report about a viewer. The viewer is watching this. Hello, viewer.",
        ()=>J.fill("Last visit, local man Jeff #{no} was seen on his own {model}, where he "+dl+". Witnesses say he did it with a straight face. Witnesses say it was his face."),
        ()=>who?"Neighbors describe the man as “"+who+"”. Neighbors have been corrected. Neighbors now describe him as Jeff and do not remember being corrected.":"Neighbors describe the man as Jeff. When asked for another name, the neighbors stared at the reporter until the reporter also became Jeff.",
        "Stay tuned. Do not adjust your set. Your set has already been adjusted. Use CH+ to move through tonight's programs. There is no other way out of a television."
      ],()=>J.go("t-tv",{fromOpen:true}),"OK",true);
    });
  };
};

J.scene("t-tv",(st,arg)=>{
  arg=arg||{};
  if(arg.first&&!arg.fromOpen){ch=1;const T=tv(st,{ch:0,snow:0,tick:false,bug:false,on:false});return opening(st,T)}
  const T=tv(st,{ch:ch,snow:arg.back?.9:.4});T.pic=picID(T,.27);
  const left=()=>J.left("tv");
  const coming=()=>{const L=left();if(!L.length)return null;const after=L.filter(u=>CH(u)>ch).sort((a,b)=>CH(a)-CH(b));return after[0]||L.slice().sort((a,b)=>CH(a)-CH(b))[0]};
  const pw=()=>{T.flash("The set turns off at sign-off. It's the one rule. We like to end together.")};T.pw.onclick=pw;
  const nTV=S.run.filter(u=>U.indexOf(u)>=0).length;
  const ad=k=>{const A0=ADS[k];T.title("A WORD FROM OUR SPONSOR",A0[0]);T.lt("WE'LL BE RIGHT BACK","WJEF 32 is brought to you by the following.");
    T.pic=(g,W,H,t)=>{const p=T.p;g.fillStyle=mix(p.sbg,p.acc,.18);g.fillRect(0,H*.24,W,H*.36);const s=Math.min(W,H)*.2;
      if(k===2){g.fillStyle=p.acc;g.fillRect(0,H*.24,W,H*.36);g.fillStyle=p.sbg;g.font="900 "+Math.round(W*.09)+"px "+HEAD;g.textAlign="center";g.fillText("THIS IS A TEST",W/2,H*.44);g.textAlign="left"}
      else if(k===0){g.fillStyle=p.ink;g.fillRect(W*.15,H*.42,W*.7,H*.08);g.fillStyle=p.acc;g.fillRect(W*.15,H*.4,W*.7,H*.025);g.fillStyle="#050403";g.beginPath();g.ellipse(W*.5,H*.415+Math.sin(t*1.3)*1.5,W*.2,H*.012,0,0,6.3);g.fill()}
      else{for(let i=0;i<5;i++){tooth(g,W*(.22+i*.14),H*.42+Math.sin(t*2+i)*3,s*.55,s*.62,i===2?p.acc:p.ink,p.sbg)}}};
    seq(T,A0[1],()=>{T.clear();show()},"OK")};
  const show=()=>{
    if(arg.back&&nTV===4&&!adDone[nTV]){adDone[nTV]=1;A.blip(853,1.2,"sine",.05);return ad(2)}
    T.clear();T.pic=picID(T,.27);hubN++;
    const L=left();
    if(arg.back&&!show.didBack){show.didBack=1;T.lt("THAT WAS",PROG[arg.back]?PROG[arg.back][0]:"A PROGRAM");T.cap(BACK[arg.back]||idLine()).style.marginTop="2px"}
    else if(arg.enter&&!arg.first&&!show.didEnter){show.didEnter=1;T.cap("You're on WJEF 32 now. You didn't change the channel. The channel changed you. We're picking up in the middle of the night. We never stopped. You just weren't in here.")}
    else T.cap(idLine());
    if(!L.length){
      const more=J.undone().length>0;
      const box=txt("div","cp",more?"WJEF 32 is going off the air early tonight. Something else in your house just came on. You can hear it from here. It's on in the next room.":
        "That's every program on tonight's schedule. Stay for the sign-off. It's the only part of the broadcast where everybody stands up, including the ones who usually stay down.");
      T.lo.appendChild(box);T.up.onclick=()=>tune(1);T.dn.onclick=()=>tune(-1);
      T.setOk(more?"FOLLOW":"SIGN-OFF",()=>{A.thump();T.snow=1;J.after(500,()=>J.next())},"tap");return;
    }
    const c=coming();T.lt("COMING UP ON CH "+(CH(c)<10?"0":"")+CH(c),PROG[c][0]+". "+PROG[c][1]);
    T.up.dataset.act="tap";T.up.dataset.pri="3";T.up.onclick=()=>tune(1);T.dn.onclick=()=>tune(-1);
    T.padLabel("CH + / CH − TO CHANGE PROGRAMS");
  };
  const tune=d=>{
    ch=ch+d;if(ch>9)ch=1;if(ch<1)ch=9;T.setCh(ch);T.snow=1;A.static(.06);J.after(450,()=>A.static(0));A.click();T.clear();
    const u=U[ch-2],L=left();
    if(u&&L.indexOf(u)>=0){delete T.up.dataset.act;T.up.onclick=T.dn.onclick=null;T.lt("CH "+(ch<10?"0":"")+ch,"NOW: "+PROG[u][0]);J.after(1000,()=>J.go(u));return}
    if(ch===1){show();return}
    T.pic=(g,W,H,t)=>{const p=T.p;for(let i=0;i<7;i++){g.fillStyle=[J.C.rust,J.C.bile,p.ink,J.C.dim,p.acc2,J.C.rust,p.ink][i];g.globalAlpha=.55;g.fillRect(i*W/7,0,W/7+1,H*.62)}g.globalAlpha=1;
      g.fillStyle=p.sbg;g.fillRect(0,H*.62,W,H*.38);g.fillStyle=p.ink;g.font="900 "+Math.round(W*.12)+"px "+HEAD;g.textAlign="center";g.fillText("CH "+(ch<10?"0":"")+ch,W/2,H*.38);g.textAlign="left"};
    if(u&&S.run.indexOf(u)>=0)T.lt("RERUN",PROG[u][0]+". "+RERUN[u]);
    else if(u)T.lt("OFF AIR","This channel has nothing scheduled tonight. Something is breathing on it anyway.");
    else T.lt("CH 09","A channel that is just a hallway, live. Nobody has walked down it in hours. That's what makes it good television.");
    if(L.length){T.up.dataset.act="tap";T.up.dataset.pri="3"}
  };
  show();
});

/* ---------- 1. THE PEOPLE'S POLL: mash to vote, the bars are teeth ---------- */
J.scene("t-poll",st=>{
  const T=unitTV(st,"t-poll");T.title("THE PEOPLE'S POLL","Live. Phone lines open soon.");
  const OPT=[["A","Jeff"],["B","Jeff Conner"],["C","Nobody (Jeff)"],["D","Me, a little later"]];
  const n=[J.ri(3,6),J.ri(3,6),J.ri(2,5),J.ri(1,4)];let pick=-1,mine=0,phase=0,close=0;
  T.pic=(g,W,H,t,dt)=>{const p=T.p,bw=W/6,base=H*.54,th=Math.max(6,H*.022);
    if(phase===1)for(let i=0;i<4;i++)if(i!==pick&&Math.random()<dt*(1.4+i*.3))n[i]++;
    for(let i=0;i<4;i++){const x=W*(.14+i*.24);const k=Math.min(n[i],Math.floor((base-H*.22)/th));
      for(let j=0;j<k;j++){tooth(g,x,base-j*th-th/2,bw*.62,th*1.05,i===pick?p.acc:"rgba(0,0,0,0)",i===pick?p.ink:p.ink)}
      g.fillStyle=p.ink;g.font="900 16px "+HEAD;g.textAlign="center";g.fillText(OPT[i][0],x,base+20);g.font="700 11px 'Courier New',monospace";g.fillText(String(n[i]),x,base+34);g.textAlign="left"}
    if(phase===3){close=Math.min(1,close+dt*.3);const top=H*.06,gum=top+(base-H*.12-top)*close;g.fillStyle=p.acc2;g.fillRect(0,top,W,gum-top);
      for(let i=0;i<9;i++){g.save();g.translate(W*(.06+i*.11),gum+H*.035);g.rotate(Math.PI);tooth(g,0,0,W*.09,H*.07,p.ink,p.sbg);g.restore()}}};
  seq(T,["Good evening. This is The People's Poll, the only call-in vote in {city} where the bars on the graph are made of teeth.",
        "Every vote you phone in is counted with one tooth. We don't say whose. We let the bar say. The bar is not discreet.",
    "Tonight's question was sent in by a viewer. The viewer was you. You don't remember sending it. That's fine. We remember for you. It's most of what we do."],()=>{
    T.md.appendChild(txt("div","big","Who is standing in your kitchen right now?"));
    T.cap("Pick an answer on the remote. Then the lines open.");T.pad.innerHTML="";
    OPT.forEach((o,i)=>{const b=txt("button","",o[0]+") "+o[1]);b.type="button";b.style.flex="1 1 45%";b.dataset.act="tap";b.dataset.pri=String(J.ri(1,9));T.pad.appendChild(b);
      b.onclick=()=>{if(pick>=0)return;pick=i;A.thump();[...T.pad.children].forEach(x=>{delete x.dataset.act;x.disabled=x!==b});lines()}});
  });
  const lines=()=>{
    phase=1;T.md.innerHTML="";const cnt=txt("div","sub","");cnt.dataset.bot="skip";T.md.appendChild(cnt);
    T.cap("Lines are open. Mash OK. Every press is one more tooth on the "+OPT[pick][0]+" bar. Go fast. The other callers are faster. The other callers don't have thumbs, they have something better.");
    let t0=0;const end=()=>{if(phase!==1)return;phase=2;T.setOk(null);A.clank(.4);results()};
    T.setOk("VOTE",()=>{if(phase!==1)return;if(!t0){t0=Date.now();J.after(14000,end)}mine++;n[pick]++;A.blip(300+mine*12,.05,"square",.06);cnt.textContent="YOUR VOTES: "+mine;if(mine>=32)end()},"mash:34","down");
  };
  const RES=["Jeff wins. Jeff has won every poll this station has ever run, including the ones about the weather and the one about whether to keep running polls.",
    "Jeff Conner wins, by a full jaw. His campaign manager is a mouth. It would like to thank you personally. It's working on the hands.",
    "Nobody wins. Nobody is thrilled. Nobody would like to come out of the kitchen now and shake your hand. Nobody has been waiting all night for this.",
    "You, a little later, win. Please don't go into the kitchen. You'll ruin the surprise for yourself, and you went to a lot of trouble."];
  const results=()=>{T.md.innerHTML="";
    seq(T,[RES[pick],"You phoned in "+mine+(mine===1?" vote":" votes")+". That's "+mine+(mine===1?" tooth":" teeth")+". Our accountant says they did not come from your mouth. Our accountant is very hard to look at directly.",
      ()=>{phase=3;T.tp.innerHTML="";A.crunch();return"The polls are closing now. Watch them close. They close like a mouth, because that's what a poll is when you get right down to it."},
      "Thank you for voting. Your call may be recorded. Your call has been recorded since before you made it. You sound tired on it. You sound like you've been up."],()=>T.fin());
  };
});

/* ---------- 2. LULLABY HOUR: tap the rhythm back ---------- */
J.scene("t-lullaby",st=>{
  const T=unitTV(st,"t-lullaby");T.title("LULLABY HOUR","with Nana Jeff");
  let mouths=5,open=0,glass=0;
  const SPOT=[[0,.42],[-.42,.12],[.42,.14],[0,-.5],[-.22,.72],[.6,-.02],[-.6,0],[.2,.72],[0,.08],[-.5,-.4],[.5,-.38],[0,-.15],[.45,.5],[-.45,.48]];
  T.pic=(g,W,H,t,dt)=>{const p=T.p,cx=W/2,cy=H*.36,R=Math.min(W,H)*(.21+glass*.05);open=Math.max(0,open-dt*3);
    g.fillStyle=mix(p.sbg,p.ink,.1);g.strokeStyle=p.ink;g.lineWidth=2;g.beginPath();g.ellipse(cx,cy,R*.82,R,0,0,6.3);g.fill();g.stroke();
    g.fillStyle=p.ink;g.beginPath();g.ellipse(cx,cy-R*1.02,R*.86,R*.3,0,0,6.3);g.globalAlpha=.25;g.fill();g.globalAlpha=1;
    [[-.33,-.34],[.33,-.34]].forEach(e=>{g.fillStyle=p.sbg;g.beginPath();g.ellipse(cx+e[0]*R,cy+e[1]*R,R*.12,R*.08,0,0,6.3);g.fill();g.stroke();g.fillStyle=p.ink;g.beginPath();g.arc(cx+e[0]*R,cy+e[1]*R,R*.035,0,6.3);g.fill()});
    for(let i=0;i<Math.min(mouths,SPOT.length);i++){const s=SPOT[i],x=cx+s[0]*R,y=cy+s[1]*R,mw=R*(i?.17:.26),mo=R*(.02+open*(i?.08:.12)+Math.sin(t*2+i)*.006);
      g.fillStyle="#050403";g.beginPath();g.ellipse(x,y,mw,mo+R*.015,0,0,6.3);g.fill();g.strokeStyle=p.ink;g.stroke();g.fillStyle=p.ink;
      for(let k=0;k<6;k++){const tx=x-mw*.75+k*mw*.3;g.fillRect(tx-mw*.06,y-mo,mw*.12,mo*.7+1)}}};
  const PAT=[[520,520,1040],[360,360,360,720],[780,300,300,780],[280,280,280,280,840,560]];
  const LYR=[["Hush little Jeff, don't make a sound,","Nana's got teeth that go all the way down."],["And if those teeth should learn to talk,","Nana will take them out for a walk."],
    ["And if that walk goes past your door,","Nana will knock, then knock some more."],["And when you've counted every one,","Nana grows another, just for fun."]];
  const GOOD=["Perfect. Nana's proud. Nana grows a new mouth just to say so.","That's it. Nana felt that one in all of her jaws.","Lovely. You tap like someone who has been tapping on a wall from the other side for years.","Good. That was the last verse. It was the last verse last night too. Nana can't count past it."];
  const NOTES=[392,440,494,523,587,659,698];
  let pi=0,tries=0,taps=[],judgeT=null,lyr=[];
  const lyrBox=el("div");lyrBox.style.cssText="display:flex;flex-direction:column;gap:2px;align-self:stretch;background:rgba(0,0,0,.6);padding:6px 8px";T.md.style.justifyContent="flex-end";
  const sing=(pat,cb,slow)=>{let at=0;const k=slow?1.35:1;[0].concat(pat).forEach((g,i)=>{at+=g*k;J.after(at,()=>{open=1;A.blip(NOTES[(pi*2+i)%NOTES.length],.32,"triangle",.14);J.buzz(15)})});J.after(at+700,cb)};
  const turn=()=>{
    const pat=PAT[pi];taps=[];T.cap("Nana sings verse "+(pi+1)+". Watch the mouths. Count the gaps.");T.setOk(null);
    sing(pat,()=>{T.cap(tries?"Again. Same taps, same gaps. Nana's closer to the glass now.":"Your turn. Tap it back on OK. Same taps. Same gaps.");
      T.setOk("TAP",()=>{delete T.ok.dataset.act;taps.push(performance.now());open=.7;A.blip(NOTES[(taps.length+pi)%NOTES.length]*.5,.18,"sine",.12);clearTimeout(judgeT);judgeT=setTimeout(judge,1500)},"taps:"+pat.join(","),"down")},tries>0);
  };
  J.onClean(()=>clearTimeout(judgeT));
  const judge=()=>{
    T.setOk(null);const pat=PAT[pi];let ok=taps.length===pat.length+1;
    if(ok)for(let i=0;i<pat.length;i++){const gap=taps[i+1]-taps[i];if(Math.abs(gap-pat[i])>Math.max(260,pat[i]*.45))ok=false}
    if(ok||tries>=1){
      const l=LYR[pi];lyr.push(l[0],l[1]);lyrBox.innerHTML="";lyr.slice(-2).forEach(x=>lyrBox.appendChild(txt("div","sub",x)));if(!lyrBox.parentNode)T.md.appendChild(lyrBox);
      mouths+=2;glass+=.1;A.thump();J.say(l[1],{pitch:1.4,rate:.7});
      T.cap(ok?GOOD[pi]:"Nana did that one for you. She borrowed your thumb to do it. She'll give it back after the show. She's very good about giving things back, eventually.");
      pi++;tries=0;
      T.setOk(pi<PAT.length?"NEXT VERSE":"OK",()=>{A.click();if(pi<PAT.length)turn();else outro()},"tap");
    }else{tries++;A.clank(.3);T.cap("Not quite. Nana will sing it again, slower, and a little closer to the glass.");T.setOk("AGAIN",()=>turn(),"tap")}
  };
  const outro=()=>seq(T,[()=>"Nana has "+mouths+" mouths now. She had five when we went on the air. That's how Nana does applause.",
    "If you hum this later, in the dark, you'll hear it hummed back from a little too low in the room. That's normal. That's Nana. She found a spot under the bed she likes."],()=>T.fin());
  seq(T,["It's Lullaby Hour on WJEF 32. Time for every little Jeff in {city} to go to sleep. Not you. You stay up. You're the audience.",
    "This is Nana Jeff. Nana has a mouth for every verse. She's been adding verses since 1987. Nobody can find where she's singing from, so nobody can ask her to stop.",
    "Nana sings a little tune with her mouths. You tap it back on OK. Same number of taps, same gaps. Get it wrong and Nana sings it again, slower, closer."],()=>turn());
});

/* ---------- 3. NIGHT WATCH: pan a parking-lot camera ---------- */
J.scene("t-seccam",st=>{
  const T=unitTV(st,"t-seccam");T.bug=false;T.tick=false;
  const W0=T.W,PW=W0*3.4;let cam=PW/2-W0/2,dir=1,seen={},cam2=false,figX=0,drags=0,twist=false;
  const SPOTS=[[.25,"Light pole 4. It hums in the key of Jeff. The moths around it aren't moths. They're very small teeth that learned to fly and have nowhere to be."],
    [.5,"A sedan with a windshield sunshade that says JEFF on the outside and JEFF on the inside, so whoever is sitting in there knows too. Someone is sitting in there."],
    [.7,"The bench. Somebody left a {model} on it, face down, still warm. It's yours. You are also holding yours. The station is not able to explain both of those things."],
    [.92,"The dumpster. The lid is closed. Something inside is doing the breathing exercise they taught you in school. In for four. Hold for four. Out for a very long time."]];
  const W=T.W,H=T.H;
  const world=(g,t)=>{const p=T.p,hz=H*.36;g.fillStyle=mix(p.sbg,p.ink,.06);g.fillRect(0,0,W,hz);g.fillStyle=mix(p.sbg,p.ink,.13);g.fillRect(0,hz,W,H-hz);
    g.strokeStyle=p.ink;g.globalAlpha=.35;g.lineWidth=2;for(let i=0;i<24;i++){const x=i*PW/24-cam;g.beginPath();g.moveTo(x,hz+H*.12);g.lineTo(x-(x-W/2)*.5,H);g.stroke()}g.globalAlpha=1;
    const at=f=>f*PW-cam;
    /* corral */let x=at(.08);g.strokeStyle=p.ink;g.lineWidth=2;g.strokeRect(x-60,hz+H*.06,120,H*.12);for(let i=0;i<6;i++){g.strokeRect(x-52+i*18,hz+H*.08,14,H*.07)}
    /* poles */[.22,.3,.62,.84].forEach((f,i)=>{const px=at(f);g.fillStyle=p.ink;g.fillRect(px-2,hz-H*.22,4,H*.3);g.globalAlpha=.11+(i===1?.05*Math.sin(t*9):0);g.beginPath();g.moveTo(px,hz-H*.22);g.lineTo(px-55,hz+H*.12);g.lineTo(px+55,hz+H*.12);g.closePath();g.fill();g.globalAlpha=1;
      if(i===1){for(let k=0;k<9;k++){const a=t*3+k;g.fillRect(px+Math.cos(a)*16-1,hz-H*.22+Math.sin(a*1.3)*10,3,4)}}});
    /* sedan */x=at(.5);g.fillStyle=mix(p.sbg,p.ink,.3);g.beginPath();g.moveTo(x-70,hz+H*.2);g.lineTo(x-52,hz+H*.12);g.lineTo(x+40,hz+H*.12);g.lineTo(x+70,hz+H*.2);g.lineTo(x+70,hz+H*.28);g.lineTo(x-70,hz+H*.28);g.closePath();g.fill();
      g.fillStyle=p.sbg;g.fillRect(x-44,hz+H*.135,78,H*.055);g.fillStyle=p.ink;g.font="900 12px "+HEAD;g.textAlign="center";g.fillText("JEFF",x-5,hz+H*.175);g.textAlign="left";
    /* bench */x=at(.7);g.fillStyle=p.ink;g.fillRect(x-50,hz+H*.2,100,6);g.fillRect(x-46,hz+H*.2,4,22);g.fillRect(x+42,hz+H*.2,4,22);g.fillRect(x-50,hz+H*.14,100,4);g.fillStyle=p.acc;g.fillRect(x+6,hz+H*.2-4,16,4);
    /* dumpster */x=at(.92);g.fillStyle=mix(p.sbg,p.ink,.25);g.fillRect(x-50,hz+H*.08,100,H*.16);g.fillStyle=p.ink;g.fillRect(x-54,hz+H*.08+Math.sin(t*1.1)*1.5,108,5);
    /* the figure: always just past whichever edge you are not looking at */
    if(!twist){const fx=dir>0?-5:W+5;figX+=(fx-figX)*.08;g.fillStyle="#050403";g.beginPath();g.arc(figX,hz+H*.02,15,0,6.3);g.fill();g.fillRect(figX-17,hz+H*.02+12,34,H*.25)}
    g.fillStyle=p.acc;g.font="900 15px "+HEAD;g.textAlign="right";g.fillText("NIGHT WATCH",W-14,22);g.textAlign="left";g.fillStyle=p.ink;g.font="700 11px 'Courier New',monospace";g.fillText("CAM 1  LOT B",12,18);const d=new Date();g.fillText(d.toLocaleDateString("en-US")+" "+d.toTimeString().slice(0,8),12,32);
    if(Math.floor(t*2)%2){g.fillStyle=J.C.rust;g.beginPath();g.arc(18,46,5,0,6.3);g.fill()}};
  const room=(g,t)=>{const p=T.p;g.fillStyle=mix(p.sbg,p.ink,.07);g.fillRect(0,0,W,H);
    g.fillStyle="#050403";g.fillRect(W*.62,H*.06,W*.22,H*.72);g.beginPath();g.arc(W*.73,H*.06,W*.1,0,6.3);g.fill();
    g.fillStyle=mix(p.sbg,p.ink,.22);g.fillRect(W*.05,H*.62,W*.9,H*.3);g.fillRect(W*.05,H*.52,W*.9,H*.12);
    g.fillStyle="#050403";g.beginPath();g.arc(W*.45,H*.5,W*.09,0,6.3);g.fill();g.fillRect(W*.33,H*.56,W*.24,H*.2);
    g.fillStyle=p.ink;g.fillRect(W*.47,H*.4,W*.1,H*.13);g.fillStyle=mix(p.sbg,p.ink,.13);g.fillRect(W*.48,H*.41,W*.08,H*.11);
    g.fillStyle=p.ink;g.font="700 11px 'Courier New',monospace";g.fillText("CAM 2  INSIDE",12,18);g.fillText(J.clock().toUpperCase(),12,32);
    if(Math.floor(t*2)%2){g.fillStyle=J.C.rust;g.beginPath();g.arc(18,46,5,0,6.3);g.fill()}};
  T.pic=(g,Wc,Hc,t)=>{if(cam2)room(g,t);else world(g,t)};
  const note=()=>{const c=cam+W/2;SPOTS.forEach((s,i)=>{if(!seen[i]&&Math.abs(s[0]*PW-c)<W*.32){seen[i]=1;T.cap(J.fill(s[1]));A.pop();if(Object.keys(seen).length===2)T.flash("MOTION DETECTED AT THE EDGE OF FRAME")}});
    if(Object.keys(seen).length>=SPOTS.length||drags>=12)J.after(2200,twistGo);setAct()};
  const pad=()=>{T.pad.innerHTML="";const tr=txt("div","trk","PAN · drag left or right");T.pad.appendChild(tr);T.trk=tr;let lx=null;
    tr.addEventListener("pointerdown",e=>{if(twist)return;lx=e.clientX;try{tr.setPointerCapture(e.pointerId)}catch(x){}});
    tr.addEventListener("pointermove",e=>{if(lx==null)return;const dx=e.clientX-lx;lx=e.clientX;cam=Math.max(0,Math.min(PW-W,cam-dx*1.9));if(dx)dir=dx<0?1:-1});
    const up=()=>{if(lx==null)return;lx=null;drags++;A.click();note()};tr.addEventListener("pointerup",up);tr.addEventListener("pointercancel",up);setAct()};
  const setAct=()=>{if(!T.trk||twist)return;const c=cam+W/2;const un=SPOTS.map((s,i)=>i).filter(i=>!seen[i]);if(!un.length){delete T.trk.dataset.act;return}
    let best=un[0];un.forEach(i=>{if(Math.abs(SPOTS[i][0]*PW-c)<Math.abs(SPOTS[best][0]*PW-c))best=i});const want=SPOTS[best][0]*PW-c;
    T.trk.dataset.act="drag:"+(want>0?-1:1)*Math.min(320,Math.max(40,Math.abs(want)/1.9))+",0,700"};
  const twistGo=()=>{if(twist)return;twist=true;if(T.trk){delete T.trk.dataset.act;T.trk.textContent="PAN · disabled by the station"}
    seq(T,["The figure has left Lot B. It didn't walk out of the shot. The shot just doesn't have it in it anymore.",
      ()=>{cam2=true;T.snow=1;A.clank(.5);return J.fill("WJEF 32 has a second camera on this program. We never told the audience. Here it is. CAM 2 is in a living room. Somebody on the couch is watching Lot B on a {model}. Somebody behind the couch is watching him watch it. The second somebody is very tall and has very good posture.")},
      "Please don't turn around. It ruins the shot. He was never out of frame. He was never in the lot. He was on the other side of the camera the whole time, and the camera was the back of your head."],()=>T.fin(),"OK")};
  seq(T,["This is Night Watch. For viewers who can't sleep, WJEF 32 shows a live parking-lot security camera until the sun comes up, or until something does.",
    "Tonight's camera is Lot B, behind a building in {city}. You know the building. You've parked here. Your car is in the shot. Your car is not in the shot. Check again later.",
    "Drag the PAN pad on your remote to move the camera. There's someone in the lot. He's shy. He stays just out of frame. He has been practicing that."],()=>{T.cap("Pan along the lot. Look at everything. He's watching what you look at.");pad()});
});

/* ---------- 4. FACE THE JEFFS: faders ---------- */
J.scene("t-panel",st=>{
  const T=unitTV(st,"t-panel");T.title("FACE THE JEFFS","Nine guests. One face.");
  const NAMES=["EXPERT","CONCERNED","ALLEGEDLY MUTED","YOUR DENTIST","BEHIND YOU","PANEL CHAIR","FROM YOUR ATTIC","NO RELATION","WHO STARTED THIS"];
  const SAY=["I'd like to respond to myself.","With respect, I'm the one who said that.","Can everyone see my teeth? Thumbs up if you can see my teeth.","I counted, and it's rude, and I did it anyway.",
    "You're on mute. No, you're on mute. We're all on you.","Point of order: which one of us is the host?","My position has always been your position, slightly to the left.","Sorry, my other mouth was talking.",
    "Let me finish. Let me finish. Let me finish.","I'm calling from your attic, so my connection is excellent.","The real question is who taught the teeth to count.","I disagree with myself on a cellular level.",
    "I yield the rest of my time to the thing standing behind me.","Can we get the viewer's opinion? Can we get the viewer's teeth?","This is exactly what I said in 2015 and nobody listened, because they were me.",
    "Whoever's chewing, unmute and share with the group."];
  const PS=J.ri(100,99999),lv=NAMES.map(()=>.55+J.rnd()*.4),fc=NAMES.map(()=>{const c=document.createElement("canvas");c.width=c.height=110;return c});
  let phase=0,start=0,fds=[],viewer=0;const held=[];const me=document.createElement("canvas");me.width=me.height=220;
  let lastF=0,fi=0;const fbg=mix(T.p.sbg,T.p.ink,.08);fc.forEach((c,i)=>J.face(c,PS,.35,{open:.3,ly:.2,bg:fbg}));
  T.pic=(g,W,H,t,dt)=>{const p=T.p,gw=W-24,gh=H*.48,tw=gw/3,th=gh/3,x0=12,y0=H*.17;
    if(phase===1){const now=performance.now();lv.forEach((v,i)=>{if(now-(held[i]||0)>2500)lv[i]=Math.min(1,v+dt*(.006+(i%3)*.0035))});if(lv.every(v=>v<=.18)){phase=2;quiet()}}
    if(t-lastF>.05){lastF=t;fi=(fi+1)%9;const i=fi;J.face(fc[i],PS,.35,{open:lv[i]*(.35+.65*Math.abs(Math.sin(t*7+i*1.7))),lx:Math.sin(t+i)*.5,ly:.2,bg:fbg})}
    for(let i=0;i<9;i++){const x=x0+(i%3)*tw,y=y0+Math.floor(i/3)*th;g.globalAlpha=viewer?.35:1;g.drawImage(fc[i],x+3,y+3,tw-6,th-6);
      g.strokeStyle=lv[i]>.5&&phase<2?p.acc:p.dim;g.lineWidth=lv[i]>.5&&phase<2?3:1;g.strokeRect(x+3,y+3,tw-6,th-6);
      g.fillStyle="rgba(0,0,0,.6)";g.fillRect(x+3,y+th-19,tw-6,16);g.save();g.beginPath();g.rect(x+3,y+th-19,tw-16,16);g.clip();g.fillStyle=p.ink;g.font="700 8px "+HEAD;g.fillText("JEFF ("+NAMES[i]+")",x+6,y+th-8);g.restore();
      g.fillStyle=p.acc2;g.fillRect(x+tw-10,y+th-8-(th-30)*lv[i],4,(th-30)*lv[i])}
    g.globalAlpha=1;
    if(viewer){viewer=Math.min(1,viewer+dt*.6);const s=Math.min(W,H)*.5*viewer;if(!me._d){me._d=1;J.face(me,S.face,.6,{open:.1,bg:mix(p.sbg,p.ink,.1)})}g.drawImage(me,W/2-s/2,y0+gh/2-s/2,s,s);g.strokeStyle=p.acc;g.lineWidth=3;g.strokeRect(W/2-s/2,y0+gh/2-s/2,s,s);
      g.fillStyle="rgba(0,0,0,.65)";g.fillRect(W/2-s/2,y0+gh/2+s/2-20,s,20);g.fillStyle=p.ink;g.font="700 10px "+HEAD;g.fillText(J.fill("JEFF #{no} (VIEWER)"),W/2-s/2+6,y0+gh/2+s/2-6)}};
  const chat=txt("div","gh","");chat.dataset.bot="skip";
  J.every(1700,()=>{if(phase>=2)return;let k=0;lv.forEach((v,i)=>{if(v>lv[k])k=i});chat.textContent="JEFF ("+NAMES[k]+"): "+J.pick(SAY);A.blip(160+k*25,.12,"sawtooth",.03*lv[k])});
  const faders=()=>{T.pad.innerHTML="";fds=[];phase=1;start=Date.now();
    for(let i=0;i<9;i++){const f=el("div","fd"),b=el("b"),k=el("i");f.appendChild(b);f.appendChild(k);T.pad.appendChild(f);fds.push({f:f,b:b,k:k});
      let on=false;const set=e=>{const r=f.getBoundingClientRect();lv[i]=Math.max(0,Math.min(1,1-(e.clientY-r.top)/r.height))};
      f.addEventListener("pointerdown",e=>{if(phase!==1)return;on=true;set(e);try{f.setPointerCapture(e.pointerId)}catch(x){}});
      f.addEventListener("pointermove",e=>{if(on&&phase===1)set(e)});const up=()=>{if(on){on=false;held[i]=performance.now();A.click()}};f.addEventListener("pointerup",up);f.addEventListener("pointercancel",up)}
    J.every(150,()=>{if(phase>=3)return;let k=-1;fds.forEach((d,i)=>{d.b.style.height=(lv[i]*100)+"%";d.k.style.top="calc("+((1-lv[i])*100)+"% - "+(lv[i]*10)+"px)";delete d.f.dataset.act;if(lv[i]>.18&&(k<0||lv[i]>lv[k]))k=i});
      if(k>=0&&phase===1)fds[k].f.dataset.act="drag:0,70,450";
      if(phase===1&&Date.now()-start>75000){lv.forEach((v,i)=>{lv[i]=.05});}});
  };
  const quiet=()=>{phase=3;chat.textContent="";fds.forEach(d=>delete d.f.dataset.act);A.static(0);
    seq(T,["The panel is quiet. That has never happened on this program. The engineers are standing up. One of them is crying, but in a good way.",
      ()=>{viewer=.01;A.thump();return"There is a tenth square on the call. There was always a tenth square. It's the one you've been watching from."},
      "The panel would like to hear from the viewer. Take your time. They'll wait. They muted themselves for you, which they have never once done for each other.",
      "Face The Jeffs will reconvene next week to discuss you in more detail. Please leave your camera on. Please leave your face on."],()=>T.fin())};
  seq(T,["Welcome back to Face The Jeffs, the late-night panel show where nine experts discuss the issues facing Jeff tonight.",
    "Our panelists join by video call. They're all the same man. Tonight's issue: is it rude to count someone else's teeth out loud.",
    "They're talking over each other. They always do. Use the faders on your remote to turn them down. They creep back up. They like to be heard. Get all nine down at once."],()=>{T.lo.innerHTML="";const cw=el("div");T.lo.appendChild(chat);T.lo.appendChild(cw);T.cap("Drag a fader down to turn that Jeff down. The loud ones have a bright border.",cw);faders()});
});

/* ---------- 5. THE JEFFPOT: stop the drum ---------- */
J.scene("t-lottery",st=>{
  const T=unitTV(st,"t-lottery");T.title("THE JEFFPOT","Live draw · Numbers drawn from you");
  const mm=new Date().getMinutes();
  const BALLS=[[S.teeth,"That's your teeth, as of tonight. We have one extra on file. It's in an envelope. The envelope is warm."],
    J.D.batt!=null?[J.D.batt,J.D.batt+". That's your battery. Ours is at a hundred. Ours is plugged into the wall behind your bed, which is why the wall is warm."]:[window.innerWidth,window.innerWidth+". That's how many pixels wide your screen is. We counted from the inside. It was a squeeze. We did it in pairs."],
    [S.visits,"That's how many times you've come back. The odds of another one are excellent. The odds are standing in your hallway with their shoes off."],
    [S.no,"That's your Jeff number. Somebody had it before you. They're the ball that didn't come out of the drum. You can hear them in there."]];
  const HIT=["MATCH. Hold onto that one. It's warm and it's yours and it knows.","MATCH. The studio audience is clapping. The studio audience is one man clapping very fast.","MATCH. Somewhere in {city}, a dog stops barking to listen.","MATCH. Excellent timing. Your thumb has done this before. Your thumb has a past.","MATCH. Perfect. We'll frame it. We'll frame you too, later, for something."];
  const MISS=["Missed. The ball went to the person standing closest to you. They say thanks. They say it right into your ear.","Missed. That one rolled under the couch. Your couch. Leave it. It comes out on its own.",
    "Missed. The ball's gone, but the number is still yours. Numbers don't leave. That's what makes them numbers.","Missed. The drum keeps the ones you miss. It's been collecting you for years.","Missed. Close enough. Everything tonight has been close enough."];
  let a=0,spd=2.3,bi=0,out=[],mode=0,hits=0,tray=[],ticket=0;const ang=Math.PI/2;
  T.pic=(g,W,H,t,dt)=>{const p=T.p,cx=W*.42,cy=H*.4,R=Math.min(W,H)*.28;a+=spd*dt;
    g.strokeStyle=p.ink;g.lineWidth=3;g.beginPath();g.arc(cx,cy,R,0,6.3);g.stroke();g.globalAlpha=.25;for(let i=0;i<8;i++){const q=a*.4+i*.785;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(q)*R,cy+Math.sin(q)*R);g.stroke()}g.globalAlpha=1;
    for(let i=0;i<16;i++){const q=a*(.7+(i%5)*.13)+i*1.7,r=R*(.25+((i*37)%60)/100);g.fillStyle=p.ink;g.beginPath();g.arc(cx+Math.cos(q)*r,cy+Math.sin(q)*r,R*.08,0,6.3);g.fill()}
    if(mode===1){const rx=cx+Math.cos(a)*R*.82,ry=cy+Math.sin(a)*R*.82;g.fillStyle=p.acc;g.beginPath();g.arc(rx,ry,R*.11,0,6.3);g.fill();g.strokeStyle=p.sbg;g.lineWidth=2;g.stroke()}
    g.fillStyle=p.acc2;g.fillRect(cx-R*.16,cy+R*.98,R*.32,R*.2);g.fillStyle=p.ink;g.font="700 10px 'Courier New',monospace";g.textAlign="center";g.fillText("CHUTE",cx,cy+R*1.32);
    tray.forEach((n,i)=>{const x=W*.86,y=H*.14+i*R*.32;g.fillStyle=i===tray.length-1&&mode===2?p.acc:p.ink;g.beginPath();g.arc(x,y,R*.14,0,6.3);g.fill();g.fillStyle=p.sbg;g.font="900 "+Math.round(R*.12)+"px "+HEAD;g.fillText(String(n),x,y+R*.045)});
    g.textAlign="left";
    if(ticket){ticket=Math.min(1,ticket+dt*.25);const tw=W*.7,th=H*.78*ticket,tx=W/2-tw/2,ty=H*.08;g.fillStyle="#f2ecdc";g.fillRect(tx,ty,tw,th);g.fillStyle="#17130e";g.font="700 11px 'Courier New',monospace";
      const L=["WJEF 32 · THE JEFFPOT","TICKET HOLDER: JEFF #"+S.no,"DEVICE: "+J.D.model,"NUMBERS: "+tray.join("  "),"PRIZE: ONE (1) JEFF","DELIVERY: ALREADY","TEETH WITHHELD FOR TAX: 1","ASSEMBLY: HE DID IT HIMSELF","KEEP THIS TICKET.","HE WILL ASK TO SEE IT."];
      L.forEach((l,i)=>{const y=ty+20+i*17;if(y<ty+th-6)g.fillText(l,tx+10,y)})}};
  const ready=()=>{mode=1;spd=2.3;T.cap("Ball "+(bi+1)+" of "+BALLS.length+". Press STOP when the red ball is at the chute.");
    T.setOk("STOP",()=>{if(mode!==1)return;let d=((a%(2*Math.PI))+2*Math.PI)%(2*Math.PI)-ang;d=Math.atan2(Math.sin(d),Math.cos(d));const hit=Math.abs(d)<.5;mode=2;spd=0;T.setOk(null);A.crunch();if(hit)hits++;
      const b=BALLS[bi];tray.push(b[0]);J.after(900,()=>{T.cap(J.fill((hit?J.pick(HIT):MISS[bi%MISS.length])+" The ball says "+b[0]+". "+(b[1].indexOf(String(b[0])+".")===0?b[1].slice(String(b[0]).length+2):b[1])));bi++;
        T.setOk(bi<BALLS.length?"NEXT BALL":"OK",()=>{A.click();if(bi<BALLS.length)ready();else jackpot()},"tap")})},"tap","down")};
  const jackpot=()=>{spd=.4;seq(T,[()=>"That's the draw. Your numbers: "+tray.join(", ")+". Tonight's winning numbers: "+tray.join(", ")+". Congratulations. You've matched yourself. You matched "+hits+" at the chute, but honestly it never mattered. The drum was only ever full of you.",
    "You've won the Jeffpot. The Jeffpot is one (1) Jeff, delivered tonight. No assembly required. He assembled himself on the way over, mostly from what was left in the drum.",
    "To claim your prize, do nothing. He's already on his way. He has your numbers. He's taking the stairs, because he likes to count, and because he wants you to hear him counting.",
    ()=>{ticket=.01;A.blip(1800,.05,"square",.05);return"A ticket is printing for you now. Hold it up to the screen. Not that close. Okay, that close."}],()=>T.fin())};
  seq(T,[()=>J.fill("It's {t}, which means it's time for The Jeffpot, the only lottery in {city} where the numbers come from you."),
    "Press STOP when the red ball is at the chute. Hit it and the ball is yours. Miss and it goes to whoever is standing closest to you. Someone is always standing closest to you."],()=>ready());
});

/* ---------- 6. BEAT YOUR GHOST: type against your own replay ---------- */
J.scene("t-race",st=>{
  const T=unitTV(st,"t-race");T.title("BEAT YOUR GHOST","You vs. you, a little earlier");
  const LINES=["i am the only one watching this channel","nobody else is up this late but me","i can hear the other one typing"];
  let r=0,rec=[],mine=0,gst=0,gk=1,running=false,t0=0,score=[0,0],tg=0;
  const norm=s=>s.toLowerCase().replace(/[^a-z ]/g,"").replace(/\s+/g," ").trim();
  T.pic=(g,W,H,t)=>{const p=T.p,y1=H*.5,y2=H*.59,x0=W*.2,x1=W*.9;g.fillStyle=p.ink;g.font="900 12px "+HEAD;g.fillText("YOU",14,y1+5);g.fillText("GHOST",14,y2+5);
    [[y1,mine,p.acc],[y2,gst,p.dim]].forEach(l=>{g.strokeStyle=p.ink;g.globalAlpha=.4;g.beginPath();g.moveTo(x0,l[0]);g.lineTo(x1,l[0]);g.stroke();g.globalAlpha=1;tooth(g,x0+(x1-x0)*l[1],l[0]-2,18,20,l[2],p.ink)});
    if(running){g.fillStyle=p.ink;g.font="700 12px 'Courier New',monospace";g.fillText(((performance.now()-t0)/1000).toFixed(1)+" s",W-70,y2+30)}};
  const big=txt("div","big",""),gh=txt("div","gh","");gh.dataset.bot="skip";
  const round=()=>{
    const line=LINES[r];T.md.innerHTML="";T.md.style.justifyContent="flex-start";big.textContent="“"+line+"”";T.md.appendChild(big);if(r>0)T.md.appendChild(gh);gh.textContent="";mine=0;gst=0;running=false;t0=0;
    T.cap(r===0?"Round one. No ghost yet. Type the line exactly as fast as you can. We're recording your thumbs. That's how the ghost learns.":r===1?"Round two. Your ghost is in the next lane. It types exactly like you just did. Every pause. Every little hesitation. It has your rhythm and none of your worries.":"Sudden death. Your ghost is faster now. It practiced during the commercial break. There was no commercial break.");
    T.pad.innerHTML="";const inp=el("input");inp.type="text";inp.setAttribute("autocomplete","off");inp.setAttribute("autocapitalize","off");inp.setAttribute("autocorrect","off");inp.spellcheck=false;inp.placeholder="type it here";inp.setAttribute("aria-label","type the line");
    inp.dataset.act="type:"+line;inp.dataset.pri="4";T.pad.appendChild(inp);const cur=[];
    let done=false;
    const finish=(passed)=>{if(done)return;done=true;running=false;delete inp.dataset.act;inp.disabled=true;T.setOk(null);const sec=(performance.now()-t0)/1000;
      if(r===0){rec=cur.slice();A.thump();T.cap(passed?"Passed. Round one doesn't count anyway. Your ghost watched you pass. It's going to pass too, but better.":sec.toFixed(1)+" seconds. Not bad for someone with your number of teeth. Your ghost was watching. Your ghost thinks you can do better. Your ghost is you, so it would know.")}
      else{const win=!passed&&gst<1;score[win?0:1]++;A[win?"thump":"crunch"]();
        T.cap(passed?"Passed. The ghost finished the line for you, in your handwriting. It dotted the i's the way you do. Nobody does that.":win?"You beat your ghost by a hair. It's taking it well. It's taking it the way you take things, which is personally, at three in the morning, in the dark.":"Your ghost beat you. It used your exact thumbs to do it. Technically, you also won. Technically is the worst possible way to win anything.")}
      r++;T.setOk(r<LINES.length?"NEXT ROUND":"RESULTS",()=>{A.click();if(r<LINES.length)round();else results()},"tap")};
    inp.addEventListener("input",()=>{
      if(done)return;const v=norm(inp.value),target=norm(line);
      if(!t0){t0=performance.now();running=true;if(r>0)ghost(line)}
      cur[v.length]=performance.now()-t0;mine=Math.min(1,v.length/target.length);A.click();
      if(v===target||v.length>=target.length+2)finish(false);
    });
    inp.addEventListener("keydown",e=>{if(e.key==="Enter"&&norm(inp.value).length>norm(line).length*.7)finish(false)});
    T.setOk("PASS",()=>finish(true),null);
    const ghost=line=>{const n=line.length,base=rec.filter(x=>x!=null),tot=(base[base.length-1]||n*220)/(r===2?1.6:1.04);gk=tot/n;let i=0;
      const step=()=>{if(done||i>=n)return;i++;gst=i/n;gh.textContent="GHOST: "+line.slice(0,i);if(i>=n&&!done){finish(false)}else J.after(gk*(.7+Math.random()*.6),step)};J.after(gk,step)};
    setTimeout(()=>{try{inp.focus()}catch(e){}},300);
  };
  const results=()=>{T.md.innerHTML="";T.pad.innerHTML="";T.padLabel();
    seq(T,["Final score. YOU: "+score[0]+". GHOST: "+score[1]+". Our judges have reviewed the tape. The judges are also you. They're calling it a tie, and then they're coming over.",
      "Your ghost will be staying with the station. It has nowhere else to be. Neither, frankly, do you, or you'd have gone to bed an hour ago.",
      "Before you go: the ghost wanted us to read you something it typed during the break. Quote: “slow down. i'm right behind you. i'm always right behind you. that's what a ghost is.”"],()=>T.fin())};
  seq(T,["It's Beat Your Ghost, the game show where you race the only opponent who has never once let you win: you, about thirty seconds ago.",
    "Three rounds. Type the line on screen. Spelling counts. Capitals don't. Your ghost doesn't care about capitals either. Your ghost doesn't care about much."],()=>round());
});

/* ---------- 7. A MOMENT OF SILENCE: don't touch ---------- */
J.scene("t-silence",st=>{
  const T=unitTV(st,"t-silence");T.title("A MOMENT OF SILENCE","WJEF 32 remembers");
  let phase=0,el0=0,restarts=0,lit=0,secs=0;const DUR=20;
  let last=0;T.pic=(g,W,H,t,dt)=>{const p=T.p,cx=W/2,cy=H*.48;const now=performance.now();if(phase===1&&last)el0+=Math.min(.5,(now-last)/1000);last=now;
    const k=phase===1?Math.min(1,el0/DUR):phase>1?1:0;g.strokeStyle=p.dim;g.lineWidth=4;g.beginPath();g.arc(cx,cy,Math.min(W,H)*.22,0,6.3);g.stroke();
    g.strokeStyle=p.acc;g.beginPath();g.arc(cx,cy,Math.min(W,H)*.22,-Math.PI/2,-Math.PI/2+k*6.283);g.stroke();
    g.fillStyle=p.ink;g.fillRect(cx-11,cy-10,22,62);if(phase>=0){const f=1+Math.sin(t*11)*.12+Math.sin(t*4.3)*.1;g.fillStyle=p.acc2;g.beginPath();g.ellipse(cx,cy-22*f,6,15*f,0,0,6.3);g.fill()}
    if(phase===1){g.font="900 22px "+HEAD;g.textAlign="center";g.fillStyle=p.ink;g.fillText(String(Math.max(0,Math.ceil(DUR-el0))),cx,cy+Math.min(W,H)*.22+30);g.textAlign="left"}};
  const MEM=["He is survived by 1,204 Jeffs, one group, and everyone in his phone, who have been notified and are on their way.",
    "He enjoyed counting, being counted, and standing in doorways a little too long.","He had {teeth} teeth. In lieu of flowers, the family asks that you send teeth.",
    "He watched this channel every night. He never once looked behind the television. Good. Don't start now.","There's a little bit of him in the static. Turn the brightness up. There. Hi.",
    "He liked long walks to the kitchen and back, at night, without turning on the light."];
  const memBox=el("div");memBox.style.cssText="align-self:stretch;display:flex;flex-direction:column;gap:5px";
  const touch=e=>{if(phase!==1)return;restarts++;A.clank(.5);J.buzz(60);
    if(restarts>=3){phase=2;T.cap("We'll call that a moment. It was a short one. He'd want us to move on. He already has. He's ahead of you, on the next channel, waiting.");J.after(3000,after);return}
    el0=0;lit=0;memBox.innerHTML="";T.cap(restarts===1?"Someone touched their screen. The silence starts over. He would have hated that. He's smiling about it.":"Someone touched it again. We'll start once more. He's laughing now. It's not a nice laugh, but it's his.")};
  const go=()=>{phase=1;el0=0;T.md.appendChild(memBox);T.cap("Silence, please. Hands off the screen.");T.setOk(null);T.pad.innerHTML="";const h=txt("div","hands","HANDS OFF");h.dataset.act="wait:"+(DUR*1000+1500);T.pad.appendChild(h);A.static(0);
    window.addEventListener("pointerdown",touch,true);J.onClean(()=>window.removeEventListener("pointerdown",touch,true));
    const tick=J.every(500,()=>{if(phase!==1)return;const want=Math.min(MEM.length,Math.floor(el0/3.2));while(lit<want){memBox.appendChild(txt("div","cp",J.fill(MEM[lit])));lit++;while(memBox.children.length>3)memBox.firstChild.remove()}
      if(el0>=DUR){phase=2;secs=DUR;J.say("thank you",{pitch:.2,rate:.7});after()}});};
  const after=()=>{window.removeEventListener("pointerdown",touch,true);memBox.remove();T.pad.innerHTML="";T.padLabel();
    seq(T,[()=>(secs?"Thank you. That was "+secs+" seconds of silence. ":"Thank you. ")+"Nobody in the history of this station has held still that well. Usually the TV makes a noise. Tonight the TV held its breath too.",
      "We've just been told the viewer is fine. The viewer is watching right now. The viewer is reading this sentence with his lips moving a little. That's him. That's you. Hi.",
      "We'll keep the moment for later. Everyone gets one. Yours is in a drawer at the station, folded very small, with your name on it in pencil."],()=>T.fin())};
  const who=nm();
  seq(T,["WJEF 32 will now observe a moment of silence for a viewer we lost tonight.",
    ()=>(who?"The viewer's name was "+who+". ":"The viewer never gave us another name. ")+J.fill("Jeff #{no}. Last seen holding a {model} in the light of a television that was, by every account, switched off."),
    "During the moment, please do not touch your screen. The silence is very sensitive. It can feel exactly where your thumbs are. It's feeling them now."],()=>go());
});

/* ---------- sign-off ---------- */
J.scene("t-signoff",st=>{
  ch=1;const T=tv(st,{ch:1,snow:.8});J.save();
  T.pw.onclick=()=>T.flash("Not yet. The anthem first. Then it's all yours.");T.up.onclick=T.dn.onclick=()=>T.flash("Every channel is signing off at once tonight. They planned it.");
  T.title("END OF BROADCAST","WJEF 32 · {city}".replace("{city}",J.city.toUpperCase()));
  let card=0;const fcv=document.createElement("canvas");fcv.width=fcv.height=260;
  const flag=(g,W,H,t)=>{const p=T.p,rows=7,cols=11,cw=W*.8/cols,rh=H*.42/rows,x0=W*.1,y0=H*.12;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const y=y0+r*rh+Math.sin(t*2.4-c*.6)*6*(c/cols);tooth(g,x0+c*cw+cw/2,y+rh/2,cw*.82,rh*.9,r%2?p.acc:p.ink,null)}
    g.fillStyle=p.ink;g.fillRect(x0-6,y0-6,4,H*.62)};
  const test=(g,W,H,t)=>{const p=T.p,cols=[p.ink,p.acc2,J.C.dim,p.acc,J.C.bile,J.C.rust,mix(p.sbg,p.ink,.3)];cols.forEach((c,i)=>{g.fillStyle=c;g.fillRect(i*W/7,0,W/7+1,H*.5)});
    for(let i=0;i<7;i++){g.fillStyle=i%2?p.sbg:p.ink;g.fillRect(i*W/7,H*.5,W/7+1,H*.05)}
    const R=Math.min(W,H)*.2,cy=H*.29;g.fillStyle=p.sbg;g.beginPath();g.arc(W/2,cy,R,0,6.3);g.fill();if(!fcv._d){fcv._d=1;J.face(fcv,S.face,.45,{open:.15,bg:p.sbg})}g.save();g.beginPath();g.arc(W/2,cy,R-3,0,6.3);g.clip();g.drawImage(fcv,W/2-R,cy-R,R*2,R*2);g.restore();
    g.strokeStyle=p.ink;g.lineWidth=3;g.beginPath();g.arc(W/2,cy,R,0,6.3);g.stroke();
    g.fillStyle=p.sbg;g.fillRect(W*.1,H*.565,W*.8,44);g.fillStyle=p.ink;g.textAlign="center";g.font="900 14px "+HEAD;g.fillText("PLEASE STAND BY",W/2,H*.565+18);g.font="700 11px 'Courier New',monospace";g.fillText(("JEFF #"+S.no+" · "+J.D.model).toUpperCase(),W/2,H*.565+35);g.textAlign="left";
    if(card<1){card=Math.min(1,card+.02)}};
  T.pic=flag;
  const ANTHEM=["O say can you see, by the light of your {model},","every Jeff in the land, every tooth in his head,","O say does that group of the faces you chose","still wave, o'er the land of the Jeff and the home of the you."];
  seq(T,["WJEF 32 is now leaving the air. Before we go, please stand, if you're able, and face the nearest Jeff. If you can't see one, face the way the dog faces at night."].concat(
    ANTHEM.reduce((o,l,i)=>{if(i%2===0)o.push(()=>{J.say(J.fill(ANTHEM[i]),{pitch:.6,rate:.6});return J.fill(ANTHEM[i])+"\n"+J.fill(ANTHEM[i+1])});return o},[])),
    ()=>{T.pic=test;T.tick=false;T.title("TEST CARD","");seq(T,["That's the test card. It's your face. We've been testing it all night. It passed every test. It passed the ones we didn't mean to give it.",
      "Press POWER to turn off the set. It will turn off. We promise. We're not like that. We just like to be the last thing you see."],()=>{
      T.setOk(null);T.pw.dataset.act="tap";T.pw.dataset.pri="5";T.cap("Press POWER when you're ready. Take as long as you need. We're used to being looked at.");
      T.pw.onclick=()=>{delete T.pw.dataset.act;T.pw.onclick=null;off()}})},"OK");
  const off=()=>{
    A.thump();A.static(0);J.buzz(80);T.clear();T.tick=false;T.bug=false;T.power(false);T.setCh(0);let k=0;const p=T.p;
    T.on=false;T.picOff=false;
    T.post=(g,W,H,t,dt)=>{k+=dt;g.fillStyle=p.off;g.fillRect(0,0,W,H);g.fillStyle=p.ink;
      if(k<.35){const h=H*(1-k/.35)+2;g.fillRect(0,H/2-h/2,W,h)}else if(k<.7){const w=W*(1-(k-.35)/.35)+3;g.fillRect(W/2-w/2,H/2-1.5,w,3)}
      else{const a=Math.max(0,1-(k-.7)/3.5);g.globalAlpha=a;g.beginPath();g.arc(W/2,H/2,3,0,6.3);g.fill();g.globalAlpha=1}};
    J.after(2600,guide);
  };
  const guide=()=>{
    const gd=el("div","gd");gd.appendChild(txt("b","","TV GUIDE · WJEF 32 · TONIGHT"));
    const fmt=ms=>{const d=new Date(ms),h=d.getHours(),m=d.getMinutes();return((h%12)||12)+":"+(m<10?"0":"")+m};
    let at=S.t0||Date.now();S.run.forEach(u=>{const t=doneAt[u]||at;at=t;const pg=PROG[u];gd.appendChild(txt("p","",fmt(t)+"  "+(pg?pg[0]:"ELSEWHERE IN THE HOUSE")+": he "+(J.DID[u]||"was there")+"."))});
    gd.appendChild(txt("p","",fmt(Date.now())+"  SIGN-OFF. Test card (your face). Then nothing. Then, at 5:00, the farm report."));
    T.md.appendChild(gd);T.cap("The set is off. The little dot stays a while after. That's not the TV. That's your eyes, holding on.");
    T.pad.innerHTML="";const inp=el("input");inp.type="text";inp.maxLength=110;inp.placeholder="one line for whoever you send this to";inp.setAttribute("aria-label","one line for whoever you send this to");T.pad.appendChild(inp);
    const sh=txt("button","","send this to someone"),ag=txt("button","","go again");sh.type=ag.type="button";T.pad.appendChild(sh);T.pad.appendChild(ag);
    const text="I stayed up and watched WJEF 32 all night. I'm Jeff #"+S.no+" now. I can't explain it. Your turn.";
    sh.onclick=()=>{const u=J.inviteURL(inp.value.trim());A.click();if(navigator.share){navigator.share({title:"Jeff added you to a group",text:text,url:u}).catch(()=>{})}else{try{navigator.clipboard.writeText(u).then(()=>T.cap("Copied. It's on your clipboard. Paste it somewhere dark."),()=>T.cap(u))}catch(e){T.cap(u)}}};
    ag.dataset.act="end";ag.onclick=()=>{J.save();location.href=J.carry()};
    T.up.onclick=T.dn.onclick=()=>T.flash("The set is off. Your thumb keeps trying. We noticed. We noticed fondly.");
    T.pw.onclick=()=>T.flash("It's off. It stays off. That's a promise. The dot is just your eyes.");
    J.save();
  };
});
})();
