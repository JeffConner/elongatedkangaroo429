/* visit 4: the house. A floor plan you walk room to room. A second dot is always exactly one room away.
   Opening: the porch and a combination dial (h-door). Ending: the bedroom (h-bedroom). */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;
const TY="'Special Elite','Courier New',monospace",SER="Georgia,'Iowan Old Style','Times New Roman',serif";

/* ---------- look ---------- */
const css=`
body.fr-house{background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:32px 32px;background-position:-1px -1px}
body.fr-house #stage{font-family:${SER};padding-top:calc(14px + env(safe-area-inset-top))}
body.fr-house .hsheet{background:var(--bg);border:1px solid var(--dim);padding:14px 14px 16px;position:relative}
body.fr-house .hsheet+.hsheet{margin-top:10px}
body.fr-house .hk{font-family:${TY};font-size:.74rem;color:var(--rust);display:flex;justify-content:space-between;gap:10px}
body.fr-house .hh{font-family:${SER};font-weight:400;font-size:1.5rem;line-height:1.2;margin:8px 0 2px}
body.fr-house .hp{font-size:1.02rem;line-height:1.5;margin-top:10px}
body.fr-house .hp.i{font-style:italic;color:var(--dim);font-size:.86rem}
body.fr-house .hcap{font-size:1.02rem;line-height:1.5;margin-top:12px;min-height:4.6em}
body.fr-house .hcv{display:block;margin-top:12px;border:1px solid var(--dim);touch-action:none;user-select:none;-webkit-user-select:none;max-width:100%}
body.fr-house .hbtn{display:block;width:100%;margin-top:12px;padding:13px 16px;background:var(--bone);color:var(--bg);border:0;font-family:${TY};font-size:1rem;text-align:center}
body.fr-house .hbtn.alt{background:none;color:var(--bone);border:1px solid var(--dim)}
body.fr-house .hbtn[disabled]{opacity:.4}
body.fr-house .hrow{display:flex;gap:8px}
body.fr-house .hrow .hbtn{flex:1}
body.fr-house .hrooms{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
body.fr-house .hroom{padding:10px 11px;text-align:left;background:var(--panel);border:1px solid var(--bone);font-family:${SER};font-size:1rem;color:var(--bone)}
body.fr-house .hroom small{display:block;color:var(--dim);font-size:.76rem;margin-top:3px;font-style:italic;line-height:1.3}
body.fr-house .hroom[disabled]{border:1px dashed var(--dim);color:var(--dim)}
body.fr-house .hnote{font-family:${TY};background:var(--panel);border:1px solid var(--line);padding:12px 14px;margin-top:12px;line-height:1.5;font-size:.95rem;white-space:pre-line;transform:rotate(-.8deg)}
body.fr-house .hnum{font-family:${TY};font-size:1.7rem;text-align:center;margin-top:10px}
body.fr-house .hnum b{color:var(--rust);font-weight:400}
body.fr-house .hsw{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:14px}
body.fr-house .hswitch{width:74px;height:108px;background:var(--panel);border:2px solid var(--bone);border-radius:9px;position:relative;padding:0}
body.fr-house .hswitch i{position:absolute;left:23px;width:24px;height:40px;background:var(--bone);border-radius:4px;transition:top .12s}
body.fr-house .hswitch.on i{top:12px}
body.fr-house .hswitch.off i{top:52px}
body.fr-house .hsw span{font-family:${TY};font-size:.9rem;color:var(--dim);min-width:5em}
body.fr-house .hled{position:relative;height:180px;margin-top:14px}
body.fr-house .hcard{position:absolute;inset:0;background:var(--panel);border:1px solid var(--bone);padding:16px;font-family:${TY};font-size:1rem;line-height:1.45;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab}
body.fr-house .hcard .when{color:var(--rust);font-size:.8rem;margin-bottom:8px}
body.fr-house .hcard .amt{margin-top:10px;font-size:.86rem;color:var(--dim)}
body.fr-house .hcard .stp{position:absolute;right:12px;bottom:10px;border:2px solid var(--rust);color:var(--rust);padding:2px 8px;font-size:.9rem;opacity:0;transform:rotate(-6deg)}
body.fr-house .hcard.fly{transition:transform .32s ease-in,opacity .32s}
body.fr-house .hfloor{font-family:${TY};font-size:1.6rem;text-align:center;border:1px solid var(--dim);padding:6px;margin-top:12px;background:var(--panel)}
body.fr-house .hgap{margin-top:10px;border-left:44px solid var(--dim);border-right:44px solid var(--dim);padding:12px 14px;min-height:8.4em;background:var(--panel);font-size:1rem;line-height:1.5;transition:border-width .5s}
body.fr-house .hgap.shut{border-left-width:48%;border-right-width:48%;color:transparent}
body.fr-house .hpanel{display:grid;grid-template-columns:repeat(6,1fr);gap:7px;margin-top:12px;padding:12px;border:1px solid var(--dim);background:var(--panel)}
body.fr-house .hpanel button{aspect-ratio:1;border-radius:50%;border:1px solid var(--bone);background:var(--bg);font-family:${TY};font-size:.8rem;color:var(--bone);padding:0}
body.fr-house .hpanel button.lit{background:var(--rust);color:var(--bg);border-color:var(--rust)}
body.fr-house .hpanel button.been{border-style:dashed}
body.fr-house .hpanel button[disabled]{opacity:.7}
body.fr-house .hfield{margin-top:12px}
body.fr-house .hposter{position:sticky;top:8px;z-index:3;margin:12px auto 0}
body.fr-house .hfield>label{display:block;font-family:${TY};font-size:.8rem;color:var(--dim)}
body.fr-house .hchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
body.fr-house .hchips button{padding:8px 10px;background:var(--panel);border:1px solid var(--dim);font-size:.88rem;text-align:left;color:var(--bone);font-family:${SER}}
body.fr-house .hchips button.on{background:var(--bone);color:var(--bg);border-color:var(--bone)}
body.fr-house .hin::placeholder{color:var(--dim);opacity:1}
body.fr-house .hin{width:100%;margin-top:6px;padding:11px;background:var(--panel);border:1px solid var(--dim);font-family:${TY};font-size:16px;color:var(--bone);outline:none;border-radius:0}
body.fr-house .hyb{display:grid;grid-template-columns:repeat(3,1fr);gap:10px 8px;margin-top:12px}
body.fr-house .hyb figure{text-align:center;font-size:.72rem;line-height:1.25}
body.fr-house .hyb canvas{width:100%;height:auto;border:1px solid var(--line);display:block;margin-bottom:4px}
body.fr-house .hsig{font-family:${TY};font-size:.9rem;color:var(--rust);margin-top:8px;line-height:1.4}
body.fr-house .hsig:nth-child(odd){transform:rotate(-1.5deg)}
body.fr-house .hsig:nth-child(even){transform:rotate(1.2deg);text-align:right}
body.fr-house #toasts{top:auto;bottom:calc(46px + env(safe-area-inset-bottom))}
body.fr-house .hwh{background:var(--bg);border:1px solid var(--dim);padding:9px 12px;font-family:${SER};font-style:italic;font-size:.9rem;line-height:1.35;color:var(--bone);animation:fade .8s linear}
body.fr-house .hwh b{display:block;font-style:normal;font-family:${TY};font-size:.66rem;color:var(--dim);font-weight:400;margin-bottom:2px}
body.fr-house .hlegend{display:flex;gap:16px;font-family:${TY};font-size:.74rem;color:var(--dim);margin-top:8px}
body.fr-house .hlegend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px}
`;
const sty=document.createElement("style");sty.textContent=css;document.head.appendChild(sty);

/* ---------- helpers ---------- */
const hexA=(h,a)=>{h=String(h).replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return"rgba("+(n>>16&255)+","+(n>>8&255)+","+(n&255)+","+a+")"};
const lum=h=>{h=String(h).replace("#","");const n=parseInt(h,16);return((n>>16&255)*.299+(n>>8&255)*.587+(n&255)*.114)/255};
const faceBg=()=>lum(J.C.bg)>.5?J.C.bone:J.C.bg;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
function fit(cv,ratio){const dpr=Math.min(2,window.devicePixelRatio||1),w=Math.min(512,window.innerWidth-58),h=Math.round(w*ratio);
  cv.style.width=w+"px";cv.style.height=h+"px";cv.width=w*dpr;cv.height=h*dpr;const g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);return{g:g,w:w,h:h}}
