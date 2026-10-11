/**
 * YATRIMAP - Two Wheeler Rentals (Bikes & Scooties)
 * Connects directly to backend API (/api/vehicles?category=bike|scooty)
 */

const kind = window.vehicleKind || 'bike';
let allVehicles = [];
let chosen = 'All';
const grid = document.querySelector('#vehicle-grid');
const countEl = document.querySelector('#vehicle-count');
const sortEl = document.querySelector('#vehicle-sort');
const findBtn = document.querySelector('#find-vehicle');

// Date fields
const pickDateInput = document.querySelector('.black-search input[type="date"]:nth-of-type(1)');
const dropDateInput = document.querySelectorAll('.black-search input[type="date"]')[1];
const citySelect = document.querySelector('.black-search select');

// Set default dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

if (pickDateInput && !pickDateInput.value) {
  pickDateInput.value = today.toISOString().split('T')[0];
}
if (dropDateInput && !dropDateInput.value) {
  dropDateInput.value = tomorrow.toISOString().split('T')[0];
}

function calculateDays() {
  if (!pickDateInput || !dropDateInput) return 1;
  const start = new Date(pickDateInput.value);
  const end = new Date(dropDateInput.value);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays || 1);
}

async function fetchVehicles() {
  try {
    grid.innerHTML = `
      <div style="grid-column:1/-1; padding: 40px; text-align: center;">
        <div class="skeleton" style="height: 220px; border-radius: 12px; margin-bottom: 12px;"></div>
      </div>
    `;
    const res = await fetch(`/api/vehicles?category=${kind}`);
    const data = await res.json();
    if (data.success && data.vehicles) {
      allVehicles = data.vehicles;
    } else {
      allVehicles = [];
    }
    render();
  } catch (err) {
    console.error('Error fetching two-wheelers:', err);
    grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:30px; color:#e53e3e;">Unable to load vehicles. Please ensure backend server is active.</p>`;
  }
}

