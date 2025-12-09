// Data configuration
const hotspots = [
  {
    id: 'bartels',
    name: 'Bartels Hall Loop',
    tags: ['boathouse', 'event'],
    desc: 'Easy pull-over by the gym; great for lift days.',
    coords: [42.44579, -76.47658],
  },
  {
    id: 'teagle',
    name: 'Teagle / Helen Newman',
    tags: ['event'],
    desc: 'Central for film review, meetings, or erg work.',
    coords: [42.4458, -76.4791],
  },
  {
    id: 'rpcc',
    name: 'North Campus (RPCC loop)',
    tags: ['boathouse', 'flexible'],
    desc: 'Freshman-heavy pickup spot; fast in early mornings.',
    coords: [42.4561, -76.4774],
  },
  {
    id: 'noyes',
    name: 'West Campus (Noyes loop)',
    tags: ['boathouse', 'flexible'],
    desc: 'Quick access to Stewart Ave and Route 13 south.',
    coords: [42.4465, -76.4867],
  },
  {
    id: 'collegetown',
    name: 'Collegetown - Schwartz Center',
    tags: ['flexible'],
    desc: 'For anyone near CTown eateries; watch for traffic.',
    coords: [42.4427, -76.4862],
  },
  {
    id: 'statler',
    name: 'Ho Plaza / Statler',
    tags: ['event'],
    desc: 'Central quad pickup; close to Sage Hall and Uris.',
    coords: [42.446, -76.482],
  },
  {
    id: 'engquad',
    name: 'Engineering Quad',
    tags: ['flexible'],
    desc: 'Duffield/Phillips area; easy for evening labs.',
    coords: [42.4448, -76.4837],
  },
  {
    id: 'parking',
    name: 'B-Lot / Parking Garage',
    tags: ['boathouse', 'flexible'],
    desc: 'Good when drivers already staged with vehicles.',
    coords: [42.443, -76.4826],
  },
];

const destinations = [
  {
    id: 'boathouse',
    name: 'Cornell Collyer Boathouse (685 3rd St)',
    type: 'boathouse',
    note: 'Primary practice site on Cayuga Inlet • 685 3rd St, Ithaca, NY 14850.',
    coords: [42.4469, -76.5111],
  },
  {
    id: 'teagle',
    name: 'Teagle Fitness Center',
    type: 'event',
    note: 'Strength/erg/film blocks at Teagle • 512 Campus Rd, Ithaca, NY 14853.',
    coords: [42.4458, -76.4791],
  },
];

const rideListEl = document.getElementById('rideList');
const hotspotGridEl = document.getElementById('hotspotGrid');
const pickupSelect = document.getElementById('pickupHotspot');
const destinationSelect = document.getElementById('destination');
const filterDestination = document.getElementById('filterDestination');
const form = document.getElementById('rideForm');
const departureDaySelect = document.getElementById('departureDay');
const departureTimeInput = document.getElementById('departureTime');
const driverCodeInput = document.getElementById('driverCode');
const requestForm = document.getElementById('requestForm');
const requestPickup = document.getElementById('reqPickup');
const requestDestination = document.getElementById('reqDestination');
const requestCustomWrap = document.getElementById('customPickupWrap');
const requestCustom = document.getElementById('reqCustom');
const requestList = document.getElementById('requestList');
const requestDay = document.getElementById('reqDay');
const requestTimePlain = document.getElementById('reqTimePlain');
const upcomingList = document.getElementById('upcomingList');
const upcomingStatus = document.getElementById('upcomingStatus');
const upcomingEmbedWrap = document.getElementById('upcomingEmbedWrap');
const upcomingEmbed = document.getElementById('upcomingEmbed');

const STORAGE_KEY = 'clwr-carpool-rides';
const REQUEST_KEY = 'clwr-carpool-requests';
const CALENDAR_ICS_URL =
  'https://calendar.google.com/calendar/ical/Y18xOGI1M2ZjNWE5ZDU5ZTE2NzVkM2M0MmVmZTBmYmEzZTVkNDg2ODM5NDI3ZjQyYWY0YTBkZDVjNDYzODYzMmViQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20/public/basic.ics';
const CALENDAR_EMBED_URL =
  'https://calendar.google.com/calendar/embed?src=c_18b53fc5a9d59e1675d3c42efe0fba3e5d486839427f42af4a0dd5c4638632eb%40group.calendar.google.com&ctz=America%2FNew_York';
