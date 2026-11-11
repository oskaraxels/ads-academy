/* Ads Academy shell: one path (Beginner → Intermediate → Expert), units = Listen → Try → Check. Progress in localStorage "aa-v1". */
"use strict";
const AA=window.AA, U=AA.units, UN={}; U.forEach(u=>UN[u.n]=u);
const KEY="aa-v1", LEVELS=["Beginner","Intermediate","Expert"], PASS=0.7, EXAM_PASS=0.8;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=t=>{t=Math.max(0,Math.floor(t||0));return Math.floor(t/60)+":"+String(t%60).padStart(2,"0")};
const mins=s=>Math.round((s||0)/60);
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200);}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
/* ---------- state ---------- */
function blank(){return {v:1,u:{},exam:{},rate:"1",follow:true,last:null,created:new Date().toISOString()};}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(s&&s.v===1&&s.u)return Object.assign(blank(),s);}catch(e){}return blank();}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function us(n){return S.u[n]=S.u[n]||{listen:false,pos:0,read:false,drills:{},tryMarked:false,quiz:{best:0,tries:0}};}
/* ---------- old-app progress (same origin) ---------- */
function ext(k){try{return JSON.parse(localStorage.getItem(k)||"null")||{};}catch(e){return {};}}
function tryDone(t){if(t.app==="taste"){const s=ext("aa-taste-v1");return !!(s.done&&s.done[t.id]);}
 const s=ext("aa-ws-v1"),[k,id]=[t.id.slice(0,1),t.id.slice(2)];
 if(k==="w"){const r=(s.reps||{})[id];return !!(r&&(r.done||r.best!=null));}const a=(s.lab||{})[id];return !!(a&&a.pick!=null);}
/* ---------- completion ---------- */
function tasks(u){return u.drills.map((d,i)=>({kind:"drill",i,d,title:d.title})).concat(u.try.map(t=>({kind:"old",t,title:t.title})));}
function taskDone(u,x){return x.kind==="drill"?!!us(u.n).drills[x.i]:tryDone(x.t);}
function stepDone(u,s){const st=us(u.n);
 if(s==="listen")return !!(st.listen||st.read);
 if(s==="try"){if(st.tryMarked)return true;return tasks(u).every(x=>taskDone(u,x));}
 if(s==="check")return (st.quiz.best||0)>=PASS;}
const STEPS=["listen","try","check"], STEPNAME={listen:"Listen & read",try:"Try",check:"Check"};
function unitDone(u){return STEPS.every(s=>stepDone(u,s));}
function stepsDone(list){let n=0;list.forEach(u=>STEPS.forEach(s=>{if(stepDone(u,s))n++;}));return n;}
function nextStep(){for(const u of U){for(const s of STEPS)if(!stepDone(u,s))return {u,s};}return null;}
function levelUnits(l){return U.filter(u=>u.level===l);}
const totalDur=U.reduce((a,u)=>a+((u.audio&&u.audio.duration)||u.words/2.4),0);
/* ---------- chrome ---------- */
function updateTop(){const d=stepsDone(U),t=U.length*3,p=Math.round(100*d/t);$("#topFill").style.width=p+"%";$("#topTxt").textContent=p+"%";}
function renderSide(cur){let h="";
 LEVELS.forEach(l=>{const L=levelUnits(l),d=stepsDone(L),t=L.length*3;
  h+=`<div class="side-lv">${l}<div class="bar"><div style="width:${100*d/t}%"></div></div></div>`;
  L.forEach(u=>{h+=`<a class="side-u ${unitDone(u)?"done":""} ${cur===u.n?"cur":""}" href="#/u/${u.n}"><span class="num">${unitDone(u)?"✓":u.n}</span><span class="tt">${esc(u.title)}</span><span class="steps3">${STEPS.map(s=>`<i class="${stepDone(u,s)?"on":""}" title="${STEPNAME[s]}"></i>`).join("")}</span></a>`;});
  h+=`<a class="side-x" href="#/exam/${l}">🏁 ${l} checkpoint ${(S.exam[l]||0)>=EXAM_PASS?"✓":""}</a>`;});
 h+=`<div class="side-lv">More</div><a class="side-x" href="#/exam/final">🎓 Final exam ${(S.exam.final||0)>=EXAM_PASS?"✓":""}</a><a class="side-x" href="#/practice">🧰 Practice area</a><a class="side-x" href="#/glossary">📖 Glossary</a><a class="side-x" href="#/sources">🔗 Sources</a><a class="side-x" href="#/progress">💾 Progress & backup</a>`;
 $("#side").innerHTML=h;}
