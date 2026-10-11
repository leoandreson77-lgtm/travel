const labels = {
  Rental: ['Vehicle type', 'Pickup date', 'Return date', ['Scooty', 'Motorbike', 'Car', 'Taxi']],
  Activities: ['Activity', 'Activity date', 'Return date', ['River Rafting', 'Bungee Jumping', 'Paragliding', 'Trekking']],
  Hotels: ['Stay type', 'Check-in', 'Check-out', ['Hotel', 'Resort / Camp', 'Home Stay', 'Villa']],
  CharDham: ['Package', 'Start date', 'Return date', ['Kedarnath Yatra', 'Badrinath Yatra', 'Complete Char Dham', 'Do Dham Yatra']]
};

const type = document.querySelector('#type'),
  typeLabel = document.querySelector('#type-label'),
  startLabel = document.querySelector('#start-label'),
  endLabel = document.querySelector('#end-label');

const today = new Date().toISOString().slice(0, 10);
if (document.querySelector('#start-date')) document.querySelector('#start-date').min = today;
if (document.querySelector('#end-date')) document.querySelector('#end-date').min = today;

// Tab switcher in hero search
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const [a, b, c, options] = labels[tab.dataset.tab] || labels.Rental;
    if (typeLabel) typeLabel.textContent = a;
    if (startLabel) startLabel.textContent = b;
    if (endLabel) endLabel.textContent = c;
    if (type) type.innerHTML = options.map(o => `<option>${o}</option>`).join('');
  });
});

// Live Form Submission Handler
document.querySelector('#booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const start = document.querySelector('#start-date').value;
  const end = document.querySelector('#end-date').value;
  const message = document.querySelector('.form-message');
  const activeTab = document.querySelector('.tab.active').dataset.tab;
  const loc = document.querySelector('#location').value;
  const selectedType = document.querySelector('#type').value;

  if (!start || !end) {
    if (message) message.textContent = 'Please select travel dates.';
    return;
  }
  if (end < start) {
    if (message) message.textContent = 'Return date must be after pickup date.';
    return;
  }

  // Route to the corresponding live listing page with queries
  if (activeTab === 'Hotels') {
    window.location.href = `hotels.html?location=${encodeURIComponent(loc)}&start=${start}&end=${end}`;
  } else if (activeTab === 'Rental') {
    if (selectedType === 'Car') {
      window.location.href = `cars.html?location=${encodeURIComponent(loc)}&start=${start}&end=${end}`;
    } else if (selectedType === 'Taxi') {
      window.location.href = `taxi.html?location=${encodeURIComponent(loc)}&start=${start}&end=${end}`;
    } else if (selectedType === 'Motorbike') {
      window.location.href = `bike.html?location=${encodeURIComponent(loc)}&start=${start}&end=${end}`;
    } else {
      window.location.href = `scooty.html?location=${encodeURIComponent(loc)}&start=${start}&end=${end}`;
    }
  } else if (activeTab === 'Activities') {
    window.location.href = `trekking.html?activity=${encodeURIComponent(selectedType)}&location=${encodeURIComponent(loc)}`;
  } else if (activeTab === 'CharDham') {
    window.location.href = `itinerary-builder.html?package=pkg-1&destination=Kedarnath&start=${start}`;
  }
});

// Carousel arrows
let current = 0;
const slides = [...document.querySelectorAll('.hero-image')];
function showSlide(index) {
  if (!slides.length) return;
  slides[current].classList.remove('active');
  current = (index + slides.length) % slides.length;
  slides[current].classList.add('active');
}
if (document.querySelector('.next')) document.querySelector('.next').onclick = () => showSlide(current + 1);
if (document.querySelector('.previous')) document.querySelector('.previous').onclick = () => showSlide(current - 1);
if (slides.length) setInterval(() => showSlide(current + 1), 6500);

