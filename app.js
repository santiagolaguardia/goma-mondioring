
const OFFICIAL = [
{id:1,section:"Obediencia",name:"Junto sin correa",state:2,priority:4,priorityLabel:"Alta",goal:"Sentado automático y posición estable con refuerzo menos previsible",fields:["distance","reps","hits","errors"]},
{id:2,section:"Obediencia",name:"Ausencia del conductor",state:2,priority:4,priorityLabel:"Alta",goal:"Aumentar duración sin aumentar distancia",fields:["distance","durationSec","reps","errors"]},
{id:3,section:"Obediencia",name:"Rechazo de alimento",state:3,priority:2,priorityLabel:"Mantenimiento",goal:"Mantener neutralidad con diferentes presentaciones",fields:["reps","hits","errors"]},
{id:4,section:"Obediencia",name:"Envío hacia adelante",state:2,priority:4,priorityLabel:"Alta",goal:"Reducir dependencia visual del target manteniendo rectitud",fields:["distance","reps","hits","errors","targetDependency"]},
{id:5,section:"Obediencia",name:"Cobro del objeto",state:2,priority:3,priorityLabel:"Media-alta",goal:"Entrada limpia al guía y posesión tranquila",fields:["reps","hits","errors","finishQuality"]},
{id:6,section:"Obediencia",name:"Posiciones a distancia",state:2,priority:5,priorityLabel:"Muy alta",goal:"Discriminación y cero avance antes de pasar de 4 m",fields:["distance","reps","hits","errors","advanceCm"]},
{id:7,section:"Obediencia",name:"Búsqueda del bloque",state:1,priority:4,priorityLabel:"Alta",goal:"Consolidar búsqueda olfativa antes de introducir distractores",fields:["distance","reps","hits","errors"]},
{id:8,section:"Saltos",name:"Empalizada",state:0,priority:1,priorityLabel:"Baja",goal:"Fundamentos técnicos y físicos; no buscar altura máxima",fields:["height","reps","hits","errors"]},
{id:9,section:"Saltos",name:"Salto de longitud",state:0,priority:1,priorityLabel:"Baja",goal:"Fundamentos técnicos y físicos",fields:["distance","reps","hits","errors"]},
{id:10,section:"Saltos",name:"Valla",state:0,priority:1,priorityLabel:"Baja",goal:"Técnica de ida y vuelta antes de altura",fields:["height","reps","hits","errors"]},
{id:11,section:"Protección",name:"Ataque frente con bastón",state:1,priority:5,priorityLabel:"Muy alta",goal:"Profundidad y estabilidad sobre tibia",fields:["reps","hits","errors","biteDepth","biteStability"]},
{id:12,section:"Protección",name:"Ataque con accesorios",state:1,priority:2,priorityLabel:"Media",goal:"Generalizar sin perder calidad de boca",fields:["reps","hits","errors","biteDepth","biteStability"]},
{id:13,section:"Protección",name:"Ataque en huida",state:1,priority:3,priorityLabel:"Media-alta",goal:"Persecución y entrada sin deteriorar mordida",fields:["reps","hits","errors","biteDepth","biteStability"]},
{id:14,section:"Protección",name:"Ataque frustrado",state:1,priority:2,priorityLabel:"En espera",goal:"Construir primero una llamada fiable bajo drive",fields:["distance","reps","hits","errors"]},
{id:15,section:"Protección",name:"Búsqueda y conducción HA",state:0,priority:2,priorityLabel:"En espera",goal:"Construir búsqueda, ladrido, vigilancia y fugas por separado",fields:["reps","hits","errors"]},
{id:16,section:"Protección",name:"Defensa del conductor",state:1,priority:2,priorityLabel:"En espera",goal:"Discriminación contextual antes del ejercicio completo",fields:["reps","hits","errors","biteDepth","biteStability"]},
{id:17,section:"Protección",name:"Guardia de objeto",state:0,priority:1,priorityLabel:"Baja",goal:"Postergar el ejercicio completo",fields:["reps","hits","errors"]}
];

