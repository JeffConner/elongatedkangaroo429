/* frames: each visit lives in its own container (feed, phone, broadcast, house). This file holds the registry,
   the per-visit plan, routing between frames, identity carried across visits, and boot. */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A;
const qs=new URLSearchParams(location.search);
J.FR={};J.unitF={};J.DID=J.DID||{};
/* def: {hub:"scene", end:"scene", units:[scene names], label:"short name used in other frames' copy"} */
J.frame=(name,def)=>{def.name=name;J.FR[name]=def;(def.units||[]).forEach(u=>{J.unitF[u]=name})};
J.frame("feed",{hub:"hub",end:"final",units:J.POOL.slice(),label:"the group feed"});

/* ---------- identity: asked once, on visit 1, never again ---------- */
if(S.visits>1){
  const p=S.prev||{};
  S.no=p.no||J.ri(1300,98000);S.face=p.face||J.ri(1,99999);S.raw=p.raw||"";S.teeth=(p.teeth||32)+J.ri(1,3);S.inv=[];
}
S.memo=Object.assign({},(S.prev&&S.prev.mem)||{});           /* small facts frames leave for later visits */
J.lastRun=(S.prev&&S.prev.lastRun)||[];                       /* unit names done on the previous visit */
J.lastDid=()=>J.lastRun.map(u=>J.DID[u]).filter(Boolean);     /* "what they did last time", as he-phrases */
J.you=p=>p.replace(/\bhimself\b/g,"yourself").replace(/\bhis\b/g,"your").replace(/\bhim\b/g,"you").replace(/\bhe\b/g,"you");
J.lastDidYou=()=>J.lastDid().map(J.you);                     /* the same, addressed to the visitor */

/* ---------- plan ---------- */
const V1N=+(qs.get("run")||0)||8;
const buildPlan=()=>{
  const v=S.visits,fx=f=>J.FR[f]?J.FR[f].units.map(u=>({f:f,u:u})):[];
  let order=S.order&&S.order.length===J.POOL.length?S.order:J.shuffle(J.POOL);
  if(v===1)return order.slice(0,V1N).map(u=>({f:"feed",u:u}));
  if(v===2)return fx("phone");
  if(v===3)return fx("tv");
  if(v===4)return fx("house");
  if(v===5)return J.shuffle(J.POOL).slice(0,4).map(u=>({f:"feed",u:u}));
  /* remix: chapters from three or four frames, two units each, frames shuffled, units shuffled */
  const fr=J.shuffle(["feed","phone","tv","house"].filter(f=>J.FR[f]&&J.FR[f].units.length)).slice(0,J.ri(3,4));
  const out=[];fr.forEach(f=>{J.shuffle(J.FR[f].units).slice(0,2).forEach(u=>out.push({f:f,u:u}))});return out;
};

/* ---------- routing ---------- */
J.undone=()=>S.plan.filter(x=>S.run.indexOf(x.u)<0);
J.allDone=()=>!J.undone().length;
/* undone units of frame f in the current chapter (the leading block of undone plan items) */
J.left=f=>{const out=[];for(const x of J.undone()){if(x.f!==f)break;out.push(x.u)}return out};
J.curF=null;
J.setFrame=f=>{
  document.body.classList.forEach(c=>{if(c.indexOf("fr-")===0)document.body.classList.remove(c)});
  document.body.classList.add("fr-"+f);J.curF=f;if(S.frames.indexOf(f)<0)S.frames.push(f);
  J.toastHook=null;J.TOASTHEAD=null;J.quiet=false;
  const d=J.FR[f];if(d&&d.onEnter)try{d.onEnter()}catch(e){}
};
S.frames=[];
/* a unit calls this when it is over; its frame's hub decides what is next */
J.unitDone=u=>{
  if(S.run.indexOf(u)<0)S.run.push(u);if(S.seen.indexOf(u)<0)S.seen.push(u);S.done++;S.last=u;J.save();A.level(S.done);
  J.go(J.FR[J.curF].hub,{back:u});
};
/* a hub calls this when J.left(itsFrame) is empty: hand off to the next frame, or to this frame's ending */
J.next=()=>{
  const und=J.undone();
  if(!und.length){if(!J.curF)J.setFrame(S.plan[S.plan.length-1].f);return J.go(J.FR[J.curF].end)}
  const prev=J.curF,f=und[0].f;
  if(f!==prev)J.setFrame(f);
  J.go(J.FR[f].hub,{enter:f!==prev,from:prev,first:!prev});
};
/* first gesture of any visit: sound on, clock starts */
J.start=()=>{
  A.init();if(S.t0)return;J.say(" ",{vol:0});S.t0=Date.now();A.thump();S.callAt=J.ri(1,3);S.msgAt=J.ri(1,2);
};

J.boot=()=>{
  S.plan=buildPlan();
  if(!qs.get("run"))J.RUN=S.plan.filter(x=>x.f==="feed").length||J.RUN;
  if(J.mix)S.called=true;
  /* ?jump=scene opens one scene directly (screenshots and bots only) */
  const jump=qs.get("jump");
  if(jump&&(J.unitF[jump]||Object.keys(J.FR).some(f=>J.FR[f].hub===jump||J.FR[f].end===jump))){
    let f=J.unitF[jump];if(!f)Object.keys(J.FR).forEach(k=>{if(J.FR[k].hub===jump||J.FR[k].end===jump)f=k});
    J.setFrame(f);S.t0=Date.now();
    if(J.unitF[jump]&&!S.plan.some(x=>x.u===jump))S.plan.unshift({f:f,u:jump});
    if(qs.get("t0"))S.t0=Date.now()-(+qs.get("t0"))*1000;
    return J.go(jump,{enter:true,first:true,jump:true});
  }
  if(S.visits===1||J.mock||J.mix)return J.go("gate");
  /* visits 2-4 open straight into their own frame; the frame's hub plays its own opening on {first:true} */
  const f=S.plan[0].f;J.setFrame(f);J.go(J.FR[f].hub,{enter:true,first:true});
};
})();
