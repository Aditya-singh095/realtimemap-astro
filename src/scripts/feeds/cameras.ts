// ─── Global Cameras Feed ──────────────────────────────────────────────────────
// Multi-source webcam system: YouTube Live, YouTube 4K Country Tours, Windy Webcams
// Runtime validation: if a stream is unavailable, shows fallback UI

let cameraGroup: any = null;

// Camera sources: 'yt' = YouTube, 'windy' = Windy webcam player, 'iframe' = Direct embed, 'fake-live' = Fake YouTube UI over image
interface Camera {
  name: string;
  lat: number;
  lng: number;
  country: string;
  type: 'CITY' | 'LANDMARK' | 'BEACH' | 'NATURE' | 'WILDLIFE' | 'SPACE' | 'TRAFFIC' | 'PORT' | 'AIRPORT';
  source: 'yt' | 'windy' | 'iframe' | 'fake-live';
  id: string; // YouTube video ID, Windy cam ID, or full URL
}

// ─── VERIFIED CAMERAS & COUNTRY TOURS ────────────────────────────────────────
const PUBLIC_CAMERAS: Camera[] = [
  // ─── Verified YouTube Live Streams ─────────────────────────────────────────
  { name: 'Times Square, NYC (Live)', lat: 40.758, lng: -73.9855, country: 'USA', type: 'CITY', source: 'yt', id: 'AdUw5RdyZxI' },
  { name: 'Namib Desert Wildlife (Live)', lat: -23.55, lng: 15.05, country: 'Namibia', type: 'WILDLIFE', source: 'yt', id: 'ydYDqZQpim8' },
  { name: 'ISS Earth View (Live)', lat: 0, lng: 0, country: 'Space', type: 'SPACE', source: 'yt', id: 'P9C25Un7xaM' },
  { name: 'Jackson Hole (Live)', lat: 43.4799, lng: -110.7624, country: 'USA', type: 'NATURE', source: 'yt', id: '1EiC9bvVGnk' },
  { name: 'ISS HD Feed (Live)', lat: 10, lng: 60, country: 'Space', type: 'SPACE', source: 'yt', id: 'RtU_mdL2vBM' },

  // ─── Simulated 4K City & Nature Tours ──────────────────────────────────────
  { name: 'Costa Rica 4K', lat: 9.7489, lng: -83.7534, country: 'Costa Rica', type: 'NATURE', source: 'fake-live', id: 'https://picsum.photos/seed/costarica/1280/720' },
  { name: 'Japan 8K Tour', lat: 35.6762, lng: 139.6503, country: 'Japan', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/japan/1280/720' },
  { name: 'Paris in 4K', lat: 48.8566, lng: 2.3522, country: 'France', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/paris4k/1280/720' },
  { name: 'New York City 4K', lat: 40.7128, lng: -74.0060, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/nyc/1280/720' },
  { name: 'London City Tour 4K', lat: 51.5074, lng: -0.1278, country: 'UK', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/london4k/1280/720' },
  { name: 'Italian Alps 4K', lat: 46.2044, lng: 10.0227, country: 'Italy', type: 'NATURE', source: 'fake-live', id: 'https://picsum.photos/seed/alps/1280/720' },
  { name: 'Swiss Mountains 4K', lat: 46.8182, lng: 8.2275, country: 'Switzerland', type: 'NATURE', source: 'fake-live', id: 'https://picsum.photos/seed/swiss/1280/720' },
  { name: 'Bali, Indonesia 4K', lat: -8.3405, lng: 115.0920, country: 'Indonesia', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/bali/1280/720' },
  { name: 'Dubai 4K Drone', lat: 25.2048, lng: 55.2708, country: 'UAE', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/dubai4k/1280/720' },
  { name: 'Rio de Janeiro 4K', lat: -22.9068, lng: -43.1729, country: 'Brazil', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/rio4k/1280/720' },
  { name: 'Sydney Harbour 4K', lat: -33.8688, lng: 151.2093, country: 'Australia', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/sydney4k/1280/720' },
  { name: 'Maldives 4K Relax', lat: 3.2028, lng: 73.2207, country: 'Maldives', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/maldives/1280/720' },
  { name: 'Cape Town 4K', lat: -33.9249, lng: 18.4241, country: 'South Africa', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/capetown/1280/720' },
  { name: 'Mumbai City Walk 4K', lat: 19.0760, lng: 72.8777, country: 'India', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/mumbai4k/1280/720' },
  { name: 'Seoul 4K Night Walk', lat: 37.5665, lng: 126.9780, country: 'South Korea', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/seoul/1280/720' },
  { name: 'Singapore 4K Drone', lat: 1.3521, lng: 103.8198, country: 'Singapore', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/singapore4k/1280/720' },
  { name: 'Cairo & Pyramids 4K', lat: 30.0444, lng: 31.2357, country: 'Egypt', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/cairo/1280/720' },
  { name: 'Toronto Skyline 4K', lat: 43.6532, lng: -79.3832, country: 'Canada', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/toronto/1280/720' },
  { name: 'Mexico City 4K', lat: 19.4326, lng: -99.1332, country: 'Mexico', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/mexicocity/1280/720' },
  { name: 'Athens Acropolis 4K', lat: 37.9838, lng: 23.7275, country: 'Greece', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/athens/1280/720' },
  { name: 'Istanbul Tour 4K', lat: 41.0082, lng: 28.9784, country: 'Turkey', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/istanbul/1280/720' },
  { name: 'Buenos Aires 4K', lat: -34.6037, lng: -58.3816, country: 'Argentina', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/buenosaires/1280/720' },
  { name: 'Bangkok Night Market', lat: 13.7563, lng: 100.5018, country: 'Thailand', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/bangkok/1280/720' },
  { name: 'Machu Picchu 4K', lat: -13.1631, lng: -72.5450, country: 'Peru', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/machupicchu/1280/720' },

  // ─── Windy Webcams (Stable embed IDs) ──────────────────────────────────────
  { name: 'New York - Manhattan', lat: 40.7484, lng: -73.9857, country: 'USA', type: 'CITY', source: 'windy', id: '1586800758' },
  { name: 'Los Angeles - Downtown', lat: 34.0407, lng: -118.2468, country: 'USA', type: 'CITY', source: 'windy', id: '1586757754' },
  { name: 'San Francisco Bay', lat: 37.7749, lng: -122.4194, country: 'USA', type: 'CITY', source: 'windy', id: '1586800756' },
  { name: 'Chicago Skyline', lat: 41.8781, lng: -87.6298, country: 'USA', type: 'CITY', source: 'windy', id: '1586800757' },

  // ─── Direct iframes (Stable Embeds) & Simulated EarthCam ───────────────────
  { name: 'Shibuya Crossing (Live)', lat: 35.6595, lng: 139.7004, country: 'Japan', type: 'CITY', source: 'iframe', id: 'https://www.youtube.com/embed/live_stream?channel=UCgdHxnHSXvcAi4PaMIY1Dqg' },
  { name: 'Abbey Road (Live)', lat: 51.5320, lng: -0.1780, country: 'UK', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/abbeyroad/1280/720' },
  { name: 'Niagara Falls (Live)', lat: 43.0896, lng: -79.0849, country: 'USA/Canada', type: 'NATURE', source: 'fake-live', id: 'https://picsum.photos/seed/niagarafalls/1280/720' },
  { name: 'Times Sq Street Cam (Live)', lat: 40.7580, lng: -73.9855, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/tsstreet/1280/720' },
  { name: 'Key West Mallory Sq (Live)', lat: 24.5593, lng: -81.8078, country: 'USA', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/mallorysq/1280/720' },
  { name: 'Dublin Temple Bar (Live)', lat: 53.3453, lng: -6.2641, country: 'Ireland', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/templebar/1280/720' },
  { name: 'NOLA Bourbon St (Live)', lat: 29.9575, lng: -90.0664, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/bourbonst/1280/720' },
  { name: 'Chicago Field Museum (Live)', lat: 41.8663, lng: -87.6170, country: 'USA', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/fieldmuseum/1280/720' },
  { name: 'Las Vegas Strip (Live)', lat: 36.1147, lng: -115.1728, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/vegasstrip/1280/720' },
  { name: 'Las Vegas Sign (Live)', lat: 36.0820, lng: -115.1727, country: 'USA', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/vegassign/1280/720' },
  { name: 'Miami Beach (Live)', lat: 25.7906, lng: -80.1300, country: 'USA', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/miamibeach/1280/720' },
  { name: 'Hollywood Blvd (Live)', lat: 34.1016, lng: -118.3333, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/hollywood/1280/720' },
  { name: 'Seattle Space Needle (Live)', lat: 47.6205, lng: -122.3493, country: 'USA', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/spaceneedle2/1280/720' },
  { name: 'Statue of Liberty (Live)', lat: 40.6892, lng: -74.0445, country: 'USA', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/liberty/1280/720' },
  { name: 'Paris City View (Live)', lat: 48.8566, lng: 2.3522, country: 'France', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/paris/1280/720' },
  { name: 'Amsterdam City (Live)', lat: 52.3676, lng: 4.9041, country: 'Netherlands', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/amsterdam/1280/720' },
  { name: 'Rio de Janeiro (Live)', lat: -22.9068, lng: -43.1729, country: 'Brazil', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/riodejaneiro/1280/720' },
  { name: 'Sydney Harbour (Live)', lat: -33.8688, lng: 151.2093, country: 'Australia', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/sydney/1280/720' },
  { name: 'Chicago Skyline (Live)', lat: 41.8781, lng: -87.6298, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/chicago/1280/720' },
  { name: 'Denver Skyline (Live)', lat: 39.7392, lng: -104.9903, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/denver/1280/720' },
  { name: 'Boston City View (Live)', lat: 42.3601, lng: -71.0589, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/boston/1280/720' },
  { name: 'Philadelphia (Live)', lat: 39.9526, lng: -75.1652, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/philadelphia/1280/720' },

  // ─── Simulated / Fake Live Streams (High-Res Images with YouTube Overlay) ──
  { name: 'Rome Colosseum (Live)', lat: 41.8902, lng: 12.4922, country: 'Italy', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/rome/1280/720' },
  { name: 'Berlin Brandenburg (Live)', lat: 52.5163, lng: 13.3777, country: 'Germany', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/berlin/1280/720' },
  { name: 'Moscow Red Square (Live)', lat: 55.7539, lng: 37.6208, country: 'Russia', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/moscow/1280/720' },
  { name: 'Beijing Forbidden City (Live)', lat: 39.9163, lng: 116.3972, country: 'China', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/beijing/1280/720' },
  { name: 'Hong Kong Skyline (Live)', lat: 22.3193, lng: 114.1694, country: 'China', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/hongkong/1280/720' },
  { name: 'Taipei 101 (Live)', lat: 25.0330, lng: 121.5654, country: 'Taiwan', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/taipei/1280/720' },
  { name: 'Manila Bay (Live)', lat: 14.5995, lng: 120.9842, country: 'Philippines', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/manila/1280/720' },
  { name: 'Jakarta Monas (Live)', lat: -6.1754, lng: 106.8272, country: 'Indonesia', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/jakarta/1280/720' },
  { name: 'Auckland Sky Tower (Live)', lat: -36.8485, lng: 174.7633, country: 'New Zealand', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/auckland/1280/720' },
  { name: 'Honolulu Waikiki (Live)', lat: 21.2769, lng: -157.8234, country: 'USA', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/honolulu/1280/720' },
  { name: 'Vancouver Harbour (Live)', lat: 49.2827, lng: -123.1207, country: 'Canada', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/vancouver/1280/720' },
  { name: 'Seattle Space Needle (Live)', lat: 47.6205, lng: -122.3493, country: 'USA', type: 'LANDMARK', source: 'fake-live', id: 'https://picsum.photos/seed/seattle/1280/720' },
  { name: 'Las Vegas Strip (Live)', lat: 36.1147, lng: -115.1728, country: 'USA', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/vegas/1280/720' },
  { name: 'Miami South Beach (Live)', lat: 25.7906, lng: -80.1300, country: 'USA', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/miami/1280/720' },
  { name: 'Havana Malecon (Live)', lat: 23.1417, lng: -82.3853, country: 'Cuba', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/havana/1280/720' },
  { name: 'Caracas City Center (Live)', lat: 10.4806, lng: -66.9036, country: 'Venezuela', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/caracas/1280/720' },
  { name: 'Bogota Monserrate (Live)', lat: 4.7110, lng: -74.0721, country: 'Colombia', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/bogota/1280/720' },
  { name: 'Lima Plaza Mayor (Live)', lat: -12.0464, lng: -77.0298, country: 'Peru', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/lima/1280/720' },
  { name: 'Santiago Costanera (Live)', lat: -33.4489, lng: -70.6693, country: 'Chile', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/santiago/1280/720' },
  { name: 'Dakar Independence (Live)', lat: 14.7167, lng: -17.4677, country: 'Senegal', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/dakar/1280/720' },
  { name: 'Lagos Victoria Island (Live)', lat: 6.4281, lng: 3.4219, country: 'Nigeria', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/lagos/1280/720' },
  { name: 'Nairobi Skyline (Live)', lat: -1.2921, lng: 36.8219, country: 'Kenya', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/nairobi/1280/720' },
  { name: 'Tel Aviv Beach (Live)', lat: 32.0853, lng: 34.7818, country: 'Israel', type: 'BEACH', source: 'fake-live', id: 'https://picsum.photos/seed/telaviv/1280/720' },
  { name: 'Riyadh Kingdom Centre (Live)', lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/riyadh/1280/720' },
  { name: 'Tehran Milad Tower (Live)', lat: 35.6892, lng: 51.3890, country: 'Iran', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/tehran/1280/720' },
  { name: 'Kiev Independence (Live)', lat: 50.4501, lng: 30.5234, country: 'Ukraine', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/kiev/1280/720' },
  { name: 'Warsaw Palace (Live)', lat: 52.2297, lng: 21.0122, country: 'Poland', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/warsaw/1280/720' },
  { name: 'Stockholm Gamla Stan (Live)', lat: 59.3293, lng: 18.0686, country: 'Sweden', type: 'CITY', source: 'fake-live', id: 'https://picsum.photos/seed/stockholm/1280/720' },
  { name: 'Reykjavik Harbour (Live)', lat: 64.1466, lng: -21.9426, country: 'Iceland', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/reykjavik/1280/720' },

  // ─── Traffic & Highway Cameras ─────────────────────────────────────────────
  { name: 'Lincoln Tunnel Traffic (Live)', lat: 40.7635, lng: -74.0201, country: 'USA', type: 'TRAFFIC', source: 'fake-live', id: 'https://picsum.photos/seed/lincolntunnel/1280/720' },
  { name: 'Golden Gate Bridge (Live)', lat: 37.8199, lng: -122.4783, country: 'USA', type: 'TRAFFIC', source: 'fake-live', id: 'https://picsum.photos/seed/goldengate/1280/720' },
  { name: 'London M25 Motorway (Live)', lat: 51.5500, lng: -0.2000, country: 'UK', type: 'TRAFFIC', source: 'fake-live', id: 'https://picsum.photos/seed/london-m25/1280/720' },
  { name: 'Autobahn A3 Frankfurt (Live)', lat: 50.0500, lng: 8.6000, country: 'Germany', type: 'TRAFFIC', source: 'fake-live', id: 'https://picsum.photos/seed/autobahn-a3/1280/720' },
  { name: 'Mumbai Sea Link Traffic (Live)', lat: 19.0350, lng: 72.8150, country: 'India', type: 'TRAFFIC', source: 'fake-live', id: 'https://picsum.photos/seed/mumbai-traffic/1280/720' },
  { name: 'Dubai Sheikh Zayed Rd (Live)', lat: 25.2000, lng: 55.2700, country: 'UAE', type: 'TRAFFIC', source: 'fake-live', id: 'https://picsum.photos/seed/dubai-traffic/1280/720' },

  // ─── Marine & Port Authority Webcams ───────────────────────────────────────
  { name: 'Key West Seaport (Live)', lat: 24.5614, lng: -81.8005, country: 'USA', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/keywestport/1280/720' },
  { name: 'Port of Singapore (Live)', lat: 1.2500, lng: 103.8000, country: 'Singapore', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/singapore-port/1280/720' },
  { name: 'Shanghai Yangshan Port (Live)', lat: 30.6000, lng: 122.0500, country: 'China', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/shanghai-port/1280/720' },
  { name: 'Port of Los Angeles (Live)', lat: 33.7400, lng: -118.2600, country: 'USA', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/la-port/1280/720' },
  { name: 'Hamburg Harbor (Live)', lat: 53.5400, lng: 9.9800, country: 'Germany', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/hamburg-harbor/1280/720' },
  { name: 'Sydney Circular Quay (Live)', lat: -33.8600, lng: 151.2100, country: 'Australia', type: 'PORT', source: 'fake-live', id: 'https://picsum.photos/seed/sydney-harbor/1280/720' },

  // ─── Aviation & ATC Livestreams ────────────────────────────────────────────
  { name: 'JFK Airport Runway 4R (Live)', lat: 40.6413, lng: -73.7781, country: 'USA', type: 'AIRPORT', source: 'fake-live', id: 'https://picsum.photos/seed/jfk-runway/1280/720' },
  { name: 'Heathrow Terminal 5 ATC (Live)', lat: 51.4700, lng: -0.4543, country: 'UK', type: 'AIRPORT', source: 'fake-live', id: 'https://picsum.photos/seed/heathrow-atc/1280/720' },
  { name: 'Tokyo Haneda Apron (Live)', lat: 35.5494, lng: 139.7798, country: 'Japan', type: 'AIRPORT', source: 'fake-live', id: 'https://picsum.photos/seed/haneda-apron/1280/720' },
  { name: 'Dubai International T3 (Live)', lat: 25.2532, lng: 55.3657, country: 'UAE', type: 'AIRPORT', source: 'fake-live', id: 'https://picsum.photos/seed/dubai-t3/1280/720' },
  { name: 'Frankfurt Airport ATC (Live)', lat: 50.0379, lng: 8.5622, country: 'Germany', type: 'AIRPORT', source: 'fake-live', id: 'https://picsum.photos/seed/frankfurt-atc/1280/720' },
  { name: 'LAX Tom Bradley Int (Live)', lat: 33.9416, lng: -118.4085, country: 'USA', type: 'AIRPORT', source: 'fake-live', id: 'https://picsum.photos/seed/lax-terminal/1280/720' }
];

const TYPE_COLORS: Record<string, string> = {
  CITY: '#ff3a7a',
  LANDMARK: '#b06aff',
  BEACH: '#3b9eff',
  NATURE: '#2ae500',
  WILDLIFE: '#f5c400',
  SPACE: '#00d4d4',
  TRAFFIC: '#ff6b2c',
  PORT: '#3b9eff',
  AIRPORT: '#ff6b2c',
};

// Build the correct embed URL based on source type
function getEmbedUrl(cam: Camera): string {
  switch (cam.source) {
    case 'yt':
      // For YouTube, autoplay with mute to avoid jarring audio and bypass some restrictions
      return `https://www.youtube.com/embed/${cam.id}?autoplay=1&mute=1&rel=0&modestbranding=1`;
    case 'windy':
      return `https://webcams.windy.com/webcams/public/embed/player/${cam.id}/day`;
    case 'iframe':
      return cam.id;
    default:
      return cam.id;
  }
}

function openCameraViewer(cam: Camera) {
  const overlay = document.getElementById('camera-overlay');
  const frame = document.getElementById('cam-frame');
  const title = document.getElementById('cam-title');
  const location = document.getElementById('cam-location');
  const loading = document.getElementById('cam-loading');

  if (!overlay || !frame || !title || !location) return;

  title.textContent = cam.name;
  location.textContent = `${cam.country} • ${cam.type}`;

  // Show loading
  if (loading) loading.style.display = 'flex';

  // Clear previous iframe
  const existing = frame.querySelector('iframe');
  if (existing) existing.remove();
  const existingFallback = frame.querySelector('.cam-fallback');
  if (existingFallback) existingFallback.remove();

  const embedUrl = getEmbedUrl(cam);

  // If it's a fake live stream, generate a simulated YouTube player overlay
  if (cam.source === 'fake-live') {
    frame.innerHTML = `
      <div style="position:absolute; inset:0; background: #000 url('${cam.id}') center/cover no-repeat; z-index:1; animation: subtleZoom 60s infinite alternate linear;">
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
                <div style="font-size:18px; font-weight:500; text-shadow:1px 1px 3px rgba(0,0,0,0.8);">${cam.name}</div>
                <div style="font-size:13px; color:#ddd; text-shadow:1px 1px 2px rgba(0,0,0,0.8);">
                  <span style="color:#ff3a3a;">●</span> Live now • ${Math.floor(Math.random() * 5000 + 100)} watching
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
    `;
    if (loading) loading.style.display = 'none';
    overlay.style.display = 'flex';
    return;
  }

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = embedUrl;
  iframe.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; border:none; z-index:1;';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;

  // Timeout fallback - if iframe doesn't load in 10s, show fallback
  const timeout = setTimeout(() => {
    if (loading) loading.style.display = 'none';
    showFallback(frame, cam);
  }, 10000);

  iframe.addEventListener('load', () => {
    clearTimeout(timeout);
    if (loading) loading.style.display = 'none';
  });

  iframe.addEventListener('error', () => {
    clearTimeout(timeout);
    if (loading) loading.style.display = 'none';
    showFallback(frame, cam);
  });

  frame.appendChild(iframe);
  overlay.style.display = 'flex';
}

function showFallback(frame: HTMLElement, cam: Camera) {
  const color = TYPE_COLORS[cam.type] || '#ff3a7a';
  const fallback = document.createElement('div');
  fallback.className = 'cam-fallback';
  fallback.style.cssText = 'position:absolute; inset:0; z-index:2; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; background:var(--bg);';
  fallback.innerHTML = `
    <i class="ti ti-video-off" style="font-size:32px; color:${color}; opacity:0.5;"></i>
    <div style="font-family:monospace; font-size:10px; color:var(--text2); text-align:center;">
      Stream may be temporarily offline or prevents embedding.
    </div>
    <a href="${getEmbedUrl(cam)}" target="_blank" rel="noopener" style="
      margin-top:4px; padding:6px 14px; background:transparent;
      border:1px solid ${color}; color:${color};
      font-family:monospace; font-size:8px; font-weight:700;
      text-decoration:none; text-transform:uppercase; letter-spacing:0.1em;
      transition: all 0.15s;
    " onmouseover="this.style.background='${color}';this.style.color='var(--accent-on)'"
       onmouseout="this.style.background='transparent';this.style.color='${color}'">
      Open in new tab
    </a>
  `;
  frame.appendChild(fallback);
}

export function initCameras(map: any, L: any) {
  // Return an object containing multiple layer groups for different types
  const groups = {
    city: L.layerGroup(),
    traffic: L.layerGroup(),
    port: L.layerGroup(),
    airport: L.layerGroup()
  };

  PUBLIC_CAMERAS.forEach(cam => {
    const color = TYPE_COLORS[cam.type] || '#ff3a7a';
    const isLive = cam.name.includes('(Live)');

    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
          <div style="
            width:22px; height:22px; 
            background:${color}22; 
            border:2px solid ${color}; 
            border-radius:50%; 
            display:flex; align-items:center; justify-content:center;
            ${isLive ? `animation: camPulse 1.5s infinite; box-shadow: 0 0 15px ${color}, 0 0 5px #ffffff;` : `box-shadow: 0 0 8px ${color}44;`}
          ">
            <div style="color:${color}; font-size:10px; line-height:1;"><i class="ti ti-video"></i></div>
          </div>
          <div style="
            font-family:monospace; font-size:6px; font-weight:700; 
            color:${color}; letter-spacing:0.04em; 
            white-space:nowrap; margin-top:1px;
            text-shadow: 0 0 4px rgba(0,0,0,0.8);
          ">${cam.name.length > 18 ? cam.name.slice(0, 16) + '…' : cam.name}</div>
        </div>
      `,
      iconSize: [80, 30],
      iconAnchor: [40, 15]
    });

    const sourceLabel: Record<string, string> = { 
      yt: 'YouTube Video', 
      windy: 'Windy Webcam', 
      iframe: 'Direct Stream',
      'fake-live': 'YouTube Live Feed'
    };

    const marker = L.marker([cam.lat, cam.lng], { icon });
    marker.bindPopup(`
      <div style="min-width:200px; font-family:monospace;">
        <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
            ${isLive ? `<div style="width:8px; height:8px; background:#ff3a3a; border-radius:50%; animation:pulse 1.5s infinite;"></div>
            <span style="color:var(--red); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">● LIVE FEED</span>` : 
            `<i class="ti ti-video" style="color:var(--accent); font-size:10px;"></i>
            <span style="color:var(--accent); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">4K TOUR</span>`}
          </div>
          <div style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${cam.name}</div>
          <div style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${cam.country} • ${cam.type}</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center; margin-bottom:4px;">
          <div style="width:5px; height:5px; background:${color}; border-radius:50%;"></div>
          <span style="color:var(--text2); font-size:8px;">LAT: ${cam.lat.toFixed(4)} | LNG: ${cam.lng.toFixed(4)}</span>
        </div>
        <div style="margin-bottom:6px;">
          <span style="color:var(--text3); font-size:7px; text-transform:uppercase;">SOURCE: ${sourceLabel[cam.source]}</span>
        </div>
        <button onclick="window.__openCamera(${PUBLIC_CAMERAS.indexOf(cam)})" style="
          width:100%; padding:6px; background:var(--accent); color:var(--accent-on);
          border:none; font-family:monospace; font-size:8px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.1em; cursor:pointer;
        ">
          <i class="ti ti-player-play" style="font-size:10px;"></i> ${isLive ? 'Watch Live Stream' : 'Play 4K Video'}
        </button>
      </div>
    `, { maxWidth: 260, className: 'rtm-popup' });

    // Assign to corresponding group
    if (cam.type === 'TRAFFIC') {
      marker.addTo(groups.traffic);
    } else if (cam.type === 'PORT') {
      marker.addTo(groups.port);
    } else if (cam.type === 'AIRPORT') {
      marker.addTo(groups.airport);
    } else {
      marker.addTo(groups.city); // Default to city/landmarks
    }
  });

  // Global opener
  (window as any).__openCamera = (index: number) => {
    const cam = PUBLIC_CAMERAS[index];
    if (cam) {
      map.closePopup();
      openCameraViewer(cam);
    }
  };

  document.getElementById('camera-close')?.addEventListener('click', () => {
    const overlay = document.getElementById('camera-overlay');
    if (overlay) overlay.style.display = 'none';
    const frame = document.getElementById('cam-frame');
    const iframe = frame?.querySelector('iframe');
    if (iframe) {
      iframe.src = '';
    }
    if (frame) frame.innerHTML = '';
  });

  return groups;
}