function pos(cv,e){const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
function wrap(g,text,x,y,maxW,lh){const words=String(text).split(" ");let line="";
  for(let i=0;i<words.length;i++){const t=line?line+" "+words[i]:words[i];if(g.measureText(t).width>maxW&&line){g.fillText(line,x,y);y+=lh;line=words[i]}else line=t}
  if(line){g.fillText(line,x,y);y+=lh}return y}
const F=s=>J.fill(s);
const nm=()=>S.raw&&!/^je?ff/i.test(S.raw)?S.raw:"";
const sheet=(st,left,right,title)=>{const s=el("div","hsheet");const k=el("div","hk");k.appendChild(txt("span","",left));k.appendChild(txt("span","",right||""));s.appendChild(k);
  if(title)s.appendChild(txt("h2","hh",F(title)));st.appendChild(s);return s};
const btn=(parent,label,act,cls)=>{const b=txt("button","hbtn"+(cls?" "+cls:""),label);if(act)b.dataset.act=act;parent.appendChild(b);return b};
const para=(parent,text,cls)=>{const p=txt("p","hp"+(cls?" "+cls:""),F(text));parent.appendChild(p);return p};
const cap1=s=>s.replace(/(^|[.?!] )([a-z])/g,(m,a,b)=>a+b.toUpperCase());
const listJoin=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" and "+a[a.length-1];

/* ---------- the house ---------- */
const R={
  nursery:{x:.04,y:.04,w:.34,h:.27,n:"Nursery"},kitchen:{x:.04,y:.33,w:.34,h:.25,n:"Kitchen"},bath:{x:.04,y:.60,w:.34,h:.25,n:"Bathroom"},
  bedroom:{x:.62,y:.04,w:.34,h:.27,n:"Bedroom"},study:{x:.62,y:.33,w:.34,h:.25,n:"Study"},garage:{x:.62,y:.60,w:.34,h:.25,n:"Garage"},
  lift:{x:.42,y:.04,w:.16,h:.08,n:"Lift"},hall:{x:.42,y:.14,w:.16,h:.71,n:"Hall"},porch:{x:.34,y:.88,w:.32,h:.09,n:"Porch"}
};
const LEFTS=["nursery","kitchen","bath"],RIGHTS=["bedroom","study","garage"];
const ctr=k=>({x:R[k].x+R[k].w/2,y:R[k].y+R[k].h/2});
const door=k=>LEFTS.indexOf(k)>=0?{x:R[k].x+R[k].w,y:R[k].y+R[k].h/2}:RIGHTS.indexOf(k)>=0?{x:R[k].x,y:R[k].y+R[k].h/2}:k==="lift"?{x:.5,y:R.lift.y+R.lift.h}:k==="porch"?{x:.5,y:R.porch.y}:ctr("hall");
const hallPt=k=>({x:.5,y:clamp(door(k).y,.16,.83)});
const NB={porch:["bath","garage"],nursery:["kitchen","lift"],kitchen:["nursery","bath","study"],bath:["kitchen","porch"],lift:["nursery","bedroom"],
  bedroom:["study","lift"],study:["bedroom","garage","kitchen"],garage:["study","porch"],hall:["kitchen","study","lift"]};
const UNITS=["h-door","h-nursery","h-kitchen","h-bath","h-elevator","h-garage","h-study"];
const UR={"h-door":"porch","h-nursery":"nursery","h-kitchen":"kitchen","h-bath":"bath","h-elevator":"lift","h-garage":"garage","h-study":"study"};
const RU={};Object.keys(UR).forEach(u=>{RU[UR[u]]=u});
const TEASE={nursery:"a switch like a knuckle",kitchen:"something simmering",bath:"a warm ledger",lift:"too many basements",garage:"a printer, running",study:"one yearbook, many copies"};
const BEHIND={porch:"the dial, still warm",nursery:"door shut. two cribs now",kitchen:"a pot, still going",bath:"the ledger, closed",lift:"the gap, still open",garage:"every wall is a flyer",study:"your signature, drying"};
let here="porch",it="garage",meP=null,itP=null,talk=0,houseT0=0,choice={door:null,light:null};
const pickIt=k=>{const n=NB[k]||NB.hall;const o=n.filter(x=>x!==it);return J.pick(o.length?o:n)};

function drawPlan(g,ox,oy,W,H,o){
  o=o||{};const done=o.done||{},avail=o.avail||{},t=o.t||0;
  g.save();g.translate(ox,oy);
  g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);
  g.strokeStyle=hexA(J.C.line,.9);g.lineWidth=1;for(let x=0;x<W;x+=W/24){g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke()}for(let y=0;y<H;y+=W/24){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
  Object.keys(R).forEach(k=>{
    const r=R[k],x=r.x*W,y=r.y*H,w=r.w*W,h=r.h*H;
    if(done[k]){g.fillStyle=hexA(J.C.dim,.28);g.fillRect(x,y,w,h);g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.strokeStyle=hexA(J.C.dim,.5);g.lineWidth=1;for(let i=-h;i<w;i+=9){g.beginPath();g.moveTo(x+i,y+h);g.lineTo(x+i+h,y);g.stroke()}g.restore()}
    else if(avail[k]){g.fillStyle=hexA(J.C.rust,.14+.06*Math.sin(t*2.4));g.fillRect(x,y,w,h)}
    g.strokeStyle=J.C.bone;g.lineWidth=k==="hall"?1.5:2.5;g.strokeRect(x,y,w,h);
    if(k!=="hall"){const d=door(k),dw=W*.05;g.strokeStyle=J.C.panel;g.lineWidth=4;g.beginPath();
      if(k==="lift"||k==="porch"){g.moveTo(d.x*W-dw/2,d.y*H);g.lineTo(d.x*W+dw/2,d.y*H)}else{g.moveTo(d.x*W,d.y*H-dw/2);g.lineTo(d.x*W,d.y*H+dw/2)}g.stroke();
      if(done[k]){g.strokeStyle=J.C.rust;g.lineWidth=2.5;g.beginPath();if(k==="lift"||k==="porch"){g.moveTo(d.x*W-dw/2,d.y*H);g.lineTo(d.x*W+dw/2,d.y*H)}else{g.moveTo(d.x*W,d.y*H-dw/2);g.lineTo(d.x*W,d.y*H+dw/2)}g.stroke()}}
    if(o.labels!==false&&k!=="hall"){g.fillStyle=J.C.bone;g.font=(k==="lift"?10:13)+"px "+TY;g.textAlign="left";g.fillText(r.n,x+5,y+(k==="lift"?h-5:15));
      if(done[k]&&k!=="lift"&&k!=="porch"){g.fillStyle=J.C.dim;g.font="italic 10px "+SER;wrap(g,BEHIND[k],x+5,y+30,w-10,12)}}
  });
  if(o.labels!==false){g.save();g.translate(W*.5,H*.5);g.rotate(-Math.PI/2);g.fillStyle=J.C.dim;g.font="11px "+TY;g.textAlign="center";g.fillText("hall",0,4);g.restore()}
  const dot=(p,fill,lab)=>{if(!p)return;const x=p.x*W,y=p.y*H;g.beginPath();g.arc(x,y,o.dr||6.5,0,6.3);if(fill){g.fillStyle=J.C.rust;g.fill()}else{g.fillStyle=J.C.panel;g.fill();g.strokeStyle=J.C.bone;g.lineWidth=2;g.stroke()}
    if(lab){g.fillStyle=J.C.rust;g.font="11px "+TY;g.textAlign="center";g.fillText(lab,x,y-11)}};
  dot(o.it,false);dot(o.me,true,o.meLabel===undefined?"you":o.meLabel);
  g.restore();
}
const whisper=t=>{const d=el("div","hwh");d.appendChild(txt("b","","from the next room"));d.appendChild(document.createTextNode(t));const box=document.getElementById("toasts");if(!box)return false;box.appendChild(d);A.blip(196,.4,"sine",.05);setTimeout(()=>d.remove(),5600);return true};

J.frame("house",{hub:"h-plan",end:"h-bedroom",units:UNITS,label:"the house",onEnter:()=>{J.toastHook=whisper;J.TOASTHEAD="from the next room";if(!houseT0)houseT0=Date.now()}});
Object.assign(J.DID,{"h-door":"opened his own front door with his own numbers","h-nursery":"flicked the nursery light until the room ran out of changes","h-kitchen":"chopped his own name into a soup",
  "h-bath":"audited the tooth fairy","h-elevator":"rode the lift down to a basement that isn't there","h-garage":"printed a lost-pet flyer for himself","h-study":"signed the yearbook and got signed back"});

/* ---------- the floor plan (hub) ---------- */
const NARR=["It's in the {r} now. It got there without using the hall.","{r}. You can hear it straightening something that was already straight.","It's in the {r}. It's very good at being the next room. It practices.",
  "It moved to the {r} the moment you chose. It wants to be close, not rude.","The {r}. It's standing in the exact middle, where you would stand.","It's in the {r}, making the noise a person makes pretending not to be in a room.",
  "{r} now. It knocked on the wall once. One knock means hi. Two means you're doing great.","It's in the {r}, humming something it picked up off the broadcast. You can't place it. It can.","{r}. It turned the light on in there so you'd know. Considerate."];
J.scene("h-plan",(st,arg)=>{
  arg=arg||{};const left=J.left("house");
  if((arg.first||arg.enter)&&left.indexOf("h-door")>=0)return J.go("h-door");
  if(arg.back&&UR[arg.back])here=arg.back==="h-door"?"hall":UR[arg.back];
  if(arg.enter&&!arg.back)here="hall";
  if(!NB[here]||(NB[here].indexOf(it)<0))it=pickIt(here);
  meP=ctr(here);if(here==="hall")meP={x:.5,y:.62};itP=ctr(it);
  const done={},avail={};S.run.forEach(u=>{if(UR[u])done[UR[u]]=1});left.forEach(u=>{if(UR[u])avail[UR[u]]=1});
  const nDone=Object.keys(done).length;
  const title=arg.enter&&!arg.back?"The group moved into a house and kept your coat.":nDone<=1?"The floor plan by the coat hook.":nDone===2?"The plan again. Somebody has been drawing on it.":nDone===3?"Halfway through the house.":nDone===4?"The plan has more pencil on it than it did.":nDone===5?"Two rooms left, not counting the one at the end.":"One more door.";
  const sh=sheet(st,"FLOOR PLAN",J.clock(),title);
  const cv=el("canvas","hcv");sh.appendChild(cv);const P=fit(cv,1.1),g=P.g,W=P.w,H=P.h;
  const lg=el("div","hlegend");lg.innerHTML="<span><i></i>you</span><span><i></i>also you, one room over</span>";const ii=lg.querySelectorAll("i");ii[0].style.background=J.C.rust;ii[1].style.border="2px solid "+J.C.bone;sh.appendChild(lg);
  const cap=txt("p","hcap","");sh.appendChild(cap);
  let intro;
  if(arg.enter&&!arg.back)intro="You're in the hall already. The plan on the wall has two dots on it. One is labeled you. The other one isn't labeled, it's just in the {r}, and it's been there since before you got here.";
  else if(nDone<=1&&arg.back==="h-door")intro="You're the red dot. You're in the hall. The other dot is in the {r}. The legend at the bottom of the plan says, in pencil: also you, one room over. Pick a room. It will move when you move. It always keeps one wall between you, like a good roommate.";
  else intro=NARR[talk++%NARR.length];
  cap.textContent=cap1(F(intro.replace("{r}",R[it].n.toLowerCase())));
  let walking=null,lastT=0;
  J.raf((t,dt)=>{lastT=t;
    if(walking){const p=walking.path;if(p.length){const q=p[0],dx=q.x-meP.x,dy=q.y-meP.y,d=Math.hypot(dx,dy),sp=.42*dt;if(d<=sp){meP={x:q.x,y:q.y};p.shift()}else{meP={x:meP.x+dx/d*sp,y:meP.y+dy/d*sp}}
        if(Math.random()<dt*3)A.blip(90+Math.random()*30,.05,"sine",.05)}
      else{const f=walking.done;walking=null;f()}}
    const tp=ctr(it);itP={x:itP.x+(tp.x-itP.x)*Math.min(1,dt*1.6),y:itP.y+(tp.y-itP.y)*Math.min(1,dt*1.6)};
    drawPlan(g,0,0,W,H,{t:t,done:done,avail:walking?{}:avail,me:meP,it:itP});
  });
  const walkTo=(k,then,nx)=>{
    const path=[];if(here!=="hall")path.push(door(here));path.push(hallPt(here));path.push(hallPt(k));path.push(door(k));path.push(ctr(k));
    it=nx||pickIt(k);here=k;walking={path:path,done:()=>J.after(500,then)};A.thump();
  };
  const grid=el("div","hrooms");sh.appendChild(grid);const bs=[];
  const go=k=>{if(walking)return;J.start();bs.forEach(b=>{b.disabled=true;delete b.dataset.act});
    const nx=pickIt(k);cap.textContent=cap1(F(("You walk. The floor knows the way. "+NARR[talk++%NARR.length]).replace("{r}",R[nx].n.toLowerCase())));
    const u=RU[k];walkTo(k,()=>J.go(u),nx);};
  ["nursery","lift","kitchen","study","bath","garage"].forEach(k=>{
    const b=el("button","hroom");b.appendChild(document.createTextNode(R[k].n));b.appendChild(txt("small","",done[k]?"shut":avail[k]?TEASE[k]:"locked"));
    b.disabled=!avail[k];if(avail[k])b.dataset.act="tap";grid.appendChild(b);bs.push(b);b.addEventListener("click",()=>go(k));
  });
  cv.addEventListener("pointerdown",e=>{const p=pos(cv,e),x=p[0]/W,y=p[1]/H;Object.keys(R).forEach(k=>{const r=R[k];if(x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h&&avail[k])go(k)})});
  if(!left.length){
    const rest=J.undone().length>0;
    const ex=para(sh,rest?"The house is done with you for now. It doesn't say goodbye. It says see you in a minute, which is worse.":"Every door you opened is shut behind you now. The bedroom light is on at the end of the hall. The other dot has stepped into the hall and is standing to one side, to let you pass. It's polite. It's been polite all night.");
    grid.remove();
    const b=btn(sh,rest?"out the back door":"go to bed","tap");
    b.addEventListener("click",()=>{if(walking)return;b.disabled=true;J.start();if(rest){walkTo("porch",()=>J.next())}else{it="hall";walkTo("bedroom",()=>J.next())}});
  }
});

/* ---------- h-door: the porch, a dial, your own numbers ---------- */
J.scene("h-door",(st,arg)=>{
  const sh=sheet(st,"THE PORCH",J.clock(),"There's a house where the broadcast used to be.");
  para(sh,"You're on a porch. It's {t} in {city}. You don't remember walking here, which, after the last few times, is the least strange thing that will happen tonight.");
  const last=J.lastDid().slice(0,3);
  const lastLine=last.length?"There's a sticky note on the door, in your handwriting, signed by somebody else. It says: Jeff #{no} "+listJoin(last)+". Then the broadcast ended. The house didn't.":"There's a sticky note on the door, in your handwriting, signed by somebody else. It says: you sat up all night with the broadcast. it signed off. we didn't.";
  const lp=para(sh,lastLine);
  para(sh,"Same as always: sudden sounds, a voice, a flash or two, an amount of teeth. Nothing you do in the house leaves your {model}.","i");
  const step=btn(sh,"step onto the mat","tap");
  step.addEventListener("click",()=>{J.start();A.thump();step.remove();lp.remove();dial()});
  if(arg&&arg.jump){}
  const dial=()=>{
    sh.querySelector(".hh").textContent="The mat says WELCOME HOME, JEFF #"+S.no+".";
    sh.querySelectorAll(".hp").forEach(p=>p.remove());
    para(sh,"The door has no knob. No keyhole. Just a dial in the middle, like a gym locker, if the gym were very old and lived inside a mouth.");
    const target=[Math.min(99,S.teeth+1),Math.min(99,S.visits),S.no%100];
    const note=txt("div","hnote",F("Combination (it's you):\n1. Your teeth. Not your count. Ours: {teeth1}.\n2. How many times you've come here, counting this one. The porch counts too: "+S.visits+".\n3. The last two digits of Jeff #{no}.\nTurn the dial. Let go on each number."));sh.appendChild(note);
    const cv=el("canvas","hcv");sh.appendChild(cv);const P=fit(cv,.9),g=P.g,W=P.w,H=P.h;
    const num=el("div","hnum");sh.appendChild(num);
    const cap=txt("p","hcap","Drag around the dial. The number under the little red notch is the one it reads.");sh.appendChild(cap);
    let rot=0,la=0,drag=false,moved=0,stage=0,wrong=0,locked=[],openK=0,lastK=-1;
    const top=()=>((Math.round(-rot/3.6)%100)+100)%100;
    const setAct=()=>{if(stage>2){delete cv.dataset.act;return}const want=target[stage];let d=((-want*3.6-rot)%360+360)%360;if(d>180)d-=360;cv.dataset.act="rotate:"+d.toFixed(1)+",1600"};
    const show=()=>{num.innerHTML="";for(let i=0;i<3;i++){const s=txt("b","",i<locked.length?String(locked[i]):i===stage?String(top()):"__");if(i>locked.length)s.style.color=J.C.dim;num.appendChild(s);if(i<2)num.appendChild(document.createTextNode("  -  "))}};
    const OKL=["Click. The first one goes in. Somewhere in the house a light comes on in a room you haven't been in yet.","Click. Second one. The porch light flickers twice, in the exact rhythm you'd use to count to two.","Click. On the other side of the door, something says yep, in your voice, with its mouth very close to the wood."];
    const NOL=["No. That's somebody else's number. They'd be upset you know it.","Close. Close counts in horseshoes and in houses. Try again.","The dial clicks over on its own. Fine. It turned itself. It's been waiting too long to be precious about it."];
    const ang=p=>Math.atan2(p[1]-H/2,p[0]-W/2)*180/Math.PI;
    cv.addEventListener("pointerdown",e=>{if(stage>2)return;drag=true;moved=0;la=ang(pos(cv,e));try{cv.setPointerCapture(e.pointerId)}catch(x){}});
    cv.addEventListener("pointermove",e=>{if(!drag)return;const a=ang(pos(cv,e));let d=a-la;if(d>180)d-=360;if(d<-180)d+=360;rot+=d;moved+=Math.abs(d);la=a;const k=top();if(k!==lastK){lastK=k;A.click();show()}});
    const up=()=>{if(!drag)return;drag=false;if(moved<8||stage>2)return;
      const k=top(),want=target[stage];
      if(Math.abs(k-want)<=1||Math.abs(k-want)>=99){lock(want)}
      else{wrong++;A.clank(.3);if(wrong>=3){rot=-want*3.6;lock(want,NOL[2])}else cap.textContent=NOL[Math.min(wrong-1,1)]+" It's on "+k+"."}
      setAct()};
    cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
    const lock=(v,line)=>{locked.push(v);rot=-v*3.6;cap.textContent=line?line+" "+OKL[stage]:OKL[stage];stage++;wrong=0;A.thump();show();if(stage>2)J.after(1800,opened)};
    const opened=()=>{A.crunch();J.cut("HOME",110);
      cap.textContent="The door swings in. It was never locked. The dial was a courtesy. It wanted to watch you remember your own numbers. You did. It's proud of you, in the way a house can be proud, which is mostly creaking.";
      J.after(2600,()=>{para(sh,"Inside: a hallway. A coat hook with your coat on it, which is weird, because you're wearing it. And taped to the wall, a floor plan of the house with a little red dot that says YOU, and another little dot that doesn't say anything at all.");
        const b=btn(sh,"go in","tap");b.addEventListener("click",()=>{b.disabled=true;here="porch";J.unitDone("h-door")})})};
    show();setAct();
    J.raf(t=>{
      g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);
      const dw=W*.62*(1-openK),dx=(W-W*.62)/2;
      if(stage>2)openK=Math.min(.9,openK+.012);
      g.fillStyle=faceBg();g.fillRect(dx,H*.03,W*.62,H*.95);
      if(openK>0){g.strokeStyle=J.C.dim;g.lineWidth=1;for(let i=1;i<6;i++){const k=i/6;g.strokeRect(W/2-W*.31*(1-k*.8),H*.03+H*.95*k*.4,W*.62*(1-k*.8),H*.95*(1-k*.8))}}
      g.fillStyle=J.C.panel;g.strokeStyle=J.C.bone;g.lineWidth=2;g.fillRect(dx,H*.03,dw,H*.95);g.strokeRect(dx,H*.03,dw,H*.95);
      if(openK>0)return;
      g.strokeStyle=hexA(J.C.bone,.35);g.lineWidth=1;g.strokeRect(dx+W*.06,H*.08,W*.5,H*.28);g.strokeRect(dx+W*.06,H*.62,W*.5,H*.3);
      const cx=W/2,cy=H/2,Rr=Math.min(W,H)*.3;
      g.beginPath();g.arc(cx,cy,Rr*1.08,0,6.3);g.fillStyle=J.C.bg;g.fill();g.strokeStyle=J.C.bone;g.lineWidth=2;g.stroke();
      for(let i=0;i<100;i++){const a=(i*3.6+rot-90)*Math.PI/180,l=i%10===0?Rr*.16:i%5===0?Rr*.1:Rr*.05;
        g.strokeStyle=J.C.bone;g.lineWidth=i%10===0?2:1;g.beginPath();g.moveTo(cx+Math.cos(a)*Rr,cy+Math.sin(a)*Rr);g.lineTo(cx+Math.cos(a)*(Rr-l),cy+Math.sin(a)*(Rr-l));g.stroke();
        if(i%10===0){g.fillStyle=J.C.bone;g.font="12px "+TY;g.textAlign="center";g.fillText(String(i),cx+Math.cos(a)*Rr*.68,cy+Math.sin(a)*Rr*.68+4)}}
      g.beginPath();g.arc(cx,cy,Rr*.3,0,6.3);g.fillStyle=J.C.panel;g.fill();g.strokeStyle=J.C.bone;g.stroke();
      g.fillStyle=J.C.rust;g.beginPath();g.moveTo(cx-8,cy-Rr*1.2);g.lineTo(cx+8,cy-Rr*1.2);g.lineTo(cx,cy-Rr*1.04);g.fill();
      g.fillStyle=J.C.bone;g.font="11px "+TY;g.textAlign="center";g.fillText(String(S.no%1000).padStart(3,"0"),cx,H*.11);
    });
  };
});

