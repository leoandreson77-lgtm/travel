/**
 * YATRIMAP - Taxi & Airport Transfer Management
 * Connects directly to backend API (/api/vehicles?category=taxi)
 */

let allTaxis = [];
let activeType = 'All';
const list = document.querySelector('#car-list');

// Set default dates
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const startDateInput = document.querySelector('#taxi-start-date');
const endDateInput = document.querySelector('#taxi-end-date');

if (startDateInput && !startDateInput.value) {
  startDateInput.value = today.toISOString().split('T')[0];
}
if (endDateInput && !endDateInput.value) {
  endDateInput.value = tomorrow.toISOString().split('T')[0];
}

function calculateDays() {
  if (!startDateInput || !endDateInput) return 1;
  const start = new Date(startDateInput.value);
  const end = new Date(endDateInput.value);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays || 1);
}

async function loadTaxis() {
  try {
    list.innerHTML = `
      <div style="grid-column:1/-1; padding: 40px; text-align: center;">
        <div class="skeleton" style="height: 180px; margin-bottom: 16px; border-radius: 12px;"></div>
        <div class="skeleton" style="height: 180px; border-radius: 12px;"></div>
      </div>
    `;
    const res = await fetch('/api/vehicles?category=taxi');
    const data = await res.json();
    if (data.success) {
      allTaxis = data.vehicles || [];
    } else {
      allTaxis = [];
    }
    render();
  } catch (err) {
    console.error('Failed to load taxis:', err);
    list.innerHTML = `<p class="empty">Unable to fetch taxi fleet. Please check server connection.</p>`;
  }
}

