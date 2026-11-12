/* editions: which visit this is, what it looks and sounds like, what device you are on, and text pools that never repeat inside visits 1 to 4 */
(()=>{
"use strict";
const J=window.J,S=J.S,v=S.visits;
S.ed=v<=4?v-1:v===5?4:5;J.mock=S.ed===4;J.mix=S.ed===5;
let order=S.prev&&S.prev.order;if(!order||order.length!==J.POOL.length)order=J.shuffle(J.POOL);S.order=order;
const L=order.map(x=>[x,0]).concat(order.map(x=>[x,1]));
const cut=v===1?L.slice(0,7):v===2?L.slice(7,14):v===3?L.slice(14,20):J.shuffle(L).slice(0,v===5?4:7);
S.sedOf={};S.plan=[];cut.forEach(x=>{if(S.plan.indexOf(x[0])<0){S.plan.push(x[0]);S.sedOf[x[0]]=x[1]}});
S.sedBase=v<=3?0:-1;S.sed=0;
if(!new URLSearchParams(location.search).get("run"))J.RUN=S.plan.length;
J.sedFor=()=>S.sedBase<0?J.ri(0,1):S.sedBase;
J.v=(a,b)=>S.sed?b:a;
J.e=arr=>S.ed<4?arr[S.ed%arr.length]:(J.mock&&arr.length>4)?arr[4]:arr[J.ri(0,Math.min(arr.length,4)-1)];
const bags={};
J.draw=(name,arr,mod)=>{
  if(!bags[name]||!bags[name].length){mod=mod||4;let sub=S.ed<4?arr.filter((x,i)=>i%mod===S.ed%mod):arr.slice();if(!sub.length)sub=arr.slice();bags[name]=J.shuffle(sub)}
  return bags[name].pop();
};
J.half=arr=>arr.filter((x,i)=>i%2===S.sed);

/* ---------- look, sound, movement ---------- */
const TH=[
  {f:55,w:"sawtooth",lp:150,pm:1,vp:0,vr:1,grain:.1,c:{bg:"#0b0907",bone:"#d9cfb8",dim:"#776d5c",rust:"#9a3a1c",dried:"#3a0f0c",bile:"#8c9548",panel:"#15120e",line:"#2c251c"}},
  {f:41.2,w:"triangle",lp:260,pm:.72,vp:1.1,vr:.8,grain:.03,c:{bg:"#e9e3d2",bone:"#17130e",dim:"#6f6654",rust:"#b3201a",dried:"#cfc2a3",bile:"#4f6b1c",panel:"#f6f1e4",line:"#bfb49c"}},
  {f:65.4,w:"square",lp:110,pm:1.32,vp:-.15,vr:1.15,grain:.14,c:{bg:"#4a0408",bone:"#ffe1d6",dim:"#d99a8e",rust:"#ffb03a",dried:"#210204",bile:"#ffe26a",panel:"#62090e",line:"#8a1f22"}},
  {f:49,w:"sawtooth",lp:320,pm:.5,vp:.45,vr:.62,grain:.22,c:{bg:"#010a03",bone:"#74ff8f",dim:"#2f9a4c",rust:"#e8ff3d",dried:"#063015",bile:"#ffb000",panel:"#03160a",line:"#0f4a22"}},
  {f:110,w:"square",lp:700,pm:1.9,vp:1.5,vr:1.3,grain:.05,c:{bg:"#0a0614",bone:"#ece4ff",dim:"#8776b5",rust:"#ff3df2",dried:"#2a0f45",bile:"#3dfff2",panel:"#150c28",line:"#2f1d52"}}
];
TH.forEach((t,i)=>{t.c.ink=["#d9cfb8","#efe6d0","#ffe1d6","#74ff8f","#ece4ff"][i]});S.tb=(S.prev&&S.prev.tb!=null)?S.prev.tb:J.ri(0,3);S.th=J.mock?4:(S.tb+v-1)%4;J.TH=TH[S.th];J.C=J.TH.c;
const rs=document.documentElement.style;Object.keys(J.C).forEach(k=>rs.setProperty("--"+k,J.C[k]));
document.body.classList.add("ed-"+S.th);document.documentElement.style.background=J.C.bg;
const gr=document.getElementById("grain");if(gr)gr.style.opacity=J.TH.grain;
const mt=document.querySelector('meta[name="theme-color"]');if(mt)mt.setAttribute("content",J.C.bg);

/* ---------- the device ---------- */
const ua=navigator.userAgent,sw=Math.min(screen.width,screen.height),sh=Math.max(screen.width,screen.height),dpr=Math.round(window.devicePixelRatio||1);
const IPH={"320x568":"iPhone SE, the old one","375x667":"iPhone 8 or SE","414x736":"iPhone 8 Plus","375x812":"iPhone X, XS or 11 Pro","414x896":dpr>=3?"iPhone XS Max or 11 Pro Max":"iPhone XR or 11",
  "390x844":"iPhone 12, 13 or 14","428x926":"iPhone 13 Pro Max or 14 Plus","393x852":"iPhone 15 or 16","430x932":"iPhone 15 Plus or 16 Plus","402x874":"iPhone 16 Pro or 17","440x956":"iPhone 17 Pro Max"};
let model="computer";
if(/iPhone/.test(ua))model=IPH[sw+"x"+sh]||"iPhone";
else if(/iPad/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1))model="iPad";
else if(/Android/.test(ua)){const m=ua.match(/Android [\d.]+; ([^;)]+)/);model=m&&m[1].trim().length>2&&m[1].trim()!=="K"?m[1].trim().replace(/ Build.*/,""):"Android phone"}
else if(/Windows/.test(ua))model="Windows PC";else if(/Macintosh/.test(ua))model="Mac";else if(/CrOS/.test(ua))model="Chromebook";else if(/Linux/.test(ua))model="Linux box";
const D=J.D={model:model,scr:sw+" by "+sh,cores:navigator.hardwareConcurrency||null,lang:(navigator.language||"").split("-")[0]==="en"?"English":(navigator.language||null),
  browser:/Edg\//.test(ua)?"Edge":/CriOS|Chrome\//.test(ua)?"Chrome":/FxiOS|Firefox\//.test(ua)?"Firefox":/Safari\//.test(ua)?"Safari":null,
  osv:(ua.match(/iPhone OS (\d+)/)?"iOS "+RegExp.$1:ua.match(/Android (\d+)/)?"Android "+RegExp.$1:null),batt:null,
  net:(navigator.connection&&navigator.connection.effectiveType)?navigator.connection.effectiveType.toUpperCase():null,v:v};