/* ---------- h-nursery: the light switch ---------- */
J.scene("h-nursery",()=>{
  const st=J.$("#stage");
  const sh=sheet(st,"THE NURSERY","it is in the "+R[it].n.toLowerCase(),"The nursery. There's no baby. There's a crib, though, and it's made.");
  para(sh,"You don't have a nursery. You do now. There's a light switch by the door, the old kind that clicks like a knuckle. The room only changes while it's dark. That's the rule. The room told you the rule, in a little voice like a music box with a cold.");
  const cv=el("canvas","hcv");sh.appendChild(cv);const P=fit(cv,.86),g=P.g,W=P.w,H=P.h;
  const row=el("div","hsw");const sw=el("button","hswitch on");sw.appendChild(el("i"));sw.setAttribute("aria-label","light switch");sw.dataset.act="tap";const lab=txt("span","","light: on");row.appendChild(sw);row.appendChild(lab);sh.appendChild(row);
  const cap=txt("p","hcap","Turn the light off.");sh.appendChild(cap);
  const name=(nm()||"you").toUpperCase();
  const DARK=["Dark. Something in here takes one careful step, like it's carrying soup.","Dark. The mobile starts turning. There's no draft. There's breathing, which is like a draft with opinions.",
    "Dark. You hear a second click. Not your switch. A switch in a room you can't see, answering yours.","Dark. Something taps on the window. From the inside of the window. Gently. With a fingernail it's proud of.",
    "Dark. A voice at exactly crib height says your name. It pronounces it Jeff."];
  const CH=["Light. The rocking chair has turned around to face the crib. It's still rocking a little. Chairs don't do that. This one has been practicing.",
    "Light. The mobile used to be little stars. Now it's baby teeth. They turn slowly, showing you their good sides.",
    "Light. There are two cribs now. The new one is bigger. It's about your size. It's made, too. Hospital corners.",
    "Light. There's a face in the window. Small, pale, leaning in close. It's yours. It's the face you picked at the door, the very first night.",
    "Light. The name plate on the big crib used to say JEFF. Now it says "+name+". The little crib's plate says JEFF #{no}. They're bunk beds now. Nobody saw them become bunk beds."];
  let light=true,c=0,busy=false,over=false;
  const tooth=(x,y,s)=>{g.beginPath();g.moveTo(x-s*.5,y-s*.4);g.quadraticCurveTo(x,y-s*.7,x+s*.5,y-s*.4);g.lineTo(x+s*.4,y+s*.3);g.lineTo(x+s*.15,y+s*.1);g.lineTo(x,y+s*.45);g.lineTo(x-s*.15,y+s*.1);g.lineTo(x-s*.4,y+s*.3);g.closePath();g.fill();g.stroke()};
  const star=(x,y,s)=>{g.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,r=i%2?s*.4:s;g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}g.closePath();g.fill();g.stroke()};
  const crib=(x,y,w,h,plate)=>{g.strokeStyle=J.C.bone;g.lineWidth=2;g.strokeRect(x,y,w,h);g.lineWidth=1;for(let i=1;i<9;i++){g.beginPath();g.moveTo(x+w*i/9,y);g.lineTo(x+w*i/9,y+h);g.stroke()}
    g.fillStyle=J.C.panel;g.fillRect(x+w*.22,y+h*.38,w*.56,h*.22);g.strokeRect(x+w*.22,y+h*.38,w*.56,h*.22);g.fillStyle=J.C.bone;g.font=Math.round(h*.13)+"px "+TY;g.textAlign="center";g.fillText(plate,x+w/2,y+h*.54)};
  const fc=document.createElement("canvas");fc.width=fc.height=120;
  J.raf(t=>{
    g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);g.strokeStyle=J.C.line;g.lineWidth=1;g.beginPath();g.moveTo(0,H*.8);g.lineTo(W,H*.8);g.stroke();
    for(let i=0;i<W;i+=18){g.beginPath();g.moveTo(i,H*.8);g.lineTo(i-10,H);g.stroke()}
    const wx=W*.66,wy=H*.07,ww=W*.26,wh=H*.27;g.fillStyle=faceBg();g.fillRect(wx,wy,ww,wh);g.strokeStyle=J.C.bone;g.lineWidth=2;g.strokeRect(wx,wy,ww,wh);
    if(c>=4){J.face(fc,S.face,.15,{bg:faceBg(),lx:-.6,ly:.5,open:.1});g.drawImage(fc,wx+ww*.25,wy+wh*.2,ww*.5,ww*.5)}
    g.beginPath();g.moveTo(wx+ww/2,wy);g.lineTo(wx+ww/2,wy+wh);g.moveTo(wx,wy+wh/2);g.lineTo(wx+ww,wy+wh/2);g.strokeStyle=J.C.dim;g.lineWidth=2;g.stroke();g.fillStyle=J.C.dim;g.beginPath();g.arc(wx+ww*.78,wy+wh*.22,5,0,6.3);g.fill();
    g.fillStyle=J.C.bone;g.fillRect(W*.4,H*.28,W*.2,3);
    for(let i=0;i<3;i++){const x=W*(.43+i*.065),y=H*.28;g.save();g.translate(x,y);if(c>=5)g.scale(-1,1);g.fillStyle=J.C.rust;g.beginPath();g.arc(0,-9,5,0,6.3);g.fill();g.fillRect(-5,-5,10,5);if(c>=5){g.fillStyle=J.C.bone;g.fillRect(-1,-4,1.5,1.5)}g.restore()}
    if(c>=5){g.fillStyle=J.C.bone;g.fillRect(W*.43-3,H*.28-6,6,4)}
    crib(W*.06,H*.48,W*.34,H*.3,c>=5?"JEFF #"+S.no:"JEFF");
    if(c>=3)crib(W*.56,c>=5?H*.38:H*.44,W*.4,c>=5?H*.4:H*.34,c>=5?name.slice(0,10):"");
    const mx=W*.23;g.strokeStyle=J.C.bone;g.lineWidth=1;g.beginPath();g.moveTo(mx,0);g.lineTo(mx,H*.12);g.stroke();
    const sp=t*(c>=1?.9:.25);g.beginPath();g.moveTo(mx-Math.cos(sp)*W*.13,H*.12);g.lineTo(mx+Math.cos(sp)*W*.13,H*.12);g.stroke();
    for(let i=0;i<4;i++){const a=sp+i*Math.PI/2,x=mx+Math.cos(a)*W*.13,yy=H*.12+H*.09+(i%2)*H*.04;g.beginPath();g.moveTo(x,H*.12);g.lineTo(x,yy-6);g.stroke();
      g.fillStyle=J.C.panel;g.strokeStyle=J.C.bone;if(c>=2)tooth(x,yy,10);else star(x,yy,8)}
    const chx=c>=1?W*.48:W*.5,face=c>=1?-1:1,rk=Math.sin(t*2)*.06*(c>=1?1:.3);g.save();g.translate(chx,H*.78);g.rotate(rk);g.scale(face,1);g.strokeStyle=J.C.bone;g.lineWidth=2;
    g.beginPath();g.moveTo(-W*.06,-H*.12);g.lineTo(W*.05,-H*.12);g.moveTo(W*.05,-H*.12);g.lineTo(W*.07,-H*.32);g.moveTo(-W*.05,-H*.12);g.lineTo(-W*.05,-H*.02);g.moveTo(W*.04,-H*.12);g.lineTo(W*.04,-H*.02);g.stroke();
    g.beginPath();g.arc(0,-H*.55,H*.55,Math.PI*.42,Math.PI*.58);g.stroke();g.restore();
    if(!light){g.fillStyle="rgba(0,0,0,.88)";g.fillRect(0,0,W,H);g.fillStyle=hexA(J.C.rust,.8);g.fillRect(W*.03,H*.76,5,4);
      if(Math.sin(t*1.7)>.6){g.fillStyle="rgba(255,255,255,.07)";g.beginPath();g.arc(W*(.3+.4*Math.sin(t*.3)),H*.6,22,0,6.3);g.fill()}}
  });
  const flip=()=>{
    if(busy||over)return;busy=true;sw.disabled=true;A.click();A.blip(70,.08,"square",.1);light=!light;sw.className="hswitch "+(light?"on":"off");lab.textContent=light?"light: on":"light: off";
    if(!light){cap.textContent=DARK[c];J.buzz(20);if(c===4)J.say(nm()||"Jeff",{pitch:1.4,rate:.6})}
    else{c++;A.thump();cap.textContent=F(CH[c-1]);if(c===4)J.cut("WINDOW",90)}
    J.after(1100,()=>{busy=false;sw.disabled=false;
      if(light&&c>=5){over=true;sw.disabled=true;delete sw.dataset.act;
        J.after(600,()=>{para(sh,"The music box voice says: it'll do the rest later, when you're asleep. That's when rooms get the most done.");
          const b=btn(sh,"back out of the nursery","tap");b.addEventListener("click",()=>{b.disabled=true;J.unitDone("h-nursery")})})}});
  };
  sw.addEventListener("click",flip);
});

