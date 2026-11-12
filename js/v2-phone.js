/* visit 2: the group moved into your phone. Lock screen, home screen, seven apps, a software update. */
(()=>{
"use strict";
const J=window.J,S=J.S,A=J.A,el=J.el,txt=J.txt;
const F="phone";
const UNITS=["p-voicemail","p-darkroom","p-weather","p-reminders","p-seance","p-contacts","p-maps"];

/* ---------- colors that work in every theme ---------- */
const hex=h=>{h=String(h||"#000").replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]};
const lum=h=>{const c=hex(h).map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]};
const on=bg=>{const a=lum(bg),b=lum(J.C.bg),c=lum(J.C.bone);const cr=(x,y)=>(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);return cr(a,b)>cr(a,c)?J.C.bg:J.C.bone};
const mix=(a,b,k)=>{const x=hex(a),y=hex(b);return"rgb("+x.map((v,i)=>Math.round(v+(y[i]-v)*k)).join(",")+")"};
const dark=()=>lum(J.C.bg)<lum(J.C.bone)?J.C.bg:J.C.bone, light=()=>lum(J.C.bg)<lum(J.C.bone)?J.C.bone:J.C.bg;
const tone=v=>mix(dark(),light(),Math.max(0,Math.min(1,v)));   /* duotone print: 0 = shadow, 1 = highlight */

/* ---------- style ---------- */
const css=`
body.fr-phone #stage{padding:0;max-width:none;min-height:100vh}
body.fr-phone .pf{position:fixed;top:0;bottom:0;left:0;right:0;margin:0 auto;width:100%;max-width:480px;z-index:20;background:var(--bg);color:var(--bone);
  font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Roboto,Helvetica,Arial,sans-serif;display:flex;flex-direction:column;overflow:hidden;font-size:15px;line-height:1.35}
body.fr-phone .pf button{font-family:inherit;border-radius:10px}
body.fr-phone .psb{flex:none;display:flex;justify-content:space-between;align-items:center;padding:calc(10px + env(safe-area-inset-top)) 22px 4px 26px;font-size:15px;font-weight:600;height:calc(42px + env(safe-area-inset-top))}
body.fr-phone .pst{display:flex;align-items:center;gap:6px;font-size:13px}
body.fr-phone .psig{display:inline-flex;align-items:flex-end;gap:2px;height:11px}
body.fr-phone .psig b{display:block;width:3px;background:var(--bone);border-radius:1px}
body.fr-phone .psig b:nth-child(1){height:4px}body.fr-phone .psig b:nth-child(2){height:6px}body.fr-phone .psig b:nth-child(3){height:8px}body.fr-phone .psig b:nth-child(4){height:11px;opacity:.35}
body.fr-phone .pbat{display:inline-block;width:24px;height:12px;border:1.5px solid var(--bone);border-radius:3.5px;padding:1px;position:relative;opacity:.9}
body.fr-phone .pbat::after{content:"";position:absolute;right:-4px;top:3px;width:2px;height:4px;background:var(--bone);border-radius:0 1px 1px 0}
body.fr-phone .pbat i{display:block;height:100%;background:var(--bone);border-radius:1.5px}
body.fr-phone .pbl{font-weight:500;font-size:12px}
body.fr-phone .phd{flex:none;padding:6px 18px 8px}
body.fr-phone .pttl{font-size:30px;font-weight:700;letter-spacing:-.01em}
body.fr-phone .psub{font-size:13px;color:var(--dim);margin-top:1px}
body.fr-phone .pbody{flex:1;overflow-y:auto;overflow-x:hidden;padding:0 16px 16px;-webkit-overflow-scrolling:touch;position:relative}
body.fr-phone .phb{flex:none;height:calc(40px + env(safe-area-inset-bottom));background:none;border:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:5px;padding-top:6px;color:var(--dim);font-size:11px;touch-action:none}
body.fr-phone .phb i{display:block;width:134px;height:5px;border-radius:3px;background:var(--bone);opacity:.35}
body.fr-phone .phb.on i{opacity:1}
body.fr-phone .phb.on{color:var(--bone)}
body.fr-phone .pbanners{position:absolute;z-index:8;top:calc(6px + env(safe-area-inset-top));left:8px;right:8px;display:flex;flex-direction:column;gap:6px;pointer-events:none}
body.fr-phone .pban{display:flex;gap:10px;align-items:flex-start;background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:10px 12px;font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.28);animation:pdrop .35s ease-out}
body.fr-phone .pbic{flex:none;width:34px;height:34px;border-radius:8px;background:var(--rust)}
body.fr-phone .pbh{display:flex;justify-content:space-between;font-size:12px;color:var(--dim);margin-bottom:1px}
body.fr-phone .pbh b{color:var(--bone);font-weight:600}
@keyframes pdrop{from{transform:translateY(-130%)}}
body.fr-phone .plock{position:absolute;left:0;right:0;bottom:0;top:calc(42px + env(safe-area-inset-top));z-index:5;display:flex;flex-direction:column;align-items:center;padding:24px 12px 0;background:var(--bg);touch-action:none;transition:transform .45s ease-in}
body.fr-phone .plock.up{transform:translateY(-105%)}
body.fr-phone .plk{width:14px;height:11px;border:2px solid var(--bone);border-radius:2px;position:relative;margin-bottom:10px}
body.fr-phone .plk::before{content:"";position:absolute;left:1px;top:-9px;width:8px;height:8px;border:2px solid var(--bone);border-bottom:0;border-radius:6px 6px 0 0}
body.fr-phone .pld{font-size:18px;font-weight:500}
body.fr-phone .plt{font-size:84px;font-weight:600;line-height:1;margin:2px 0 18px;letter-spacing:-.02em}
body.fr-phone .pnotes{width:100%;display:flex;flex-direction:column;gap:7px;overflow:hidden;flex:1}
body.fr-phone .pn{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:10px 13px;font-size:14px;animation:pfade .5s ease-out}
body.fr-phone .pn .pbh{margin-bottom:2px}
@keyframes pfade{from{opacity:0;transform:translateY(8px)}}
body.fr-phone .pswipe{flex:none;padding:14px 0 calc(18px + env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:8px;font-size:14px;color:var(--dim);width:100%;background:none;border:0}
body.fr-phone .pswipe i{display:block;width:134px;height:5px;border-radius:3px;background:var(--bone)}
body.fr-phone .plbtns{display:flex;justify-content:space-between;width:100%;padding:0 32px 10px}
body.fr-phone .plbtns span{width:46px;height:46px;border-radius:50%;background:var(--panel);border:1px solid var(--line)}
body.fr-phone .pwid{background:var(--panel);border:1px solid var(--line);border-radius:22px;padding:13px 15px;margin:4px 4px 6px}
body.fr-phone .pwid .pwk{font-size:12px;color:var(--dim);font-weight:600}
body.fr-phone .pwid .pwt{font-size:17px;font-weight:700;margin:3px 0 4px;line-height:1.2}
body.fr-phone .pwid .pws{font-size:13px;color:var(--dim)}
body.fr-phone .pwid .pws b{color:var(--bone);font-weight:600}
body.fr-phone .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 6px;padding:14px 2px 10px}
body.fr-phone .pap{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:0;color:var(--bone);font-size:11.5px;padding:0;min-width:0}
body.fr-phone .pap canvas{width:60px;height:60px;border-radius:14px;border:1px solid var(--line)}
body.fr-phone .pap span{max-width:76px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
body.fr-phone .pbadge{position:absolute;top:-6px;left:50%;margin-left:18px;min-width:22px;height:22px;padding:0 6px;border-radius:11px;background:var(--rust);color:var(--pon);font-size:12.5px;font-weight:700;line-height:22px;text-align:center}
body.fr-phone .pdock{display:flex;justify-content:space-around;background:var(--panel);border:1px solid var(--line);border-radius:28px;padding:12px 6px;margin:8px 4px 0}
body.fr-phone .pdock .pap span{display:none}
body.fr-phone .palert{position:absolute;inset:0;z-index:9;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:28px}
body.fr-phone .pab{background:var(--panel);border:1px solid var(--line);border-radius:16px;width:100%;max-width:290px;text-align:center;overflow:hidden}
body.fr-phone .pat{font-weight:700;font-size:17px;padding:18px 16px 4px}
body.fr-phone .pam{font-size:14px;padding:0 16px 16px;line-height:1.4}
body.fr-phone .pabtns{display:flex;border-top:1px solid var(--line)}
body.fr-phone .pabtns button{flex:1;background:none;border:0;border-radius:0;padding:13px 6px;color:var(--pacc);font-size:16px;font-weight:600}
body.fr-phone .pabtns button+button{border-left:1px solid var(--line);font-weight:400}
body.fr-phone .pcap{font-size:15px;line-height:1.45;margin:12px 2px;min-height:4.4em}
body.fr-phone .pnote{font-size:12.5px;color:var(--dim);margin-top:4px}
body.fr-phone .pcard{background:var(--panel);border:1px solid var(--line);border-radius:14px}
body.fr-phone .pbtn{display:block;width:100%;margin-top:10px;padding:13px;background:var(--rust);color:var(--pon);border:0;font-size:16px;font-weight:600}
body.fr-phone .pbtn.ghost{background:var(--panel);color:var(--bone);border:1px solid var(--line)}
body.fr-phone .pbtn[disabled]{opacity:.4}
/* voicemail */
body.fr-phone .pvm-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-bottom:1px solid var(--line)}
body.fr-phone .pvm-row b{font-size:16px}
body.fr-phone .pvm-wave{display:block;width:100%;height:96px;margin-top:8px;touch-action:none;cursor:ew-resize}
body.fr-phone .pvm-tm{display:flex;justify-content:space-between;font-size:12px;color:var(--dim);margin-top:4px;font-variant-numeric:tabular-nums}
body.fr-phone .pvm-play{width:44px;height:44px;border-radius:50%!important;background:var(--rust);border:0;color:var(--pon);font-size:13px;font-weight:700}
body.fr-phone .pvm-tx{margin-top:12px}
body.fr-phone .pvm-tx p{padding:7px 0;border-bottom:1px solid var(--line);font-size:15px}
body.fr-phone .pvm-tx p.b{color:var(--pacc);font-style:italic}
body.fr-phone .pvm-tx p small{display:block;font-style:normal;font-size:11px;color:var(--dim)}
/* darkroom */
body.fr-phone .pdr{display:block;margin:6px auto 0;border-radius:6px;touch-action:none;border:1px solid var(--line)}
body.fr-phone .pdr-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--dim);margin-top:6px}
/* weather */
body.fr-phone .pwx-top{text-align:center;padding:10px 0 12px;touch-action:none;user-select:none;-webkit-user-select:none;transition:transform .25s ease-out}
body.fr-phone .pwx-pull{text-align:center;font-size:12px;color:var(--dim);height:0;overflow:visible;position:relative;top:-4px}
body.fr-phone .pwx-loc{font-size:22px;font-weight:600}
body.fr-phone .pwx-deg{font-size:66px;font-weight:300;line-height:1.05}
body.fr-phone .pwx-cond{font-size:16px;font-weight:500}
body.fr-phone .pwx-hl{font-size:13px;color:var(--dim);margin-top:2px}
body.fr-phone .pwx-al{border:1px solid var(--rust);border-radius:14px;padding:10px 12px;margin:4px 0 10px}
body.fr-phone .pwx-al b{display:block;color:var(--pacc);font-size:13px;margin-bottom:2px}
body.fr-phone .pwx-det{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
body.fr-phone .pwx-det div{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:9px 11px;font-size:13px}
body.fr-phone .pwx-det small{display:block;color:var(--dim);font-size:11px;font-weight:600}
body.fr-phone .pwx-rad{display:block;width:100%;border-radius:14px;border:1px solid var(--line);margin-bottom:10px}
body.fr-phone .pwx-rm{display:flex;gap:10px;padding:9px 2px;border-bottom:1px solid var(--line);font-size:14px}
body.fr-phone .pwx-rm b{flex:none;width:86px;font-weight:600}
body.fr-phone .pwx-rm.hit{color:var(--pacc)}
/* reminders */
body.fr-phone .prm-h{font-size:13px;font-weight:700;color:var(--dim);margin:14px 2px 4px}
body.fr-phone .prm{display:flex;gap:12px;align-items:flex-start;padding:10px 2px;border-bottom:1px solid var(--line)}
body.fr-phone .prm button{flex:none;width:24px;height:24px;border-radius:50%!important;border:2px solid var(--dim);background:none;padding:0;margin-top:1px}
body.fr-phone .prm.x button{background:var(--rust);border-color:var(--rust)}
body.fr-phone .prm.x .prt{color:var(--dim);text-decoration:line-through}
body.fr-phone .prm .prt{font-size:15.5px}
body.fr-phone .prm small{display:block;font-size:12px;color:var(--pacc);margin-top:2px;text-decoration:none}
body.fr-phone .prm.j .prt{text-decoration:none;color:var(--bone)}
/* seance */
body.fr-phone .pse-th{display:flex;flex-direction:column;gap:7px;padding-bottom:8px}
body.fr-phone .pse-sys{font-size:12px;color:var(--dim);text-align:center;margin:6px 10px}
body.fr-phone .pse-b{max-width:80%;padding:8px 12px;border-radius:18px;font-size:15.5px;animation:pfade .3s ease-out}
body.fr-phone .pse-b.me{align-self:flex-end;background:var(--rust);color:var(--pon)}
body.fr-phone .pse-b.them{align-self:flex-start;background:var(--panel);border:1px solid var(--line)}
body.fr-phone .pse-low{flex:none;border-top:1px solid var(--line);background:var(--panel);padding:8px 6px 4px}
body.fr-phone .pse-in{border:1px solid var(--line);border-radius:18px;padding:7px 12px;min-height:36px;font-size:15.5px;background:var(--bg);margin:0 4px 8px}
body.fr-phone .pse-chips{display:flex;border-bottom:1px solid var(--line);margin-bottom:6px}
body.fr-phone .pse-chips button{flex:1;background:none;border:0;border-radius:0;padding:10px 4px;font-size:16px;color:var(--bone)}
body.fr-phone .pse-chips button.m{font-weight:700}
body.fr-phone .pse-chips button+button{border-left:1px solid var(--line)}
body.fr-phone .pse-kb{display:flex;flex-direction:column;gap:7px;padding:2px 2px 4px;opacity:.55}
body.fr-phone .pse-kb div{display:flex;justify-content:center;gap:5px}
body.fr-phone .pse-kb span{flex:0 0 8.4%;height:38px;border-radius:6px;background:var(--bg);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:15px}
/* contacts */
body.fr-phone .pct{display:flex;align-items:center;gap:12px;padding:9px 10px;margin-bottom:7px;touch-action:none;user-select:none;-webkit-user-select:none;cursor:grab}
body.fr-phone .pct canvas{width:42px;height:42px;border-radius:50%;flex:none}
body.fr-phone .pct b{display:block;font-size:15.5px;font-weight:600}
body.fr-phone .pct small{display:block;font-size:12px;color:var(--dim)}
body.fr-phone .pct.src{opacity:.35}
body.fr-phone .pct.hot{border-color:var(--rust)}
body.fr-phone .pghost{position:fixed;z-index:30;pointer-events:none;width:280px;opacity:.9}
body.fr-phone .pbig{text-align:center;padding:10px 0}
body.fr-phone .pbig canvas{width:120px;height:120px;border-radius:50%}
body.fr-phone .pbig h2{font-family:inherit;font-size:28px;font-weight:700;margin-top:6px}
body.fr-phone .pfld{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);font-size:15px}
body.fr-phone .pfld small{display:block;font-size:12px;color:var(--pacc)}
/* maps */
body.fr-phone .pmap-w{position:relative;margin-top:4px}
body.fr-phone .pmap{display:block;width:100%;border-radius:14px;border:1px solid var(--line);touch-action:none}
body.fr-phone .pmap-z{position:absolute;right:10px;top:10px;display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden}
body.fr-phone .pmap-z button{width:44px;height:44px;background:none;border:0;border-radius:0;font-size:24px;color:var(--bone)}
body.fr-phone .pmap-z button+button{border-top:1px solid var(--line)}
body.fr-phone .pmap-lv{position:absolute;left:10px;top:10px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:5px 9px;font-size:12px;font-weight:600}
/* update */
body.fr-phone .pup-logo{display:block;width:76px;height:76px;margin:6px auto 8px;border-radius:18px;border:1px solid var(--line)}
body.fr-phone .pup-h{text-align:center}
body.fr-phone .pup-h b{display:block;font-size:19px}
body.fr-phone .pup-h small{color:var(--dim);font-size:13px}
body.fr-phone .pup-notes{font-size:14.5px;margin:12px 0}
body.fr-phone .pup-notes li{margin:0 0 7px 18px}
body.fr-phone .pup-bar{height:6px;border-radius:3px;background:var(--line);margin:14px 0 6px;overflow:hidden}
body.fr-phone .pup-bar i{display:block;height:100%;width:0;background:var(--bone);transition:width .4s linear}
body.fr-phone .pf.off .pbody,body.fr-phone .pf.off .psb,body.fr-phone .pf.off .phd,body.fr-phone .pf.off .phb{visibility:hidden}
body.fr-phone .pf.off{background:#000}
body.fr-phone .phello{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);touch-action:none}
body.fr-phone .phello .w{font-size:64px;font-weight:300;min-height:1.3em}
body.fr-phone .pwall{position:absolute;inset:0;z-index:5;overflow:hidden;background:var(--bg)}
body.fr-phone .pwall canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.5}
body.fr-phone .pwall .plock{background:none}
body.fr-phone .pabout{font-size:14.5px}
body.fr-phone .pabout div{display:flex;justify-content:space-between;gap:12px;padding:9px 12px;border-bottom:1px solid var(--line)}
body.fr-phone .pabout span{color:var(--dim);text-align:right}
body.fr-phone .pin{width:100%;margin-top:10px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--bone);font-size:16px;font-family:inherit;outline:none}
`;
const sty=document.createElement("style");sty.textContent=css;document.head.appendChild(sty);