function render() {
  const checked = [...document.querySelectorAll('aside input[value]:checked')].map(x => x.value);
  const sortVal = document.querySelector('#sort') ? document.querySelector('#sort').value : 'low';
  const pickup = document.querySelector('#pickup-location') ? document.querySelector('#pickup-location').value : 'Rishikesh';
  const days = calculateDays();

  let filtered = allTaxis.filter(car => {
    const matchesTab = activeType === 'All' || car.type === activeType;
    const matchesCheck = !checked.length || checked.includes(car.type);
    return matchesTab && matchesCheck;
  });

  filtered.sort((a, b) => {
    return sortVal === 'low' ? a.pricePerDay - b.pricePerDay : b.pricePerDay - a.pricePerDay;
  });

  const countEl = document.querySelector('#result-count');
  if (countEl) countEl.textContent = `${filtered.length} verified taxis available`;

  if (!filtered.length) {
    list.innerHTML = `
      <div class="empty" style="grid-column: 1/-1; text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px dashed #bee3f8;">
        <div style="font-size: 40px; margin-bottom: 12px;">🚖</div>
        <h3 style="margin-bottom: 6px; color: var(--navy);">No taxis match your criteria</h3>
        <p style="color: var(--muted); font-size: 14px; margin-bottom: 16px;">Try clearing some filters or changing your vehicle category.</p>
        <button onclick="resetFilters()" style="background: var(--navy); color: #fff; border: 0; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Reset Filters</button>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(car => {
    const dailyPrice = car.pricePerDay;
    const strikePrice = car.originalPrice || Math.round(dailyPrice * 1.25);
    const totalPrice = dailyPrice * days;
    const benefitsList = car.benefits && car.benefits.length 
      ? car.benefits.map(b => `✓ ${b}`).join(' &nbsp; ') 
      : '✓ AC &nbsp; ✓ Verified Hill Driver &nbsp; ✓ Clean & Sanitized';

    return `
      <article class="car-card">
        <img src="${car.image}" alt="${car.name}" onerror="this.src='https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'">
        <div class="car-info">
          <span class="badge" style="background: #e6fffa; color: #234e52; font-weight: 700; border: 1px solid #b2f5ea;">
            ★ ${car.rating || 4.8} VERIFIED CAB
          </span>
          <h2>${car.name}</h2>
          <p style="color: #4a5568; font-weight: 600;">${car.type} • ${car.seats} Seats • ${car.fuel || 'Petrol/Diesel'}</p>
          <div class="specs">${car.specs || `${car.seats} Seats • AC • Certified Hill Driver`}</div>
          <p class="benefits" style="color: #2b6cb0; font-size: 12px;">${benefitsList}</p>
          <div style="font-size: 12px; color: #718096; margin-top: 6px;">
            📍 Service available in: ${(car.availableLocations || ['Rishikesh', 'Dehradun', 'Haridwar']).join(', ')}
          </div>
        </div>
        <div class="price">
          <del>₹${strikePrice.toLocaleString('en-IN')}</del>
          <strong>₹${dailyPrice.toLocaleString('en-IN')}</strong>
          <span>/ day</span>
          <small>Total for ${days} ${days === 1 ? 'day' : 'days'}: <b>₹${totalPrice.toLocaleString('en-IN')}</b></small>
          <button type="button" onclick="showTaxiDetails('${car.id}')">View details</button>
          <a href="checkout.html?type=taxi&id=${car.id}&days=${days}&startDate=${startDateInput ? startDateInput.value : ''}&endDate=${endDateInput ? endDateInput.value : ''}&pickup=${encodeURIComponent(pickup)}">Book now</a>
        </div>
      </article>
    `;
  }).join('');
}

function showTaxiDetails(id) {
  const car = allTaxis.find(c => c.id === id);
  if (!car) return;
  const days = calculateDays();
  const totalPrice = car.pricePerDay * days;
  const pickup = document.querySelector('#pickup-location') ? document.querySelector('#pickup-location').value : 'Rishikesh';

  const modalHtml = `
    <div style="display:flex; flex-direction:column; gap:16px;">
      <img src="${car.image}" alt="${car.name}" style="width:100%; height:240px; object-fit:cover; border-radius:12px;">
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="margin:0; font-family:'Playfair Display',serif; color:var(--navy); font-size:24px;">${car.name}</h2>
          <span style="background:#fefcbf; color:#744210; padding:4px 10px; border-radius:20px; font-weight:700; font-size:13px;">★ ${car.rating || 4.8}</span>
        </div>
        <p style="color:var(--muted); margin:4px 0 12px; font-size:14px;">Class: <b>${car.type}</b> | Seating: <b>${car.seats} Pax</b> | Fuel: <b>${car.fuel || 'Commercial AC'}</b></p>
      </div>

      <div style="background:#f7fafc; padding:16px; border-radius:10px; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 8px; color:var(--navy); font-size:14px;">Specifications & Inclusions</h4>
        <p style="font-size:13px; color:#4a5568; margin:0 0 8px;">${car.specs || 'Includes commercial tourist permit, hill terrain clearance, and experienced chauffeur.'}</p>
        <ul style="margin:0; padding-left:18px; font-size:13px; color:#2d3748;">
          <li>Uniformed and police-verified hill chauffeur</li>
          <li>Clean AC vehicle with commercial yellow plate license</li>
          <li>Driver night allowance included</li>
          <li>Toll tax & parking paid as per actual receipts</li>
        </ul>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #edf2f7; padding-top:14px;">
        <div>
          <div style="font-size:12px; color:var(--muted);">Rate per day</div>
          <div style="font-size:22px; font-weight:800; color:var(--navy);">₹${car.pricePerDay.toLocaleString('en-IN')}</div>
          <small style="color:#718096;">Total for ${days} days: <b>₹${totalPrice.toLocaleString('en-IN')}</b></small>
        </div>
        <div style="display:flex; gap:10px;">
          <a href="checkout.html?type=taxi&id=${car.id}&days=${days}&startDate=${startDateInput ? startDateInput.value : ''}&endDate=${endDateInput ? endDateInput.value : ''}&pickup=${encodeURIComponent(pickup)}" 
             style="background:var(--navy); color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; display:inline-block;">
             Proceed to Booking →
          </a>
        </div>
      </div>
    </div>
  `;

  if (window.Yatrimap && window.Yatrimap.modal) {
    window.Yatrimap.modal.open(modalHtml);
  } else {
    // Fallback standard modal
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
    overlay.innerHTML = `
      <div style="background:#fff; border-radius:16px; max-width:550px; width:100%; padding:24px; position:relative; max-height:90vh; overflow-y:auto;">
        <button onclick="this.closest('div').parentElement.remove()" style="position:absolute; top:16px; right:16px; border:0; background:#edf2f7; border-radius:50%; width:32px; height:32px; font-size:16px; cursor:pointer;">✕</button>
        ${modalHtml}
      </div>
    `;
    document.body.appendChild(overlay);
  }
}

function resetFilters() {
  document.querySelectorAll('aside input').forEach(input => input.checked = false);
  activeType = 'All';
  document.querySelectorAll('#car-tabs button').forEach((x, i) => x.classList.toggle('active', i === 0));
  render();
}

// Event Listeners
document.querySelectorAll('#car-tabs button').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('#car-tabs button').forEach(x => x.classList.remove('active'));
    button.classList.add('active');
    activeType = button.dataset.type;
    render();
  };
});

document.querySelectorAll('aside input').forEach(input => input.onchange = render);

const sortSelect = document.querySelector('#sort');
if (sortSelect) sortSelect.onchange = render;

const resetBtn = document.querySelector('#reset');
if (resetBtn) resetBtn.onclick = resetFilters;

const searchBtn = document.querySelector('#search-cars');
if (searchBtn) searchBtn.onclick = render;

if (startDateInput) startDateInput.onchange = render;
if (endDateInput) endDateInput.onchange = render;

// Initialize
loadTaxis();
