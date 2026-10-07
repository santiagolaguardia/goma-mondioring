
const EXERCISES = [
 {id:1,section:"Obediencia",name:"Junto sin correa",state:2,priority:"Alta",goal:"Sentado automático y posición estable con refuerzo menos previsible",fields:["distance","reps","hits","errors"]},
 {id:2,section:"Obediencia",name:"Ausencia del conductor",state:2,priority:"Alta",goal:"Aumentar duración sin aumentar distancia",fields:["distance","durationSec","reps","errors"]},
 {id:3,section:"Obediencia",name:"Rechazo de alimento",state:3,priority:"Media",goal:"Mantener neutralidad con diferentes presentaciones",fields:["reps","hits","errors"]},
 {id:4,section:"Obediencia",name:"Envío hacia adelante",state:2,priority:"Alta",goal:"Reducir dependencia visual del target manteniendo rectitud",fields:["distance","reps","hits","errors"]},
 {id:5,section:"Obediencia",name:"Cobro del objeto",state:2,priority:"Alta",goal:"Entrada limpia al guía y posesión tranquila",fields:["reps","hits","errors"]},
 {id:6,section:"Obediencia",name:"Posiciones a distancia",state:2,priority:"Alta",goal:"Discriminación y cero avance antes de pasar de 4 m",fields:["distance","reps","hits","errors","advanceCm"]},
 {id:7,section:"Obediencia",name:"Búsqueda del bloque",state:1,priority:"Alta",goal:"Consolidar búsqueda olfativa antes de introducir distractores",fields:["distance","reps","hits","errors"]},
 {id:8,section:"Saltos",name:"Empalizada",state:0,priority:"Baja",goal:"Fundamentos técnicos y físicos",fields:["height","reps","hits","errors"]},
 {id:9,section:"Saltos",name:"Salto de longitud",state:0,priority:"Baja",goal:"Fundamentos técnicos y físicos",fields:["distance","reps","hits","errors"]},
 {id:10,section:"Saltos",name:"Valla",state:0,priority:"Baja",goal:"Técnica de ida y vuelta antes de altura",fields:["height","reps","hits","errors"]},
 {id:11,section:"Protección",name:"Ataque frente con bastón",state:1,priority:"Muy alta",goal:"Profundidad y estabilidad sobre tibia",fields:["reps","hits","errors","biteDepth","biteStability"]},
 {id:12,section:"Protección",name:"Ataque con accesorios",state:1,priority:"Media",goal:"Generalizar sin perder calidad de boca",fields:["reps","hits","errors","biteDepth","biteStability"]},
 {id:13,section:"Protección",name:"Ataque en huida",state:1,priority:"Alta",goal:"Persecución y entrada sin deteriorar mordida",fields:["reps","hits","errors","biteDepth","biteStability"]},
 {id:14,section:"Protección",name:"Ataque frustrado",state:1,priority:"Media",goal:"Construir primero llamada fiable bajo drive",fields:["distance","reps","hits","errors"]},
 {id:15,section:"Protección",name:"Búsqueda y conducción HA",state:0,priority:"Media",goal:"Construir búsqueda, ladrido, vigilancia y fugas por separado",fields:["reps","hits","errors"]},
 {id:16,section:"Protección",name:"Defensa del conductor",state:1,priority:"Media",goal:"Discriminación contextual antes del ejercicio completo",fields:["reps","hits","errors","biteDepth","biteStability"]},
 {id:17,section:"Protección",name:"Guardia de objeto",state:0,priority:"Baja",goal:"Postergar ejercicio completo",fields:["reps","hits","errors"]}
];
const STATE_NAMES=["No iniciado","Fundamentos","En construcción","Comprendido","Consolidado","Competitivo C3"];
const STORAGE_KEY="goma_mondioring_sessions_v1";
let deferredPrompt=null;

const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const num=v=>v===""||v===null||v===undefined?null:Number(v);
const getSessions=()=>{try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return[]}};
const saveSessions=s=>localStorage.setItem(STORAGE_KEY,JSON.stringify(s));
const today=()=>new Date().toISOString().slice(0,10);

function switchTab(name){
  $$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  $$(".section").forEach(s=>s.classList.toggle("active",s.id==="sec-"+name));
  if(name==="history") renderHistory();
  if(name==="progress") renderProgress();
}
$$(".tab").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));