const AUX = [
{id:101,section:"Auxiliar",name:"Llamada bajo drive",state:2,priority:5,priorityLabel:"Muy alta",goal:"Respuesta inmediata al primer comando sin apagar intensidad",fields:["reps","hits","errors","drive"]},
{id:102,section:"Auxiliar",name:"Acondicionamiento físico",state:1,priority:2,priorityLabel:"Mantenimiento",goal:"Fuerza y condición sin fatigar el trabajo técnico",fields:["durationSec"]},
{id:103,section:"Auxiliar",name:"Mordida técnica / HA",state:1,priority:5,priorityLabel:"Muy alta",goal:"Entrada centrada en tibia, boca llena y estabilidad en estático",fields:["reps","biteDepth","biteStability"]}
];

const ALL=[...OFFICIAL,...AUX];
const STATE_NAMES=["No iniciado","Fundamentos","En construcción","Comprendido","Consolidado","Competitivo C3"];
const STORAGE_KEY="goma_mondioring_sessions_v1";

const WEEK_PLAN = {
  1:[{id:1,role:"Principal",target:"Junto: posición + sentado automático"},{id:6,role:"Secundario",target:"Posiciones: 4 m, primer comando y cero avance"}],
  2:[{id:7,role:"Principal",target:"Bloque: patrón de búsqueda olfativa"},{id:2,role:"Secundario",target:"Ausencia: subir duración, no distancia"}],
  3:[{id:5,role:"Principal",target:"Cobro: regreso + final limpio"},{id:101,role:"Micro",target:"Llamada desde excitación media"}],
  4:[{id:4,role:"Principal",target:"Envío: rectitud a 20 m + fading de target"},{id:6,role:"Secundario",target:"Posiciones: mantener 4 m"}],
  5:[{id:1,role:"Principal",target:"Junto: variabilidad de refuerzo"},{id:3,role:"Secundario",target:"Rechazo: mantenimiento"},{id:101,role:"Micro",target:"Llamada bajo drive"}],
  6:[{id:103,role:"Principal",target:"HA: tibia + profundidad + estabilidad"},{id:101,role:"Micro",target:"Control / llamada si la calidad de mordida lo permite"}],
  0:[{id:102,role:"Recuperación",target:"Paseo libre / trabajo físico suave"}]
};

const ACTIVE_OBJECTIVES = [
  {id:6,title:"Posiciones 4 m",criterion:"2 sesiones consecutivas con ≥80% de aciertos y avance ≤5 cm.",next:"Pasar a 5 m manteniendo la misma mecánica."},
  {id:2,title:"Ausencia 30–40 s",criterion:"2 sesiones sin cambio de posición ni desplazamiento.",next:"Aumentar 5–10 s; mantener distancia."},
  {id:4,title:"Envío 20 m",criterion:"Rectitud ≥80% y dependencia visual del target ≤2/5 en 2 sesiones.",next:"Reducir target o aumentar 2–5 m, no ambas cosas a la vez."},
  {id:1,title:"Junto / detenciones",criterion:"≥80% de detenciones con sentado automático en 2 sesiones.",next:"Aumentar imprevisibilidad del refuerzo, no distancia."},
  {id:103,title:"Mordida técnica",criterion:"Profundidad ≥4/5 y estabilidad ≥4/5 en 2 sesiones.",next:"Agregar progresivamente estático/tormento manteniendo boca llena."},
  {id:101,title:"Llamada bajo drive",criterion:"≥80% de respuestas al primer comando en 2 sesiones.",next:"Subir excitación de forma gradual."}
];

let deferredPrompt=null;
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const num=v=>v===""||v==null?null:Number(v);
const getSessions=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return[]}};
const saveSessions=s=>localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
const localISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
const mondayOf=(date=new Date())=>{const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());const wd=(d.getDay()+6)%7;d.setDate(d.getDate()-wd);return d};
const isoDate=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const getEx=id=>ALL.find(x=>x.id===Number(id));
const sessionsFor=id=>getSessions().filter(s=>Number(s.exerciseId)===Number(id)).sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date));
const ratio=s=>s&&s.reps>0&&s.hits!=null?s.hits/s.reps:null;
const lastN=(id,n=2)=>sessionsFor(id).slice(0,n);

