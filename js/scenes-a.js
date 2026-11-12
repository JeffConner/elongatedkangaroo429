/* scenes a: the gate, onboarding, the feed, the call, the end */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;

/* ---------- gate ---------- */
J.scene("gate",st=>{
  const c=el("div","center");st.appendChild(c);
  c.appendChild(txt("div","stamp","NOT RATED"));
  let line="Jeff added you to a group.";
  if(S.invite&&S.invite.n)line="Jeff #"+S.invite.n+" sent you here. They left you something. You get it when it is time.";
  else if(S.prev&&S.prev.no){const ag=J.ago(Date.now()-(S.prev.last||Date.now())),n=S.prev.no,w="Welcome back, Jeff #"+n+". You were gone "+ag+". We kept your spot warm. It is warm because someone has been sitting in it.";
    line=J.mix?"Visit "+S.visits+". From here on it is reruns, #"+n+". We shuffle them. You won't notice. You didn't notice the first time.":J.fill(J.e([w,w,"Three times now, #"+n+". Gone "+ag+". We changed the lights for you. And the sound. And what is under the floor. You'll see.","Jeff #"+n+". Fourth visit. Away "+ag+". We used the time to learn your {model}. {scr}. We fit better now.","Five. This is your fifth time, #"+n+". We ran out of new things to do to you at four. You are doing this to yourself now."]))}
  c.appendChild(txt("p","big",line));
  const sm=txt("p","sm","About fifteen minutes. Sound on. Flashing, sudden noise, a voice, and a great many teeth. It remembers you between visits. Nothing you type leaves your phone unless you hand it to someone yourself.");
  sm.style.marginTop="18px";c.appendChild(sm);
  const go=txt("button","btn","I am of sound mind"),no=txt("button","btn ghost","I am impressionable");
  c.appendChild(go);c.appendChild(no);
  const start=()=>{
    A.init();J.say(" ",{vol:0});S.t0=Date.now();A.thump();
    S.callAt=J.ri(1,3);S.msgAt=J.ri(1,2);
    if(S.prev&&S.prev.no){S.no=S.prev.no;S.face=S.prev.face||1;S.raw=S.prev.raw||"";S.teeth=(S.prev.teeth||32)+J.ri(1,3);J.go("hub")}
    else J.go("onboard");
  };
  go.addEventListener("click",start);
  no.addEventListener("click",()=>{
    c.innerHTML="";c.appendChild(txt("p","big","Good. That makes it easier."));
    const a=el("a","btn ghost");a.textContent="the gentle one is next door";a.href="https://fable1shot.faetempla.com/";a.style.textDecoration="none";c.appendChild(a);
    const b=txt("button","btn","come in anyway");c.appendChild(b);b.addEventListener("click",()=>{S.defy++;start()});
  });
});