function render() {
  const sortVal = sortEl ? sortEl.value : 'low';
  const selectedCity = citySelect ? citySelect.value : '';
  const days = calculateDays();

  let data = allVehicles.filter(v => {
    // Tab match
    const tabMatch = chosen === 'All' || 
      (chosen === 'Cheapest' && v.pricePerDay < 800) ||
      v.type.toLowerCase() === chosen.toLowerCase();

    // City match (optional check)
    let cityMatch = true;
    if (selectedCity && v.availableLocations && v.availableLocations.length) {
      cityMatch = v.availableLocations.some(loc => loc.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    return tabMatch && cityMatch;
  });

  data.sort((a, b) => {
    return sortVal === 'low' ? a.pricePerDay - b.pricePerDay : b.pricePerDay - a.pricePerDay;
  });

  const label = kind === 'bike' ? 'Bikes' : 'Scooties';
  if (countEl) countEl.textContent = `${data.length} ${label} Available`;

  if (!data.length) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; background: #fff; padding: 40px 20px; border-radius: 12px; border: 1px dashed #cbd5e0; text-align: center;">
        <div style="font-size: 38px; margin-bottom: 8px;">${kind === 'bike' ? '🏍️' : '🛵'}</div>
        <h3 style="color: var(--navy); margin-bottom: 4px;">No ${label} Found</h3>
        <p style="color: var(--muted); font-size: 14px; margin-bottom: 16px;">Try selecting "All ${label}" or choosing another city.</p>
        <button onclick="resetTwoWheelerFilters()" style="background: var(--navy); color:#fff; border:0; padding:8px 18px; border-radius:6px; font-weight:600; cursor:pointer;">Show All</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = data.map(v => {
    const dailyPrice = v.pricePerDay;
    const strike = v.originalPrice || Math.round(dailyPrice * 1.3);
    const total = dailyPrice * days;
    const cityName = selectedCity || (v.availableLocations ? v.availableLocations[0] : 'Rishikesh');
    const pickDate = pickDateInput ? pickDateInput.value : '';
    const dropDate = dropDateInput ? dropDateInput.value : '';

    return `
      <article style="cursor: pointer;" onclick="openVehicleDetail('${v.id}')">
        <div style="position: relative; overflow: hidden; border-radius: 8px;">
          <img src="${v.image}" alt="${v.name}" onerror="this.src='https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=500&q=80'">
          <span style="position: absolute; top: 8px; right: 8px; background: rgba(22,75,104,0.85); color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700;">★ ${v.rating || 4.8}</span>
        </div>
        <h2 style="font-size: 15px; font-weight: 700; color: #133d67; margin: 8px 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${v.name}">${v.name}</h2>
        <p style="font-size: 11px; color: var(--muted); margin: 0 0 6px;">${v.type} • Helmet included • ${v.fuel || 'Petrol'}</p>
        <div style="font-size: 11px; color: #2b6cb0; margin-bottom: 8px; font-weight: 600;">
          📍 ${v.availableLocations ? v.availableLocations.join(', ') : 'Rishikesh'}
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 8px; border-top: 1px solid #f0f7fa;">
          <div>
            <del style="font-size: 11px; color: #a0aec0;">₹${strike.toLocaleString('en-IN')}</del>
            <div style="font-weight: 800; font-size: 16px; color: var(--navy);">₹${dailyPrice.toLocaleString('en-IN')} <span style="font-size: 10px; font-weight: 500; color: var(--muted);">/ day</span></div>
          </div>
          <a href="checkout.html?type=vehicle&id=${v.id}&days=${days}&startDate=${pickDate}&endDate=${dropDate}&city=${encodeURIComponent(cityName)}" 
             onclick="event.stopPropagation();"
             style="background: var(--orange); color: white; border: 0; border-radius: 6px; padding: 6px 14px; font-weight: 700; font-size: 12px; text-decoration: none; display: inline-block;">
             Book Now
          </a>
        </div>
      </article>
    `;
  }).join('');
}

function openVehicleDetail(id) {
  const v = allVehicles.find(x => x.id === id);
  if (!v) return;
  const days = calculateDays();
  const total = v.pricePerDay * days;
  const cityName = citySelect ? citySelect.value : 'Rishikesh';
  const pickDate = pickDateInput ? pickDateInput.value : '';
  const dropDate = dropDateInput ? dropDateInput.value : '';

  const modalHtml = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <img src="${v.image}" alt="${v.name}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 10px;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="margin: 0; font-size: 22px; color: var(--navy); font-family: 'Playfair Display', serif;">${v.name}</h2>
          <span style="background: #ebf8ff; color: #2b6cb0; padding: 4px 10px; border-radius: 12px; font-weight: 700; font-size: 12px;">${v.type}</span>
        </div>
        <p style="color: var(--muted); margin: 6px 0 12px; font-size: 13px;">${v.specs || 'Certified mountain tuned two-wheeler with complimentary sanitized helmets.'}</p>
      </div>

      <div style="background: #f7fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 13px;">
        <b style="color: var(--navy); display: block; margin-bottom: 6px;">Rental Highlights</b>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; color: #4a5568;">
          <div>✓ 2 Helmets included</div>
          <div>✓ Comprehensive Insurance</div>
          <div>✓ 24/7 Roadside Assistance</div>
          <div>✓ Unlimited Kilometers</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #edf2f7; padding-top: 14px;">
        <div>
          <span style="font-size: 12px; color: var(--muted);">Rate per day</span>
          <div style="font-size: 20px; font-weight: 800; color: var(--navy);">₹${v.pricePerDay.toLocaleString('en-IN')}</div>
          <small style="color: #718096;">Total for ${days} days: <b>₹${total.toLocaleString('en-IN')}</b></small>
        </div>
        <a href="checkout.html?type=vehicle&id=${v.id}&days=${days}&startDate=${pickDate}&endDate=${dropDate}&city=${encodeURIComponent(cityName)}" 
           style="background: var(--navy); color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block;">
           Reserve Instantly →
        </a>
      </div>
    </div>
  `;

  if (window.Yatrimap && window.Yatrimap.modal) {
    window.Yatrimap.modal.open(modalHtml);
  } else {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
    overlay.innerHTML = `
      <div style="background:#fff; border-radius:14px; max-width:500px; width:100%; padding:24px; position:relative;">
        <button onclick="this.closest('div').parentElement.remove()" style="position:absolute; top:14px; right:14px; border:0; background:#edf2f7; border-radius:50%; width:30px; height:30px; font-size:15px; cursor:pointer;">✕</button>
        ${modalHtml}
      </div>
    `;
    document.body.appendChild(overlay);
  }
}

function resetTwoWheelerFilters() {
  chosen = 'All';
  document.querySelectorAll('#vehicle-tabs button').forEach((b, i) => b.classList.toggle('active', i === 0));
  render();
}

// Wire tabs
document.querySelectorAll('#vehicle-tabs button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('#vehicle-tabs button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    chosen = b.dataset.type;
    render();
  };
});

if (sortEl) sortEl.onchange = render;
if (findBtn) findBtn.onclick = render;
if (citySelect) citySelect.onchange = render;
if (pickDateInput) pickDateInput.onchange = render;
if (dropDateInput) dropDateInput.onchange = render;

// Initialize
fetchVehicles();