/* ---------- small helpers ---------- */
const clk=()=>{const d=new Date();return((d.getHours()%12)||12)+":"+String(d.getMinutes()).padStart(2,"0")};
const dateLine=()=>new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
const batPct=()=>J.D.batt!=null?J.D.batt:Math.max(8,Math.min(100,S.teeth*3));
const batLabel=()=>J.D.batt!=null?J.D.batt+"%":S.teeth+" teeth";
const fillL=s=>{for(let i=0;i<3;i++){J._miss=0;const t=J.fill(s);if(!J._miss)return t}return J.fill(s.replace(/\{(batt|net|cores|osv|browser|lang)\}/g,"a lot"))};
const nm=()=>S.raw&&!/^je?ff/i.test(S.raw)?S.raw:"Jeff #"+S.no;
const cratio=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)};
const acc=()=>{let k=0,c=J.C.rust;while(cratio(c,J.C.bg)<4.2&&k<0.9){k+=0.1;c=mix(J.C.rust,J.C.bone,k)}return c};
const setOn=()=>{const r=document.documentElement.style;r.setProperty("--pon",on(J.C.rust));r.setProperty("--pacc",acc())};
function fitC(cv,w,h){const d=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(w*d);cv.height=Math.round(h*d);cv.style.width=w+"px";cv.style.height=h+"px";const g=cv.getContext("2d");g.setTransform(d,0,0,d,0,0);return g}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function tooth(g,x,y,s,c){g.save();g.translate(x-16*s,y-16.5*s);g.scale(s,s);g.fillStyle=c;g.beginPath();g.moveTo(9,6);g.lineTo(23,6);g.lineTo(23,18);g.quadraticCurveTo(21,27,19,27);g.quadraticCurveTo(17,27,16,20);g.quadraticCurveTo(15,27,13,27);g.quadraticCurveTo(11,27,9,18);g.closePath();g.fill();g.restore()}
const speak=(t,o)=>{try{speechSynthesis.cancel()}catch(e){}J.say(t,o)};

/* ---------- the shell every phone screen lives in ---------- */
function shell(st,o){
  o=o||{};setOn();
  const pf=el("div","pf"+(o.cls?" "+o.cls:""));st.appendChild(pf);
  const sb=el("div","psb"),tm=txt("span","ptime",clk()),rt=el("span","pst");
  rt.appendChild(el("i","psig","<b></b><b></b><b></b><b></b>"));rt.appendChild(txt("span","pcar","Jeff"));
  const bl=txt("span","pbl",batLabel()),bat=el("span","pbat"),fi=el("i");bat.appendChild(fi);fi.style.width=batPct()+"%";rt.appendChild(bl);rt.appendChild(bat);
  sb.appendChild(tm);sb.appendChild(rt);pf.appendChild(sb);
  J.every(5000,()=>{tm.textContent=clk();bl.textContent=batLabel();fi.style.width=batPct()+"%"});
  const bn=el("div","pbanners");pf.appendChild(bn);
  if(o.title){const hd=el("div","phd");hd.appendChild(txt("div","pttl",o.title));if(o.sub)hd.appendChild(txt("div","psub",fillL(o.sub)));pf.appendChild(hd)}
  const body=el("div","pbody");pf.appendChild(body);
  const hb=el("button","phb");hb.type="button";hb.setAttribute("aria-label","home");hb.appendChild(el("i"));const hint=txt("span","",o.hint||"");hb.appendChild(hint);pf.appendChild(hb);
  return{pf:pf,body:body,hb:hb,hint:hint,bn:bn};
}
function banner(text,head){
  const bn=document.querySelector("body.fr-phone .pbanners");if(!bn)return false;
  const b=el("div","pban");b.appendChild(el("i","pbic"));const w=el("div");const h=el("div","pbh");h.appendChild(txt("b","",head||"Jeffbook"));h.appendChild(txt("span","","now"));
  w.appendChild(h);w.appendChild(txt("div","",text));b.appendChild(w);bn.appendChild(b);
  A.blip(1320,0.06,"sine",0.06);A.blip(1760,0.09,"sine",0.05,null,0.07);if(S.t0)J.buzz(20);
  setTimeout(()=>b.remove(),5200);return true;
}
function alertBox(P,title,msg,btns){
  return new Promise(res=>{
    const ov=el("div","palert"),bx=el("div","pab");ov.appendChild(bx);bx.appendChild(txt("div","pat",title));bx.appendChild(txt("div","pam",fillL(msg)));
    const row=el("div","pabtns");bx.appendChild(row);
    (btns||["OK"]).forEach((b,i)=>{const x=txt("button","",b);x.type="button";if(i===0){x.dataset.act="tap";x.dataset.pri="9"}row.appendChild(x);x.addEventListener("click",()=>{A.click();ov.remove();res(i)})});
    P.pf.appendChild(ov);A.pop();
  });
}