const CALENDAR_TIMEOUT_MS = 8000;
const MAP_TIMEOUT_MS = 8000;
const LEAFLET_JS_SRCS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js',
];
const LEAFLET_CSS_SRCS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
];

const nextTime = (hour, minute) => {
  const now = new Date();
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  if (d < now) d.setDate(d.getDate() + 1);
  return d.toISOString();
};

const defaultRides = [
  {
    id: 'seed-1',
    driver: 'Rahil Dundon',
    contact: '917-555-0141',
    hotspotId: 'noyes',
    destinationId: 'boathouse',
    departure: nextTime(5, 30),
    seats: 3,
    vehicle: 'Forester hatchback',
    notes: 'Room for 3 oars; text when outside.',
    passengers: [{ name: 'Calder Fritz' }],
    requests: [],
    driverCode: '1111',
  },
  {
    id: 'seed-2',
    driver: 'Steven Busby',
    contact: '203-555-0172',
    hotspotId: 'bartels',
    destinationId: 'teagle',
    departure: nextTime(15, 45),
    seats: 2,
    vehicle: 'Sedan',
    notes: 'Drop at Bartels side door.',
    passengers: [{ name: 'Sebastian El Hadj' }],
    requests: [],
    driverCode: '2222',
  },
  {
    id: 'seed-3',
    driver: 'Amanda Johnson',
    contact: '607-555-0202',
    hotspotId: 'rpcc',
    destinationId: 'boathouse',
    departure: nextTime(18, 15),
    seats: 4,
    vehicle: 'Van',
    notes: 'North loop pickup, no roof racks today.',
    passengers: [],
    requests: [],
    driverCode: '3333',
  },
];

const loadRides = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultRides;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultRides;
  } catch (err) {
    console.error('Failed to parse rides; resetting to defaults.', err);
    return defaultRides;
  }
};

let rides = loadRides();
let requests = [];

