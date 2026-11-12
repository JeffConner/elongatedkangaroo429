/* scenes c: the quiz, the terms, the captcha, the hold, the party */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;
function bar(st,left,right){const b=el("div","bar");b.appendChild(txt("span","",left));b.appendChild(txt("span","",right||""));st.appendChild(b);return b}

/* ---------- the hold ---------- */
J.scene("hold",st=>{
  const c=el("div","center");st.appendChild(c);
  c.appendChild(txt("div","k","GROUP ACTIVITY"));
  const cap=txt("p","big",J.v("Everyone hold still. Press and don't let go.","Group activity again. He asked for you by thumb."));cap.style.minHeight="4.2em";cap.style.marginTop="10px";c.appendChild(cap);
  const wrap=el("div","holdwrap");const cv=document.createElement("canvas");cv.width=cv.height=360;wrap.appendChild(cv);const b=txt("button","holdbtn","hold");wrap.appendChild(b);c.appendChild(wrap);
  const tm=txt("p","sm","0.0 s");tm.style.marginTop="14px";c.appendChild(tm);
  let holding=false,t0=0,restarts=0,done=false,stage=-1,beatAt=0;
  const beats=[[0,J.v("Don't let go.","Same as before. Thumb down.")],[4,J.v("Good.","He remembered your thumb.")],[8,J.v("Stay.","Stay. He's counting your pulse.")],[11,J.v("Something is under your thumb.","He's under it again. Warmer than last time.")],[15,J.v("It's pressing back.","It has a pulse too. Slower than yours.")],[19,J.v("It's holding on now. That isn't you holding.","It's matching yours now. Hear that? One heartbeat.")],[24,J.v("You can let go.","You can let go. See if he does.")],[27,J.v("You're still holding. So is he. This is nice.","Neither of you let go. That's called holding hands.")]];
  const finish=line=>{if(done)return;done=true;holding=false;b.classList.remove("on");b.disabled=true;cap.textContent=line;J.after(2600,()=>J.finish("hold"))};
  const down=e=>{e.preventDefault();if(done||holding)return;A.init();holding=true;t0=Date.now();stage=-1;b.classList.add("on");b.textContent="";try{b.setPointerCapture(e.pointerId)}catch(x){}};
  const up=()=>{
    if(!holding||done)return;holding=false;b.classList.remove("on");const s=(Date.now()-t0)/1000;cv.style.opacity="0";
    if(s>=24)return finish(J.v("He let go second. He always lets go second.","He didn't let go. That's still him. Check your thumb."));
    restarts++;S.defy++;A.clank(0.4);b.textContent="hold";
    if(restarts>=3)return finish(J.v("Fine. He'll hold you instead.","Fine. He'll find another part of you to hold."));
    cap.textContent="You let go after "+s.toFixed(1)+" seconds. He noticed. Again.";
  };
  b.addEventListener("pointerdown",down);b.addEventListener("pointerup",up);b.addEventListener("pointercancel",up);b.addEventListener("contextmenu",e=>e.preventDefault());
  J.raf(()=>{
    if(!holding||done)return;const s=(Date.now()-t0)/1000;tm.textContent=s.toFixed(1)+" s";
    let k=-1;beats.forEach((x,i)=>{if(s>=x[0])k=i});
    if(k!==stage){stage=k;cap.textContent=beats[k][1];if(k===2)J.toast(J.v("Jeff is typing on your leg.","Jeff is counting on your spine."));if(k===3){cv.style.opacity="1"}if(k===5)J.say("stay",{pitch:0.1,rate:0.5})}
    if(s>=11)J.face(cv,S.face,0.9,{open:Math.min(1,(s-11)/13),ly:1});
    const gap=Math.max(0.42,1-s*0.022);if(s-beatAt>gap){beatAt=s;A.beat()}
    if(s>=31)finish(J.v("He let go second. He always lets go second.","He didn't let go. That's still him. Check your thumb."));
  });
});

