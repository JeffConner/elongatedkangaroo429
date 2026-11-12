/* scenes b: the mouth, the message, the marketplace, the stream, the memory */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const hash=(i,r,s)=>{const v=Math.sin(i*12.9898+r*78.233+s*37.719)*43758.5453;return v-Math.floor(v)};
function fit(cv,hFrac){const dpr=Math.min(2,window.devicePixelRatio||1),w=Math.min(512,window.innerWidth-28),h=Math.round(Math.min(window.innerHeight*hFrac,w*1.5));
  cv.style.width=w+"px";cv.style.height=h+"px";cv.width=w*dpr;cv.height=h*dpr;const g=cv.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);return{g:g,w:w,h:h}}
function pos(cv,e){const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
function bar(st,left,right){const b=el("div","bar");b.appendChild(txt("span","",left));b.appendChild(txt("span","",right||""));st.appendChild(b);return b}

/* ---------- the mouth ---------- */
const ROWS=[{n:10,w:.058,h:.07,d:0,t:-1,cr:.05,sp:1.1},{n:12,w:.07,h:.1,d:.13,t:.18,cr:.12,sp:1.12},{n:16,w:.072,h:.115,d:.28,t:.42,cr:.3,sp:1.08},{n:22,w:.066,h:.125,d:.45,t:.68,cr:.65,sp:1.02}];
J.scene("mouth",st=>{
  bar(st,"JEFF'S PHOTO","1 of 1");
  const cv=document.createElement("canvas");cv.className="wide";st.appendChild(cv);const F=fit(cv,0.56),g=F.g,W=F.w,H=F.h;
  const cap=txt("div","cap",J.v("It's asleep. Hold the button to open it.","It's pretending to sleep. Hold the button. Call its bluff."));st.appendChild(cap);
  const hold=txt("button","btn",J.v("hold to open wider","hold to pry it open"));hold.style.width="100%";hold.style.touchAction="none";hold.style.userSelect="none";hold.style.webkitUserSelect="none";st.appendChild(hold);
  let open=0,holding=false,phase=0,pulls=0,fall=0,px=W/2,py=H/2,loose=null,variant=J.pick(["eye","mouth","finger"]),lastN=20;
  const dn=e=>{e.preventDefault();holding=true;A.init()},up=()=>{holding=false};
  hold.addEventListener("pointerdown",dn);hold.addEventListener("pointerup",up);hold.addEventListener("pointercancel",up);hold.addEventListener("pointerleave",up);
  hold.addEventListener("contextmenu",e=>e.preventDefault());
  cv.addEventListener("pointermove",e=>{const p=pos(cv,e);px=p[0];py=p[1]});
  cv.addEventListener("pointerdown",e=>{
    const p=pos(cv,e);px=p[0];py=p[1];
    if(phase===1&&loose){pulls++;A.crunch();cap.textContent=[J.v("It moved.","It flinched."),J.v("It's coming.","It's letting you."),J.v("Rock it. Side to side.","Twist. Like a jar."),J.v("Almost. It's holding on with something.","Almost. Something underneath is pushing."),J.v("There.","Out.")][Math.min(4,pulls-1)];
      if(pulls>=5){phase=2;fall=0;S.teeth++;J.cut("YOURS",90);
        J.after(1500,()=>{phase=3;A.thump();
          cap.textContent=variant==="eye"?J.v("Oh. It was plugging something. It's looking at your finger.","There's an eye in the socket. It remembers your finger."):variant==="mouth"?J.v("There's a smaller one behind it. It wants to say hi.","The little mouth is back. It learned a second word."):J.v("Something is feeling around for the tooth. Don't let it find your hand.","The fingers are longer this time. They're feeling for the phone.");
          if(variant==="mouth")J.after(900,()=>J.say("hi",{pitch:1.6,rate:0.8}));
          J.after(4200,()=>{cap.textContent=J.v("That one was yours. You have ","Yours again. You have ")+S.teeth+" now. We have you down for "+(S.teeth+1)+".";hold.textContent="close it";hold.style.display="";phase=4});
        })}}
  });
  hold.addEventListener("click",()=>{if(phase===4){phase=5;cap.textContent=J.v("It doesn't close.","It closes. On something. Not yours. Yet.");hold.disabled=true;A.thump();J.after(2200,()=>J.finish("mouth"))}});
  const caps=[[0,J.v("It's asleep. Hold the button to open it.","It's pretending to sleep. Hold the button. Call its bluff.")],[.1,J.v("These are the first ones. Everyone starts with twenty.","Front row. The ones it shows people.")],[.26,J.v("The next ones are already in there. Above the first ones. Waiting.","Second row. It grew these in case.")],[.48,J.v("You had these too. Stacked in your face the whole time.","Third row. It took these from the last visitor. Recognize any?")],[.72,J.v("These ones are not in the books.","These are still warm.")],[.9,J.v("They are not all yours.","Some of these are yours. From last time.")]];
  let lastCap=0;
  J.raf((t,dt)=>{
    if(phase===0){open=clamp(open+(holding?0.105:-0.03)*dt,0,1);
      let ci=0;caps.forEach((c,i)=>{if(open>=c[0])ci=i});if(ci!==lastCap){lastCap=ci;cap.textContent=caps[ci][1];A.thump()}
      if(open>=0.985){phase=1;hold.style.display="none";holding=false;cap.textContent=J.v("One of the front ones is loose. Go on. Take it.","The same one is loose again. It grew back for you. Take it.")}}
    const cx=W/2,cy=H*0.5,gap=open*H*0.3,BW=Math.min(W,520);
    g.clearRect(0,0,W,H);g.fillStyle="#0b0907";g.fillRect(0,0,W,H);
    const gr=g.createRadialGradient(cx,cy,2,cx,cy,Math.max(30,gap*1.6));gr.addColorStop(0,"rgba(58,15,12,"+(0.85*open).toFixed(2)+")");gr.addColorStop(1,"rgba(11,9,7,0)");g.fillStyle=gr;g.fillRect(0,0,W,H);
    let total=0;
    for(let ri=ROWS.length-1;ri>=0;ri--){
      const R=ROWS[ri],a=ri===0?1:clamp((open-R.t)/0.16,0,1);if(a<=0)continue;total+=2*R.n*a;
      const w=R.w*BW,h=R.h*BW,half=(R.n-1)/2*w*R.sp;
      for(let s=-1;s<=1;s+=2)for(let i=0;i<R.n;i++){
        const h1=hash(i,ri,s),h2=hash(i+40,ri,s),h3=hash(i+80,ri,s);
        let dx=(i-(R.n-1)/2)*w*R.sp+(h1-.5)*w*R.cr*1.6;const bow=BW*0.045*(1-Math.pow(dx/(half||1),2));
        let y=cy+bow+s*(gap/2+ROWS[0].h*BW+R.d*BW+(h2-.5)*h*R.cr),rot=(h3-.5)*R.cr*1.3,x=cx+dx;
        const tw=ri>=2?(Math.random()-.5)*BW*0.0035*ri*open:0;x+=tw;y+=tw;
        const isLoose=ri===0&&s===-1&&i===4;
        if(isLoose){loose=[x,y];if(phase===1){rot+=Math.sin(t*(9+pulls*4))*0.07*(1+pulls);x+=Math.sin(t*13)*pulls*0.8}
          if(phase===2){fall+=dt;y+=fall*fall*900;rot+=fall*5}if(phase>=3)continue}
        g.save();g.translate(x,y);g.rotate(rot);const dir=-s,tw2=w*(.85+h3*.3),th=h*(.85+h2*.3);
        g.globalAlpha=a*0.5;g.strokeStyle=isLoose&&phase===1?J.C.rust:J.C.ink;g.lineWidth=1;
        g.beginPath();g.moveTo(-tw2*.38,0);g.quadraticCurveTo(-tw2*.2,-dir*th*1.5,-tw2*.02,-dir*th*.5);g.quadraticCurveTo(tw2*.2,-dir*th*1.4,tw2*.38,0);g.stroke();
        g.globalAlpha=a*(ri?0.85:1);g.fillStyle=isLoose&&phase===1?"rgba(200,85,58,.3)":"rgba(217,207,184,.16)";g.lineWidth=1.4;
        g.beginPath();const rx=-tw2/2,ry=dir>0?0:-th,rr=tw2*.34;g.moveTo(rx+rr,ry);g.lineTo(rx+tw2-rr,ry);g.quadraticCurveTo(rx+tw2,ry,rx+tw2,ry+rr);g.lineTo(rx+tw2,ry+th-rr);g.quadraticCurveTo(rx+tw2,ry+th,rx+tw2-rr,ry+th);g.lineTo(rx+rr,ry+th);g.quadraticCurveTo(rx,ry+th,rx,ry+th-rr);g.lineTo(rx,ry+rr);g.quadraticCurveTo(rx,ry,rx+rr,ry);g.closePath();g.fill();g.stroke();
        g.restore();
      }
    }
    if(phase>=3&&loose){
      const x=loose[0],y=loose[1]+ROWS[0].h*BW*0.5,r=BW*0.05,k=clamp((t%1000),0,1);g.globalAlpha=1;
      if(variant==="eye"){g.fillStyle=J.C.ink;g.beginPath();g.ellipse(x,y,r*1.2,r*0.85,0,0,6.3);g.fill();const ang=Math.atan2(py-y,px-x);g.fillStyle="#3a0f0c";g.beginPath();g.arc(x+Math.cos(ang)*r*0.45,y+Math.sin(ang)*r*0.3,r*0.48,0,6.3);g.fill();g.fillStyle="#050403";g.beginPath();g.arc(x+Math.cos(ang)*r*0.5,y+Math.sin(ang)*r*0.34,r*0.22,0,6.3);g.fill()}
      else if(variant==="mouth"){const o=(Math.sin(t*5)+1)*0.5;g.fillStyle="#3a0f0c";g.beginPath();g.ellipse(x,y,r*1.1,r*(0.25+o*0.5),0,0,6.3);g.fill();g.strokeStyle=J.C.ink;g.stroke();g.fillStyle=J.C.ink;for(let i=0;i<7;i++){g.fillRect(x-r*0.9+i*r*0.27,y-r*(0.2+o*0.4),r*0.18,r*0.22)}}
      else{const reach=(Math.sin(t*1.3)+1)*0.5;g.strokeStyle=J.C.ink;g.fillStyle="rgba(217,207,184,.25)";g.lineWidth=1.5;for(let i=0;i<3;i++){const fx=x+(i-1)*r*0.7,len=r*(1.2+reach*2.2+i*0.3);g.beginPath();g.moveTo(fx-r*0.25,y-r);g.lineTo(fx-r*0.25,y+len);g.quadraticCurveTo(fx,y+len+r*0.4,fx+r*0.25,y+len);g.lineTo(fx+r*0.25,y-r);g.fill();g.stroke()}}
    }
    const n=Math.round(total)+(phase>=2?-1:0);if(n!==lastN&&phase===0){A.click();lastN=n}
    g.globalAlpha=1;g.fillStyle="#776d5c";g.font="12px 'Special Elite',monospace";g.textAlign="right";g.fillText(open>0.95?"stop counting":n+" teeth, so far",W-10,H-10);g.textAlign="left";
  });
});

/* ---------- the message ---------- */
const CONVOS=[
  {from:"you (later)",s:[
    {b:["hey","it's you","from a little later"]},{c:[["who is this","i know who this is"],["prove it","i believe you"],["how much later","how much teeth"]]},
    {b:["it's {t}. in about four minutes you're going to hear something in the other room.","don't go look.","i went and looked."]},
    {c:[["what was it","i'm going to go look"],["i'm not going to look","i'm already walking there"],["there is no other room","there is. i'm in it"]]},
    {b:["yeah. that's what i typed too.","it was just a guy. he had our face on. not on right. like a sock.","he asked how many teeth we have and i told him and he wrote it down on his arm. with a tooth."]},
    {c:[["how many did you say","{teeth}"],["what did he want","he can have them"],["stop","don't stop"]]},
    {b:["ok i have to go. he's teaching me the group.","when he asks, say {teeth1}. it buys you a day.","love you. love us."]},{wait:5200},{b:["he says hi"],say:"hi"}]},
  {from:"Mom (Jeff)",s:[
    {b:["honey are you on that website again","the one with the group"]},{c:[["no","yes mother"],["what website","the group one. yes"],["mom?","hi mom. you sound far away"]]},
    {b:["good. it's dinner. we're all down here.","we set a place for you. it's the one with your name carved in it lol","the lol is because of the carving"]},
    {c:[["i'm not hungry","i'm so hungry"],["where is down here","i know where"],["who is we","i know who"]]},
    {b:["your father is the table now. don't make it weird.","bring your teeth. all of them this time. even the spare ones."]},
    {c:[["i only have {teeth}","i have so many"],["what spare ones","i found the spare ones"]]},
    {b:["sweetie.","count again.","with your tongue.","we'll wait."]},{wait:6000},{b:["see."],say:"see",teeth:3}]},
  {from:"Jeffbook Support",s:[
    {b:["Thank you for contacting Support. You did not contact Support.","Our records show you are trying to leave."]},
    {c:[["i'm not","i would never"],["how do i leave","how do i stay"],["what records","my records"]]},
    {b:["To delete your account, please confirm the feeling you get at 3 am."]},
    {c:[["dread","dread (correct)"],["nothing","nothing (correct)"],["being watched","being watched (correct)"]]},
    {b:["Thank you. For your security we have sent a verification Jeff to your location ({city}).","He is on foot. He is very fast.","Do not let him in. He will already be in."]},
    {c:[["cancel that","send two"],["how long","not long"],["i'm locking the door","i'm unlocking the door"]]},
    {b:["Is there anything else I can help you become today?"]},{wait:4200},{b:["That was rhetorical. It's started."],say:"it has started"}]}
];
J.scene("dm",st=>{
  const cv=CONVOS[S.sedBase<0?J.ri(0,2):S.sed];bar(st,cv.from,J.v("active now, behind you","active now, in the walls"));
  const chat=el("div","chat");st.appendChild(chat);const rep=el("div","replies");st.appendChild(rep);
  const add=(cls,text)=>{const b=txt("div","bub "+cls,text);chat.appendChild(b);window.scrollTo(0,document.body.scrollHeight);return b};
  const typing=async ms=>{const d=el("div","bub them","<span class='dots'><b></b><b></b><b></b></span>");chat.appendChild(d);window.scrollTo(0,document.body.scrollHeight);await J.wait(ms);d.remove()};
  (async()=>{
    await J.wait(700);
    for(const step of cv.s){
      if(step.wait){await typing(step.wait)}
      if(step.b){for(const l of step.b){const tx=J.fill(l);if(l===step.b[0])await typing(650+Math.min(2200,tx.length*32));else await J.wait(450+Math.min(1500,tx.length*22));add("them",tx);A.pop();if(step.say)J.say(step.say,{pitch:0.3,rate:0.7});await J.wait(450)}
        if(step.teeth)S.teeth+=step.teeth}
      if(step.c){
        const born=Date.now();
        const choice=await new Promise(res=>{rep.innerHTML="";step.c.forEach(o=>{const b=txt("button","",J.fill(o[0]));rep.appendChild(b);b.addEventListener("click",()=>res(o))})});
        const d=Date.now()-born;if(d<1500)S.fast++;if(d>15000)S.slow++;
        rep.innerHTML="";const mine=add("me",J.fill(choice[0]));A.click();await J.wait(1300);
        mine.textContent=J.fill(choice[1]);mine.appendChild(txt("small","","edited"));A.clank(0.25);await J.wait(900);
      }
    }
    await J.wait(1600);J.toast(J.v("Jeff is behind this notification.","Jeff is under this notification. Lift it."),3800);await J.wait(2600);
    const b=txt("button","",J.v("leave conversation","stop replying"));rep.appendChild(b);
    b.addEventListener("click",()=>{rep.innerHTML="";add("them",J.v("you can't leave a conversation with yourself. but ok.","left. the chat is still open on his end. he's still typing."));J.after(2200,()=>J.finish("dm"))});
  })();
});

/* ---------- the marketplace ---------- */
const ITEMS=[
  ["your name, never worn",3,"Still has the tags. The tags say Jeff.","Sold. Try it on. It fits because you're the right size for it now."],["jar of the sound you make when you think you're alone",5,"Do not open near mirrors.","Sold. It's on your nightstand. It has been on your nightstand."],
  ["mirror (works too well)",2,"Shows who's behind you. Shows who's behind them.","Sold. It's hanging where the other mirror was. The other mirror is fine. Don't look for it."],["the second door in your bedroom",9,"You have one. Look again later.","Sold. It's installed. Don't open it tonight. It needs to settle."],
  ["skin, adult medium, one previous owner (you)",12,"Dry clean only. Do not ask how.","Sold. It's on the hook behind the door. If it's not on the hook, it's up."],["teeth, assorted, still warm",1,"No lowballs. I know what I have. I have everyone's.","Sold. Check your pockets. Other pockets."],
  ["a staircase (down only)",4,"Seven floors, then it keeps going. Buyer must collect.","Sold. It's where your closet floor was."],["the last four minutes",6,"You weren't using them.","Sold. You'll get them back at a worse time."],
  ["dad's hands",8,"Good condition. Still wave.","Sold. They're on your shoulders. That's what that is."],["one (1) scream, unused, in original packaging (a pillow)",3,"Gift receipt included.","Sold. Keep the pillow."],
  ["what the dog has been staring at",7,"It has been staring back. They have an understanding.","Sold. It's in the corner now. The dog can stop."],["the space behind you (pickup only)",2,"Currently occupied. Tenant stays.","Sold. Don't turn around. You'll void the warranty."],
  ["wet thing",1,"Don't know what it is. It knows what you are.","Sold. You'll hear it before you see it."],["a voicemail from your own number",4,"11 years long. It's mostly counting.","Sold. It's already playing. Quietly. Since you got here."],
  ["a second, smaller Jeff",10,"Lives in the first one. Feed twice daily or he feeds himself.","Sold. He's already eaten."],["the lighthouse keeper's other log",5,"The entries he didn't put on the website.","Sold. Page one is about you."],
  ["extra elbow",2,"You'll find a place for it.","Sold. Left arm. You'll notice by morning."],["couch (free) (it remembers)",0,"Must take everything that's in it. Must not look.","It was free. That should have told you something."]
];
J.scene("market",st=>{
  bar(st,"JEFF BUY SELL TRADE","your balance: "+S.teeth+" teeth");const bal=st.querySelector(".bar span:last-child");
  st.appendChild(txt("p","sm",J.v("All prices in teeth. All sales final. All items already delivered.","Second-hand only. The first hand was yours. No returns. It returns on its own.")));
  const list=el("div");list.style.marginTop="12px";st.appendChild(list);
  const items=J.shuffle(J.half(ITEMS)).slice(0,7),conds=J.shuffle(J.v(["warm","damp","used once","breathing","like new (it isn't)","load-bearing","still attached"],["haunted, lightly","as-is","loud at night","opened, resealed","pre-chewed","previously yours","wet"]));let bought=0,looked=null;
  const leave=txt("button","btn ghost",J.v("leave without buying","leave empty-handed"));leave.style.width="100%";
  items.forEach(it=>{
    const b=el("button","item");const l=el("div");l.appendChild(txt("b","",it[0]));l.appendChild(txt("small","","sold by Jeff. condition: "+conds.pop()+"."));b.appendChild(l);b.appendChild(txt("span","",it[1]?it[1]+(it[1]===1?" tooth":" teeth"):"free"));list.appendChild(b);
    b.addEventListener("click",()=>{
      if(b.disabled)return;looked=it;A.pop();
      const m=el("div","modal"),box=el("div");m.appendChild(box);st.appendChild(m);
      box.appendChild(txt("div","k","LISTING"));const h=txt("p","mid",it[0]);h.style.margin="8px auto";box.appendChild(h);box.appendChild(txt("p","sm",it[2]));
      const buy=txt("button","btn","buy for "+(it[1]||"nothing")),back=txt("button","btn ghost","not yet");box.appendChild(buy);box.appendChild(el("br"));box.appendChild(back);
      back.addEventListener("click",()=>m.remove());
      buy.addEventListener("click",()=>{
        S.teeth-=it[1];S.inv.push(it[0]);bought++;A.crunch();b.disabled=true;b.style.opacity=".4";b.querySelector("span").textContent="SOLD";
        bal.textContent="your balance: "+S.teeth+" teeth";
        box.innerHTML="";box.appendChild(txt("p","mid",it[3]+(S.teeth<0?" You're short now. We'll collect the rest from you directly.":"")));
        const ok=txt("button","btn","ok");box.appendChild(ok);ok.addEventListener("click",()=>{m.remove();leave.textContent="done shopping"});
      });
    });
  });
  st.appendChild(leave);
  leave.addEventListener("click",()=>{
    if(!bought){const it=looked||J.pick(items);S.inv.push(it[0]);S.teeth-=it[1];S.defy++;
      J.toast("Jeff saw you looking at '"+it[0]+"'. He marked it sold. To you.",5200);J.after(2600,()=>J.finish("market"))}
    else J.finish("market");
    leave.disabled=true;
  });
});

/* ---------- the stream ---------- */
const CHATTER=["turn around","he sees the phone","react if you can see him","why is the viewer in the video","he moves when you don't","first","jeff jeff jeff","is that {city}","he's closer in mine","don't react he likes it","REACT","i can hear this stream through my wall","that's the new guy's place","lol he's holding the {dev} so tight"];
J.scene("live",st=>{
  const top=bar(st,"LIVE  Jeff","");const vw=top.lastChild;let viewers=J.ri(40,90);
  const cv=document.createElement("canvas");cv.className="wide";st.appendChild(cv);const F=fit(cv,0.5),g=F.g,W=F.w,H=F.h;
  const com=el("div","sm");com.style.cssText="min-height:5.2em;max-width:none;margin-top:8px;font-size:.82rem;color:#b9af99";st.appendChild(com);
  const react=txt("button","btn","react");react.style.width="100%";st.appendChild(react);
  const place=J.v(J.pick(["field","hall"]),"street");const cb=J.shuffle(J.half(CHATTER));let idleSaid=0,ri=0;const RL=J.v(["he liked that","he heard that","don't","closer","he's smiling. you can't see it yet.","that's the porch","he ducked under something","you can stop","he hasn't","that's the door","he's reading your screen from there","one more","that's the glass","."],["again","he likes when you do that","that was the gate","he waved. wrong hand.","he's on the lawn","stop helping him","he knows which window","he's got a key","it's your key","that's the stairs","third step creaks. hear it?","he's in the hall","he's at the screen","turn it off"]);let d=1,target=1,lastIn=Date.now(),ended=false,endT=0,lines=[];
  const say=t=>{lines.push("Jeff: "+J.fill(t));if(lines.length>4)lines.shift();com.innerHTML="";lines.forEach(l=>com.appendChild(txt("div","",l)))};
  A.static(0.03);say("first");
  J.every(1700,()=>{if(!ended){viewers+=J.ri(1,9);vw.textContent=viewers+" watching";if(cb.length&&Math.random()<0.6)say(cb.pop())}});
  const step=(amt,why)=>{if(ended)return;target=Math.max(0,target-amt);A.thump();if(why)say(why)};
  react.addEventListener("click",()=>{if(ended)return;lastIn=Date.now();step(0.075,RL[Math.min(ri++,RL.length-1)]);react.disabled=true;J.after(1500,()=>{if(!ended)react.disabled=false})});
  J.every(1000,()=>{if(!ended&&Date.now()-lastIn>5200){lastIn=Date.now();S.slow++;step(0.14,idleSaid?null:(idleSaid=1,J.v("he moves when you don't","he counts when you blink")))}});
  J.raf((t,dt)=>{
    d+=(target-d)*Math.min(1,dt*2.5);
    if(!ended&&d<0.1){ended=true;endT=t;A.static(0);react.disabled=true;com.innerHTML="";J.buzz(200)}
    g.fillStyle="#1d2324";g.fillRect(0,0,W,H);const hy=H*0.56,cx=W/2;if(!ended){g.fillStyle="#141819";g.fillRect(0,hy,W,H-hy)}
    if(!ended){
      g.strokeStyle="#55615f";g.lineWidth=1;
      if(place==="field"){g.beginPath();g.moveTo(0,hy);g.lineTo(W,hy);g.stroke();g.fillStyle="#7d8a86";g.beginPath();g.arc(W*0.78,H*0.16,13,0,6.3);g.fill();for(let i=0;i<24;i++){const x=hash(i,1,2)*W,y=hy+hash(i,3,4)*(H-hy);g.beginPath();g.moveTo(x,y);g.lineTo(x+2,y-6-hash(i,5,6)*8);g.stroke()}}
      else if(place==="hall"){[[0,0],[W,0],[0,H],[W,H]].forEach(p=>{g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(cx+(p[0]?26:-26),hy+(p[1]?38:-60));g.stroke()});g.strokeRect(cx-26,hy-60,52,98);for(let i=1;i<4;i++){const k=i/4;g.strokeRect(cx-26-k*(cx-26),hy-60-k*(hy-60),(52+k*(W-52)),98+k*(H-98))}}
      else{g.beginPath();g.moveTo(0,hy);g.lineTo(W,hy);g.stroke();for(let i=0;i<4;i++){const x=W*(0.1+i*0.27),s=0.5+i*0.18;g.beginPath();g.moveTo(x,hy);g.lineTo(x,hy-70*s);g.lineTo(x+16*s,hy-70*s);g.stroke();g.fillStyle="rgba(217,207,184,"+(0.1+0.08*Math.sin(t*3+i)).toFixed(2)+")";g.beginPath();g.arc(x+16*s,hy-66*s,5*s,0,6.3);g.fill()}}
      const k=1-d,s=0.07+k*k*2.3,base=hy+k*k*H*0.5,sway=Math.sin(t*0.9)*2*s;
      g.fillStyle="#020202";g.beginPath();g.arc(cx+sway,base-78*s,13*s,0,6.3);g.fill();
      g.beginPath();g.moveTo(cx-15*s+sway,base-64*s);g.lineTo(cx+15*s+sway,base-64*s);g.lineTo(cx+11*s,base);g.lineTo(cx-11*s,base);g.fill();
      g.fillRect(cx-22*s+sway,base-62*s,6*s,58*s);g.fillRect(cx+16*s+sway,base-62*s,6*s,58*s);
      if(d<0.5){g.fillStyle=J.C.ink;g.beginPath();g.arc(cx-4.5*s+sway,base-80*s,1.3*s,0,6.3);g.arc(cx+4.5*s+sway,base-80*s,1.3*s,0,6.3);g.fill()}
    }else{
      const e=t-endT;
      if(e>1.4){const f=document.createElement("canvas");f.width=f.height=320;J.face(f,S.face,1,{bg:"#1d2324",open:clamp((e-1.6)/2.2,0,1),lx:0,ly:0.4});const sz=Math.min(W,H)*(1+clamp((e-1.4)/6,0,0.5));g.drawImage(f,cx-sz/2,H/2-sz/2,sz,sz)}
    }
    const nz=ended?140:90;for(let i=0;i<nz;i++){g.fillStyle="rgba(217,207,184,"+(Math.random()*0.16).toFixed(2)+")";g.fillRect(Math.random()*W,Math.random()*H,Math.random()*26+2,1)}
    g.fillStyle="#c0392b";g.fillRect(10,10,44,20);g.fillStyle="#fff";g.font="bold 12px sans-serif";g.fillText("LIVE",17,25);
  });
  const fin=()=>{J.cut("JEFF",120);J.say(S.raw&&!/^je?ff/i.test(S.raw)?S.raw:"Jeff",{pitch:0.05,rate:0.5});
    com.appendChild(txt("div","cap",J.v("The stream has ended. The streamer is still here.","Stream over. He's keeping the camera. And what it's attached to.")));
    react.disabled=false;react.textContent="leave stream";react.onclick=()=>J.finish("live")};
  const watch=J.every(300,()=>{if(ended){clearInterval(watch);J.after(1700,fin)}});
});

/* ---------- the memory ---------- */
J.scene("memory",st=>{
  const d=new Date(),when=d.toLocaleDateString("en-US",{month:"long",day:"numeric"})+", "+(d.getFullYear()-11);
  bar(st,"ON THIS DAY",when);
  const cv=document.createElement("canvas");cv.className="wide";st.appendChild(cv);const F=fit(cv,0.42),g=F.g,W=F.w,H=F.h;
  const cap=txt("div","cap",J.v("Jeff tagged you in this photo. Tap yourself.","Same night. Different angle. Find yourself again."));st.appendChild(cap);
  const n=J.ri(4,6),people=[];for(let i=0;i<n;i++)people.push({x:W*(0.1+0.62*(i+0.5)/n),h:H*(0.3+J.rnd()*0.12),label:"",hat:J.rnd()<0.7});
  const win={x:W*0.8,y:H*0.14,w:W*0.16,h:H*0.34,label:""};let wrong=0,done=false,rev=0,shot=1;const big=document.createElement("canvas");big.width=big.height=320;
  const NO=[J.v("no.","nope."),J.v("that's Jeff.","that's the old Jeff."),J.v("that's also Jeff.","that's the Jeff who took the photo."),J.v("warmer.","colder."),J.v("that one is wearing you. different thing.","that one is saving you a seat. the seat is warm."),J.v("he's flattered.","she's flattered.")];
  const reveal=()=>{if(done)return;done=true;win.label="you";A.thump();J.cut("OUTSIDE",90);
    cap.textContent=J.v("There you are. Outside. There are ","There. At the glass again. There are ")+J.mem.toLocaleString("en-US")+J.v(" more photos from this night. You are at the window in all of them."," more. In the later ones the window is open.");
    J.after(4200,()=>{cap.textContent=J.v("Why didn't you come in. We left the door. We left it for eleven years.","You came in this time. Check your shoes. That's our carpet.");const b=txt("button","btn","next photo");b.style.width="100%";st.appendChild(b);
      b.addEventListener("click",()=>{shot++;A.crunch();J.cut(shot===2?"INSIDE":"CLOSER",90);
        if(shot===2){win.label="";cap.textContent=J.v("Next photo. You came in. Nobody remembers opening the door. Everyone is looking at who's holding the camera.","Next photo. You're at the table. Your plate is the only empty one. Everyone is looking at your plate.")}
        else if(shot===3){cap.textContent=J.v("Last photo. Taken from very close. We don't know who took it. You were the only one with hands.","Last photo. This one is from tonight. From about where your phone is.");b.textContent="close memory";J.say("smile",{pitch:0.1,rate:0.5})}
        else J.finish("memory")})})};
  cv.addEventListener("pointerdown",e=>{
    if(done)return;const p=pos(cv,e);
    if(p[0]>win.x-10&&p[0]<win.x+win.w+10&&p[1]<win.y+win.h+14)return reveal();
    let best=null,bd=1e9;people.forEach(q=>{const dd=Math.abs(p[0]-q.x);if(dd<bd){bd=dd;best=q}});
    if(best&&bd<W*0.09){best.label=NO[Math.min(NO.length-1,wrong)];wrong++;A.click();cap.textContent=wrong>=2?J.v("Not there. Look at the whole photo.","Wrong. You never stood with them."):J.v("That isn't you.","That's not you either.");if(wrong>=4)reveal()}
  });
  J.raf((t,dt)=>{
    if(done)rev=Math.min(1,rev+dt*0.5);
    if(shot===3){g.fillStyle="#0a0806";g.fillRect(0,0,W,H);J.face(big,S.face,1,{bg:"#0a0806",open:0.55+0.4*Math.sin(t*2),ly:0.6});const sz=Math.max(W,H)*1.15;g.drawImage(big,W/2-sz/2,H/2-sz/2,sz,sz);
      for(let i=0;i<90;i++){g.fillStyle="rgba(217,207,184,"+(Math.random()*0.1).toFixed(2)+")";g.fillRect(Math.random()*W,Math.random()*H,2,2)}
      g.fillStyle="rgba(255,170,60,.75)";g.font="11px monospace";g.fillText(when.toUpperCase(),10,H-10);return}
    g.fillStyle="#4a3a28";g.fillRect(0,0,W,H);g.fillStyle="#2b2117";g.fillRect(0,H*0.72,W,H*0.28);
    g.fillStyle="#0a0806";g.fillRect(win.x,win.y,win.w,win.h);g.strokeStyle="#5b4a36";g.lineWidth=3;g.strokeRect(win.x,win.y,win.w,win.h);
    const wx=win.x+win.w/2,wy=win.y+win.h*0.62;g.fillStyle=shot===2?"#0a0806":"#1a140e";g.beginPath();g.arc(wx,wy-win.h*0.2,win.w*0.22,0,6.3);g.fill();g.fillRect(wx-win.w*0.33,wy-win.h*0.02,win.w*0.66,win.h*0.5);
    if(rev>0){g.fillStyle="rgba(217,207,184,"+rev.toFixed(2)+")";g.beginPath();g.arc(wx-win.w*0.08,wy-win.h*0.22,2,0,6.3);g.arc(wx+win.w*0.08,wy-win.h*0.22,2,0,6.3);g.fill();g.fillRect(wx-win.w*0.4,wy+win.h*0.05,5,8);g.fillRect(wx+win.w*0.32,wy+win.h*0.05,5,8)}
    g.fillStyle="#17110c";g.fillRect(W*0.08,H*0.66,W*0.64,H*0.06);g.fillStyle="#3a2c1e";g.fillRect(W*0.34,H*0.58,W*0.12,H*0.08);
    for(let i=0;i<5;i++){g.fillStyle=J.C.ink;g.fillRect(W*0.35+i*W*0.022,H*0.54,2,H*0.04);g.fillStyle="rgba(255,190,90,"+(0.5+0.4*Math.sin(t*9+i)).toFixed(2)+")";g.fillRect(W*0.35+i*W*0.022-1,H*0.52,4,5)}
    people.forEach(q=>{
      const by=H*0.7,hr=W*0.04;g.fillStyle="#0e0a07";g.beginPath();g.arc(q.x,by-q.h,hr,0,6.3);g.fill();g.fillRect(q.x-hr*1.3,by-q.h+hr*0.8,hr*2.6,q.h);
      if(q.hat){g.fillStyle="#6b2a18";g.beginPath();g.moveTo(q.x-hr*0.7,by-q.h-hr*0.7);g.lineTo(q.x,by-q.h-hr*2.4);g.lineTo(q.x+hr*0.7,by-q.h-hr*0.7);g.fill()}
      if(rev>0){g.fillStyle="rgba(217,207,184,"+rev.toFixed(2)+")";g.beginPath();g.arc(q.x-hr*0.35,by-q.h-hr*0.1,1.8,0,6.3);g.arc(q.x+hr*0.35,by-q.h-hr*0.1,1.8,0,6.3);g.fill();g.fillRect(q.x-hr*0.5,by-q.h+hr*0.35,hr,2)}
      if(q.label){g.fillStyle=J.C.ink;g.font="12px 'Special Elite',monospace";g.textAlign="center";g.fillText(q.label,clamp(q.x,60,W-60),by-q.h-hr*2.8);g.textAlign="left"}
    });
    if(shot===2){const x=W*0.5,by=H*0.98,hr=W*0.085;g.fillStyle="#050403";g.beginPath();g.arc(x,by-H*0.3,hr,0,6.3);g.fill();g.fillRect(x-hr*1.5,by-H*0.3+hr*0.8,hr*3,H*0.4);
      g.fillStyle=J.C.rust;g.font="16px 'Special Elite',monospace";g.textAlign="center";g.fillText("you (back of)",x,by-H*0.3-hr-8);g.textAlign="left"}
    if(win.label){g.fillStyle=J.C.rust;g.font="16px 'Special Elite',monospace";g.textAlign="center";g.fillText("you",wx,win.y-6);g.textAlign="left"}
    for(let i=0;i<60;i++){g.fillStyle="rgba(217,207,184,"+(Math.random()*0.07).toFixed(2)+")";g.fillRect(Math.random()*W,Math.random()*H,2,2)}
    g.fillStyle="rgba(255,170,60,.75)";g.font="11px monospace";g.fillText(when.toUpperCase(),10,H-10);
  });
});
})();
