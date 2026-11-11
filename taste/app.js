(function(){
"use strict";
const D=window.MTP_DATA, TASKS=D.tasks, BYID={}, KEY="aa-taste-v1";
TASKS.forEach((t,i)=>{t._i=i;BYID[t.id]=t;});
const MODS={};D.modules.forEach(m=>MODS[m.id]=m);
const TRK={};D.tracks.forEach(t=>TRK[t.id]=t);
const GRADED=new Set(["pick","goodbad","missing","lesson"]);
const INTERVALS=[1,3,7,14,30];
const TYPE_LABEL={pick:"Pick the winner",goodbad:"Good or bad",missing:"What's missing",write:"Write it yourself",lesson:"Lesson + drill",teardown:"Teardown"};
/* ---------- dates (local, Europe/Stockholm on Oskar's laptop) ---------- */
let dayOffset=0;
function dstr(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),x=String(d.getDate()).padStart(2,"0");return `${y}-${m}-${x}`;}
function today(){const d=new Date();d.setDate(d.getDate()+dayOffset);return dstr(d);}
function addDays(ds,n){const [y,m,x]=ds.split("-").map(Number);const d=new Date(y,m-1,x);d.setDate(d.getDate()+n);return dstr(d);}
/* ---------- state + migration (key stays mtp-progress-v1, v stays 1, schema 2 adds fields) ---------- */
function blank(){return{v:1,schema:2,done:{},res:{},writes:{},checks:{},why:{},misses:{},last:null,sidebar:true,
  srs:{},att:{},swipe:{},goal:15,daily:{},speed:{best:0,runs:[]},teardowns:{},wcheck:{},session:null};}
function migrate(s){const b=blank();const o=Object.assign(b,s);
 if(!s.schema||s.schema<2){o.schema=2;const t=today();
  Object.keys(o.misses||{}).forEach(id=>{if(!o.srs[id])o.srs[id]={step:0,due:t};});
  Object.keys(o.res||{}).forEach(id=>{const r=o.res[id];if(r&&r.correct!=null&&!o.att[id])o.att[id]=[[r.at||0,!!r.correct]];
    if(r&&r.at){const ds=dstr(new Date(r.at));o.daily[ds]=o.daily[ds]||[];if(!o.daily[ds].includes(id))o.daily[ds].push(id);}});
  o.migratedFrom=1;}
 ["srs","att","swipe","daily","teardowns","wcheck","done","res","writes","checks","why","misses"].forEach(k=>{if(!o[k]||typeof o[k]!=="object")o[k]={};});
 if(!o.speed||typeof o.speed!=="object")o.speed={best:0,runs:[]};
 if(!(o.goal>0))o.goal=15;
 return o;}
let S=load();
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(s&&s.v===1&&typeof s.done==="object"){const m=migrate(s);if(!s.schema){localStorage.setItem(KEY,JSON.stringify(m));}return m;}}catch(e){}return blank();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}aaPost();}
function aaPost(){if(!window.AA_EMBED||parent===window)return;try{const t=curTask();parent.postMessage({aa:'state',app:'taste',id:t&&t.id,done:!!(t&&S.done[t.id])},location.origin);}catch(e){}}
let ui={sel:{},flags:{},revealed:{},review:false,opened:{}};
function resetUI(){ui={sel:{},flags:{},revealed:{},review:false,opened:{}};}
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove("show"),1800);}
function doneCount(list){return list.filter(t=>S.done[t.id]).length;}
function modTasks(mid){return TASKS.filter(t=>t.module===mid);}
function evLabel(e){return D.evidence_labels[e]||e;}
function isRevealed(t){return !!(ui.revealed[t.id]||S.res[t.id]&&S.res[t.id].revealed);}
function pct(a){return a[1]?Math.round(100*a[0]/a[1])+"%":"–";}
/* ---------- daily goal + streak ---------- */
function markDaily(key){const t=today();S.daily[t]=S.daily[t]||[];if(!S.daily[t].includes(key))S.daily[t].push(key);}
function todayCount(){return (S.daily[today()]||[]).length;}
function streak(){let n=0,d=today();if(((S.daily[d]||[]).length)<S.goal)d=addDays(d,-1);while(((S.daily[d]||[]).length)>=S.goal){n++;d=addDays(d,-1);}return n;}
/* ---------- spaced repetition ---------- */
function dueIds(){const t=today();return Object.keys(S.srs).filter(id=>BYID[id]&&S.srs[id].due<=t).sort((a,b)=>S.srs[a].due<S.srs[b].due?-1:1);}
function schedule(id,correct){const t=today(),cur=S.srs[id];
 if(correct===false){S.srs[id]={step:0,due:addDays(t,1),last:t};return;}
 if(correct===true&&cur){if(cur.due<=t){const step=cur.step+1;if(step>=INTERVALS.length){delete S.srs[id];}else S.srs[id]={step,due:addDays(t,INTERVALS[step]),last:t};}}}
function record(id,correct,mode){S.att[id]=S.att[id]||[];S.att[id].push([Date.now(),!!correct,mode||"t"]);if(S.att[id].length>30)S.att[id]=S.att[id].slice(-30);}
/* ---------- rule-based writing checker (runs fully in the browser, no external calls) ---------- */
const WB=(alts,g)=>new RegExp(`(?<![\\p{L}\\p{N}])(?:${alts})(?![\\p{L}\\p{N}])`,g?"giu":"iu");
const CK={
 you:WB("you|your|you're|yours|du|dig|din|ditt|dina|ni|er|ert|era",true),
 youT:WB("you|your|you're|yours|du|dig|din|ditt|dina|ni|er|ert|era"),
 we:WB("we|our|us|we're|ours|vi|oss|vår|vårt|våra",true),
 audience:WB("owners?|ägare|klinikägare|clinics?|kliniker?|runners?|löpare|parents?|föräldrar|stockholm|göteborg|malmö|uppsala|södermalm|new in|ny i|if you|om du|du som|ni som"),
 offer:/(free|gratis|kostnadsfri|\bkr\b|kronor|€|\$|%|trial|patch test|report|rapport|consultation|konsultation|price|pris|discount|rabatt|first visit|första besök|sample|prov|returns?|retur)/i,
 cta:WB("book|boka|reply|svara|tap|tryck|click|klicka|call|ring|send|skicka|get|få|shop|handla|sign up|try|testa|order|beställ|link below|länk|want me to|vill du|should i|ska jag|download|ladda ner|read|läs"),
 interest:/(want me to|should i send|interested\?|worth a look|vill du att jag|ska jag skicka|intressant\?|vill du ha)/i,
 meeting:/(\b\d{1,2}\s?(min|minutes|minuter)\b.*(call|möte|meeting|samtal))|((call|möte|meeting) (on|på) (mon|tue|wed|thu|fri|måndag|tisdag|onsdag|torsdag|fredag))|(book a (call|meeting))|(boka ett möte)/i,
 hype:WB("amazing|best|revolutionary|guaranteed?|explosive|unlock|game[- ]?changer|world[- ]class|miracle|incredible|ultimate|skyrocket|bäst|bästa|fantastisk|unik|revolutionerande|garanterat?|världsklass|mirakel|otrolig",true),
 policy:/(hate your|hatar du|tired of looking|ugly|\bfat\b|wrinkles|rynkor|years younger|år yngre|in \d+ days|på \d+ dagar|in one session|på en behandling|guaranteed results|garanterat resultat|before and after|före och efter|do you suffer|lider du|you suffer|your (acne|pain|wrinkles|weight|back pain)|botox|botulinum)/i,
 platitude:/(passionate|high[- ]quality|quality care|trusted|leading|state[- ]of[- ]the[- ]art|we care|brinner för|kvalitet|trygghet|ledande|modern klinik|wide range|brett utbud|bred kompetens|lösningar|solutions)/i,
 badopen:/(hope this (email )?finds you|hope you('re| are) (well|doing)|my name is|jag heter|hoppas allt är bra|hoppas du mår bra)/i,
 personal:/(^|\n)\s*(hi|hey|hello|hej|hejsan)\s+[A-ZÅÄÖ][a-zåäö]+|(searched|noticed|saw|looked at|sökte|såg|märkte|kollade)/i,
 time3:/\b0\s*[–-]\s*[1-3]\s*s\b|\b0[:.]0[0-3]\b|\bhook\b/i,
};
function words(t){return (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)||[]);}
function sentences(t){return t.split(/[.!?\n]+/).map(x=>x.trim()).filter(x=>words(x).length>0);}
function syllables(w){w=w.toLowerCase().replace(/[^a-z]/g,"");if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,"").replace(/^y/,"");const m=w.match(/[aeiouy]{1,2}/g);return m?m.length:1;}
function readability(text,lang){const w=words(text),s=Math.max(1,sentences(text).length);if(!w.length)return null;
 if(lang==="sv"){const long=w.filter(x=>x.length>6).length;const lix=Math.round(w.length/s+100*long/w.length);return {kind:"LIX",value:lix,ok:lix<=40,label:lix<=30?"very easy":lix<=40?"easy":lix<=50?"medium":"hard"};}
 const syl=w.reduce((a,x)=>a+syllables(x),0);const g=Math.max(0,Math.round(0.39*w.length/s+11.8*syl/w.length-15.59));return {kind:"Grade",value:g,ok:g<=8,label:g<=5?"very easy":g<=8?"plain":g<=12?"getting dense":"hard"};}