/* ---------- h-kitchen: slice ---------- */
J.scene("h-kitchen",()=>{
  const st=J.$("#stage");
  const sh=sheet(st,"THE KITCHEN","it is in the "+R[it].n.toLowerCase(),"The kitchen smells like somebody's mom. Not yours. Somebody's.");
  para(sh,"A recipe card is propped against the toaster, in handwriting that slopes like it was written on a moving train: JEFF'S FAMOUS. SERVES EVERYONE. ALL OF THEM JEFF. There's a cutting board and a knife that is extremely polite about all this. Draw a line across each thing to cut it.");
  const card=txt("div","hnote","");sh.appendChild(card);
  const cv=el("canvas","hcv");sh.appendChild(cv);const P=fit(cv,.72),g=P.g,W=P.w,H=P.h;
  const cap=txt("p","hcap","");sh.appendChild(cap);
  const name=nm()||"your name";
  const IT=[
    {l:"1. one onion, the kind that cries first",lab:"onion",k:"onion",need:1,after:"It cried first. You didn't even get a chance. That's how it gets you to feel bad for it. Into the pot."},
    {l:"2. your name, finely chopped",k:"slip",lab:name,need:1,after:"Your name, minced. It goes into the pot in little pieces. Don't worry. It grows back. It grows back as Jeff, but it grows back."},
    {l:"3. one cup of the dark from under the bed",lab:"the dark",need:1,dark:1,after:"You can't cut the dark. It just lets you think you did, to be nice. It climbs into the pot by itself, like a cat that heard a can open."},
    {l:"4. one (1) you, room temperature",lab:"GUEST: JEFF #"+S.no,need:1,you:1,after:"The knife won't. It sets itself down. It's a polite knife, and it explains: the recipe means you as in company. You're not in the soup. You're who the soup is for. Everyone gets very quiet and very happy at the same time."}
  ];
  let idx=0,cuts=[],fails=0,stroke=null,split=0,waiting=false;
  const box=()=>({x:W*.22,y:H*.3,w:W*.56,h:H*.4});
  const setCard=()=>{card.textContent="FROM THE KITCHEN OF JEFF\n"+IT.map((x,i)=>(i<idx?"[done] ":i===idx?"> ":"")+x.l).join("\n")};
  const setAct=()=>{if(waiting){delete cv.dataset.act;return}cv.dataset.at="0."+(4+cuts.length)+",0.08";cv.dataset.act="drag:"+(cuts.length?W*.1:-W*.06).toFixed(0)+","+(H*.84).toFixed(0)+",700"};
  const start=()=>{cuts=[];fails=0;split=0;waiting=false;setCard();cap.textContent=idx===0?"Start with the onion. Draw a line straight through it.":IT[idx].you?"Last ingredient. The board is ready. It's waiting for you.":"Next: "+IT[idx].l.replace(/^\d\. /,"")+".";setAct()};
  const finish=()=>{waiting=true;setAct();const it2=IT[idx];A.crunch();cap.textContent=F(it2.after);
    J.after(1600,()=>{if(idx<IT.length-1){const b=btn(sh,"next ingredient","tap");b.addEventListener("click",()=>{b.remove();idx++;start()})}
      else{setCard();para(sh,"The pot is simmering. Dinner is at {t4}. There's a place set for you in the next room. There is no next room off this kitchen.");
        const b=btn(sh,"leave it simmering","tap");b.addEventListener("click",()=>{b.disabled=true;J.unitDone("h-kitchen")})}})};
  const crosses=(a,b)=>{const B=box();const inside=p=>p.x>B.x&&p.x<B.x+B.w&&p.y>B.y&&p.y<B.y+B.h;if(inside(a)&&inside(b))return false;
    for(let i=1;i<20;i++){const k=i/20;if(inside({x:a.x+(b.x-a.x)*k,y:a.y+(b.y-a.y)*k}))return Math.hypot(b.x-a.x,b.y-a.y)>Math.min(B.w,B.h)*.6}return false};
  cv.addEventListener("pointerdown",e=>{if(waiting)return;const p=pos(cv,e);stroke={a:{x:p[0],y:p[1]},b:{x:p[0],y:p[1]}};try{cv.setPointerCapture(e.pointerId)}catch(x){}});
  cv.addEventListener("pointermove",e=>{if(!stroke)return;const p=pos(cv,e);stroke.b={x:p[0],y:p[1]}});
  const up=()=>{if(!stroke)return;const s=stroke;stroke=null;if(waiting)return;const it2=IT[idx];
    if(crosses(s.a,s.b)){
      if(it2.you){finish();J.say("you're the company",{pitch:.4,rate:.7});return}
      cuts.push(s);A.blip(900,.06,"sawtooth",.08,300);J.buzz(15);
      if(it2.dark&&cuts.length===1){cap.textContent="The line closes behind the knife like water. Try again. It won't help. Try anyway.";}
      if(cuts.length>=it2.need)finish();else setAct();
    }else{fails++;A.click();if(fails>=4){cuts.push({a:{x:W*.5,y:0},b:{x:W*.5,y:H}});cap.textContent="The knife does it for you, gently, the way you'd help a kid with a sandwich.";J.after(900,finish)}else{cap.textContent="Not through it. Start outside the thing, end outside the thing, go straight through the middle.";setAct()}}};
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  J.raf((t,dt)=>{
    const B=box(),it2=IT[idx];if(waiting)split=Math.min(1,split+dt*1.5);
    g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);
    g.fillStyle=J.C.bg;g.strokeStyle=J.C.bone;g.lineWidth=2;g.fillRect(W*.06,H*.12,W*.88,H*.78);g.strokeRect(W*.06,H*.12,W*.88,H*.78);
    g.strokeStyle=hexA(J.C.line,.8);g.lineWidth=1;for(let i=0;i<7;i++){g.beginPath();g.moveTo(W*.08,H*(.18+i*.1));g.lineTo(W*.92,H*(.18+i*.1)+3);g.stroke()}
    const off=it2.dark?0:split*W*.08;
    for(let s=-1;s<=1;s+=2){g.save();g.beginPath();g.rect(s<0?0:W/2,0,W/2,H);g.clip();g.translate(s*off,split*s*4);
      if(it2.you){g.fillStyle=J.C.bg;g.strokeStyle=J.C.rust;g.lineWidth=2;g.fillRect(B.x,B.y+B.h*.2,B.w,B.h*.6);g.strokeRect(B.x,B.y+B.h*.2,B.w,B.h*.6)}
      else if(it2.dark){g.fillStyle="rgba(0,0,0,"+(.75+.1*Math.sin(t*3))+")";g.beginPath();g.ellipse(W/2,B.y+B.h/2,B.w/2,B.h/2*(1+.05*Math.sin(t*2)),0,0,6.3);g.fill()}
      else if(it2.k==="bread"){g.fillStyle=J.C.panel;g.strokeStyle=J.C.bone;g.lineWidth=2;g.beginPath();g.moveTo(B.x,B.y+B.h);g.lineTo(B.x,B.y+B.h*.35);g.quadraticCurveTo(B.x,B.y,B.x+B.w*.2,B.y);g.lineTo(B.x+B.w*.8,B.y);g.quadraticCurveTo(B.x+B.w,B.y,B.x+B.w,B.y+B.h*.35);g.lineTo(B.x+B.w,B.y+B.h);g.closePath();g.fill();g.stroke();
        g.strokeRect(B.x+B.w*.44,B.y+B.h*.5,B.w*.12,B.h*.5);g.beginPath();g.arc(B.x+B.w*.53,B.y+B.h*.76,2,0,6.3);g.stroke()}
      else if(it2.k==="slip"){g.fillStyle=J.C.panel;g.strokeStyle=J.C.bone;g.lineWidth=1.5;g.fillRect(B.x,B.y+B.h*.25,B.w,B.h*.5);g.strokeRect(B.x,B.y+B.h*.25,B.w,B.h*.5)}
      else{g.fillStyle=J.C.panel;g.strokeStyle=J.C.bone;g.lineWidth=2;g.beginPath();g.ellipse(W/2,B.y+B.h/2,B.w/2*.8,B.h/2,0,0,6.3);g.fill();g.stroke();g.lineWidth=1;for(let r=1;r<4;r++){g.beginPath();g.ellipse(W/2,B.y+B.h/2,B.w/2*.8*(1-r*.22),B.h/2*(1-r*.22),0,0,6.3);g.stroke()}
        g.beginPath();g.moveTo(W/2,B.y);g.quadraticCurveTo(W/2+6,B.y-14,W/2+2,B.y-22);g.stroke()}
      g.fillStyle=it2.dark?"#888":it2.you?J.C.rust:J.C.bone;g.font=(it2.lab.length>12?14:20)+"px "+TY;g.textAlign="center";g.fillText(it2.lab,W/2,B.y+B.h/2+6);g.restore()}
    g.strokeStyle=J.C.rust;g.lineWidth=2;cuts.forEach(c=>{if(it2.dark&&!waiting)return;g.beginPath();g.moveTo(c.a.x,c.a.y);g.lineTo(c.b.x,c.b.y);g.stroke()});
    if(stroke){g.strokeStyle=J.C.bone;g.setLineDash([5,5]);g.beginPath();g.moveTo(stroke.a.x,stroke.a.y);g.lineTo(stroke.b.x,stroke.b.y);g.stroke();g.setLineDash([])}
    g.strokeStyle=J.C.bone;g.lineWidth=2;g.beginPath();g.moveTo(W*.8,H*.06);g.lineTo(W*.97,H*.02);g.stroke();
  });
  start();
});