function setNav(k){$$("#nav a").forEach(a=>a.classList.toggle("on",a.dataset.nav===k));}
/* ---------- glossary ---------- */
const GL=AA.glossary.slice().sort((a,b)=>b.t.length-a.t.length);
const GRE=new RegExp("(^|[^A-Za-z0-9-])("+GL.map(g=>g.t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+")(?=$|[^A-Za-z0-9-])","gi");
const GMAP={};GL.forEach(g=>GMAP[g.t.toLowerCase()]=g);
function gloss(text,seen){return esc(text).replace(GRE,(m,pre,term)=>{const g=GMAP[term.toLowerCase()];if(!g||seen.has(g.t))return m;
 if(/^[A-Z+]{2,}$/.test(g.t)&&term!==g.t)return m; seen.add(g.t);
 return pre+`<span class="gl" tabindex="0" data-g="${esc(g.t)}">${term}</span>`;});}
function tipShow(el){const g=GMAP[el.dataset.g.toLowerCase()];if(!g)return;const t=$("#tip");t.innerHTML=`<b>${esc(g.t)}</b>${esc(g.d)}`;t.hidden=false;
 const r=el.getBoundingClientRect(),w=Math.min(300,innerWidth-20);t.style.maxWidth=w+"px";const tw=t.offsetWidth;
 let x=r.left+scrollX;x=Math.max(10+scrollX,Math.min(x,scrollX+innerWidth-tw-10));t.style.left=x+"px";t.style.top=(r.bottom+scrollY+6)+"px";}
function tipHide(){$("#tip").hidden=true;}
document.addEventListener("mouseover",e=>{const g=e.target.closest(".gl");if(g)tipShow(g);else if(!e.target.closest("#tip"))tipHide();});
document.addEventListener("focusin",e=>{const g=e.target.closest(".gl");if(g)tipShow(g);});
document.addEventListener("click",e=>{const g=e.target.closest(".gl");if(g){tipShow(g);}else tipHide();});
/* ---------- views ---------- */
function main(h){stopAudio();$("#main").innerHTML=h;window.scrollTo(0,0);}
function stepHref(u,s){return `#/u/${u.n}/${s}`;}
function viewHome(){setNav("home");renderSide(null);const nx=nextStep(),d=stepsDone(U),t=U.length*3;
 const imp=["aa-taste-v1","aa-ws-v1"].filter(k=>localStorage.getItem("aa-imported-"+k));
 let h=`<div class="kicker">Meta Ads + Google Ads · Beginner → Expert</div><h1>Ads Academy</h1>
 <p class="sub">One path, 16 short units. Each unit: <b>1 Listen & read</b> a tutorial (about ${Math.round(totalDur/U.length/60)} min) → <b>2 Try</b> hands-on drills → <b>3 Check</b> a short quiz. Do the next step. That's all you need to think about.</p>`;
 if(nx){const u=nx.u,i=STEPS.indexOf(nx.s)+1;let detail="";
  if(nx.s==="listen")detail=u.audio?`${mins(u.audio.duration)} min audio with read-along (${mins(u.audio.duration/1.6)} min at 1.6×)`:"Read the tutorial";
  if(nx.s==="try"){const ts=tasks(u),left=ts.filter(x=>!taskDone(u,x)).length;detail=`${left} of ${ts.length} tasks left, one at a time`;}
  if(nx.s==="check")detail=`${u.quiz.length} questions · pass with ${Math.ceil(u.quiz.length*PASS)}`;
  h+=`<div class="card hero"><div class="kicker">Today's next step</div><h2 style="margin:.2em 0">Unit ${u.n}: ${esc(u.title)}</h2>
  <p style="margin:.2em 0 .8em"><span class="tag ${u.platform}">${u.platform==="Both"?"Meta + Google":u.platform}</span> <span class="tag">${u.level}</span> · Step ${i} of 3: <b>${STEPNAME[nx.s]}</b> · <span class="sub">${detail}</span></p>
  <a class="btn big" id="btnContinue" href="${stepHref(u,nx.s)}">▶ ${d?"Continue":"Start"}</a></div>`;}
 else h+=`<div class="card hero"><h2 style="margin-top:0">🎉 You finished the whole path.</h2><p>Take the <a href="#/exam/final">final exam</a>, then keep your skills sharp in the <a href="#/practice">Practice area</a>.</p></div>`;
 h+=`<div class="card"><b>Your progress</b><div class="lvrow"><b>Overall</b><div class="bar big"><div style="width:${100*d/t}%"></div></div><span>${Math.round(100*d/t)}%</span></div>`;
 LEVELS.forEach(l=>{const L=levelUnits(l),dd=stepsDone(L),tt=L.length*3;h+=`<div class="lvrow"><b>${l}</b><div class="bar big green"><div style="width:${100*dd/tt}%"></div></div><span>${L.filter(unitDone).length}/${L.length} units</span></div>`;});
 h+=`</div>`;
 if(imp.length)h+=`<p class="note">✔ Progress from your earlier sites (Marketing Taste Playground / Copy & Confidence Workshop) was imported automatically. Drills you already did there count here.</p>`;
 h+=`<p class="sub">Extras like the swipe file, copy checker, daily teardown, speed rounds and interview prep live in the <a href="#/practice">Practice area</a>, for when you want more. They're optional.</p>`;
 main(h);}
function viewPath(){setNav("path");renderSide(null);let h=`<h1>The path</h1><p class="sub">${U.length} units in 3 levels · about ${mins(totalDur)} min of audio in total (${mins(totalDur/1.6)} min at 1.6×). Go in order; each unit builds on the last.</p>`;
 LEVELS.forEach(l=>{const L=levelUnits(l);h+=`<h2>${l}</h2><ul class="unitlist">`;
  L.forEach(u=>{h+=`<li class="${unitDone(u)?"done":""}"><span class="num">${unitDone(u)?"✓":u.n}</span><a class="ut" href="#/u/${u.n}">${esc(u.title)}<br><span class="sub" style="font-weight:400">${esc(u.sub)}</span></a><span class="meta"><span class="tag ${u.platform}">${u.platform==="Both"?"Meta + Google":u.platform}</span><br>${u.audio?mins(u.audio.duration)+" min":""} · <span class="steps3" style="display:inline-flex">${STEPS.map(s=>`<i class="${stepDone(u,s)?"on":""}"></i>`).join("")}</span></span></li>`;});
  h+=`</ul><p><a class="btn ghost small" href="#/exam/${l}">🏁 ${l} checkpoint${(S.exam[l]||0)>=EXAM_PASS?" ✓ passed":""}</a></p>`;});
 h+=`<p><a class="btn" href="#/exam/final">🎓 Final exam</a>${(S.exam.final||0)>=EXAM_PASS?" ✓ passed":""}</p>`;main(h);}
function stepper(u,cur){return `<div class="stepper">${STEPS.map((s,i)=>`<a href="${stepHref(u,s)}" class="${cur===s?"on":""} ${stepDone(u,s)?"done":""}"><span class="n">${stepDone(u,s)?"✓":i+1}</span><span>${STEPNAME[s]}<small>${s==="listen"?(u.audio?mins(u.audio.duration)+" min audio + text":"read"):s==="try"?tasks(u).length+" tasks":u.quiz.length+" questions"}</small></span></a>`).join("")}</div>`;}
function unitHead(u){return `<div class="kicker">${esc(u.kicker)}</div><h1>Unit ${u.n}: ${esc(u.title)}</h1>`;}
function viewUnit(n,step,arg){const u=UN[n];if(!u){location.hash="#/";return;}setNav("path");renderSide(n);
 if(!step){const s=STEPS.find(s=>!stepDone(u,s))||"listen";location.replace(stepHref(u,s));return;}
 S.last=location.hash;save();$("#focusInfo").textContent=`Unit ${u.n} · ${STEPNAME[step]}`;
 if(step==="listen")return viewListen(u);if(step==="try")return viewTry(u,arg);if(step==="check")return viewCheck(u);}
/* ---------- Listen & read ---------- */
function viewListen(u){const seen=new Set();let h=unitHead(u)+stepper(u,"listen");
 h+=`<div class="goals"><b>After this unit you can:</b><ul>${u.goal.map(g=>`<li>${esc(g)}</li>`).join("")}</ul></div><div class="rd">`;
 u.lead.forEach((t,i)=>h+=`<p data-k="lead.${i}">${gloss(t,seen)}</p>`);
 u.lessons.forEach((L,li)=>{h+=`<h3 data-k="${L.k}" id="part${li+1}">Part ${li+1}. ${esc(L.title.replace(/\.$/,""))}</h3>`;
  L.items.forEach(it=>{if(it.t==="p")h+=`<p data-k="${it.k}">${gloss(it.text,seen)}</p>`;
   else if(it.t==="ex")h+=`<div class="ex" data-k="${it.k}"><b>Example: ${esc(it.head)}</b>${gloss(it.text,seen)}</div>`;
   else if(it.t==="apply")h+=`<div class="apply" data-k="${it.k}">${gloss(it.text,seen)}</div>`;
   else if(it.t==="warn")h+=`<div class="warn" data-k="${it.k}">${gloss(it.text,seen)}</div>`;
   else if(it.t==="fig"){const shot=it.file.startsWith("shots/");h+=`<figure class="${shot?"shot":"diagram"}"><a href="${esc(it.file)}" target="_blank" rel="noopener"><img src="${esc(it.file)}" alt="${esc(it.cap)}" loading="lazy"></a><figcaption>${esc(it.cap)}</figcaption></figure>`;}});});
 h+=`<p data-k="end" class="note">That's the end of the Unit ${u.n} tutorial. Next step: press <b>Try</b> and do the drills.</p></div>`;
 h+=`<h2>Cheat sheet</h2><div class="sheet"><ul>${u.sheet.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>`;
 h+=`<h2>Sources</h2><ul class="srcs">${u.src.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul><p class="sub">Facts checked against these official pages in November 2026. Platforms change often; when in doubt, the linked page wins.</p>`;
 const st=us(u.n);h+=`<div class="actions"><button class="btn ghost" id="btnRead">${stepDone(u,"listen")?"✓ Marked as done":"☐ I've read it (mark step done)"}</button><span class="spacer"></span><a class="btn next" href="${stepHref(u,"try")}">Next: Try →</a></div>`;
 main(h);
 $("#btnRead").onclick=()=>{st.read=true;save();updateTop();renderSide(u.n);$("#btnRead").textContent="✓ Marked as done";toast("Step 1 done. Next: Try");};
 if(u.audio)initPlayer(u);}
/* ---------- audio player with follow-along ---------- */
let AU=null, auTimer=null;
function stopAudio(){if(AU){try{AU.pause();}catch(e){}AU=null;}clearInterval(auTimer);const p=$("#player");if(p)p.remove();const b=$(".fa-back");if(b)b.remove();document.body.classList.remove("fa-dim");}
function initPlayer(u){const a=u.audio,st=us(u.n);
 const bar=document.createElement("div");bar.id="player";
 bar.innerHTML=`<button class="play" id="pPlay" aria-label="Play">▶</button><button class="btn small ghost" id="pBack" title="Back 15 s (J)">−15</button><button class="btn small ghost" id="pFwd" title="Forward 15 s (L)">+15</button>
 <span class="tm" id="pTime">0:00 / ${fmt(a.duration)}</span><input type="range" id="pSeek" min="0" max="${Math.floor(a.duration)}" value="0" step="1" aria-label="Position">
 <select id="pMk" aria-label="Jump to part">${a.markers.map(m=>`<option value="${m.s}">${esc(m.t)}</option>`).join("")}</select>
 <select id="pRate" aria-label="Speed">${["0.8","1","1.25","1.4","1.6","1.8","2"].map(r=>`<option value="${r}" ${S.rate===r?"selected":""}>${r}×</option>`).join("")}</select>
 <label title="Highlight and scroll to the sentence being read"><input type="checkbox" id="pFol" ${S.follow?"checked":""}> Follow along</label>`;
 document.body.appendChild(bar);
 const au=new Audio("audio/"+a.file);au.preload="metadata";AU=au;au.playbackRate=+S.rate;
 const segs=a.segs.map(s=>({s:s.s,e:s.s+s.d,el:$(`.rd [data-k="${s.k}"]`)})).filter(x=>x.el);
 let cur=null,userAt=0,lastSave=0;
 const back=document.createElement("button");back.className="btn small fa-back";back.textContent="↓ Back to the audio";back.hidden=true;document.body.appendChild(back);
 au.addEventListener("loadedmetadata",()=>{au.playbackRate=+S.rate;if(st.pos&&st.pos<a.duration-5)au.currentTime=st.pos;tick();});
 au.addEventListener("play",()=>{$("#pPlay").textContent="❚❚";$("#pPlay").setAttribute("aria-label","Pause");dim();});
 au.addEventListener("pause",()=>{$("#pPlay").textContent="▶";$("#pPlay").setAttribute("aria-label","Play");dim();});
 au.addEventListener("ended",()=>{st.listen=true;st.pos=0;save();updateTop();renderSide(u.n);toast("Tutorial finished ✓ Next: Try");});
 function dim(){document.body.classList.toggle("fa-dim",S.follow&&!au.paused);}
 function centre(el){const r=el.getBoundingClientRect(),top=r.top+scrollY-(innerHeight-90)/2+r.height/2;window.scrollTo({top:Math.max(0,top),behavior:"smooth"});}
 function tick(){if(AU!==au)return;const t=au.currentTime;$("#pTime").textContent=`${fmt(t)} / ${fmt(a.duration)}`;if(document.activeElement!==$("#pSeek"))$("#pSeek").value=Math.floor(t);
  let mi=0;a.markers.forEach((m,i)=>{if(t>=m.s-0.2)mi=i;});if($("#pMk").selectedIndex!==mi)$("#pMk").selectedIndex=mi;
  let el=null;for(const s of segs){if(s.s<=t+0.25)el=s.el;else break;}
  if(el!==cur){if(cur)cur.classList.remove("speaking");cur=el;if(el){el.classList.add("speaking");if(S.follow&&!au.paused&&Date.now()-userAt>5000)centre(el);}}
  back.hidden=!(S.follow&&!au.paused&&Date.now()-userAt<=5000&&cur);
  if(Math.abs(t-lastSave)>5){st.pos=t;lastSave=t;if(t>=a.duration*0.9)st.listen=true;save();}}
 auTimer=setInterval(tick,250);
 const user=()=>{userAt=Date.now();};window.addEventListener("wheel",user,{passive:true});window.addEventListener("touchmove",user,{passive:true});
 back.onclick=()=>{userAt=0;if(cur)centre(cur);};
 $("#pPlay").onclick=()=>au.paused?au.play().catch(()=>toast("Press play again to start audio")):au.pause();
 $("#pBack").onclick=()=>{au.currentTime=Math.max(0,au.currentTime-15);};$("#pFwd").onclick=()=>{au.currentTime=Math.min(a.duration,au.currentTime+15);};
 $("#pSeek").oninput=e=>{au.currentTime=+e.target.value;userAt=0;};
 $("#pMk").onchange=e=>{au.currentTime=+e.target.value;userAt=0;if(au.paused)au.play().catch(()=>{});};
 $("#pRate").onchange=e=>{S.rate=e.target.value;au.playbackRate=+S.rate;save();};
 $("#pFol").onchange=e=>{S.follow=e.target.checked;save();dim();if(S.follow&&cur){userAt=0;centre(cur);}};
 $$(".rd [data-k]").forEach(el=>{el.title="Click to play from here";el.addEventListener("dblclick",()=>{const s=a.segs.find(x=>x.k===el.dataset.k);if(s){au.currentTime=s.s;au.play().catch(()=>{});}});});}
/* ---------- Try: one task at a time ---------- */
function viewTry(u,arg){const ts=tasks(u);let i=arg!=null&&arg!==""?+arg:ts.findIndex(x=>!taskDone(u,x));if(i<0||isNaN(i))i=0;i=Math.min(i,ts.length-1);const x=ts[i];
 let h=unitHead(u)+stepper(u,"try");
 h+=`<div class="taskhead"><span class="count">Task ${i+1} of ${ts.length}</span><span class="sub">${ts.filter(t=>taskDone(u,t)).length} done · unlimited retries</span></div>`;
 h+=`<div class="dots">${ts.map((t,k)=>`<a href="#/u/${u.n}/try/${k}" class="${taskDone(u,t)?"done":""} ${k===i?"cur":""}" title="${esc(t.title)}">${taskDone(u,t)?"✓":k+1}</a>`).join("")}</div><div id="taskbox"></div>`;
 const allDone=ts.every(t=>taskDone(u,t));
 h+=`<div class="actions" id="tryNav"><a class="btn ghost" href="#/u/${u.n}/try/${Math.max(0,i-1)}" ${i===0?'style="visibility:hidden"':""}>← Previous</a>${!allDone&&!us(u.n).tryMarked?`<button class="btn ghost small" id="btnTryMark" title="If you can't finish a task here, mark the step done and move on">Mark step done</button>`:""}<span class="spacer"></span>${i<ts.length-1?`<a class="btn next ${x.kind==="old"?"":"ghost"}" id="btnTaskNext" href="#/u/${u.n}/try/${i+1}">Next task →</a>`:`<a class="btn next" href="${stepHref(u,"check")}">Next: Check →</a>`}</div>`;
 main(h);const box=$("#taskbox");
 if(x.kind==="drill")renderDrill(box,u,x.i,()=>{save();refreshDots(u);});
 else{box.innerHTML=`<div class="note" style="margin-bottom:8px">From the <b>${x.t.app==="taste"?"Taste Playground":"Copy Workshop"}</b> · ${esc(x.t.kind)} · ${esc(x.t.title)} <a href="${esc(x.t.url.replace("?embed=1",""))}" target="_blank" rel="noopener" class="sub">open full app ↗</a></div><iframe class="frame" src="${esc(x.t.url)}" title="${esc(x.t.title)}"></iframe>`;}
 const m=$("#btnTryMark");if(m)m.onclick=()=>{us(u.n).tryMarked=true;save();updateTop();renderSide(u.n);toast("Try step marked done");m.remove();};}
function refreshDots(u){const ts=tasks(u);$$(".dots a").forEach((a,k)=>{const d=taskDone(u,ts[k]);a.classList.toggle("done",d);if(d)a.textContent="✓";});
 const c=$(".taskhead .sub");if(c)c.textContent=`${ts.filter(t=>taskDone(u,t)).length} done · unlimited retries`;updateTop();renderSide(u.n);
 const nb=$("#btnTaskNext");if(nb)nb.classList.remove("ghost");if(stepDone(u,"try"))toast("Try step done ✓ Next: Check");}
window.addEventListener("message",e=>{if(e.origin!==location.origin||!e.data||!e.data.aa)return;const m=location.hash.match(/^#\/u\/(\d+)\/try(?:\/(\d+))?/);if(!m)return;const u=UN[+m[1]];
 if(e.data.aa==="state")refreshDots(u);
 if(e.data.aa==="next"){const ts=tasks(u),i=m[2]!=null?+m[2]:ts.findIndex(x=>!taskDone(u,x));refreshDots(u);location.hash=i<ts.length-1?`#/u/${u.n}/try/${i+1}`:stepHref(u,"check");}
 if(e.data.aa==="back"){const i=m[2]!=null?+m[2]:0;if(i>0)location.hash=`#/u/${u.n}/try/${i-1}`;}});
/* ---------- drill engine (write / order / sort / pick / calc) ---------- */
const VAGUE=["premium","best","best-in-class","ultimate","elevate","revolutionary","amazing","innovative","high quality","high-quality","world-class","perfect","seamless","cutting-edge","game-changer","unique","leading","solutions","synergy","next level","next-level"];
const wc=t=>(String(t).trim().match(/[^\s]+/g)||[]).length, rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const CK={number:t=>/\d/.test(t),maxwords:(t,a)=>wc(t)>0&&wc(t)<=+a,minwords:(t,a)=>wc(t)>=+a,you:t=>/\byou(r|'re|rs)?\b/i.test(t),
 avoid:(t,a)=>!(a?a.split(","):VAGUE).some(w=>w.trim()&&new RegExp("(^|[^a-z])"+rx(w.trim())+"([^a-z]|$)","i").test(t)),
 include:(t,a)=>a.split(",").some(w=>w.trim()&&new RegExp(rx(w.trim()),"i").test(t)),lines:(t,a)=>t.split("\n").filter(x=>x.trim()).length>=+a,filled:t=>t.trim().length>0};
function renderDrill(box,u,di,onDone){let d=u.drills[di];const st=us(u.n),key=di;const TY={write:"✍️ Write",order:"↕️ Put in order",sort:"🗂️ Sort",pick:"⚖️ Pick the winner",calc:"🧮 Calculate"};
 let h=`<div class="task"><div class="kicker">${TY[d.type]} · new drill</div><h2 style="margin:.2em 0 .4em">${esc(d.title)}</h2>${d.prompt.map(p=>`<p>${esc(p)}</p>`).join("")}<div id="dbody"></div><div class="actions" id="dact"></div><div id="dfb"></div></div>`;
 box.innerHTML=h;const body=$("#dbody",box),act=$("#dact",box),fb=$("#dfb",box);
 const finish=()=>{st.drills[key]=true;onDone();};
 const model=()=>d.model.length?`<div class="model"><b>Model answer / why</b><br>${d.model.map(esc).join("<br>")}</div>`:"";
 if(d.type==="write"){const saved=(st.text||{})[di]||"";body.innerHTML=`<textarea id="wtxt" placeholder="Write here…">${esc(saved)}</textarea><ul class="checks" id="wck">${d.checks.map(c=>`<li>☐ ${esc(c.label)}</li>`).join("")}</ul>`;
  act.innerHTML=`<button class="btn" id="wgo">Check my answer</button><button class="btn ghost" id="wmod">Show model</button>`;
  const run=()=>{const t=$("#wtxt").value;st.text=st.text||{};st.text[di]=t;
   $("#wck").innerHTML=d.checks.map(c=>{const ok=CK[c.kind]?CK[c.kind](t,c.arg):false;return `<li class="${ok?"ok":"no"}">${ok?"✔":"✘"} ${esc(c.label)}</li>`;}).join("");};
  $("#wgo").onclick=()=>{run();fb.innerHTML=model()+`<p class="sub">Rewrite and check again as often as you like. The checks are simple rules, not a grade; compare with the model.</p>`;finish();};
  $("#wmod").onclick=()=>{fb.innerHTML=model();};}
 if(d.type==="order"){let ord=shuffle(d.items.map((t,i)=>i));if(ord.every((v,i)=>v===i)&&ord.length>1)ord.reverse();
  const draw=(checked)=>{body.innerHTML=`<ol class="ordl">${ord.map((v,k)=>`<li class="${checked?(v===k?"right":"wrong"):""}"><span class="t">${esc(d.items[v])}</span><button data-up="${k}" aria-label="Move up" ${k===0?"disabled":""}>↑</button><button data-dn="${k}" aria-label="Move down" ${k===ord.length-1?"disabled":""}>↓</button></li>`).join("")}</ol>`;
   $$("[data-up]",body).forEach(b=>b.onclick=()=>{const k=+b.dataset.up;[ord[k-1],ord[k]]=[ord[k],ord[k-1]];draw(false);});
   $$("[data-dn]",body).forEach(b=>b.onclick=()=>{const k=+b.dataset.dn;[ord[k+1],ord[k]]=[ord[k],ord[k+1]];draw(false);});};
  draw(false);act.innerHTML=`<button class="btn" id="ogo">Check order</button><button class="btn ghost" id="oshow">Show correct order</button>`;
  $("#ogo").onclick=()=>{draw(true);const ok=ord.every((v,k)=>v===k);fb.innerHTML=`<div class="fb ${ok?"ok":"no"}">${ok?"✔ All in the right order.":"Some steps are out of place (red). Move them and check again."}</div>`+(ok?model():"");if(ok)finish();};
  $("#oshow").onclick=()=>{ord=d.items.map((t,i)=>i);draw(true);fb.innerHTML=model();finish();};}
 if(d.type==="sort"){const items=shuffle(d.items.map(s=>{const [t,c]=s.split("=>").map(x=>x.trim());return {t,c};}));const pick={};
  body.innerHTML=items.map((it,k)=>`<div class="sortrow" data-r="${k}"><div>${esc(it.t)}</div><div class="cats">${d.cats.map(c=>`<button data-k="${k}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>`).join("");
  $$(".cats button",body).forEach(b=>b.onclick=()=>{pick[b.dataset.k]=b.dataset.c;$$(`.cats button[data-k="${b.dataset.k}"]`,body).forEach(x=>x.classList.toggle("sel",x===b));$(`.sortrow[data-r="${b.dataset.k}"]`,body).classList.remove("right","wrong");});
  act.innerHTML=`<button class="btn" id="sgo">Check</button>`;
  $("#sgo").onclick=()=>{let n=0;items.forEach((it,k)=>{const r=$(`.sortrow[data-r="${k}"]`,body),ok=pick[k]===it.c;if(ok)n++;r.classList.toggle("right",ok);r.classList.toggle("wrong",!ok);if(!ok&&pick[k]!=null){}});
   fb.innerHTML=`<div class="fb ${n===items.length?"ok":"no"}">${n} of ${items.length} right.${n<items.length?" Red rows: try another category.":""}</div>${model()}`;
   if(Object.keys(pick).length===items.length)finish();};}
 if(d.type==="pick"){d=Object.assign({},d,{pairs:d.pairs.map(p=>Math.random()<.5?p:Object.assign({},p,{a:p.b,b:p.a,ok:p.ok==="A"?"B":"A"}))});body.innerHTML=d.pairs.map((p,k)=>`<div class="card" style="margin:10px 0"><div class="pairs"><button class="opt" data-p="${k}" data-v="A"><span class="k">A</span><span>${esc(p.a)}</span></button><button class="opt" data-p="${k}" data-v="B"><span class="k">B</span><span>${esc(p.b)}</span></button></div><div class="pfb" id="pfb${k}"></div></div>`).join("");
  const ans={};$$(".opt",body).forEach(b=>b.onclick=()=>{const k=+b.dataset.p,p=d.pairs[k],ok=b.dataset.v===p.ok;ans[k]=true;
   $$(`.opt[data-p="${k}"]`,body).forEach(x=>{x.disabled=true;x.classList.toggle("right",x.dataset.v===p.ok);x.classList.toggle("wrong",x===b&&!ok);});
   $("#pfb"+k).innerHTML=`<div class="fb ${ok?"ok":"no"}">${ok?"✔ Right.":"✘ Not this time."} ${esc(p.e)}</div>`;
   if(Object.keys(ans).length===d.pairs.length){fb.innerHTML=model();finish();}});
  act.innerHTML=`<button class="btn ghost" id="preset">↺ Reset and try again</button>`;$("#preset").onclick=()=>renderDrill(box,u,di,onDone);}
 if(d.type==="calc"){body.innerHTML=d.calc.map((c,k)=>`<div class="calcrow" data-c="${k}"><span class="q">${esc(c.q)}</span><input type="text" inputmode="decimal" aria-label="Answer" data-i="${k}"><span class="cfb sub" id="cfb${k}"></span></div>`).join("");
  act.innerHTML=`<button class="btn" id="cgo">Check answers</button><button class="btn ghost" id="cshow">Show workings</button>`;
  const num=v=>parseFloat(String(v).replace(/\s/g,"").replace(/,(?=\d{3}\b)/g,"").replace(",",".").replace(/[^0-9.\-]/g,""));
  $("#cgo").onclick=()=>{let n=0;d.calc.forEach((c,k)=>{const v=num($(`[data-i="${k}"]`,body).value),ok=isFinite(v)&&Math.abs(v-c.a)<=c.tol+1e-9;if(ok)n++;
   $(`.calcrow[data-c="${k}"]`,body).classList.toggle("right",ok);$(`.calcrow[data-c="${k}"]`,body).classList.toggle("wrong",!ok);$("#cfb"+k).textContent=ok?"✔ "+c.e:"✘ try again";});
   fb.innerHTML=`<div class="fb ${n===d.calc.length?"ok":"no"}">${n} of ${d.calc.length} right.</div>`+(n===d.calc.length?model():"");if(n>0)finish();};
  $("#cshow").onclick=()=>{d.calc.forEach((c,k)=>{$("#cfb"+k).textContent="= "+c.a+" · "+c.e;});fb.innerHTML=model();finish();};}}
/* ---------- quiz engine (unit Check, checkpoints, final exam) ---------- */
let QZ=null;
function startQuiz(qs,opt){qs=qs.map(q=>{const ord=shuffle(q.o.map((_,k)=>k));return Object.assign({},q,{o:ord.map(k=>q.o[k]),a:ord.indexOf(q.a)});});QZ={qs,i:0,score:0,answered:false,opt};drawQuiz();}
function drawQuiz(){const z=QZ,q=z.qs[z.i],box=$("#quizbox");if(!box)return;
 box.innerHTML=`<div class="task"><div class="taskhead"><span class="count">Question ${z.i+1} of ${z.qs.length}</span><span class="sub">Score ${z.score}</span>${q.from?`<span class="tag">Unit ${q.from}</span>`:""}</div><div class="bar big"><div style="width:${100*z.i/z.qs.length}%"></div></div>
 <h2 style="margin:.6em 0 .3em;font-size:1.15em">${esc(q.q)}</h2><div class="opts">${q.o.map((o,k)=>`<button class="opt" data-k="${k}"><span class="k">${k+1}</span><span>${esc(o)}</span></button>`).join("")}</div><div id="qfb"></div>
 <div class="actions"><span class="sub">Keys 1–${q.o.length} answer · Enter next</span><button class="btn next" id="qnext" disabled>${z.i<z.qs.length-1?"Next →":"See result →"}</button></div></div>`;
 z.answered=false;$$(".opt",box).forEach(b=>b.onclick=()=>answerQuiz(+b.dataset.k));$("#qnext").onclick=nextQuiz;}
function answerQuiz(k){const z=QZ;if(!z||z.answered)return;const q=z.qs[z.i],ok=k===q.a;z.answered=true;if(ok)z.score++;
 $$("#quizbox .opt").forEach(b=>{const j=+b.dataset.k;b.disabled=true;if(j===q.a)b.classList.add("right");else if(j===k)b.classList.add("wrong");});
 $("#qfb").innerHTML=`<div class="fb ${ok?"ok":"no"}">${ok?"✔ Right.":"✘ Not quite."} ${esc(q.e)}</div>`;const n=$("#qnext");n.disabled=false;n.focus();}
function nextQuiz(){const z=QZ;if(!z||!z.answered)return;if(z.i<z.qs.length-1){z.i++;drawQuiz();return;}
 const pct=z.score/z.qs.length;z.opt.done(pct,z);}
function viewCheck(u){let h=unitHead(u)+stepper(u,"check");const st=us(u.n);
 h+=`<p class="sub">${u.quiz.length} questions, one at a time. Pass with ${Math.ceil(u.quiz.length*PASS)} right. Retake as often as you like. ${st.quiz.tries?`Best so far: ${Math.round(100*st.quiz.best)}%.`:""}</p><div id="quizbox"></div>`;main(h);
 startQuiz(shuffle(u.quiz),{done:(pct,z)=>{st.quiz.tries++;st.quiz.best=Math.max(st.quiz.best||0,pct);save();updateTop();renderSide(u.n);
  const pass=pct>=PASS,nu=UN[u.n+1];
  $("#quizbox").innerHTML=`<div class="task"><h2 style="margin-top:0">${pass?"✅ Passed":"Almost"}: ${z.score} of ${z.qs.length}</h2><p>${pass?(unitDone(u)?`Unit ${u.n} is complete.`:`Check passed. ${STEPS.filter(s=>!stepDone(u,s)).map(s=>STEPNAME[s]).join(" and ")} still to do in this unit.`):"Re-read the cheat sheet in Listen & read, then try again. Questions come in a new order."}</p>
  <div class="actions"><button class="btn ghost" id="qretry">↺ Retake</button><a class="btn ghost" href="${stepHref(u,"listen")}">Re-read the tutorial</a><span class="spacer"></span>${pass?(nu?`<a class="btn next" href="#/u/${nu.n}">Next unit: ${esc(nu.title.slice(0,40))}${nu.title.length>40?"…":""} →</a>`:`<a class="btn next" href="#/exam/final">Final exam →</a>`):""}${pass&&nu&&nu.level!==u.level?`<a class="btn ghost" href="#/exam/${u.level}">🏁 ${u.level} checkpoint</a>`:""}</div></div>`;
  $("#qretry").onclick=()=>viewCheck(u);}});}
function examQs(scope){let L=scope==="final"?U:levelUnits(scope);const per=scope==="final"?2:Math.max(2,Math.ceil(12/L.length));
 let qs=[];L.forEach(u=>shuffle(u.quiz).slice(0,per).forEach(q=>qs.push(Object.assign({from:u.n},q))));return shuffle(qs);}
function viewExam(scope){setNav("path");renderSide(null);const fin=scope==="final",L=fin?U:levelUnits(scope);if(!L.length){location.hash="#/";return;}
 const best=S.exam[scope]||0;let h=`<div class="kicker">${fin?"Cumulative":"Level checkpoint"}</div><h1>${fin?"🎓 Final exam":"🏁 "+scope+" checkpoint"}</h1>
 <p class="sub">${fin?"Questions from all 16 units":"Questions from Units "+L[0].n+"–"+L[L.length-1].n}, drawn at random each time. Pass with ${Math.round(EXAM_PASS*100)}%. Unlimited retakes. ${best?`Best: ${Math.round(best*100)}%.`:""}</p>
 ${fin?`<p class="note">Want more? The Taste Playground also has its own final exam (module 6.2) in the <a href="#/practice">Practice area</a>.</p>`:""}<div id="quizbox"></div>`;main(h);
 startQuiz(examQs(scope),{done:(pct,z)=>{S.exam[scope]=Math.max(best,pct);save();renderSide(null);const pass=pct>=EXAM_PASS;
  const miss={};z.qs.forEach(()=>{});
  $("#quizbox").innerHTML=`<div class="task"><h2 style="margin-top:0">${pass?"✅ Passed":"Not yet"}: ${z.score} of ${z.qs.length} (${Math.round(pct*100)}%)</h2><p>${pass?(fin?"You've proven the whole path. Keep practising in the Practice area.":"On to the next level."):"Look at the units the questions came from, re-read their cheat sheets, and retake."}</p><div class="actions"><button class="btn ghost" id="eretry">↺ Retake</button><span class="spacer"></span><a class="btn next" href="#/">Home →</a></div></div>`;
  $("#eretry").onclick=()=>viewExam(scope);}});}
/* ---------- practice, glossary, sources, progress ---------- */
function viewPractice(){setNav("practice");renderSide(null);const P=[
 ["Write copy",[["workshop/index.html#/workshop","✍️ Copy Workshop","Headlines, hooks, offers, CTAs and full ads, with guided reps"],["workshop/index.html#/checker","🔍 Copy checker","Paste any ad or email; a rule-based checker scores it instantly"],["workshop/index.html#/bank","🏦 Copy bank","Lines you saved from reps"]]],
 ["Train your taste",[["taste/index.html#/","🎯 Taste Playground","300+ real A/B tests and ad judgements, by module"],["taste/index.html#/speed","⚡ Speed rounds","10 quick calls against the clock"],["taste/index.html#/daily","🔎 Daily teardown","One real ad to pull apart each day"],["workshop/index.html#/lab","🧪 Ads Lab","Judge real ads from Sweden, the US and UK"],["taste/index.html#/swipe","★ Swipe file","Ads and lessons you starred"]]],
 ["Prove it",[["#/exam/final","🎓 Final exam","Cumulative, random questions from all units"],["taste/index.html#/t/t12-1-01","💼 Interview prep","What agencies look for, plus practice answers"],["taste/index.html#/review","🔁 Spaced review","Missed drills come back after 1, 3, 7, 14 and 30 days"],["workshop/index.html#/beliefs","💬 Confidence cards","Rebuild limiting beliefs about selling"]]]];
 let h=`<h1>Practice area</h1><p class="sub">Optional extras. The path already includes the important drills, so come here when you want more practice. No caps: practise as much as you like. These open the full original apps with their own menus; use “← Ads Academy” at the top left to come back.</p>`;
 P.forEach(([g,items])=>{h+=`<h2>${g}</h2><div class="grid3">${items.map(([href,t,d])=>`<a class="pcard" href="${href}"><b>${t}</b><span>${d}</span></a>`).join("")}</div>`;});main(h);}
function viewGlossary(){setNav("glossary");renderSide(null);const G=AA.glossary.slice().sort((a,b)=>a.t.localeCompare(b.t));
 main(`<h1>Glossary</h1><p class="sub">${G.length} terms in plain English. In the tutorials, dotted-underlined words show this definition when you hover or tap them.</p><input id="gq" type="search" placeholder="Search terms…" style="font:inherit;padding:8px 12px;border-radius:10px;border:1px solid var(--line);width:100%;max-width:400px"><dl class="glist" id="gl">${G.map(g=>`<div data-t="${esc(g.t.toLowerCase())} ${esc(g.d.toLowerCase())}"><dt>${esc(g.t)}</dt><dd>${esc(g.d)} <a class="sub" href="#/u/${g.u}">Unit ${g.u}</a></dd></div>`).join("")}</dl>`);
 $("#gq").oninput=e=>{const q=e.target.value.toLowerCase();$$("#gl>div").forEach(d=>d.hidden=q&&!d.dataset.t.includes(q));};}
function viewSources(){setNav(null);renderSide(null);const M={};U.forEach(u=>u.src.forEach(s=>{(M[s.url]=M[s.url]||{l:s.label,u:[]}).u.push(u.n);}));
 const shots=[];U.forEach(u=>u.lessons.forEach(L=>L.items.forEach(it=>{if(it.t==="fig"&&it.file.startsWith("shots/"))shots.push([u.n,it]);})));
 let h=`<h1>Sources</h1><p class="sub">Every platform fact in the tutorials was checked against these official pages in November 2026. Numbers quoted from Meta or Google (e.g. "9% better cost per conversion") are the platforms' own claims, measured by them.</p><ul class="srcs">${Object.entries(M).sort((a,b)=>a[1].l.localeCompare(b[1].l)).map(([url,v])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(v.l)}</a> <span class="sub">· Unit ${[...new Set(v.u)].join(", ")}</span></li>`).join("")}</ul>
 <h2>Screenshots</h2><p class="sub">Real screenshots of public pages, captured with headless Chrome in November 2026, shown for teaching with attribution. No screenshots of Ads Manager or Google Ads accounts are faked; account screens are explained with clearly labelled diagrams instead.</p><ul class="srcs">${shots.map(([n,it])=>`<li>Unit ${n}: ${esc(it.cap)}</li>`).join("")}</ul>
 <h2>Practice apps</h2><p class="sub">Sources for the drills, A/B tests and real ads: <a href="taste/SOURCES.md">Taste Playground sources</a> · <a href="workshop/SOURCES.md">Copy Workshop sources</a>.</p>
 <h2>About</h2><p class="sub">Audio is synthetic narration (Microsoft Edge neural voice). Tutorials are original text written for this course; short quotes are attributed. Built ${esc(AA.built)}.</p>`;main(h);}
function viewProgress(){setNav("progress");renderSide(null);const t=ext("aa-taste-v1"),w=ext("aa-ws-v1");const td=Object.keys(t.done||{}).length,wr=Object.values(w.reps||{}).filter(r=>r&&(r.done||r.best!=null)).length,wl=Object.values(w.lab||{}).filter(a=>a&&a.pick!=null).length;
 const hasOld=!!(localStorage.getItem("mtp-progress-v1")||localStorage.getItem("ccw-progress-v1"));
 let h=`<h1>Progress & backup</h1><table class="simple"><tr><th>Area</th><th>Done</th></tr><tr><td>Path steps</td><td>${stepsDone(U)} of ${U.length*3}</td></tr><tr><td>Units complete</td><td>${U.filter(unitDone).length} of ${U.length}</td></tr><tr><td>Taste Playground tasks</td><td>${td}</td></tr><tr><td>Copy Workshop reps</td><td>${wr}</td></tr><tr><td>Ads Lab items</td><td>${wl}</td></tr><tr><td>Checkpoints / final exam (best)</td><td>${LEVELS.concat(["final"]).map(l=>`${l}: ${S.exam[l]?Math.round(S.exam[l]*100)+"%":"–"}`).join(" · ")}</td></tr></table>
 <h2>Import from the old sites</h2><p class="sub">Progress from the Marketing Taste Playground and the Copy & Confidence Workshop is copied in automatically the first time (same website, same browser). ${hasOld?"Old-site data found in this browser.":"No old-site data found in this browser."} Use this button to merge it again; nothing you did here is lost.</p><button class="btn ghost" id="btnReimport" ${hasOld?"":"disabled"}>⤓ Merge old-site progress again</button>
 <h2>Backup</h2><p class="sub">Everything is saved only in this browser. Export a file now and then, and import it on another computer.</p><div class="actions"><button class="btn" id="btnExport">Export backup (.json)</button><label class="btn ghost">Import backup<input type="file" id="fileImp" accept=".json,application/json" hidden></label></div>
 <h2>Keyboard</h2><p class="sub"><span class="kbd">F</span> focus view · <span class="kbd">Esc</span> exit focus · <span class="kbd">S</span> show/hide path · <span class="kbd">P</span> play/pause audio · <span class="kbd">J</span>/<span class="kbd">L</span> back/forward 15 s · <span class="kbd">1</span>–<span class="kbd">4</span> answer · <span class="kbd">Enter</span> next</p>
 <h2>Reset</h2><button class="btn ghost small" id="btnReset">Reset Ads Academy path progress</button> <span class="sub">(doesn't touch the practice apps)</span>`;main(h);
 $("#btnExport").onclick=()=>{const data={app:"ads-academy",v:1,at:new Date().toISOString(),aa:S,taste:ext("aa-taste-v1"),ws:ext("aa-ws-v1")};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:"application/json"}));a.download="ads-academy-backup-"+new Date().toISOString().slice(0,10)+".json";document.body.appendChild(a);a.click();setTimeout(()=>a.remove(),100);toast("Backup downloaded");};
 $("#fileImp").onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(tx=>{try{const d=JSON.parse(tx);if(d.app!=="ads-academy"||!d.aa||d.aa.v!==1)throw 0;if(!confirm("Replace progress in this browser with the backup?"))return;
  localStorage.setItem(KEY,JSON.stringify(d.aa));if(d.taste&&Object.keys(d.taste).length)localStorage.setItem("aa-taste-v1",JSON.stringify(d.taste));if(d.ws&&Object.keys(d.ws).length)localStorage.setItem("aa-ws-v1",JSON.stringify(d.ws));S=load();updateTop();toast("Backup imported");viewProgress();}catch(err){alert("That file isn't an Ads Academy backup.");}});};
 const ri=$("#btnReimport");if(ri)ri.onclick=()=>{const n=mergeOld();updateTop();toast(`Merged: ${n} items`);viewProgress();};
 $("#btnReset").onclick=()=>{if(confirm("Reset your Ads Academy path progress? Practice-app progress is kept.")){S=blank();save();updateTop();viewProgress();}};}