function checkCopy(text,kind,lang){text=String(text||"");const w=words(text),wc=w.length,lines=text.split("\n").filter(x=>x.trim());const first=(lines[0]||"");
 const R=[];const add=(id,label,ok,weight,fix,good)=>R.push({id,label,ok:!!ok,weight,fix,good});
 const sv=lang==="sv";
 if(!wc)return {score:0,results:[],wc:0,empty:true};
 const you=(text.match(CK.you)||[]).length,we=(text.match(CK.we)||[]).length;
 add("number",sv?"Specifik siffra/fakta":"Specific number or fact",/\d/.test(text),2,
   sv?"Lägg till EN kontrollerbar siffra (pris, minuter, antal omdömen, år). Okänd? Skriv [X] — hitta aldrig på.":"Add ONE checkable number (price, minutes, number of reviews, years). Don't know it yet? Write [X] — never invent.",
   sv?"Siffror gör texten trovärdig (Hopkins).":"Numbers make it believable (Hopkins).");
 add("reader",sv?"Läsaren kallas fram":"Calls out the reader",CK.audience.test(first)||CK.youT.test(first)||/\?/.test(first),2,
   sv?"Nämn läsaren eller deras situation i första raden, t.ex. 'Klinikägare i Stockholm:' eller 'Ny i Uppsala?'.":"Name the reader or their situation in the FIRST line, e.g. 'Clinic owners in Stockholm:' or 'New in Uppsala?'.",
   sv?"Första raden väljer läsaren (Hopkins).":"The first line picks the reader (Hopkins).");
 if(kind!=="subject"&&kind!=="rsa")add("youwe",sv?"Mer 'du/ni' än 'vi'":"More 'you' than 'we'",you>=we,1,
   sv?`Du skriver 'vi/oss' ${we} gånger och 'du/ni' ${you}. Skriv om en mening från ert perspektiv till läsarens.`:`You wrote 'we/our' ${we}× and 'you/your' ${you}×. Rewrite one 'we' sentence from the reader's side.`,
   sv?"Texten handlar om läsaren.":"It's about the reader, not you.");
 if(kind!=="subject")add("offer",sv?"Tydligt erbjudande":"Clear offer",CK.offer.test(text),2,
   sv?"Säg exakt vad läsaren får: 'gratis 15 min kontroll', 'fast pris 495 kr', 'gratis rapport inom 24 h'.":"Say exactly what they get: 'free 15-min check', 'fixed price 495 kr', 'free report within 24 h'.",
   sv?"Konkret erbjudande sänker risken (Hormozi).":"A concrete offer lowers risk (Hormozi).");
 if(kind!=="subject"&&kind!=="headline")add("cta",sv?"En tydlig uppmaning":"One clear call to action",CK.cta.test(text),2,
   sv?"Avsluta med EN handling: 'Boka online på 2 min' eller (kallmejl) 'Vill du att jag skickar rapporten?'.":"End with ONE action: 'Book online in 2 min' or (cold email) 'Want me to send the report?'.",
   sv?"Läsaren vet vad nästa steg är.":"The reader knows the next step.");
 if(kind==="email"){
  add("interest",sv?"Intresse-CTA (litet ja)":"Interest-based CTA (small yes)",CK.interest.test(text)&&!CK.meeting.test(text),2,
   sv?"Byt mötesfrågan mot ett litet ja: 'Vill du att jag skickar …?' (Gong: intresse-CTA slår mötestid i kalla mejl).":"Swap the meeting ask for a small yes: 'Want me to send…?' (Gong: interest CTAs beat specific-time asks in cold email).",
   sv?"Lätt att svara ja på.":"Easy to say yes to.");
  add("personal",sv?"Personlig första rad":"Personal first line",CK.personal.test(text)&&!CK.badopen.test(text),2,
   sv?"Börja med namnet och en iakttagelse om DERAS verksamhet ('Hej Anna — såg att…'). Stryk 'Hoppas allt är bra'.":"Open with their name and an observation about THEIR business ('Hi Anna — searched…'). Cut 'Hope this finds you well'.",
   sv?"Relevant personalisering höjer svar (Belkins).":"Relevant personalization lifts replies (Belkins).");
  const q=(text.match(/\?/g)||[]).length;
  add("questions",sv?"1–3 frågor":"1–3 questions",q>=1&&q<=3,1,sv?"Ställ 1–3 frågor — mejl med frågor får fler svar (Boomerang).":"Ask 1–3 questions — emails with questions get more replies (Boomerang).","");
  add("length",sv?"Längd 25–125 ord":"Length 25–125 words",wc>=25&&wc<=125,2,
   sv?`${wc} ord. Sikta på 50–125 (Boomerang). ${wc>125?"Stryk allt om er själva.":"Lägg till varför det spelar roll för dem."}`:`${wc} words. Aim for 50–125 (Boomerang). ${wc>125?"Cut everything about yourself.":"Add why it matters to them."}`,"");
 }
 if(kind==="subject")add("length",sv?"2–6 ord":"2–6 words",wc>=2&&wc<=6,2,sv?`${wc} ord. Korta, personliga ämnesrader (2–4 ord) presterar bäst (Belkins).`:`${wc} words. Short personal subjects (2–4 words) perform best (Belkins).`,"");
 if(kind==="headline"){const longest=Math.max(...lines.map(l=>words(l).length));add("length",sv?"Rubrik ≤ 12 ord":"Headline ≤ 12 words",longest<=12,2,sv?`Längsta rubriken har ${longest} ord. Korta till ≤ 12 (helst ≤ 8).`:`Your longest headline is ${longest} words. Cut to ≤ 12 (ideally ≤ 8).`,"");}
 if(kind==="primary")add("length",sv?"Första raden ≤ 125 tecken":"First line ≤ 125 characters",first.length<=125,1,sv?`Första raden är ${first.length} tecken — Meta kortar ofta texten runt 125 tecken. Lägg kroken först.`:`First line is ${first.length} characters — Meta often truncates around 125. Put the hook first.`,"");
 if(kind==="rsa"){const over=lines.filter(l=>/^H\d/i.test(l.trim())).map(l=>l.replace(/^H\d+\s*[:.)-]\s*/i,"").trim()).filter(l=>l.length>30);
   add("length",sv?"Rubriker ≤ 30 tecken":"Headlines ≤ 30 characters",over.length===0,2,sv?`${over.length} rubrik(er) är över 30 tecken: ${over.slice(0,2).join(" | ")}`:`${over.length} headline(s) over 30 characters: ${over.slice(0,2).join(" | ")}`,"");}
 if(kind==="script")add("hook3",sv?"Krok inom 3 sekunder":"Hook within 3 seconds",CK.time3.test(text),2,sv?"Markera 0–3 s och lägg huvudbudskapet där (TikTok: 63 % av annonserna med högst CTR gör det).":"Mark 0–3s and put the key message there (TikTok: 63% of top-CTR ads do).","");
 const rd=readability(text,lang);
 if(rd&&kind!=="subject")add("read",sv?`Läsbarhet (LIX ${rd.value}, ${rd.label})`:`Reading level (grade ${rd.value}, ${rd.label})`,rd.ok,1,
   sv?"Kortare meningar och kortare ord. Sikta på LIX ≤ 40 (klarspråk).":"Shorter sentences, shorter words. Aim for grade ≤ 8 (Boomerang: 3rd-grade emails got the most replies).","");
 const hy=(text.match(CK.hype)||[]);const bang=(text.match(/!/g)||[]).length;const caps=w.filter(x=>x.length>3&&x===x.toUpperCase()&&/[A-ZÅÄÖ]/.test(x)).length;
 add("hype",sv?"Ingen hype":"No hype",hy.length===0&&bang<=1&&caps<=1,2,
   sv?`Stryk ${[hy.length?"'"+[...new Set(hy.map(x=>x.toLowerCase()))].join("', '")+"'":"",bang>1?bang+" utropstecken":"",caps>1?"VERSALER":""].filter(Boolean).join(", ")} — ersätt med ett bevis (siffra, namn, process).`:`Cut ${[hy.length?"'"+[...new Set(hy.map(x=>x.toLowerCase()))].join("', '")+"'":"",bang>1?bang+" exclamation marks":"",caps>1?"ALL CAPS":""].filter(Boolean).join(", ")} — replace with proof (a number, a name, a process).`,"");
 add("policy",sv?"Policysäker (Meta + svensk lag)":"Policy-safe (Meta health & personal attributes)",!CK.policy.test(text),3,
   sv?"Ta bort negativ självbild, tidslöften ('på 7 dagar'), 'lider du av…' och läkemedelsnamn som Botox (receptbelagt — får inte marknadsföras till allmänheten).":"Remove negative self-image ('hate your…'), timed promises ('in 7 days'), 'do you suffer…' and drug names like Botox (prescription — can't be advertised to the public in Sweden).","");
 add("platitude",sv?"Inga floskler":"No platitudes",!CK.platitude.test(text),1,
   sv?"Byt floskler ('kvalitet', 'brinner för', 'lösningar') mot ett konkret faktum.":"Swap platitudes ('quality', 'passionate', 'solutions') for one concrete fact.","");
 const tot=R.reduce((a,r)=>a+r.weight,0),got=R.reduce((a,r)=>a+(r.ok?r.weight:0),0);
 return {score:Math.round(100*got/tot),results:R,wc,readability:rd};}
function checkerHTML(res,lang){if(res.empty)return `<div class="checker" id="checkerBox"><p>Write something first, then check it.</p></div>`;
 const sv=lang==="sv",bad=res.results.filter(r=>!r.ok),good=res.results.filter(r=>r.ok);
 const lvl=res.score>=85?"strong":res.score>=65?"ok":"weak";
 return `<div class="checker ${lvl}" id="checkerBox"><div class="ckhead"><div class="ckscore" id="checkerScore">${res.score}</div><div><strong>${sv?"Copy-check":"Copy check"}: ${lvl==="strong"?(sv?"stark":"strong"):lvl==="ok"?(sv?"okej — fixa punkterna nedan":"OK — fix the points below"):(sv?"svag — börja med punkt 1":"weak — start with fix #1")}</strong><div class="sub">${res.wc} ${sv?"ord":"words"} · ${sv?"regelbaserad kontroll i webbläsaren mot principerna (Hopkins, Ogilvy, Caples, Meta-policy, Gong, Boomerang, Belkins)":"rule-based check in your browser against the principles (Hopkins, Ogilvy, Caples, Meta policy, Gong, Boomerang, Belkins)"}. ${sv?"Den kan inte bedöma idén — bara hantverket.":"It can't judge the idea — only the craft."}</div></div></div>
 ${bad.length?`<h4>${sv?"Fixa nu":"Fix next"} (${bad.length})</h4><ol class="ckfix">${bad.sort((a,b)=>b.weight-a.weight).map(r=>`<li data-ck="${r.id}"><strong>✗ ${esc(r.label)}</strong> — ${esc(r.fix)}</li>`).join("")}</ol>`:""}
 ${good.length?`<h4>${sv?"Bra":"Strengths"} (${good.length})</h4><ul class="ckok">${good.map(r=>`<li data-ck="${r.id}">✓ ${esc(r.label)}${r.good?` <span class="sub">— ${esc(r.good)}</span>`:""}</li>`).join("")}</ul>`:""}</div>`;}
/* ---------- mock ad renderer (SVG) ---------- */
function wrapText(txt,maxChars){const w=String(txt).split(/\s+/);const lines=[];let cur="";w.forEach(x=>{if((cur+" "+x).trim().length>maxChars){if(cur)lines.push(cur);cur=x;}else cur=(cur+" "+x).trim();});if(cur)lines.push(cur);return lines;}
function face(x,y,r,look){const skin="#e9b98f";const ex=look==="away"?r*0.28:0;
 return `<g><circle cx="${x}" cy="${y+r*1.9}" r="${r*1.5}" fill="#3d5a80"/><circle cx="${x}" cy="${y}" r="${r}" fill="${skin}"/><path d="M${x-r} ${y-r*0.2} Q${x} ${y-r*1.6} ${x+r} ${y-r*0.2} Q${x+r*0.6} ${y-r*0.8} ${x} ${y-r*0.75} Q${x-r*0.6} ${y-r*0.8} ${x-r} ${y-r*0.2}Z" fill="#4a2f1b"/><circle cx="${x-r*0.35+ex}" cy="${y}" r="${r*0.09}" fill="#222"/><circle cx="${x+r*0.35+ex}" cy="${y}" r="${r*0.09}" fill="#222"/><path d="M${x-r*0.3+ex} ${y+r*0.4} Q${x+ex} ${y+r*0.6} ${x+r*0.3+ex} ${y+r*0.4}" stroke="#7a3b2e" stroke-width="${r*0.07}" fill="none"/></g>`;}