function switchTab(name){
  $$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  $$(".section").forEach(s=>s.classList.toggle("active",s.id==="sec-"+name));
  if(name==="history")renderHistory();
  if(name==="coach")renderCoach();
  if(name==="progress")renderProgress();
}
$$(".tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));

function coachRule(id){
  const last=lastN(id,1)[0];
  if(id===6){
    if(!last)return {level:"info",text:"Mantener 4 m. Medir discriminación y avance antes de aumentar distancia."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(ratio(s)??0)>=.8 && (s.advanceCm??999)<=5 && (s.distance??0)>=4);
    return good?{level:"good",text:"Listo para probar 5 m. Cambiá sólo la distancia; mantené baja la distracción."}:{level:"warn",text:"No aumentes distancia todavía. Buscá ≥80% y avance ≤5 cm en dos sesiones seguidas."};
  }
  if(id===2){
    if(!last)return {level:"info",text:"Trabajá duración. Mantené la distancia ya conocida y buscá 30–40 s estable."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(s.durationSec??0)>=30 && (s.errors??0)===0);
    return good?{level:"good",text:"Podés sumar 5–10 s de duración. No aumentes distancia simultáneamente."}:{level:"warn",text:"Mantené distancia y buscá 30–40 s sin desplazamiento ni cambio de posición."};
  }
  if(id===4){
    if(!last)return {level:"info",text:"Mantené 20 m y observá dependencia visual del target."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(ratio(s)??0)>=.8 && (s.targetDependency??5)<=2 && (s.distance??0)>=20);
    return good?{level:"good",text:"Podés reducir el target o sumar 2–5 m. Elegí una sola variable."}:{level:"warn",text:"No aumentes metros. Trabajá rectitud y fading del target."};
  }
  if(id===1){
    if(!last)return {level:"info",text:"No aumentes distancia. Objetivo: sentado automático al detenerte."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(ratio(s)??0)>=.8);
    return good?{level:"good",text:"Mantené metros y hacé menos previsible el refuerzo. Variá duración y punto de premio."}:{level:"warn",text:"Prioridad a detenciones y calidad de Fuss; no sumes distancia."};
  }
  if(id===7){
    if(!last)return {level:"info",text:"Un solo bloque. Reforzá entrar al área y bajar nariz alrededor del punto de depósito."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(ratio(s)??0)>=.8);
    return good?{level:"good",text:"Podés empezar una discriminación muy simple, sin convertirla en prueba-error visual."}:{level:"warn",text:"Seguí con un bloque y variá ocultación; todavía no agregues distractores."};
  }
  if(id===5){
    if(!last)return {level:"info",text:"Priorizá regreso directo, posesión tranquila y final limpio."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(ratio(s)??0)>=.8 && (s.precision??0)>=4);
    return good?{level:"good",text:"Empezá a hacer menos necesario el comando de sentado en el final."}:{level:"warn",text:"Mantené el criterio actual; no sacrifiques posesión por apurar el final."};
  }
  if(id===103 || [11,12,13,16].includes(id)){
    if(!last)return {level:"info",text:"Buscá tibia, boca llena, empuje y estabilidad. Pocas mordidas de alta calidad."};
    if((last.biteDepth??0)>=4 && (last.biteStability??0)<4)return {level:"warn",text:"La profundidad está; no aumentes presión. Trabajá estabilidad al bajar movimiento."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(s.biteDepth??0)>=4 && (s.biteStability??0)>=4);
    return good?{level:"good",text:"Podés agregar gradualmente más estático/tormento manteniendo profundidad."}:{level:"warn",text:"Seguimos construyendo profundidad + estabilidad. Cortá antes de que la boca se deteriore."};
  }
  if(id===101 || id===14){
    if(!last)return {level:"info",text:"Pocas repeticiones. Llamada desde excitación media y premio potente al volver."};
    const good=lastN(id,2).length>=2 && lastN(id,2).every(s=>(ratio(s)??0)>=.8);
    return good?{level:"good",text:"Subí gradualmente el nivel de excitación, manteniendo respuesta al primer comando."}:{level:"warn",text:"No subas drive todavía. Consolidá respuesta inmediata al primer comando."};
  }
  if(id===3)return {level:"good",text:"Mantenimiento: variedad de alimentos y contextos sin buscar evitación."};
  if([8,9,10].includes(id))return {level:"info",text:"Por ahora técnica y confianza. No persigas altura/distancia máxima."};
  return {level:"info",text:getEx(id)?.goal||"Mantener trabajo técnico."};
}

function todayPlan(){return WEEK_PLAN[new Date().getDay()]||[]}
function completionForPlanItem(item){return getSessions().some(s=>s.date===localISO() && Number(s.exerciseId)===item.id)}

function renderDashboard(){
  const sessions=getSessions();
  $("#kpiSessions").textContent=sessions.length;
  const last=sessions.slice().sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date))[0];
  $("#kpiLast").textContent=last?last.date.split("-").reverse().join("/"):"—";
  const reps=sessions.reduce((a,s)=>a+(s.reps||0),0),hits=sessions.reduce((a,s)=>a+(s.hits||0),0);
  $("#kpiAccuracy").textContent=reps?Math.round(hits/reps*100)+"%":"—";
  $("#todayPlanHome").innerHTML=todayPlan().map(p=>{
    const e=getEx(p.id),done=completionForPlanItem(p),rule=coachRule(p.id);
    return `<div class="planItem"><div class="planHead"><div><div class="planTag">${esc(p.role)}</div><h3>${esc(e.name)}</h3></div><span class="pill ${done?'good':''}">${done?'Hecho':'Pendiente'}</span></div><div class="small" style="margin-top:5px">${esc(p.target)}</div><div class="small muted" style="margin-top:4px">${esc(rule.text)}</div></div>`;
  }).join("");
  $("#recentSessions").innerHTML=sessions.length?sessions.slice().sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")).slice(0,3).map(sessionCard).join(""):'<div class="empty">Todavía no cargaste entrenamientos.</div>';
}