/* ---------- h-bath: the tooth fairy's ledger, swipe to sort ---------- */
J.scene("h-bath",()=>{
  const st=J.$("#stage");
  const sh=sheet(st,"THE BATHROOM","it is in the "+R[it].n.toLowerCase(),"The bathroom. The tooth fairy keeps her books in here. It's the light.");
  para(sh,"On the closed lid: a ledger. Leather. Warm in the way leather shouldn't be. It's the tooth fairy's, open to your page, and your page is long. Swipe each entry right to approve it, left to contest it. Contests are honored. She's a professional.");
  const L=[
    ["BEFORE YOU WERE BORN","one tooth, reserved","paid 25 cents, in advance","note: deposit on the full set","Approved. The deposit is non-refundable. So is the set.","Contested. Fair. You weren't there to agree to it. She crosses it out. Underneath, in older ink, it says the same thing, and she leaves that alone too."],
    ["AGE 6","front tooth, top left","paid one dollar","note: kept the dollar too","Approved. You don't remember getting a dollar. That's because of the note.","Contested. She refunds you one dollar. It's damp. It's the same dollar. It's been waiting."],["AGE 7","back molar","paid in one dream about a long hallway","note: hallway still in use","Approved. That's this hallway, by the way. You're paying it off by walking it.","Contested. She gives the dream back. You'll have it tonight. Sorry. It's a long one."],
    ["AGE 9","the tooth you swallowed","paid nothing","note: collected later, from the inside","Approved. You'd rather not know how she collected it. Good. That stays closed.","Contested. She admits it was a weird call. She writes weird call next to it in red. It's the only red ink on the whole page."],["AGE 14","a tooth you lied about to get out of school","paid in one lie, back","note: you'll hear it someday","Approved. The lie she paid you with was: nothing is in the next room.","Contested. She takes the lie back. So now something is definitely in the next room. It always was. Now you know it on purpose."],
    ["TONIGHT","{teeth} teeth counted, {teeth1} on file","difference: one","note: the extra one is ours","Approved. You now officially have a tooth that belongs to a group.","Contested. She recounts. {teeth1}. She recounts again. {teeth1}. She shows you her pencil. The pencil is a tooth."],
    ["PREVIOUS OWNER","balance carried from whoever had your mouth before you","amount: illegible","note: it was Jeff","Approved. It was Jeff. It's always Jeff. You got it used. Low mileage.","Contested. She looks up the previous owner. She looks at you. She closes the ledger a little, just a little, like a door you're not supposed to hear."]
  ];
  const BOT=["right","left","right","left","right","left","right"];
  const wrapL=el("div","hled");sh.appendChild(wrapL);
  const alt=el("div","hrow");const bl=btn(alt,"contest",null,"alt"),br=btn(alt,"approve",null,"alt");sh.appendChild(alt);
  const cap=txt("p","hcap","");sh.appendChild(cap);
  let i=0,ok=0,no=0,card=null,busy=false;
  const mk=()=>{
    const e=L[i];card=el("div","hcard");card.appendChild(txt("div","when",e[0]+"   entry "+(i+1)+" of "+L.length));card.appendChild(txt("div","",F(e[1])));card.appendChild(txt("div","amt",F(e[2])));card.appendChild(txt("div","amt",F(e[3])));
    const stp=txt("div","stp","");card.appendChild(stp);card.dataset.act="swipe:"+BOT[i];wrapL.appendChild(card);
    let x0=0,dx=0,dn=false;
    card.addEventListener("pointerdown",ev=>{if(busy)return;dn=true;x0=ev.clientX;dx=0;try{card.setPointerCapture(ev.pointerId)}catch(z){}});
    card.addEventListener("pointermove",ev=>{if(!dn)return;dx=ev.clientX-x0;card.style.transform="translateX("+dx+"px) rotate("+(dx/30)+"deg)";stp.style.opacity=Math.min(1,Math.abs(dx)/80);stp.textContent=dx>0?"PAID":"CONTESTED"});
    const up=()=>{if(!dn)return;dn=false;if(dx>70)decide(true);else if(dx<-70)decide(false);else{card.style.transform="";stp.style.opacity=0}};
    card.addEventListener("pointerup",up);card.addEventListener("pointercancel",up);
  };
  const decide=yes=>{if(busy||!card)return;busy=true;const e=L[i],c=card;delete c.dataset.act;c.className="hcard fly";c.style.transform="translateX("+(yes?140:-140)+"%) rotate("+(yes?12:-12)+"deg)";c.style.opacity="0";
    if(yes){ok++;A.blip(660,.12,"sine",.08)}else{no++;A.clank(.3)}cap.textContent=F(yes?e[4]:e[5]);
    J.after(380,()=>{c.remove();i++;busy=false;if(i<L.length)mk();else end()})};
  bl.addEventListener("click",()=>decide(false));br.addEventListener("click",()=>decide(true));
  const end=()=>{card=null;alt.remove();wrapL.remove();
    J.after(1800,()=>{para(sh,"Balance: "+ok+" approved, "+no+" contested. She honors every no. She just writes it down very, very neatly, so neatly you could live in the handwriting.");
      para(sh,"The last line on the page is already filled in: payment due tonight, under the pillow, bedroom at the end of the hall. You haven't been to the bedroom yet. The bedroom has been to you. Twice.");
      const b=btn(sh,"close the ledger","tap");b.addEventListener("click",()=>{b.disabled=true;J.unitDone("h-bath")})})};
  mk();
});