/* ---------- icons, drawn, no emoji ---------- */
function icon(kind,done){
  const cv=document.createElement("canvas");cv.width=cv.height=120;const g=cv.getContext("2d");
  const BG={vm:J.C.rust,dr:J.C.dried,wx:J.C.bile,rm:J.C.panel,se:J.C.dried,ct:J.C.line,mp:J.C.bile,st:J.C.dim,calc:J.C.panel,clock:J.C.bg,notes:J.C.panel,health:J.C.panel,wallet:J.C.line,phone:J.C.bile,msg:J.C.bile,jb:J.C.rust,cam:J.C.dim};
  const bg=done?J.C.rust:(BG[kind]||J.C.panel),fg=on(bg);
  g.fillStyle=bg;g.fillRect(0,0,120,120);g.strokeStyle=fg;g.fillStyle=fg;g.lineWidth=7;g.lineCap="round";g.lineJoin="round";
  if(done){tooth(g,60,62,2.6,fg);return cv}
  const P=()=>g.beginPath();
  switch(kind){
    case"vm":P();g.arc(38,62,15,0,7);g.stroke();P();g.arc(82,62,15,0,7);g.stroke();P();g.moveTo(38,77);g.lineTo(82,77);g.stroke();break;
    case"dr":P();g.arc(60,60,34,0,7);g.stroke();for(let i=0;i<6;i++){const a=i*Math.PI/3;P();g.moveTo(60+Math.cos(a)*34,60+Math.sin(a)*34);g.lineTo(60+Math.cos(a+2.1)*14,60+Math.sin(a+2.1)*14);g.lineWidth=5;g.stroke()}break;
    case"wx":P();g.arc(46,52,16,0,7);g.arc(66,46,20,0,7);g.arc(84,56,14,0,7);g.fill();g.fillRect(36,54,58,16);tooth(g,60,92,1.05,fg);break;
    case"rm":for(let i=0;i<3;i++){P();g.lineWidth=5;g.arc(32,36+i*24,7,0,7);g.stroke();P();g.lineWidth=7;g.moveTo(50,36+i*24);g.lineTo(94,36+i*24);g.stroke()}break;
    case"se":P();g.moveTo(60,22);g.bezierCurveTo(98,40,96,84,60,98);g.bezierCurveTo(24,84,22,40,60,22);g.fill();g.fillStyle=bg;P();g.arc(60,52,11,0,7);g.fill();break;
    case"ct":P();g.arc(60,46,17,0,7);g.fill();P();g.arc(60,100,32,Math.PI,0);g.fill();break;
    case"mp":g.lineWidth=5;P();g.moveTo(22,34);g.lineTo(46,26);g.lineTo(74,36);g.lineTo(98,28);g.lineTo(98,90);g.lineTo(74,98);g.lineTo(46,88);g.lineTo(22,96);g.closePath();g.stroke();P();g.moveTo(46,26);g.lineTo(46,88);g.moveTo(74,36);g.lineTo(74,98);g.stroke();P();g.arc(60,52,12,Math.PI,0);g.lineTo(60,76);g.closePath();g.fill();break;
    case"st":P();g.arc(60,60,24,0,7);g.lineWidth=8;g.stroke();for(let i=0;i<8;i++){g.save();g.translate(60,60);g.rotate(i*Math.PI/4);tooth(g,0,-38,0.7,fg);g.restore()}break;
    case"calc":for(let i=0;i<4;i++){g.lineWidth=2;rr(g,24+(i%2)*38,24+Math.floor(i/2)*38,34,34,6);g.stroke()}g.font="bold 26px sans-serif";g.textAlign="center";["+","-","x","="].forEach((s,i)=>g.fillText(s,41+(i%2)*38,50+Math.floor(i/2)*38));break;
    case"clock":P();g.arc(60,60,36,0,7);g.lineWidth=5;g.stroke();P();g.moveTo(60,60);g.lineTo(60,34);g.moveTo(60,60);g.lineTo(78,70);g.stroke();break;
    case"notes":g.lineWidth=5;for(let i=0;i<4;i++){P();g.moveTo(28,36+i*16);g.lineTo(i===3?70:92,36+i*16);g.stroke()}break;
    case"health":P();g.moveTo(60,92);g.bezierCurveTo(20,64,26,28,60,46);g.bezierCurveTo(94,28,100,64,60,92);g.fill();break;
    case"wallet":for(let i=0;i<3;i++){g.lineWidth=4;rr(g,24,30+i*14,72,44,8);g.fillStyle=i===2?fg:bg;g.fill();g.stroke()}break;
    case"phone":g.lineWidth=12;P();g.arc(60,60,30,Math.PI*0.75,Math.PI*1.25,false);g.stroke();P();g.arc(60,60,30,Math.PI*1.75,Math.PI*2.25,false);g.stroke();g.lineWidth=7;P();g.arc(60,60,30,Math.PI*1.2,Math.PI*1.8);g.stroke();break;
    case"msg":P();g.ellipse(60,56,36,28,0,0,7);g.fill();P();g.moveTo(36,72);g.lineTo(28,94);g.lineTo(52,80);g.fill();break;
    case"jb":tooth(g,60,62,2.5,fg);break;
    case"cam":g.lineWidth=5;rr(g,22,38,76,50,10);g.stroke();P();g.arc(60,63,15,0,7);g.stroke();g.fillRect(44,30,32,10);break;
  }
  return cv;
}

/* ---------- copy ---------- */
const APPS=[
  {id:"p-voicemail",name:"Voicemail",ic:"vm",badge:"1",done:"Heard"},
  {id:"p-darkroom",name:"Darkroom",ic:"dr",badge:"3",done:"Exposed"},
  {id:"p-weather",name:"Weather",ic:"wx",badge:"!",done:"Inside"},
  {id:"p-reminders",name:"Reminders",ic:"rm",badge:"6",done:"Done"},
  {id:"p-seance",name:"Predict",ic:"se",badge:"4",done:"Quiet"},
  {id:"p-contacts",name:"Contacts",ic:"ct",badge:"1,204",done:"Jeff"},
  {id:"p-maps",name:"Maps",ic:"mp",badge:"9",done:"Lap 2"},
  {id:"settings",name:"Settings",ic:"st"},
  {name:"Calculator",ic:"calc",msg:"Calculator does one sum now. 1 + 1 = Jeff. We checked it. We checked it a lot. It holds up."},
  {name:"Clock",ic:"clock",msg:"Alarms: 3:00 am (him). 3:01 am (him, closer). 3:02 am (you, from somewhere else in the house)."},
  {name:"Notes",ic:"notes",msg:"1 note, created tonight, not by you: 'he opened Notes. good. now look up from the phone. no, further.'"},
  {name:"Health",ic:"health",msg:"Steps today: 2,014. Steps behind you today: 2,014, perfectly in time. Resting heart rate: two of them."},
  {name:"Wallet",ic:"wallet",msg:"Balance: {teeth} teeth. Pending: 1 tooth, still clearing. Do not spend the pending one. It's still attached."}
];
const DOCK=[{name:"Phone",ic:"phone",msg:"Recents: you (missed). you (missed). you (11 hrs 11 min, incoming, still connected)."},{name:"Messages",ic:"msg",msg:"Messages moved into the other apps. Everything moved into the other apps. This one is just a little room now."},
  {name:"Jeffbook",ic:"jb",msg:"Jeffbook isn't an app on your phone anymore. Your phone is an app on Jeffbook. Same icon. Bigger inside."},{name:"Camera",ic:"cam",msg:"Camera is in use by another app. The other app is pointing it at the ceiling. Please don't look at the ceiling. It's shy."}];
const AFTER={
  "p-voicemail":"Voicemail: the house called back. It didn't leave a message. It just let you listen to the hallway for a bit.",
  "p-darkroom":"Darkroom: 3 photos added to Recents. None taken by you. One is still being taken. Hold still.",
  "p-weather":"Weather: conditions in the room you're in have been upgraded from 'occupied' to 'extremely occupied'.",
  "p-reminders":"Reminders: Jeff completed 'be you today'. Great work, team. Big team.",
  "p-seance":"Keyboard: a new word was added to your dictionary. It's been suggesting it under its breath.",
  "p-contacts":"Contacts: you have 1 contact. He's lying across the whole list like it's a couch.",
  "p-maps":"Maps: you have arrived. You've been arriving for years. Pace yourself."
};
const NOTYET=["Not yet. It isn't finished with you.","The home bar is warm. Somebody else is holding it.","Home is busy. Try again when it stops breathing.","Nope. This app has more for you. It insists."];
J.DID=Object.assign(J.DID||{},{"p-voicemail":"listened to his own house leave a voicemail","p-darkroom":"developed three photos of the back of his own head",
  "p-weather":"checked the weather inside his own house","p-reminders":"let somebody else finish his to-do list","p-seance":"held a seance through his keyboard",
  "p-contacts":"merged everyone he knows into one Jeff","p-maps":"zoomed into one of his own teeth until he found a city"});

J.frame(F,{hub:"p-home",end:"p-update",units:UNITS,label:"your phone",onEnter:()=>{setOn();J.toastHook=t=>banner(t)}});

/* ---------- a unit is an app ---------- */
function app(id,title,sub,build){
  J.scene(id,(st,arg)=>{
    const P=shell(st,{title:title,sub:sub,cls:"papp"});let ready=false,y0=null;
    const go=()=>{if(!ready){P.hint.textContent=J.pick(NOTYET);A.click();return}A.pop();J.unitDone(id)};
    P.hb.addEventListener("click",go);
    P.hb.addEventListener("pointerdown",e=>{y0=e.clientY});P.hb.addEventListener("pointerup",e=>{if(y0!=null&&y0-e.clientY>30)go();y0=null});
    P.done=h=>{if(ready)return;ready=true;P.body.querySelectorAll("[data-act]").forEach(e=>e.removeAttribute("data-act"));
      P.hb.classList.add("on");P.hb.dataset.act="tap";P.hb.dataset.pri="5";P.hint.textContent=h||"swipe up to go home"};
    build(P,arg||{});
  });
}

/* ---------- hub: lock screen, home screen ---------- */
J.scene("p-home",(st,arg)=>{
  arg=arg||{};J.toastHook=t=>banner(t);
  const P=shell(st,{hint:""});
  if(arg.first&&!arg.back)return lockScreen(P);
  if(arg.enter&&!arg.back)return arrive(P);
  home(P,arg);
});
function lockScreen(P){
  const lk=el("div","plock");P.pf.appendChild(lk);
  lk.appendChild(el("div","plk"));lk.appendChild(txt("div","pld",dateLine()));const lt=txt("div","plt",clk());lk.appendChild(lt);J.every(5000,()=>{lt.textContent=clk()});
  const ns=el("div","pnotes");lk.appendChild(ns);
  const did=J.lastDidYou(),ag=J.ago(Date.now()-((S.prev&&S.prev.last)||Date.now()-3.6e6));
  const N=[
    ["Jeffbook",ag+" ago",did.length?"Last time you "+did[0]+". The group has been talking about it in a voice you'd recognize.":"Last time you were in the group. You don't remember it. That is normal. That is the group."],
    ["Jeffbook",ag+" ago",did.length>2?"You also "+did[1]+" and "+did[2]+". Someone framed it. The frame is your phone.":"We kept the seat you sat in. It still has the shape of you. It's a little bigger now."],
    ["Messages","now","Jeff: hey. we moved."],
    ["Messages","now",fillL("Jeff: into your {model}. it's nicer than the group. it has a flashlight. we've been using it to look at you.")],
    ["Reminders","now","Reminder: you are Jeff #"+S.no+". Added by: not you."]
  ];
  N.forEach((n,i)=>J.after(500+i*850,()=>{const d=el("div","pn");const h=el("div","pbh");h.appendChild(txt("b","",n[0]));h.appendChild(txt("span","",n[1]));d.appendChild(h);d.appendChild(txt("div","",n[2]));ns.appendChild(d);A.blip(1320,0.05,"sine",0.05)}));
  const lb=el("div","plbtns");lb.appendChild(el("span"));lb.appendChild(el("span"));lk.appendChild(lb);
  const sw=el("button","pswipe");sw.type="button";sw.appendChild(txt("span","","swipe up to open"));sw.appendChild(el("i"));lk.appendChild(sw);
  lk.dataset.act="swipe:up";lk.dataset.at="0.5,0.8";
  let y0=null,taps=0,gone=false;
  const unlock=()=>{if(gone)return;gone=true;lk.removeAttribute("data-act");J.start();A.thump();lk.classList.add("up");
    const fc=el("div","palert");const bx=el("div","pab");fc.appendChild(bx);const av=J.avatar(S.face,120,0.35);av.style.cssText="width:64px;height:64px;border-radius:50%;margin:18px auto 0;display:block";bx.appendChild(av);
    const t=txt("div","pat","Face ID");bx.appendChild(t);const m=txt("div","pam","Looking for your face.");bx.appendChild(m);P.pf.appendChild(fc);
    J.after(1500,()=>{m.textContent="Face not recognized. Unlocking with Jeff's face instead. It's on file. It's the one you picked.";A.click()});
    J.after(4400,()=>{fc.remove();lk.remove();home(P,{welcome:true})});
  };
  lk.addEventListener("pointerdown",e=>{J.start();y0=e.clientY});
  window.addEventListener("pointerup",function f(e){if(!document.body.contains(lk)){window.removeEventListener("pointerup",f);return}if(y0!=null&&y0-e.clientY>50)unlock();y0=null});
  sw.addEventListener("click",()=>{taps++;if(taps>=2)unlock();else sw.firstChild.textContent="swipe up. or tap that again. we're not fussy."});
}
function arrive(P){
  home(P,{});
  alertBox(P,"Your phone woke up by itself","The screen came on in your hand. Nobody touched it. The group is on your home screen now. It brought a few apps and a smell.",["OK"]);
}
function home(P,arg){
  const left=J.left(F),inPlan=new Set(S.plan.filter(x=>x.f===F).map(x=>x.u)),allDone=!J.undone().length;
  P.body.innerHTML="";
  const w=el("div","pwid");w.appendChild(txt("div","pwk","Jeffbook"));w.appendChild(txt("div","pwt",J.draw("title",J.TITLES)));
  const ws=el("div","pws");ws.innerHTML="<b></b> members, all of them on this phone";ws.querySelector("b").textContent=J.mem.toLocaleString("en-US");w.appendChild(ws);
  if(!S.run.some(u=>UNITS.indexOf(u)>=0))w.appendChild(txt("div","pws","Storage almost full: 1,204 Jeffs. Manage storage? You can't. They're load-bearing."));P.body.appendChild(w);
  const grid=el("div","pgrid");P.body.appendChild(grid);let firstLeft=null,settingsBtn=null;
  const mk=(a,parent)=>{
    const done=a.id&&S.run.indexOf(a.id)>=0,b=el("button","pap");b.type="button";b.appendChild(icon(a.ic,done));b.appendChild(txt("span","",done&&a.done?a.done:a.name));parent.appendChild(b);
    if(a.id&&left.indexOf(a.id)>=0){b.appendChild(txt("span","pbadge",a.badge||"1"));if(!firstLeft||left.indexOf(a.id)<left.indexOf(firstLeft._id)){firstLeft=b;b._id=a.id}}
    if(a.id==="settings")settingsBtn=b;
    b.addEventListener("click",()=>{A.click();
      if(a.id==="settings"){if(!left.length)return leave();return alertBox(P,"Settings","General > About > Owner: Jeff. Nothing else to change in here. Try the apps with the numbers on them.")}
      if(a.id){if(left.indexOf(a.id)>=0)return J.go(a.id);if(done)return alertBox(P,a.done,AFTER[a.id]);if(!inPlan.has(a.id))return alertBox(P,a.name,"Nobody's in this one tonight. They're all in the other ones. It's very clean in here. That's worse.")}
      alertBox(P,a.name,a.msg||"Nothing in here. Not anymore.");
    });
    return b;
  };
  APPS.forEach(a=>mk(a,grid));
  const dock=el("div","pdock");P.body.appendChild(dock);DOCK.forEach(a=>mk(a,dock));
  const leave=()=>{
    if(allDone)return J.next();
    alertBox(P,"Jeffbook wants to leave your phone","It's going somewhere bigger. It'll take the warm part of the phone with it. Let it.",["let it go"]).then(()=>J.next());
  };
  const point=()=>{
    if(left.length){if(firstLeft){firstLeft.dataset.act="tap";firstLeft.dataset.pri="2"}return}
    if(allDone){settingsBtn.appendChild(txt("span","pbadge","1"));settingsBtn.dataset.act="tap";settingsBtn.dataset.pri="2";
      J.after(700,()=>banner(fillL("Software Update: JeffOS 32."+(S.teeth+1)+" is ready to install. It's in Settings. It's been in Settings for a while, standing very still."),"Settings"))}
    else{settingsBtn.dataset.act="tap";settingsBtn.dataset.pri="2";J.after(600,leave)}
  };
  if(arg.welcome){
    alertBox(P,"Welcome home",fillL("While you were gone, the group moved into your {model}. We kept your apps. We moved in behind them. Open the ones with red numbers. The number is how many of us are inside."),["OK"]).then(point);
  }else{
    if(arg.back&&AFTER[arg.back])J.after(500,()=>banner(AFTER[arg.back],APPS.find(a=>a.id===arg.back).name));
    point();
  }
}