function mergeOld(){let n=0;const o=ext("mtp-progress-v1"),t=ext("aa-taste-v1");if(o&&o.v===1){if(!t.v){localStorage.setItem("aa-taste-v1",JSON.stringify(o));n+=Object.keys(o.done||{}).length;}else{t.done=t.done||{};Object.keys(o.done||{}).forEach(k=>{if(!t.done[k]){t.done[k]=o.done[k];n++;}});["answers","swipe","srs","misses"].forEach(f=>{if(o[f]&&typeof o[f]==="object"){t[f]=Object.assign({},o[f],t[f]||{});}});localStorage.setItem("aa-taste-v1",JSON.stringify(t));}}
 const ow=ext("ccw-progress-v1"),w=ext("aa-ws-v1");if(ow&&ow.v===1){if(!w.v){localStorage.setItem("aa-ws-v1",JSON.stringify(ow));n+=Object.keys(ow.reps||{}).length;}else{["reps","lab","beliefs","srs","unlock"].forEach(f=>{w[f]=w[f]||{};Object.keys(ow[f]||{}).forEach(k=>{if(!w[f][k]){w[f][k]=ow[f][k];n++;}});});localStorage.setItem("aa-ws-v1",JSON.stringify(w));}}return n;}
/* ---------- router + keys ---------- */
function route(){tipHide();updateTop();const h=location.hash||"#/";let m;
 if((m=h.match(/^#\/u\/(\d+)(?:\/(listen|try|check))?(?:\/(\d+))?/)))return viewUnit(+m[1],m[2],m[3]);
 if((m=h.match(/^#\/exam\/(final|Beginner|Intermediate|Expert)/)))return viewExam(m[1]);
 if(h.startsWith("#/path"))return viewPath();if(h.startsWith("#/practice"))return viewPractice();if(h.startsWith("#/glossary"))return viewGlossary();
 if(h.startsWith("#/sources"))return viewSources();if(h.startsWith("#/progress"))return viewProgress();return viewHome();}
window.addEventListener("hashchange",route);
function setFocus(on){document.body.classList.toggle("focus",on);}
$("#btnFocus").onclick=()=>setFocus(true);$("#btnExitFocus").onclick=()=>setFocus(false);
$("#btnSide").onclick=()=>{if(innerWidth<=900)document.body.classList.toggle("sideopen");else document.body.classList.toggle("noside");};
$("#side").addEventListener("click",e=>{if(e.target.closest("a")&&innerWidth<=900)document.body.classList.remove("sideopen");});
document.addEventListener("keydown",e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const typing=e.target.closest&&e.target.closest("input,textarea,select,[contenteditable]");
 if(e.key==="Escape"){setFocus(false);document.body.classList.remove("sideopen");tipHide();return;}if(typing)return;
 if(e.key==="f"||e.key==="F"){setFocus(!document.body.classList.contains("focus"));return;}
 if(e.key==="s"||e.key==="S"){$("#btnSide").click();return;}
 if(AU&&(e.key==="p"||e.key==="P")){e.preventDefault();$("#pPlay").click();return;}
 if(AU&&e.key==="j"){AU.currentTime=Math.max(0,AU.currentTime-15);return;}if(AU&&e.key==="l"){AU.currentTime+=15;return;}
 if(QZ&&$("#quizbox .opt")){if(/^[1-9]$/.test(e.key)){const b=$$("#quizbox .opt")[+e.key-1];if(b&&!b.disabled){b.click();e.preventDefault();}return;}
  if(e.key==="Enter"&&QZ.answered&&!e.target.closest("button,a")){e.preventDefault();nextQuiz();return;}}});
if(innerWidth<=900)document.body.classList.remove("noside");
route();