/* ---------- h-elevator: too many basements ---------- */
J.scene("h-elevator",()=>{
  const st=J.$("#stage");
  const sh=sheet(st,"THE LIFT","it is on the floor above you","There's an elevator in the hall. Houses don't have elevators. This one has carpet.");
  para(sh,"Brass doors the size of a closet. Two floors up, one ground floor, and then basements. A lot of basements. The doors only ever open a gap about as wide as a phone.");
  const FL=["2","1","G"];for(let i=1;i<=40;i++)FL.push("B"+i);
  const D={"2":"Floor 2. The attic, finished and carpeted, full of people on folding chairs facing the gap. One of them waves with a hand that isn't really attached to anything.","1":"Floor 1. Your hallway. You're standing in it, slightly to the left. You haven't noticed you yet. Don't make it weird.","G":"Ground. Dirt. Actual dirt. Someone has drawn a floor plan in it with a stick, and put a dot where you are, and another dot one room over.",
    B1:"B1. Laundry. Every sock you ever lost, each one paired with a sock you haven't lost yet.",B2:"B2. A second ground floor, slightly lower. Everyone on it is two inches shorter and very defensive about it.",B3:"B3. A waiting room. The ticket screen says NOW SERVING: JEFF. It hasn't changed in forty years. Nobody minds.",
    B4:"B4. Your childhood bedroom, except every poster is the same man, smiling, with slightly too many teeth.",B5:"B5. A gift shop. Every mug says WORLD'S OKAYEST JEFF. They're sold out of the other mugs. There were no other mugs.",B6:"B6. A dentist's waiting room with no dentist. Just the chair. Just the lamp. Just a sign that says SELF SERVE.",
    B7:"B7. The group's server room. It's one man in a closet whispering post, every few seconds, forever. He's doing great.",B8:"B8. A drained pool. At the bottom, someone has spelled HI with teeth. It took a lot of teeth. It's a very sincere hi.",B9:"B9. A gym. One treadmill, running. Nobody on it. The display says 11 YEARS 4 MINUTES and climbing.",
    B10:"B10. A wedding. Both of them are Jeff. Everybody is crying, including the building.",B11:"B11. Lost and found, for voices. Yours is on a shelf in a mason jar, humming something it picked up in the nursery.",B12:"B12. An office. Forty desks, forty Jeffs. One looks up through the gap and mouths: I'm on a call.",
    B13:"B13. Officially doesn't exist. Unofficially, a break room. Every lunch in the fridge is labeled JEFF except one, which has your actual name on it, and it's still warm.",B14:"B14. A bowling alley. The pins are back. They're always back. They set themselves up and look at you.",B15:"B15. A sleepover. Thirty sleeping bags, all occupied, all facing the gap. Someone whispers he's here and thirty people fake-snore.",
    B16:"B16. A church for the group. The pews face the wrong way. They face the elevator. They face you.",B17:"B17. A field at night where it's raining upward. The water is going home. It looks relieved.",B18:"B18. Your porch, from underneath. Through the boards you can see the soles of your own shoes from earlier tonight.",
    B19:"B19. A scale model of the house, very detailed, with a tiny elevator, and a tiny you, looking through a tiny gap at a tinier model.",B20:"B20. Halfway. A vending machine. Every slot is one tooth with a little card saying whose. Slot C4 says yours. It's sold out.",B21:"B21. Karaoke. Someone is singing your voicemail greeting. Honestly well. The crowd knows the words.",
    B22:"B22. A classroom. On the board: JEFF = JEFF. Under it, in a kid's handwriting: prove it. Under that: the proof is the entire basement.",B23:"B23. Silence. Not quiet. Silence that has been installed, like carpet. You can see the tack strips.",B24:"B24. A barbershop. Every chair has a Jeff, every barber is a Jeff, and they're all getting the same haircut, which is yours.",
    B25:"B25. Another kitchen. Somebody down here is stirring a pot with a very long spoon. They wave the spoon at you. Hi.",B26:"B26. A crowd holding their phones up, filming the gap. You're trending somewhere very far down.",B27:"B27. A nursery with a hundred cribs and a hundred light switches, and every single light is off.",
    B28:"B28. A hallway with a red dot painted on the floor. YOU ARE HERE. You aren't. Somebody's standing on it to save it for you.",B29:"B29. Baggage claim. Every bag is breathing in the same rhythm. As rhythms go, it's a nice one.",B30:"B30. A town hall meeting about you. Item one: is he coming down. Item two: when. There's no item three. There's a vote.",
    B31:"B31. An empty ballroom playing your old ringtone on a loop. The chandeliers are made of baby teeth. They tinkle.",B32:"B32. A man in a lawn chair holding a sign: ONE ROOM AWAY. He moves the chair one foot every time you blink.",B33:"B33. The museum of things you said out loud while you were alone. There's a long line for one exhibit. It's the one from the shower.",
    B34:"B34. A daycare. The kids are all forty-year-old men named Jeff, playing very gently with blocks that spell your street.",B35:"B35. The back of every mirror in the house. Mostly scaffolding, and a guy on a stool doing your expressions half a second late.",B36:"B36. An airport gate. Flight 4 to the bedroom, now boarding. Group Jeff may board at any time. You are Group Jeff.",
    B37:"B37. Nothing. Then a cough. Then, politely: sorry, go on.",B38:"B38. A party for the last person who rode down this far. The banner says CONGRATULATIONS. Nobody remembers on what.",B39:"B39. Your bedroom upside down. Someone is lying on the ceiling in your spot, wide awake, waiting for you to lie down so they can.",
    B40:"B40. The bottom. A front door. Your front door, from the inside. The dial reads your numbers. The mat says WELCOME UP."};
  const fl=txt("div","hfloor","1");sh.appendChild(fl);
  const gap=txt("div","hgap shut","");sh.appendChild(gap);
  const panel=el("div","hpanel");sh.appendChild(panel);
  const cap=txt("p","hcap","Press a floor. Any floor. The lift has been waiting for someone with opinions.");sh.appendChild(cap);
  const SUG=["B1","B13","B20","B33","B40"];let at=1,rides=0,busy=false,been={},b41=null,out=false;
  const bs={};FL.forEach((f,i)=>{const b=txt("button","",f);b.setAttribute("aria-label","floor "+f);panel.appendChild(b);bs[f]=b;b.addEventListener("click",()=>ride(f))});
  const setAct=()=>{Object.values(bs).forEach(b=>delete b.dataset.act);if(out)return;if(b41){b41.dataset.act="tap";return}const s=SUG.find(f=>!been[f]);if(s)bs[s].dataset.act="tap"};
  const ride=f=>{
    if(busy||out)return;const to=f==="B41"?FL.length:FL.indexOf(f);if(to===at&&f!=="B41")return;busy=true;panel.querySelectorAll("button").forEach(x=>x.disabled=true);bs[f]&&bs[f].classList.add("lit");gap.classList.add("shut");A.blip(1200,.05,"sine",.06);J.start();
    const dist=Math.abs(to-at),stepMs=Math.max(45,Math.min(140,3200/dist));let k=0;const dir=to>at?1:-1;
    const tick=J.every(stepMs,()=>{k++;at+=dir;fl.textContent=at<FL.length?FL[at]:"B41";A.blip(140,.04,"triangle",.05);
      if(k>=dist){clearInterval(tick);J.after(500,()=>{A.blip(880,.3,"sine",.1);A.blip(1100,.3,"sine",.08,null,.18);gap.classList.remove("shut");
        if(f==="B41")return last();been[f]=1;rides++;if(bs[f]){bs[f].classList.remove("lit");bs[f].classList.add("been")}gap.textContent=F(D[f]);
        if(rides===2)cap.textContent="The lift hums the floors as it passes them. It knows all of them by heart. It skips a note on B13.";
        if(rides===3)cap.textContent="You've noticed the button for floor 1 is worn smooth and all the basement buttons are brand new. Nobody goes up. Everybody goes down.";
        if(rides>=5&&!b41){b41=txt("button","","B41");b41.setAttribute("aria-label","floor B41");panel.appendChild(b41);b41.addEventListener("click",()=>ride("B41"));cap.textContent="A new button. B41. It wasn't there a second ago. It's lit from inside like it's embarrassed.";J.cut("B41",80)}
        busy=false;panel.querySelectorAll("button").forEach(x=>x.disabled=false);setAct()})}});
  };
  const last=()=>{out=true;setAct();if(b41)delete b41.dataset.act;J.cut("UP",100);A.crunch();
    gap.textContent=F("B41. There is no B41. The doors open all the way for the first time. It's your hallway, upstairs, exactly where you left it. On the floor plan by the coat hook, the other dot is standing exactly one floor above you. In a house, that's just the next room. It waves, the way a dot waves.");
    J.after(2200,()=>{const b=btn(sh,"get out","tap");b.addEventListener("click",()=>{b.disabled=true;J.unitDone("h-elevator")})})};
  setAct();J.after(400,()=>gap.classList.remove("shut"));gap.textContent="Floor 1. Your hallway. The gap shows you the coat hook. Your coat is still on it. You're still wearing it.";
});