// Category cards navigation
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', event => {
    event.preventDefault();
    const category = card.querySelector('span').textContent;
    if (category === 'Hotel') { window.location.href = 'hotels.html'; return; }
    if (category === 'Resort / Camps') { window.location.href = 'hotels.html?type=Resort%20/%20Camp'; return; }
    if (category === 'Home Stay') { window.location.href = 'hotels.html?type=Home%20Stay'; return; }
    if (category === 'Apartment') { window.location.href = 'apartments.html'; return; }
    if (category === 'Self Drive Cars') { window.location.href = 'cars.html'; return; }
    if (category === 'Taxi') { window.location.href = 'taxi.html'; return; }
    if (category === 'Bike') { window.location.href = 'bike.html'; return; }
    if (category === 'Scooty') { window.location.href = 'scooty.html'; return; }
    if (category === 'Jungle Safari') { window.location.href = 'jungle-safari.html'; return; }
    if (category === 'River Rafting' || category === 'Bungee Jumping' || category === 'Paragliding' || category === 'Trekking') {
      window.location.href = `trekking.html?activity=${encodeURIComponent(category)}`;
      return;
    }
  });
});

// Category row horizontal scroll buttons
document.querySelectorAll('[data-scroll]').forEach(button => {
  button.addEventListener('click', () => {
    const el = document.querySelector('#' + button.dataset.scroll);
    if (el) el.scrollBy({ left: button.dataset.direction === 'right' ? 270 : -270, behavior: 'smooth' });
  });
});

// Offer cards: One-click copy coupon code & show toast
document.querySelectorAll('.offer-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const promo = card.querySelector('.promo').textContent;
    navigator.clipboard.writeText(promo);
    if (window.Yatrimap && window.Yatrimap.toast) {
      Yatrimap.toast.show(`Promo code ${promo} copied to clipboard! Paste it at checkout to claim discount.`, 'success');
    }
  });
});

// Mobile menu toggle
if (document.querySelector('.mobile-menu')) {
  document.querySelector('.mobile-menu').onclick = e => {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('show');
    e.currentTarget.setAttribute('aria-expanded', nav.classList.contains('show'));
  };
}

// Currency button handler
if (document.querySelector('#currency')) {
  document.querySelector('#currency').onclick = () => {
    if (window.Yatrimap && window.Yatrimap.toast) {
      Yatrimap.toast.show('Currency is currently set to INR (₹) with all taxes transparently computed.', 'info');
    }
  };
}

// Auth Dialog & Login Integration
const authDialog = document.querySelector('#auth-dialog');
function openAuthDialog(signup) {
  if (!authDialog) return;
  document.querySelector('#dialog-title').textContent = signup ? 'Join the journey' : 'Welcome back';
  document.querySelector('#dialog-copy').textContent = signup ? 'Create an account to unlock member-only prices.' : 'Log in to save your favourite escapes.';
  authDialog.showModal();
}
if (document.querySelector('#login')) document.querySelector('#login').onclick = () => openAuthDialog(false);
if (document.querySelector('#signup')) document.querySelector('#signup').onclick = () => openAuthDialog(true);
if (document.querySelector('.close-dialog')) document.querySelector('.close-dialog').onclick = () => authDialog.close();

if (document.querySelector('.dialog-action')) {
  document.querySelector('.dialog-action').onclick = async () => {
    const emailInput = authDialog.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : 'sameer@example.com';
    authDialog.close();
    if (window.Yatrimap) {
      const res = await Yatrimap.api.post('/api/auth/login', { email });
      if (res && res.success) {
        Yatrimap.currentUser = res.user;
        Yatrimap.auth.renderNav();
        Yatrimap.auth.renderRoleSwitcher();
        Yatrimap.toast.show(`Welcome back, ${res.user.name}!`, 'success');
      }
    }
  };
}

// Outline action buttons
document.querySelectorAll('.outline-action').forEach(button => {
  button.addEventListener('click', () => {
    window.location.href = 'trekking.html';
  });
});