const loadRequests = () => {
  const raw = localStorage.getItem(REQUEST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

requests = loadRequests();

const saveRides = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
};

const saveRequests = () => {
  localStorage.setItem(REQUEST_KEY, JSON.stringify(requests));
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString([], {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const tagToPill = (tag) => {
  if (tag === 'boathouse') return 'pill boathouse';
  if (tag === 'event') return 'pill event';
  return 'pill flexible';
};

const buildDateTime = (day, time) => {
  const now = new Date();
  const d = new Date();
  if (day === 'tomorrow') d.setDate(now.getDate() + 1);
  const [hour, minute] = time.split(':').map(Number);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

let map;
let markerLayer;
let mapStatusEl = null;
let mapTimeout;

const loadLeafletCss = () => {
  if (document.getElementById('leaflet-css')) return;
  const link = document.createElement('link');
  link.id = 'leaflet-css';
  link.rel = 'stylesheet';
  link.href = LEAFLET_CSS_SRCS[0];
  document.head.appendChild(link);
};

const loadLeaflet = (idx = 0) =>
  new Promise((resolve, reject) => {
    if (window.L) {
      resolve();
      return;
    }
    if (idx >= LEAFLET_JS_SRCS.length) {
      reject(new Error('Leaflet JS failed to load from all CDNs.'));
      return;
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS_SRCS[idx];
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      loadLeaflet(idx + 1).then(resolve).catch(reject);
    };
    document.head.appendChild(script);
  });

const ensureLeaflet = async () => {
  loadLeafletCss();
  if (window.L) return;
  return loadLeaflet();
};

const initMap = () => {
  mapStatusEl = document.getElementById('mapStatus');
  if (!window.L) {
    if (mapStatusEl) mapStatusEl.textContent = 'Map library failed to load. Check your connection.';
    return;
  }
  const center = [42.4467, -76.4830];
  map = L.map('map').setView(center, 14.4);

  mapTimeout = setTimeout(() => {
    if (mapStatusEl) {
      mapStatusEl.textContent = 'Map tiles are taking a while. Check your connection or allow basemaps.cartocdn.com.';
    }
  }, MAP_TIMEOUT_MS);

  const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution:
      '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  });

  tiles.on('load', () => {
    if (mapTimeout) clearTimeout(mapTimeout);
    if (mapStatusEl) mapStatusEl.style.display = 'none';
  });
  tiles.on('tileerror', () => {
    if (mapTimeout) clearTimeout(mapTimeout);
    if (mapStatusEl) mapStatusEl.textContent = 'Map tiles failed to load (offline?). Try reconnecting or allow basemaps.cartocdn.com.';
  });

  tiles.addTo(map);

  markerLayer = L.layerGroup().addTo(map);
  renderMapMarkers();
};

const renderMapMarkers = () => {
  if (!markerLayer) return;
  markerLayer.clearLayers();
  const bounds = [];

  const addCircle = (coords, color, title, body) => {
    if (!coords) return;
    const circle = L.circleMarker(coords, {
      radius: 10,
      color,
      weight: 2,
      fillColor: color,
      fillOpacity: 0.15,
      title,
    }).addTo(markerLayer);
    circle.bindPopup(`<strong>${title}</strong><br>${body}`);
    bounds.push(coords);
  };

  hotspots
    .filter((h) => ['rpcc', 'bartels'].includes(h.id))
    .forEach((h) => addCircle(h.coords, '#b31b1b', h.name, h.desc));

  destinations
    .filter((d) => ['boathouse', 'teagle'].includes(d.id))
    .forEach((d) => addCircle(d.coords, '#2563eb', d.name, d.note));

  if (bounds.length && map) {
    map.fitBounds(bounds, { padding: [20, 20] });
  }
};

const renderHotspots = () => {
  if (!hotspotGridEl) return;
  hotspotGridEl.innerHTML = hotspots
    .map(
      (h) => `
      <div class="hotspot">
        <div class="hotspot__title">
          <h4>${h.name}</h4>
          <div class="tags">
            ${h.tags
              .map((t) => `<span class="${tagToPill(t)}">${t}</span>`)
              .join('')}
          </div>
        </div>
        <p class="subtle">${h.desc}</p>
      </div>
    `,
    )
    .join('');
};

const renderSelects = () => {
  pickupSelect.innerHTML = hotspots
    .map((h) => `<option value="${h.id}">${h.name}</option>`)
    .join('');

  destinationSelect.innerHTML = destinations
    .map((d) => `<option value="${d.id}">${d.name}</option>`)
    .join('');

  filterDestination.innerHTML = `
    <option value="all">All</option>
    ${destinations.map((d) => `<option value="${d.id}">${d.name}</option>`).join('')}
  `;
};

const renderRides = () => {
  const filter = filterDestination.value;
  const visible = rides
    .filter((r) => (filter === 'all' ? true : r.destinationId === filter))
    .sort((a, b) => new Date(a.departure) - new Date(b.departure));

  if (!visible.length) {
    rideListEl.innerHTML =
      '<p class="subtle">No rides posted yet. Offer one above to get started.</p>';
    return;
  }

  rideListEl.innerHTML = visible
    .map((r) => {
      const hotspot = hotspots.find((h) => h.id === r.hotspotId);
      const dest = destinations.find((d) => d.id === r.destinationId);
      const tagClass = dest ? tagToPill(dest.type) : 'pill flexible';
      const seatsLeft = Math.max(r.seats - (r.passengers?.length || 0), 0);
      const passengerList = r.passengers && r.passengers.length
        ? r.passengers.map((p) => p.name).join(', ')
        : 'No passengers yet';

      return `
        <article class="ride" data-ride="${r.id}">
          <div class="ride__header">
            <h3>${dest?.name || 'Destination'}</h3>
            <span class="${tagClass}">${dest?.type || 'flexible'}</span>
            <span class="pill">Seats left: ${seatsLeft}</span>
          </div>
          <div class="meta">
            <span><strong>Driver:</strong> ${r.driver} • ${r.contact}</span>
            <span><strong>Pickup:</strong> ${hotspot?.name || 'Hotspot'} • <strong>Departs:</strong> ${formatTime(r.departure)}</span>
            <span><strong>Vehicle:</strong> ${r.vehicle || 'Not specified'}</span>
            <span class="subtle">${r.notes || ''}</span>
          </div>
          <div class="ride__footer">
            <div class="passengers">
              <strong>Passengers</strong>
              <span>${passengerList}</span>
            </div>
            <form class="join join-form" data-ride="${r.id}">
              <input type="text" name="passenger" placeholder="Your name" required>
              <button class="btn primary" type="submit" ${seatsLeft === 0 ? 'disabled' : ''}>
                ${seatsLeft === 0 ? 'Full' : 'Join'}
              </button>
            </form>
          </div>
        </article>
      `;
    })
    .join('');
};

const renderRequests = () => {
  if (!requestList) return;
  const open = requests.filter((req) => !req.assignedRideId);
  if (!open.length) {
    requestList.innerHTML = '<p class="subtle">No pending custom requests.</p>';
    return;
  }

  requestList.innerHTML = open
    .map(
      (req) => `
      <div class="request-card" data-request="${req.id}">
        <div><strong>${req.name}</strong> • ${req.contact}</div>
        <div>${req.pickupLabel} → ${req.destinationLabel}</div>
        <div class="subtle">${formatTime(req.time)}</div>
        <div class="subtle">${req.details || ''}</div>
        <div class="subtle">Any driver may accept this request.</div>
      </div>
    `,
    )
    .join('');
};

const resetForm = () => {
  form.reset();
  document.getElementById('seats').value = 3;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const driver = document.getElementById('driverName').value.trim();
  const contact = document.getElementById('driverContact').value.trim();
  const hotspotId = pickupSelect.value;
  const destinationId = destinationSelect.value;
  const day = departureDaySelect.value;
  const time = departureTimeInput.value;
  const seats = Number(document.getElementById('seats').value) || 1;
  const vehicle = document.getElementById('vehicle').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const driverCode = driverCodeInput.value.trim();

  if (!driver || !contact || !day || !time || !driverCode) return;

  const departure = buildDateTime(day, time);

  const newRide = {
    id: `ride-${Date.now()}`,
    driver,
    contact,
    hotspotId,
    destinationId,
    departure,
    seats,
    vehicle,
    notes,
    passengers: [],
    requests: [],
    driverCode,
  };

  rides.push(newRide);
  saveRides();
  renderRides();
  resetForm();
  renderSelects();
});

const claimRequestForRide = (rideId, reqId) => {
  const ride = rides.find((r) => r.id === rideId);
  const reqIndex = requests.findIndex((r) => r.id === reqId && !r.assignedRideId);
  if (!ride || reqIndex === -1) return;

  const seatsLeft = Math.max(ride.seats - (ride.passengers?.length || 0), 0);
  if (seatsLeft <= 0) {
    alert('This ride is full; cannot accept another request.');
    return;
  }

  const entered = window.prompt('Driver approval code:');
  if (!entered || entered.trim() !== (ride.driverCode || '').trim()) {
    alert('Approval code incorrect.');
    return;
  }

  const req = requests[reqIndex];
  ride.passengers = ride.passengers || [];
  ride.passengers.push({ name: req.name });
  requests[reqIndex].assignedRideId = ride.id;

  saveRides();
  saveRequests();
  renderRides();
  renderRequests();
};

rideListEl.addEventListener('submit', (e) => {
  if (!e.target.classList.contains('join-form')) return;
  e.preventDefault();

  const rideId = e.target.getAttribute('data-ride');
  const passengerInput = e.target.querySelector('input[name="passenger"]');
  const name = passengerInput.value.trim();
  if (!name) return;

  const ride = rides.find((r) => r.id === rideId);
  if (!ride) return;

  const seatsLeft = Math.max(ride.seats - (ride.passengers?.length || 0), 0);
  if (seatsLeft <= 0) {
    alert('This ride is already full.');
    renderRides();
    return;
  }

  ride.passengers = ride.passengers || [];
  ride.passengers.push({ name });
  saveRides();
  renderRides();
});

rideListEl.addEventListener('click', (e) => {
  const claimBtn = e.target.closest('.claim-request');
  if (!claimBtn) return;
  const rideId = claimBtn.getAttribute('data-ride');
  const reqId = claimBtn.getAttribute('data-request');
  claimRequestForRide(rideId, reqId);
});

requestPickup.addEventListener('change', () => {
  requestCustomWrap.style.display = requestPickup.value === 'custom' ? 'grid' : 'none';
});

requestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('reqName').value.trim();
  const contact = document.getElementById('reqContact').value.trim();
  const pickup = requestPickup.value;
  const destinationId = requestDestination.value;
  const day = requestDay.value;
  const timePlain = requestTimePlain.value;
  const details = requestCustom.value.trim();

  if (!name || !contact || !day || !timePlain) return;

  const time = buildDateTime(day, timePlain);

  const pickupLabel =
    pickup === 'custom'
      ? `Custom: ${details || 'TBD'}`
      : hotspots.find((h) => h.id === pickup)?.name || 'Pickup';
  const destinationLabel =
    destinations.find((d) => d.id === destinationId)?.name || 'Destination';

  const request = {
    id: `req-${Date.now()}`,
    name,
    contact,
    pickup,
    pickupLabel,
    destinationId,
    destinationLabel,
    time,
    details,
    assignedRideId: null,
  };

  requests.push(request);

  saveRides();
  saveRequests();
  renderRequests();
  requestForm.reset();
  requestCustomWrap.style.display = 'none';
});

filterDestination.addEventListener('change', renderRides);

// Calendar: fetch upcoming events from Google Calendar ICS feed (best-effort)
const parseIcsDate = (val) => {
  // Handles YYYYMMDD and YYYYMMDDTHHMMSSZ
  const m = val.match(/^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z)?$/);
  if (!m) return null;
  const [_, y, mo, d, hasTime, hh, mm, ss] = m;
  if (hasTime) {
    return new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(hh), Number(mm), Number(ss || 0)));
  }
  return new Date(Number(y), Number(mo) - 1, Number(d));
};