/* ---------- onboarding ---------- */
J.scene("onboard",st=>{
  const c=el("div","center");st.appendChild(c);
  const stepName=()=>{
    c.innerHTML="";c.appendChild(txt("div","k","STEP 1 OF 3"));
    c.appendChild(txt("p","big","What do people call you?"));
    const inp=el("input","field");inp.type="text";inp.maxLength=24;inp.setAttribute("autocomplete","off");inp.setAttribute("autocapitalize","off");inp.setAttribute("autocorrect","off");inp.spellcheck=false;inp.setAttribute("aria-label","your name");
    c.appendChild(inp);
    const note=txt("p","sm"," ");note.style.marginTop="10px";note.style.minHeight="2.6em";c.appendChild(note);
    const b=txt("button","btn","that's me");b.disabled=true;c.appendChild(b);
    let real="",shown="",tm=0;
    const jeff=n=>("Jeff"+" jeff".repeat(8)).slice(0,n);
    inp.addEventListener("input",()=>{
      const v=inp.value;
      if(v.length>shown.length)real+=v.slice(shown.length);else real=real.slice(0,v.length);
      shown=v;b.disabled=!v.length;
      clearTimeout(tm);tm=setTimeout(()=>{
        if(inp.value!==jeff(inp.value.length)){inp.value=shown=jeff(inp.value.length);A.click();note.textContent=J.pick(["there you go.","close. we fixed it.","that's how it's spelled here.","no, like this.","we have you as this."])}
      },420);
    });
    b.addEventListener("click",()=>{
      S.raw=real.trim().slice(0,24);inp.value=jeff(Math.max(4,inp.value.length));inp.disabled=true;b.disabled=true;A.thump();
      note.textContent=/^je?ff/i.test(S.raw)?"You already knew. Interesting.":"It always was.";
      J.say("Jeff");J.after(1700,stepFace);
    });
  };
  const stepFace=()=>{
    c.innerHTML="";c.appendChild(txt("div","k","STEP 2 OF 3"));
    c.appendChild(txt("p","big","Choose a face."));
    const cap=txt("p","sm","These are the ones we have left.");cap.style.marginTop="8px";c.appendChild(cap);
    const grid=el("div","faces");c.appendChild(grid);
    const seeds=[];for(let i=0;i<6;i++)seeds.push(J.ri(1,99999));
    const cvs=seeds.map((sd,i)=>{const cv=document.createElement("canvas");cv.width=cv.height=150;J.face(cv,sd,0.05+i*0.03);grid.appendChild(cv);return cv});
    let picked=false;
    cvs.forEach((cv,i)=>cv.addEventListener("click",()=>{
      if(picked)return;picked=true;S.face=seeds[i];A.thump();cap.textContent="Good choice. Everyone picks that one.";
      const order=J.shuffle([0,1,2,3,4,5].filter(k=>k!==i));
      order.forEach((k,n)=>J.after(450+n*380,()=>{J.face(cvs[k],S.face,0.08+n*0.12);A.click()}));
      J.after(450+5*380+900,()=>{cvs.forEach(x=>J.face(x,S.face,0.5,{lx:0,ly:1}));cap.textContent="See. Everyone.";J.cut("YOURS")});
      J.after(450+5*380+2600,stepTeeth);
    }));
  };
  const stepTeeth=()=>{
    c.innerHTML="";c.appendChild(txt("div","k","STEP 3 OF 3"));
    c.appendChild(txt("p","big","How many teeth do you have?"));
    const cap=txt("p","sm","Don't check. Just say.");cap.style.marginTop="8px";c.appendChild(cap);
    let n=32;const row=el("div","step"),m=txt("button","","-"),v=txt("span","",String(n)),p=txt("button","","+");row.appendChild(m);row.appendChild(v);row.appendChild(p);c.appendChild(row);
    m.addEventListener("click",()=>{n=Math.max(0,n-1);v.textContent=n;A.click()});p.addEventListener("click",()=>{n++;v.textContent=n;A.click()});
    const b=txt("button","btn","that many");c.appendChild(b);
    b.addEventListener("click",()=>{
      S.teeth=n+1;S.no=J.ri(1300,98000);J.save();b.disabled=true;A.thump();
      v.textContent=n+1;cap.textContent="We have you down for "+(n+1)+".";
      J.after(2400,()=>J.go("hub"));
    });
  };
  stepName();
});

/* ---------- the feed ---------- */
const TITLES=["a group where we are all Jeff and one of us has been counting","Jeffs who heard it too (SERIOUS POSTS ONLY) (IT'S BEHIND YOU)","the same picture of a mouth every day until it opens",
  "JEFF BUY SELL TRADE HAUNT","i'm not saying it's the thing under the house but it's the thing under the house","{city} area Jeffs (underground) (literally)","this group is a person now"];
