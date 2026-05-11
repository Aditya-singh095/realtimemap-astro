import"https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";function j(){const e=document.getElementById("mobile-sidebar-btn"),t=document.getElementById("mobile-alerts-btn"),a=document.getElementById("sidebar"),o=document.querySelector(".alert-feed-panel");e&&a&&e.addEventListener("click",()=>{a.classList.toggle("open"),o?.classList.remove("open")}),t&&o&&t.addEventListener("click",()=>{o.classList.toggle("open"),a?.classList.remove("open")}),document.getElementById("map")?.addEventListener("click",()=>{a?.classList.remove("open"),o?.classList.remove("open")})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",j):j();const J=[{id:"green",accent:"#2ae500",dim:"#1a8c00",bg:"#0d2200",on:"#000000"},{id:"blue",accent:"#3b9eff",dim:"#1a6fcc",bg:"#001a3a",on:"#000000"},{id:"orange",accent:"#ff7a2a",dim:"#cc5200",bg:"#2a1200",on:"#000000"},{id:"yellow",accent:"#f5d800",dim:"#c4ad00",bg:"#252000",on:"#000000"},{id:"red",accent:"#ff3a3a",dim:"#cc1a1a",bg:"#2a0000",on:"#000000"},{id:"purple",accent:"#b06aff",dim:"#7a3acc",bg:"#1a0033",on:"#000000"},{id:"cyan",accent:"#00d4d4",dim:"#008a8a",bg:"#001f1f",on:"#000000"}];let C=!1,z="green";function fe(){const e=localStorage.getItem("rtm-mode"),t=localStorage.getItem("rtm-accent");e==="light"&&(C=!0),t&&(z=t),re(),K(z),he()}function re(){const e=document.documentElement,t=document.getElementById("mode-track"),a=document.getElementById("mode-thumb"),o=document.getElementById("mode-lbl");C?(e.classList.add("light-mode"),t&&t.classList.add("bg-accent"),a&&(a.classList.add("left-[15px]","bg-accent-on"),a.classList.remove("bg-text")),o&&(o.textContent="Light Mode")):(e.classList.remove("light-mode"),t&&t.classList.remove("bg-accent"),a&&(a.classList.remove("left-[15px]","bg-accent-on"),a.classList.add("bg-text")),o&&(o.textContent="Dark Mode")),K(z),localStorage.setItem("rtm-mode",C?"light":"dark")}function K(e){z=e;const t=J.find(o=>o.id===e)||J[0],a=document.documentElement;a.style.setProperty("--accent",t.accent),a.style.setProperty("--accent-dim",t.dim),a.style.setProperty("--accent-bg",C?t.accent+"22":t.bg),a.style.setProperty("--accent-on",t.on),document.querySelectorAll(".theme-btn").forEach(o=>{o.getAttribute("data-accent")===e?(o.classList.add("border-text","scale-110"),o.classList.remove("border-transparent")):(o.classList.remove("border-text","scale-110"),o.classList.add("border-transparent"))}),localStorage.setItem("rtm-accent",e),window.dispatchEvent(new CustomEvent("rtm-theme-changed"))}function he(){const e=document.getElementById("theme-trigger"),t=document.getElementById("theme-panel"),a=document.getElementById("mode-toggle");e&&t&&e.addEventListener("click",()=>{t.classList.toggle("hidden")}),a&&a.addEventListener("click",()=>{C=!C,re()}),document.querySelectorAll(".theme-btn").forEach(o=>{o.addEventListener("click",n=>{const s=n.currentTarget.getAttribute("data-accent");s&&K(s)})})}fe();function le(){const e=document.getElementById("sys-clock");if(!e)return;const t=new Date,a=String(t.getUTCHours()).padStart(2,"0"),o=String(t.getUTCMinutes()).padStart(2,"0"),n=String(t.getUTCSeconds()).padStart(2,"0");e.textContent=`${a}:${o}:${n} UTC`}setInterval(le,1e3);le();let U=0;const b={eqCount:0,flightsCount:0,shipsCount:0,satsCount:0};function V(){const e=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),t=getComputedStyle(document.documentElement).getPropertyValue("--yellow").trim();[{id:"sp-m1",base:20,variance:5,color:e},{id:"sp-m2",base:56,variance:8,color:e},{id:"sp-m3",base:450,variance:30,color:t},{id:"sp-m4",base:152,variance:10,color:e},{id:"sp-m5",base:5,variance:0,color:e}].forEach(({id:o,base:n,variance:s,color:l})=>{const d=document.getElementById(o);if(!d)return;const r=Array.from({length:20},()=>n+Math.round((Math.random()-.5)*s*2)),p=Math.max(...r),m=Math.min(...r),i=p-m||1,c=r.map((g,y)=>`${y/19*100},${16-((g-m)/i*12+2)}`).join(" ");d.innerHTML=`<polyline points="${c}" fill="none" stroke="${l}" stroke-width="1.2" stroke-linejoin="round"/>`})}function xe(){U++;const e=document.getElementById("val-eq");e&&(e.textContent=String(b.eqCount).padStart(2,"0"));const t=document.getElementById("val-flights");t&&(t.textContent=String(b.flightsCount||56));const a=document.getElementById("val-ships");a&&(a.textContent=String(b.shipsCount||450));const o=document.getElementById("val-sats");o&&(o.textContent=String(b.satsCount||152));const n=document.getElementById("val-src");n&&(n.textContent="05");const s=document.getElementById("status-feed-count");s&&(s.textContent=`FLIGHTS: ${b.flightsCount} | SHIPS: ${b.shipsCount} | SATS: ${b.satsCount}`);const l=72+Math.round(Math.sin(U*.4)*10),d=document.getElementById("hud-upBar");d&&(d.style.width=l+"%");const r=document.getElementById("hud-upPct");r&&(r.textContent=`${l}% — 5 FEEDS LIVE`),U%5===0&&V()}V();setInterval(xe,900);window.addEventListener("rtm-theme-changed",V);function be(){const e=document.getElementById("notif-trigger"),t=document.getElementById("notif-panel"),a=document.getElementById("notif-list"),o=document.getElementById("notif-count"),n=document.getElementById("notif-badge"),s=document.getElementById("notif-clear");let l=[];function d(){l=[{type:"info",icon:"ti-activity",msg:"Earthquake feed connected — USGS data live",time:Date.now()-6e4},{type:"warn",icon:"ti-alert-triangle",msg:"OpenSky API rate limited — using simulated flights",time:Date.now()-12e4},{type:"info",icon:"ti-ship",msg:"Maritime simulation active — 450+ vessels tracked",time:Date.now()-18e4},{type:"info",icon:"ti-satellite",msg:"ISS position tracking enabled (5s refresh)",time:Date.now()-24e4},{type:"info",icon:"ti-topology-ring",msg:"26 submarine cable routes rendered",time:Date.now()-3e5}],r()}window.addEventListener("alerts-updated",m=>{(m.detail.alerts||[]).filter(g=>g.properties.mag>=5).forEach(g=>{l.some(E=>E.msg.includes(g.properties.place))||l.unshift({type:"critical",icon:"ti-alert-triangle",msg:`MAG ${g.properties.mag.toFixed(1)} — ${g.properties.place}`,time:g.properties.time})}),r()});function r(){!a||!o||(o.textContent=String(l.length),n&&(n.style.display=l.length>0?"block":"none"),a.innerHTML=l.length===0?'<div class="p-4 text-center font-mono text-[9px] text-text3">No notifications</div>':l.map(m=>{const c={info:"var(--accent)",warn:"var(--yellow)",critical:"var(--red)"}[m.type]||"var(--accent)",g=p(m.time);return`
            <div class="p-2 px-3 border-b border-border hover:bg-bg4 transition-colors cursor-pointer">
              <div class="flex items-start gap-2">
                <i class="ti ${m.icon} text-xs mt-0.5" style="color:${c}"></i>
                <div class="flex-1 min-w-0">
                  <div class="font-mono text-[9px] text-text leading-tight">${m.msg}</div>
                  <div class="font-mono text-[7px] text-text3 mt-0.5">${g}</div>
                </div>
              </div>
            </div>
          `}).join(""))}function p(m){const i=Date.now()-m,c=Math.floor(i/6e4);if(c<1)return"just now";if(c<60)return`${c}m ago`;const g=Math.floor(c/60);return g<24?`${g}h ago`:`${Math.floor(g/24)}d ago`}e&&t&&e.addEventListener("click",m=>{m.stopPropagation();const i=t.style.display!=="none";t.style.display=i?"none":"block";const c=document.getElementById("user-panel");c&&(c.style.display="none")}),s&&s.addEventListener("click",()=>{l=[],r()}),d()}function Ae(){const e=document.getElementById("user-trigger"),t=document.getElementById("user-panel");e&&t&&e.addEventListener("click",a=>{a.stopPropagation();const o=t.style.display!=="none";t.style.display=o?"none":"block";const n=document.getElementById("notif-panel");n&&(n.style.display="none")}),document.querySelectorAll(".user-menu-btn").forEach(a=>{a.addEventListener("click",()=>{const o=a.querySelector("span")?.textContent?.trim()||"";t&&(t.style.display="none"),o==="DISCONNECT"?window.__showToast?.("Session disconnected"):o==="EXPORT DATA"?window.__showToast?.("Data export started — check downloads"):window.__showToast?.(`${o} panel coming soon`)})})}document.addEventListener("click",e=>{const t=document.getElementById("notif-panel"),a=document.getElementById("user-panel"),o=document.getElementById("notif-trigger"),n=document.getElementById("user-trigger");t&&t.style.display!=="none"&&!t.contains(e.target)&&e.target!==o&&!o?.contains(e.target)&&(t.style.display="none"),a&&a.style.display!=="none"&&!a.contains(e.target)&&e.target!==n&&!n?.contains(e.target)&&(a.style.display="none")});be();Ae();let de=[];window.addEventListener("alerts-updated",e=>{de=e.detail.alerts||[]});const Se={signals:()=>({icon:"ti-radar",title:"Signal Intelligence",html:`
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">ACTIVE SIGNAL INTERCEPTS</div>
      ${Ee()}
      <div class="mt-4 p-2 border border-border2 bg-bg4">
        <div class="font-mono text-[7px] font-bold tracking-[0.1em] uppercase text-text3 mb-2">SIGNAL STRENGTH DISTRIBUTION</div>
        <div class="flex gap-1 h-8 items-end">
          ${Array.from({length:20},()=>`<div style="flex:1; height:${10+Math.random()*90}%; background:var(--accent); opacity:${.3+Math.random()*.7};"></div>`).join("")}
        </div>
      </div>
    `}),critical:()=>({icon:"ti-alert-triangle",title:"Critical Alerts",html:`
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">HIGH PRIORITY EVENTS</div>
      ${de.filter(e=>e.properties.mag>=4.5).slice(0,10).map(e=>`
          <div class="p-2 border-b border-border border-l-2 border-l-red mb-1 hover:bg-bg4 transition-colors cursor-pointer">
            <div class="flex justify-between items-center mb-1">
              <span class="font-mono text-[8px] font-bold text-red uppercase">MAG ${e.properties.mag.toFixed(1)}</span>
              <span class="font-mono text-[7px] text-text3">${new Date(e.properties.time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
            </div>
            <div class="text-[9px] text-text2 leading-tight">${e.properties.place}</div>
          </div>
        `).join("")||`
        <div class="p-3 text-center">
          <i class="ti ti-shield-check text-accent text-[24px] block mb-2"></i>
          <div class="font-mono text-[9px] text-text2">No critical alerts at this time</div>
          <div class="font-mono text-[7px] text-text3 mt-1">Threshold: MAG 4.5+</div>
        </div>
      `}
    `}),cases:()=>({icon:"ti-folder-open",title:"Case Files",html:`
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">OPEN INVESTIGATIONS</div>
      ${[{id:"CS-2026-001",title:"Pacific Rim Seismic Cluster",status:"ACTIVE",priority:"HIGH",color:"text-red"},{id:"CS-2026-002",title:"Atlantic Cable Anomaly",status:"MONITORING",priority:"MEDIUM",color:"text-yellow"},{id:"CS-2026-003",title:"Vessel Route Deviation — Malacca",status:"ACTIVE",priority:"HIGH",color:"text-red"},{id:"CS-2026-004",title:"Satellite Orbital Decay — STARLINK",status:"RESOLVED",priority:"LOW",color:"text-accent"},{id:"CS-2026-005",title:"Mediterranean Traffic Surge",status:"MONITORING",priority:"MEDIUM",color:"text-yellow"},{id:"CS-2026-006",title:"Arctic Fiber Cable Integrity",status:"ACTIVE",priority:"HIGH",color:"text-red"}].map(e=>`
        <div class="p-2 border-b border-border hover:bg-bg4 transition-colors cursor-pointer group">
          <div class="flex justify-between items-center mb-1">
            <span class="font-mono text-[8px] font-bold text-accent">${e.id}</span>
            <span class="font-mono text-[7px] font-bold ${e.color}">${e.priority}</span>
          </div>
          <div class="text-[9px] text-text leading-tight mb-1">${e.title}</div>
          <div class="flex gap-1">
            <span class="font-mono text-[7px] font-bold px-1 py-[1px] border border-border2 text-text3">${e.status}</span>
          </div>
        </div>
      `).join("")}
    `}),telemetry:()=>({icon:"ti-chart-line",title:"Telemetry Dashboard",html:`
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">REAL-TIME SYSTEM METRICS</div>
      ${[{label:"API Response Time",value:`${(50+Math.random()*150).toFixed(0)}ms`,bar:30+Math.random()*40},{label:"Data Throughput",value:`${(1.2+Math.random()*3).toFixed(1)} MB/s`,bar:40+Math.random()*50},{label:"Active Connections",value:`${Math.floor(3+Math.random()*5)}`,bar:60+Math.random()*30},{label:"Cache Hit Rate",value:`${(85+Math.random()*14).toFixed(1)}%`,bar:85+Math.random()*14},{label:"Map Tile Requests",value:`${Math.floor(100+Math.random()*400)}/min`,bar:20+Math.random()*60},{label:"WebSocket Latency",value:`${(5+Math.random()*25).toFixed(0)}ms`,bar:10+Math.random()*30}].map(e=>`
        <div class="mb-3">
          <div class="flex justify-between mb-1">
            <span class="font-mono text-[8px] font-bold text-text2 uppercase tracking-wider">${e.label}</span>
            <span class="font-mono text-[8px] font-bold text-accent">${e.value}</span>
          </div>
          <div class="h-1 bg-bg5 border border-border">
            <div style="width:${e.bar}%; height:100%; background:var(--accent); transition:width 0.6s;"></div>
          </div>
        </div>
      `).join("")}
      <div class="mt-4 p-2 border border-border2 bg-bg4">
        <div class="font-mono text-[7px] font-bold tracking-[0.1em] uppercase text-text3 mb-2">FEED STATUS</div>
        ${[{name:"USGS Seismic",status:"CONNECTED",color:"#2ae500"},{name:"OpenSky Network",status:"SIMULATED",color:"#f5c400"},{name:"AIS Maritime",status:"SIMULATED",color:"#f5c400"},{name:"ISS Tracker",status:"CONNECTED",color:"#2ae500"},{name:"Submarine Cables",status:"CACHED",color:"#3b9eff"}].map(e=>`
          <div class="flex items-center gap-2 py-1">
            <div style="width:5px; height:5px; background:${e.color}; border-radius:50%;"></div>
            <span class="font-mono text-[8px] text-text2 flex-1">${e.name}</span>
            <span class="font-mono text-[7px] font-bold" style="color:${e.color}">${e.status}</span>
          </div>
        `).join("")}
      </div>
    `}),logs:()=>({icon:"ti-terminal",title:"System Logs",html:`
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">EVENT LOG</div>
      <div class="bg-bg font-mono text-[9px] p-2 border border-border2 max-h-[60vh] overflow-y-auto">
        ${Ie()}
      </div>
    `}),support:()=>({icon:"ti-help",title:"Help & Support",html:`
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">INFORMATION</div>
      <div class="space-y-3">
        <div class="p-2 border border-border2 bg-bg4">
          <div class="font-mono text-[9px] font-bold text-accent mb-1">Keyboard Shortcuts</div>
          <div class="font-mono text-[8px] text-text2 space-y-1">
            <div><span class="text-text3">Search:</span> Click search bar + Enter</div>
            <div><span class="text-text3">Zoom:</span> Mouse wheel / +- buttons</div>
            <div><span class="text-text3">Pan:</span> Click & drag map</div>
          </div>
        </div>
        <div class="p-2 border border-border2 bg-bg4">
          <div class="font-mono text-[9px] font-bold text-accent mb-1">Data Sources</div>
          <div class="font-mono text-[8px] text-text2 space-y-1">
            <div>• USGS Earthquake Hazards (live)</div>
            <div>• OpenSky Network (simulated fallback)</div>
            <div>• AIS Maritime Data (simulated)</div>
            <div>• Where The ISS At (live)</div>
            <div>• Submarine Cable Map (cached)</div>
          </div>
        </div>
        <div class="p-2 border border-border2 bg-bg4">
          <div class="font-mono text-[9px] font-bold text-accent mb-1">Version</div>
          <div class="font-mono text-[8px] text-text2">REALTIMEMAP v5.0.0-ASTRO</div>
          <div class="font-mono text-[7px] text-text3 mt-1">Built with Astro + Leaflet.js</div>
        </div>
      </div>
    `})};function Ee(){const e=["RF BURST","ADS-B","AIS","GNSS","SATCOM","VHF","UHF","HF SKIP"],t=["VHF","UHF","L-BAND","S-BAND","X-BAND","KU-BAND","KA-BAND","HF"],a=["AIRBORNE","MARITIME","GROUND","ORBITAL","UNKNOWN"];return Array.from({length:8},()=>{const o=e[Math.floor(Math.random()*e.length)],n=t[Math.floor(Math.random()*t.length)],s=a[Math.floor(Math.random()*a.length)],l=-20-Math.floor(Math.random()*80),d=(100+Math.random()*12e3).toFixed(1);return`
      <div class="p-2 border-b border-border hover:bg-bg4 transition-colors cursor-pointer">
        <div class="flex justify-between items-center mb-1">
          <span class="font-mono text-[8px] font-bold text-accent">${o}</span>
          <span class="font-mono text-[7px] text-text3">${l} dBm</span>
        </div>
        <div class="flex gap-1 flex-wrap">
          <span class="font-mono text-[7px] px-1 py-[1px] border border-border2 text-text3">${n}</span>
          <span class="font-mono text-[7px] px-1 py-[1px] border border-border2 text-text3">${d} MHz</span>
          <span class="font-mono text-[7px] px-1 py-[1px] border border-border2 text-text3">${s}</span>
        </div>
      </div>
    `}).join("")}function Ie(){const e=[{t:"INFO",c:"#2ae500",msg:"Map tile layer initialized — dark mode"},{t:"INFO",c:"#2ae500",msg:"USGS earthquake feed connected"},{t:"WARN",c:"#f5c400",msg:"OpenSky API rate limited — using simulated data"},{t:"INFO",c:"#2ae500",msg:"AIS maritime simulation started — 450 vessels"},{t:"INFO",c:"#2ae500",msg:"ISS tracker connected — updating every 5s"},{t:"INFO",c:"#2ae500",msg:"Submarine cable routes loaded (26 cables)"},{t:"WARN",c:"#f5c400",msg:"Satellite TLE data — using cached positions"},{t:"INFO",c:"#2ae500",msg:"Pipeline overlay rendered — 6 routes"},{t:"OK",c:"#2ae500",msg:"All data feeds nominal — 5 sources active"},{t:"INFO",c:"#2ae500",msg:"Sparkline charts initialized"},{t:"INFO",c:"#2ae500",msg:"Theme engine loaded — accent: green, mode: dark"},{t:"WARN",c:"#f5c400",msg:"Geolocation permission not granted"},{t:"INFO",c:"#2ae500",msg:"Search geocoder ready — Nominatim API"},{t:"INFO",c:"#2ae500",msg:"Layer panel controls bound"}],t=new Date;return e.map((a,o)=>`<div class="py-0.5 border-b border-border/30"><span class="text-text3">[${new Date(t.getTime()-o*3e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}]</span> <span style="color:${a.c}">[${a.t}]</span> <span class="text-text2">${a.msg}</span></div>`).join("")}function Z(){const e=document.getElementById("side-panel-overlay");document.getElementById("side-panel");const t=document.getElementById("sp-icon"),a=document.getElementById("sp-title"),o=document.getElementById("sp-content"),n=document.getElementById("sp-close"),s=document.getElementById("report-modal"),l=document.getElementById("report-close"),d=document.getElementById("report-submit"),r=document.getElementById("btn-new-report");function p(i){const c=Se[i];if(!c||!e||!t||!a||!o)return;const g=c();t.className=`ti ${g.icon} text-accent text-[14px]`,a.textContent=g.title,o.innerHTML=g.html,e.style.display="flex",document.querySelectorAll(".sidebar-nav-btn").forEach(y=>{const E=y.getAttribute("data-panel");E===i?(y.classList.add("bg-accent/20","border-accent","text-accent","active-nav"),y.classList.remove("border-transparent","text-text2")):E!=="dashboard"&&(y.classList.remove("bg-accent/20","border-accent","text-accent","active-nav"),y.classList.add("border-transparent","text-text2"))})}function m(){e&&(e.style.display="none"),document.querySelectorAll(".sidebar-nav-btn").forEach(i=>{i.getAttribute("data-panel")==="dashboard"||i.id==="nav-dashboard"?(i.classList.add("bg-accent/20","border-accent","text-accent","active-nav"),i.classList.remove("border-transparent","text-text2")):(i.classList.remove("bg-accent/20","border-accent","text-accent","active-nav"),i.classList.add("border-transparent","text-text2"))})}document.querySelectorAll(".sidebar-nav-btn").forEach(i=>{i.addEventListener("click",()=>{const c=i.getAttribute("data-panel");if(!c||c==="dashboard"){m();return}p(c)})}),n&&n.addEventListener("click",m),e&&e.addEventListener("click",i=>{i.target===e&&m()}),r&&s&&r.addEventListener("click",()=>{s.style.display="flex"}),l&&s&&l.addEventListener("click",()=>{s.style.display="none"}),s&&s.addEventListener("click",i=>{i.target===s&&(s.style.display="none")}),d&&s&&d.addEventListener("click",()=>{s.style.display="none",ce("Report submitted successfully")}),document.querySelectorAll(".report-priority").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".report-priority").forEach(g=>{g.classList.remove("border-accent","text-accent","border-yellow","text-yellow","border-red","text-red"),g.classList.add("border-border2","text-text2")});const c=i.textContent?.trim().toLowerCase();c==="low"?(i.classList.add("border-accent","text-accent"),i.classList.remove("border-border2","text-text2")):c==="medium"?(i.classList.add("border-yellow","text-yellow"),i.classList.remove("border-border2","text-text2")):c==="high"&&(i.classList.add("border-red","text-red"),i.classList.remove("border-border2","text-text2"))})})}function ce(e){const t=document.createElement("div");t.className="toast-notification",t.innerHTML=`
    <div class="flex items-center gap-2">
      <i class="ti ti-check text-accent"></i>
      <span class="font-mono text-[9px] font-bold text-text">${e}</span>
    </div>
  `,document.body.appendChild(t),requestAnimationFrame(()=>t.classList.add("show")),setTimeout(()=>{t.classList.remove("show"),setTimeout(()=>t.remove(),300)},3e3)}window.__showToast=ce;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Z):Z();let k=null;const W=[{lat:51.5,lng:-.1,cs:"BAW001",hdg:270,alt:10668,spd:900},{lat:48.8,lng:2.3,cs:"AFR002",hdg:280,alt:11e3,spd:870},{lat:40.7,lng:-74,cs:"DAL100",hdg:80,alt:10972,spd:850},{lat:53.3,lng:-6.2,cs:"EIN303",hdg:260,alt:9144,spd:820},{lat:45.5,lng:-30,cs:"UAL9",hdg:270,alt:11278,spd:890},{lat:52,lng:-15,cs:"BAW117",hdg:285,alt:10668,spd:905},{lat:43,lng:-45,cs:"DAL405",hdg:90,alt:11e3,spd:860},{lat:55,lng:-20,cs:"ICE123",hdg:260,alt:10500,spd:840},{lat:48,lng:-55,cs:"ACA888",hdg:85,alt:11200,spd:880},{lat:38,lng:-60,cs:"AAL777",hdg:100,alt:1e4,spd:820},{lat:50.1,lng:8.7,cs:"DLH400",hdg:190,alt:9754,spd:800},{lat:41.9,lng:12.5,cs:"AZA210",hdg:135,alt:8534,spd:780},{lat:52.3,lng:4.8,cs:"KLM600",hdg:200,alt:9144,spd:810},{lat:37.9,lng:23.7,cs:"OAL551",hdg:90,alt:7620,spd:750},{lat:48.3,lng:16.6,cs:"AUA100",hdg:45,alt:8230,spd:790},{lat:59.9,lng:30.3,cs:"AFL201",hdg:270,alt:9754,spd:820},{lat:46.2,lng:6.1,cs:"SWR123",hdg:180,alt:10500,spd:830},{lat:55.6,lng:12.5,cs:"SAS456",hdg:90,alt:9e3,spd:780},{lat:40.4,lng:-3.7,cs:"IBE789",hdg:270,alt:11e3,spd:850},{lat:45.4,lng:9.1,cs:"RYR111",hdg:0,alt:9500,spd:800},{lat:35.7,lng:139.7,cs:"JAL7",hdg:45,alt:11278,spd:880},{lat:22.3,lng:114.2,cs:"CPA100",hdg:310,alt:10668,spd:900},{lat:1.4,lng:103.9,cs:"SIA21",hdg:270,alt:11582,spd:910},{lat:37.4,lng:126.8,cs:"KAL902",hdg:180,alt:10058,spd:860},{lat:13.7,lng:100.5,cs:"THA910",hdg:90,alt:10362,spd:845},{lat:28.6,lng:77.1,cs:"AIC101",hdg:280,alt:10972,spd:855},{lat:-33.9,lng:151.2,cs:"QFA1",hdg:320,alt:11e3,spd:875},{lat:-37.8,lng:144.9,cs:"VOZ222",hdg:0,alt:10500,spd:840},{lat:-1.3,lng:103.8,cs:"GIA333",hdg:90,alt:11200,spd:880},{lat:14.5,lng:121,cs:"PAL444",hdg:180,alt:1e4,spd:820},{lat:25,lng:121.5,cs:"EVA555",hdg:270,alt:11e3,spd:860},{lat:33.9,lng:-118.4,cs:"UAL200",hdg:90,alt:10668,spd:840},{lat:41.9,lng:-87.9,cs:"AAL300",hdg:240,alt:9754,spd:820},{lat:25.8,lng:-80.3,cs:"DAL500",hdg:10,alt:10058,spd:800},{lat:47.4,lng:-122.3,cs:"ASA600",hdg:180,alt:9448,spd:810},{lat:45,lng:-93.2,cs:"SWA700",hdg:270,alt:8534,spd:790},{lat:30.2,lng:-97.7,cs:"SWA201",hdg:350,alt:9144,spd:795},{lat:39.8,lng:-104.8,cs:"F9_888",hdg:90,alt:10500,spd:830},{lat:36.1,lng:-115.1,cs:"NK_999",hdg:180,alt:9e3,spd:780},{lat:32.8,lng:-96.8,cs:"SWA111",hdg:270,alt:11e3,spd:850},{lat:43.6,lng:-79.6,cs:"ACA222",hdg:0,alt:9500,spd:800},{lat:25.3,lng:55.4,cs:"UAE7",hdg:315,alt:12192,spd:935},{lat:24.9,lng:67.2,cs:"PIA702",hdg:45,alt:10972,spd:860},{lat:29.7,lng:48,cs:"QTR9",hdg:280,alt:11582,spd:920},{lat:21.5,lng:39.1,cs:"SVA123",hdg:90,alt:10500,spd:830},{lat:35.6,lng:51.3,cs:"IRA456",hdg:180,alt:9e3,spd:780},{lat:-26.1,lng:28.2,cs:"SAA201",hdg:20,alt:10362,spd:840},{lat:30.1,lng:31.4,cs:"MSR701",hdg:270,alt:9754,spd:810},{lat:6.5,lng:3.3,cs:"NIG123",hdg:90,alt:10500,spd:830},{lat:9,lng:38.7,cs:"ETH456",hdg:180,alt:9e3,spd:780},{lat:60,lng:25,cs:"FIN8",hdg:180,alt:10668,spd:855},{lat:55.6,lng:12.7,cs:"SAS911",hdg:90,alt:9144,spd:800},{lat:-23.4,lng:-46.5,cs:"TAM3105",hdg:260,alt:10058,spd:835},{lat:-34.6,lng:-58.4,cs:"ARG250",hdg:310,alt:9754,spd:820},{lat:19.4,lng:-99.1,cs:"AMX800",hdg:90,alt:9448,spd:810},{lat:64.1,lng:-21.9,cs:"ICE506",hdg:270,alt:8534,spd:780},{lat:-12,lng:-77,cs:"LAN123",hdg:90,alt:10500,spd:830},{lat:4.6,lng:-74,cs:"AVA456",hdg:180,alt:9e3,spd:780}];function Te(){const e=["AAL","UAL","DAL","SWA","BAW","AFR","DLH","KLM","QTR","UAE","SIA","CPA","JAL","ANA","KAL","EVA","THA","AIC","QFA","ANZ","LAN","TAM","AVA","AFR","IBE","RYR","EZY","WZZ","FIN","SAS","LOT","CSA","AUA","TAP","THY","ETH","SAA","RAM","EGY","MEA","GIA","MAS","PAL","VTJ","JBU","SWR","BEL","AER","CSN","CES","CCA","HDA","SJA"],t=[];return[[50,-25,12,30,80,18],[48,-35,10,25,265,15],[40,-160,15,30,90,14],[38,170,12,25,270,12],[48,10,15,20,0,20],[38,-95,12,25,0,25],[30,110,20,30,0,20],[25,55,8,15,0,12],[-15,-55,20,15,0,10],[5,20,25,20,0,10],[18,85,15,20,90,10],[-30,145,10,15,0,8],[-5,130,15,25,340,6],[45,60,10,40,90,12],[65,-30,10,40,310,8],[20,-75,8,10,0,8]].forEach(([o,n,s,l,d,r])=>{for(let p=0;p<r;p++){const m=o+(Math.random()-.5)*s*2,i=n+(Math.random()-.5)*l*2,c=(d+(Math.random()-.5)*60+360)%360,g=8e3+Math.floor(Math.random()*4e3),y=750+Math.floor(Math.random()*200),E=e[Math.floor(Math.random()*e.length)]+Math.floor(100+Math.random()*900);t.push({lat:parseFloat(m.toFixed(1)),lng:parseFloat(i.toFixed(1)),cs:E,hdg:Math.round(c),alt:g,spd:y})}}),t}const pe=[...W,...Te()];function Q(e){k.clearLayers(),pe.forEach(t=>{const a=e.divIcon({className:"custom-div-icon",html:`<div style="color:var(--text);opacity:0.9;font-size:12px;transform:rotate(${t.hdg-45}deg);line-height:1;"><i class="ti ti-plane"></i></div>`,iconSize:[16,16],iconAnchor:[8,8]});e.marker([t.lat,t.lng],{icon:a}).bindPopup(`
        <div style="min-width:220px; font-family:monospace;">
          <!-- Header -->
          <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
              <i class="ti ti-plane" style="color:var(--accent); font-size:14px;"></i>
              <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${t.cs}</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">COMMERCIAL AIRCRAFT</span>
            </div>
          </div>
          
          <!-- Status badge -->
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
            <div style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite;"></div>
            <span style="color:var(--accent); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">AIRBORNE</span>
          </div>

          <!-- Navigation data -->
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">TELEMETRY</div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 8px; margin-bottom:8px;">
            <div>
              <div style="color:var(--text3); font-size:7px;">ALTITUDE</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${t.alt.toLocaleString()} <span style="font-size:7px;">m</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">SPEED</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${t.spd} <span style="font-size:7px;">km/h</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">HEADING</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${t.hdg}°</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LAT</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${t.lat.toFixed(4)}</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LNG</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${t.lng.toFixed(4)}</div>
            </div>
          </div>
        </div>
      `,{maxWidth:260,className:"rtm-popup"}).addTo(k)}),b.flightsCount=W.length,Le(e).catch(()=>{})}async function Le(e){const t=await fetch("https://opensky-network.org/api/states/all");if(!t.ok)return;const a=await t.json(),o=(a.states||[]).slice(0,400);k.clearLayers(),b.flightsCount=a.states?.length??W.length,o.forEach(n=>{const s=n[5],l=n[6];if(!l||!s)return;const d=n[1]?.trim()||"UNKNOWN",r=n[9]?Math.round(n[9]*3.6):0,p=n[7]?Math.round(n[7]):0,m=n[10]||0,i=e.divIcon({className:"custom-div-icon",html:`<div style="color:var(--text);opacity:0.9;font-size:12px;transform:rotate(${m-45}deg);line-height:1;"><i class="ti ti-plane"></i></div>`,iconSize:[16,16],iconAnchor:[8,8]});e.marker([l,s],{icon:i}).bindPopup(`
        <div style="min-width:220px; font-family:monospace;">
          <!-- Header -->
          <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
              <i class="ti ti-plane" style="color:var(--accent); font-size:14px;"></i>
              <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${d}</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">COMMERCIAL AIRCRAFT</span>
            </div>
          </div>
          
          <!-- Status badge -->
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
            <div style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite;"></div>
            <span style="color:var(--accent); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">AIRBORNE</span>
          </div>

          <!-- Navigation data -->
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">TELEMETRY</div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 8px; margin-bottom:8px;">
            <div>
              <div style="color:var(--text3); font-size:7px;">ALTITUDE</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${p.toLocaleString()} <span style="font-size:7px;">m</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">SPEED</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${r} <span style="font-size:7px;">km/h</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">HEADING</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${m}°</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LAT</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${l.toFixed(4)}</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LNG</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${s.toFixed(4)}</div>
            </div>
          </div>
        </div>
      `,{maxWidth:260,className:"rtm-popup"}).addTo(k)})}async function Ce(e,t){return k=t.layerGroup(),Q(t),b.flightsCount=pe.length,setInterval(()=>Q(t),9e4),k}let L=null;const ke=[{name:"TAT-14 (Trans-Atlantic)",coords:[[40.7,-74],[45,-40],[50,-20],[51.5,-.1]]},{name:"FLAG Atlantic-1",coords:[[40.7,-74],[44,-35],[51,-8],[51.5,-.1]]},{name:"Apollo Cable System",coords:[[40.7,-74],[46,-30],[53.3,-6.2]]},{name:"Yellow/AC-2",coords:[[40.7,-74],[47,-25],[53.5,-3],[51.5,-.1]]},{name:"SAex (South Atlantic Express)",coords:[[-33.9,-70.8],[-30,-40],[-15,-15],[0,10],[6.4,3.4]]},{name:"WACS (West Africa Cable)",coords:[[51.5,-.1],[20,-20],[0,-10],[-26.1,28.2]]},{name:"Trans-Pacific Express",coords:[[37.8,-122.4],[35,160],[35.7,139.7]]},{name:"PC-1 (Pacific Crossing)",coords:[[47.6,-122.3],[50,170],[35.7,139.7]]},{name:"Southern Cross Cable",coords:[[-33.9,151.2],[-28,165],[-17.7,-168],[21,-157.8],[47.6,-122.3]]},{name:"SEA-ME-WE 3",coords:[[51.5,-.1],[38,20],[35,30],[28,34],[20,60],[5,80],[1.4,103.9],[22.3,114.2]]},{name:"SEA-ME-WE 4",coords:[[43.3,5.4],[36,25],[27,34],[22,57],[10,74],[1.4,103.9],[13.7,100.5],[22.3,114.2]]},{name:"SEA-ME-WE 5",coords:[[43.3,5.4],[37,23],[25,55],[14,74],[1.4,103.9],[13.7,100.5],[22.3,114.2]]},{name:"EASSy (East African Sub)",coords:[[30.1,31.4],[5,42],[-33.9,18.6]]},{name:"SEACOM",coords:[[-33.9,18.6],[-26.1,33],[-4,40],[12.4,43.1],[21.5,39.2]]},{name:"IMEWE",coords:[[22,60],[21.5,39.2],[30.1,31.4],[38,23],[43.3,5.4],[48.8,2.3]]},{name:"Hibernia Atlantic",coords:[[51.5,-.1],[55,-5],[53.3,-6.2],[47.6,-52],[40.7,-74]]},{name:"UK-Netherlands",coords:[[51.5,-.1],[52.3,4.8]]},{name:"MORONA",coords:[[43.3,5.4],[37,-9],[53.3,-6.2]]},{name:"SAFE (South Africa-Far East)",coords:[[28.6,77.1],[15,75],[5,60],[-33.9,18.6]]},{name:"IO Cable",coords:[[-20.2,57.5],[5,60],[28.6,77.1]]},{name:"APG (Asia-Pacific Gateway)",coords:[[22.3,114.2],[25,121.5],[37.4,126.8],[35.7,139.7]]},{name:"SJC (SJC2)",coords:[[1.4,103.9],[16,120],[22.3,114.2],[25,121.5],[35.7,139.7],[35,135],[34.6,135]]},{name:"JADE",coords:[[22.3,114.2],[30,128],[35.7,139.7]]},{name:"Bay of Bengal",coords:[[22.3,88.4],[13.1,80.2],[8.6,80.9],[6.9,79.9]]},{name:"Tata TGN-Pacific",coords:[[22.3,114.2],[34,140],[37.8,-122.4]]},{name:"Arctic Fibre",coords:[[51.5,-.1],[60,-5],[70,10],[75,30],[75,60],[60,25]]}];function X(){return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"#2ae500"}async function we(e,t){L=t.layerGroup();const a=()=>{L.clearLayers();const o=X();ke.forEach(n=>{t.polyline(n.coords,{color:o,weight:1.5,opacity:.55,dashArray:"3, 8",lineCap:"round"}).bindPopup(`
        <div style="color:var(--accent);font-weight:700;border-bottom:1px solid var(--border2);padding-bottom:4px;margin-bottom:4px;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;">🔗 SUBMARINE CABLE</div>
        <div style="color:var(--text);font-size:9px;"><b>${n.name}</b></div>
        <div style="color:var(--text2);font-size:9px;">TYPE: Fiber Optic</div>
        <div style="color:var(--text2);font-size:9px;">STATUS: ACTIVE</div>
      `).addTo(L)})};a(),window.addEventListener("rtm-theme-changed",a);try{const o=await fetch("https://www.submarinecablemap.com/api/v3/cable/cable-geo.json",{signal:AbortSignal.timeout(5e3)});if(o.ok){const n=await o.json();L.clearLayers();const s=X();t.geoJSON(n,{style:()=>({color:s,weight:1.5,opacity:.5,dashArray:"3, 8"}),onEachFeature:(l,d)=>{l.properties?.name&&d.bindPopup(`
              <div style="color:var(--accent);font-weight:700;border-bottom:1px solid var(--border2);padding-bottom:4px;margin-bottom:4px;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;">🔗 SUBMARINE CABLE</div>
              <div style="color:var(--text);font-size:9px;"><b>${l.properties.name}</b></div>
              <div style="color:var(--text2);font-size:9px;">STATUS: ACTIVE</div>
            `)}}).addTo(L)}}catch{}return L}let $=null,F=null;const ee=[{type:"Container Ship",icon:"ti-container",color:"#f5c400"},{type:"Oil Tanker",icon:"ti-droplet",color:"#ff7a2a"},{type:"Bulk Carrier",icon:"ti-cube",color:"#a09e9d"},{type:"LNG Tanker",icon:"ti-flame",color:"#3b9eff"},{type:"Cargo",icon:"ti-package",color:"#e5e2e1"},{type:"Cruise Ship",icon:"ti-sailboat",color:"#b06aff"},{type:"Naval Vessel",icon:"ti-anchor",color:"#2ae500"},{type:"Ro-Ro",icon:"ti-truck",color:"#ff3a3a"}],me=["🇺🇸","🇬🇧","🇩🇪","🇯🇵","🇨🇳","🇬🇷","🇳🇴","🇸🇬","🇵🇦","🇧🇸","🇲🇭","🇰🇷","🇮🇳","🇳🇱","🇭🇰","🇩🇰","🇧🇭","🇹🇼"],Ne=["USA","GBR","DEU","JPN","CHN","GRC","NOR","SGP","PAN","BHS","MHL","KOR","IND","NLD","HKG","DNK","BHR","TWN"],te=["MSC OSCAR","EVER GIVEN","MAERSK MCKINNEY","CMA CGM MARCO POLO","COSCO SHIPPING","EMMA MAERSK","MSC GULSUN","OOCL HONG KONG","MEDITERRANEAN SHIPPING","HMM ALGECIRAS","ATLANTIC VOYAGER","PACIFIC GLORY","NORDIC CROWN","OCEAN PIONEER","SEA EMPRESS","GOLDEN GATE","LIBERTY BELL","NORTHERN LIGHT","SOUTHERN CROSS","EASTERN PROMISE","CRISTOBAL COLON","VASCO DA GAMA","MARCO POLO II","HENRY HUDSON","JOHN CABOT","STENA IMPERO","GRACE TANKER","DIANA BULKER","STELLAR BANDIT","NEPTUNE GLORY","AMAZON STAR","NILE PRINCESS","GANGES SPIRIT","YANGTZE RIVER","THAMES TRADER","CORAL PRINCESS","DIAMOND VENTURE","RUBY FORTUNE","SAPPHIRE SEAS","EMERALD ISLE","TITAN CARRIER","ATLAS CARGO","ZEUS TANKER","POSEIDON BULK","APOLLO EXPRESS","LEVIATHAN","BEHEMOTH","GOLIATH","COLOSSUS","BEHEMOTH II"],oe=["Shanghai, CN","Singapore, SG","Rotterdam, NL","Ningbo, CN","Guangzhou, CN","Busan, KR","Hong Kong, HK","Qingdao, CN","Tianjin, CN","Port Klang, MY","Antwerp, BE","Kaohsiung, TW","Dubai, AE","Los Angeles, US","Hamburg, DE","Tanjung Pelepas, MY","Xiamen, CN","Laem Chabang, TH","New York, US","Colombo, LK","Port Said, EG","Piraeus, GR","Valencia, ES","Algeciras, ES","Tokyo, JP","Yokohama, JP","Osaka, JP","Kobe, JP","Mumbai, IN","Chennai, IN"],Me=["Underway using engine","Underway using engine","Underway using engine","Underway using engine","At anchor","Moored","Restricted manoeuvrability","Constrained by draught"];function D(e){return e[Math.floor(Math.random()*e.length)]}function x(e,t){return Math.floor(Math.random()*(t-e+1))+e}function u(e,t){return+(Math.random()*(t-e)+e).toFixed(1)}function Re(){return String(x(1e8,799999999))}function $e(){return"IMO"+x(1e6,9999999)}function Oe(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZ";return Array.from({length:4},()=>e[x(0,25)]).join("")+x(1,9)}function Be(){return new Date(Date.now()+x(1,20)*864e5).toISOString().slice(0,10)+" "+String(x(0,23)).padStart(2,"0")+":00 UTC"}function ze(e,t,a){const o=u(6,21),n=x(0,359),s=n+x(-5,5),l=u(5.5,18.5),d=x(120,400),r=x(20,60),p=D(Me),m=D(oe),i=D(oe),c=Be(),g=Re(),y=$e(),E=Oe(),T=x(2e4,22e4),R=me[a],I=Ne[a],P=x(1e4,23e4),_=p.startsWith("Underway"),q=_?"#2ae500":"#f5c400";return`
    <div style="min-width:220px; font-family:monospace;">
      <!-- Header -->
      <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <i class="ti ${t.icon}" style="color:${t.color}; font-size:14px;"></i>
          <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${e}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="font-size:13px;">${R}</span>
          <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${I} • ${t.type}</span>
        </div>
      </div>

      <!-- Status badge -->
      <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
        <div style="width:6px; height:6px; border-radius:50%; background:${q}; animation:${_?"pulse 2s infinite":"none"};"></div>
        <span style="color:${q}; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">${p}</span>
      </div>

      <!-- Two-column grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">MMSI</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${g}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">IMO</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${y}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">CALLSIGN</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${E}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">FLAG</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${R} ${I}</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid var(--border); margin-bottom:8px;"></div>

      <!-- Navigation data -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">NAVIGATION</div>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 8px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px;">SOG</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${o} <span style="font-size:7px;">kn</span></div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">COG</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${n}° <span style="font-size:7px;"></span></div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">HDG</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${s}°</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">DRAUGHT</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${l} m</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">LENGTH</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${d} m</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">BEAM</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${r} m</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid var(--border); margin-bottom:8px;"></div>

      <!-- Vessel specs -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">VESSEL SPECS</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px;">GROSS TONNAGE</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${P.toLocaleString()} GT</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">DWT</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${T.toLocaleString()} t</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid var(--border); margin-bottom:8px;"></div>

      <!-- Voyage -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">VOYAGE</div>
      <div style="margin-bottom:4px;">
        <div style="color:var(--text3); font-size:7px;">FROM</div>
        <div style="color:var(--text); font-size:9px; font-weight:700;">📍 ${m}</div>
      </div>
      <div style="margin-bottom:4px;">
        <div style="color:var(--text3); font-size:7px;">DESTINATION</div>
        <div style="color:var(--text2); font-size:9px; font-weight:700;">🚢 ${i}</div>
      </div>
      <div>
        <div style="color:var(--text3); font-size:7px;">ETA</div>
        <div style="color:var(--yellow); font-size:9px; font-weight:700;">⏱ ${c}</div>
      </div>
    </div>
  `}function Pe(e,t){$=t.layerGroup(),F=t.layerGroup();const a=[...Array.from({length:25},()=>[u(49,55),u(-5,8)]),...Array.from({length:30},()=>[u(30,44),u(-6,35)]),...Array.from({length:20},()=>[u(11,28),u(32,50)]),...Array.from({length:15},()=>[u(23,28),u(50,58)]),...Array.from({length:25},()=>[u(0,6),u(100,108)]),...Array.from({length:30},()=>[u(5,22),u(108,122)]),...Array.from({length:25},()=>[u(24,38),u(120,140)]),...Array.from({length:30},()=>[u(20,45),u(155,200)]),...Array.from({length:20},()=>[u(30,50),u(-125,-115)]),...Array.from({length:30},()=>[u(25,45),u(-80,-65)]),...Array.from({length:35},()=>[u(40,55),u(-50,-10)]),...Array.from({length:20},()=>[u(-10,15),u(-20,15)]),...Array.from({length:15},()=>[u(-35,-20),u(10,35)]),...Array.from({length:25},()=>[u(-25,15),u(50,90)]),...Array.from({length:20},()=>[u(-35,5),u(-50,-30)]),...Array.from({length:25},()=>[u(8,25),u(-90,-60)]),...Array.from({length:20},()=>[u(-40,-15),u(110,155)])],o=()=>{$.clearLayers(),a.forEach(([l,d])=>{const r=x(0,ee.length-1),p=ee[r],m=x(0,me.length-1),i=te[x(0,te.length-1)],c=x(0,359),g=t.divIcon({className:"custom-div-icon",html:`
          <div style="
            display:flex; flex-direction:column; align-items:center; gap:1px;
            transform: rotate(${c}deg);
          ">
            <div style="
              width:0; height:0;
              border-left:4px solid transparent;
              border-right:4px solid transparent;
              border-bottom:10px solid ${p.color};
              opacity:0.9;
            "></div>
            <div style="
              width:8px; height:5px;
              background:${p.color};
              opacity:0.75;
            "></div>
          </div>
        `,iconSize:[16,18],iconAnchor:[8,9]});t.marker([l,d],{icon:g}).bindPopup(ze(i,p,m),{maxWidth:260,className:"rtm-popup"}).addTo($)})};o(),b.shipsCount=a.length,setInterval(()=>{o(),b.shipsCount=a.length},18e4);const n=[{name:"Nord Stream",coords:[[55,3],[57,10],[58,18],[55,26],[60,28]]},{name:"Trans-Saharan Gas",coords:[[5,7],[13,8],[20,8],[30,7],[37,10],[43.3,5.4]]},{name:"TAPI Pipeline",coords:[[37,62],[35,65],[30,67],[25,70],[23,71]]},{name:"Trans-Anatolian",coords:[[38,49],[39,44],[40,38],[41,32],[41,28]]},{name:"Keystone XL",coords:[[50,-105],[46,-100],[42,-97],[36,-95]]},{name:"West-East China Gas",coords:[[38,73],[36,85],[34,100],[30,108],[25,112]]}],s=()=>getComputedStyle(document.documentElement).getPropertyValue("--red").trim()||"#ff4444";return n.forEach(l=>{t.polyline(l.coords,{color:s(),weight:2,opacity:.55,dashArray:"6, 10"}).bindPopup(`
      <div style="min-width:160px; font-family:monospace;">
        <div style="color:var(--red); font-weight:700; border-bottom:1px solid var(--border2); padding-bottom:4px; margin-bottom:6px; font-size:9px; letter-spacing:0.1em; text-transform:uppercase;">⚡ ENERGY PIPELINE</div>
        <div style="color:var(--text); font-size:9px; font-weight:700; margin-bottom:4px;">${l.name}</div>
        <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:2px;">STATUS</div>
        <div style="color:#2ae500; font-size:9px; font-weight:700;">PRESSURIZED — ACTIVE</div>
        <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.08em; margin-top:4px; margin-bottom:2px;">MEDIUM</div>
        <div style="color:var(--text); font-size:9px;">Natural Gas / Crude Oil</div>
      </div>
    `).addTo(F)}),{shipsGroup:$,pipelinesGroup:F}}let w=null,N=null;function f(e,t){return Math.random()*(t-e)+e}function h(e,t){return Math.floor(Math.random()*(t-e+1))+e}async function Ue(e,t){w=t.layerGroup();const a=(i="var(--text2)",c="")=>t.divIcon({className:"custom-div-icon",html:`
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; gap:1px;">
        <div style="color: ${i}; opacity: 0.95; font-size: 11px; animation: satBlink 2s infinite;">
          <i class="ti ti-satellite"></i>
        </div>
        ${c?`<div style="color:${i}; font-family: monospace; font-size: 6px; font-weight: 700; letter-spacing: 0.05em; opacity: 0.8; white-space: nowrap;">${c}</div>`:""}
      </div>
    `,iconSize:[24,20],iconAnchor:[12,10]}),o=(i,c,g,y,E,T,R,I="OPERATIONAL",P)=>`
    <div style="min-width:220px; font-family:monospace; margin: 0; padding: 0;" class="rtm-popup">
      <!-- Header -->
      <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <i class="ti ti-satellite" style="color:${E}; font-size:14px;"></i>
          <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${i}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${c} • ORBIT: ${g}</span>
        </div>
      </div>

      <!-- Status badge -->
      <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
        <div style="width:6px; height:6px; border-radius:50%; background:${I==="OPERATIONAL"?"#2ae500":"var(--yellow)"}; animation:${I==="OPERATIONAL"?"pulse 2s infinite":"none"};"></div>
        <span style="color:${I==="OPERATIONAL"?"#2ae500":"var(--yellow)"}; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">${I}</span>
      </div>

      <!-- Specs -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">TELEMETRY & ORBIT</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px;">ALTITUDE</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${typeof y=="number"?y.toLocaleString():y} <span style="font-size:7px;">km</span></div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">INCLINATION</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${T}°</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">NORAD ID</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${P}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">BAND/FREQ</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${R}</div>
        </div>
      </div>
    </div>
  `;async function n(){try{const i=await fetch("https://api.wheretheiss.at/v1/satellites/25544");if(!i.ok)throw new Error("ISS API failed");const c=await i.json(),{latitude:g,longitude:y,velocity:E,altitude:T}=c;N?(N.setLatLng([g,y]),N.setPopupContent(o("ISS (ZARYA)","CREWED STATION","LEO",T.toFixed(1),"var(--accent)",51.6,"VHF/UHF","CREWED / ACTIVE",25544))):(N=t.marker([g,y],{icon:a("var(--accent)","ISS")}).bindPopup(o("ISS (ZARYA)","CREWED STATION","LEO",T.toFixed(1),"var(--accent)",51.6,"VHF/UHF","CREWED / ACTIVE",25544),{maxWidth:260,className:"rtm-popup"}),N.addTo(w))}catch{}}const s=[];for(let i=0;i<45;i++)s.push({name:`STARLINK-${h(1e3,9999)}`,lat:f(-70,70),lng:f(-180,180),inc:53,color:"#888",type:"COMMUNICATIONS",orbit:"LEO",alt:h(540,560),freq:"Ku/Ka-band",norad:h(4e4,55e3),speed:f(.3,.7)});for(let i=0;i<20;i++)s.push({name:`ONEWEB-${h(100,999)}`,lat:f(-85,85),lng:f(-180,180),inc:87.9,color:"#5af",type:"COMMUNICATIONS",orbit:"LEO",alt:h(1190,1210),freq:"Ku/Ka-band",norad:h(44e3,48e3),speed:f(.2,.5)});for(let i=0;i<15;i++)s.push({name:`IRIDIUM NEXT ${h(100,199)}`,lat:f(-85,85),lng:f(-180,180),inc:86.4,color:"#0df",type:"COMMUNICATIONS",orbit:"LEO",alt:h(770,790),freq:"L/Ka-band",norad:h(42e3,43e3),speed:f(.25,.6)});["SENTINEL-1A","SENTINEL-2A","LANDSAT-8","LANDSAT-9","NOAA-20","SUOMI NPP","TERRA","AQUA","GOES-16","METOP-C"].forEach(i=>{s.push({name:i,lat:f(-80,80),lng:f(-180,180),inc:f(97,99).toFixed(1),color:"#0df",type:"EARTH OBSERVATION",orbit:"SSO",alt:h(690,800),freq:"X-band",norad:h(25e3,5e4),speed:f(.1,.3)})});for(let i=0;i<15;i++)s.push({name:`NAVSTAR ${h(50,80)} (USA-${h(100,300)})`,lat:f(-55,55),lng:f(-180,180),inc:55,color:"#fa0",type:"NAVIGATION (GPS)",orbit:"MEO",alt:20200,freq:"L-band (L1/L2)",norad:h(2e4,45e3),speed:f(.05,.1)});for(let i=0;i<10;i++)s.push({name:`GALILEO ${h(10,30)}`,lat:f(-56,56),lng:f(-180,180),inc:56,color:"#fa0",type:"NAVIGATION",orbit:"MEO",alt:23222,freq:"L-band",norad:h(35e3,5e4),speed:f(.04,.08)});const d=[],r=["INTELSAT 19","INTELSAT 20","SES-12","SES-14","EUTELSAT 33E","EUTELSAT 7C","AMC-6","AMC-15","DIRECTV-14","DIRECTV-15","ECHOSTAR 105","INMARSAT-5 F4","ASTRA 1M","ASTRA 2E","YAMAL 401","EXPRESS AM7","ARABSAT-5C","TURKSAT 4A","INSAT-3DR","GSAT-31","OPTUS 10","NBN CO 1A"];r.forEach((i,c)=>{d.push({name:i,lat:0,lng:-180+c*(360/r.length)+f(-5,5),color:"#b06aff",type:"BROADCAST / COMM",orbit:"GEO",alt:35786,inc:0,freq:"C/Ku/Ka-band",norad:h(2e4,5e4)})});let p=0;const m=[];return s.forEach(i=>{const c=t.marker([i.lat,i.lng],{icon:a(i.color,i.name)}).bindPopup(o(i.name,i.type,i.orbit,i.alt,i.color,i.inc,i.freq,"OPERATIONAL",i.norad),{maxWidth:260,className:"rtm-popup"});c.addTo(w),m.push({marker:c,sat:i})}),d.forEach(i=>{t.marker([i.lat,i.lng],{icon:a(i.color,i.name)}).bindPopup(o(i.name,i.type,i.orbit,i.alt,i.color,i.inc,i.freq,"OPERATIONAL",i.norad),{maxWidth:260,className:"rtm-popup"}).addTo(w)}),b.satsCount=s.length+d.length+1,setInterval(()=>{p+=1,m.forEach(({marker:i,sat:c})=>{const g=((c.lng+p*c.speed)%360+360)%360,y=g>180?g-360:g;i.setLatLng([c.lat+Math.sin(p*.05*c.speed)*(c.inc>60?5:2),y])})},2e3),await n(),setInterval(n,5e3),w}const G=[{name:"Times Square, NYC (Live)",lat:40.758,lng:-73.9855,country:"USA",type:"CITY",source:"yt",id:"AdUw5RdyZxI"},{name:"Namib Desert Wildlife (Live)",lat:-23.55,lng:15.05,country:"Namibia",type:"WILDLIFE",source:"yt",id:"ydYDqZQpim8"},{name:"ISS Earth View (Live)",lat:0,lng:0,country:"Space",type:"SPACE",source:"yt",id:"P9C25Un7xaM"},{name:"Jackson Hole (Live)",lat:43.4799,lng:-110.7624,country:"USA",type:"NATURE",source:"yt",id:"1EiC9bvVGnk"},{name:"ISS HD Feed (Live)",lat:10,lng:60,country:"Space",type:"SPACE",source:"yt",id:"RtU_mdL2vBM"},{name:"Costa Rica 4K",lat:9.7489,lng:-83.7534,country:"Costa Rica",type:"NATURE",source:"fake-live",id:"https://picsum.photos/seed/costarica/1280/720"},{name:"Japan 8K Tour",lat:35.6762,lng:139.6503,country:"Japan",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/japan/1280/720"},{name:"Paris in 4K",lat:48.8566,lng:2.3522,country:"France",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/paris4k/1280/720"},{name:"New York City 4K",lat:40.7128,lng:-74.006,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/nyc/1280/720"},{name:"London City Tour 4K",lat:51.5074,lng:-.1278,country:"UK",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/london4k/1280/720"},{name:"Italian Alps 4K",lat:46.2044,lng:10.0227,country:"Italy",type:"NATURE",source:"fake-live",id:"https://picsum.photos/seed/alps/1280/720"},{name:"Swiss Mountains 4K",lat:46.8182,lng:8.2275,country:"Switzerland",type:"NATURE",source:"fake-live",id:"https://picsum.photos/seed/swiss/1280/720"},{name:"Bali, Indonesia 4K",lat:-8.3405,lng:115.092,country:"Indonesia",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/bali/1280/720"},{name:"Dubai 4K Drone",lat:25.2048,lng:55.2708,country:"UAE",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/dubai4k/1280/720"},{name:"Rio de Janeiro 4K",lat:-22.9068,lng:-43.1729,country:"Brazil",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/rio4k/1280/720"},{name:"Sydney Harbour 4K",lat:-33.8688,lng:151.2093,country:"Australia",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/sydney4k/1280/720"},{name:"Maldives 4K Relax",lat:3.2028,lng:73.2207,country:"Maldives",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/maldives/1280/720"},{name:"Cape Town 4K",lat:-33.9249,lng:18.4241,country:"South Africa",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/capetown/1280/720"},{name:"Mumbai City Walk 4K",lat:19.076,lng:72.8777,country:"India",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/mumbai4k/1280/720"},{name:"Seoul 4K Night Walk",lat:37.5665,lng:126.978,country:"South Korea",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/seoul/1280/720"},{name:"Singapore 4K Drone",lat:1.3521,lng:103.8198,country:"Singapore",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/singapore4k/1280/720"},{name:"Cairo & Pyramids 4K",lat:30.0444,lng:31.2357,country:"Egypt",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/cairo/1280/720"},{name:"Toronto Skyline 4K",lat:43.6532,lng:-79.3832,country:"Canada",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/toronto/1280/720"},{name:"Mexico City 4K",lat:19.4326,lng:-99.1332,country:"Mexico",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/mexicocity/1280/720"},{name:"Athens Acropolis 4K",lat:37.9838,lng:23.7275,country:"Greece",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/athens/1280/720"},{name:"Istanbul Tour 4K",lat:41.0082,lng:28.9784,country:"Turkey",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/istanbul/1280/720"},{name:"Buenos Aires 4K",lat:-34.6037,lng:-58.3816,country:"Argentina",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/buenosaires/1280/720"},{name:"Bangkok Night Market",lat:13.7563,lng:100.5018,country:"Thailand",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/bangkok/1280/720"},{name:"Machu Picchu 4K",lat:-13.1631,lng:-72.545,country:"Peru",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/machupicchu/1280/720"},{name:"New York - Manhattan",lat:40.7484,lng:-73.9857,country:"USA",type:"CITY",source:"windy",id:"1586800758"},{name:"Los Angeles - Downtown",lat:34.0407,lng:-118.2468,country:"USA",type:"CITY",source:"windy",id:"1586757754"},{name:"San Francisco Bay",lat:37.7749,lng:-122.4194,country:"USA",type:"CITY",source:"windy",id:"1586800756"},{name:"Chicago Skyline",lat:41.8781,lng:-87.6298,country:"USA",type:"CITY",source:"windy",id:"1586800757"},{name:"Shibuya Crossing (Live)",lat:35.6595,lng:139.7004,country:"Japan",type:"CITY",source:"iframe",id:"https://www.youtube.com/embed/live_stream?channel=UCgdHxnHSXvcAi4PaMIY1Dqg"},{name:"Abbey Road (Live)",lat:51.532,lng:-.178,country:"UK",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/abbeyroad/1280/720"},{name:"Niagara Falls (Live)",lat:43.0896,lng:-79.0849,country:"USA/Canada",type:"NATURE",source:"fake-live",id:"https://picsum.photos/seed/niagarafalls/1280/720"},{name:"Times Sq Street Cam (Live)",lat:40.758,lng:-73.9855,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/tsstreet/1280/720"},{name:"Key West Mallory Sq (Live)",lat:24.5593,lng:-81.8078,country:"USA",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/mallorysq/1280/720"},{name:"Dublin Temple Bar (Live)",lat:53.3453,lng:-6.2641,country:"Ireland",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/templebar/1280/720"},{name:"NOLA Bourbon St (Live)",lat:29.9575,lng:-90.0664,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/bourbonst/1280/720"},{name:"Chicago Field Museum (Live)",lat:41.8663,lng:-87.617,country:"USA",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/fieldmuseum/1280/720"},{name:"Las Vegas Strip (Live)",lat:36.1147,lng:-115.1728,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/vegasstrip/1280/720"},{name:"Las Vegas Sign (Live)",lat:36.082,lng:-115.1727,country:"USA",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/vegassign/1280/720"},{name:"Miami Beach (Live)",lat:25.7906,lng:-80.13,country:"USA",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/miamibeach/1280/720"},{name:"Hollywood Blvd (Live)",lat:34.1016,lng:-118.3333,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/hollywood/1280/720"},{name:"Seattle Space Needle (Live)",lat:47.6205,lng:-122.3493,country:"USA",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/spaceneedle2/1280/720"},{name:"Statue of Liberty (Live)",lat:40.6892,lng:-74.0445,country:"USA",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/liberty/1280/720"},{name:"Paris City View (Live)",lat:48.8566,lng:2.3522,country:"France",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/paris/1280/720"},{name:"Amsterdam City (Live)",lat:52.3676,lng:4.9041,country:"Netherlands",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/amsterdam/1280/720"},{name:"Rio de Janeiro (Live)",lat:-22.9068,lng:-43.1729,country:"Brazil",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/riodejaneiro/1280/720"},{name:"Sydney Harbour (Live)",lat:-33.8688,lng:151.2093,country:"Australia",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/sydney/1280/720"},{name:"Chicago Skyline (Live)",lat:41.8781,lng:-87.6298,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/chicago/1280/720"},{name:"Denver Skyline (Live)",lat:39.7392,lng:-104.9903,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/denver/1280/720"},{name:"Boston City View (Live)",lat:42.3601,lng:-71.0589,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/boston/1280/720"},{name:"Philadelphia (Live)",lat:39.9526,lng:-75.1652,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/philadelphia/1280/720"},{name:"Rome Colosseum (Live)",lat:41.8902,lng:12.4922,country:"Italy",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/rome/1280/720"},{name:"Berlin Brandenburg (Live)",lat:52.5163,lng:13.3777,country:"Germany",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/berlin/1280/720"},{name:"Moscow Red Square (Live)",lat:55.7539,lng:37.6208,country:"Russia",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/moscow/1280/720"},{name:"Beijing Forbidden City (Live)",lat:39.9163,lng:116.3972,country:"China",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/beijing/1280/720"},{name:"Hong Kong Skyline (Live)",lat:22.3193,lng:114.1694,country:"China",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/hongkong/1280/720"},{name:"Taipei 101 (Live)",lat:25.033,lng:121.5654,country:"Taiwan",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/taipei/1280/720"},{name:"Manila Bay (Live)",lat:14.5995,lng:120.9842,country:"Philippines",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/manila/1280/720"},{name:"Jakarta Monas (Live)",lat:-6.1754,lng:106.8272,country:"Indonesia",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/jakarta/1280/720"},{name:"Auckland Sky Tower (Live)",lat:-36.8485,lng:174.7633,country:"New Zealand",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/auckland/1280/720"},{name:"Honolulu Waikiki (Live)",lat:21.2769,lng:-157.8234,country:"USA",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/honolulu/1280/720"},{name:"Vancouver Harbour (Live)",lat:49.2827,lng:-123.1207,country:"Canada",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/vancouver/1280/720"},{name:"Seattle Space Needle (Live)",lat:47.6205,lng:-122.3493,country:"USA",type:"LANDMARK",source:"fake-live",id:"https://picsum.photos/seed/seattle/1280/720"},{name:"Las Vegas Strip (Live)",lat:36.1147,lng:-115.1728,country:"USA",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/vegas/1280/720"},{name:"Miami South Beach (Live)",lat:25.7906,lng:-80.13,country:"USA",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/miami/1280/720"},{name:"Havana Malecon (Live)",lat:23.1417,lng:-82.3853,country:"Cuba",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/havana/1280/720"},{name:"Caracas City Center (Live)",lat:10.4806,lng:-66.9036,country:"Venezuela",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/caracas/1280/720"},{name:"Bogota Monserrate (Live)",lat:4.711,lng:-74.0721,country:"Colombia",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/bogota/1280/720"},{name:"Lima Plaza Mayor (Live)",lat:-12.0464,lng:-77.0298,country:"Peru",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/lima/1280/720"},{name:"Santiago Costanera (Live)",lat:-33.4489,lng:-70.6693,country:"Chile",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/santiago/1280/720"},{name:"Dakar Independence (Live)",lat:14.7167,lng:-17.4677,country:"Senegal",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/dakar/1280/720"},{name:"Lagos Victoria Island (Live)",lat:6.4281,lng:3.4219,country:"Nigeria",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/lagos/1280/720"},{name:"Nairobi Skyline (Live)",lat:-1.2921,lng:36.8219,country:"Kenya",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/nairobi/1280/720"},{name:"Tel Aviv Beach (Live)",lat:32.0853,lng:34.7818,country:"Israel",type:"BEACH",source:"fake-live",id:"https://picsum.photos/seed/telaviv/1280/720"},{name:"Riyadh Kingdom Centre (Live)",lat:24.7136,lng:46.6753,country:"Saudi Arabia",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/riyadh/1280/720"},{name:"Tehran Milad Tower (Live)",lat:35.6892,lng:51.389,country:"Iran",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/tehran/1280/720"},{name:"Kiev Independence (Live)",lat:50.4501,lng:30.5234,country:"Ukraine",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/kiev/1280/720"},{name:"Warsaw Palace (Live)",lat:52.2297,lng:21.0122,country:"Poland",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/warsaw/1280/720"},{name:"Stockholm Gamla Stan (Live)",lat:59.3293,lng:18.0686,country:"Sweden",type:"CITY",source:"fake-live",id:"https://picsum.photos/seed/stockholm/1280/720"},{name:"Reykjavik Harbour (Live)",lat:64.1466,lng:-21.9426,country:"Iceland",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/reykjavik/1280/720"},{name:"Lincoln Tunnel Traffic (Live)",lat:40.7635,lng:-74.0201,country:"USA",type:"TRAFFIC",source:"fake-live",id:"https://picsum.photos/seed/lincolntunnel/1280/720"},{name:"Golden Gate Bridge (Live)",lat:37.8199,lng:-122.4783,country:"USA",type:"TRAFFIC",source:"fake-live",id:"https://picsum.photos/seed/goldengate/1280/720"},{name:"London M25 Motorway (Live)",lat:51.55,lng:-.2,country:"UK",type:"TRAFFIC",source:"fake-live",id:"https://picsum.photos/seed/london-m25/1280/720"},{name:"Autobahn A3 Frankfurt (Live)",lat:50.05,lng:8.6,country:"Germany",type:"TRAFFIC",source:"fake-live",id:"https://picsum.photos/seed/autobahn-a3/1280/720"},{name:"Mumbai Sea Link Traffic (Live)",lat:19.035,lng:72.815,country:"India",type:"TRAFFIC",source:"fake-live",id:"https://picsum.photos/seed/mumbai-traffic/1280/720"},{name:"Dubai Sheikh Zayed Rd (Live)",lat:25.2,lng:55.27,country:"UAE",type:"TRAFFIC",source:"fake-live",id:"https://picsum.photos/seed/dubai-traffic/1280/720"},{name:"Key West Seaport (Live)",lat:24.5614,lng:-81.8005,country:"USA",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/keywestport/1280/720"},{name:"Port of Singapore (Live)",lat:1.25,lng:103.8,country:"Singapore",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/singapore-port/1280/720"},{name:"Shanghai Yangshan Port (Live)",lat:30.6,lng:122.05,country:"China",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/shanghai-port/1280/720"},{name:"Port of Los Angeles (Live)",lat:33.74,lng:-118.26,country:"USA",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/la-port/1280/720"},{name:"Hamburg Harbor (Live)",lat:53.54,lng:9.98,country:"Germany",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/hamburg-harbor/1280/720"},{name:"Sydney Circular Quay (Live)",lat:-33.86,lng:151.21,country:"Australia",type:"PORT",source:"fake-live",id:"https://picsum.photos/seed/sydney-harbor/1280/720"},{name:"JFK Airport Runway 4R (Live)",lat:40.6413,lng:-73.7781,country:"USA",type:"AIRPORT",source:"fake-live",id:"https://picsum.photos/seed/jfk-runway/1280/720"},{name:"Heathrow Terminal 5 ATC (Live)",lat:51.47,lng:-.4543,country:"UK",type:"AIRPORT",source:"fake-live",id:"https://picsum.photos/seed/heathrow-atc/1280/720"},{name:"Tokyo Haneda Apron (Live)",lat:35.5494,lng:139.7798,country:"Japan",type:"AIRPORT",source:"fake-live",id:"https://picsum.photos/seed/haneda-apron/1280/720"},{name:"Dubai International T3 (Live)",lat:25.2532,lng:55.3657,country:"UAE",type:"AIRPORT",source:"fake-live",id:"https://picsum.photos/seed/dubai-t3/1280/720"},{name:"Frankfurt Airport ATC (Live)",lat:50.0379,lng:8.5622,country:"Germany",type:"AIRPORT",source:"fake-live",id:"https://picsum.photos/seed/frankfurt-atc/1280/720"},{name:"LAX Tom Bradley Int (Live)",lat:33.9416,lng:-118.4085,country:"USA",type:"AIRPORT",source:"fake-live",id:"https://picsum.photos/seed/lax-terminal/1280/720"}],ge={CITY:"#ff3a7a",LANDMARK:"#b06aff",BEACH:"#3b9eff",NATURE:"#2ae500",WILDLIFE:"#f5c400",SPACE:"#00d4d4",TRAFFIC:"#ff6b2c",PORT:"#3b9eff",AIRPORT:"#ff6b2c"};function ue(e){switch(e.source){case"yt":return`https://www.youtube.com/embed/${e.id}?autoplay=1&mute=1&rel=0&modestbranding=1`;case"windy":return`https://webcams.windy.com/webcams/public/embed/player/${e.id}/day`;case"iframe":return e.id;default:return e.id}}function Fe(e){const t=document.getElementById("camera-overlay"),a=document.getElementById("cam-frame"),o=document.getElementById("cam-title"),n=document.getElementById("cam-location"),s=document.getElementById("cam-loading");if(!t||!a||!o||!n)return;o.textContent=e.name,n.textContent=`${e.country} • ${e.type}`,s&&(s.style.display="flex");const l=a.querySelector("iframe");l&&l.remove();const d=a.querySelector(".cam-fallback");d&&d.remove();const r=ue(e);if(e.source==="fake-live"){a.innerHTML=`
      <div style="position:absolute; inset:0; background: #000 url('${e.id}') center/cover no-repeat; z-index:1; animation: subtleZoom 60s infinite alternate linear;">
        <style>
          @keyframes subtleZoom { from { transform: scale(1); } to { transform: scale(1.05); } }
        </style>
        
        <!-- Fake YouTube Overlay -->
        <div style="position:absolute; inset:0; background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 15%, transparent 80%, rgba(0,0,0,0.9) 100%); display:flex; flex-direction:column; justify-content:space-between; padding:20px; color:white; font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;">
          
          <!-- Top Bar -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.2);">
                <i class="ti ti-camera" style="font-size:20px; color:#fff;"></i>
              </div>
              <div>
                <div style="font-size:18px; font-weight:500; text-shadow:1px 1px 3px rgba(0,0,0,0.8);">${e.name}</div>
                <div style="font-size:13px; color:#ddd; text-shadow:1px 1px 2px rgba(0,0,0,0.8);">
                  <span style="color:#ff3a3a;">●</span> Live now • ${Math.floor(Math.random()*5e3+100)} watching
                </div>
              </div>
            </div>
            <div style="display:flex; gap:20px;">
              <i class="ti ti-cast" style="font-size:22px; cursor:pointer; opacity:0.8;"></i>
              <i class="ti ti-dots-vertical" style="font-size:22px; cursor:pointer; opacity:0.8;"></i>
            </div>
          </div>
          
          <!-- Play Button Overlay (Initially hidden, could be used for interactivity) -->
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:none;" id="fake-play-btn">
            <div style="width:68px; height:48px; background:rgba(255,0,0,0.8); border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
              <i class="ti ti-player-play-filled" style="font-size:24px;"></i>
            </div>
          </div>

          <!-- Bottom Controls -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <!-- Progress Bar -->
            <div style="height:3px; background:rgba(255,255,255,0.3); width:100%; cursor:pointer; position:relative;">
              <div style="height:100%; width:100%; background:#ff3a3a;"></div>
              <div style="position:absolute; right:0; top:50%; transform:translateY(-50%); width:12px; height:12px; background:#ff3a3a; border-radius:50%;"></div>
            </div>
            <!-- Buttons -->
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; align-items:center; gap:25px;">
                <i class="ti ti-player-pause-filled" style="font-size:20px; cursor:pointer;"></i>
                <div style="display:flex; align-items:center; gap:10px;">
                  <i class="ti ti-volume" style="font-size:20px; cursor:pointer;"></i>
                  <div style="width:50px; height:3px; background:#fff;"></div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <div style="width:8px; height:8px; border-radius:50%; background:#ff3a3a; animation:pulse 2s infinite;"></div>
                  <span style="font-size:13px; font-weight:500;">LIVE</span>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:25px;">
                <span style="font-size:12px; font-weight:500; border:1px solid rgba(255,255,255,0.5); padding:2px 6px; border-radius:2px;">CC</span>
                <i class="ti ti-settings" style="font-size:20px; cursor:pointer;"></i>
                <i class="ti ti-maximize" style="font-size:20px; cursor:pointer;"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,s&&(s.style.display="none"),t.style.display="flex";return}const p=document.createElement("iframe");p.src=r,p.style.cssText="position:absolute; inset:0; width:100%; height:100%; border:none; z-index:1;",p.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",p.allowFullscreen=!0;const m=setTimeout(()=>{s&&(s.style.display="none"),ae(a,e)},1e4);p.addEventListener("load",()=>{clearTimeout(m),s&&(s.style.display="none")}),p.addEventListener("error",()=>{clearTimeout(m),s&&(s.style.display="none"),ae(a,e)}),a.appendChild(p),t.style.display="flex"}function ae(e,t){const a=ge[t.type]||"#ff3a7a",o=document.createElement("div");o.className="cam-fallback",o.style.cssText="position:absolute; inset:0; z-index:2; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:var(--bg);",o.innerHTML=`
    <i class="ti ti-video-off" style="font-size:32px; color:${a}; opacity:0.5;"></i>
    <div style="font-family:monospace; font-size:10px; color:var(--text2); text-align:center;">
      Stream may be temporarily offline or prevents embedding.
    </div>
    <a href="${ue(t)}" target="_blank" rel="noopener" style="
      margin-top:4px; padding:6px 14px; background:transparent;
      border:1px solid ${a}; color:${a};
      font-family:monospace; font-size:8px; font-weight:700;
      text-decoration:none; text-transform:uppercase; letter-spacing:0.1em;
      transition: all 0.15s;
    " onmouseover="this.style.background='${a}';this.style.color='var(--accent-on)'"
       onmouseout="this.style.background='transparent';this.style.color='${a}'">
      Open in new tab
    </a>
  `,e.appendChild(o)}function De(e,t){const a={city:t.layerGroup(),traffic:t.layerGroup(),port:t.layerGroup(),airport:t.layerGroup()};return G.forEach(o=>{const n=ge[o.type]||"#ff3a7a",s=o.name.includes("(Live)"),l=t.divIcon({className:"custom-div-icon",html:`
        <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
          <div style="
            width:22px; height:22px; 
            background:${n}22; 
            border:2px solid ${n}; 
            border-radius:50%; 
            display:flex; align-items:center; justify-content:center;
            ${s?`animation: camPulse 1.5s infinite; box-shadow: 0 0 15px ${n}, 0 0 5px #ffffff;`:`box-shadow: 0 0 8px ${n}44;`}
          ">
            <div style="color:${n}; font-size:10px; line-height:1;"><i class="ti ti-video"></i></div>
          </div>
          <div style="
            font-family:monospace; font-size:6px; font-weight:700; 
            color:${n}; letter-spacing:0.04em; 
            white-space:nowrap; margin-top:1px;
            text-shadow: 0 0 4px rgba(0,0,0,0.8);
          ">${o.name.length>18?o.name.slice(0,16)+"…":o.name}</div>
        </div>
      `,iconSize:[80,30],iconAnchor:[40,15]}),d={yt:"YouTube Video",windy:"Windy Webcam",iframe:"Direct Stream","fake-live":"YouTube Live Feed"},r=t.marker([o.lat,o.lng],{icon:l});r.bindPopup(`
      <div style="min-width:200px; font-family:monospace;">
        <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
            ${s?`<div style="width:8px; height:8px; background:#ff3a3a; border-radius:50%; animation:pulse 1.5s infinite;"></div>
            <span style="color:var(--red); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">● LIVE FEED</span>`:`<i class="ti ti-video" style="color:var(--accent); font-size:10px;"></i>
            <span style="color:var(--accent); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">4K TOUR</span>`}
          </div>
          <div style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${o.name}</div>
          <div style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${o.country} • ${o.type}</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">
          <div style="width:5px; height:5px; background:${n}; border-radius:50%;"></div>
          <span style="color:var(--text2); font-size:8px;">LAT: ${o.lat.toFixed(4)} | LNG: ${o.lng.toFixed(4)}</span>
        </div>
        <div style="margin-bottom:6px;">
          <span style="color:var(--text3); font-size:7px; text-transform:uppercase;">SOURCE: ${d[o.source]}</span>
        </div>
        <button onclick="window.__openCamera(${G.indexOf(o)})" style="
          width:100%; padding:6px; background:var(--accent); color:var(--accent-on);
          border:none; font-family:monospace; font-size:8px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;
        ">
          <i class="ti ti-player-play" style="font-size:10px;"></i> ${s?"Watch Live Stream":"Play 4K Video"}
        </button>
      </div>
    `,{maxWidth:260,className:"rtm-popup"}),o.type==="TRAFFIC"?r.addTo(a.traffic):o.type==="PORT"?r.addTo(a.port):o.type==="AIRPORT"?r.addTo(a.airport):r.addTo(a.city)}),window.__openCamera=o=>{const n=G[o];n&&(e.closePopup(),Fe(n))},document.getElementById("camera-close")?.addEventListener("click",()=>{const o=document.getElementById("camera-overlay");o&&(o.style.display="none");const n=document.getElementById("cam-frame"),s=n?.querySelector("iframe");s&&(s.src=""),n&&(n.innerHTML="")}),a}function Ge(e,t){const a=t.layerGroup(),o=t.layerGroup(),n=[{name:"Area 51",lat:37.235,lng:-115.811,country:"USA",type:"AFB",branch:"USAF"},{name:"Diego Garcia",lat:-7.3195,lng:72.4228,country:"BIOT",type:"Naval/Air Facility",branch:"Joint"},{name:"Kadena Air Base",lat:26.3556,lng:127.7674,country:"Japan",type:"AFB",branch:"USAF"},{name:"Ramstein Air Base",lat:49.4385,lng:7.5988,country:"Germany",type:"AFB",branch:"USAF"},{name:"Naval Station Norfolk",lat:36.9388,lng:-76.3268,country:"USA",type:"Naval Base",branch:"USN"},{name:"Thule Air Base",lat:76.5312,lng:-68.7032,country:"Greenland",type:"Space Base",branch:"USSF"},{name:"Guantanamo Bay",lat:19.9079,lng:-75.1481,country:"Cuba",type:"Naval Base",branch:"USN"},{name:"Joint Base Pearl Harbor-Hickam",lat:21.3458,lng:-157.9427,country:"USA",type:"Joint Base",branch:"Joint"},{name:"Okinawa USMC Base",lat:26.39,lng:127.8,country:"Japan",type:"MCB",branch:"USMC"},{name:"Incirlik Air Base",lat:37.0019,lng:35.4258,country:"Turkey",type:"AFB",branch:"USAF"},{name:"RAF Menwith Hill",lat:54.0083,lng:-1.6897,country:"UK",type:"SIGINT",branch:"RAF/NSA"},{name:"Camp Lemonnier",lat:11.5434,lng:43.1492,country:"Djibouti",type:"Expeditionary",branch:"USN"},{name:"Al Udeid Air Base",lat:25.1186,lng:51.3146,country:"Qatar",type:"AFB",branch:"USAF"},{name:"Pine Gap",lat:-23.799,lng:133.7371,country:"Australia",type:"SIGINT",branch:"Joint/NSA"},{name:"Fort Bragg",lat:35.139,lng:-79.006,country:"USA",type:"Army Base",branch:"USA"}],s=[{name:"Cheyenne Mountain Complex",lat:38.7445,lng:-104.8465,country:"USA",type:"Bunker",depth:"610m",threat_level:"DEFCON 3"},{name:"Mount Yamantau",lat:54.2562,lng:58.1022,country:"Russia",type:"Bunker",depth:"Classified",threat_level:"CLASSIFIED"},{name:"Site R (Raven Rock)",lat:39.7347,lng:-77.4194,country:"USA",type:"Bunker",depth:"200m",threat_level:"DEFCON 3"},{name:"Kosvinsky Kamen",lat:59.5208,lng:59.0608,country:"Russia",type:"Command Post",depth:"300m",threat_level:"DEFCON 2"},{name:"Mount Weather",lat:39.0628,lng:-77.8879,country:"USA",type:"Bunker",depth:"Classified",threat_level:"DEFCON 4"},{name:"Jianggezhuang Naval Base",lat:36.126,lng:120.5736,country:"China",type:"Sub Base",depth:"Sea Cave",threat_level:"DEFCON 3"},{name:"Yulin Naval Base",lat:18.2166,lng:109.6833,country:"China",type:"Sub Base",depth:"Sea Cave",threat_level:"DEFCON 3"},{name:"Olavsvern",lat:69.5317,lng:19.0069,country:"Norway",type:"Sub Base",depth:"Sea Cave",threat_level:"DEFCON 4"},{name:"Muskö Naval Base",lat:58.9958,lng:17.9625,country:"Sweden",type:"Sub Base",depth:"Sea Cave",threat_level:"DEFCON 4"},{name:"Kapustin Yar (Zhitkur)",lat:48.5667,lng:45.7167,country:"Russia",type:"Research",depth:"Underground",threat_level:"CLASSIFIED"}],l=(r,p)=>t.divIcon({className:"custom-div-icon",html:`
      <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
        <div style="
          width:18px; height:18px; 
          background:${r}22; 
          border:1px solid ${r}; 
          border-radius:3px; 
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 10px ${r}44;
          transform: rotate(45deg);
        ">
          <div style="color:${r}; font-size:10px; transform: rotate(-45deg);"><i class="${p}"></i></div>
        </div>
      </div>
    `,iconSize:[20,20],iconAnchor:[10,10]}),d=r=>t.divIcon({className:"custom-div-icon",html:`
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; z-index: 1000;">
        <div style="
          width:22px; height:22px; 
          background:${r}33; 
          border:1.5px dashed ${r}; 
          border-radius:50%; 
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 15px ${r}88, inset 0 0 10px ${r}88;
          animation: pulseNuke 2s infinite alternate;
        ">
          <div style="color:${r}; font-size:12px; text-shadow: 0 0 5px ${r};"><i class="ti ti-radioactive"></i></div>
        </div>
      </div>
      <style>
        @keyframes pulseNuke {
          from { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 10px ${r}44; }
          to { transform: scale(1.05); opacity: 1; box-shadow: 0 0 20px ${r}, inset 0 0 15px ${r}; }
        }
      </style>
    `,iconSize:[26,26],iconAnchor:[13,13]});return n.forEach(r=>{const p=t.marker([r.lat,r.lng],{icon:l("#6b8e23","ti-shield-check")});p.bindPopup(`
      <div style="min-width:200px; font-family:monospace;" class="rtm-popup">
        <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
            <i class="ti ti-shield" style="color:#6b8e23; font-size:12px;"></i>
            <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${r.name}</span>
          </div>
          <div style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${r.country} • ${r.type}</div>
        </div>
        <div style="color:#6b8e23; font-size:9px; font-weight:700; margin-bottom:4px;">STATUS: SECURE</div>
        <div style="color:var(--text2); font-size:8px; margin-bottom:4px;">BRANCH: ${r.branch}</div>
        <div style="color:var(--text3); font-size:7px;">LAT: ${r.lat.toFixed(4)} | LNG: ${r.lng.toFixed(4)}</div>
      </div>
    `,{className:"rtm-popup"}),p.addTo(a)}),s.forEach(r=>{const p=t.marker([r.lat,r.lng],{icon:d("#ff3a3a")});p.bindPopup(`
      <div style="min-width:220px; font-family:monospace;" class="rtm-popup">
        <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid #ff3a3a44;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
            <i class="ti ti-radioactive" style="color:#ff3a3a; font-size:14px; animation: pulseNuke 2s infinite alternate;"></i>
            <span style="color:#ff3a3a; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; text-shadow: 0 0 5px #ff3a3a88;">${r.name}</span>
          </div>
          <div style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${r.country} • UNDERGROUND FACILITY</div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
           <div>
             <div style="color:var(--text3); font-size:7px; letter-spacing:0.1em;">EST. DEPTH</div>
             <div style="color:var(--text); font-size:9px; font-weight:bold;">${r.depth}</div>
           </div>
           <div>
             <div style="color:var(--text3); font-size:7px; letter-spacing:0.1em;">THREAT LEVEL</div>
             <div style="color:var(--yellow); font-size:9px; font-weight:bold;">${r.threat_level}</div>
           </div>
        </div>
        <div style="background:#ff3a3a; color:var(--bg); padding:4px; text-align:center; font-size:8px; font-weight:bold; letter-spacing:0.2em; text-transform:uppercase; margin-top:8px;">RESTRICTED ZONE</div>
      </div>
    `,{className:"rtm-popup"}),p.addTo(o)}),{militaryGroup:a,nuclearGroup:o}}function He(e){const t=document.getElementById("global-search");t&&t.addEventListener("keydown",async a=>{if(a.key==="Enter"){const o=t.value.trim();if(!o)return;t.blur();try{const s=await(await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(o)}`)).json();if(s&&s.length>0){const l=parseFloat(s[0].lat),d=parseFloat(s[0].lon);e.flyTo([l,d],10,{duration:2,easeLinearity:.25})}}catch(n){console.error("Geocoding failed",n)}t.value=""}})}let v,A;const H={dark:{url:"https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",opts:{subdomains:"abcd",maxZoom:19}},satellite:{url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",opts:{maxZoom:19}},terrain:{url:"https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",opts:{maxZoom:17}}};let M=null,ne="dark";const S={},O={flights:!0,ships:!0,cables:!0,pipelines:!0,satellites:!1,cameras_city:!1,cameras_traffic:!1,cameras_port:!1,cameras_airport:!1,military:!1,nuclear:!1};function Ye(e){if(ne===e||!v)return;ne=e,M&&v.removeLayer(M);const t=H[e];M=A.tileLayer(t.url,t.opts).addTo(v),M.bringToBack(),document.querySelectorAll(".tbtn").forEach(a=>{if(a.id.startsWith("tile-")){const o=a.id===`tile-${e}`;a.classList.toggle("active-tile",o)}})}function Ke(e){const t=S[e];if(!t||!v)return;O[e]=!O[e],O[e]?t.addTo(v):v.removeLayer(t);const a=document.querySelector(`.lpill[data-layer="${e}"]`);a&&a.classList.toggle("active",O[e])}function ie(e){const t=document.getElementById("map-perspective-wrapper");if(!t)return;e?t.classList.add("mode-3d"):t.classList.remove("mode-3d");const a=document.getElementById("view-2d"),o=document.getElementById("view-3d");a&&a.classList.toggle("active-tile",!e),o&&o.classList.toggle("active-tile",e),setTimeout(()=>v?.invalidateSize(),700)}function Ve(){const e=document.getElementById("streetview-btn"),t=document.getElementById("streetview-overlay"),a=document.getElementById("streetview-close"),o=document.getElementById("streetview-frame"),n=document.getElementById("sv-location");e&&t&&o&&e.addEventListener("click",()=>{if(!v)return;const s=v.getCenter(),l=s.lat.toFixed(6),d=s.lng.toFixed(6);n&&(n.textContent=`LAT: ${l} | LNG: ${d}`),o.innerHTML=`
        <iframe 
          src="https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s!2m2!1d${l}!2d${d}!3f0!4f0!5f0.7820865974627469"
          style="width:100%; height:100%; border:none;"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        ></iframe>
        <div style="position:absolute; bottom:8px; right:8px; z-index:10;">
          <a href="https://www.google.com/maps/@${l},${d},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192" 
             target="_blank" rel="noopener"
             style="
               display:inline-flex; align-items:center; gap:4px;
               padding:4px 10px; background:var(--bg3); border:1px solid var(--border2);
               color:var(--accent); font-family:monospace; font-size:8px; font-weight:700;
               text-decoration:none; text-transform:uppercase; letter-spacing:0.1em;
               transition: all 0.15s;
             "
             onmouseover="this.style.background='var(--accent)';this.style.color='var(--accent-on)'"
             onmouseout="this.style.background='var(--bg3)';this.style.color='var(--accent)'"
          >
            <i class="ti ti-external-link" style="font-size:10px;"></i>
            Open in Google Maps
          </a>
        </div>
      `,t.style.display="block"}),a&&t&&o&&a.addEventListener("click",()=>{t.style.display="none",o.innerHTML=""})}function We(){const e=document.getElementById("layer-panel-btn"),t=document.getElementById("layer-panel"),a=document.getElementById("layer-chevron");e&&t&&(e.addEventListener("click",o=>{o.stopPropagation();const n=t.style.display==="flex"||t.style.display==="block";t.style.display=n?"none":"block",a&&(a.style.transform=n?"":"rotate(180deg)")}),document.addEventListener("click",o=>{t.style.display!=="none"&&!t.contains(o.target)&&o.target!==e&&!e.contains(o.target)&&(t.style.display="none",a&&(a.style.transform=""))})),document.querySelectorAll(".lrow").forEach(o=>{const n=o.dataset.layer;o.addEventListener("click",()=>Ke(n))}),["dark","satellite","terrain"].forEach(o=>{document.getElementById(`tile-${o}`)?.addEventListener("click",n=>{n.stopPropagation(),Ye(o)})}),document.getElementById("view-2d")?.addEventListener("click",o=>{o.stopPropagation(),ie(!1)}),document.getElementById("view-3d")?.addEventListener("click",o=>{o.stopPropagation(),ie(!0)})}async function Y(){if(A=window.L,!A){setTimeout(Y,100);return}v=A.map("map",{zoomControl:!1,attributionControl:!1,center:[20,0],zoom:3,minZoom:2,maxBounds:[[-90,-180],[90,180]]}),M=A.tileLayer(H.dark.url,H.dark.opts).addTo(v),A.control.zoom({position:"bottomleft"}).addTo(v),setTimeout(()=>v.invalidateSize(),200);const e=document.getElementById("hud-coords");v.on("mousemove",p=>{if(!e)return;const m=p.latlng.lat.toFixed(4),i=p.latlng.lng.toFixed(4);e.textContent=`LAT: ${Math.abs(Number(m))}°${Number(m)>=0?"N":"S"} | LON: ${Math.abs(Number(i))}°${Number(i)>=0?"E":"W"}`}),window.dispatchEvent(new CustomEvent("map-ready",{detail:{map:v,L:A}})),He(v);const[t,a]=await Promise.all([Ce(v,A),we(v,A)]),{shipsGroup:o,pipelinesGroup:n}=Pe(v,A),s=await Ue(v,A),l=De(v,A),{militaryGroup:d,nuclearGroup:r}=Ge(v,A);S.flights=t,S.cables=a,S.ships=o,S.pipelines=n,S.satellites=s,S.cameras_city=l.city,S.cameras_traffic=l.traffic,S.cameras_port=l.port,S.cameras_airport=l.airport,S.military=d,S.nuclear=r,t&&t.addTo(v),a&&a.addTo(v),o&&o.addTo(v),n&&n.addTo(v),We(),Ve()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Y):Y();function _e(){const e=document.getElementById("map"),t=window.L;e&&t&&e._leaflet_id,window.addEventListener("map-ready",a=>{const{map:o,L:n}=a.detail;se(o,n),setInterval(()=>se(o,n),3e5)}),qe()}async function qe(){let e=[];try{e=(await(await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",{signal:AbortSignal.timeout(8e3)})).json()).features||[]}catch{}e.length===0&&(e=ve()),b.eqCount=e.length;const t=document.getElementById("alert-count");t&&(t.textContent=e.length.toString()),ye(e),window.dispatchEvent(new CustomEvent("alerts-updated",{detail:{alerts:e}}))}_e();function ve(){const e=[{place:"42km SSW of Tōnoshō, Japan",lat:34.2,lng:134.1,mag:()=>3.5+Math.random()*3},{place:"15km NE of Ridgecrest, California",lat:35.6,lng:-117.5,mag:()=>2.5+Math.random()*2},{place:"67km SSE of Pāhala, Hawaii",lat:18.9,lng:-155.2,mag:()=>3+Math.random()*1.5},{place:"23km W of El Hierro, Canary Islands",lat:27.7,lng:-18.1,mag:()=>2.8+Math.random()*2},{place:"8km NNW of Pazarcık, Turkey",lat:37.8,lng:36.9,mag:()=>3.2+Math.random()*3},{place:"120km SW of Valparaíso, Chile",lat:-33.5,lng:-72.2,mag:()=>4+Math.random()*2.5},{place:"85km ENE of Amatignak Island, Alaska",lat:51.5,lng:-178.8,mag:()=>3.8+Math.random()*2},{place:"60km S of Jayapura, Indonesia",lat:-3,lng:140.7,mag:()=>4.2+Math.random()*2},{place:"45km NE of Tonga",lat:-21,lng:-175,mag:()=>3.5+Math.random()*3},{place:"30km SSE of Kathmandu, Nepal",lat:27.5,lng:85.5,mag:()=>3+Math.random()*2.5},{place:"90km W of Anchorage, Alaska",lat:61.2,lng:-151,mag:()=>2.5+Math.random()*2},{place:"55km NNE of L'Aquila, Italy",lat:42.8,lng:13.6,mag:()=>2.8+Math.random()*1.5},{place:"150km SSW of Banda Aceh, Indonesia",lat:4,lng:94.8,mag:()=>4.5+Math.random()*2},{place:"75km E of Christchurch, New Zealand",lat:-43.5,lng:173.2,mag:()=>3.2+Math.random()*2},{place:"40km NW of Tehran, Iran",lat:35.9,lng:51,mag:()=>3.8+Math.random()*2.5},{place:"25km SE of Mexico City, Mexico",lat:19.2,lng:-99,mag:()=>3+Math.random()*2},{place:"200km W of Lima, Peru",lat:-12.2,lng:-79,mag:()=>4+Math.random()*2},{place:"35km NE of Taipei, Taiwan",lat:25.2,lng:121.8,mag:()=>3.5+Math.random()*2},{place:"110km SSE of Reykjavík, Iceland",lat:63.5,lng:-21.5,mag:()=>2.7+Math.random()*1.5},{place:"65km NW of Port Moresby, Papua New Guinea",lat:-9,lng:146.7,mag:()=>4.8+Math.random()*1.5}],t=Date.now();return e.map((a,o)=>({geometry:{coordinates:[a.lng,a.lat,10+Math.random()*100]},properties:{mag:+a.mag().toFixed(1),place:a.place,time:t-o*(3e5+Math.random()*6e5),type:"earthquake",status:"reviewed"}}))}async function se(e,t){let a=[];try{a=(await(await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",{signal:AbortSignal.timeout(8e3)})).json()).features||[]}catch(n){console.warn("USGS API unavailable, using simulated earthquake data",n)}a.length===0&&(a=ve()),b.eqCount=a.length;const o=document.getElementById("alert-count");o&&(o.textContent=a.length.toString()),ye(a),je(a,e,t),window.dispatchEvent(new CustomEvent("alerts-updated",{detail:{alerts:a}}))}let B=null;function je(e,t,a){B&&t.removeLayer(B),B=a.layerGroup().addTo(t);const o=()=>getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"#2ae500",n=()=>getComputedStyle(document.documentElement).getPropertyValue("--red").trim()||"#ff4444",s=()=>getComputedStyle(document.documentElement).getPropertyValue("--yellow").trim()||"#f5c400";e.forEach(l=>{const d=l.geometry.coordinates,r=l.properties.mag;let p=o();r>=5?p=n():r>=4&&(p=s());const m=a.divIcon({className:"custom-div-icon",html:`
        <div style="position:relative; width: 20px; height: 20px;">
          <div style="position:absolute; inset:0; border: 1px solid ${p}; border-radius: 50%; animation: pulseRing ${r}s ease-out infinite; opacity: 0.5;"></div>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:4px; height:4px; background:${p};"></div>
        </div>
      `,iconSize:[20,20],iconAnchor:[10,10]});a.marker([d[1],d[0]],{icon:m}).bindPopup(`
        <div class="font-mono text-[9px] font-bold tracking-[0.1em] text-accent uppercase border-b border-border2 pb-1 mb-1">
          SEISMIC_EVENT
        </div>
        <div class="text-text">MAG: ${r.toFixed(1)}</div>
        <div class="text-text2 truncate w-40">${l.properties.place}</div>
      `).addTo(B)})}function ye(e){const t=document.getElementById("alert-list");if(!t)return;const a=document.getElementById("alert-skeleton");a&&a.remove(),t.innerHTML="",e.sort((n,s)=>s.properties.time-n.properties.time).slice(0,20).forEach(n=>{const s=n.properties.mag;let l="text-accent",d="border-accent";s>=5?(l="text-red",d="border-red"):s>=4&&(l="text-yellow",d="border-yellow");const r=new Date(n.properties.time).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),p=Je(n.properties.time),m=document.createElement("div");m.className=`p-2 px-2.5 border-b border-border cursor-pointer transition-colors hover:bg-bg4 border-l-2 ${d} animate-fade-up`,m.innerHTML=`
      <div class="flex justify-between items-center mb-[2px]">
        <span class="font-mono text-[8px] font-bold tracking-[0.08em] uppercase ${l}">MAG ${s.toFixed(1)}</span>
        <span class="font-mono text-[8px] text-text3">${r}</span>
      </div>
      <div class="text-[9px] text-text2 leading-[1.35] mb-1">${n.properties.place}</div>
      <div class="flex gap-1 flex-wrap items-center">
        <span class="font-mono text-[7px] font-bold px-1 py-[1px] border border-border2 text-text3">USGS</span>
        <span class="font-mono text-[7px] font-bold px-1 py-[1px] border border-border2 text-text3">${n.properties.type?.toUpperCase?.()||"EARTHQUAKE"}</span>
        <span class="font-mono text-[7px] text-text3 ml-auto">${p}</span>
      </div>
    `,t.appendChild(m)})}function Je(e){const t=Date.now()-e,a=Math.floor(t/6e4);if(a<1)return"just now";if(a<60)return`${a}m ago`;const o=Math.floor(a/60);return o<24?`${o}h ago`:`${Math.floor(o/24)}d ago`}
