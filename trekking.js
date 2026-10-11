/**
 * YATRIMAP - Trekking Experiences Engine
 * Connects to live backend API (/api/activities?category=trekking)
 */

let allTreks = [];
let cat = 'All Vibes';
let q = '';
let maxPrice = 20000;
let favs = new Set(JSON.parse(localStorage.getItem('yatrimap_fav_treks') || '[]'));

const grid = document.querySelector('#grid');
const countEl = document.querySelector('#count');
const noneEl = document.querySelector('#none');
const filtersEl = document.querySelector('#filters');
const detail = document.querySelector('#detail');
const closeBtn = document.querySelector('#close');
const bookBtn = document.querySelector('#book');
const favoritesBtn = document.querySelector('#favorites');
const qInput = document.querySelector('#q');
const kmInput = document.querySelector('#km');
const kmv = document.querySelector('#kmv');

// Update favorites counter badge
function updateFavBadge() {
  if (favoritesBtn) {
    const badge = favoritesBtn.querySelector('i');
    if (badge) badge.textContent = favs.size;
  }
}
updateFavBadge();

async function loadTreks() {
  try {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; padding: 40px; text-align: center;">
        <div class="skeleton" style="height: 280px; border-radius: 16px; margin-bottom: 16px;"></div>
      </div>
    `;

    const res = await fetch('/api/activities');
    const data = await res.json();
    if (data.success && data.activities) {
      // Filter for trekking, adventure, and mountain expeditions
      allTreks = data.activities.filter(a => ['trekking', 'adventure', 'camping'].includes(a.category.toLowerCase()));
      // If fewer than 8, include all activities
      if (allTreks.length < 8) {
        allTreks = data.activities;
      }
    } else {
      allTreks = [];
    }

    buildFilters();
    render();
  } catch (err) {
    console.error('Failed to load treks:', err);
    grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding: 40px; color:#e53e3e;">Unable to load trek expeditions. Server error.</p>`;
  }
}

function buildFilters() {
  const vibes = ['All Vibes', 'Trekking', 'Adventure', 'Alpine Summit', 'Weekend Reset'];
  filtersEl.innerHTML = vibes.map((v, i) => `
    <button class="${i === 0 ? 'active' : ''}" data-vibe="${v}">${v}</button>
  `).join('');

  filtersEl.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => {
      filtersEl.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cat = btn.dataset.vibe;
      render();
    };
  });
}

function render() {
  const filtered = allTreks.filter(trek => {
    // Vibe match
    let matchVibe = cat === 'All Vibes';
    if (!matchVibe) {
      if (cat === 'Trekking') matchVibe = trek.category === 'trekking';
      else if (cat === 'Adventure') matchVibe = trek.category === 'adventure';
      else if (cat === 'Alpine Summit') matchVibe = (trek.altitude && parseInt(trek.altitude) > 5000) || (trek.price > 7000);
      else if (cat === 'Weekend Reset') matchVibe = (trek.duration && trek.duration.includes('Day')) || trek.price < 4000;
    }

    // Search query match
    const fullText = `${trek.name} ${trek.location || ''} ${trek.highlights || ''} ${trek.difficulty || ''}`.toLowerCase();
    const matchQuery = !q || fullText.includes(q.toLowerCase());

    // Price/difficulty filter
    const matchPrice = trek.price <= maxPrice;

    return matchVibe && matchQuery && matchPrice;
  });

  if (countEl) countEl.textContent = filtered.length;
  if (noneEl) noneEl.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(trek => {
    const isFav = favs.has(trek.id);
    const altitude = trek.altitude || '12,500 ft';
    const duration = trek.duration || '3 Days';
    const difficulty = trek.difficulty || 'Moderate';

    return `
      <article data-id="${trek.id}">
        <img src="${trek.image}" alt="${trek.name}" onerror="this.src='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80'">
        <button class="heart" data-fav="${trek.id}" title="Save to favorites">${isFav ? '♥' : '♡'}</button>
        <div>
          <span>⚡ ${difficulty.toUpperCase()} • ${trek.location || 'Himalayas'}</span>
          <h2>${trek.name}</h2>
          <p>“${trek.highlights ? trek.highlights.slice(0, 95) + '...' : 'Epic panoramic Himalayan vistas and alpine terrain.'}”</p>
          <section>
            <b>${duration}<small>DURATION</small></b>
            <b>${altitude}<small>ALTITUDE</small></b>
            <b>₹${trek.price.toLocaleString('en-IN')}<small>FROM</small></b>
          </section>
          <button type="button" onclick="event.stopPropagation(); window.location.href='checkout.html?type=activity&id=${trek.id}'">Claim your spot →</button>
        </div>
      </article>
    `;
  }).join('');

  // Wire favorite clicks
  document.querySelectorAll('[data-fav]').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const id = btn.dataset.fav;
      if (favs.has(id)) {
        favs.delete(id);
      } else {
        favs.add(id);
        if (window.Yatrimap && window.Yatrimap.toast) {
          window.Yatrimap.toast('Saved to your trip wishlist! ♡', 'success');
        }
      }
      localStorage.setItem('yatrimap_fav_treks', JSON.stringify([...favs]));
      updateFavBadge();
      render();
    };
  });

  // Wire card modal view
  document.querySelectorAll('[data-id]').forEach(card => {
    card.onclick = () => {
      showTrekDetail(card.dataset.id);
    };
  });
}

