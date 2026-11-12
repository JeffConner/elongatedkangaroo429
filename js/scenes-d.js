/* scenes d: the mirror, the confession, the other user */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;
function bar(st,left,right){const b=el("div","bar");b.appendChild(txt("span","",left));b.appendChild(txt("span","",right||""));st.appendChild(b);return b}

/* ---------- the mirror ---------- */
J.scene("mirror",st=>{
  bar(st,J.v("JEFF WANTS TO SHOW YOU SOMETHING","JEFF KEPT SOMETHING OF YOURS"),"");
  const c=el("div","center");c.style.minHeight="70vh";st.appendChild(c);
  c.appendChild(txt("p","big",J.v("Jeff wants to use your camera.","Jeff wants your camera again. He left something in it.")));
  const sm=txt("p","sm","This asks your phone for real. The picture never leaves this phone and nothing is saved. If you say no, you get a drawing instead.");sm.style.marginTop="14px";c.appendChild(sm);
  const yes=txt("button","btn","allow camera"),no=txt("button","btn ghost","no");c.appendChild(yes);c.appendChild(no);
  let stream=null,started=false;
  J.onClean(()=>{if(stream)try{stream.getTracks().forEach(t=>t.stop())}catch(e){}});
  const run=vid=>{
    if(started)return;started=true;c.innerHTML="";c.style.justifyContent="flex-start";c.style.minHeight="0";
    const cap=txt("div","cap",vid?J.v("There you are.","There you both are."):J.v("Fine. This is the one he drew. Move your finger around on it.","No camera. Fine. He redrew you from memory. He was generous with the teeth."));c.appendChild(cap);
    const cv=document.createElement("canvas");cv.className="wide";c.appendChild(cv);
    const dpr=Math.min(2,window.devicePixelRatio||1),W=Math.min(512,window.innerWidth-28),H=Math.round(Math.min(window.innerHeight*0.54,W*1.3));
    cv.style.width=W+"px";cv.style.height=H+"px";cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);
    const BW=132,BH=Math.round(BW*H/W),N=48,buf=[];for(let i=0;i<N;i++){const b=document.createElement("canvas");b.width=BW;b.height=BH;buf.push(b)}
    const fc=document.createElement("canvas");fc.width=fc.height=300;
    let wi=0,T=0,acc=1,frozen=null,px=0.5,py=0.5,stage=0,btn=false;
    const mv=e=>{const r=cv.getBoundingClientRect();px=(e.clientX-r.left)/r.width;py=(e.clientY-r.top)/r.height};
    cv.addEventListener("pointermove",mv);cv.addEventListener("pointerdown",mv);
    const beats=[[6,J.v("Wave at it. It's a little behind. That's just the distance.","It's ahead of you this time. Watch. It'll blink before you do.")],[14,J.v("It's getting further behind. Or you're getting ahead. One of you is leaving.","It stopped copying. It's doing its own thing. Small things. Watch the mouth.")],[22,J.v("It stopped following you. Hold still. See if it moves.","It's holding still on purpose. It's daring you.")],[26,J.v("It moved.","You moved. It didn't. It's the real one now.")],[31,J.v("That one stays in there. You can go. You're the one that goes.","Now there are two in there. Last visit's and tonight's. They're talking.")]];
    J.raf((t,dt)=>{
      T+=dt;acc+=dt;
      const delay=T<6?0:T<14?Math.round((T-6)/8*10):T<22?Math.round(10+(T-14)/8*32):42;
      if(acc>1/15&&T<22.5){
        acc=0;const bg=buf[wi%N].getContext("2d");
        if(vid&&vid.readyState>=2&&vid.videoWidth){const vw=vid.videoWidth,vh=vid.videoHeight,s=Math.max(BW/vw,BH/vh),dw=vw*s,dh=vh*s;bg.save();bg.translate(BW,0);bg.scale(-1,1);bg.drawImage(vid,(BW-dw)/2,(BH-dh)/2,dw,dh);bg.restore()}
        else{J.face(fc,S.face,0.25,{lx:(px-0.5)*2,ly:(py-0.5)*2,open:0.08,bg:"#1b1712"});bg.fillStyle="#1b1712";bg.fillRect(0,0,BW,BH);const sz=Math.max(BW,BH)*0.95;bg.drawImage(fc,(BW-sz)/2+(px-0.5)*14,(BH-sz)/2+(py-0.5)*14,sz,sz)}
        wi++;
      }
      let show=buf[(((wi-1-delay)%N)+N)%N];if(wi-1-delay<0)show=buf[0];
      if(T>=22){if(!frozen){frozen=document.createElement("canvas");frozen.width=BW;frozen.height=BH;frozen.getContext("2d").drawImage(show,0,0)}show=frozen}
      g.drawImage(show,0,0,W,H);g.fillStyle="rgba(11,9,7,"+(0.22+Math.min(0.25,T/120)).toFixed(2)+")";g.fillRect(0,0,W,H);
      if(T>26){
        const fg=fc.getContext("2d");fg.clearRect(0,0,300,300);J.face(fc,S.face,1,{bg:"rgba(0,0,0,0)",open:Math.min(1,(T-26)/6),ly:0.3});
        const sz=Math.min(W,H)*(0.9+Math.min(0.3,(T-26)/30));g.globalAlpha=Math.min(0.92,(T-26)/4);g.drawImage(fc,W/2-sz/2,H*0.46-sz/2,sz,sz);g.globalAlpha=1;
      }
      for(let i=0;i<70;i++){g.fillStyle="rgba(217,207,184,"+(Math.random()*0.12).toFixed(2)+")";g.fillRect(Math.random()*W,Math.random()*H,Math.random()*22+2,1)}
      while(stage<beats.length&&T>=beats[stage][0]){cap.textContent=beats[stage][1];A.thump();if(stage===3){J.cut("STAY",100);J.say("stay here",{pitch:0.1,rate:0.5})}stage++}
      if(T>34&&!btn){btn=true;const b=txt("button","btn",J.v("leave it in there","leave them in there"));b.style.width="100%";c.appendChild(b);b.addEventListener("click",()=>J.finish("mirror"))}
    });
  };
  yes.addEventListener("click",()=>{
    yes.disabled=no.disabled=true;
    const md=navigator.mediaDevices;
    if(!md||!md.getUserMedia)return run(null);
    md.getUserMedia({video:{facingMode:"user",width:{ideal:320}},audio:false}).then(s=>{
      stream=s;const v=document.createElement("video");v.muted=true;v.playsInline=true;v.setAttribute("playsinline","");v.srcObject=s;
      const p=v.play();if(p&&p.catch)p.catch(()=>{});run(v);
    },()=>{S.defy++;run(null)});
    J.after(9000,()=>run(null));
  });
  no.addEventListener("click",()=>{S.defy++;run(null)});
});