const parseIcsEvents = (ics) => {
  return ics
    .split('BEGIN:VEVENT')
    .slice(1)
    .map((block) => {
      const summary = (block.match(/SUMMARY:(.+)/) || [])[1]?.trim() || 'Event';
      const location = (block.match(/LOCATION:(.+)/) || [])[1]?.trim() || '';
      const dt = (block.match(/DTSTART(?:;TZID=[^:]+)?:([0-9TZ]+)/) || [])[1];
      const start = dt ? parseIcsDate(dt) : null;
      return { summary, location, start };
    })
    .filter((e) => e.start instanceof Date && !Number.isNaN(e.start));
};

const renderUpcoming = (events) => {
  if (!upcomingList || !upcomingStatus) return;
  if (upcomingEmbedWrap) upcomingEmbedWrap.style.display = 'none';
  const now = new Date();
  const upcoming = events.filter((e) => e.start > now).sort((a, b) => a.start - b.start).slice(0, 5);

  if (!upcoming.length) {
    upcomingStatus.textContent = 'No upcoming events on this calendar.';
    upcomingList.innerHTML = '';
    return;
  }

  upcomingStatus.style.display = 'none';
  upcomingList.innerHTML = upcoming
    .map((e) => {
      const time = e.start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
      const where = e.location ? ` • ${e.location}` : '';
      return `<li><span>${time}</span><strong>${e.summary}</strong>${where ? `<div class="subtle">${where}</div>` : ''}</li>`;
    })
    .join('');
};