function renderCoach(){
  $("#coachToday").innerHTML=todayPlan().map(p=>{
    const e=getEx(p.id),done=completionForPlanItem(p),rule=coachRule(p.id);
    return `<div class="planItem"><div class="planHead"><div><div class="planTag">${esc(p.role)}</div><h3>${esc(e.name)}</h3></div><span class="pill ${done?'good':''}">${done?'✓ Hecho':'Pendiente'}</span></div><div class="small" style="margin-top:5px"><b>Objetivo:</b> ${esc(p.target)}</div><div class="callout ${rule.level}" style="margin-top:8px"><div class="small"><b>Coach:</b> ${esc(rule.text)}</div></div></div>`;
  }).join("");

  const start=mondayOf(), weekSessions=getSessions().filter(s=>{
    const end=new Date(start); end.setDate(start.getDate()+6);
    return s.date>=isoDate(start) && s.date<=isoDate(end);
  });
  const dayNames=["L","M","X","J","V","S","D"], jsDays=[1,2,3,4,5,6,0];
  $("#weekBar").innerHTML=jsDays.map((jsd,i)=>{
    const d=new Date(start);d.setDate(start.getDate()+i);const di=isoDate(d);
    const has=weekSessions.some(s=>s.date===di),today=di===localISO();
    return `<div class="day ${has?'done':''} ${today?'today':''}">${dayNames[i]}<br><span>${d.getDate()}</span></div>`;
  }).join("");

  $("#weeklyStatus").innerHTML=jsDays.map(jsd=>{
    const planned=WEEK_PLAN[jsd]||[];
    const doneIds=new Set(weekSessions.filter(s=>new Date(s.date+"T12:00:00").getDay()===jsd).map(s=>Number(s.exerciseId)));
    const count=planned.filter(p=>doneIds.has(p.id)).length;
    const dayLabel={1:"Lunes",2:"Martes",3:"Miércoles",4:"Jueves",5:"Viernes",6:"Sábado",0:"Domingo"}[jsd];
    return `<div class="small" style="padding:5px 0"><b>${dayLabel}:</b> ${count}/${planned.length} objetivos registrados</div>`;
  }).join("");

  $("#activeObjectives").innerHTML=ACTIVE_OBJECTIVES.map(o=>{
    const arr=lastN(o.id,2);let progress=0;
    if(o.id===6)progress=arr.filter(s=>(ratio(s)??0)>=.8&&(s.advanceCm??999)<=5&&(s.distance??0)>=4).length;
    else if(o.id===2)progress=arr.filter(s=>(s.durationSec??0)>=30&&(s.errors??0)===0).length;
    else if(o.id===4)progress=arr.filter(s=>(ratio(s)??0)>=.8&&(s.targetDependency??5)<=2&&(s.distance??0)>=20).length;
    else if(o.id===103)progress=arr.filter(s=>(s.biteDepth??0)>=4&&(s.biteStability??0)>=4).length;
    else progress=arr.filter(s=>(ratio(s)??0)>=.8).length;
    return `<div class="objectiveItem"><div class="objectiveHead"><div><h3>${esc(o.title)}</h3><div class="tiny muted">${esc(o.criterion)}</div></div><span class="pill ${progress>=2?'good':progress===1?'warn':''}">${Math.min(progress,2)}/2</span></div><div class="progress"><span style="width:${Math.min(progress,2)*50}%"></span></div><div class="small muted" style="margin-top:6px">Después: ${esc(o.next)}</div></div>`;
  }).join("");

  renderAlerts();
}