function renderDashboard(){
  const sessions=getSessions();
  $("#kpiSessions").textContent=sessions.length;
  const last=sessions.slice().sort((a,b)=>b.date.localeCompare(a.date))[0];
  $("#kpiLast").textContent=last?last.date.split("-").reverse().join("/"):"—";
  const reps=sessions.reduce((a,s)=>a+(s.reps||0),0);
  const hits=sessions.reduce((a,s)=>a+(s.hits||0),0);
  $("#kpiAccuracy").textContent=reps?Math.round(hits/reps*100)+"%":"—";
  const recent=$("#recentSessions");
  if(!sessions.length){recent.innerHTML='<div class="empty">Todavía no cargaste entrenamientos.</div>';return;}
  recent.innerHTML=sessions.slice().sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")).slice(0,4).map(sessionCard).join("");
}

function renderMap(){
  $("#exerciseMap").innerHTML=EXERCISES.map(e=>`
    <div class="exercise">
      <div>
        <h3>${e.id}. ${esc(e.name)}</h3>
        <div class="small muted">${e.section} · Prioridad ${e.priority}</div>
        <div class="small" style="margin-top:5px">${esc(e.goal)}</div>
        <div class="progress"><span style="width:${e.state*20}%"></span></div>
      </div>
      <span class="pill state">${e.state}/5 · ${STATE_NAMES[e.state]}</span>
    </div>`).join("");
}

function renderHistory(){
  const sessions=getSessions().slice().sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""));
  $("#historyCount").textContent=sessions.length;
  $("#historyList").innerHTML=sessions.length?sessions.map(sessionCard).join(""):'<div class="empty">Sin sesiones todavía.</div>';
}

function sessionCard(s){
  const e=EXERCISES.find(x=>x.id===s.exerciseId)||{name:"Ejercicio"};
  const metrics=[
    s.drive?`Drive ${s.drive}/5`:"",
    s.precision?`Precisión ${s.precision}/5`:"",
    s.stability?`Estabilidad ${s.stability}/5`:""
  ].filter(Boolean);
  return `<article class="session">
    <div class="sessionHead">
      <div><strong>${esc(e.name)}</strong><div class="tiny muted">${esc(s.date)}${s.minutes?` · ${s.minutes} min`:""}</div></div>
      <span class="pill">${esc(s.decision||"Mantener")}</span>
    </div>
    <div class="small" style="margin-top:7px"><b>Objetivo:</b> ${esc(s.objective)}</div>
    ${(s.reps!=null||s.hits!=null||s.errors!=null)?`<div class="small muted" style="margin-top:4px">Reps ${s.reps??"—"} · Aciertos ${s.hits??"—"} · Errores ${s.errors??"—"}</div>`:""}
    ${s.distance!=null?`<div class="small muted">Distancia: ${s.distance} m</div>`:""}
    ${s.advanceCm!=null?`<div class="small muted">Avance máx.: ${s.advanceCm} cm</div>`:""}
    ${s.biteDepth?`<div class="small muted">Profundidad mordida: ${s.biteDepth}/5 · Estabilidad: ${s.biteStability||"—"}/5</div>`:""}
    ${metrics.length?`<div class="score">${metrics.map(m=>`<span>${m}</span>`).join("")}</div>`:""}
    ${s.notes?`<div class="small" style="margin-top:8px">${esc(s.notes)}</div>`:""}
  </article>`;
}

function renderProgress(){
  const sessions=getSessions();
  const byEx={};
  sessions.forEach(s=>(byEx[s.exerciseId] ||= []).push(s));
  $("#progressList").innerHTML=EXERCISES.map(e=>{
    const arr=byEx[e.id]||[];
    const latest=arr.slice().sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||""))[0];
    const reps=arr.reduce((a,s)=>a+(s.reps||0),0), hits=arr.reduce((a,s)=>a+(s.hits||0),0);
    const acc=reps?Math.round(hits/reps*100):null;
    return `<div class="exercise">
      <div><h3>${e.id}. ${esc(e.name)}</h3>
      <div class="small muted">${arr.length} sesiones${acc!==null?` · ${acc}% aciertos`:""}</div>
      <div class="small" style="margin-top:4px">${latest?`Última: ${esc(latest.date)} · ${esc(latest.decision)}`:`Objetivo: ${esc(e.goal)}`}</div></div>
      <span class="pill">${e.state}/5</span>
    </div>`;
  }).join("");
}

