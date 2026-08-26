import { globalState } from '../metrics.ts';

let shipsGroup: any = null;
let pipelinesGroup: any = null;

// Ship types with icons and colors
const VESSEL_TYPES = [
  { type: 'Container Ship',  icon: 'ti-container',    color: '#f5c400' },
  { type: 'Oil Tanker',      icon: 'ti-droplet',      color: '#ff7a2a' },
  { type: 'Bulk Carrier',    icon: 'ti-cube',         color: '#a09e9d' },
  { type: 'LNG Tanker',      icon: 'ti-flame',        color: '#3b9eff' },
  { type: 'Cargo',           icon: 'ti-package',      color: '#e5e2e1' },
  { type: 'Cruise Ship',     icon: 'ti-sailboat',     color: '#b06aff' },
  { type: 'Naval Vessel',    icon: 'ti-anchor',       color: '#2ae500' },
  { type: 'Ro-Ro',           icon: 'ti-truck',        color: '#ff3a3a' },
];

const FLAGS = ['🇺🇸','🇬🇧','🇩🇪','🇯🇵','🇨🇳','🇬🇷','🇳🇴','🇸🇬','🇵🇦','🇧🇸','🇲🇭','🇰🇷','🇮🇳','🇳🇱','🇭🇰','🇩🇰','🇧🇭','🇹🇼'];
const FLAG_NAMES = ['USA','GBR','DEU','JPN','CHN','GRC','NOR','SGP','PAN','BHS','MHL','KOR','IND','NLD','HKG','DNK','BHR','TWN'];

const VESSEL_NAMES = [
  'MSC OSCAR','EVER GIVEN','MAERSK MCKINNEY','CMA CGM MARCO POLO','COSCO SHIPPING',
  'EMMA MAERSK','MSC GULSUN','OOCL HONG KONG','MEDITERRANEAN SHIPPING','HMM ALGECIRAS',
  'ATLANTIC VOYAGER','PACIFIC GLORY','NORDIC CROWN','OCEAN PIONEER','SEA EMPRESS',
  'GOLDEN GATE','LIBERTY BELL','NORTHERN LIGHT','SOUTHERN CROSS','EASTERN PROMISE',
  'CRISTOBAL COLON','VASCO DA GAMA','MARCO POLO II','HENRY HUDSON','JOHN CABOT',
  'STENA IMPERO','GRACE TANKER','DIANA BULKER','STELLAR BANDIT','NEPTUNE GLORY',
  'AMAZON STAR','NILE PRINCESS','GANGES SPIRIT','YANGTZE RIVER','THAMES TRADER',
  'CORAL PRINCESS','DIAMOND VENTURE','RUBY FORTUNE','SAPPHIRE SEAS','EMERALD ISLE',
  'TITAN CARRIER','ATLAS CARGO','ZEUS TANKER','POSEIDON BULK','APOLLO EXPRESS',
  'LEVIATHAN','BEHEMOTH','GOLIATH','COLOSSUS','BEHEMOTH II',
];

const PORTS = [
  'Shanghai, CN','Singapore, SG','Rotterdam, NL','Ningbo, CN','Guangzhou, CN',
  'Busan, KR','Hong Kong, HK','Qingdao, CN','Tianjin, CN','Port Klang, MY',
  'Antwerp, BE','Kaohsiung, TW','Dubai, AE','Los Angeles, US','Hamburg, DE',
  'Tanjung Pelepas, MY','Xiamen, CN','Laem Chabang, TH','New York, US','Colombo, LK',
  'Port Said, EG','Piraeus, GR','Valencia, ES','Algeciras, ES','Tokyo, JP',
  'Yokohama, JP','Osaka, JP','Kobe, JP','Mumbai, IN','Chennai, IN',
];

const NAV_STATUSES = [
  'Underway using engine',
  'Underway using engine',
  'Underway using engine',
  'Underway using engine',
  'At anchor',
  'Moored',
  'Restricted manoeuvrability',
  'Constrained by draught',
];