/* ---------- h-garage: a lost-pet flyer for yourself ---------- */
J.scene("h-garage",()=>{
  const st=J.$("#stage");
  const sh=sheet(st,"THE GARAGE","it is in the "+R[it].n.toLowerCase(),"The garage. The car is gone. The flyers are not.");
  para(sh,"A workbench, a staple gun, and a printer that runs on nothing. On a clipboard, a form: LOST PET. It's already filled in at the top. Species: you. Fill in the rest. It prints as you go.");
  const cv=el("canvas","hcv hposter");sh.appendChild(cv);const P=fit(cv,1.3),g=P.g;
  const W=Math.round(P.w*.72),H=Math.round(W*1.58);{const dpr=Math.min(2,window.devicePixelRatio||1);cv.style.width=W+"px";cv.style.height=H+"px";cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr,0,0,dpr,0,0)}
  const val={name:"",seen:null,desc:null,temp:null,rew:null,found:null};
  const fc=document.createElement("canvas");fc.width=fc.height=240;
  const fd=(k,label,opts)=>{const f=el("div","hfield");f.appendChild(txt("label","",label));const ch=el("div","hchips");f.appendChild(ch);
    opts.forEach((o,i)=>{const b=txt("button","",F(o));ch.appendChild(b);if(i===0)b.dataset.act="tap";b.dataset.pri=String(10-Object.keys(val).indexOf(k));
      b.addEventListener("click",()=>{val[k]=F(o);[...ch.children].forEach(x=>{x.classList.remove("on");delete x.dataset.act});b.classList.add("on");A.click();draw();check()})});sh.appendChild(f)};
  const nf=el("div","hfield");nf.appendChild(txt("label","","Name it answers to"));const inp=el("input","hin");inp.type="text";inp.maxLength=20;inp.placeholder="what do they call you";inp.setAttribute("autocomplete","off");inp.dataset.act="type:"+(nm()||"Jeff");inp.dataset.pri="20";nf.appendChild(inp);
  inp.addEventListener("input",()=>{val.name=inp.value.trim().slice(0,20);if(val.name)delete inp.dataset.act;draw();check()});sh.appendChild(nf);
  fd("seen","Last seen",["in the hallway at {t}","inside a {model}","one room away, always"]);
  fd("desc","Description",["medium build, {teeth} teeth, maybe {teeth1}","looks like Jeff from far away and also from close up","wears its own face a little loose"]);
  fd("temp","Temperament",["skittish, but reads everything","friendly to anyone named Jeff","comes when the group calls"]);
  fd("rew","Reward",["{teeth1} teeth","one tooth from the back. you know the one","the house"]);
  fd("found","If found",["do not approach. it will approach you","bring it to the bedroom, last door on the left","do not feed after {t4}"]);
  const cap=txt("p","hcap","");sh.appendChild(cap);
  const pr=btn(sh,"print it",null);pr.disabled=true;
  const check=()=>{const ok=val.name&&val.seen&&val.desc&&val.temp&&val.rew&&val.found;pr.disabled=!ok;if(ok&&!pr._done)pr.dataset.act="tap";};
  const draw=()=>{
    g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);g.strokeStyle=J.C.bone;g.lineWidth=2;g.strokeRect(6,6,W-12,H-12);
    g.fillStyle=J.C.rust;g.font="bold "+Math.round(W*.16)+"px "+TY;g.textAlign="center";g.fillText("LOST",W/2,W*.18);
    J.face(fc,S.face,.12,{bg:faceBg(),open:.08});const fs=W*.36;g.drawImage(fc,W/2-fs/2,W*.21,fs,fs);
    g.fillStyle=J.C.bone;g.font=Math.round(W*.09)+"px "+TY;g.fillText("JEFF",W/2,W*.21+fs+W*.09);
    g.font=Math.round(W*.05)+"px "+TY;g.fillText(val.name?"(answers to "+val.name+")":"(answers to ______)",W/2,W*.21+fs+W*.15);
    g.textAlign="left";g.font=Math.round(W*.049)+"px "+SER;let y=W*.21+fs+W*.23;
    [["Last seen",val.seen],["Looks like",val.desc],["Temper",val.temp],["If found",val.found]].forEach(r=>{y=wrap(g,r[0]+": "+(r[1]||"..."),W*.07,y,W*.86,W*.06)+W*.01});
    g.fillStyle=J.C.rust;g.font="bold "+Math.round(W*.05)+"px "+TY;g.textAlign="center";wrap(g,"REWARD: "+(val.rew||"..."),W/2,H-W*.24,W*.86,W*.055);
    g.strokeStyle=J.C.dim;g.setLineDash([4,4]);g.beginPath();g.moveTo(8,H-W*.15);g.lineTo(W-8,H-W*.15);g.stroke();g.setLineDash([]);
    for(let i=0;i<7;i++){const x=W*(.04+i*.135);g.save();g.translate(x+W*.08,H-W*.025);g.rotate(-Math.PI/2);g.fillStyle=J.C.bone;g.font=Math.round(W*.031)+"px "+TY;g.textAlign="left";g.fillText("555-JEFF",0,0);g.restore();if(i){g.beginPath();g.moveTo(x,H-W*.15);g.lineTo(x,H-8);g.stroke()}}
  };
  draw();
  pr.addEventListener("click",()=>{pr._done=1;pr.disabled=true;delete pr.dataset.act;A.crunch();let n=0,stopped=false;
    cap.textContent="The printer starts. 1. 2. 3. It's fast for a printer that runs on nothing.";
    const stop=btn(sh,"stop printing","tap","alt");
    const tk=J.every(90,()=>{n++;A.blip(300+Math.random()*80,.03,"square",.03);pr.textContent="printed "+n;if(n>=80&&!stopped)halt(false)});
    const halt=asked=>{if(stopped)return;stopped=true;clearInterval(tk);stop.remove();
      cap.textContent=asked?"It stops the moment you ask. Good printer. It listens. "+n+" copies, still warm, in a neat stack.":"It stops at 80 on its own. It had a number in mind. The stack is warm and very neat.";
      J.after(2200,()=>{para(sh,"You go to staple one to the garage wall and there's no room. The wall is already covered in this flyer. Same face. Same reward. Dated going back years. Some are yellow. One says LAST SEEN: HERE. One says FOUND, and then FOUND is crossed out. One has a phone number written on it in pen, and it's the number of the phone in your pocket.");
        J.after(1400,()=>{para(sh,"Someone has already found you. They're in the next room. They haven't called. They're deciding what to say first.");
          const b=btn(sh,"leave the flyers","tap");b.addEventListener("click",()=>{b.disabled=true;S.memo.flyerName=val.name;J.unitDone("h-garage")})})})};
    stop.addEventListener("click",()=>halt(true));
  });
});

/* ---------- h-study: sign the yearbook ---------- */
J.scene("h-study",()=>{
  const st=J.$("#stage");
  const yr=new Date().getFullYear()-41;
  const sh=sheet(st,"THE STUDY","it is in the "+R[it].n.toLowerCase(),"The study. Wall-to-wall shelves and every book is the same yearbook.");
  para(sh,"Class of "+yr+", the year the house was built. The spine says JEFFERSON HIGH, which is a reach. You open one. Every photo is Jeff. Every superlative is Jeff. Every page is signed, and every signature is to you.");
  const yb=el("div","hyb");sh.appendChild(yb);
  const SUP=["Most Likely To Be Jeff","Best Hair (Shared)","Class Clown (Inside The Walls)","Most Teeth","Most Likely To Be One Room Away","Quietest (Do Not Wake)"];
  SUP.forEach((s,i)=>{const f=el("figure");const c=J.avatar(S.face+i*7,120,.08+i*.07);J.face(c,S.face+i*7,.08+i*.07,{bg:faceBg(),open:.1});f.appendChild(c);f.appendChild(txt("figcaption","","Jeff: "+s));yb.appendChild(f)});
  const sigs=el("div");sh.appendChild(sigs);
  [(nm()||"you")+"!! never change. we'll change you. love, J","stay cool and stay in the house. Jeff C.","remember the nursery?? you will. jeff"].forEach(s=>sigs.appendChild(txt("div","hsig",s)));
  const cap=txt("p","hcap","Sign it. Your real signature. Use your finger, in the box.");sh.appendChild(cap);
  const cv=el("canvas","hcv");sh.appendChild(cv);const P=fit(cv,.5),g=P.g,W=P.w,H=P.h;
  const PR=["Sign it. Your real signature. Use your finger, in the box.","Once more. The way it signs you."];
  const back=["The book reads your signature out loud in a voice like a gym teacher at the bottom of a well: JEFF. It doesn't look like Jeff. It says Jeff anyway. It's the book's call.",
    "You didn't sign that one. The ink went where it wanted. It spelled your Jeff number backwards, "+String(S.no).split("").reverse().join("")+", and then drew a little house with two dots in it."];
  let ink=0,stage=0,busy=false,last=null,paths=[];
  const clear=()=>{g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);g.strokeStyle=J.C.dim;g.lineWidth=1;g.beginPath();g.moveTo(W*.06,H*.78);g.lineTo(W*.94,H*.78);g.stroke();g.fillStyle=J.C.dim;g.font="12px "+TY;g.textAlign="left";g.fillText("x",W*.06,H*.74)};
  clear();
  const setAct=()=>{if(busy||stage>1){delete cv.dataset.act;return}cv.dataset.at="0.2,0.55";cv.dataset.act="drag:"+(W*.55).toFixed(0)+",-"+(H*.25).toFixed(0)+",900"};
  cv.addEventListener("pointerdown",e=>{if(busy||stage>1)return;last=pos(cv,e);try{cv.setPointerCapture(e.pointerId)}catch(x){}});
  cv.addEventListener("pointermove",e=>{if(!last)return;const p=pos(cv,e);g.strokeStyle=J.C.bone;g.lineWidth=2.5;g.lineCap="round";g.beginPath();g.moveTo(last[0],last[1]);g.lineTo(p[0],p[1]);g.stroke();ink+=Math.hypot(p[0]-last[0],p[1]-last[1]);last=p});
  const up=()=>{if(!last)return;last=null;if(ink<110){cap.textContent=ink>0?"Bigger. It's a yearbook. Nobody signs a yearbook small.":cap.textContent;return}
    busy=true;setAct();ink=0;J.after(700,()=>{A.thump();cap.textContent=back[stage];if(stage===0)J.say("Jeff",{pitch:.2,rate:.6});stage++;
      J.after(2600,()=>{busy=false;clear();if(stage<2){cap.textContent=PR[stage];setAct()}else signs()})})};
  cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  const signs=()=>{cap.textContent="Then the book signs you back. The pen moves by itself. You watch your own yearbook write in you.";
    const line=F("To "+(nm()||"Jeff #{no}")+": have a great summer. It's always summer down here. See you at the end of the hall, last door on the left. Until then, stay exactly one room away from me. It's the rule. You're good at rules. Jeff Conner, class of every year.");
    const out=txt("div","hsig","");sh.insertBefore(out,cv.nextSibling);let i=0;
    const tk=J.every(32,()=>{if(i<line.length){out.textContent+=line.charAt(i++);if(i%3===0)A.click()}else{clearInterval(tk);
      J.after(1200,()=>{const b=btn(sh,"shelve it","tap");b.addEventListener("click",()=>{b.disabled=true;J.unitDone("h-study")})})}})};
  setAct();
});