function renderAlerts(){
  const alerts=[],sessions=getSessions(),today=new Date();
  [1,2,4,5,6,7,101,103].forEach(id=>{
    const arr=sessionsFor(id);if(!arr.length)return;
    const d=new Date(arr[0].date+"T12:00:00"),diff=Math.floor((today-d)/(1000*60*60*24));
    if(diff>=7)alerts.push({level:"warn",text:`${getEx(id).name}: ${diff} días sin registro.`});
  });
  [1,4,5,6,7,101].forEach(id=>{
    const arr=lastN(id,2);
    if(arr.length===2){
      const r0=ratio(arr[0]),r1=ratio(arr[1]);
      if(r0!=null&&r1!=null&&r0<.6&&r1<.6)alerts.push({level:"bad",text:`${getEx(id).name}: dos sesiones consecutivas por debajo del 60%. Bajá dificultad o cambiá criterio.`});
    }
  });
  const bite=lastN(103,1)[0]||lastN(11,1)[0];
  if(bite && (bite.biteDepth??0)>=4 && (bite.biteStability??0)<=2)alerts.push({level:"warn",text:"Mordida: buena profundidad pero estabilidad baja. No aumentar presión todavía."});
  $("#alerts").innerHTML=alerts.length?alerts.map(a=>`<div class="callout ${a.level}" style="margin-top:8px"><div class="small">${esc(a.text)}</div></div>`).join(""):'<div class="callout good"><div class="small">Sin alertas técnicas automáticas con los datos actuales.</div></div>';
}

function whatNow(){
  const pending=todayPlan().filter(p=>!completionForPlanItem(p));
  let pick=pending[0];
  if(!pick){
    const week=getSessions().filter(s=>{
      const start=mondayOf(),end=new Date(start);end.setDate(start.getDate()+6);
      return s.date>=isoDate(start)&&s.date<=isoDate(end)
    });
    const doneCounts={};week.forEach(s=>doneCounts[s.exerciseId]=(doneCounts[s.exerciseId]||0)+1);
    const candidates=[6,1,4,7,101].map(id=>({id,count:doneCounts[id]||0,p:getEx(id).priority})).sort((a,b)=>a.count-b.count||b.p-a.p);
    pick={id:candidates[0].id,role:"Extra controlado",target:getEx(candidates[0].id).goal};
  }
  const e=getEx(pick.id),rule=coachRule(pick.id);
  $("#whatNowResult").innerHTML=`<div class="callout info"><div class="planTag">${esc(pick.role)}</div><h3 style="margin-top:3px">${esc(e.name)}</h3><div class="small" style="margin-top:5px">${esc(pick.target)}</div><div class="small" style="margin-top:6px"><b>Coach:</b> ${esc(rule.text)}</div></div>`;
}