function showTrekDetail(id) {
  const trek = allTreks.find(t => t.id === id);
  if (!trek) return;

  const img = detail.querySelector('img');
  if (img) img.src = trek.image;

  const span = detail.querySelector('span');
  if (span) span.textContent = `📍 ${trek.location || 'Himalayas'} • ${trek.difficulty || 'Moderate'}`;

  const h2 = detail.querySelector('h2');
  if (h2) h2.textContent = trek.name;

  const p = detail.querySelector('p');
  if (p) p.textContent = trek.highlights || 'Guided summit expedition with high altitude tents, safety gear, and mountain meals.';

  const section = detail.querySelector('section');
  if (section) {
    section.innerHTML = `
      <b>${trek.duration || '4 Days'}<small>Duration</small></b>
      <b>${trek.altitude || '12,500 ft'}<small>Altitude</small></b>
      <b>₹${trek.price.toLocaleString('en-IN')}<small>Per Person</small></b>
    `;
  }

  if (bookBtn) {
    bookBtn.textContent = `Lock it in — ₹${trek.price.toLocaleString('en-IN')} / person`;
    bookBtn.onclick = () => {
      detail.close();
      window.location.href = `checkout.html?type=activity&id=${trek.id}&guests=1`;
    };
  }

  if (detail.showModal) {
    detail.showModal();
  }
}

if (closeBtn) closeBtn.onclick = () => detail.close();

if (qInput) {
  qInput.oninput = (e) => {
    q = e.target.value;
    render();
  };
}

if (kmInput) {
  kmInput.oninput = (e) => {
    // Map slider to max price budget
    const val = +e.target.value;
    maxPrice = val >= 105 ? 50000 : val * 200;
    if (kmv) kmv.textContent = val >= 105 ? 'All Budgets' : `Under ₹${maxPrice.toLocaleString('en-IN')}`;
    render();
  };
}

// Favorites button filter toggle
if (favoritesBtn) {
  favoritesBtn.onclick = () => {
    if (favs.size === 0) {
      if (window.Yatrimap && window.Yatrimap.toast) {
        window.Yatrimap.toast('No treks saved yet. Click the heart on any trek card!', 'info');
      }
      return;
    }
    // Filter to favorites only
    const filteredTreks = allTreks.filter(t => favs.has(t.id));
    grid.innerHTML = filteredTreks.map(trek => `
      <article data-id="${trek.id}">
        <img src="${trek.image}" alt="${trek.name}">
        <button class="heart" data-fav="${trek.id}">♥</button>
        <div>
          <span>★ WISHLIST • ${trek.location}</span>
          <h2>${trek.name}</h2>
          <p>“${trek.highlights ? trek.highlights.slice(0, 95) + '...' : ''}”</p>
          <section>
            <b>${trek.duration}<small>DURATION</small></b>
            <b>${trek.altitude || '12,500 ft'}<small>ALTITUDE</small></b>
            <b>₹${trek.price.toLocaleString('en-IN')}<small>PRICE</small></b>
          </section>
          <button type="button" onclick="event.stopPropagation(); window.location.href='checkout.html?type=activity&id=${trek.id}'">Claim your spot →</button>
        </div>
      </article>
    `).join('');
  };
}

// Initial fetch
loadTreks();