/* ---------- the confession ---------- */
const CONF=[
  "i have been in the group since before i joined. i let him in. i would let him in again. he is in now.",
  "there are more teeth in my mouth than i tell people. at night i count them and the number is different and i say nothing.",
  "i heard my own voice in the other room and i did not go check because i know which one of us is the real one.",
  "i am not typing this. i am watching my thumbs type this. hello to whoever has the thumbs now.",
  "sometimes i stand in my own doorway in the dark for an hour. i think i am waiting for me to get home.",
  "it is {t} in {city} and i am fine. i am fine. the one holding the {dev} is fine. the one behind him is not my business."
];
J.scene("confess",st=>{
  bar(st,"NEW POST","posting as: you");
  const c=el("div","center");c.style.justifyContent="flex-start";st.appendChild(c);
  c.appendChild(txt("p","big",J.v("Tell the group you're fine.","Tell the group it didn't happen.")));
  const pr=txt("p","sm",J.v("Type: i am fine","Type: nothing happened"));pr.style.marginTop="8px";c.appendChild(pr);
  const ta=el("textarea","confbox");ta.setAttribute("autocomplete","off");ta.setAttribute("autocapitalize","off");ta.setAttribute("autocorrect","off");ta.spellcheck=false;ta.setAttribute("aria-label","your post");c.appendChild(ta);
  const note=txt("p","mid","");note.style.cssText="margin-top:12px;min-height:3em";c.appendChild(note);
  const words=J.fill(J.pick(J.half(CONF))).split(" ");let n=0,done=false,lastKey=Date.now(),self=false;
  const adv=()=>{
    if(done)return;n=Math.min(words.length,n+1);ta.value=words.slice(0,n).join(" ");A.click();
    if(n===3)note.textContent=J.v("That's not what you pressed.","Wrong keys. Right words.");else if(n===8)note.textContent=J.v("Backspace adds. Try it.","Delete it. Go ahead. It deletes you instead.");else if(n===Math.floor(words.length*0.7))note.textContent=J.v("Keep going. It's almost out.","Almost. Get it all up.");
    if(n>=words.length)post();
  };
  ta.addEventListener("input",()=>{lastKey=Date.now();adv()});
  J.every(900,()=>{if(done)return;if(Date.now()-lastKey>7000){if(!self){self=true;note.textContent=J.v("Fine. He'll type it.","Too slow. He has your thumbs anyway.")}adv()}});
  const post=()=>{
    done=true;ta.readOnly=true;try{ta.blur()}catch(e){}J.cut("POSTED",100);A.crunch();
    note.textContent=J.v("Posted. You pressed post. Nobody saw you press post.","Posted. From your account. From your hands. From behind you.");
    J.after(1200,()=>J.say(ta.value,{pitch:0.3,rate:0.75}));
    J.after(3600,()=>{const r=txt("p","sm",J.mem.toLocaleString("en-US")+J.v(" Jeffs know now. 1 Jeff knew already. He's the one who typed it."," Jeffs read it. They're reading it out loud. Open a window. You can hear."));r.style.marginTop="6px";c.appendChild(r)});
    J.after(7000,()=>{const b=txt("button","btn","ok");c.appendChild(b);b.addEventListener("click",()=>J.finish("confess"))});
  };
});