const POSTS=[
  "does anyone else's reflection do the thing a half second early. asking for all of us.",
  "sounds like something a person with the regular number of teeth would say but ok",
  "PLEASE SHOW TO MOTHER ! ! SHE IS IN THE WALL ! ! HA ! ! HA ! !",
  "it is {t} in {city}. we know because we are also in {city}. we are in the part of {city} that is inside your building.",
  "FUN GAME. add your own comma:\n\nlets eat jeff",
  "found the admin's first teeth in the group files. there are too many for one admin. there are too many for one species.",
  "new member's screen is {w} pixels wide. we measured. we fit.",
  "reminder that the crawlspace is a shared space. label your skins.",
  "which one of you has been standing in my kitchen. not mad. just say hi next time. you just stand there.",
  "i love this group. i haven't been able to close it since 2015. please. haha. please.",
  "unpopular opinion: if you can hear the humming you have to hum back. it's just manners.",
  "sold my last original part today. feeling light. feeling like the rest of us.",
  "LOST: one face. answers to jeff. if found do not put it on.\n\nedit: someone put it on.",
  "mods can we ban counting out loud again. jeff got to four hundred and something came.",
  "my {dev} is warm and it isn't on. anyone else",
  "day 4,015 of asking who the fuck is breathing in the group chat",
  "tag yourself i'm the wet sound",
  "just a reminder that {day} is hair day. bring yours. bring anyone's.",
  "what is the deal with the new guy. why is he reading this. he's reading this right now. hi.",
  "i ate rule 4. it was me. it tasted like being watched.",
  "anybody got a spare jaw. mine's doing the thing again where it's someone else's.",
  "you have {teeth} teeth. we have you down for {teeth1}. one of us is right and it's us.",
  "nobody:\nabsolutely nobody:\nthe wall: jeff",
  "is it still called sleepwalking if you wake up in the group",
  "PSA the thing going around saying 'you can leave' is a hoax. do not click leave. it clicks back.",
  "three (3) of you have my mother's voice now and i need you to stop calling the house",
  "i miss when this group was about sandwiches",
  "he's {w} pixels wide. he'll fit in the vent. measure twice.",
  "good morning to everyone except the jeff inside my jeff",
  "whoever keeps leaving wet footprints going INTO my closet and none coming out: respect",
  "hot take the basement has always had that many stairs and we should stop counting them",
  "my wife says i've been 'different' since joining. she says it with my old mouth. where did she get that"
];
const AFTER={
  mouth:"saw the new guy pull one. it was a good one. it was the load-bearing one.",
  dm:"who keeps messaging the new guy as himself. that's my bit.",
  market:"congrats to the new guy on buying {item}. it has been in his home for years.",
  live:"great stream. loved the part where he was the stream.",
  memory:"he finally found himself in the photo. took me eleven years.",
  hold:"he held on for a while. it liked that. it's still holding.",
  mirror:"he left one in the mirror. it's still in there. it waved at me. wrong hand.",
  confess:"brave of the new guy to post that. we all knew. but brave.",
  ghost:"whoever was using the new guy's phone: you left your fingerprints on the inside of the glass.",
  event:"great party. can't believe he came. can't believe he's still there."
};
const HOOKS={
  mouth:["Jeff added a photo","does this look like the normal amount to you","look closer"],
  dm:["Message request","1 new message from: you","open it"],
  market:["Jeff listed 14 items","in JEFF BUY SELL TRADE (no lowballs, I know what I have) (teeth)","browse"],
  live:["Jeff is live now","'standing in the dark behind where you live'","watch"],
  memory:["On this day, 11 years ago","Jeff tagged you in a photo you were not at","see your memory"],
  mirror:["Jeff wants to show you something","it's you. it's a little late.","look"],
  confess:["Post an update","Tell the group you're fine. Just type it.","write post"],
  ghost:["Security alert","Someone else is using your phone right now.","watch what he does"],
  hold:["Jeff started a group activity","'everyone hold still'","join"],
  event:["EVENT TONIGHT","Jeff's birthday (all of us). Location: under you.","RSVP"],
  final:["Group update",J.e(["You have been made admin.", "You have been made admin again. The last one of you is still in the role. Share.", "Promotion. You're the floor now. Admin of the floor.", "You have been made the group."]),"accept"]
};
const NAMES=["Jeff","jeff","J e f f","Jeff","jefF","JEFF","Jeff (admin)","Jeff Jr.","Not Jeff","Jeff"];
const TIMES=["just now","4 min ago","tomorrow","before you","3 am","11 yrs ago","during this sentence","while you blinked","now"];
const RX=["{a} Jeffs felt this","{a} teeth","mother reacted","this post is being chewed","{a} Jeffs are behind this"];
const RX2=["see {a} identical comments","comments are loose","tagged: you","0 comments (they are in the walls)","1 comment: yes"];
const SELF=["i am fine. i have the normal number.","hello i am new here and i would like to stay forever.","does anyone know how to stop typing. i'm not typing this.","my name is jeff and i came here on purpose."];
const used={};
const AFTER2={mouth:"he pulled the same tooth again. it's a subscription now.",dm:"the new guy and the new guy are still texting. get a room. (the other room.)",market:"he bought {item}. second-hand. the first hand is still on it.",
  live:"second stream was better. more of him. less of the viewer.",memory:"he found himself faster this time. practice. or he's been standing there.",mirror:"two in the mirror now. it's getting crowded. they're both better looking than him.",
  confess:"he posted again. different confession. same thumbs. not his.",ghost:"guy's been on the new guy's phone twice now. at this point it's a shared device.",hold:"they held hands again. nobody tell his other hand.",event:"lovely service. he looked so natural. he kept blinking but otherwise."};
