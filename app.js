const KEY='ys-ops-v1';const LAST='ys-ops-last';const PIN='2267';
const SERVICES={winterize:{label:'Winterize only',blurb:'Todd pulls the boat, winterizes engine and systems, blocks it in the yard.',total:800},wrap:{label:'Winterize + shrink-wrap',blurb:'Same winterize, then shrink-wrap so she sits dry till spring.',total:1200},storage:{label:'Storage only',blurb:'Haul and block in the yard. You already winterized, or you will do it later.',total:600}};
const WEEKS=[{id:'oct6',label:'Week of Oct 6'},{id:'oct13',label:'Week of Oct 13'},{id:'oct20',label:'Week of Oct 20'},{id:'first',label:'First available'}];
const STATUSES=['HOLD','HAUL SET','HAULED','DONE','NO SHOW'];
const HOLD_AMT=200;
const SEED=[
{id:'YS-2101',boat:'Sea Note',owner:'Mike',phone:'5165550142',length:28,engine:'I/O',place:'Slip 12',service:'winterize',week:'oct6',status:'HOLD',haulDate:'',note:'',at:'4:18 pm',afterHours:true},
{id:'YS-2102',boat:'Lucky Day',owner:'Pat',phone:'6315550190',length:22,engine:'outboard',place:'On trailer',service:'storage',week:'oct13',status:'HAUL SET',haulDate:'2026-10-14',note:'key in office',at:'2:11 pm',afterHours:false},
{id:'YS-2103',boat:'Miss Amity',owner:'Diane',phone:'5165550177',length:34,engine:'inboard',place:'Slip 7',service:'wrap',week:'oct6',status:'HOLD',haulDate:'',note:'shrink yes',at:'5:03 pm',afterHours:true},
{id:'YS-2104',boat:'Bay Runner',owner:'Chris',phone:'5165550114',length:26,engine:'outboard',place:'I will call',service:'winterize',week:'oct20',status:'HAULED',haulDate:'2026-10-21',note:'',at:'11:40 am',afterHours:false},
{id:'YS-2105',boat:'Southwind',owner:'Terry',phone:'6315550166',length:31,engine:'I/O',place:'Slip 19',service:'wrap',week:'oct13',status:'HOLD',haulDate:'',note:'',at:'6:41 pm',afterHours:true},
{id:'YS-2106',boat:'Tin Cup',owner:'Joe',phone:'5165550128',length:19,engine:'outboard',place:'On trailer',service:'storage',week:'first',status:'DONE',haulDate:'2026-09-30',note:'paid cash',at:'3:02 pm',afterHours:false},
{id:'YS-2107',boat:'Harbor Cat',owner:'Lynn',phone:'5165550183',length:24,engine:'outboard',place:'Slip 3',service:'winterize',week:'oct6',status:'NO SHOW',haulDate:'2026-10-07',note:'no answer',at:'4:55 pm',afterHours:true},
{id:'YS-2108',boat:'Great South',owner:'Anthony',phone:'6315550133',length:36,engine:'inboard',place:'Slip 21',service:'wrap',week:'oct20',status:'HAUL SET',haulDate:'2026-10-22',note:'key in office',at:'1:20 pm',afterHours:false},
{id:'YS-2109',boat:'Cedar Beach',owner:'Kim',phone:'5165550159',length:27,engine:'I/O',place:'On trailer',service:'winterize',week:'oct13',status:'HOLD',haulDate:'',note:'',at:'7:12 pm',afterHours:true}
];
function load(){const raw=localStorage.getItem(KEY);if(raw)return JSON.parse(raw);localStorage.setItem(KEY,JSON.stringify(SEED));return SEED.slice();}
function save(rows){localStorage.setItem(KEY,JSON.stringify(rows));}
function last4(p){return String(p).replace(/\D/g,'').slice(-4);}
function weekLabel(id){return (WEEKS.find(w=>w.id===id)||{}).label||id;}
function svc(id){return SERVICES[id]||SERVICES.winterize;}
function weekCount(rows,week){return rows.filter(r=>r.week===week&&r.status!=='NO SHOW'&&r.status!=='DONE').length;}
function nowStamp(){return new Date().toLocaleTimeString('en-US',{timeZone:'America/New_York',hour:'numeric',minute:'2-digit'});}
function afterHoursNow(){const h=Number(new Date().toLocaleString('en-US',{timeZone:'America/New_York',hour:'numeric',hour12:false}));return h>=16;}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function cls(st){return st.replace(/\s+/g,'');}
const state={step:1,service:'',boat:'',length:'',beam:'',engine:'',place:'',owner:'',phone:'',week:''};
function renderCustomer(){
  const last=localStorage.getItem(LAST);
  if(last&&!location.hash){renderConfirm(JSON.parse(last));return;}
  const rows=load();
  const stepper=document.getElementById('stepper');
  const names=['Service','Boat','Week','Review','Held'];
  stepper.innerHTML=names.map((n,i)=>`<button type="button" class="${state.step===i+1?'on':''}">${i+1} ${n}</button>`).join('');
  const app=document.getElementById('app');
  if(state.step===1){
    app.innerHTML=`<section class="card"><h1>What are we doing with her?</h1><p class="lede">Pick the work. $200 hold locks the haul week.</p>${Object.entries(SERVICES).map(([id,s])=>`<button type="button" class="choice ${state.service===id?'pick':''}" data-svc="${id}"><strong>${s.label}</strong><span>${s.blurb}</span></button>`).join('')}</section>`;
    app.querySelectorAll('[data-svc]').forEach(b=>b.onclick=()=>{state.service=b.dataset.svc;state.step=2;renderCustomer();});
  } else if(state.step===2){
    app.innerHTML=`<form class="card" id="boat-form"><h1>Boat and who to call</h1><p class="lede">${svc(state.service).label}. If the office is closed, Todd still gets this.</p><label>Boat name<input name="boat" required value="${esc(state.boat)}"></label><div class="grid2"><label>Length (ft)<input name="length" type="number" min="12" max="80" required value="${esc(state.length)}"></label><label>Beam (ft, optional)<input name="beam" type="number" min="5" max="20" step="0.1" value="${esc(state.beam)}"></label></div><label>Engine<select name="engine" required><option value="">Pick one</option>${['inboard','outboard','I/O'].map(e=>`<option ${state.engine===e?'selected':''}>${e}</option>`).join('')}</select></label><label>Where is she<select name="place" required><option value="">Pick one</option><option>Slip #</option><option>On trailer</option><option>I will call</option></select></label><label id="slip-wrap" hidden>Slip number<input name="slip" placeholder="12"></label><div class="grid2"><label>Your name<input name="owner" required value="${esc(state.owner)}"></label><label>Phone<input name="phone" required inputmode="tel" value="${esc(state.phone)}" placeholder="516"></label></div><button class="btn" type="submit">Pick a haul week</button><button class="btn sec" type="button" id="back">Back</button></form>`;
    const form=document.getElementById('boat-form');
    const place=form.elements.place; const slipWrap=document.getElementById('slip-wrap');
    const sync=()=>{slipWrap.hidden=place.value!=='Slip #';}; place.onchange=sync; sync();
    document.getElementById('back').onclick=()=>{state.step=1;renderCustomer();};
    form.onsubmit=e=>{e.preventDefault();const f=new FormData(form);state.boat=f.get('boat').trim();state.length=f.get('length');state.beam=f.get('beam');state.engine=f.get('engine');state.place=f.get('place')==='Slip #'?('Slip '+(f.get('slip')||'').trim()):f.get('place');state.owner=f.get('owner').trim();state.phone=String(f.get('phone')).replace(/\D/g,'');if(state.phone.length<10){alert('Need a real phone.');return;}state.step=3;renderCustomer();};
  } else if(state.step===3){
    app.innerHTML=`<section class="card"><h1>Haul week</h1><p class="lede">How many boats are already on Todd's list that week.</p>${WEEKS.map(w=>{const n=weekCount(rows,w.id);return `<button type="button" class="choice ${state.week===w.id?'pick':''}" data-week="${w.id}"><strong>${w.label}</strong><span>${n} hold${n===1?'':'s'} already on this week</span></button>`;}).join('')}<button class="btn sec" type="button" id="back">Back</button></section>`;
    app.querySelectorAll('[data-week]').forEach(b=>b.onclick=()=>{state.week=b.dataset.week;state.step=4;renderCustomer();});
    document.getElementById('back').onclick=()=>{state.step=2;renderCustomer();};
  } else if(state.step===4){
    const s=svc(state.service); const remaining=s.total-HOLD_AMT; const n=weekCount(rows,state.week)+1;
    app.innerHTML=`<section class="card"><h1>Review the hold</h1><div class="row"><span>Boat</span><strong>${esc(state.boat)} · ${esc(state.length)} ft · ${esc(state.engine)}</strong></div><div class="row"><span>Where</span><strong>${esc(state.place)}</strong></div><div class="row"><span>Service</span><strong>${s.label}</strong></div><div class="row"><span>Haul week</span><strong>${weekLabel(state.week)}</strong></div><div class="row"><span>Yard invoice (typical)</span><span>$${s.total}</span></div><div class="row"><span>Hold due now</span><span class="price">$200</span></div><div class="row"><span>Remaining at the yard</span><span class="price">$${remaining}</span></div><p class="fine">$200 hold is applied to the invoice. Cancel before haul week and the hold comes back. After haul day is set, talk to Todd.</p><p class="fine">You will be #${n} on the ${weekLabel(state.week)} list.</p><button class="btn" id="place">Hold this week — $200</button><button class="btn sec" type="button" id="back">Back</button></section>`;
    document.getElementById('back').onclick=()=>{state.step=3;renderCustomer();};
    document.getElementById('place').onclick=()=>{
      const s=svc(state.service); const list=load();
      const rec={id:'YS-'+(2200+list.length),boat:state.boat,owner:state.owner,phone:state.phone,length:Number(state.length),beam:state.beam?Number(state.beam):'',engine:state.engine,place:state.place,service:state.service,week:state.week,status:'HOLD',haulDate:'',note:'',at:nowStamp(),afterHours:afterHoursNow(),total:s.total,remaining:s.total-HOLD_AMT};
      rec.queue=weekCount(list,state.week)+1; list.unshift(rec); save(list); localStorage.setItem(LAST,JSON.stringify(rec)); renderConfirm(rec);
    };
  }
}
function renderConfirm(rec){
  document.getElementById('stepper').innerHTML='<button class="on" type="button">5 Held</button>';
  const s=svc(rec.service); const n=rec.queue||weekCount(load(),rec.week);
  document.getElementById('app').innerHTML=`<section class="card"><div class="okbox"><p class="status HOLD">HOLD</p><h1>You are #${n} on Todd's list for ${weekLabel(rec.week)}.</h1></div><div class="row"><span>Hold</span><strong>${rec.id}</strong></div><div class="row"><span>Boat</span><strong>${esc(rec.boat)} · ${esc(rec.length)} ft</strong></div><div class="row"><span>Owner</span><strong>${esc(rec.owner)} · …${last4(rec.phone)}</strong></div><div class="row"><span>Service</span><strong>${s.label}</strong></div><div class="row"><span>Week</span><strong>${weekLabel(rec.week)}</strong></div><div class="row"><span>Paid now</span><strong>$200 hold</strong></div><div class="row"><span>At the yard</span><strong>$${(rec.remaining||s.total-200)}</strong></div><p class="lede" style="margin-top:1rem">Next: yard texts when haul day is set. Office is closed after 4 — this already hit the board.</p><a class="btn" href="owner/">Open the yard board</a></section>`;
}
function renderOps(){
  const el=document.getElementById('ops');
  if(sessionStorage.getItem('ys-ops-pin')!=='1'){
    el.innerHTML='<form class="card" id="pin"><h1>Saturday board</h1><p class="lede">After 4. PIN 2267 in this build.</p><label>PIN<input name="pin" inputmode="numeric" autocomplete="off" required></label><button class="btn" type="submit">Open the clipboard</button></form>';
    document.getElementById('pin').onsubmit=e=>{e.preventDefault();if(new FormData(e.target).get('pin')!==PIN){alert('Wrong PIN.');return;}sessionStorage.setItem('ys-ops-pin','1');renderOps();};
    return;
  }
  const rows=load();
  const tonight=rows.filter(r=>r.afterHours&&r.status==='HOLD').length;
  const hauls=rows.filter(r=>r.week==='oct6'&&(r.status==='HAUL SET'||r.status==='HAULED')).length;
  const callback=rows.filter(r=>r.afterHours&&(r.status==='HOLD'||r.status==='NO SHOW')).length;
  const after=rows.filter(r=>r.afterHours&&r.status==='HOLD');
  el.innerHTML=`<div class="counts"><div class="count"><b>${tonight}</b><span>Holds tonight</span></div><div class="count"><b>${hauls}</b><span>Hauls this week</span></div><div class="count"><b>${callback}</b><span>Need callback</span></div></div><div class="queue"><strong>After-4 queue</strong> — ${after.length?after.map(r=>esc(r.boat)).join(', '):'quiet.'}</div><div id="jobs">${rows.map(jobCard).join('')}</div><div id="sheet"></div>`;
  el.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>openSheet(b.dataset.id));
}
function jobCard(r){const s=svc(r.service);return `<button type="button" class="job" data-id="${esc(r.id)}"><div class="who"><strong>${esc(r.boat)}</strong><span class="status ${cls(r.status)}">${esc(r.status)}</span></div><small>${esc(r.owner)} · …${last4(r.phone)} · ${esc(r.length)} ft · ${esc(s.label)}</small><br><small>${esc(weekLabel(r.week))}${r.haulDate?' · haul '+esc(r.haulDate):''} · ${esc(r.at)}${r.afterHours?' · after 4':''}</small></button>`;}
function openSheet(id){
  const rows=load(); const r=rows.find(x=>x.id===id); if(!r)return;
  const box=document.getElementById('sheet');
  box.innerHTML=`<div class="sheet"><h2>${esc(r.boat)}</h2><p class="lede">${esc(r.owner)} · …${last4(r.phone)} · ${esc(r.place)}</p><div class="statuses">${STATUSES.map(s=>`<button type="button" data-st="${s}">${s}</button>`).join('')}</div><label>Haul date<input type="date" id="haul" value="${esc(r.haulDate||'')}"></label><label>Note<textarea id="note" rows="3" placeholder="key in office / shrink yes">${esc(r.note||'')}</textarea></label><button class="btn" id="save">Save on the board</button><button class="btn sec" id="close">Close</button></div>`;
  box.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{r.status=b.dataset.st;});
  document.getElementById('close').onclick=()=>{box.innerHTML='';};
  document.getElementById('save').onclick=()=>{r.haulDate=document.getElementById('haul').value;r.note=document.getElementById('note').value;save(rows);renderOps();};
}
if(document.getElementById('app')) renderCustomer();
if(document.getElementById('ops')) renderOps();