/* ---------- 1. voicemail: scrub ---------- */
const VMF=["hi. it's me. i'm at your place. don't worry. i let myself in the way you let yourself into groups.",
  "i'm in your hallway. your hallway is longer from the inside. nobody tells you that when you sign the lease.",
  "i can hear you listening to this. you breathe like a guy with {teeth} teeth. it's a very specific sound. wet consonants.",
  "(eleven seconds of something heavy being arranged very neatly)",
  "ok. i put something in the drawer. the drawer you never use. you're going to use it now. you're going to use it a lot.",
  "call me back. you can't. it's your own number. that's the beauty of it. bye. bye. i'm still here. bye."];
const VMB=["he's gone. he always says he's going. he leaves the way a smell leaves.",
  "hi. hello, "+"{who}"+". this is the house. i don't usually take calls. i don't have a mouth. i'm using his.",
  "the drawer is fine. there's nothing in the drawer. there's something UNDER the drawer. different department.",
  "you left the bathroom tap dripping in 2019 and i've been counting every drop since. we're at a big number. i'm proud of it.",
  "don't call him back. press delete. i'll handle him. i have a basement. you've never asked what the basement is for."];
app("p-voicemail","Voicemail","1 new message",(P)=>{
  const row=el("div","pvm-row pcard");const l=el("div");l.appendChild(txt("b","",nm()==="Jeff #"+S.no?"Jeff (Home)":"Jeff ("+S.raw+"'s home)"));l.appendChild(txt("div","pnote","your home number. 11 hrs 11 min. Transcription (beta)"));row.appendChild(l);
  const pl=txt("button","pvm-play","play");pl.type="button";row.appendChild(pl);P.body.appendChild(row);
  const cv=el("canvas","pvm-wave");P.body.appendChild(cv);const W=Math.min(448,P.body.clientWidth-34||380),H=96;const g=fitC(cv,W,H);
  const tmr=el("div","pvm-tm");const tl=txt("span","","0:00:00"),tr=txt("span","","-11:11:00");tmr.appendChild(tl);tmr.appendChild(tr);P.body.appendChild(tmr);
  const cap=txt("div","pcap","Drag along the message to scrub it. The transcript fills in under the playhead.");P.body.appendChild(cap);
  const tx=el("div","pvm-tx");P.body.appendChild(tx);
  const bars=[];for(let i=0;i<96;i++){const e=Math.sin(i/95*Math.PI)*0.6+0.35;bars.push(Math.max(0.08,Math.min(1,e*(0.35+0.65*Math.abs(Math.sin(i*1.7)*Math.cos(i*0.31))))))}
  let p=0,target=null,playing=false,phase=0,maxP=0,minP=1,fi=0,bi=0,dragging=false,lastBl=0,fin=false;
  const who=S.raw&&!/^je?ff/i.test(S.raw)?S.raw:"whoever is holding this";
  const fmt=v=>{const s=Math.round(v*40260);return Math.floor(s/3600)+":"+String(Math.floor(s/60)%60).padStart(2,"0")+":"+String(s%60).padStart(2,"0")};
  const addLine=(t,b)=>{const pp=el("p",b?"b":"");if(b)pp.appendChild(txt("small","","the other voice"));pp.appendChild(document.createTextNode(fillL(t.replace("{who}",who))));tx.insertBefore(pp,tx.firstChild);A.pop();
    speak(fillL(t.replace("{who}",who)).replace(/\(.*?\)/g,""),b?{pitch:0.05,rate:0.62}:{pitch:0.9,rate:0.95})};
  const pos=e=>{const r=cv.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))};
  cv.addEventListener("pointerdown",e=>{e.preventDefault();dragging=true;target=pos(e);try{cv.setPointerCapture(e.pointerId)}catch(x){}});
  cv.addEventListener("pointermove",e=>{if(dragging)target=pos(e)});
  const up=()=>{dragging=false;target=null};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  pl.addEventListener("click",()=>{playing=!playing;pl.textContent=playing?"pause":(phase?"back":"play");A.click()});
  cv.dataset.act="drag:"+Math.round(W*1.02)+",0,1500";cv.dataset.at="0.01,0.5";
  J.raf((t,dt)=>{
    if(fin)return;
    if(target!=null){const d=target-p,mx=0.4*dt;p+=Math.max(-mx,Math.min(mx,d))}
    else if(playing)p=Math.max(0,Math.min(1,p+(phase?-1:1)*dt/34));
    if(phase===0){maxP=Math.max(maxP,p);while(fi<VMF.length&&maxP>=(fi+0.4)/VMF.length*0.95){addLine(VMF[fi],false);fi++}
      if(fi>=VMF.length&&maxP>=0.955){phase=1;minP=1;playing=false;pl.textContent="back";cap.textContent="End of message. There's a second track under it. Drag back the other way. Something answers when you do.";A.thump();J.cut("BACK",90);
        cv.dataset.act="drag:"+(-Math.round(W*1.02))+",0,1500";cv.dataset.at="0.99,0.5"}}
    else{minP=Math.min(minP,p);while(bi<VMB.length&&minP<=1-(bi+0.4)/VMB.length*0.95){addLine(VMB[bi],true);bi++}
      if(bi>=VMB.length&&minP<=0.045){fin=true;playing=false;finish()}}
    if(Math.abs(p-lastBl)>0.012){lastBl=p;A.blip(140+bars[Math.floor(p*95)]*500,0.03,phase?"sawtooth":"triangle",0.04)}
    tl.textContent=fmt(p);tr.textContent="-"+fmt(1-p);
    g.clearRect(0,0,W,H);const bw=W/bars.length;
    bars.forEach((b,i)=>{const x=i*bw,h=b*H*0.86,k=i/bars.length;g.fillStyle=phase===0?(k<=maxP?J.C.rust:J.C.dim):(k>=minP?J.C.bile:J.C.rust);g.globalAlpha=0.9;g.fillRect(x+bw*0.18,(H-h)/2,bw*0.64,h)});
    g.globalAlpha=1;g.fillStyle=J.C.bone;g.fillRect(p*W-1.5,0,3,H);
  });
  function finish(){
    cv.removeAttribute("data-act");
    cap.textContent="Both tracks played. The house would like you to delete the first one. You don't have to. It's your phone. It's mostly your phone.";
    const d=txt("button","pbtn","delete his message"),k=txt("button","pbtn ghost","keep it");d.type=k.type="button";d.dataset.act="tap";d.dataset.pri="3";P.body.insertBefore(k,tx);P.body.insertBefore(d,k);
    const pickd=del=>{d.remove();k.remove();A.thump();
      cap.textContent=del?"Deleted. The house says thank you. It says it through the vents, very quietly, about forty times.":"Kept. Saved to Voicemail. The house would like it noted that it asked nicely, and that it has a basement.";
      P.done()};
    d.addEventListener("click",()=>pickd(true));k.addEventListener("click",()=>pickd(false));
  }
});