const HOOKS2={mouth:["Jeff updated a photo","it grew back. come see.","look again"],dm:["Message request","1 new message from: someone using your name better than you do","open it"],market:["Jeff restocked","JEFF BUY SELL TRADE: everything you didn't buy last time, plus what you did","browse"],
  live:["Jeff is live again","'outside the same window. closer.'","watch"],memory:["On this night, again","Jeff tagged you again. Same night. You look worse.","see your memory"],mirror:["Jeff kept something of yours","you left it in the mirror","go get it"],
  confess:["Post an update","The group heard a rumor about you. Clear it up.","write post"],ghost:["Second security alert","He's on your phone again.","watch again"],hold:["Group activity","'hold still again. he missed you.'","join"],event:["EVENT TONIGHT","Jeff's funeral (all of us). Location: the walls.","RSVP"]};
const FINALH=[["Group update","You have been made admin.","accept"],["Group update","There's been another promotion.","accept"],["Group update","The group has a new floor.","see who"],["Group update","The group has been renamed.","see the name"]];

J.scene("hub",st=>{
  if(S.done>=S.callAt&&!S.called&&S.done<J.RUN){S.called=true;return J.go("call")}
  const lvl=S.done,you=lvl>=4,wr=J.wrong();
  const head=el("div","ghead");
  head.appendChild(txt("div","k",J.e(["CLOSED GROUP / YOU ARE ALREADY IN IT", "CLOSED GROUP / CLOSED BEHIND YOU", "PRIVATE GROUP / VISIBLE FROM INSIDE THE WALLS", "SECRET GROUP / YOU ARE THE SECRET"])));
  head.appendChild(txt("h1","",J.draw("title",J.TITLES)));
  const m=el("div","m");m.innerHTML="<b></b> members, all of them "+(you?"you":"Jeff");head.appendChild(m);st.appendChild(head);
  const mb=m.querySelector("b");mb.textContent=J.mem.toLocaleString("en-US");
  J.every(2100,()=>{J.mem+=1+Math.floor(Math.random()*3);mb.textContent=J.mem.toLocaleString("en-US")});
  const feed=el("div");st.appendChild(feed);
  const mkPost=(text,o)=>{
    o=o||{};const p=el("div","post fade"+(o.cls?" "+o.cls:""));
    const who=el("div","who");who.appendChild(J.avatar(o.seed||J.ri(1,99999),72,o.wrong==null?wr*0.85:o.wrong));
    const wn=el("div");const nm=el("div","nm");nm.textContent=o.name||(you?"you":J.pick(NAMES));if(Math.random()<0.6)nm.appendChild(el("i"));
    wn.appendChild(nm);wn.appendChild(txt("div","tm",o.time||J.pick(TIMES)));who.appendChild(wn);p.appendChild(who);
    const tx=txt("div","tx",text);p.appendChild(tx);
    if(o.tag){const rx=el("div","rx");rx.appendChild(txt("span","",J.ri(3,900)+" "+J.draw("rxw",J.RXW)));rx.appendChild(txt("span","","tagged: "+J.draw("tag",J.TAGS)));p.appendChild(rx)}
    return p;
  };
  const queue=[];const lastTxt=S.last?((S.sed&&AFTER2[S.last])||AFTER[S.last]):null;S.sed=J.sedFor();
  const qe=(arr,o)=>{const t=J.e(arr);if(t)queue.push(()=>mkPost(J.fill(t),o))};
  if(lvl===0&&S.prev&&S.prev.no){const ag=J.ago(Date.now()-(S.prev.last||Date.now())),k="look who's back. #"+S.no+". he left for "+ag+" and thinks we didn't notice. we rearranged his teeth while he was out.";
    qe([k,k,"third time. #"+S.no+". gone "+ag+". we stopped pretending to be surprised. we moved the furniture in his mouth.","#"+S.no+" again. "+ag+" away. he comes back like a tongue to a gap.","#"+S.no+". five. FIVE. he was gone "+ag+" and came back on purpose."])}
  if(lvl===0){J._miss=0;const dp=J.fill(J.e(J.DEVP));if(!J._miss)queue.push(()=>mkPost(dp))}
  if(lvl===0&&!S.prev&&S.raw&&!/^je?ff/i.test(S.raw))queue.push(()=>mkPost("so we're just not going to talk about how the new guy tried to type '"+S.raw+"' in the name box. ok. ok."));
  if(lastTxt)queue.push(()=>mkPost(J.fill(lastTxt)));
  if(S.invite&&S.invite.m&&!S.delivered&&lvl>=S.msgAt){
    queue.push(()=>{S.delivered=true;const p=el("div","post left fade");p.appendChild(txt("div","k","JEFF #"+S.invite.n+" LEFT THIS FOR YOU. THEY TYPED IT WITH THEIR OWN HANDS."));
      const tx=txt("div","tx",S.invite.m);tx.style.marginTop="8px";p.appendChild(tx);J.cut("FOR YOU",110);J.after(700,()=>J.say(S.invite.m,{rate:0.6,pitch:0.1}));return p});
  }
  if(lvl===3){const sec=Math.round((Date.now()-S.t0)/1000);qe(["i've been in here "+Math.floor(sec/60)+" minutes and "+(sec%60)+" seconds. i picked this face. i said "+(S.teeth-1)+" and they wrote down "+S.teeth+". i don't remember typing this. i'm not typing this.",
    "this is me from the last visit. i'm still in here. it's fine. it's fine. don't pull the tooth this time. you already did. ok.","third one of me checking in. there's a little row of us now. we do a wave. you can't see it. it's wet.",
    "it's {t}. this is the fourth time i've watched me read this post. blink if you're the original.\n\nnone of us blinked."],{name:"you (Jeff #"+S.no+")",seed:S.face,wrong:wr,time:"now"})}
  if(lvl>=2&&S.fast>2&&!used._f){used._f=1;qe(["new guy taps like he's being chased. he is. but still.",null,"he's tapping fast again. it doesn't speed us up. we have one speed. it's behind you.",null])}
  if(lvl>=2&&S.away>0&&!used._a){used._a=1;qe(["he looked away "+S.away+(S.away===1?" time":" times")+". we counted. it's what we do. we looked at him the whole time he wasn't looking.",null,null,"he looked away again. "+S.away+". whatever he's checking on over there, it's also us."])}
  if(lvl>=2&&S.defy>1&&!used._d){used._d=1;qe([null,"the new guy hangs up on us. it's fine. we're in the phone, not on it.","he turned the camera down. smart. the mirror in his hallway works either way.",null])}
  for(let q=0;q<2;q++){const t=J.draw("post",J.mock?J.MOCKP:POSTS.concat(J.PX));queue.push(()=>mkPost(J.rot(J.fill(t),lvl),{tag:true}))}
  const nxt=S.done>=J.RUN?"final":J.nextScene();if(nxt in S.sedOf)S.sed=S.sedOf[nxt];const hk=nxt==="final"?J.e(FINALH):((S.sed&&HOOKS2[nxt])||HOOKS[nxt]);
  queue.push(()=>{
    const p=el("div","post hook fade");p.appendChild(txt("div","k",hk[0].toUpperCase()));
    const tx=txt("div","tx",hk[1]);tx.style.marginTop="6px";p.appendChild(tx);
    const b=txt("button","btn",hk[2]);p.appendChild(b);
    const born=Date.now();
    b.addEventListener("click",()=>{const d=Date.now()-born;if(d<2500)S.fast++;if(d>30000)S.slow++;A.thump();J.go(nxt)});
    return p;
  });
  queue.forEach((f,i)=>J.after(300+i*1300,()=>{feed.appendChild(f());A.pop()}));
  /* the box that writes for you */
  const comp=txt("div","compose",J.e(["Write something, Jeff...", "Write it again, Jeff...", "Say something. We like the voice.", "Type. He likes to watch the thumbs."]));st.appendChild(comp);let wrote=false;
  comp.addEventListener("click",()=>{
    if(wrote)return;wrote=true;comp.className="compose typing";comp.textContent="";const line=J.fill(J.e(SELF));let i=0;
    J.every(70,()=>{if(i<line.length){comp.textContent+=line.charAt(i++);A.click()}else if(i===line.length){i++;
      J.after(700,()=>{feed.insertBefore(mkPost(line,{name:"you (Jeff #"+S.no+")",seed:S.face,wrong:wr,time:"just now"}),feed.firstChild);comp.className="compose";comp.textContent="You posted that. We watched you not do it."})}});
  });
  if(lvl>=3)J.every(2900,()=>{
    if(J.reduce)return;const xs=feed.querySelectorAll(".post:not(.hook):not(.left) .tx");if(!xs.length)return;const x=xs[Math.floor(Math.random()*xs.length)];
    if(x._o)return;x._o=x.textContent;const w=x._o.split(" ");const k=Math.floor(Math.random()*w.length);if(w[k].length<3||w[k].indexOf("\n")>=0){x._o=null;return}
    w[k]=Math.random()<0.5?"teeth":"JEFF";x.textContent=w.join(" ");setTimeout(()=>{x.textContent=x._o;x._o=null},650);
  });
});

