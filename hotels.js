let allHotels = [];
let currentPage = 1;
const perPage = 6;
let activeLocation = '';
let activeSort = 'featured';
let selectedHotelObj = null;

const grid = document.querySelector('#hotel-grid');
const pagination = document.querySelector('#pagination');
const filterDialog = document.querySelector('#listing-filter');
const modal = document.getElementById('hotel-detail-modal');

async function loadLiveHotels() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('location')) activeLocation = params.get('location');
  if (params.get('search')) activeLocation = params.get('search');

  const couple = document.getElementById('f-couple') && document.getElementById('f-couple').checked;
  const breakfast = document.getElementById('f-breakfast') && document.getElementById('f-breakfast').checked;
  const cancel = document.getElementById('f-cancel') && document.getElementById('f-cancel').checked;

  let url = `/api/hotels?page=${currentPage}&limit=${perPage}`;
  if (activeLocation && activeLocation !== 'All') url += `&location=${encodeURIComponent(activeLocation)}`;
  if (activeSort) url += `&sort=${activeSort}`;
  if (couple) url += `&coupleFriendly=true`;
  if (breakfast) url += `&breakfast=true`;
  if (cancel) url += `&freeCancellation=true`;

  const res = await Yatrimap.api.get(url);
  if (res && res.success) {
    allHotels = res.hotels;
    document.querySelector('#result-summary').textContent = `${res.total} stays available in ${activeLocation || 'Uttarakhand'}`;
    renderHotelCards(allHotels);
    renderPagination(res.totalPages);
  }
}

function renderHotelCards(list) {
  if (!list.length) {
    grid.innerHTML = `
      <div class="empty-state-box" style="grid-column:1/-1;">
        <i>🏨</i>
        <h3>No stays found matching your criteria</h3>
        <p>Try clearing filters or searching for other destinations like Rishikesh, Mussoorie, or Haridwar.</p>
        <button class="btn-primary" onclick="clearAllFilters()" style="margin-top:12px;">Reset Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(h => `
    <article class="hotel-card" data-id="${h.id}">
      <img src="${h.heroImage}" alt="${h.name}">
      <div class="hotel-card-body">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <p class="hotel-location">📍 ${h.location}</p>
            <span style="font-size:12px;font-weight:700;color:var(--forest);">★ ${h.rating} (${h.reviewsCount})</span>
          </div>
          <h2>${h.name}</h2>
        </div>
        <p style="font-size:13px;color:#52778c;line-height:1.45;">${h.description.slice(0, 95)}...</p>
        <div class="hotel-card-bottom">
          <span><strong>₹${h.pricePerNight.toLocaleString('en-IN')}</strong> <small style="font-weight:normal;color:#666;">/ night</small></span>
          <button class="btn-view-hotel" data-id="${h.id}">View Stay →</button>
        </div>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.btn-view-hotel').forEach(btn => {
    btn.onclick = () => openHotelModal(btn.dataset.id);
  });
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = `<button ${currentPage === 1 ? 'disabled' : ''} data-page="prev">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="next">›</button>`;

  pagination.innerHTML = html;

  pagination.querySelectorAll('[data-page]').forEach(button => {
    button.onclick = () => {
      const page = button.dataset.page;
      currentPage = page === 'prev' ? currentPage - 1 : page === 'next' ? currentPage + 1 : +page;
      loadLiveHotels();
      window.scrollTo({ top: 180, behavior: 'smooth' });
    };
  });
}

function openHotelModal(hotelId) {
  const hotel = allHotels.find(h => h.id === hotelId);
  if (!hotel) return;

  selectedHotelObj = hotel;
  document.getElementById('m-hotel-img').src = hotel.heroImage;
  document.getElementById('m-hotel-name').textContent = hotel.name;
  document.getElementById('m-hotel-type').textContent = hotel.type;
  document.getElementById('m-hotel-price').innerHTML = `₹${hotel.pricePerNight.toLocaleString('en-IN')} <small style="font-size:12px;color:var(--muted);font-weight:500;">/ night</small>`;
  document.getElementById('m-hotel-loc').textContent = `📍 ${hotel.location}, Uttarakhand • ★ ${hotel.rating} (${hotel.reviewsCount} reviews)`;
  document.getElementById('m-hotel-desc').textContent = hotel.description;

  const amWrap = document.getElementById('m-hotel-amenities');
  amWrap.innerHTML = (hotel.amenities || ['Free WiFi', 'Breakfast', 'River View']).map(a => `
    <span class="status-pill status-active" style="font-size:11px;">✓ ${a}</span>
  `).join('');

  document.getElementById('btn-modal-book-now').onclick = () => {
    const params = new URLSearchParams({
      type: 'hotel',
      id: hotel.id,
      title: hotel.name,
      rate: hotel.pricePerNight,
      days: 3,
      travellers: 2
    });
    window.location.href = `checkout.html?${params.toString()}`;
  };

  modal.classList.add('active');
}

function clearAllFilters() {
  document.getElementById('f-couple').checked = false;
  document.getElementById('f-breakfast').checked = false;
  document.getElementById('f-cancel').checked = false;
  activeLocation = '';
  currentPage = 1;
  loadLiveHotels();
}

// Modal closing
if (document.getElementById('close-hotel-modal')) {
  document.getElementById('close-hotel-modal').onclick = () => modal.classList.remove('active');
}

// Filter Dialog
if (document.querySelector('#open-filters')) {
  document.querySelector('#open-filters').onclick = () => filterDialog.showModal();
}
if (document.querySelector('.close-filter')) {
  document.querySelector('.close-filter').onclick = () => filterDialog.close();
}
if (document.querySelector('#apply-listing-filter')) {
  document.querySelector('#apply-listing-filter').onclick = () => {
    filterDialog.close();
    currentPage = 1;
    loadLiveHotels();
  };
}

// Sort dropdown
if (document.querySelector('#hotel-sort')) {
  document.querySelector('#hotel-sort').onchange = (e) => {
    activeSort = e.target.value;
    currentPage = 1;
    loadLiveHotels();
  };
}

document.addEventListener('DOMContentLoaded', loadLiveHotels);