/* ---------- 2. darkroom: rub ---------- */
const DRP=[
  {cap:[[0,"Darkroom. One roll, still developing. Photos develop faster with body heat. Rub the screen."],[0.2,"It's a room. Low light. Someone is sitting very still in the middle of it."],[0.5,"That's a phone in their hands. The screen is the only light in the room. It's lighting them from underneath like a campfire story."],[0.8,"That's you. That's the back of your head. This was taken tonight, from inside the room you are in right now. About four feet behind the chair."]],
    end:"Saved to Recents. Location: about four feet behind you. Camera: unknown. In the photographer field it just says 'yes'."},
  {cap:[[0,"Two more on the roll. Rub."],[0.3,"Same angle. Closer. Whoever took it stepped in between photos and you didn't hear the floor."],[0.75,"That's a hand coming into frame. It's about to tap you on the shoulder. Don't check your shoulder. The photo is from a minute ago. It already did, and you thought it was your hoodie."]],
    end:"Saved. The hand is a little out of focus. It moves faster than the shutter. It has practiced."},
  {cap:[[0,"Last one. This one is warm already. Rub."],[0.35,"Your screen, over your shoulder. There's something reflected in the glass."],[0.75,"That's the photographer, reflected in your phone. He's smiling. He has the good teeth. He got them off the roll before yours."]],
    end:"Roll complete. 3 photos. 0 of them were taken by you. All of them are of you. That's a ratio."}
];
app("p-darkroom","Darkroom","Developing: 1 roll, 3 exposures",(P)=>{
  const W=Math.min(440,(P.body.clientWidth||380)-34),H=Math.round(Math.min(window.innerHeight*0.46,W*1.12));
  const cv=el("canvas","pdr");P.body.appendChild(cv);const g=fitC(cv,W,H);
  const meta=el("div","pdr-meta");const ml=txt("span","","exposure 1 of 3"),mr=txt("span","","0% developed");meta.appendChild(ml);meta.appendChild(mr);P.body.appendChild(meta);
  const cap=txt("div","pcap","");P.body.appendChild(cap);
  const ph=document.createElement("canvas"),mk=document.createElement("canvas"),sm=document.createElement("canvas");ph.width=mk.width=W;ph.height=mk.height=H;sm.width=36;sm.height=40;
  const pg=ph.getContext("2d"),mg=mk.getContext("2d"),sg=sm.getContext("2d");
  let k=0,rev=0,ci=0,t0=0,busy=false,down=false,last=null;
  const draw=i=>{
    pg.fillStyle=tone(0.3);pg.fillRect(0,0,W,H);
    const fl=H*0.78;pg.fillStyle=tone(0.18);pg.fillRect(0,fl,W,H-fl);
    pg.fillStyle=tone(0.08);pg.fillRect(W*0.72,H*0.12,W*0.2,fl-H*0.12);pg.fillStyle=tone(0.42);pg.fillRect(W*0.08,H*0.16,W*0.18,H*0.22);pg.fillStyle=tone(0.25);pg.fillRect(W*0.1,H*0.18,W*0.14,H*0.18);
    const sc=i===0?1:i===1?1.7:2.4,cx=W*0.5,base=i===2?H*1.25:H*(i===0?0.98:1.15),hr=W*0.11*sc;
    if(i<2){const gl=pg.createRadialGradient(cx,base-hr*4.2,2,cx,base-hr*4.2,hr*3.4);gl.addColorStop(0,tone(0.7));gl.addColorStop(1,tone(0.3));pg.globalAlpha=0.6;pg.fillStyle=gl;pg.beginPath();pg.arc(cx,base-hr*4.2,hr*3.4,0,7);pg.fill();pg.globalAlpha=1;
      pg.fillStyle=tone(0.05);pg.beginPath();pg.ellipse(cx,base-hr*3.1,hr*1.05,hr*1.2,0,0,7);pg.fill();pg.beginPath();pg.moveTo(cx-hr*2.6,base);pg.quadraticCurveTo(cx-hr*2.4,base-hr*2.2,cx-hr*0.6,base-hr*2.1);pg.lineTo(cx+hr*0.6,base-hr*2.1);pg.quadraticCurveTo(cx+hr*2.4,base-hr*2.2,cx+hr*2.6,base);pg.fill();
      pg.strokeStyle=tone(0.55);pg.lineWidth=2;pg.beginPath();pg.ellipse(cx,base-hr*3.1,hr*1.05,hr*1.2,0,3.6,5.8);pg.stroke();
      pg.strokeStyle=tone(0.12);pg.lineWidth=1;for(let j=0;j<40;j++){const a=-2.6+j*0.13;pg.beginPath();pg.moveTo(cx+Math.cos(a)*hr*0.2,base-hr*3.1+Math.sin(a)*hr*0.2);pg.lineTo(cx+Math.cos(a)*hr*1.02,base-hr*3.1+Math.sin(a)*hr*1.15);pg.stroke()}

      if(i===1){pg.save();pg.translate(W*0.02,H*0.02);pg.rotate(-0.62);pg.fillStyle=tone(0.88);pg.strokeStyle=tone(0.1);pg.lineWidth=2;
        for(let f=0;f<4;f++){rr(pg,W*0.02+f*W*0.058,H*0.16,W*0.05,H*(0.2+[0.02,0.06,0.05,0][f]),W*0.025);pg.fill();pg.stroke()}
        rr(pg,0,-H*0.1,W*0.25,H*0.3,W*0.06);pg.fill();pg.stroke();pg.restore()}}
    else{pg.fillStyle=tone(0.04);pg.fillRect(0,0,W,H);pg.fillStyle=tone(0.12);rr(pg,W*0.2,H*0.12,W*0.6,H*0.8,W*0.07);pg.fill();pg.fillStyle=tone(0.2);rr(pg,W*0.23,H*0.16,W*0.54,H*0.72,W*0.05);pg.fill();
      const f=document.createElement("canvas");f.width=f.height=240;J.face(f,S.face,0.85,{open:0.55,bg:"rgba(0,0,0,0)"});pg.globalAlpha=0.55;pg.drawImage(f,W*0.27,H*0.26,W*0.46,W*0.46);pg.globalAlpha=1;
      pg.fillStyle=tone(0.06);pg.beginPath();pg.ellipse(W*0.08,H*1.02,W*0.4,H*0.22,0,0,7);pg.fill()}
    for(let j=0;j<1400;j++){pg.fillStyle="rgba(128,128,128,"+(Math.random()*0.08).toFixed(3)+")";pg.fillRect(Math.random()*W,Math.random()*H,1.5,1.5)}
    mg.globalCompositeOperation="source-over";mg.fillStyle=J.C.dried;mg.fillRect(0,0,W,H);mg.fillStyle=J.C.panel;for(let j=0;j<400;j++){mg.globalAlpha=0.25;mg.fillRect(Math.random()*W,Math.random()*H,3,3)}mg.globalAlpha=1;
  };
  const start=i=>{k=i;rev=0;ci=0;t0=performance.now();busy=false;draw(i);ml.textContent="exposure "+(i+1)+" of 3";cap.textContent=DRP[i].cap[0][1];cv.dataset.act="rub:800"};
  const rub=(x,y)=>{mg.globalCompositeOperation="destination-out";const r=Math.max(26,W*0.075),gr=mg.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,"rgba(0,0,0,.55)");gr.addColorStop(1,"rgba(0,0,0,0)");mg.fillStyle=gr;mg.beginPath();mg.arc(x,y,r,0,7);mg.fill()};
  const pt=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]};
  cv.addEventListener("pointerdown",e=>{e.preventDefault();down=true;last=pt(e);rub(last[0],last[1]);try{cv.setPointerCapture(e.pointerId)}catch(x){}});
  cv.addEventListener("pointermove",e=>{if(!down&&e.pointerType!=="touch")return;const q=pt(e);if(last){const n=Math.ceil(Math.hypot(q[0]-last[0],q[1]-last[1])/8);for(let j=1;j<=n;j++)rub(last[0]+(q[0]-last[0])*j/n,last[1]+(q[1]-last[1])*j/n)}last=q;if(Math.random()<0.15)A.blip(90+Math.random()*60,0.05,"triangle",0.03)});
  const up=()=>{down=false;last=null};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  J.every(350,()=>{if(busy)return;
    if(performance.now()-t0>12000){mg.globalCompositeOperation="destination-out";mg.fillStyle="rgba(0,0,0,.08)";mg.fillRect(0,0,W,H)}
    sg.clearRect(0,0,36,40);sg.drawImage(mk,0,0,36,40);const d=sg.getImageData(0,0,36,40).data;let c=0;for(let j=3;j<d.length;j+=4)if(d[j]<110)c++;rev=c/(36*40);
    mr.textContent=Math.round(Math.min(1,rev/0.9)*100)+"% developed";
    const cs=DRP[k].cap;while(ci+1<cs.length&&rev>=cs[ci+1][0]){ci++;cap.textContent=fillL(cs[ci][1]);A.thump();if(k===0&&ci===3)J.cut("BEHIND",90)}
    if(rev>=0.88&&ci>=cs.length-1){busy=true;cv.removeAttribute("data-act");mg.globalCompositeOperation="destination-out";mg.fillStyle="#000";mg.fillRect(0,0,W,H);cap.textContent=DRP[k].end;A.crunch();
      J.after(4200,()=>{if(k<2)start(k+1);else last3()})}
  });
  J.raf(()=>{g.clearRect(0,0,W,H);g.drawImage(ph,0,0);g.drawImage(mk,0,0)});
  const last3=()=>{
    cap.textContent="Share the roll to the group? It's optional. Nobody has to see the back of your head.";
    const s=txt("button","pbtn","share to the group"),n=txt("button","pbtn ghost","don't share");s.type=n.type="button";s.dataset.act="tap";P.body.appendChild(s);P.body.appendChild(n);
    const ch=sh=>{s.remove();n.remove();A.thump();cap.textContent=sh?J.mem.toLocaleString("en-US")+" Jeffs reacted to your roll with 'behind you'. Three of them asked who the photographer was. He reacted to that too.":"Not shared. Good call. The roll stays on the phone. The photographer has his own copy. Photographers always do.";S.memo.roll=sh?"shared":"kept";P.done()};
    s.addEventListener("click",()=>ch(true));n.addEventListener("click",()=>ch(false));
  };
  start(0);
});

/* ---------- 3. weather: pull to refresh ---------- */
const WROOMS=["Attic","Kitchen","Hallway","Bathroom","Landing","Your room"];
const WFC=["Heavy breathing. Clearing by dawn. It never clears by dawn.","Partly Jeff. 80% chance of humming.","Fog at head height. Your head height. Not the fog's.",
  "Dripping. Advisory for anything smaller than a hand.","Still. Too still. Still like it's listening for its name.","Clear for now. Enjoy it. Lie down in it while it lasts."];
const WPAST=["Front passed. Left a warm patch on the insulation shaped like a guy lying down.","Front passed. Fridge open. Light on. Somebody still standing in it, but smaller.",
  "Front passed. Every photo in the hall is facing the wall. Leave them like that. They asked.","Front passed. Every toothbrush is wet. Even the spare. Even the one still in the packaging.",
  "Front passed. The third stair now says 'ow' when you step on it. It didn't before.","Here."];
const WST=[
  ["Attic","58°","Overcast with teeth","H: your height  L: under the bed","Indoor Weather Statement","A slow front of teeth is moving through the attic at walking pace. Pull down on the forecast to refresh. Every refresh, it takes a step."],
  ["Kitchen","64°","Fridge-lit. Chewing.","H: counter height  L: the floor","Special Statement","The front has entered the kitchen. It opened the fridge. It's standing in the fridge light, which is rude, and it's chewing, which is worse."],
  ["Hallway","61°","Fog. Photos facing the wall.","H: the coat hooks  L: the carpet","Advisory","Front in the hallway. Visibility: one family photo. Gusts of 'hello?' up to 3 mph. Do not answer. It's practicing your voice on the photos."],
  ["Bathroom","70°","Humid. Minty. Busy.","H: the mirror  L: the drain","Watch","The front is in the bathroom and it is brushing. It's brushing all of them. There are a lot of them. It's taking its time on purpose."],
  ["Landing","66°","Leaning","H: the doorknob  L: the gap under your door","Warning","The front is on the landing, right outside the room you're in. Pressure is falling in the shape of someone leaning on your door, ear first."],
  ["The room you're in","98.6°","Body temperature","H: you  L: also you","Severe Jeff Warning","For: the room you're in. Take shelter in a different room. Every room in your house is now this room. See the 10-day below."]];
app("p-weather","Weather","Inside: your place, {city}",(P)=>{
  const WL=WST.length-1;let s=0,busy=false,y0=null,dy=0;
  const pull=txt("div","pwx-pull","");P.body.appendChild(pull);
  const top=el("div","pwx-top");P.body.appendChild(top);
  const al=el("div","pwx-al");P.body.appendChild(al);
  const det=el("div","pwx-det");[["UV index","they can see you"],["Humidity","his breath, mostly"],["Wind","under the door, 2 mph, warm"],["Feels like","someone's there"]].forEach(x=>{const d=el("div");d.appendChild(txt("small","",x[0]));d.appendChild(document.createTextNode(x[1]));det.appendChild(d)});P.body.appendChild(det);
  const rad=el("canvas","pwx-rad");P.body.appendChild(rad);const RW=Math.min(448,(P.body.clientWidth||380)-34),RH=150;const g=fitC(rad,RW,RH);
  const list=el("div");P.body.appendChild(list);
  const render=()=>{
    const w=WST[s];top.innerHTML="";top.appendChild(txt("div","pwx-loc",w[0]));top.appendChild(txt("div","pwx-deg",w[1]));top.appendChild(txt("div","pwx-cond",w[2]));top.appendChild(txt("div","pwx-hl",w[3]));
    al.innerHTML="";al.appendChild(txt("b","",w[4]));al.appendChild(document.createTextNode(w[5]));
    list.innerHTML="";
    if(s===WL){const d=new Date();for(let i=0;i<10;i++){const day=i===0?"Today":new Date(d.getTime()+i*864e5).toLocaleDateString("en-US",{weekday:"short"});const r=el("div","pwx-rm"+(i===9?" hit":""));r.appendChild(txt("b","",day));r.appendChild(document.createTextNode(i===9?"You":i===4?"Sunny (Jeff)":"Jeff"));list.appendChild(r)}return}
    WROOMS.forEach((n,i)=>{const r=el("div","pwx-rm"+(i===s?" hit":""));r.appendChild(txt("b","",n));r.appendChild(document.createTextNode(i<s?WPAST[i]:WFC[i]));list.appendChild(r)});
  };
  const ROOM=[[0.02,0.06,0.3,0.4],[0.35,0.06,0.3,0.4],[0.68,0.06,0.3,0.4],[0.02,0.54,0.3,0.4],[0.35,0.54,0.3,0.4],[0.68,0.54,0.3,0.4]];
  let fx=null,fy=null;
  J.raf(t=>{g.fillStyle=J.C.panel;g.fillRect(0,0,RW,RH);g.font="11px sans-serif";
    ROOM.forEach((r,i)=>{g.strokeStyle=J.C.line;g.lineWidth=2;g.strokeRect(r[0]*RW,r[1]*RH,r[2]*RW,r[3]*RH);g.fillStyle=i===WL?J.C.rust:J.C.dim;g.fillText(WROOMS[i],r[0]*RW+6,r[1]*RH+14)});
    const R=ROOM[Math.min(s,WL)],tx=(R[0]+R[2]/2)*RW,ty=(R[1]+R[3]/2+0.04)*RH;if(fx==null){fx=tx;fy=ty}fx+=(tx-fx)*0.04;fy+=(ty-fy)*0.04;
    for(let i=0;i<14;i++){const a=i*0.9+t*0.7,rr2=8+(i%4)*5;tooth(g,fx+Math.cos(a)*rr2*1.4,fy+Math.sin(a*1.3)*rr2*0.6,0.42,J.C.rust)}
    g.fillStyle=J.C.bone;g.beginPath();g.arc((ROOM[WL][0]+ROOM[WL][2]/2)*RW,(ROOM[WL][1]+ROOM[WL][3]*0.7)*RH,4,0,7);g.fill();g.fillText("you",(ROOM[WL][0]+ROOM[WL][2]/2)*RW+7,(ROOM[WL][1]+ROOM[WL][3]*0.7)*RH+4);
  });
  const refresh=()=>{if(busy||s>=WL)return;busy=true;pull.textContent="refreshing";A.click();
    J.after(900,()=>{s++;render();pull.textContent="";A.thump();busy=false;if(s===WL-1)J.cut("LEANING",90);
      if(s>=WL){top.removeAttribute("data-act");J.say("severe weather",{pitch:0.1,rate:0.6});J.after(2500,()=>P.done("swipe up to go home. take shelter there."))}})};
  top.addEventListener("pointerdown",e=>{if(P.body.scrollTop>4)return;y0=e.clientY;dy=0;try{top.setPointerCapture(e.pointerId)}catch(x){}});
  top.addEventListener("pointermove",e=>{if(y0==null)return;dy=Math.max(0,e.clientY-y0);top.style.transform="translateY("+Math.min(90,dy*0.6)+"px)";pull.textContent=dy>70?"release to refresh":"pull down to refresh"});
  const up=()=>{if(y0==null)return;top.style.transform="";if(dy>70)refresh();else pull.textContent="";y0=null};top.addEventListener("pointerup",up);top.addEventListener("pointercancel",up);
  top.dataset.act="drag:0,170,400";top.dataset.at="0.5,0.3";
  render();
});