/* ---------- the party ---------- */
J.scene("event",st=>{
  bar(st,"EVENT","tonight, "+J.clock(4));
  const c=el("div","center");c.style.minHeight="70vh";st.appendChild(c);
  const card=()=>{
    c.appendChild(txt("p","big",J.v("Jeff's birthday (all of us)","Jeff's funeral (all of us) (open bar)")));
    const p=txt("p","mid",J.fill(J.v("Tonight, {t4}. Location: under {city}. Specifically under you.","Tonight, {t4}. Location: inside the walls of {city}. Start with yours.")));p.style.marginTop="10px";c.appendChild(p);
    const o=el("div","opts");c.appendChild(o);
    [J.v("going","coming"),J.v("going","coming"),J.v("GOING","COMING")].forEach(t=>{const b=txt("button","",t);o.appendChild(b);b.addEventListener("click",()=>{A.thump();bring()})});
    const sm=txt("p","sm",J.mem.toLocaleString("en-US")+J.v(" going. 0 not going. 1 pretending he has a choice."," mourning. 0 dry eyes. 1 guest of honor (you, lying down)."));sm.style.marginTop="12px";c.appendChild(sm);
  };
  const bring=()=>{
    c.innerHTML="";c.appendChild(txt("p","big",J.v("What are you bringing?","What are you wearing?")));
    const o=el("div","opts");c.appendChild(o);
    const opts=(S.inv.length?[S.inv[S.inv.length-1]]:[J.v("myself","my own face")]).concat([J.v("my teeth","someone else's face"),J.v("a guest (the one behind you)","whatever they laid out")]);
    opts.forEach(t=>{const b=txt("button","",t);o.appendChild(b);b.addEventListener("click",()=>{A.click();c.innerHTML="";c.appendChild(txt("p","big",J.v("Perfect. It was on the list already. So were you.","Good. The box is your size. We measured while you slept.")));J.after(2200,floor)})});
  };
  const floor=()=>{
    c.innerHTML="";c.style.justifyContent="flex-start";
    const cap=txt("div","cap",J.v("You're the light one. Tap to move. Mingle.","You're the pale one. Tap to move. Pay your respects."));c.appendChild(cap);
    const cv=document.createElement("canvas");cv.className="wide";c.appendChild(cv);
    const dpr=Math.min(2,window.devicePixelRatio||1),W=Math.min(512,window.innerWidth-28),H=Math.round(Math.min(window.innerHeight*0.52,W*1.25));
    cv.style.width=W+"px";cv.style.height=H+"px";cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);
    const me={x:W/2,y:H/2,tx:W/2,ty:H/2},gs=[];
    for(let i=0;i<38;i++){const side=i%4;gs.push({x:side===0?-10:side===1?W+10:J.rnd()*W,y:side===2?-10:side===3?H+10:J.rnd()*H,w:J.rnd()*6.3})}
    cv.addEventListener("pointerdown",e=>{const r=cv.getBoundingClientRect();me.tx=e.clientX-r.left;me.ty=e.clientY-r.top;A.click()});
    J.say("happy birthday to us. happy birthday to us. happy birthday dear Jeff.",{pitch:0.3,rate:0.55});
    let T=0,caught=false;
    J.raf((t,dt)=>{
      if(caught)return;T+=dt;
      me.x+=(me.tx-me.x)*Math.min(1,dt*3);me.y+=(me.ty-me.y)*Math.min(1,dt*3);
      g.fillStyle="#0f0c09";g.fillRect(0,0,W,H);g.strokeStyle="#2c251c";g.lineWidth=2;g.strokeRect(6,6,W-12,H-12);
      g.fillStyle="#2c251c";g.fillRect(W/2-34,H/2-16,68,32);
      const sp=7+T*2.1;let near=1e9;
      gs.forEach(q=>{const dx=me.x-q.x,dy=me.y-q.y,d=Math.sqrt(dx*dx+dy*dy)||1;near=Math.min(near,d);
        q.x+=(dx/d*sp+Math.cos(q.w+T*2)*9)*dt;q.y+=(dy/d*sp+Math.sin(q.w+T*2)*9)*dt;
        g.fillStyle=J.C.rust;g.beginPath();g.arc(q.x,q.y,6,0,6.3);g.fill()});
      g.fillStyle=J.C.ink;g.beginPath();g.arc(me.x,me.y,7,0,6.3);g.fill();
      if(T>6&&T<7)cap.textContent=J.v("They want to say hi.","They want to view the body.");if(T>12&&T<13)cap.textContent=J.v("All of them want to say hi.","The body is whichever one stops moving.");if(T>18&&T<19)cap.textContent=J.v("Hold still. It's almost candles.","Hold still. That's it. Perfect. Stay like that.");
      if(near<12||T>30){caught=true;J.cut(J.v("BLOW","REST"),120);A.crunch();c.innerHTML="";c.style.justifyContent="center";
        const p=txt("p","big",J.v("Make a wish.","Any last words."));c.appendChild(p);
        J.after(2400,()=>{p.textContent=J.v("No. A different one.","No. Different ones.")});
        J.after(5000,()=>{const b=txt("button","btn",J.v("stay for cake","stay for the lowering"));c.appendChild(b);b.addEventListener("click",()=>{b.disabled=true;p.textContent=J.v("The cake is also Jeff.","It's a double plot. He's saving your side.");A.thump();J.after(2400,()=>J.finish("event"))})});
      }
    });
  };
  card();
});
})();