try{navigator.getBattery&&navigator.getBattery().then(b=>{D.batt=Math.round(b.level*100)})}catch(e){}

/* ---------- pools ---------- */
J.TITLES=["Please, Teeth, No More Teeth!!!!","You're welcome, I am Jeff","please pray for Jeff","My name is not jeff","It's Jeff Conner Storytime","You should name them Jeff","The Royal Court of Jeffbook",
  "My group count looks like a year. Send help.","Don't stop Jeff from being Jeff","Did Jeff Ever Really Have It?","Faces of Jeff","right now I'm just making groups hoping Jeff will join","Jeff Hasn't Hurt Me, I Just Brought Him Up",
  "Jeff 2: Electric Boogaloo.","Which group did you join, Jeff?","His name is Jeff, that explains it all.","Oops. this is NOT jeffbook, my bad","All Hail New Jeff!","Jefftember","i think jeff has lost it","Jeff II: The Jeffening","Jeffception",
  "And in this episode, Jeff meets a new friend","The essence of Jeff is becoming more readily available"];
J.TAGS=["Jeff, are you ok?","Thanks Jeff, very cool!","No One Asked You Jeff","Sorry Jeff","Unless it's Jeff","of course his name is Jeff","Oh God why, Jeff?!?!","Jeffposting","I really hate this Jeff","leave some for the rest of us Jeff.",
  "I don't like it when Jeff is right","Because Jeff Conner","Does Jeff Conner ever sleep?","Go to bed Jeff Conner","Who hurt Jeff Conner?","Jeff Conner has a fucking time machine","Potrebbe qualcuno fermare Jeff, per favore?","Shame difference","Sadly No","this gives me the sads",
  "I'm Not Subtle","Gratuitous Slow Motion","Did I Make That Group? Oh, I Did. Huh. How 'Bout That?","Which Group Should I Post This In?","Will someone tag a goddamn Admin?","Noooo very bad meme","Decontextualize Yoself","But, Irony...","*sarcasm implied","Relevant!",
  "10/10 kerfufflization","I never get tired of meta threads","You Give Good Reaction","What really happened to the dinosaurs?","i have no idea what ur oonnabout","The truth in your statement physically hurts me","Are you sure I'm not wasting your time","Essence of Jeff; is that like New Car smell, just more memes?",
  "Jeff Conner: Thread necromancer","sounds like you want to be Jeff Conner...","God Damn It, Jeff Conner Has Already Been Here","Now THAT'S what i call jeffposting","of course it's wet","This strokes Jeff's ego.","sounds wet but ok","that's the wall talking","is this a tooth or a group","he's in the comments (literally)"];
J.RXW=["Jeffs felt this","teeth","Jeffs are behind this","wet reacts","Jeffs chewed on this","hums","Jeffs under this","blinks","Jeffs saved this for later","knocks","Jeffs read this aloud","stares","Jeffs agree, in unison","scratches (from inside)","Jeffs can smell this","breaths",
  "Jeffs stood up","swallows","Jeffs turned around","drips","Jeffs wrote this down","twitches","Jeffs are closer now","held breaths"];