/* ---------- 4. reminders: check boxes ---------- */
const RMY=[["buy milk","bought the milk. it's in your fridge. it's not from a cow. it's from the group. don't ask which member."],
  ["call mom back","called your mom back. she said you sound different. i said you've always sounded like this. she agreed, eventually, in my voice."],
  ["drink 8 glasses of water","drank your water. all eight. left the glasses by your bed, full again. that isn't water in them. it's just listening."],
  ["take out the trash","took the trash out. took it a long way out. it's in a different group now. it's thriving there. it has a following."],
  ["answer emails","answered all your emails with the single word 'teeth.' three people replied 'finally.' one of them is your landlord."],
  ["go to bed before 1","Completed by: Jeff, Jeff, and 1,202 others. It's a big bed. You're on the edge of it. Don't roll over."]];
const RMJ=["wake up before you","be in the kitchen when you get there","say good morning in your voice so you don't have to","learn the passcode (done. it's your tooth count. change it and we'll learn that too.)"];
app("p-reminders","Reminders","Today: 6 of yours",(P)=>{
  P.body.appendChild(txt("div","prm-h","Yours"));const mine=el("div");P.body.appendChild(mine);
  P.body.appendChild(txt("div","prm-h","Completed by someone else"));const theirs=el("div");P.body.appendChild(theirs);
  const cap=txt("div","pcap","Check off what you've done. Somebody else is checking things off too.");P.body.insertBefore(cap,P.body.firstChild);
  let n=0;const rows=[];
  const point=()=>{rows.forEach(r=>r.btn.removeAttribute("data-act"));const nx=rows.find(r=>!r.done);if(nx)nx.btn.dataset.act="tap"};
  RMY.forEach((it,i)=>{const r=el("div","prm"),b=el("button");b.type="button";b.setAttribute("aria-label","check");const w=el("div");const t=txt("div","prt",it[0]);w.appendChild(t);r.appendChild(b);r.appendChild(w);mine.appendChild(r);
    const R={r:r,btn:b,t:t,w:w,done:false,i:i};rows.push(R);
    b.addEventListener("click",()=>{if(R.done)return;R.done=true;r.classList.add("x");A.click();n++;point();
      J.after(1100,()=>{const j=el("div","prm x j");const jb=el("button");jb.type="button";j.appendChild(jb);const jw=el("div");jw.appendChild(txt("div","prt",it[1]));jw.appendChild(txt("small","",i===RMY.length-1?"completed by: everyone":"completed by: Jeff, just now"));j.appendChild(jw);theirs.appendChild(j);A.pop();
        if(n===1){J.after(1800,()=>{rows[RMY.length-1].t.textContent="go to bed before 1 (we're already in it. scoot over.)";rows[RMY.length-1].w.appendChild(txt("small","","edited by Jeff"));A.clank(0.25)})}
        if(n>=RMY.length)J.after(2400,shared);
      })});
  });
  point();
  const shared=()=>{
    P.body.appendChild(txt("div","prm-h","Jeff shared a list with you: tomorrow (yours)"));const box=el("div");P.body.appendChild(box);
    RMJ.forEach((t,i)=>J.after(i*900,()=>{const j=el("div","prm x j");const jb=el("button");jb.type="button";j.appendChild(jb);const w=el("div");w.appendChild(txt("div","prt",t));w.appendChild(txt("small","","already done (tomorrow)"));j.appendChild(w);box.appendChild(j);A.pop()}));
    J.after(RMJ.length*900+600,()=>{
      const c2=txt("div","pcap","All four are checked, and none of them have happened yet. You can keep this list, or take it off your phone.");P.body.appendChild(c2);
      const k=txt("button","pbtn ghost","keep the list"),rm=txt("button","pbtn","remove from my lists");k.type=rm.type="button";rm.dataset.act="tap";P.body.appendChild(rm);P.body.appendChild(k);
      const ch=del=>{k.remove();rm.remove();A.thump();if(del)box.remove();
        c2.textContent=del?"Removed. It's off your phone. It stays on his phone, which is his business. Your lists are yours again. All six. Five of them done by someone else.":"Kept. You'll get a reminder for each one about four seconds after it happens. That's the best we can do. We're not psychic. We're just early.";
        P.done();try{P.body.scrollTop=P.body.scrollHeight}catch(e){}};
      rm.addEventListener("click",()=>ch(true));k.addEventListener("click",()=>ch(false));try{P.body.scrollTop=P.body.scrollHeight}catch(e){}
    });
  };
});

/* ---------- 5. seance: suggestion chips only ---------- */
const SER=[
  {w:["is","anyone","there"],d:[["hey","ok"],["going","else"],["now","?"]],r:["yes. hi. hello. we're in the suggestions.","we've been in there since you got this {model}. who do you think kept suggesting 'ok' every time you were about to say something real."]},
  {w:["who","are","you"],d:[["what","lol"],["is","we"],["guys","doing"]],r:["we're every word you almost typed and then didn't.","we live in the little gap between your thumbs. it's roomy. it's warm. it smells exactly like your phone case."]},
  {w:["what","do","you","want"],d:[["when","so"],["is","are"],["guys","we"],["mean","to"]],r:["honestly? for you to say 'teeth' more. we suggest it constantly. you never take it.","you took 'ok' eleven thousand times. you took 'lol' when nothing was funny. 'teeth': zero. we have so many. it hurts our feelings."]},
  {w:["are","you","jeff"],d:[["is","were"],["we","they"],["now","here"]],r:["we're jeff the way a crowd is a person. from far away, with the lights off.","you'd be surprised how many of us fit in one sentence. look at that last one. three of us were holding the commas."]},
  {w:["where","are","you"],d:[["how","why"],["is","were"],["guys","going"]],r:["closer than the suggestion bar. lower than the screen. we're in the part of the phone you hold.","right now? under your left thumb. you're pressing on us. it's fine. we like the weight. nobody has held us this long since the warranty ran out."]},
  {w:["teeth","teeth","teeth"],d:[["teeth","teeth"],["teeth","teeth"],["teeth","teeth"]],r:["THANK YOU.","that's all we wanted. we'll go quiet now. we'll move into autocorrect. we'll turn 'goodnight' into something worse, but only sometimes."]}];
app("p-seance","Predict","Predictive text: seance mode",(P)=>{
  P.pf.removeChild(P.hb);
  const th=el("div","pse-th");P.body.appendChild(th);
  th.appendChild(txt("div","pse-sys","Your keyboard learned from everything you ever typed, and from everything typed near you at night. The keys are decoration now. Tap only the suggestions. Ask it something."));
  const low=el("div","pse-low");P.pf.appendChild(low);const inp=txt("div","pse-in","");low.appendChild(inp);const chips=el("div","pse-chips");low.appendChild(chips);
  const kb=el("div","pse-kb");["qwertyuiop","asdfghjkl","zxcvbnm"].forEach(r=>{const d=el("div");r.split("").forEach(c=>d.appendChild(txt("span","",c)));kb.appendChild(d)});low.appendChild(kb);
  let kbn=0;kb.addEventListener("click",()=>{A.click();th.appendChild(txt("div","pse-sys",["The keys don't work tonight. They're painted on. Use the suggestions.","Still painted on. Someone painted them while you were typing last week.","You can press them all you like. They press back, a little."][Math.min(2,kbn++)]));P.body.scrollTop=P.body.scrollHeight});
  P.pf.appendChild(P.hb);
  let ri=0,wi=0,typed=[];
  const scroll=()=>{P.body.scrollTop=P.body.scrollHeight};
  const show=()=>{chips.innerHTML="";const R=SER[ri];
    if(wi>=R.w.length){const sd=txt("button","m","Send");sd.type="button";sd.dataset.act="tap";chips.appendChild(sd);sd.addEventListener("click",send);return}
    const opts=[R.d[wi][0],R.w[wi],R.d[wi][1]];
    opts.forEach((o,i)=>{const b=txt("button",i===1?"m":"",o);b.type="button";if(i===1)b.dataset.act="tap";chips.appendChild(b);
      b.addEventListener("click",()=>{typed.push(o);inp.textContent=typed.join(" ");wi++;A.click();if(o!==R.w[wi-1])J.after(250,()=>{A.blip(220,0.12,"triangle",0.05)});show()})});
  };
  const send=async()=>{chips.innerHTML="";const me=txt("div","pse-b me",typed.join(" "));th.appendChild(me);inp.textContent="";typed=[];A.pop();scroll();
    for(const r of SER[ri].r){await J.wait(600);const d=txt("div","pse-b them","...");th.appendChild(d);scroll();await J.wait(500+Math.min(1600,r.length*15));d.textContent=fillL(r);A.pop();scroll();
      if(ri===SER.length-1&&r===SER[SER.length-1].r[0]){J.cut("TEETH",90);J.say("thank you",{pitch:0.2,rate:0.6})}}
    ri++;wi=0;
    if(ri>=SER.length){await J.wait(1400);th.appendChild(txt("div","pse-sys","Seance ended. Your keyboard learned 1 new word. It will suggest it at job interviews."));scroll();S.memo.word="teeth";low.style.opacity=".4";P.done();return}
    if(ri===SER.length-1)th.appendChild(txt("div","pse-sys","The suggestions are all the same word now. Any of them will do."));
    show();
  };
  show();
});

/* ---------- 6. contacts: drag one onto another ---------- */
const CTS=[["Jeff","mobile"],["Jeff (2)","mobile, also"],["Jeff (work)","office, extension 32"],["Jeff (do not answer)","landline"],["Mom (Jeff)","home"],["Jeff (under house)","crawlspace"],["Jeff (dentist)","after hours, all hours"],["Jeff Conner (old number)","disconnected, still rings"]];
const MRG=["Merged. Same number. Same voice. They had one mouth between them and now they have the whole thing.",
  "Merged. The notes field now says: 'call before 9'. 'never call before 9'. 'he's calling now'.",
  "Merged. Work and do-not-answer were the same Jeff. You answered at work. That's how all of this started.",
  "Merged Mom. She's fine with it. She says the bigger card is roomier. She says sit up straight.",
  "Merged the one from under the house. The card is heavier. You can feel it in the phone. Hold it with both hands.",
  "Merged the dentist. He says your file just got a lot thinner. He says it like a compliment. It is not a compliment.",
  "Merged the old number. That was the last one. Everyone you know is one contact now. Look at him."];