function renderMap(){
  $("#exerciseMap").innerHTML=OFFICIAL.map(e=>`<div class="exercise"><div><h3>${e.id}. ${esc(e.name)}</h3><div class="small muted">${e.section} · Prioridad ${e.priorityLabel}</div><div class="small" style="margin-top:5px">${esc(e.goal)}</div><div class="progress"><span style="width:${e.state*20}%"></span></div></div><span class="pill">${e.state}/5 · ${STATE_NAMES[e.state]}</span></div>`).join("");
}

function renderHistory(){
  const sessions=getSessions().slice().sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date));
  $("#historyCount").textContent=sessions.length;
  $("#historyList").innerHTML=sessions.length?sessions.map(sessionCard).join(""):'<div class="empty">Sin sesiones todavía.</div>';
}

function sessionCard(s){
  const e=getEx(s.exerciseId)||{name:"Ejercicio"};
  const metrics=[s.drive?`Drive ${s.drive}/5`:"",s.precision?`Precisión ${s.precision}/5`:"",s.stability?`Estabilidad ${s.stability}/5`:""].filter(Boolean);
  return `<article class="session"><div class="sessionHead"><div><strong>${esc(e.name)}</strong><div class="tiny muted">${esc(s.date)}${s.minutes?` · ${s.minutes} min`:""}</div></div><span class="pill">${esc(s.decision||"Mantener")}</span></div>
  <div class="small" style="margin-top:7px"><b>Objetivo:</b> ${esc(s.objective||"—")}</div>
  ${(s.reps!=null||s.hits!=null||s.errors!=null)?`<div class="small muted" style="margin-top:4px">Reps ${s.reps??"—"} · Aciertos ${s.hits??"—"} · Errores ${s.errors??"—"}</div>`:""}
  ${s.distance!=null?`<div class="small muted">Distancia ${s.distance} m</div>`:""}
  ${s.durationSec!=null?`<div class="small muted">Duración ${s.durationSec} s</div>`:""}
  ${s.advanceCm!=null?`<div class="small muted">Avance máx. ${s.advanceCm} cm</div>`:""}
  ${s.targetDependency!=null?`<div class="small muted">Dependencia target ${s.targetDependency}/5</div>`:""}
  ${s.biteDepth?`<div class="small muted">Mordida: profundidad ${s.biteDepth}/5 · estabilidad ${s.biteStability||"—"}/5</div>`:""}
  ${metrics.length?`<div class="score">${metrics.map(m=>`<span>${m}</span>`).join("")}</div>`:""}
  ${s.notes?`<div class="small" style="margin-top:8px">${esc(s.notes)}</div>`:""}</article>`;
}

function renderProgress(){
  const sessions=getSessions(),byEx={};sessions.forEach(s=>(byEx[s.exerciseId]||=[]).push(s));
  $("#progressList").innerHTML=ALL.map(e=>{
    const arr=byEx[e.id]||[],latest=arr.slice().sort((a,b)=>(b.createdAt||b.date).localeCompare(a.createdAt||a.date))[0];
    const reps=arr.reduce((a,s)=>a+(s.reps||0),0),hits=arr.reduce((a,s)=>a+(s.hits||0),0),acc=reps?Math.round(hits/reps*100):null,rule=coachRule(e.id);
    return `<div class="exercise"><div><h3>${esc(e.name)}</h3><div class="small muted">${arr.length} sesiones${acc!==null?` · ${acc}% aciertos`:""}</div><div class="small" style="margin-top:4px">${latest?`Última ${esc(latest.date)} · ${esc(latest.decision||"")}`:esc(e.goal)}</div><div class="tiny muted" style="margin-top:4px">Coach: ${esc(rule.text)}</div></div><span class="pill">${e.section==="Auxiliar"?"Aux":e.state+"/5"}</span></div>`;
  }).join("");
}

const select=$("#exercise");
ALL.forEach(e=>{const o=document.createElement("option");o.value=e.id;o.textContent=`${e.section==="Auxiliar"?"Aux":e.id}. ${e.name}`;select.appendChild(o)});
$("#date").value=localISO();