/* ---------- the other user ---------- */
const SEARCHES=[
  ["how to leave a group",["how to leave a group you are","how to leave a group that is in the house","how to leave (you can't)"]],
  ["is it normal to have {teeth1} teeth",["is it normal to have {teeth1} teeth and counting","is it normal to hear the group","is it normal (no)"]],
  ["who is jeff",["who is jeff (you)","who is jeff really (you)","who is behind jeff (turn around)"]],
  ["why is my {dev} warm",["why is my {dev} warm when it's off","why is my {dev} breathing","why is my {dev} (it's his)"]]
];
const NOTES=["if you're reading this i got out.\n\ni'm kidding.\n\nlook at the finger.","things to bring:\n- his teeth\n- his face (he's wearing it)\n- him","he thinks he's watching me use it.\n\ni'm watching him watch.\n\nhi."];
J.scene("ghost",st=>{
  bar(st,"SECURITY ALERT","live");
  const cap=txt("div","cap",J.v("Don't touch anything. Someone else is using your phone.","He's on your phone again. He knows the passcode. It's your tooth count."));cap.style.minHeight="3em";st.appendChild(cap);
  const gp=el("div","gp"),scr=el("div","scr"),finger=el("div","finger");gp.appendChild(scr);gp.appendChild(finger);st.appendChild(gp);
  let paused=false,over=false;
  const gate=async()=>{while(paused)await J.wait(200)};
  const to=async(x,y)=>{await gate();finger.style.left=x+"px";finger.style.top=y+"px";await J.wait(860)};
  const toEl=e=>{const r=e.getBoundingClientRect(),q=gp.getBoundingClientRect();return to(r.left-q.left+Math.min(r.width/2,130),r.top-q.top+r.height/2)};
  const tap=async()=>{await gate();finger.classList.add("tap");A.pop();await J.wait(180);finger.classList.remove("tap");await J.wait(260)};
  const type=async(node,text,ms)=>{for(const ch of text){await gate();node.textContent+=ch;A.click();await J.wait(ms||70)}};
  gp.addEventListener("pointerdown",e=>{
    if(paused||over)return;paused=true;S.defy++;const q=gp.getBoundingClientRect();const keep=cap.textContent;
    finger.style.left=(e.clientX-q.left)+"px";finger.style.top=(e.clientY-q.top)+"px";cap.textContent=J.v("Don't. He's using it. Now he's touching where you touched.","You touched his hand. Through the glass. He's delighted.");A.thump();
    J.after(2300,()=>{cap.textContent=keep;paused=false});
  });
  const home=()=>{scr.innerHTML="";const a=el("div","apps");["Search","Photos","Notes","Group","Mirror","You"].forEach(n=>{const d=el("div");d.appendChild(el("i"));d.appendChild(document.createTextNode(n));d._n=n;a.appendChild(d)});scr.appendChild(a);return a};
  const app=(a,n)=>[].find.call(a.children,d=>d._n===n);
  (async()=>{
    let a=home();await J.wait(1400);await toEl(app(a,"Search"));await tap();
    const q=J.pick(J.half(SEARCHES));scr.innerHTML="";const sb=el("div","sb");scr.appendChild(sb);await toEl(sb);await tap();await type(sb,J.fill(q[0]),85);
    const sgs=[];for(const s of q[1]){await J.wait(650);const d=txt("div","sg",J.fill(s));scr.appendChild(d);sgs.push(d);A.click()}
    await J.wait(900);await toEl(sgs[2]);await tap();
    scr.innerHTML="";scr.appendChild(txt("div","k","1 RESULT"));const res=el("div");res.style.cssText="display:flex;gap:12px;align-items:center;margin-top:14px";const av=J.avatar(S.face,120,0.6);av.style.cssText="width:60px;height:60px;border-radius:50%";res.appendChild(av);
    res.appendChild(txt("div","",J.fill(J.v("You. {city}. {teeth} teeth on file. Last seen: now. Being seen: now.","You. {model}. {scr}. Holding it wrong. Being watched from the other side of it."))));scr.appendChild(res);cap.textContent=J.v("He's looking you up.","He's reading your results. He's correcting them.");await J.wait(3400);
    a=home();await J.wait(700);await toEl(app(a,"Photos"));await tap();
    scr.innerHTML="";scr.appendChild(txt("div","k",J.fill(J.v("RECENTS. TAKEN TONIGHT, {t}. YOU DIDN'T TAKE THESE.","RECENTS. TAKEN FROM INSIDE THE {model}. FACING OUT."))));const ph=el("div","ph");scr.appendChild(ph);cap.textContent=J.v("He's going through your photos.","He's adding photos.");
    for(let k=0;k<9;k++){
      await gate();const cv=document.createElement("canvas");cv.width=cv.height=120;const g=cv.getContext("2d");
      if(k===8)J.face(cv,S.face,1,{open:0.8});
      else{g.fillStyle="#262019";g.fillRect(0,0,120,120);g.fillStyle="#191410";g.fillRect(0,78,120,42);g.fillStyle="#3a2f22";g.fillRect(8,14,30,40);const s=0.16+k*0.13,b=84+k*5;g.fillStyle="#040303";g.beginPath();g.arc(60,b-70*s,13*s,0,6.3);g.fill();g.fillRect(60-14*s,b-58*s,28*s,60*s);
        if(k>4){g.fillStyle=J.C.ink;g.beginPath();g.arc(60-4.5*s,b-72*s,1.3*s,0,6.3);g.arc(60+4.5*s,b-72*s,1.3*s,0,6.3);g.fill()}}
      ph.appendChild(cv);A.click();await J.wait(520);
    }
    await J.wait(1800);a=home();await J.wait(700);await toEl(app(a,"Notes"));await tap();
    scr.innerHTML="";scr.appendChild(txt("div","k","NEW NOTE"));const nt=el("div","note");scr.appendChild(nt);cap.textContent=J.v("He's leaving you a note.","He's replying to the note you didn't write.");await type(nt,NOTES[S.sedBase<0?J.ri(0,2):S.sed],80);
    await J.wait(1500);over=true;const q2=gp.getBoundingClientRect();finger.style.left=q2.width/2+"px";finger.style.top=q2.height/2+"px";await J.wait(900);
    finger.style.transition="left .7s,top .7s,transform 1.6s";finger.style.transform="scale(3.2)";cap.textContent=J.v("It knows you're watching.","It's pointing at you.");J.say("hi",{pitch:0.1,rate:0.5});J.cut("HI",90);await J.wait(3200);
    scr.innerHTML="";const fcv=J.avatar(S.face,300,1);fcv.style.cssText="width:70%;height:auto;margin:14% auto 0;opacity:.3";scr.appendChild(fcv);finger.style.transform="";finger.style.top="115%";
    cap.textContent=J.v("He's done. He left it warm.","He's done. He logged out. Of you.");await J.wait(1600);
    const b=txt("button","btn",J.v("take your phone back","take the phone"));b.style.width="100%";st.appendChild(b);
    b.addEventListener("click",()=>{b.disabled=true;cap.textContent=J.v("It was never out of your hand.","It's lighter now. He took something.");A.thump();J.after(2400,()=>J.finish("ghost"))});
  })();
});
})();