app("p-contacts","Contacts","1,204 duplicates found",(P)=>{
  const cap=txt("div","pcap","");P.body.appendChild(cap);const list=el("div");P.body.appendChild(list);
  let cards=[],mi=0,drag=null,ghost=null,sx=0,sy=0;
  const mkCard=(c,i)=>{const d=el("div","pct pcard");const av=J.avatar(S.face+i*7,84,0.15+i*0.08);d.appendChild(av);const w=el("div");w.appendChild(txt("b","",c[0]));w.appendChild(txt("small","",c[1]));d.appendChild(w);d._c=c;list.appendChild(d);cards.push(d);
    d.addEventListener("pointerdown",e=>{if(mi>=MRG.length)return;e.preventDefault();drag=d;sx=e.clientX;sy=e.clientY;try{d.releasePointerCapture&&d.releasePointerCapture(e.pointerId)}catch(x){}});return d};
  const point=()=>{cards.forEach(c=>{c.removeAttribute("data-act");c.removeAttribute("data-tgt")});if(cards.length>1){cards[0].dataset.act="dragto:body.fr-phone .pct[data-tgt='1']";cards[1].dataset.tgt="1"}};
  const mv=e=>{if(!drag)return;if(!ghost&&Math.hypot(e.clientX-sx,e.clientY-sy)>8){ghost=drag.cloneNode(true);ghost.className="pct pcard pghost";ghost.removeAttribute("data-act");document.body.appendChild(ghost);drag.classList.add("src")}
    if(ghost){ghost.style.left=(e.clientX-140)+"px";ghost.style.top=(e.clientY-28)+"px";cards.forEach(c=>c.classList.remove("hot"));const t=hit(e);if(t)t.classList.add("hot")}};
  const hit=e=>{if(ghost)ghost.style.display="none";const x=document.elementFromPoint(e.clientX,e.clientY);if(ghost)ghost.style.display="";const c=x&&x.closest&&x.closest(".pct");return c&&c!==drag&&cards.indexOf(c)>=0?c:null};
  const upE=e=>{if(!drag)return;const t=ghost?hit(e):null;if(ghost){ghost.remove();ghost=null}drag.classList.remove("src");cards.forEach(c=>c.classList.remove("hot"));const s=drag;drag=null;if(t)merge(s,t)};
  window.addEventListener("pointermove",mv);window.addEventListener("pointerup",upE);J.onClean(()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",upE);if(ghost)ghost.remove()});
  const merge=(s,t)=>{cards.splice(cards.indexOf(s),1);s.remove();const b=t.querySelector("b");const nmn=mi>=MRG.length-1?"Jeff":"Jeff ("+(mi+2)+" of them, merged)";b.textContent=nmn;
    t.querySelector("small").textContent="merged from "+(mi+2)+" contacts";const av=t.querySelector("canvas");J.face(av,S.face,Math.min(1,0.3+mi*0.12));
    cap.textContent=MRG[mi];mi++;A.crunch();J.buzz(30);point();if(mi>=MRG.length)J.after(3600,big)};
  const big=()=>{list.innerHTML="";cap.textContent="";const bg=el("div","pbig");const av=document.createElement("canvas");av.width=av.height=240;J.face(av,S.face,0.9,{open:0.4});bg.appendChild(av);bg.appendChild(txt("h2","","Jeff"));bg.appendChild(txt("div","pnote","1 contact. 1,204 cards. Everyone."));list.appendChild(bg);
    [["mobile","this phone. the one you're holding."],["home","here"],["work","under here"],["birthday","today, every day, all day"],["relationship","yes"],["ringtone","your own voice saying 'hey' from the next room"],["notes","call before 9. never call before 9. he's calling now. likes: teeth. allergic to: being left. knows your mom."]].forEach((f,i)=>J.after(i*700,()=>{const d=el("div","pfld");d.appendChild(txt("small","",f[0]));d.appendChild(document.createTextNode(f[1]));list.appendChild(d);A.pop()}));
    J.after(7*700+1200,()=>{cap.textContent="This contact is also you. It says so at the bottom, in small grey letters, where they put the important things.";P.body.insertBefore(cap,list);J.say("hey",{pitch:0.2,rate:0.7});P.done()})};
  alertBox(P,"Merge duplicates?","We found 1,204 contacts that are the same person. Drag one onto another to merge them. Or don't. They can stay apart.",["Start merging","Not now"]).then(i=>{
    if(i===1){cap.textContent="Not now it is. They stay separate. They'll cope. They have each other, technically, eight times over.";CTS.forEach(mkCard);P.done();return}
    cap.textContent="Drag a Jeff onto another Jeff. They'll know what to do. They've been waiting to.";CTS.forEach(mkCard);point();
  });
});

/* ---------- 7. maps: zoom ---------- */
const MPC=["Maps. You are here. Zoom in. Everybody zooms in.",
  "{city}. 1 Jeff nearby. Hold on. Updating. 1,204 Jeffs nearby. All of them at your address. Some on top of each other.",
  "Your street. Every house on it has your house saved as 'Home'. Your neighbors have been very quiet about this.",
  "Satellite view, updated tonight. That's somebody lying on your roof, face up, waving at the satellite. He knows the schedule.",
  "Your room. The dot is you. The other dot is labeled 'also you'. It has full bars. You have one.",
  "The top of your head. Lot of thinking going on in there. You can see it from orbit. Ninety percent of it is about teeth.",
  "Inside your mouth. {teeth} pins. Every one has reviews. The top-rated one is back left: 'quiet, dependable, would bite again'.",
  "One molar. Terrain view. There are roads on it. Small ones. Something commutes across it twice a day.",
  "There's a city inside the tooth. It's {city}. There's a pin in it. You are here. You were always here. Zoom in?",
  "It goes round. Every lap is a little smaller and a little warmer. Some of us live on lap four. Rent's cheaper. The commute is a jaw."];
const MPL=["Region","{city}","Your street","Your roof","Your room","You","Your mouth","One tooth","{city} (inside)","Lap 2"];
app("p-maps","Maps","Directions to: Jeff",(P)=>{
  const wr=el("div","pmap-w");P.body.appendChild(wr);const cv=el("canvas","pmap");wr.appendChild(cv);
  const W=Math.min(448,(P.body.clientWidth||380)-34),H=Math.round(Math.min(window.innerHeight*0.48,W*1.05));const g=fitC(cv,W,H);
  const lv=txt("div","pmap-lv","");wr.appendChild(lv);const zz=el("div","pmap-z");const zi=txt("button","","+"),zo=txt("button","","-");zi.type=zo.type="button";zi.setAttribute("aria-label","zoom in");zo.setAttribute("aria-label","zoom out");zz.appendChild(zi);zz.appendChild(zo);wr.appendChild(zz);
  const cap=txt("div","pcap","");P.body.appendChild(cap);
  const rnd=J.mk(S.face||7);const RS=[];for(let i=0;i<60;i++)RS.push(rnd());
  const cache=[];
  const lab=(c,s,x,y,col)=>{c.fillStyle=col||J.C.bone;c.font="600 12px -apple-system,sans-serif";c.textAlign="center";c.fillText(fillL(s),x,y)};
  const pin=(c,x,y)=>{c.fillStyle=J.C.rust;c.beginPath();c.arc(x,y-14,9,Math.PI,0);c.lineTo(x,y);c.closePath();c.fill();c.fillStyle=J.C.panel;c.beginPath();c.arc(x,y-14,3.5,0,7);c.fill()};
  const grid=(c,rot,col)=>{c.save();c.translate(W/2,H/2);c.rotate(rot);c.strokeStyle=col;c.lineWidth=2;for(let i=-12;i<=12;i++){c.beginPath();c.moveTo(i*26,-W);c.lineTo(i*26,W);c.stroke();c.beginPath();c.moveTo(-W,i*26);c.lineTo(W,i*26);c.stroke()}c.restore()};
  const DR=[
    c=>{c.fillStyle=J.C.dried;c.fillRect(0,0,W,H);c.fillStyle=J.C.panel;c.beginPath();for(let i=0;i<=24;i++){const a=i/24*Math.PI*2,r=Math.min(W,H)*(0.32+RS[i]*0.12);c.lineTo(W/2+Math.cos(a)*r*1.2,H/2+Math.sin(a)*r)}c.fill();c.strokeStyle=J.C.line;c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(W*RS[i+30],H*RS[i+31]);c.quadraticCurveTo(W/2,H/2,W*RS[i+40],H*RS[i+41]);c.stroke()}pin(c,W/2,H/2);lab(c,"{city}",W/2,H/2+18)},
    c=>{c.fillStyle=J.C.panel;c.fillRect(0,0,W,H);grid(c,0.2,J.C.line);c.fillStyle=J.C.dried;c.save();c.translate(W/2,H/2);c.rotate(0.2);c.fillRect(-W,H*0.18,W*2,26);c.restore();c.fillStyle=J.C.bile;c.globalAlpha=0.35;c.fillRect(W*0.12,H*0.14,W*0.22,H*0.16);c.globalAlpha=1;pin(c,W/2,H/2);lab(c,"you",W/2,H/2+18)},
    c=>{c.fillStyle=J.C.panel;c.fillRect(0,0,W,H);c.fillStyle=J.C.line;c.fillRect(0,H*0.45,W,H*0.1);for(let i=0;i<6;i++){for(let s=0;s<2;s++){const x=W*0.04+i*W*0.16,y=s?H*0.6:H*0.18;c.fillStyle=J.C.dried;c.fillRect(x,y,W*0.12,H*0.2);c.strokeStyle=(i===2&&s===0)?J.C.rust:J.C.line;c.lineWidth=(i===2&&s===0)?4:1.5;c.strokeRect(x,y,W*0.12,H*0.2);c.fillStyle=J.C.dim;c.font="10px sans-serif";c.textAlign="center";c.fillText("home",x+W*0.06,y+H*0.11)}}pin(c,W*0.04+2*W*0.16+W*0.06,H*0.18)},
    c=>{c.fillStyle=J.C.dried;c.fillRect(0,0,W,H);c.fillStyle=J.C.panel;c.fillRect(W*0.08,H*0.1,W*0.84,H*0.8);c.strokeStyle=J.C.line;c.lineWidth=1.5;for(let y=H*0.12;y<H*0.9;y+=9){c.beginPath();c.moveTo(W*0.08,y);c.lineTo(W*0.92,y);c.stroke()}c.lineWidth=4;c.beginPath();c.moveTo(W*0.08,H*0.5);c.lineTo(W*0.92,H*0.5);c.stroke();
      c.fillStyle=J.C.bone;const x=W*0.58,y=H*0.32;c.beginPath();c.arc(x,y,7,0,7);c.fill();c.fillRect(x-4,y+6,8,30);c.fillRect(x-18,y+10,14,4);c.fillRect(x+4,y+10,14,4);c.fillRect(x-4,y+34,3,16);c.fillRect(x+1,y+34,3,16);c.save();c.translate(x+18,y+10);c.rotate(-0.9);c.fillRect(0,0,14,4);c.restore()},
    c=>{c.fillStyle=J.C.panel;c.fillRect(0,0,W,H);c.strokeStyle=J.C.bone;c.lineWidth=5;c.strokeRect(W*0.1,H*0.1,W*0.8,H*0.8);c.fillStyle=J.C.panel;c.fillRect(W*0.62,H*0.88,W*0.16,H*0.05);c.fillStyle=J.C.dried;c.fillRect(W*0.16,H*0.16,W*0.34,H*0.4);c.strokeStyle=J.C.line;c.lineWidth=2;c.strokeRect(W*0.16,H*0.16,W*0.34,H*0.4);c.fillRect(W*0.6,H*0.18,W*0.24,H*0.12);
      c.fillStyle=J.C.rust;c.beginPath();c.arc(W*0.33,H*0.4,9,0,7);c.fill();lab(c,"you",W*0.33,H*0.4+24);c.globalAlpha=0.5;c.beginPath();c.arc(W*0.33,H*0.4,18,0,7);c.strokeStyle=J.C.rust;c.stroke();c.globalAlpha=1;c.fillStyle=J.C.bone;c.beginPath();c.arc(W*0.7,H*0.66,9,0,7);c.fill();lab(c,"also you",W*0.7,H*0.66+24)},
    c=>{c.fillStyle=J.C.panel;c.fillRect(0,0,W,H);c.fillStyle=J.C.dried;c.beginPath();c.ellipse(W/2,H/2,W*0.36,H*0.4,0,0,7);c.fill();c.strokeStyle=J.C.bone;c.lineWidth=1.4;for(let i=0;i<70;i++){const a=i*0.38,r=4+i*2.4;c.beginPath();c.arc(W/2+Math.cos(a)*r*0.2,H/2+Math.sin(a)*r*0.2,r,a,a+0.9);c.stroke()}},
    c=>{c.fillStyle=J.C.dried;c.fillRect(0,0,W,H);const n=16;for(let i=0;i<n;i++){const a=Math.PI*(0.08+0.84*i/(n-1)),x=W/2-Math.cos(a)*W*0.36,y=H*0.22+Math.sin(a)*H*0.6;c.save();c.translate(x,y);c.rotate(-Math.cos(a)*0.8);c.fillStyle=J.C.bone;rr(c,-W*0.04,-H*0.035,W*0.08,H*0.07,8);c.fill();c.restore();if(i%3===0)pin(c,x,y-H*0.03)}},
    c=>{c.fillStyle=J.C.panel;c.fillRect(0,0,W,H);c.strokeStyle=J.C.line;c.lineWidth=1.5;for(let k=1;k<11;k++){c.beginPath();for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,r=k*Math.min(W,H)*0.045*(1+0.12*Math.sin(a*3+k));c.lineTo(W/2+Math.cos(a)*r*1.1,H/2+Math.sin(a)*r)}c.stroke()}c.strokeStyle=J.C.rust;c.lineWidth=2;c.setLineDash([5,5]);c.beginPath();c.moveTo(W*0.1,H*0.8);c.bezierCurveTo(W*0.3,H*0.3,W*0.7,H*0.9,W*0.9,H*0.2);c.stroke();c.setLineDash([])},
    c=>{c.fillStyle=J.C.bone;c.fillRect(0,0,W,H);c.fillStyle=J.C.panel;c.beginPath();c.ellipse(W/2,H/2,W*0.44,H*0.44,0,0,7);c.fill();c.save();c.beginPath();c.ellipse(W/2,H/2,W*0.44,H*0.44,0,0,7);c.clip();grid(c,-0.3,J.C.line);c.restore();pin(c,W/2,H/2);lab(c,"{city}",W/2,H/2+18)},
    c=>{DR[0](c);lab(c,"lap 2",W/2,24,J.C.rust)}
  ];
  const lvl=i=>{if(!cache[i]){const o=document.createElement("canvas"),d=Math.min(2,window.devicePixelRatio||1);o.width=W*d;o.height=H*d;const c=o.getContext("2d");c.setTransform(d,0,0,d,0,0);DR[i](c);cache[i]=o}return cache[i]};
  let L=0,tr=null,maxL=0,finished=false;
  const setL=n=>{L=n;lv.textContent=fillL(MPL[n]);cap.textContent=fillL(MPC[n]);if(n>maxL){maxL=n;A.thump();if(n===6)J.cut("OPEN",90);if(n===8)J.say(J.city,{pitch:0.2,rate:0.6})}
    if(n>=9&&!finished){finished=true;zi.removeAttribute("data-act");J.after(4200,()=>{cap.textContent="Arrived. You have reached Jeff. Jeff has reached you. Nobody has to drive.";P.done()})}};
  const zoom=d=>{if(tr||finished&&d>0)return;const n=L+d;if(n<0||n>9)return;tr={from:L,to:n,t:0};A.blip(d>0?300:200,0.25,"sine",0.06,d>0?600:120)};
  zi.addEventListener("click",()=>zoom(1));zo.addEventListener("click",()=>zoom(-1));zi.dataset.act="tap";
  cv.addEventListener("dblclick",()=>zoom(1));cv.addEventListener("wheel",e=>{e.preventDefault();zoom(e.deltaY<0?1:-1)},{passive:false});
  const pts=new Map();let d0=0;cv.addEventListener("pointerdown",e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const p=[...pts.values()];d0=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1])}});
  cv.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2&&d0){const p=[...pts.values()],d=Math.hypot(p[0][0]-p[1][0],p[0][1]-p[1][1]);if(d/d0>1.4){zoom(1);d0=d}else if(d/d0<0.7){zoom(-1);d0=d}}});
  const pu=e=>{pts.delete(e.pointerId);d0=0};cv.addEventListener("pointerup",pu);cv.addEventListener("pointercancel",pu);
  J.raf((t,dt)=>{
    g.clearRect(0,0,W,H);
    if(tr){tr.t=Math.min(1,tr.t+dt/0.9);const k=tr.t*tr.t*(3-2*tr.t),inw=tr.to>tr.from;
      const a=inw?tr.from:tr.to,b=inw?tr.to:tr.from,kk=inw?k:1-k;
      g.save();g.globalAlpha=1-kk;const s1=1+kk*5;g.translate(W/2,H/2);g.scale(s1,s1);g.drawImage(lvl(a),-W/2,-H/2,W,H);g.restore();
      g.save();g.globalAlpha=kk;const s2=0.2+0.8*kk;g.translate(W/2,H/2);g.scale(s2,s2);g.drawImage(lvl(b),-W/2,-H/2,W,H);g.restore();g.globalAlpha=1;
      if(tr.t>=1){const to=tr.to;tr=null;setL(to)}}
    else g.drawImage(lvl(L),0,0,W,H);
  });
  setL(0);
});

