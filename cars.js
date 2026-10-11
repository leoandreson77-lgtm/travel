let liveCars = [];
let activeType = 'All';
const list = document.querySelector('#car-list');

async function loadCars() {
  const res = await Yatrimap.api.get('/api/vehicles?category=car');
  if (res && res.success) {
    liveCars = res.vehicles;
    renderCars();
  }
}

function renderCars() {
  const checkedTypes = [...document.querySelectorAll('aside input[value]:not(.fuel-filter):checked')].map(x => x.value);
  const checkedFuels = [...document.querySelectorAll('.fuel-filter:checked')].map(x => x.value);

  let data = liveCars.filter(car => {
    const matchesTab = activeType === 'All' || car.type === activeType;
    const matchesType = !checkedTypes.length || checkedTypes.includes(car.type);
    const matchesFuel = !checkedFuels.length || checkedFuels.includes(car.fuel);
    return matchesTab && matchesType && matchesFuel;
  });

  const sortVal = document.querySelector('#sort').value;
  data.sort((a, b) => sortVal === 'low' ? a.pricePerDay - b.pricePerDay : b.pricePerDay - a.pricePerDay);

  document.querySelector('#result-count').textContent = `${data.length} cars found in inventory`;

  if (!data.length) {
    list.innerHTML = '<p class="empty" style="padding:40px;text-align:center;color:#666;">No cars match these filters. Try resetting filters.</p>';
    return;
  }

  const startDate = document.getElementById('car-start-date').value || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const endDate = document.getElementById('car-end-date').value || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  list.innerHTML = data.map(car => `
    <article class="car-card">
      <img src="${car.image}" alt="${car.name}">
      <div class="car-info">
        <span class="badge">BEST PRICE</span>
        <h2>${car.name} <small>or similar</small></h2>
        <p>${car.type} • ★ ${car.rating}</p>
        <div class="specs">${car.specs}</div>
        <p class="benefits">✓ Unlimited kilometres &nbsp; ✓ Free cancellation &nbsp; ✓ Zero security deposit</p>
      </div>
      <div class="price">
        <del>₹${Math.round(car.pricePerDay * 1.15).toLocaleString('en-IN')}</del>
        <strong>₹${car.pricePerDay.toLocaleString('en-IN')}</strong><span>/ day</span>
        <small>Total for 4 days <b>₹${(car.pricePerDay * 4).toLocaleString('en-IN')}</b></small>
        <button class="btn-car-details" data-id="${car.id}">View details</button>
        <a href="checkout.html?type=vehicle&id=${car.id}&title=${encodeURIComponent(car.name)}&rate=${car.pricePerDay}&days=4&start=${startDate}&end=${endDate}" class="btn-car-book" style="display:inline-block;text-align:center;text-decoration:none;">Book now →</a>
      </div>
    </article>
  `).join('');

  list.querySelectorAll('.btn-car-details').forEach(btn => {
    btn.onclick = () => {
      const car = liveCars.find(c => c.id === btn.dataset.id);
      if (car) {
        Yatrimap.toast.show(`${car.name} (${car.type}) - ${car.specs}. Helmet/Insurance included.`, 'info');
      }
    };
  });
}

// Tab filters
document.querySelectorAll('#car-tabs button').forEach(button => {
  button.onclick = () => {
    document.querySelectorAll('#car-tabs button').forEach(x => x.classList.remove('active'));
    button.classList.add('active');
    activeType = button.dataset.type;
    renderCars();
  };
});

// Checkboxes and inputs
document.querySelectorAll('aside input').forEach(input => input.onchange = renderCars);
if (document.querySelector('#sort')) document.querySelector('#sort').onchange = renderCars;

if (document.querySelector('#reset')) {
  document.querySelector('#reset').onclick = () => {
    document.querySelectorAll('aside input').forEach(input => input.checked = false);
    activeType = 'All';
    document.querySelectorAll('#car-tabs button').forEach((x, i) => x.classList.toggle('active', i === 0));
    renderCars();
  };
}

if (document.querySelector('#search-cars')) {
  document.querySelector('#search-cars').onclick = renderCars;
}

// Set default dates
const today = new Date().toISOString().slice(0, 10);
if (document.getElementById('car-start-date')) {
  document.getElementById('car-start-date').min = today;
  document.getElementById('car-start-date').value = today;
}
if (document.getElementById('car-end-date')) {
  const returnDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  document.getElementById('car-end-date').min = today;
  document.getElementById('car-end-date').value = returnDate;
}

document.addEventListener('DOMContentLoaded', loadCars);