function rnd(arr: any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rndFloat(min: number, max: number) { return +(Math.random() * (max - min) + min).toFixed(1); }

function mmsi() { return String(rndInt(100000000, 799999999)); }
function imo()  { return 'IMO' + rndInt(1000000, 9999999); }
function callsign() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: 4 }, () => letters[rndInt(0, 25)]).join('') + rndInt(1, 9);
}

function etaString() {
  const d = new Date(Date.now() + rndInt(1, 20) * 86400_000);
  return d.toISOString().slice(0, 10) + ' ' + String(rndInt(0, 23)).padStart(2, '0') + ':00 UTC';
}

function buildShipPopup(name: string, vtype: typeof VESSEL_TYPES[0], flagIdx: number): string {
  const sog        = rndFloat(6, 21);
  const cog        = rndInt(0, 359);
  const hdg        = cog + rndInt(-5, 5);
  const draught    = rndFloat(5.5, 18.5);
  const length     = rndInt(120, 400);
  const width      = rndInt(20, 60);
  const status     = rnd(NAV_STATUSES);
  const origin     = rnd(PORTS);
  const dest       = rnd(PORTS);
  const eta        = etaString();
  const mmsiVal    = mmsi();
  const imoVal     = imo();
  const cs         = callsign();
  const dwt        = rndInt(20000, 220000);
  const flag       = FLAGS[flagIdx];
  const flagName   = FLAG_NAMES[flagIdx];
  const gross      = rndInt(10000, 230000);

  const isMoving   = status.startsWith('Underway');
  const statusClr  = isMoving ? '#2ae500' : '#f5c400';

  return `
    <div style="min-width:220px; font-family:monospace;">
      <!-- Header -->
      <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <i class="ti ${vtype.icon}" style="color:${vtype.color}; font-size:14px;"></i>
          <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="font-size:13px;">${flag}</span>
          <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${flagName} • ${vtype.type}</span>
        </div>
      </div>

      <!-- Status badge -->
      <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
        <div style="width:6px; height:6px; border-radius:50%; background:${statusClr}; animation:${isMoving ? 'pulse 2s infinite' : 'none'};"></div>
        <span style="color:${statusClr}; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">${status}</span>
      </div>

      <!-- Two-column grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">MMSI</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${mmsiVal}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">IMO</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${imoVal}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">CALLSIGN</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${cs}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em;">FLAG</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${flag} ${flagName}</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid var(--border); margin-bottom:8px;"></div>

      <!-- Navigation data -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">NAVIGATION</div>
      <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 8px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px;">SOG</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${sog} <span style="font-size:7px;">kn</span></div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">COG</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${cog}° <span style="font-size:7px;"></span></div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">HDG</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${hdg}°</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">DRAUGHT</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${draught} m</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">LENGTH</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${length} m</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">BEAM</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${width} m</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid var(--border); margin-bottom:8px;"></div>

      <!-- Vessel specs -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">VESSEL SPECS</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px;">GROSS TONNAGE</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${gross.toLocaleString()} GT</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">DWT</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${dwt.toLocaleString()} t</div>
        </div>
      </div>

      <!-- Divider -->
      <div style="border-top:1px solid var(--border); margin-bottom:8px;"></div>

      <!-- Voyage -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">VOYAGE</div>
      <div style="margin-bottom:4px;">
        <div style="color:var(--text3); font-size:7px;">FROM</div>
        <div style="color:var(--text); font-size:9px; font-weight:700;">📍 ${origin}</div>
      </div>
      <div style="margin-bottom:4px;">
        <div style="color:var(--text3); font-size:7px;">DESTINATION</div>
        <div style="color:var(--text2); font-size:9px; font-weight:700;">🚢 ${dest}</div>
      </div>
      <div>
        <div style="color:var(--text3); font-size:7px;">ETA</div>
        <div style="color:var(--yellow); font-size:9px; font-weight:700;">⏱ ${eta}</div>
      </div>
    </div>
  `;
}

export function initSimulated(map: any, L: any) {
  shipsGroup     = L.layerGroup();
  pipelinesGroup = L.layerGroup();
  // AIS vessel data and pipeline geometry require a server-side source. Keep
  // these layers empty instead of presenting fabricated positions.
  globalState.shipsCount = 0;

  return { shipsGroup, pipelinesGroup };
}