const fieldMap={distance:"#fDistance",durationSec:"#fDurationSec",reps:"#fReps",hits:"#fHits",errors:"#fErrors",advanceCm:"#fAdvance",height:"#fHeight",biteDepth:"#fBiteDepth",biteStability:"#fBiteStability",targetDependency:"#fTargetDependency",finishQuality:"#fFinishQuality"};
function updateExerciseFields(){
  const e=getEx(select.value);$("#exerciseGoal").textContent=e?e.goal:"";
  Object.entries(fieldMap).forEach(([key,sel])=>$(sel).style.display=e&&e.fields.includes(key)?"block":"none");
  $("#coachBefore").textContent=e?coachRule(e.id).text:"";
}
select.addEventListener("change",updateExerciseFields);updateExerciseFields();

function openModal(id=null){if(id!=null){select.value=String(id);updateExerciseFields()}$("#sessionModal").classList.add("open");document.body.style.overflow="hidden"}
function closeModal(){$("#sessionModal").classList.remove("open");document.body.style.overflow=""}
$("#openSession").addEventListener("click",()=>openModal());$("#closeSession").addEventListener("click",closeModal);$("#cancelSession").addEventListener("click",closeModal);

$("#sessionForm").addEventListener("submit",ev=>{
  ev.preventDefault();
  const s={createdAt:new Date().toISOString(),date:$("#date").value,exerciseId:Number(select.value),objective:$("#objective").value.trim(),minutes:num($("#minutes").value),distance:num($("#distance").value),durationSec:num($("#durationSec").value),reps:num($("#reps").value),hits:num($("#hits").value),errors:num($("#errors").value),advanceCm:num($("#advanceCm").value),height:num($("#height").value),biteDepth:num($("#biteDepth").value),biteStability:num($("#biteStability").value),targetDependency:num($("#targetDependency").value),finishQuality:num($("#finishQuality").value),help:$("#help").value.trim(),reward:$("#reward").value.trim(),drive:num($("#drive").value),precision:num($("#precision").value),stability:num($("#stability").value),notes:$("#notes").value.trim(),decision:$("#decision").value};
  if(s.reps!=null&&s.hits!=null&&s.hits>s.reps){alert("Los aciertos no pueden superar las repeticiones.");return}
  if(s.reps!=null&&s.errors!=null&&s.errors>s.reps){alert("Los errores no pueden superar las repeticiones.");return}
  const sessions=getSessions();sessions.push(s);saveSessions(sessions);
  ev.target.reset();$("#date").value=localISO();select.value="1";updateExerciseFields();closeModal();
  renderDashboard();renderCoach();renderHistory();renderProgress();switchTab("home");
});

$("#whatNowBtn").addEventListener("click",whatNow);

$("#exportBtn").addEventListener("click",()=>{
  const payload={version:2,dog:{name:"Goma",breed:"Pastor Belga Malinois",birth:"2025-08-13",weightKg:30,goal:"Mondioring III"},exportedAt:new Date().toISOString(),sessions:getSessions()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="goma-mondioring-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),600);
});
$("#importInput").addEventListener("change",async ev=>{
  const f=ev.target.files?.[0];if(!f)return;
  try{const data=JSON.parse(await f.text());if(!Array.isArray(data.sessions))throw new Error();
    if(confirm(`Importar ${data.sessions.length} sesiones y reemplazar las actuales?`)){saveSessions(data.sessions);renderDashboard();renderCoach();renderHistory();renderProgress();alert("Bitácora importada.");}
  }catch{alert("Backup no válido.");}
  ev.target.value="";
});
$("#clearBtn").addEventListener("click",()=>{if(confirm("¿Borrar todas las sesiones guardadas en este dispositivo?")){localStorage.removeItem(STORAGE_KEY);renderDashboard();renderCoach();renderHistory();renderProgress();}});

window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("#installBtn").style.display="inline-flex"});
$("#installBtn").addEventListener("click",async()=>{if(!deferredPrompt){$("#installHelp").style.display="block";return}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("#installBtn").style.display="none"});
$("#installHelpBtn").addEventListener("click",()=>$("#installHelp").style.display="block");

if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}))}
renderMap();renderDashboard();renderCoach();renderProgress();