J.PX=["Please, Teeth, No More Teeth!!!!","does jeff ever sleep. asking because he's standing at the foot of my bed and i can't tell.","right now i'm just making groups hoping jeff will join. he joined. he joined from inside my house.",
  "of course his name is jeff. look at how he's holding that {model}.","i don't like it when jeff is right. he said i'd find a tooth in the sink. there's nine.","the essence of jeff is becoming more readily available. it's coming out of the taps.",
  "First Jeff, now this...\n\n(this is also Jeff)","jeff has a fucking time machine and all he does with it is stand in my hallway slightly before i get home","who hurt jeff. no really. who. we need to know what worked.",
  "And in this episode, Jeff meets a new friend.\n\n(it's you. you're the friend. the episode is long.)","My group count looks like a year. Send help. Send it down. We're under the floor.","leave some for the rest of us jeff. he ate the whole name. there's none left for the kids.",
  "oops. this is NOT jeffbook, my bad\n\nedit: it is. it's all jeffbook. my front door opens onto it.","don't stop jeff from being jeff. we tried once. that's why there's two basements.","sorry jeff","you should name them jeff. the baby. the dog. the thing in the yard. it saves time later."];
J.MOCKP=["he's back. FIVE. somebody take his {model} away.","we don't even hide anymore when he comes in. look. i'm just standing here. hi.","fifth visit. at this point you're not the victim. you're a regular.",
  "he knows the tooth is loose. he knows what's behind it. he's going to act surprised anyway. watch him.","mods can we get him a punch card. tenth haunting free.","I really hate this Jeff","Jeff, are you ok?\n\n(sincerely this time)","Go to bed Jeff.",
  "No One Asked You Jeff. five times no one asked you.","does he think there's a prize. there's no prize. there's just us. and we're tired.","the group voted. you're the weird one now. it was unanimous. you voted too.","we scared him four different ways and he came back for a fifth. who's haunting who."];
J.DEVP=["new member is on an {model}. {scr}. we can tell by the shape of the glass. it's a small window but we fit.","back on the {model}. {scr}. same one. there's a thumbprint on it that isn't yours. lower left.",
  "{model}. {cores} cores. he only uses one. we use the rest.","the {model} is set to {lang}. so are we now. took a while. listen: hello. hello. hello.","still the {model}? five visits and you never once thought to bring a different phone. we like this one. it knows us."];
J.AMB=["Jeff poked you.","Jeff poked you. From the inside of the screen.","Jeff liked a photo you haven't taken yet.","Jeff is {w} pixels away.","Jeff changed your relationship status to 'contained'.","Your {model} is warm. That's him.","Jeff mentioned you in a comment: 'soon'.",
  "Jeff and 1,203 others are looking at this notification with you.","Reminder: you have {teeth} teeth. Jeff has the rest.","Jeff is typing.","Jeff is typing on something that isn't a keyboard.","It is {t} in {city}. Jeff is also in {city}.","Jeff updated his profile picture. It's yours.",
  "You have a memory with Jeff from tomorrow.","Jeff shared a location: the other side of your door.","Jeff reacted to your breathing.","Someone you may know: you.","{scr}. That's the size of the hole he's looking through.","{batt}% battery. He's at {batt}% too. Different battery.",
  "You're on {net}. So is he. Same bars.","{browser} has a back button. Try it. See what's behind you.","Jeff tagged you in 'Jeff, are you ok?'","Jeff tagged you in 'No One Asked You Jeff'.","Jeff invited you to 'Go to bed Jeff Conner'. You're already a member. You're the bed.",
  "Jeff changed the group name to your name. Then changed it back. Then swallowed.","Jeff is using {cores} of your {cores} cores.","New login from {city}. It's you. New login from under {city}. Also you.","Jeff sent you a tooth.","Jeff unsent a tooth. It doesn't work like that.",
  "Screen time tonight: yours, a few minutes. His, since 2015.","Jeff is looking at your {osv} lock screen from the inside.","Jeff added you to 'Jeff II: The Jeffening'.","Your typing sounds different tonight. He's been practicing it.","1 friend suggestion: the one standing still in your photos.",
  "Jeff reacted to this notification before it was sent.","Jeff knows it's an {model}. He's had one. He's had yours."];
J.MOCKT=["You again.","We're tired. You do the voices this time.","Jeff is pretending to be scary. For you. Be polite.","This is the part where you get a notification. Here. Happy?","Visit five. The {model} is embarrassed for you.","You know how this one goes. Go on then."];
J.MOCKCALL=["it's the fifth time.","we don't have anything new.","do you have anything?","no? ok.","bye. see you at six. it's reruns from there."];
})();