function mockSvg(m){const W=360,H=360;let g=`<rect width="${W}" height="${H}" fill="${m.bg}"/>`;
 const f=m.focal||"one";
 if(f==="map"){for(let i=0;i<8;i++){g+=`<line x1="0" y1="${i*48}" x2="${W}" y2="${i*48+30}" stroke="#ffffff" stroke-width="10" opacity=".8"/>`;}
   g+=`<rect x="40" y="200" width="70" height="50" fill="#cfe3cf"/><rect x="230" y="60" width="90" height="60" fill="#cfe3cf"/>`;
   [[90,120,"1"],[180,170,"2"],[270,230,"3"]].forEach(p=>{g+=`<path d="M${p[0]} ${p[1]} l-14 -24 a16 16 0 1 1 28 0z" fill="#d93025"/><text x="${p[0]}" y="${p[1]-26}" font-size="13" fill="#fff" text-anchor="middle" font-weight="700">${p[2]}</text>`;});
   g+=`<circle cx="300" cy="300" r="34" fill="none" stroke="#1f5fbf" stroke-width="5"/><path d="M300 300 l-12 -20 a14 14 0 1 1 24 0z" fill="#7d7d7d"/><text x="300" y="276" font-size="15" text-anchor="middle" font-weight="700" fill="#1f5fbf">#7</text>`;}
 else if(f==="collage"){const cols=["#c9ada7","#9a8c98","#4a4e69","#f2cc8f","#81b29a","#e07a5f","#3d405b","#a8dadc","#e9c46a"];for(let i=0;i<9;i++){g+=`<rect x="${12+(i%3)*116}" y="${12+Math.floor(i/3)*116}" width="104" height="104" fill="${cols[i]}"/>`;}}
 else if(f==="split"){g+=`<rect x="0" y="0" width="180" height="${H}" fill="#f4a3a3"/><rect x="180" y="0" width="180" height="${H}" fill="#ffd0d0"/><ellipse cx="90" cy="230" rx="70" ry="90" fill="#e8a07a"/><ellipse cx="270" cy="230" rx="50" ry="90" fill="#e8a07a"/><text x="90" y="40" font-size="18" text-anchor="middle" fill="#7a0000" font-weight="700">BEFORE</text><text x="270" y="40" font-size="18" text-anchor="middle" fill="#7a0000" font-weight="700">AFTER</text>`;}
 else if(f==="logo"){g+=`<circle cx="180" cy="160" r="70" fill="none" stroke="${m.fg}" stroke-width="8"/>`;}
 else if(f==="gradient"){g=`<defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6c5ce7"/><stop offset="1" stop-color="#00cec9"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#gr)"/>`;}
 else if(f==="beach"){g+=`<rect y="200" width="${W}" height="160" fill="#f6d58e"/><rect width="${W}" height="200" fill="#8ecae6"/><circle cx="300" cy="60" r="30" fill="#ffd166"/>`;}
 else if(f==="arm"){g+=`<path d="M0 250 Q180 200 360 230 L360 300 Q180 280 0 320Z" fill="#e9b98f"/><circle cx="170" cy="250" r="16" fill="none" stroke="#1f5fbf" stroke-width="4"/>`;}
 if(m.face){g+=face(m.overlay?250:180,m.overlay?150:150,m.overlay?52:70,m.face);}
 const n=m.clutter||0;if(n&&f!=="collage"){const toks=(m.badge||"★ NEW % SALE TOP HOT").split(/\s+/);for(let i=0;i<n;i++){const x=40+((i*97)%280),y=40+((i*61)%260);g+=`<circle cx="${x}" cy="${y}" r="30" fill="${["#ffbe0b","#fb5607","#ff006e","#8338ec","#3a86ff","#06d6a0"][i%6]}"/><text x="${x}" y="${y+5}" font-size="13" text-anchor="middle" fill="#fff" font-weight="700">${esc(toks[i%toks.length])}</text>`;}}
 if(m.overlay){const sz={xs:13,s:20,m:28,l:38}[m.size||"m"]||28;const mc=Math.floor((m.face?200:320)/(sz*0.55));const lines=wrapText(m.overlay,mc);const lh=sz*1.2;const y0=m.size==="xs"?24:Math.max(40,H-40-lines.length*lh);
   const x=m.face?24:W/2,anchor=m.face?"start":"middle";
   if(m.contrast!=="low"&&m.size!=="xs"){g+=`<rect x="${m.face?12:16}" y="${y0-sz}" width="${m.face?210:W-32}" height="${lines.length*lh+sz*0.5}" rx="8" fill="${m.bg}" opacity=".55"/>`;}
   lines.forEach((l,i)=>{g+=`<text x="${x}" y="${y0+i*lh}" font-size="${sz}" font-weight="700" fill="${m.fg}" text-anchor="${anchor}" font-family="Arial,sans-serif">${esc(l)}</text>`;});}
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mockup ad image">${g}</svg>`;}
function mockAd(m,primary){return `<div class="mock"><div class="mh"><div class="av"></div><div><div class="pn">${esc(m.page)}</div><div class="sp">Sponsored · mockup</div></div></div>${primary?`<div class="pt">${esc(primary)}</div>`:""}${mockSvg(m)}<div class="mf"><div class="hl">${esc(m.headline||"")}</div><div class="cta">${esc(m.cta||"Learn more")}</div></div></div><div class="mocklabel">MOCKUP — made for practice, not a real ad</div>`;}

/* ---------- layout / outline / topbar ---------- */
function renderOutline(curId){let h="";D.tracks.forEach(tr=>{h+=`<div class="ol-track">Track ${tr.id} · ${esc(tr.title)}</div>`;
  D.modules.filter(m=>m.track===tr.id).forEach(m=>{const ts=modTasks(m.id),dc=doneCount(ts);const open=curId&&BYID[curId]&&BYID[curId].module===m.id;
   h+=`<details class="ol-mod${dc===ts.length?" complete":""}" data-mod="${m.id}"${open?" open":""}><summary><span class="mt">${m.id} ${esc(m.title)}</span><span class="cnt">${dc}/${ts.length}</span></summary><ul class="ol-tasks">`;
   ts.forEach((t,k)=>{h+=`<li><a href="#/t/${t.id}" data-id="${t.id}" class="${S.done[t.id]?"done ":""}${t.id===curId?"cur":""}"><span class="ck">${S.done[t.id]?"✓":""}</span><span class="tt">${k+1}. ${esc(t.title)}</span>${S.swipe[t.id]?`<span class="star" title="In swipe file">★</span>`:""}</a></li>`;});
   h+=`</ul></details>`;});});
 $("#outline").innerHTML=h;const cur=$("#outline a.cur");if(cur)cur.scrollIntoView({block:"nearest"});}
function updateTop(){const d=doneCount(TASKS);$("#topbarFill").style.width=(100*d/TASKS.length)+"%";$("#topbarText").textContent=`${d}/${TASKS.length}`;
 $("#missCount").textContent=Object.keys(S.misses).filter(id=>BYID[id]).length;$("#dueCount").textContent=dueIds().length;$("#swipeCount").textContent=Object.keys(S.swipe).length;
 const tc=todayCount();$("#todayFill").style.width=Math.min(100,100*tc/S.goal)+"%";$("#todayText").textContent=`${tc}/${S.goal}`;$("#streakText").textContent=streak();
 $("#todayBox").classList.toggle("met",tc>=S.goal);}
function applySidebar(){document.body.classList.toggle("nosidebar",!S.sidebar);}
function setNav(id){$$("#topbar nav a").forEach(a=>a.classList.toggle("on",a.id===id));}

/* ---------- stats ---------- */
function stats(){const out={all:[0,0]};TASKS.forEach(t=>{if(t.type!=="pick")return;const r=S.res[t.id];if(!r||r.correct==null)return;const e=t.evidence_type;out[e]=out[e]||[0,0];out[e][1]++;out.all[1]++;if(r.correct){out[e][0]++;out.all[0]++;}});return out;}
function skill(){const by={track:{},type:{},pr:{},all:[0,0]};const bump=(o,k,c)=>{o[k]=o[k]||[0,0];o[k][1]++;if(c)o[k][0]++;};
 Object.keys(S.att).forEach(id=>{const t=BYID[id];if(!t)return;(S.att[id]||[]).forEach(a=>{const c=!!a[1];bump(by.track,t.track,c);bump(by.type,t.type,c);t.principles.forEach(p=>bump(by.pr,p,c));by.all[1]++;if(c)by.all[0]++;});});
 return by;}
function weakest(n){const sk=skill();return Object.keys(sk.pr).filter(p=>sk.pr[p][1]>=2&&D.principles[p]).map(p=>({p,acc:sk.pr[p][0]/sk.pr[p][1],n:sk.pr[p][1]})).sort((a,b)=>a.acc-b.acc||b.n-a.n).slice(0,n||3);}
function nextUndone(from){for(let i=from;i<TASKS.length;i++)if(!S.done[TASKS[i].id])return TASKS[i];for(let i=0;i<from;i++)if(!S.done[TASKS[i].id])return TASKS[i];return null;}

/* ---------- home ---------- */
function todayCard(){const tc=todayCount(),due=dueIds().length;
 return `<div class="card today" id="todayCard"><div class="todayrow"><div><div class="sub">Today's goal</div><div class="stat"><span id="homeToday">${tc}</span> / <span id="homeGoal">${S.goal}</span> tasks</div><div class="bar big"><div style="width:${Math.min(100,100*tc/S.goal)}%"></div></div>
 <label class="sub goalset">Daily goal <input id="goalInput" type="number" min="1" max="200" value="${S.goal}"> tasks/day</label></div>
 <div><div class="sub">Streak</div><div class="stat">🔥 <span id="homeStreak">${streak()}</span> day${streak()===1?"":"s"}</div><div class="sub">Days you hit your goal in a row.</div></div>
 <div><div class="sub">Due today (spaced repetition)</div><div class="stat" id="homeDue">${due}</div>${due?`<a class="btn small" id="btnDueHome" href="#/t/${dueIds()[0]}?due">▶ Review due</a>`:`<div class="sub">Missed tasks come back after 1, 3, 7, 14 and 30 days.</div>`}</div></div>
 <div class="quick"><a class="btn ghost small" href="#/speed" id="qSpeed">⚡ 5-second speed round</a><a class="btn ghost small" href="#/daily" id="qDaily">🔎 Daily ad teardown</a><a class="btn ghost small" href="#/dashboard" id="qDash">📊 Skill dashboard</a><a class="btn ghost small" href="#/checker" id="qChecker">✍ Copy checker</a></div></div>`;}
function bindGoal(){const g=$("#goalInput");if(g)g.onchange=()=>{const v=Math.max(1,Math.min(200,parseInt(g.value,10)||15));S.goal=v;save();updateTop();toast(`Daily goal: ${v} tasks`);setTimeout(route,0);};}
function viewHome(){setNav("navHome");const d=doneCount(TASKS),st=stats();const cont=S.last&&BYID[S.last]&&!S.done[S.last]?BYID[S.last]:nextUndone(S.last&&BYID[S.last]?BYID[S.last]._i:0);
 let h=`<div class="wrap"><h1>Marketing Taste Playground</h1><p class="sub">Train your eye and your hand: pick the winner, spot what's missing, write it yourself and get instant feedback. Meta, TikTok, Google, offers, cold email, clinics and Swedish copy. Every example links to its source and says what kind of evidence it is.</p>
 <div class="card" style="margin:16px 0"><div style="display:flex;justify-content:space-between;align-items:baseline"><strong>Overall progress</strong><span id="homeProgText">${d} of ${TASKS.length} tasks done (${Math.round(100*d/TASKS.length)}%)</span></div><div class="bar big" style="margin:10px 0 14px"><div style="width:${100*d/TASKS.length}%"></div></div>
 ${cont?`<a class="btn big" id="btnContinue" href="#/t/${cont.id}">▶ ${d?"Continue where I left off":"Start Track 1"}</a> <span class="sub" style="margin-left:10px">${esc(cont.module)} · ${esc(cont.title)}</span>`:`<strong>All tasks done! 🎉</strong>`}</div>
 ${todayCard()}
 <div class="cards"><div class="card"><div class="sub">Pick-the-winner accuracy</div><div class="stat" id="accAll">${pct(st.all)}</div><div class="sub">${st.all[0]} of ${st.all[1]} correct</div></div>
 <div class="card"><div class="sub">By evidence type</div><table class="stats"><tr><td>Proven tests</td><td>${pct(st.proven_test||[0,0])}</td></tr><tr><td>Case studies / benchmarks</td><td>${pct(st.case_study||[0,0])}</td></tr><tr><td>Long-running</td><td>${pct(st.long_running||[0,0])}</td></tr><tr><td>Teaching pairs</td><td>${pct(st.teaching||[0,0])}</td></tr></table></div>
 <div class="card"><div class="sub">Review queue</div><div class="stat">${Object.keys(S.misses).filter(id=>BYID[id]).length}</div><a href="#/review">Review my misses →</a></div></div>
 <h2>Learning path</h2>`;
 D.tracks.forEach(tr=>{const tts=TASKS.filter(t=>t.track===tr.id);h+=`<div class="trk" data-track="${tr.id}"><h3>Track ${tr.id}: ${esc(tr.title)} <span class="sub" style="font-weight:400">· ${doneCount(tts)}/${tts.length}</span></h3>`;
  D.modules.filter(m=>m.track===tr.id).forEach(m=>{const ts=modTasks(m.id),dc=doneCount(ts),first=ts.find(t=>!S.done[t.id])||ts[0];
   h+=`<div class="modrow" data-mod="${m.id}"><span class="ck">${dc===ts.length?"✓":""}</span><a href="#/t/${first.id}">${m.id} ${esc(m.title)}</a><div class="bar mbar"><div style="width:${100*dc/ts.length}%"></div></div><span class="cnt">${dc}/${ts.length}</span></div>`;});h+=`</div>`;});
 h+=`<h2>Evidence labels</h2><ul class="legend">${Object.keys(D.evidence_labels).map(k=>`<li><span class="ev ${k}">${esc(D.evidence_labels[k])}</span></li>`).join("")}<li><span class="ev realimg">REAL AD IMAGE (public domain / CC BY-SA, credited)</span></li><li><span class="mocklabel inline">MOCKUP — made for practice, not a real ad</span></li></ul>
 <p class="sub">Honesty notes: Meta's Ad Library shows no performance data for non-political ads, so "long-running" is only a proxy. Vendor benchmarks (Gong, Boomerang, Belkins, Woodpecker, Meta, TikTok, Google) are reported results, often correlational. "Why it won" notes on real tests are our interpretation. Teaching examples (incl. all metric numbers in Track 11) are written for practice. Meta Ad Library creatives are not copied here (copyright + Meta's terms) — open them live via the links.</p>
 <h2>Keyboard</h2><p><span class="kbd">1</span>–<span class="kbd">9</span> pick · <span class="kbd">Enter</span> reveal / next · <span class="kbd">←</span>/<span class="kbd">→</span> back / next · <span class="kbd">M</span> mark done · <span class="kbd">B</span> save to swipe file · <span class="kbd">C</span> check my draft (write tasks) · <span class="kbd">F</span> focus mode · <span class="kbd">Esc</span> exit focus · <span class="kbd">S</span> toggle outline · <span class="kbd">Ctrl</span>+<span class="kbd">Enter</span> reveal while typing · Speed round: <span class="kbd">1</span>/<span class="kbd">2</span> answer, <span class="kbd">Enter</span> start</p>
 <h2>Your data</h2><p class="sub">Progress, written answers, swipe file and streaks are saved only in this browser (localStorage key <code>aa-taste-v1</code>). Export a backup now and then.</p>
 <button class="btn ghost" id="btnExport">⬇ Export progress JSON</button> <label class="btn ghost" style="display:inline-block">⬆ Import JSON<input type="file" id="fileImport" accept="application/json,.json" hidden></label> <button class="btn ghost" id="btnReset" style="border-color:var(--bad);color:var(--bad)">Reset all progress</button>
 <p class="sub" style="margin-top:30px">Sources for every example: see each task's source link, or <a href="https://github.com/oskaraxels/marketing-playground/blob/main/SOURCES.md">SOURCES.md</a>.</p></div>`;
 $("#main").innerHTML=h;renderOutline(null);bindGoal();
 $("#btnExport").onclick=exportJSON;$("#fileImport").onchange=importJSON;$("#btnReset").onclick=()=>{if(confirm("Reset ALL progress, written answers, swipe file and streaks? This cannot be undone.")){S=blank();resetUI();save();toast("Progress reset");route();}};}

/* ---------- review: due today (SRS) + all misses ---------- */
function viewReview(){setNav("navReview");const ids=Object.keys(S.misses).filter(id=>BYID[id]),due=dueIds(),t0=today();
 const up=Object.keys(S.srs).filter(id=>BYID[id]&&S.srs[id].due>t0).sort((a,b)=>S.srs[a].due<S.srs[b].due?-1:1);
 let h=`<div class="wrap"><h1>Review</h1><p class="sub">Spaced repetition: a task you miss comes back after 1 day, then 3, 7, 14 and 30 days each time you get it right on its due day. Miss it again and it restarts at 1 day.</p>
 <div class="card"><h2 style="margin-top:0">Due today <span class="pill" id="dueTodayCount">${due.length}</span></h2>${due.length?`<a class="btn big" id="btnStartDue" href="#/t/${due[0]}?due">▶ Review ${due.length} due task${due.length>1?"s":""}</a><ol class="reviewlist" id="dueList">${due.map(id=>`<li><a href="#/t/${id}?due">${esc(BYID[id].module)} · ${esc(BYID[id].title)}</a> <span class="sub">step ${S.srs[id].step+1}/${INTERVALS.length}</span></li>`).join("")}</ol>`:`<p>Nothing due today. ${up.length?`Next review: <strong>${S.srs[up[0]].due}</strong>.`:""}</p>`}</div>
 <h2>Review my misses</h2>`;
 if(!ids.length)h+=`<p>No misses in the queue. Tasks you get wrong are added here automatically; answer them right to clear them.</p><a class="btn" href="#/">Back home</a>`;
 else{h+=`<p class="sub">${ids.length} task(s) you got wrong. Each opens fresh so you can answer again. A correct answer removes it from this list (its spaced-repetition reviews continue).</p><a class="btn" id="btnStartReview" href="#/t/${ids[0]}?review">▶ Start review</a><ol class="reviewlist">${ids.map(id=>`<li><a href="#/t/${id}?review">${esc(BYID[id].module)} · ${esc(BYID[id].title)}</a></li>`).join("")}</ol>`;}
 if(up.length)h+=`<h2>Coming up</h2><table class="stats wide" id="upcoming"><tr><th>Due</th><th>Task</th><th>Step</th></tr>${up.slice(0,30).map(id=>`<tr><td>${S.srs[id].due}</td><td><a href="#/t/${id}">${esc(BYID[id].title)}</a></td><td>${S.srs[id].step+1}/${INTERVALS.length}</td></tr>`).join("")}</table>`;
 $("#main").innerHTML=h+`</div>`;renderOutline(null);}

/* ---------- task view ---------- */
function principlesHTML(t){return `<div class="chips">${t.principles.map(p=>{const P=D.principles[p];return P?`<a class="chip" href="${esc(P.source_url)}" target="_blank" rel="noopener" title="${esc(P.source_name)}">${esc(P.label)}</a>`:"";}).join("")}</div>`;}
function sourceHTML(t){return `<div class="src">Source: <a class="srclink" href="${esc(t.source_url)}" target="_blank" rel="noopener">${esc(t.source_name)}</a>${t.field_url?` · <a class="srclink" href="${esc(t.field_url)}" target="_blank" rel="noopener">Open this Ad Library search</a>`:""}</div>`;}
function evHTML(t){return `<span class="ev ${t.evidence_type}">${esc(evLabel(t.evidence_type))}</span>`;}
function imgHTML(im){return im?`<figure class="realad"><img src="${esc(im.src)}" alt="${esc(im.alt)}" loading="lazy"><figcaption><span class="ev realimg">REAL AD IMAGE</span> ${im.cap?esc(im.cap)+" ":""}${esc(im.credit)} · <a class="srclink" href="${esc(im.page_url)}" target="_blank" rel="noopener">file &amp; licence</a></figcaption></figure>`:"";}
function optInner(o){return `<span class="txt">${esc(o.text)}</span>${o.mock?mockAd(o.mock,""):""}`;}
function qmode(){const m=location.hash.match(/\?(review|due|drill)/);return m?m[1]:null;}
function viewTask(id,mode){const t=BYID[id];if(!t){location.hash="#/";return;}setNav(null);
 if(mode&&!ui.opened[mode+id+today()]){ui.opened[mode+id+today()]=1;delete ui.revealed[id];delete ui.sel[id];delete ui.flags[id];if(S.res[id]&&GRADED.has(t.type))S.res[id].revealed=false;}
 ui.review=mode;S.last=id;save();
 const ms=modTasks(t.module),k=ms.indexOf(t)+1,rev=isRevealed(t),res=S.res[id]||{};
 const ML={review:"Review mode",due:"Due today (spaced repetition)",drill:"Practise my weakest"};
 let h=`<div class="wrap" data-task="${t.id}" data-type="${t.type}"${t.lang==="sv"?' lang="sv"':""}><div class="crumbs">Track ${t.track} · ${esc(MODS[t.module].id)} ${esc(MODS[t.module].title)} · task ${k} of ${ms.length}${mode?` · <strong id="modeLabel">${ML[mode]}</strong>`:""}</div>
 <div class="evrow">${evHTML(t)}<span class="typetag">${esc(TYPE_LABEL[t.type])}</span><button class="swipebtn${S.swipe[id]?" on":""}" id="btnSwipe" title="Save to swipe file (B)">${S.swipe[id]?"★ Saved":"☆ Save to swipe file"}</button></div>`;
 const sel=ui.sel[id]!=null?ui.sel[id]:(res.choice!=null?res.choice:null);
 if(t.type==="pick"){h+=`<div class="prompt">${esc(t.prompt)}</div>${t.context?`<div class="context">${esc(t.context)}</div>`:""}${imgHTML(t.img)}<div class="opts${t.options.length>2?" multi":""}">${t.options.map((o,i)=>{let c="opt";if(sel===i)c+=" sel";if(rev)c+=i===t.answer?" win":" lose";return `<button class="${c}" data-opt="${i}"><span class="key">${i+1}</span>${optInner(o)}${rev?`<span class="tag">${i===t.answer?(t.evidence_type==="teaching"||t.evidence_type==="principle"?"✓ Stronger (expert answer)":"✓ WINNER"):"✗"}</span>`:""}</button>`;}).join("")}</div>
   <label class="why" for="why">Why do you think so? (optional — saved)</label><textarea id="why" placeholder="Type your reasoning before revealing…">${esc(S.why[id]||"")}</textarea>`;}
 else if(t.type==="goodbad"){h+=`<div class="prompt">${esc(t.prompt)}</div><div class="artifact">${esc(t.artifact)}</div>${t.mock?mockAd(t.mock,""):""}${imgHTML(t.img)}<div class="gbrow">${["good","bad"].map((v,i)=>{let c="opt";if(sel===i)c+=" sel";if(rev)c+=v===t.answer?" win":" lose";return `<button class="${c}" data-opt="${i}"><span class="key">${i+1}</span><span class="txt">${v==="good"?"👍 Good":"👎 Bad"}</span>${rev&&v===t.answer?`<span class="tag">✓ Expert rating</span>`:""}</button>`;}).join("")}</div>
   <label class="why" for="why">Why? (optional)</label><textarea id="why">${esc(S.why[id]||"")}</textarea>`;}
 else if(t.type==="missing"){const fl=ui.flags[id]||res.flags||[];h+=`<div class="prompt">${esc(t.prompt)}</div><div class="artifact">${esc(t.artifact)}</div>${t.mock?mockAd(t.mock,""):""}<div class="flags">${Object.keys(D.flags).map(f=>{let c="";if(rev){const exp=t.answer.includes(f),ch=fl.includes(f);c=exp&&ch?"hit":exp?"miss":ch?"extra":"";}return `<label class="${c}"><input type="checkbox" data-flag="${f}" ${fl.includes(f)?"checked":""} ${rev?"disabled":""}> <span>${esc(D.flags[f])}${rev&&t.answer.includes(f)?" <strong>✓ expert</strong>":""}</span></label>`;}).join("")}</div>`;}
 else if(t.type==="write"){h+=`<div class="prompt">${esc(t.prompt)}</div><label class="why" for="wtext">Your answer (auto-saved)</label><textarea id="wtext" class="big" placeholder="Write your version here first. Then press 'Check my draft' (C) for instant feedback, and reveal the model answers.">${esc(S.writes[id]||"")}</textarea>
   <div class="checkrow"><button class="btn ghost" id="btnCheck">✍ Check my draft <span class="kbd">C</span></button><span class="sub">Instant rule-based feedback: numbers, reader callout, offer, CTA, length, reading level, you-vs-we, hype, Meta policy.${S.wcheck[id]?` Last score: <strong>${S.wcheck[id].score}</strong>`:""}</span></div><div id="checkArea"></div>`;}
 else if(t.type==="teardown"){h+=`<div class="prompt">${esc(t.prompt)}</div>${t.intro?`<div class="context">${esc(t.intro)}</div>`:""}${imgHTML(t.img)}${t.metric?`<div class="metric"><strong>Reported result:</strong> ${esc(t.metric)}</div>`:""}<ol class="parts">${t.parts.map(p=>`<li><strong>${esc(p.label)}:</strong> ${esc(p.text)}${rev?`<span class="note">→ ${esc(p.note)}</span>`:""}</li>`).join("")}</ol><label class="why" for="why">Before revealing: which part does the heavy lifting, and why? (optional)</label><textarea id="why">${esc(S.why[id]||"")}</textarea>`;}
 else if(t.type==="lesson"){h+=`<div class="prompt">${esc(t.prompt)}</div><div class="lessonbody">${esc(t.body)}</div><div class="example"><strong>Real example:</strong> ${esc(t.example)}</div><h2 style="font-size:1.05em">Mini drill</h2><div class="prompt" style="font-size:1em">${esc(t.drill.q)}</div><div class="opts">${t.drill.options.map((o,i)=>{let c="opt";if(sel===i)c+=" sel";if(rev)c+=i===t.drill.answer?" win":" lose";return `<button class="${c}" data-opt="${i}"><span class="key">${i+1}</span><span class="txt">${esc(o)}</span>${rev&&i===t.drill.answer?`<span class="tag">✓ Better</span>`:""}</button>`;}).join("")}</div>`;}
 h+=`<div id="revealArea">${rev?revealHTML(t):`<button class="btn big" id="btnReveal">Reveal <span class="kbd" style="color:#16181d">Enter</span></button>`}</div>`;
 const pos=t._i;h+=`<div class="navrow"><button class="btn ghost" id="btnBack" ${pos===0&&!mode?"disabled":""}>← Back</button><button class="donebtn${S.done[id]?" on":""}" id="btnDone">${S.done[id]?"☑ Done":"☐ Mark done"}</button><span class="spacer"></span><button class="btn" id="btnNext">Next →</button></div><div class="hint">1–9 pick · Enter reveal/next · ←/→ navigate · M mark done · B save · ${t.type==="write"?"C check draft · ":""}F focus · Esc exit focus · S outline</div></div>`;
 $("#main").innerHTML=h;renderOutline(id);
 $("#focusInfo").textContent=`${t.module} · task ${k}/${ms.length} · ${doneCount(TASKS)}/${TASKS.length} done · today ${todayCount()}/${S.goal}`;
 $$("[data-opt]").forEach(b=>b.onclick=()=>choose(t,+b.dataset.opt));
 $$("[data-flag]").forEach(c=>c.onchange=()=>{const a=new Set(ui.flags[id]||[]);c.checked?a.add(c.dataset.flag):a.delete(c.dataset.flag);ui.flags[id]=[...a];});
 const why=$("#why");if(why)why.oninput=()=>{S.why[id]=why.value;save();};
 const wt=$("#wtext");if(wt)wt.oninput=()=>{S.writes[id]=wt.value;save();};
 const cb=$("#btnCheck");if(cb)cb.onclick=()=>runCheck(t);
 const rb=$("#btnReveal");if(rb)rb.onclick=()=>reveal(t);
 $("#btnSwipe").onclick=()=>toggleSwipe(id);
 bindReveal(t);
 $("#btnBack").onclick=()=>go(-1);$("#btnNext").onclick=()=>go(1);$("#btnDone").onclick=()=>toggleDone(id);
 $("#main").focus({preventScroll:true});window.scrollTo(0,0);}
function runCheck(t){const txt=($("#wtext")||{}).value||S.writes[t.id]||"";const r=checkCopy(txt,t.kind||"other",t.lang||"en");$("#checkArea").innerHTML=checkerHTML(r,t.lang);
 if(!r.empty){S.wcheck[t.id]={score:r.score,at:Date.now()};save();}const b=$("#checkerBox");if(b)b.scrollIntoView({block:"nearest"});}
function bindReveal(t){$$("[data-check]").forEach(c=>c.onchange=()=>{const arr=S.checks[t.id]||[];arr[+c.dataset.check]=c.checked;S.checks[t.id]=arr;save();const sc=$("#selfScore");if(sc)sc.textContent=arr.filter(Boolean).length;});
 const tr=$("#btnRetry");if(tr)tr.onclick=()=>{delete ui.revealed[t.id];delete ui.sel[t.id];delete ui.flags[t.id];if(S.res[t.id])S.res[t.id]={};save();viewTask(t.id,ui.review);};}
function revealHTML(t){const r=S.res[t.id]||{};let h=`<div class="reveal" id="revealBox">`;
 if(GRADED.has(t.type)&&r.correct!=null){const sr=S.srs[t.id];h+=`<div class="result ${r.correct?"ok":"no"}">${r.correct?"✓ Correct — nice eye.":"✗ Not this time — added to your review queue."}${t.type==="missing"&&r.score?` (${esc(r.score)})`:""}${sr?` <span class="srsnote">Next review: ${sr.due}</span>`:""}</div>`;}
 if(t.type==="lesson")h+=`<p>${esc(t.drill.why)}</p>`;
 if(t.metric&&t.type!=="teardown")h+=`<div class="metric"><strong>${t.evidence_type==="teaching"?"Note":"Result / metric"}:</strong> ${esc(t.metric)}</div>`;
 if(t.evidence_type==="teaching")h+=`<div class="metric"><strong>Teaching example</strong> (written for practice, not real performance data). The "answer" is the expert call based on the cited principle.</div>`;
 if(t.type!=="lesson")h+=`<p><strong>Why:</strong> ${esc(t.explanation)}</p>`;
 if(t.type==="missing"&&t.answer)h+=`<p><strong>Expert diagnosis:</strong> ${t.answer.map(f=>esc(D.flags[f])).join(" · ")}</p>`;
 if(t.type==="write"){h+=`<h3>Model answers</h3>${t.model_answers.map((m,i)=>`<div class="model"><strong>Model ${i+1}${t.evidence_type==="teaching"?" (teaching example)":""}:</strong>\n${esc(m)}</div>`).join("")}<h3>Thought process, step by step</h3><ol class="steps">${t.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><h3>Self-score checklist (<span id="selfScore">${(S.checks[t.id]||[]).filter(Boolean).length}</span>/${t.checklist.length})</h3><div class="checklist">${t.checklist.map((c,i)=>`<label><input type="checkbox" data-check="${i}" ${(S.checks[t.id]||[])[i]?"checked":""}> ${esc(c)}</label>`).join("")}</div>`;}
 h+=`<div><strong>Principles:</strong></div>${principlesHTML(t)}${sourceHTML(t)}`;
 if(GRADED.has(t.type))h+=`<p style="margin-top:12px"><button class="btn ghost small" id="btnRetry">↺ Try again</button></p>`;
 return h+`</div>`;}
function choose(t,i){if(isRevealed(t))return;const n=t.type==="goodbad"?2:t.type==="lesson"?t.drill.options.length:t.type==="pick"?t.options.length:0;if(i>=n)return;ui.sel[t.id]=i;$$("[data-opt]").forEach(b=>b.classList.toggle("sel",+b.dataset.opt===i));}
function reveal(t){const id=t.id;if(isRevealed(t))return;
 let correct=null,extra={};
 if(t.type==="pick"||t.type==="goodbad"||t.type==="lesson"){const s=ui.sel[id];if(s==null){toast("Pick an option first (1, 2…)");return;}
   const ans=t.type==="goodbad"?(t.answer==="good"?0:1):t.type==="lesson"?t.drill.answer:t.answer;correct=s===ans;extra.choice=s;}
 if(t.type==="missing"){const fl=ui.flags[id]||[];const exp=t.answer;const hit=fl.filter(f=>exp.includes(f)).length,wrong=fl.filter(f=>!exp.includes(f)).length;correct=hit>=Math.ceil(exp.length/2)&&wrong<=1;extra.flags=fl;extra.score=`${hit}/${exp.length} found, ${wrong} extra`;}
 S.res[id]=Object.assign({revealed:true,at:Date.now()},extra,correct!=null?{correct}:{});
 if(correct!=null){record(id,correct,"t");schedule(id,correct);}
 if(correct===false)S.misses[id]=true;else if(correct===true)delete S.misses[id];
 ui.revealed[id]=true;const wasDone=S.done[id];S.done[id]=true;markDaily(id);save();updateTop();viewTask(id,ui.review);
 if(!wasDone&&todayCount()===S.goal)toast(`🎯 Daily goal reached! Streak: ${streak()} day${streak()===1?"":"s"}`);
 const rb=$("#revealBox");if(rb)rb.scrollIntoView({block:"nearest"});}
function toggleDone(id){if(S.done[id])delete S.done[id];else{S.done[id]=true;markDaily(id);}save();updateTop();const b=$("#btnDone");if(b){b.classList.toggle("on",!!S.done[id]);b.textContent=S.done[id]?"☑ Done":"☐ Mark done";}renderOutline(id);toast(S.done[id]?"Marked done ✓":"Unmarked");}
function toggleSwipe(id){if(S.swipe[id])delete S.swipe[id];else S.swipe[id]={at:Date.now(),note:""};save();updateTop();const b=$("#btnSwipe");if(b){b.classList.toggle("on",!!S.swipe[id]);b.textContent=S.swipe[id]?"★ Saved":"☆ Save to swipe file";}renderOutline(id);toast(S.swipe[id]?"Saved to swipe file ★":"Removed from swipe file");}
function curTask(){const m=location.hash.match(/^#\/t\/([^?]+)/);return m?BYID[m[1]]:null;}
function queueIds(mode){if(mode==="review")return Object.keys(S.misses).filter(x=>BYID[x]);if(mode==="due")return dueIds();if(mode==="drill")return (S.session&&S.session.ids||[]).filter(x=>BYID[x]);return [];}
function go(dir){if(window.AA_EMBED&&parent!==window){parent.postMessage({aa:dir>0?'next':'back',app:'taste'},location.origin);return;}const t=curTask();if(!t)return;const mode=ui.review;
 if(mode){if(dir<0){history.back();return;}
  if(mode==="drill"){const ids=queueIds("drill"),i=ids.indexOf(t.id);if(i>=0&&i<ids.length-1)location.hash=`#/t/${ids[i+1]}?drill`;else{toast("Weakest-areas drill finished 💪");location.hash="#/dashboard";}return;}
  const ids=queueIds(mode).filter(x=>x!==t.id&&!(ui.opened[mode+x+today()]&&isRevealed(BYID[x])));
  if(ids.length)location.hash=`#/t/${ids[0]}?${mode}`;else{toast(mode==="due"?"All due reviews done 🎉":"Review queue empty 🎉");location.hash="#/review";}return;}
 const j=t._i+dir;if(j>=0&&j<TASKS.length)location.hash=`#/t/${TASKS[j].id}`;else if(j>=TASKS.length){toast("That was the last task!");location.hash="#/";}}
/* ---------- speed rounds ---------- */
const SPEED_N=10, SPEED_MS=5000;
let SP=null;
function speedPool(mode){return TASKS.filter(t=>t.speed&&(mode==="proven"?t.type==="pick"&&t.evidence_type==="proven_test":mode==="sv"?t.lang==="sv":mode==="scroll"?t.type==="goodbad":true));}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function viewSpeed(){setNav("navSpeed");stopSpeed();const runs=S.speed.runs.slice(-8).reverse();
 const modes=[["mixed","Mixed quick picks","Pick-the-winner + good/bad from every track"],["proven","Proven tests only","Real A/B winners (Upworthy, Obama, Wikipedia, subject lines…)"],["scroll","Would this stop my scroll?","Good/bad calls, 5 seconds each"],["sv","Svenska","Swedish clinic copy only"]];
 let h=`<div class="wrap"><h1>⚡ Speed round</h1><p class="sub">${SPEED_N} items, <strong>5 seconds each</strong>. Trust your gut — that's the taste you're training. Keys: <span class="kbd">1</span>/<span class="kbd">2</span> answer, <span class="kbd">Enter</span> start. Wrong answers go into spaced repetition.</p>
 <div class="speedmodes">${modes.map(([k,a,b],i)=>`<label class="speedmode"><input type="radio" name="spmode" value="${k}" ${i===0?"checked":""}> <strong>${a}</strong><span class="sub">${b} · ${speedPool(k).length} items</span></label>`).join("")}</div>
 <button class="btn big" id="btnSpeedStart">▶ Start speed round <span class="kbd" style="color:#16181d">Enter</span></button>
 <div class="cards" style="margin-top:18px"><div class="card"><div class="sub">Best score</div><div class="stat" id="speedBest">${S.speed.best||0}</div></div><div class="card"><div class="sub">Rounds played</div><div class="stat">${S.speed.runs.length}</div></div></div>
 ${runs.length?`<h2>Recent rounds</h2><table class="stats wide"><tr><th>When</th><th>Mode</th><th>Correct</th><th>Score</th></tr>${runs.map(r=>`<tr><td>${new Date(r.at).toLocaleString("sv-SE").slice(0,16)}</td><td>${esc(r.mode)}</td><td>${r.correct}/${r.total}</td><td>${r.score}</td></tr>`).join("")}</table>`:""}</div>`;
 $("#main").innerHTML=h;renderOutline(null);$("#btnSpeedStart").onclick=startSpeed;}
function startSpeed(){const mode=($("input[name=spmode]:checked")||{}).value||"mixed";const pool=shuffle(speedPool(mode)).slice(0,SPEED_N);if(!pool.length){toast("No items for this mode");return;}
 SP={mode,items:pool,i:0,answers:[],score:0,t0:0,timer:null};speedItem();}
function stopSpeed(){if(SP&&SP.timer){clearInterval(SP.timer);}if(SP&&!SP.finished)SP=null;}
function speedItem(){const t=SP.items[SP.i];SP.t0=performance.now();SP.locked=false;
 const opts=t.type==="goodbad"?["👍 Good — it would stop me / it works","👎 Bad — I'd scroll past"]:t.options.map(o=>o.text);
 $("#main").innerHTML=`<div class="wrap speed" data-speed-i="${SP.i}" data-speed-task="${t.id}"><div class="speedtop"><span id="speedProg">${SP.i+1} / ${SP.items.length}</span><span>Score: <strong id="speedScore">${SP.score}</strong></span><button class="btn ghost small" id="btnSpeedQuit">✕ Quit</button></div>
 <div class="timer"><div id="speedTimer" style="width:100%"></div></div><div class="evrow">${evHTML(t)}</div>
 <div class="prompt">${esc(t.type==="goodbad"?"Would this stop your scroll / does it work?":t.prompt.replace(/^Upworthy headline test — same story, same image\. /,"Upworthy test: "))}</div>
 ${t.type==="goodbad"?`<div class="artifact">${esc(t.artifact)}</div>`:""}
 <div class="opts">${opts.map((o,i)=>`<button class="opt" data-sp="${i}"><span class="key">${i+1}</span><span class="txt">${esc(o)}</span></button>`).join("")}</div><div id="speedFeedback" class="sub"></div></div>`;
 $$("[data-sp]").forEach(b=>b.onclick=()=>speedAnswer(+b.dataset.sp));$("#btnSpeedQuit").onclick=()=>{clearInterval(SP.timer);SP=null;location.hash="#/speed";viewSpeed();};
 clearInterval(SP.timer);SP.timer=setInterval(()=>{if(!SP)return;const el=performance.now()-SP.t0,left=Math.max(0,SPEED_MS-el);const b=$("#speedTimer");if(b){b.style.width=(100*left/SPEED_MS)+"%";b.classList.toggle("low",left<1500);}if(left<=0)speedAnswer(null);},50);}
function speedAnswer(i){if(!SP||SP.locked)return;SP.locked=true;clearInterval(SP.timer);const t=SP.items[SP.i];const ms=Math.round(performance.now()-SP.t0);
 const ans=t.type==="goodbad"?(t.answer==="good"?0:1):t.answer;const ok=i!=null&&i===ans;const pts=ok?100+Math.round(Math.max(0,SPEED_MS-ms)/50):0;SP.score+=pts;
 SP.answers.push({id:t.id,choice:i,ok,ms,pts,timeout:i==null});
 if(i!=null){record(t.id,ok,"s");if(!ok){schedule(t.id,false);}else schedule(t.id,true);}
 markDaily("s:"+t.id);save();updateTop();
 $$("[data-sp]").forEach(b=>{const k=+b.dataset.sp;b.classList.add(k===ans?"win":(k===i?"lose":"dim"));});
 $("#speedFeedback").innerHTML=ok?`<strong class="okc">✓ +${pts}</strong>`:i==null?`<strong class="noc">⏱ Too slow</strong>`:`<strong class="noc">✗ Miss — scheduled for review tomorrow</strong>`;
 $("#speedScore").textContent=SP.score;
 setTimeout(()=>{if(!SP)return;SP.i++;if(SP.i<SP.items.length)speedItem();else speedDone();},ok?450:900);}
function speedDone(){const c=SP.answers.filter(a=>a.ok).length;const run={at:Date.now(),mode:SP.mode,correct:c,total:SP.answers.length,score:SP.score};S.speed.runs.push(run);if(S.speed.runs.length>100)S.speed.runs=S.speed.runs.slice(-100);
 const best=SP.score>(S.speed.best||0);if(best)S.speed.best=SP.score;save();SP.finished=true;
 $("#main").innerHTML=`<div class="wrap" id="speedResult"><h1>⚡ Round done</h1><div class="cards"><div class="card"><div class="sub">Correct</div><div class="stat" id="speedCorrect">${c}/${SP.answers.length}</div></div><div class="card"><div class="sub">Score</div><div class="stat" id="speedFinal">${SP.score}</div>${best?`<div class="okc"><strong>🏆 New best!</strong></div>`:`<div class="sub">Best: ${S.speed.best}</div>`}</div><div class="card"><div class="sub">Avg time</div><div class="stat">${(SP.answers.reduce((a,x)=>a+x.ms,0)/SP.answers.length/1000).toFixed(1)} s</div></div></div>
 <h2>Review the round</h2><ol class="reviewlist">${SP.answers.map(a=>{const t=BYID[a.id];return `<li class="${a.ok?"okc":"noc"}">${a.ok?"✓":a.timeout?"⏱":"✗"} <a href="#/t/${t.id}">${esc(t.type==="goodbad"?t.artifact.slice(0,90):t.options[t.answer].text.slice(0,90))}</a> <span class="sub">— open the full task for the why + source</span></li>`;}).join("")}</ol>
 <button class="btn big" id="btnSpeedAgain">↻ Play again</button> <a class="btn ghost" href="#/">Home</a></div>`;
 $("#btnSpeedAgain").onclick=()=>{SP=null;viewSpeed();};}

/* ---------- skill dashboard ---------- */
function barRow(label,a,href){const p=a[1]?Math.round(100*a[0]/a[1]):0;return `<tr><td>${href?`<a href="${href}">${esc(label)}</a>`:esc(label)}</td><td class="num">${a[1]}</td><td class="num">${a[1]?p+"%":"–"}</td><td class="barcell"><div class="bar"><div class="${a[1]&&p<60?"lowb":""}" style="width:${p}%"></div></div></td></tr>`;}
function viewDashboard(){setNav("navDash");const sk=skill(),wk=weakest(3),st=stats();
 const ws=Object.values(S.wcheck);const wavg=ws.length?Math.round(ws.reduce((a,x)=>a+x.score,0)/ws.length):null;
 let h=`<div class="wrap" id="dashboard"><h1>📊 Skill dashboard</h1><p class="sub">Accuracy across every graded attempt (tasks + speed rounds). Practise where you're weakest — that's where taste grows fastest.</p>
 <div class="cards"><div class="card"><div class="sub">Overall accuracy</div><div class="stat" id="dashAll">${pct(sk.all)}</div><div class="sub">${sk.all[0]} of ${sk.all[1]} attempts</div></div>
 <div class="card"><div class="sub">Today / streak</div><div class="stat">${todayCount()}/${S.goal} · 🔥${streak()}</div><label class="sub goalset">Daily goal <input id="goalInput" type="number" min="1" max="200" value="${S.goal}"></label></div>
 <div class="card"><div class="sub">Due today · in review</div><div class="stat">${dueIds().length} · ${Object.keys(S.srs).length}</div><a href="#/review">Open review →</a></div>
 <div class="card"><div class="sub">Writing checker average</div><div class="stat" id="dashWrite">${wavg==null?"–":wavg}</div><div class="sub">${ws.length} draft(s) checked</div></div>
 <div class="card"><div class="sub">Speed round best</div><div class="stat">${S.speed.best||0}</div><a href="#/speed">Play →</a></div></div>
 <h2>Weakest areas</h2><div class="card" id="weakBox">${wk.length?`<ol>${wk.map(w=>`<li><strong>${esc(D.principles[w.p].label)}</strong> — ${Math.round(100*w.acc)}% over ${w.n} attempts</li>`).join("")}</ol>`:`<p class="sub">Answer a few graded tasks (at least 2 per principle) and your weakest areas show up here. Until then, the button gives you a mixed set from tracks you haven't started.</p>`}
 <button class="btn big" id="btnWeakest">💪 Practise my weakest (10 tasks)</button></div>
 <h2>By track</h2><table class="stats wide" id="dashTrack"><tr><th>Track</th><th class="num">Attempts</th><th class="num">Accuracy</th><th></th></tr>${D.tracks.map(tr=>barRow(`${tr.id}. ${tr.title}`,sk.track[tr.id]||[0,0])).join("")}</table>
 <h2>By task type</h2><table class="stats wide" id="dashType"><tr><th>Type</th><th class="num">Attempts</th><th class="num">Accuracy</th><th></th></tr>${["pick","goodbad","missing","lesson"].map(k=>barRow(TYPE_LABEL[k],sk.type[k]||[0,0])).join("")}</table>
 <p class="sub">Write-it-yourself and teardown tasks aren't auto-graded; your checker scores are tracked above.</p>
 <h2>By principle</h2><table class="stats wide" id="dashPr"><tr><th>Principle</th><th class="num">Attempts</th><th class="num">Accuracy</th><th></th></tr>${Object.keys(D.principles).filter(p=>sk.pr[p]).sort((a,b)=>(sk.pr[a][0]/sk.pr[a][1])-(sk.pr[b][0]/sk.pr[b][1])).map(p=>barRow(D.principles[p].label,sk.pr[p])).join("")||`<tr><td colspan="4" class="sub">No graded attempts yet.</td></tr>`}</table>
 <h2>By evidence type (pick the winner)</h2><table class="stats"><tr><td>Proven tests</td><td>${pct(st.proven_test||[0,0])}</td></tr><tr><td>Case studies / benchmarks</td><td>${pct(st.case_study||[0,0])}</td></tr><tr><td>Teaching pairs</td><td>${pct(st.teaching||[0,0])}</td></tr></table></div>`;
 $("#main").innerHTML=h;renderOutline(null);bindGoal();$("#btnWeakest").onclick=practiseWeakest;}
function practiseWeakest(){const wk=weakest(3).map(w=>w.p);let pool;
 if(wk.length){pool=TASKS.filter(t=>GRADED.has(t.type)&&t.principles.some(p=>wk.includes(p)));
  const score=t=>(S.misses[t.id]?0:!S.res[t.id]||S.res[t.id].correct==null?1:S.res[t.id].correct?3:0)+Math.random();pool.sort((a,b)=>score(a)-score(b));}
 else{const started=new Set(Object.keys(S.att).map(id=>BYID[id]&&BYID[id].track));pool=shuffle(TASKS.filter(t=>GRADED.has(t.type)&&!started.has(t.track)&&!S.done[t.id]));if(!pool.length)pool=shuffle(TASKS.filter(t=>GRADED.has(t.type)));}
 const ids=pool.slice(0,10).map(t=>t.id);if(!ids.length){toast("Nothing to practise yet");return;}
 S.session={name:"drill",ids,principles:wk,at:Date.now()};save();Object.keys(ui.opened).forEach(k=>{if(k.startsWith("drill"))delete ui.opened[k];});location.hash=`#/t/${ids[0]}?drill`;}

/* ---------- swipe file ---------- */
function swipeText(t){if(t.type==="pick")return t.options.map((o,i)=>(i===t.answer?"★ ":"")+o.text).join(" | ");if(t.type==="write")return (t.model_answers||[])[0]||t.prompt;if(t.type==="teardown")return t.parts.map(p=>p.label+": "+p.text).join(" | ");if(t.type==="lesson")return t.body;return t.artifact||t.prompt;}
function swipeRows(){return Object.keys(S.swipe).filter(id=>BYID[id]).map(id=>({t:BYID[id],s:S.swipe[id]})).sort((a,b)=>b.s.at-a.s.at);}
function viewSwipe(){setNav("navSwipe");const rows=swipeRows();
 let h=`<div class="wrap" id="swipeView"><h1>★ Swipe file</h1><p class="sub">Every example you save (button ☆ on any task, or key <span class="kbd">B</span>). Add your own notes — what you'd steal and where you'd use it.</p>
 <div class="swipebar"><input id="swipeSearch" type="search" placeholder="Search text, notes, source…"><select id="swipeTrack"><option value="">All tracks</option>${D.tracks.map(t=>`<option value="${t.id}">${t.id}. ${esc(t.title)}</option>`).join("")}</select>
 <select id="swipeType"><option value="">All types</option>${Object.keys(TYPE_LABEL).map(k=>`<option value="${k}">${TYPE_LABEL[k]}</option>`).join("")}</select>
 <select id="swipeEv"><option value="">All evidence</option>${Object.keys(D.evidence_labels).map(k=>`<option value="${k}">${esc(D.evidence_labels[k].split(" (")[0])}</option>`).join("")}</select></div>
 <div class="swipeexp"><button class="btn ghost small" id="btnSwipeJSON">⬇ JSON</button><button class="btn ghost small" id="btnSwipeMD">⬇ Markdown</button><button class="btn ghost small" id="btnSwipeCSV">⬇ CSV</button> <span class="sub" id="swipeShown"></span></div>
 <div id="swipeList">${rows.length?"":`<p>Your swipe file is empty. Open any task and press ☆ Save (or <span class="kbd">B</span>).</p>`}${rows.map(({t,s})=>`<div class="swipecard" data-swipe="${t.id}" data-track="${t.track}" data-type="${t.type}" data-ev="${t.evidence_type}"><div class="swhead">${evHTML(t)}<span class="typetag">${esc(TYPE_LABEL[t.type])}</span><a href="#/t/${t.id}" class="swtitle">${esc(t.module)} · ${esc(t.title)}</a><button class="btn ghost small swdel" data-del="${t.id}" title="Remove">✕</button></div>
  <div class="swtext">${esc(swipeText(t).slice(0,600))}</div>${t.img?`<img class="swimg" src="${esc(t.img.src)}" alt="${esc(t.img.alt)}" loading="lazy">`:""}<div class="sub">Source: <a href="${esc(t.source_url)}" target="_blank" rel="noopener">${esc(t.source_name)}</a></div>
  <textarea class="swnote" data-note="${t.id}" placeholder="My note: what I'd steal, where I'd use it…">${esc(s.note||"")}</textarea></div>`).join("")}</div></div>`;
 $("#main").innerHTML=h;renderOutline(null);
 const f=()=>{const q=$("#swipeSearch").value.trim().toLowerCase(),tr=$("#swipeTrack").value,ty=$("#swipeType").value,ev=$("#swipeEv").value;let n=0;
  $$(".swipecard").forEach(c=>{const id=c.dataset.swipe,t=BYID[id];const hay=(t.title+" "+t.prompt+" "+swipeText(t)+" "+t.source_name+" "+(S.swipe[id].note||"")).toLowerCase();
   const show=(!q||hay.includes(q))&&(!tr||c.dataset.track===tr)&&(!ty||c.dataset.type===ty)&&(!ev||c.dataset.ev===ev);c.style.display=show?"":"none";if(show)n++;});
  $("#swipeShown").textContent=`${n} of ${rows.length} shown`;};
 ["#swipeSearch","#swipeTrack","#swipeType","#swipeEv"].forEach(s=>$(s).oninput=f);f();
 $$("[data-note]").forEach(a=>a.oninput=()=>{S.swipe[a.dataset.note].note=a.value;save();});
 $$("[data-del]").forEach(b=>b.onclick=()=>{delete S.swipe[b.dataset.del];save();updateTop();viewSwipe();toast("Removed from swipe file");});
 $("#btnSwipeJSON").onclick=()=>download("swipe-file.json","application/json",JSON.stringify(rows.map(({t,s})=>({id:t.id,module:t.module,title:t.title,type:t.type,evidence:t.evidence_type,text:swipeText(t),note:s.note||"",source:t.source_name,source_url:t.source_url,saved:new Date(s.at).toISOString()})),null,1));
 $("#btnSwipeMD").onclick=()=>download("swipe-file.md","text/markdown","# My swipe file\n\n"+rows.map(({t,s})=>`## ${t.module} · ${t.title}\n- Evidence: ${evLabel(t.evidence_type)}\n- Example: ${swipeText(t)}\n- My note: ${s.note||"—"}\n- Source: [${t.source_name}](${t.source_url})\n`).join("\n"));
 $("#btnSwipeCSV").onclick=()=>{const q=v=>'"'+String(v).replace(/"/g,'""')+'"';download("swipe-file.csv","text/csv","id,module,title,type,evidence,text,note,source_url\n"+rows.map(({t,s})=>[t.id,t.module,t.title,t.type,t.evidence_type,swipeText(t),s.note||"",t.source_url].map(q).join(",")).join("\n"));};}
function download(name,type,body){const blob=new Blob([body],{type});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);toast("Exported "+name);}

/* ---------- free copy checker ---------- */
function viewChecker(){setNav("navChecker");const last=S.freeCheck||{text:"",kind:"primary",lang:"sv"};
 $("#main").innerHTML=`<div class="wrap" id="checkerView"><h1>✍ Copy checker</h1><p class="sub">Paste any ad, headline, subject line, script or cold email — your own real ones too. Instant feedback against the principles. Runs 100% in your browser; nothing is sent anywhere.</p>
 <div class="swipebar"><select id="ckKind"><option value="primary">Meta ad primary text</option><option value="headline">Headline(s)</option><option value="subject">Email subject line</option><option value="email">Cold email</option><option value="script">Video / UGC script</option><option value="rsa">Google RSA (H1: … lines)</option><option value="other">Other</option></select>
 <select id="ckLang"><option value="sv">Svenska</option><option value="en">English</option></select></div>
 <textarea id="ckText" class="big" placeholder="Paste or write your copy here…">${esc(last.text)}</textarea><div class="checkrow"><button class="btn" id="btnCheckFree">✍ Check <span class="kbd" style="color:#16181d">Ctrl+Enter</span></button></div><div id="checkArea"></div></div>`;
 renderOutline(null);$("#ckKind").value=last.kind;$("#ckLang").value=last.lang;
 const run=()=>{S.freeCheck={text:$("#ckText").value,kind:$("#ckKind").value,lang:$("#ckLang").value};save();const r=checkCopy(S.freeCheck.text,S.freeCheck.kind,S.freeCheck.lang);$("#checkArea").innerHTML=checkerHTML(r,S.freeCheck.lang);};
 $("#btnCheckFree").onclick=run;$("#ckText").onkeydown=e=>{if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)){e.preventDefault();run();}};}

/* ---------- daily ad teardown (Meta Ad Library, live) ---------- */
const DAILY=[["tandblekning","SE","Clinic: teeth whitening"],["skincare","SE","DTC: skincare"],["laserhårborttagning","SE","Clinic: laser hair removal"],["elektrisk tandborste","SE","DTC: electric toothbrush"],["fysioterapi","SE","Clinic: physio"],["protein","SE","DTC: protein / supplements"],["hudvård","SE","DTC/clinic: skin care"],["löparskor","SE","DTC: running shoes"],["tandläkare","SE","Clinic: dentist"],["hörlurar","SE","DTC: headphones"],["glasögon","SE","DTC: glasses"],["hundfoder","SE","DTC: dog food"],["kosttillskott","SE","DTC: supplements"],["naprapat","SE","Clinic: naprapath"],["sängkläder","SE","DTC: bedding"],["kaffe","SE","DTC: coffee"],["träningskläder","SE","DTC: activewear"],["ögonfransar","SE","Clinic/DTC: lashes"]];
const DCHECK=["Started running: how long has it run? (3+ months = long-running signal, not proof)","How many versions/variations does the advertiser run of this idea?","Format: image, video, carousel, UGC, founder, static offer?","Hook: quote the first line / first 3 seconds","Who does it call out (the reader)?","Angle: price, proof, problem, identity, new mechanism, risk reversal…?","Offer: what exactly do I get, and what does it cost?","Proof: numbers, reviews, demo, expert, before/after (policy!)?","CTA: one clear action?","Policy check: any negative self-image or timed promises?","What would I test next against it?"];
function dayIndex(){const t=today();const [y,m,d]=t.split("-").map(Number);const doy=Math.round((new Date(y,m-1,d)-new Date(y,0,1))/864e5);return doy%DAILY.length;}
function alURL(q,c){return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=${c}&q=${encodeURIComponent(q)}&search_type=keyword_unordered&media_type=all`;}
function viewDaily(){setNav("navDaily");const t=today(),[q,c,label]=DAILY[dayIndex()];const rec=S.teardowns[t]||{checks:[],notes:"",done:false,q};
 const hist=Object.keys(S.teardowns).filter(d=>d!==t&&S.teardowns[d].done).sort().reverse();
 $("#main").innerHTML=`<div class="wrap" id="dailyView"><h1>🔎 Daily ad teardown</h1><p class="sub">One real ad a day, from the public Meta Ad Library (no login needed in the EU). ~10 minutes. Counts toward your daily goal.</p>
 <div class="card"><div class="sub">Today, ${t}</div><h2 style="margin:.2em 0">${esc(label)} — search “${esc(q)}”</h2>
 <a class="btn" id="dailyLink" href="${alURL(q,c)}" target="_blank" rel="noopener">Open Ad Library: “${esc(q)}” (${c}) ↗</a>
 <span class="sub" style="margin-left:8px">or any brand: <input id="dailyBrand" placeholder="e.g. Hismile, Oura, Apotea"> <button class="btn ghost small" id="btnDailyBrand">Search ↗</button></span>
 <p class="sub">Pick ONE ad (ideally one that started 3+ months ago). The Ad Library shows no performance data for non-political ads — run time is only a proxy.</p>
 <div class="checklist" id="dailyChecks">${DCHECK.map((x,i)=>`<label><input type="checkbox" data-dc="${i}" ${rec.checks[i]?"checked":""}> ${esc(x)}</label>`).join("")}</div>
 <label class="why" for="dailyNotes">My teardown notes (saved)</label><textarea id="dailyNotes" class="big" placeholder="Brand / ad started… / hook: … / angle: … / offer: … / proof: … / I'd test: …">${esc(rec.notes)}</textarea>
 <div class="checkrow"><button class="btn" id="btnDailyCheck">✍ Check my notes as ad copy</button><button class="donebtn${rec.done?" on":""}" id="btnDailyDone">${rec.done?"☑ Today's teardown done":"☐ Mark today's teardown done"}</button><button class="btn ghost small" id="btnDailySwipe">⬇ Export notes (.md)</button></div><div id="checkArea"></div></div>
 ${hist.length?`<h2>Past teardowns</h2>${hist.slice(0,30).map(d=>`<details class="card hist"><summary>${d} · ${esc(S.teardowns[d].q||"")}</summary><div class="swtext">${esc(S.teardowns[d].notes||"—")}</div></details>`).join("")}`:""}</div>`;
 renderOutline(null);
 const sv=()=>{S.teardowns[t]=Object.assign(S.teardowns[t]||{checks:[],notes:"",done:false},{q});return S.teardowns[t];};
 $$("[data-dc]").forEach(x=>x.onchange=()=>{const r=sv();r.checks[+x.dataset.dc]=x.checked;save();});
 $("#dailyNotes").oninput=e=>{sv().notes=e.target.value;save();};
 $("#btnDailyBrand").onclick=()=>{const b=$("#dailyBrand").value.trim();if(b)window.open(alURL(b,"SE"),"_blank","noopener");};
 $("#btnDailyCheck").onclick=()=>{$("#checkArea").innerHTML=checkerHTML(checkCopy($("#dailyNotes").value,"other","sv"),"sv");};
 $("#btnDailyDone").onclick=()=>{const r=sv();r.done=!r.done;if(r.done)markDaily("daily:"+t);else{S.daily[t]=(S.daily[t]||[]).filter(x=>x!=="daily:"+t);}save();updateTop();viewDaily();toast(r.done?"Teardown done ✓ (+1 today)":"Unmarked");};
 $("#btnDailySwipe").onclick=()=>download(`teardown-${t}.md`,"text/markdown",`# Ad teardown ${t} — ${q}\n\n${DCHECK.map((x,i)=>`- [${sv().checks[i]?"x":" "}] ${x}`).join("\n")}\n\n${sv().notes}\n`);}

/* ---------- focus ---------- */
function setFocus(on){document.body.classList.toggle("focus",on);if(on){const el=document.documentElement;if(el.requestFullscreen&&!document.fullscreenElement){el.requestFullscreen().catch(()=>{});}}else if(document.fullscreenElement&&document.exitFullscreen){document.exitFullscreen().catch(()=>{});}}
document.addEventListener("fullscreenchange",()=>{if(!document.fullscreenElement&&document.body.classList.contains("focus"))document.body.classList.remove("focus");});
/* ---------- export / import ---------- */
function exportJSON(){download("marketing-playground-progress.json","application/json",JSON.stringify({app:"marketing-taste-playground",schema:2,exported:new Date().toISOString(),state:S},null,1));}
function importJSON(e){const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{try{const j=JSON.parse(rd.result);const st=j.state||j;if(st.v!==1||typeof st.done!=="object")throw new Error("bad");S=migrate(st);resetUI();save();toast("Progress imported");route();}catch(err){toast("Could not import: not a valid progress file");}};rd.readAsText(f);}
/* ---------- keyboard ---------- */
document.addEventListener("keydown",e=>{const tag=(e.target.tagName||"").toLowerCase();const typing=tag==="textarea"||tag==="input"||tag==="select";
 if(e.key==="Escape"){if(document.body.classList.contains("focus")){setFocus(false);e.preventDefault();}return;}
 if(SP&&!SP.finished&&$("[data-speed-i]")){if(/^[12]$/.test(e.key)){e.preventDefault();speedAnswer(+e.key-1);}return;}
 if(!typing&&e.key==="Enter"&&$("#btnSpeedStart")&&location.hash.startsWith("#/speed")){e.preventDefault();startSpeed();return;}
 const t=curTask();
 if(typing){if(e.key==="Enter"&&(e.ctrlKey||e.metaKey)&&t){e.preventDefault();isRevealed(t)?go(1):reveal(t);}return;}
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.key==="s"||e.key==="S"){S.sidebar=!S.sidebar;save();applySidebar();return;}
 if(e.key==="f"||e.key==="F"){setFocus(!document.body.classList.contains("focus"));return;}
 if(!t)return;
 if(/^[1-9]$/.test(e.key)){choose(t,+e.key-1);e.preventDefault();return;}
 if(e.key==="Enter"){if(tag==="button"||tag==="a"){if(e.target.id!=="btnReveal"&&!e.target.dataset.opt)return;}e.preventDefault();isRevealed(t)?go(1):reveal(t);return;}
 if(e.key==="ArrowRight"){go(1);return;} if(e.key==="ArrowLeft"){go(-1);return;}
 if(e.key==="m"||e.key==="M"){toggleDone(t.id);return;}
 if(e.key==="b"||e.key==="B"){toggleSwipe(t.id);return;}
 if((e.key==="c"||e.key==="C")&&t.type==="write"){runCheck(t);return;}});
/* ---------- router ---------- */
function route(){if(SP&&!SP.finished&&!location.hash.startsWith("#/speed")){clearInterval(SP.timer);SP=null;}
 updateTop();applySidebar();const h=location.hash||"#/";const m=h.match(/^#\/t\/([^?]+)(?:\?(review|due|drill))?/);
 if(m)viewTask(m[1],m[2]||null);else if(h.startsWith("#/review"))viewReview();else if(h.startsWith("#/dashboard"))viewDashboard();else if(h.startsWith("#/speed"))viewSpeed();
 else if(h.startsWith("#/swipe"))viewSwipe();else if(h.startsWith("#/checker"))viewChecker();else if(h.startsWith("#/daily"))viewDaily();else viewHome();}
window.addEventListener("hashchange",route);
window.addEventListener("load",()=>setTimeout(aaPost,300));window.addEventListener("hashchange",()=>setTimeout(aaPost,300));
$("#btnSidebar").onclick=()=>{S.sidebar=!S.sidebar;save();applySidebar();};
$("#btnFocus").onclick=()=>setFocus(true);$("#btnExitFocus").onclick=()=>setFocus(false);
window.MTP={state:()=>S,tasks:TASKS,checkCopy,today,setDayOffset:n=>{dayOffset=n;route();},dueIds,streak,migrate};
route();
})();