/* ---------- h-bedroom: the ending ---------- */
J.scene("h-bedroom",()=>{
  const st=J.$("#stage");here="bedroom";
  const sh=sheet(st,"THE BEDROOM",J.clock(),"The bedroom. Last door on the left. The light is on and your side of the bed is turned down.");
  const cv=el("canvas","hcv");sh.appendChild(cv);const P=fit(cv,.8),g=P.g,W=P.w,H=P.h;
  const cap=txt("p","hcap","It's your bed. It has the dent in it from how you sleep. There's a lump under the pillow, small, about the size of the payment the ledger was talking about. You didn't put it there. It's paid.");sh.appendChild(cap);
  const row=el("div");sh.appendChild(row);
  let me={x:.5,y:.9},meT={x:.5,y:.9},o={x:-.08,y:.5},oT={x:-.08,y:.5},dark=0,darkT=0;
  J.raf((t,dt)=>{me.x+=(meT.x-me.x)*Math.min(1,dt*2);me.y+=(meT.y-me.y)*Math.min(1,dt*2);o.x+=(oT.x-o.x)*Math.min(1,dt*1.2);o.y+=(oT.y-o.y)*Math.min(1,dt*1.2);dark+=(darkT-dark)*Math.min(1,dt*1.5);
    g.fillStyle=J.C.panel;g.fillRect(0,0,W,H);g.strokeStyle=J.C.bone;g.lineWidth=3;g.strokeRect(W*.08,H*.06,W*.84,H*.88);
    g.strokeStyle=J.C.panel;g.lineWidth=5;g.beginPath();g.moveTo(W*.08,H*.42);g.lineTo(W*.08,H*.58);g.stroke();
    g.strokeStyle=J.C.dim;g.lineWidth=1;g.beginPath();g.arc(W*.08,H*.42,H*.16,0,Math.PI/2);g.stroke();
    g.fillStyle=J.C.bg;g.strokeStyle=J.C.bone;g.lineWidth=2;g.fillRect(W*.52,H*.16,W*.32,H*.58);g.strokeRect(W*.52,H*.16,W*.32,H*.58);
    g.fillStyle=J.C.panel;g.fillRect(W*.56,H*.19,W*.24,H*.1);g.strokeRect(W*.56,H*.19,W*.24,H*.1);
    g.strokeStyle=J.C.dim;g.beginPath();g.moveTo(W*.52,H*.36);g.lineTo(W*.84,H*.36);g.stroke();
    g.fillStyle=J.C.bone;g.font="12px "+TY;g.textAlign="left";g.fillText("Bedroom",W*.1,H*.11);g.fillStyle=J.C.dim;g.fillText("hall",W*.0+2,H*.66);
    const dot=(p,fill)=>{g.beginPath();g.arc(p.x*W,p.y*H,8,0,6.3);if(fill){g.fillStyle=J.C.rust;g.fill()}else{g.fillStyle=J.C.panel;g.fill();g.strokeStyle=J.C.bone;g.lineWidth=2;g.stroke()}};
    dot(o,false);dot(me,true);
    if(dark>.01){g.fillStyle="rgba(0,0,0,"+(dark*.9).toFixed(2)+")";g.fillRect(0,0,W,H)}
  });
  const ask=(lines,opts)=>{row.innerHTML="";opts.forEach(x=>{const b=btn(row,x[0],x[2]?"tap":null,x[3]);b.addEventListener("click",()=>{row.innerHTML="";A.thump();x[1]()})})};
  const step1=()=>{meT={x:.68,y:.5};cap.textContent="You get in. On the plan, by the door, the other dot stops. It's been one room away all night. The hall. The next room over. The far side of a wall. It has never once been in the same room as you.";
    oT={x:.03,y:.5};J.after(3800,()=>{para(sh,"It knocks. Not on the door. On the frame, very softly. The way you'd knock if you were asking, and you'd understand if the answer was no.");
      ask(0,[["let it in",()=>{choice.door="in";oT={x:.22,y:.2};cap.textContent="It comes in. It doesn't come to the bed. It goes to the corner and stands there and says, in your voice, from your height: thanks. it's cold one room away. Then it's quiet, the good kind.";J.after(4200,step2)}],
        ["keep it out",()=>{choice.door="out";oT={x:-.06,y:.5};cap.textContent="It stops. It respects that. It stays in the hall, one room away, where it has always been, and says through the door: ok. goodnight. i'll be right here. i'm always right here. And it is.";J.after(4200,step2)},1,"alt"]])})};
  const step2=()=>{sh.querySelectorAll(".hp").forEach(p=>p.remove());para(sh,"The lamp is on. The switch is by your hand.");
    ask(0,[["turn off the light",()=>{choice.light="off";darkT=1;A.static(.03);cap.textContent="Lights out. In the dark the house finally does what houses do. You hear every room you went to tonight change, one at a time, nursery first. A drawer. A click. The lift, going down by itself. Then nothing, all the way down.";J.after(5200,deed)},1],
      ["leave it on",()=>{choice.light="on";cap.textContent="You leave it on. Fine. It stays on all night. You see everything, and nothing moves. Everything in the house holds very, very still, out of respect, and also smiling.";J.after(5200,deed)},0,"alt"]])};
  const deed=()=>{A.static(0);J.cut("HOME",130);J.save();sh.innerHTML="";const k=el("div","hk");k.appendChild(txt("span","","YOUR DEED"));k.appendChild(txt("span","","keep this"));sh.appendChild(k);
    sh.appendChild(txt("h2","hh","The house is in your name now. Your name is Jeff."));
    const dc=el("canvas","hcv");dc.width=680;dc.height=980;dc.style.width="100%";dc.style.height="auto";sh.appendChild(dc);const g2=dc.getContext("2d");
    g2.fillStyle=J.C.panel;g2.fillRect(0,0,680,980);g2.strokeStyle=J.C.rust;g2.lineWidth=3;g2.strokeRect(14,14,652,952);g2.strokeStyle=J.C.bone;g2.lineWidth=1;g2.strokeRect(24,24,632,932);
    g2.fillStyle=J.C.bone;g2.textAlign="center";g2.font="46px "+TY;g2.fillText("DEED TO THE HOUSE",340,84);
    const f=document.createElement("canvas");f.width=f.height=220;J.face(f,S.face,.85,{bg:faceBg(),open:.4});g2.drawImage(f,52,112,200,200);
    g2.textAlign="left";g2.font="34px "+TY;g2.fillText("JEFF #"+S.no,276,160);g2.font="20px "+TY;g2.fillStyle=J.C.rust;g2.fillText("owner. occupant. also occupant.",276,194);
    g2.fillStyle=J.C.bone;g2.font="18px "+SER;let y=232;y=wrap(g2,"Visit "+S.visits+", on this "+J.D.model+".",276,y,360,24);
    const secs=Math.round((Date.now()-(S.t0||Date.now()))/1000);y=wrap(g2,"Time in the house: "+Math.floor(secs/60)+" min "+(secs%60)+" s.",276,y+4,360,24);
    const done={};S.run.forEach(u=>{if(UR[u])done[UR[u]]=1});done.bedroom=0;
    const inR=choice.door==="in";
    drawPlan(g2,60,340,560,400,{done:done,me:ctr("bedroom"),it:inR?{x:R.bedroom.x+.06,y:R.bedroom.y+.06}:{x:.5,y:.16},dr:9});
    g2.fillStyle=J.C.bone;g2.font="19px "+SER;y=780;
    const did=S.run.filter(u=>UR[u]).map(u=>J.DID[u]);
    y=wrap(g2,"Rooms: "+(did.length?did.join("; "):"none, somehow")+".",52,y,576,25)+6;
    y=wrap(g2,"Second occupant: "+(inR?"in the corner of the bedroom, by invitation.":choice.door==="out"?"in the hall, by your choice, honored.":"one room away.")+" Lights: "+(choice.light==="on"?"left on.":"off."),52,y,576,25);
    g2.fillStyle=J.C.dim;g2.font="17px "+TY;g2.textAlign="center";g2.fillText("fable6shot.faetempla.com   NOT RATED",340,948);
    const lab=txt("p","hp","Leave a note on the pillow for whoever you send here.");sh.appendChild(lab);
    const inp=el("input","hin");inp.type="text";inp.maxLength=110;inp.placeholder="they find it at bedtime";sh.appendChild(inp);
    para(sh,"It rides inside the link and gets read out to them. Nothing is uploaded anywhere.","i");
    const msg=txt("p","hcap","");
    const text="I walked through Jeff's house. Every room. I'm Jeff #"+S.no+" now. Your turn.";
    const copy=u=>{try{navigator.clipboard.writeText(u).then(()=>{msg.textContent="Copied. It's on your clipboard, folded like a note."},()=>{msg.textContent=u})}catch(e){msg.textContent=u}};
    const sb=btn(sh,"send this to someone",null);sb.addEventListener("click",()=>{const u=J.inviteURL(inp.value.trim());if(navigator.share)navigator.share({title:"Jeff added you to a group",text:text,url:u}).catch(()=>{});else copy(u)});
    const cb=btn(sh,"copy the link",null,"alt");cb.addEventListener("click",()=>copy(J.inviteURL(inp.value.trim())));
    msg.style.minHeight="0";sh.appendChild(msg);
    para(sh,"Goodnight, Jeff #{no}. The house will leave the hall light on. Something will stand under it, anyway.");
    const ag=btn(sh,"go again","end","alt");ag.addEventListener("click",()=>{location.href=J.carry()});
    J.say("goodnight",{pitch:.2,rate:.55});window.scrollTo(0,0);
  };
  ask(0,[["get in",step1,1]]);
});
})();