/* ---------- the call ---------- */
const CALLS=[
  ["hey.","it's me.","it's you.","don't say anything. they can hear it when you talk.","just nod.","good.","we can see you nodding."],
  ["hi. this is a courtesy call about your teeth's extended warranty.","our records show you have more than you are covered for.","do not look for the extras.","they are not in your mouth."],
  ["","","wrong number.","","no it isn't."],
  ["happy birthday.","it's not today.","it's the other one.","the one at the end.","we got you something.","it's already on."]
];
J.scene("call",st=>{
  const c=el("div","call");st.appendChild(c);
  const top=el("div");const av=J.avatar(S.face,260,0.7);top.appendChild(av);
  const nm=txt("div","nm","Jeff"),stt=txt("div","st",J.e(["mobile, very close", "mobile, closer than last time", "landline, inside the wall", "calling from your pocket"]));top.appendChild(nm);top.appendChild(stt);c.appendChild(top);
  const capt=txt("div","capt","");c.appendChild(capt);
  const row=el("div","row"),no=txt("button","rb no","decline"),yes=txt("button","rb yes","accept");row.appendChild(no);row.appendChild(yes);c.appendChild(row);
  A.ring(true);let tries=0,answered=false;
  no.addEventListener("click",()=>{
    tries++;S.defy++;A.ring(false);stt.textContent="declined";
    if(tries>=2){row.innerHTML="";row.style.flexDirection="column";row.style.gap="10px";stt.textContent="2 missed calls. He left a voicemail.";
      const pv=txt("button","btn","play voicemail"),sk=txt("button","btn ghost","delete it");row.appendChild(pv);row.appendChild(sk);
      pv.addEventListener("click",()=>answer());sk.addEventListener("click",()=>J.go("hub"));return}
    J.after(1300,()=>{if(answered)return;nm.textContent="Jeff (2)";stt.textContent="mobile, closer";A.ring(true)});
  });
  yes.addEventListener("click",()=>answer());
  function answer(){
    if(answered)return;answered=true;A.ring(false);row.innerHTML="";A.static(0.035);
    const t0=Date.now();J.every(1000,()=>{const s=Math.floor((Date.now()-t0)/1000);stt.textContent="0:"+(s<10?"0":"")+s});
    const lines=J.mock?J.MOCKCALL:CALLS[S.ed<4?S.ed:J.ri(0,3)];let i=0;
    const next=()=>{
      if(i>=lines.length){A.static(0);stt.textContent="call ended. duration: 11 years";capt.textContent="";J.cut("JEFF",100);
        const b=txt("button","btn ghost","go back to the group");row.appendChild(b);b.addEventListener("click",()=>J.go("hub"));return}
      const l=lines[i++];capt.textContent=l||"(breathing)";
      if(l)J.say(l,{pitch:0.15,rate:0.65});else A.static(0.08);
      J.face(av,S.face,0.7,{open:l?0.6:0.1});J.after(350,()=>J.face(av,S.face,0.7,{open:0.15}));
      J.after(l?1500+l.length*75:2600,next);
    };
    J.after(900,next);
  }
});