/* ---------- ending: software update ---------- */
const NOTES=["Everyone in your contacts is now one person. You did that. Thank you.","Face ID now recognizes your face, his face, and the face behind his face.",
  "The flashlight now also looks back.",
  "Added a second clock. It runs on his time. It's a few minutes ahead of yours.",
  "Security: patches 1,204 holes. Leaves one open. You know which one. It's the one you're looking through."];
J.scene("p-update",(st,arg)=>{
  J.toastHook=t=>banner(t);const P=shell(st,{title:"Software Update",sub:"Settings > General"});
  const logo=el("canvas","pup-logo");const lg=fitC(logo,76,76);lg.fillStyle=J.C.rust;lg.fillRect(0,0,76,76);tooth(lg,38,40,1.6,on(J.C.rust));P.body.appendChild(logo);
  const hd=el("div","pup-h");hd.appendChild(txt("b","","JeffOS 32."+(S.teeth+1)));hd.appendChild(txt("small","","Jeff Conner, everybody. Size: the rest of tonight."));P.body.appendChild(hd);
  const ul=el("ul","pup-notes");NOTES.forEach(n=>ul.appendChild(txt("li","",n)));P.body.appendChild(ul);
  const ins=txt("button","pbtn","Install Now"),nn=txt("button","pbtn ghost","Not Now");ins.type=nn.type="button";ins.dataset.act="tap";P.body.appendChild(ins);P.body.appendChild(nn);
  const stat=txt("div","pnote","");P.body.appendChild(stat);
  let installed=false;
  ins.addEventListener("click",()=>{installed=true;ins.remove();nn.remove();A.thump();install()});
  nn.addEventListener("click",()=>{ins.remove();nn.remove();A.click();
    alertBox(P,"Not now it is","JeffOS will not be installed. We heard you. A no is a no. It's the only rule the group has, and we keep it. The phone is going to lock now. It's been a long night for everybody in it.",["OK"]).then(()=>lockFace(false))});
  const install=()=>{
    const bar=el("div","pup-bar"),bi=el("i");bar.appendChild(bi);P.body.insertBefore(bar,stat);stat.scrollIntoView({block:"end"});
    const ST=["Preparing Jeff...","Verifying Jeff...","Removing your name. Keeping a copy. We're not animals.","Moving teeth to the cloud...","Installing 1,204 Jeffs. This is the slow part.","Teaching the keyboard your new word...","Restarting. Don't look at the screen while it's black. It can see better then."];
    ST.forEach((s,i)=>J.after(i*1700,()=>{stat.textContent=s;bi.style.width=Math.round((i+1)/ST.length*100)+"%";A.click()}));
    J.after(ST.length*1700+600,()=>{P.pf.classList.add("off");A.static(0.05);J.buzz(80);
      J.after(1800,()=>{A.static(0);P.pf.classList.remove("off");hello()})});
  };
  const hello=()=>{
    const h=el("div","phello");const w=txt("div","w","");h.appendChild(w);const s=txt("div","pnote","");h.appendChild(s);P.pf.appendChild(h);
    const WS=["Hello","Hola","Bonjour","Jeff","Hallo","Jeff","Ciao","Jeff","Jeff","Jeff"];let i=0;
    J.every(650,()=>{if(i<WS.length){w.textContent=WS[i];w.style.fontWeight=i%2?"600":"300";A.blip(500+i*40,0.12,"sine",0.04);i++}else if(i===WS.length){i++;s.textContent="swipe up to set up. you're already set up. swipe anyway.";h.dataset.act="swipe:up";h.dataset.at="0.5,0.7"}});
    let y0=null;h.addEventListener("pointerdown",e=>{y0=e.clientY});h.addEventListener("pointerup",e=>{if(i>WS.length&&y0!=null&&y0-e.clientY>40){h.remove();lockFace(true)}y0=null});
    h.addEventListener("click",()=>{if(i>WS.length&&h.isConnected&&!h._t){h._t=1;s.textContent="up. swipe UP. ok, fine. we'll do it."; J.after(1200,()=>{if(h.isConnected){h.remove();lockFace(true)}})}});
  };
  const lockFace=inst=>{
    J.save();S.memo.os=inst?"JeffOS":"declined";
    const wl=el("div","pwall");const fc=document.createElement("canvas");fc.width=fc.height=600;{const ink=J.C.ink;if(lum(J.C.bg)>lum(J.C.bone))J.C.ink=J.C.bone;try{J.face(fc,S.face,inst?0.95:0.6,{open:0.35,bg:J.C.bg})}finally{J.C.ink=ink}}wl.appendChild(fc);P.pf.appendChild(wl);
    const lk=el("div","plock");wl.appendChild(lk);lk.appendChild(el("div","plk"));lk.appendChild(txt("div","pld",dateLine()));lk.appendChild(txt("div","plt",clk()));
    const ns=el("div","pnotes");lk.appendChild(ns);
    const N=inst?[["JeffOS","now","Welcome to your new phone. It's the same phone. You're the new part."],["Settings","now","Wallpaper set: you, from the darkroom roll. From the front this time. We found the front."]]
      :[["Software Update","now","JeffOS will not be installed. You'll get no reminders about it. We turned the reminders off. We're adults."],["Settings","now","Wallpaper set by you, earlier, without noticing: your own face. It's a good face. We'd keep it."]];
    N.forEach((n,i)=>J.after(600+i*1100,()=>{const d=el("div","pn");const h=el("div","pbh");h.appendChild(txt("b","",n[0]));h.appendChild(txt("span","",n[1]));d.appendChild(h);d.appendChild(txt("div","",n[2]));ns.appendChild(d);A.pop()}));
    const more=el("button","pswipe");more.type="button";more.appendChild(txt("span","","tap for About This Phone"));more.appendChild(el("i"));lk.appendChild(more);
    J.after(3200,()=>{more.dataset.act="tap"});
    more.addEventListener("click",()=>{wl.remove();about(inst)});
    J.say(inst?"welcome to your new phone":"ok. goodnight",{pitch:0.2,rate:0.65});
  };
  const about=inst=>{
    P.body.innerHTML="";P.pf.querySelector(".pttl").textContent="About This Phone";P.pf.querySelector(".psub").textContent="Settings > General > About";
    const ab=el("div","pabout pcard");const did=J.lastDidYou();
    const n=S.run.filter(u=>UNITS.indexOf(u)>=0).length;
    [["Name",fillL(S.raw&&!/^je?ff/i.test(S.raw)?S.raw+"'s {model} (renamed: Jeff's)":"Jeff's {model}")],["Owner","Jeff #"+S.no],["Software",inst?"JeffOS 32."+(S.teeth+1):"your old one (you said no, and that held)"],
     ["Capacity",S.teeth+" teeth"],["Available","1 tooth"],["Apps the group lived in tonight",String(n)],["Contacts","1"],["Last visit you",did.length?did[did.length-1]:"were in the group"],["Visit",String(S.visits)]].forEach(r=>{const d=el("div");d.appendChild(txt("b","",r[0]));d.appendChild(txt("span","",r[1]));ab.appendChild(d)});
    P.body.appendChild(ab);
    P.body.appendChild(txt("div","pcap","Write a caption for whoever gets this phone next. They'll read it on their lock screen, at a bad time."));
    const inp=el("input","pin");inp.type="text";inp.maxLength=110;inp.placeholder="something for their lock screen";P.body.appendChild(inp);
    P.body.appendChild(txt("div","pnote","The caption travels inside the link itself. Nothing goes to a server. There is no server. There's just us, in here."));
    const sh=txt("button","pbtn","send this to someone"),ag=txt("button","pbtn ghost","go again. the phone is still warm.");sh.type=ag.type="button";P.body.appendChild(sh);P.body.appendChild(ag);
    const msg=txt("div","pcap","");P.body.appendChild(msg);
    const text="Jeff moved into my phone. I'm Jeff #"+S.no+" now. It takes about fifteen minutes. Hold yours tight.";
    const copy=u=>{try{navigator.clipboard.writeText(u).then(()=>{msg.textContent="Copied. It's on your clipboard, waiting to be pasted somewhere it shouldn't."},()=>{msg.textContent=u})}catch(e){msg.textContent=u}};
    sh.addEventListener("click",()=>{const u=J.inviteURL(inp.value.trim());if(navigator.share)navigator.share({title:"Jeff added you to a group",text:text,url:u}).catch(()=>{});else copy(u)});
    ag.dataset.act="end";ag.addEventListener("click",()=>{J.save();location.href=J.carry()});
    J.save();
  };
});
})();