const select=$("#exercise");
EXERCISES.forEach(e=>{
  const o=document.createElement("option"); o.value=e.id; o.textContent=`${e.id}. ${e.name}`; select.appendChild(o);
});
$("#date").value=today();

const fieldMap={
  distance:"#fDistance",durationSec:"#fDurationSec",reps:"#fReps",hits:"#fHits",errors:"#fErrors",
  advanceCm:"#fAdvance",height:"#fHeight",biteDepth:"#fBiteDepth",biteStability:"#fBiteStability"
};
function updateExerciseFields(){
  const e=EXERCISES.find(x=>x.id===Number(select.value));
  $("#exerciseGoal").textContent=e?e.goal:"";
  Object.entries(fieldMap).forEach(([key,sel])=>$(sel).style.display=e&&e.fields.includes(key)?"block":"none");
}
select.addEventListener("change",updateExerciseFields);updateExerciseFields();

function openModal(){ $("#sessionModal").classList.add("open");document.body.style.overflow="hidden"; }
function closeModal(){ $("#sessionModal").classList.remove("open");document.body.style.overflow=""; }
$("#openSession").addEventListener("click",openModal);
$("#closeSession").addEventListener("click",closeModal);
$("#cancelSession").addEventListener("click",closeModal);

$("#sessionForm").addEventListener("submit",ev=>{
  ev.preventDefault();
  const session={
    createdAt:new Date().toISOString(),
    date:$("#date").value,
    exerciseId:Number(select.value),
    objective:$("#objective").value.trim(),
    minutes:num($("#minutes").value),
    distance:num($("#distance").value),
    durationSec:num($("#durationSec").value),
    reps:num($("#reps").value),
    hits:num($("#hits").value),
    errors:num($("#errors").value),
    advanceCm:num($("#advanceCm").value),
    height:num($("#height").value),
    biteDepth:num($("#biteDepth").value),
    biteStability:num($("#biteStability").value),
    help:$("#help").value.trim(),
    reward:$("#reward").value.trim(),
    drive:num($("#drive").value),
    precision:num($("#precision").value),
    stability:num($("#stability").value),
    notes:$("#notes").value.trim(),
    decision:$("#decision").value
  };
  if(session.reps!=null && session.hits!=null && session.hits>session.reps){alert("Los aciertos no pueden superar las repeticiones.");return}
  if(session.reps!=null && session.errors!=null && session.errors>session.reps){alert("Los errores no pueden superar las repeticiones.");return}
  const sessions=getSessions(); sessions.push(session); saveSessions(sessions);
  ev.target.reset(); $("#date").value=today(); select.value="1"; updateExerciseFields();
  closeModal(); renderDashboard(); renderHistory(); renderProgress(); switchTab("home");
});

$("#exportBtn").addEventListener("click",()=>{
  const payload={dog:{name:"Goma",breed:"Pastor Belga Malinois",birth:"2025-08-13",weightKg:30,goal:"Mondioring III"},exportedAt:new Date().toISOString(),sessions:getSessions()};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="goma-mondioring-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),600);
});
$("#importInput").addEventListener("change",async ev=>{
  const f=ev.target.files?.[0]; if(!f)return;
  try{
    const data=JSON.parse(await f.text());
    if(!Array.isArray(data.sessions)) throw new Error();
    if(confirm(`Importar ${data.sessions.length} sesiones y reemplazar las actuales?`)){
      saveSessions(data.sessions);renderDashboard();renderHistory();renderProgress();alert("Bitácora importada.");
    }
  }catch{alert("El archivo no parece ser un backup válido de Goma.");}
  ev.target.value="";
});
$("#clearBtn").addEventListener("click",()=>{
  if(confirm("¿Borrar todas las sesiones guardadas en este dispositivo? Esta acción no se puede deshacer.")){
    localStorage.removeItem(STORAGE_KEY);renderDashboard();renderHistory();renderProgress();
  }
});

window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault(); deferredPrompt=e; $("#installBtn").style.display="inline-flex";
});
$("#installBtn").addEventListener("click",async()=>{
  if(!deferredPrompt){$("#installHelp").style.display="block";return;}
  deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("#installBtn").style.display="none";
});
$("#installHelpBtn").addEventListener("click",()=>$("#installHelp").style.display="block");

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
renderMap();renderDashboard();renderProgress();