/* ---------- the end ---------- */
const DID={mouth:"pulled one",dm:"talked to himself",market:"went shopping",live:"watched the stream",memory:"found himself in the photo",mirror:"left one in the mirror",confess:"confessed",ghost:"lent out his phone",hold:"held on",event:"came to the party"};
function wrap(g,text,x,y,maxW,lh){
  const words=text.split(" ");let line="";
  for(let i=0;i<words.length;i++){const t=line?line+" "+words[i]:words[i];if(g.measureText(t).width>maxW&&line){g.fillText(line,x,y);y+=lh;line=words[i]}else line=t}
  if(line){g.fillText(line,x,y);y+=lh}return y;
}
J.scene("final",st=>{
  const c=el("div","center");st.appendChild(c);
  c.appendChild(txt("p","big",J.e(["You have been made admin.", "You have been made admin again. The last one of you is still in the role. Share.", "Promotion. You're the floor now. Admin of the floor.", "You have been made the group."])));
  const s1=txt("p","mid",J.e(["It means you count now.", "It means there are two of you counting. Stay in sync.", "It means they stand on you.", "It means when they say Jeff, it's your mouth that opens."]));s1.style.marginTop="14px";c.appendChild(s1);
  const b0=txt("button","btn","meet everyone");c.appendChild(b0);J.say("you count now");
  b0.addEventListener("click",()=>{A.thump();count()});
  const file=()=>{
    A.thump();c.innerHTML="";c.style.justifyContent="flex-start";
    const secs=Math.round((Date.now()-S.t0)/1000),mm=Math.floor(secs/60),ss=secs%60;
    const verdict=J.mock?"Fifth visit. We are a little worried about you. That is new for us.":S.away>2?"Kept looking away. It helped nothing.":S.fast>3?"In a hurry. To get where.":S.slow>2?"Lingered. We like that.":S.defy>1?"Said no a lot. Adorable.":"Cooperative. Suspiciously.";
    const cv=document.createElement("canvas");cv.width=680;cv.height=920;cv.className="card";const g=cv.getContext("2d");
    g.fillStyle="#0b0907";g.fillRect(0,0,680,920);g.strokeStyle=J.C.rust;g.lineWidth=3;g.strokeRect(14,14,652,892);
    const f=document.createElement("canvas");f.width=f.height=300;J.face(f,S.face,0.95,{bg:"#0b0907"});g.drawImage(f,190,40);
    g.fillStyle=J.C.ink;g.textAlign="center";g.font="54px 'Special Elite','Courier New',monospace";g.fillText("JEFF #"+S.no,340,410);
    g.font="22px 'Special Elite','Courier New',monospace";g.fillStyle=J.C.rust;g.fillText("ADMIN. MEMBER SINCE BEFORE YOU.",340,448);
    g.fillStyle=J.C.ink;g.textAlign="left";g.font="24px 'Special Elite','Courier New',monospace";let y=506;
    const rows=["Visit "+S.visits+" on this "+J.D.model+".","Teeth on file: "+S.teeth+" (we have "+(S.teeth+1)+")","Time in the group: "+mm+":"+(ss<10?"0":"")+ss+" (so far)","Looked away: "+S.away+(S.away===1?" time":" times")+" ("+Math.round(S.awayMs/1000)+" s)",
      "Tonight he: "+S.run.map(k=>DID[k]).join(", ")+".","In his home now: "+(S.inv.length?S.inv.join("; "):"nothing he knows about")+".","Notes: "+verdict];
    rows.forEach(r=>{y=wrap(g,r,54,y,572,32)+10});
    g.fillStyle="#776d5c";g.font="19px 'Special Elite','Courier New',monospace";g.textAlign="center";g.fillText("fable6shot.faetempla.com   NOT RATED",340,884);
    c.appendChild(txt("div","k","YOUR FILE. SCREENSHOT IT. IT SCREENSHOTS YOU."));c.appendChild(cv);
    const lab=txt("p","mid","Leave one sentence for whoever you send here.");lab.style.marginTop="22px";c.appendChild(lab);
    const inp=el("input","field");inp.type="text";inp.maxLength=110;inp.placeholder="they get it at a bad moment";inp.style.fontSize="16px";inp.style.maxWidth="340px";c.appendChild(inp);
    const dis=txt("p","sm","It rides inside the link itself and is read to them out loud. Nothing is uploaded anywhere.");dis.style.marginTop="8px";c.appendChild(dis);
    const sh=txt("button","btn","send this to someone"),cp=txt("button","btn ghost","copy the link"),lv=txt("button","btn red","leave group");
    c.appendChild(sh);c.appendChild(cp);c.appendChild(lv);
    const msg=txt("p","mid","");msg.style.marginTop="16px";msg.style.minHeight="4.5em";c.appendChild(msg);
    const text=J.e(["I am Jeff #", "Went back. I'm Jeff #", "Third time in. Still Jeff #", "Four visits. I'm Jeff #"])+S.no+" now. It took about fifteen minutes. I can't describe it. Your turn.";
    const copy=u=>{try{navigator.clipboard.writeText(u).then(()=>{msg.textContent="Copied. It's on your clipboard. It's on you."},()=>{msg.textContent=u})}catch(e){msg.textContent=u}};
    sh.addEventListener("click",()=>{const u=J.inviteURL(inp.value.trim());if(navigator.share){navigator.share({title:"Jeff added you to a group",text:text,url:u}).catch(()=>{})}else copy(u)});
    cp.addEventListener("click",()=>copy(J.inviteURL(inp.value.trim())));
    let lvn=0;const LV=J.e([["You cannot leave. You are the admin.","You started this group. You were very small. You had all of your teeth and then some.","Ok. See you at the top."],["Leaving again. You left last time. Look where you are.","The door is where you left it. It isn't where it was.","Ok. See you at the top. Again."],["You can't leave a floor. You are the floor.","Lift one foot. See? It comes with you.","Ok. Go. We'll hold the shape of you."],["Leave what. You're the group. Where would you put it down.","Fine. Take us with you. You do anyway.","Ok. Go on up. We'll be the stairs."]]);
    lv.addEventListener("click",()=>{
      A.thump();msg.textContent=LV[Math.min(lvn,2)];lvn++;if(lvn===2)lv.textContent="leave anyway";
      if(lvn>=3){lv.disabled=true;J.save();J.after(1800,()=>{
        J.cut("JEFF",140);st.innerHTML="";const e=el("div","center");st.appendChild(e);window.scrollTo(0,0);
        e.appendChild(txt("p","end",J.e(["You can close the tab now. Closing it does not close us.", "Close it. We'll be in the next tab you open. Top left.", "Close the tab. Then look at your reflection in the black screen.", "There is no tab. Look at your hand."])));
        const p2=txt("p","end",J.e(["We have you down for {n}.", "Tooth count on file: {n}. Rising.", "{n} teeth. We counted while you read this.", "You came in with fewer. {n} now."]).replace("{n}",S.teeth+1));p2.style.marginTop="18px";e.appendChild(p2);
        const again=txt("button","btn ghost",J.e(["go again. it will not be the same.", "again. it changes every time. so do you.", "go again. two more before we get bored.", "once more. after this we stop being polite."]));e.appendChild(again);
        again.addEventListener("click",()=>{location.href=J.carry()});
        J.say("see you at the top",{pitch:0.1,rate:0.6});
      })}
    });
  };
  const count=()=>{
    c.innerHTML="";c.style.justifyContent="flex-start";
    const cap=txt("p","mid",J.e(["This is everyone.", "Everyone came back to see you again.", "Everyone's here. They brought the ones from under.", "This is everyone. Count them. You can't. That's the joke."]));cap.style.minHeight="4.4em";c.appendChild(cap);
    const num=txt("div","k","0 of "+J.mem.toLocaleString("en-US"));c.appendChild(num);
    const grid=el("div","everyone");c.appendChild(grid);const cvs=[];let lx=0,ly=0;
    const draw=cv=>J.face(cv,S.face,1,{lx:lx,ly:ly,open:cv._o});
    const id=J.every(150,()=>{if(cvs.length<28){const cv=document.createElement("canvas");cv.width=cv.height=110;cv._o=Math.random();grid.appendChild(cv);cvs.push(cv);draw(cv);A.click();
      num.textContent=Math.round(J.mem*cvs.length/28).toLocaleString("en-US")+" of "+J.mem.toLocaleString("en-US")}});
    const mv=e=>{const r=grid.getBoundingClientRect();lx=((e.clientX-r.left)/r.width-0.5)*2;ly=((e.clientY-r.top)/r.height-0.5)*2;cvs.forEach(draw)};
    grid.addEventListener("pointermove",mv);grid.addEventListener("pointerdown",mv);
    J.after(5000,()=>{cap.textContent=J.e(["They all wanted to see you before it happens.", "They wanted to see if you'd changed. You have. Look at the teeth.", "They want to know why you keep coming down here.", "They're not looking at you. They're looking at what's behind you. Don't."]);J.say("we are all here",{pitch:0.1,rate:0.55})});
    J.after(9500,()=>{cap.textContent=J.e(["They all have your face on. It is the one you picked at the door.", "Your face fits them better each visit.", "They've started doing your expressions. That one is 'concern'.", "Nobody's wearing your face tonight. This is just what they look like now."]);cvs.forEach(cv=>{cv._o=1;draw(cv)});A.thump()});
    J.after(14500,()=>{clearInterval(id);J.cut("JEFF",140);c.innerHTML="";c.style.justifyContent="center";
      const named=S.raw&&!/^je?ff/i.test(S.raw),p=txt("p","end","");c.appendChild(p);
      const line=named?J.e(["Goodbye, {raw}.","{raw}. We kept the name in a jar. You can look at it.","We tried calling {raw}. Something else answered.","{raw} is doing fine without you, by the way."]).replace("{raw}",S.raw):"You never even tried another name.";let i=0;
      const ty=J.every(120,()=>{if(i<line.length){p.textContent+=line.charAt(i++);A.click()}else{clearInterval(ty);
        if(named)J.say("goodbye, "+S.raw,{pitch:1,rate:0.85});
        J.after(2800,()=>{const p2=txt("p","end",named?J.e(["That is the last time anyone will call you that.", "We said it once more so you could hear how wrong it sounds now.", "It had your voice. Lower.", "It has your job. It's better at it."]):"Good. It saves a step.");p2.style.marginTop="18px";c.appendChild(p2);
          J.after(3000,()=>{const b=txt("button","btn","see my file");c.appendChild(b);b.addEventListener("click",file)})})}});
    });
  };
});
})();