const loadCalendar = async () => {
  if (!upcomingStatus) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CALENDAR_TIMEOUT_MS);
  try {
    upcomingStatus.textContent = 'Loading calendar…';
    const res = await fetch(CALENDAR_ICS_URL, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('Calendar fetch failed');
    const text = await res.text();
    const events = parseIcsEvents(text);
    renderUpcoming(events);
  } catch (err) {
    clearTimeout(timer);
    console.warn('Calendar load failed', err);
    if (upcomingStatus) {
      upcomingStatus.textContent = 'Calendar shown below (direct embed).';
    }
    if (upcomingEmbed && upcomingEmbedWrap) {
      upcomingEmbed.src = CALENDAR_EMBED_URL;
      upcomingEmbedWrap.style.display = 'block';
    }
  }
};

// Initial render
renderHotspots();
renderSelects();
renderRides();
renderRequests();
window.addEventListener('load', () => {
  ensureLeaflet()
    .then(() => {
      if (!mapStatusEl) mapStatusEl = document.getElementById('mapStatus');
      if (mapStatusEl) mapStatusEl.textContent = 'Loading map tiles…';
      initMap();
    })
    .catch(() => {
      mapStatusEl = document.getElementById('mapStatus');
      if (mapStatusEl) {
        mapStatusEl.textContent =
          'Map library failed to load from all CDNs. Check connection or allow unpkg/jsDelivr/cdnjs.';
      }
    });
  loadCalendar();
});

