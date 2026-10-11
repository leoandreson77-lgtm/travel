/**
 * YATRIMAP CORE PLATFORM CLIENT
 * Unified client architecture for authentication, APIs, toasts, search, modals, and WhatsApp actions.
 */

window.Yatrimap = {
  currentUser: null,

  // Toast Notification System
  toast: {
    show(message, type = 'success', title = '') {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
      }

      const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };

      const titles = {
        success: title || 'Success',
        error: title || 'Error',
        warning: title || 'Notice',
        info: title || 'Info'
      };

      const toast = document.createElement('div');
      toast.className = `yatrimap-toast ${type}`;
      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ'}</span>
        <div class="toast-body">
          <strong>${titles[type]}</strong>
          <div>${message}</div>
        </div>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 4000);
    }
  },

  // API Client Helpers
  api: {
    async get(url) {
      try {
        const res = await fetch(url);
        return await res.json();
      } catch (err) {
        console.error(`GET ${url} failed`, err);
        return { success: false, message: err.message };
      }
    },

    async post(url, data) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (err) {
        console.error(`POST ${url} failed`, err);
        return { success: false, message: err.message };
      }
    },

    async put(url, data) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (err) {
        console.error(`PUT ${url} failed`, err);
        return { success: false, message: err.message };
      }
    },

    async patch(url, data) {
      try {
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return await res.json();
      } catch (err) {
        console.error(`PATCH ${url} failed`, err);
        return { success: false, message: err.message };
      }
    },

    async delete(url) {
      try {
        const res = await fetch(url, { method: 'DELETE' });
        return await res.json();
      } catch (err) {
        console.error(`DELETE ${url} failed`, err);
        return { success: false, message: err.message };
      }
    }
  },

  // Authentication State
  auth: {
    async init() {
      const res = await Yatrimap.api.get('/api/auth/me');
      if (res && res.success) {
        Yatrimap.currentUser = res.user;
        Yatrimap.auth.renderNav();
        Yatrimap.auth.renderRoleSwitcher();
      }
    },

    renderNav() {
      const user = Yatrimap.currentUser;
      if (!user) return;

      const navLinks = document.querySelector('.nav-links');
      if (!navLinks) return;

      // Replace or update login/signup buttons with rich user profile dropdown
      const loginBtn = document.getElementById('login');
      const signupBtn = document.getElementById('signup');

      let userMenu = document.getElementById('yatrimap-user-menu');
      if (!userMenu) {
        userMenu = document.createElement('div');
        userMenu.id = 'yatrimap-user-menu';
        userMenu.className = 'user-menu-wrap';
        navLinks.appendChild(userMenu);
      }

      userMenu.innerHTML = `
        <button class="user-badge-btn" id="user-menu-trigger" aria-label="Open profile menu">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" class="user-avatar-sm" alt="${user.name}">
          <span>${user.name.split(' ')[0]}</span>
          <span style="font-size:10px;opacity:0.7">⌄</span>
        </button>
        <div class="user-dropdown-card" id="user-dropdown">
          <div class="user-dropdown-header">
            <b>${user.name}</b>
            <small>${user.role}</small>
          </div>
          <a href="my-trips.html">🧳 My Trips & Bookings</a>
          <a href="itinerary-builder.html">🗺 Custom Trip Builder</a>
          ${user.role !== 'Customer' ? '<a href="admin.html" style="font-weight:700;color:var(--forest);">⚙ Admin CMS & CRM</a>' : ''}
          <button id="user-logout-btn">Log out</button>
        </div>
      `;

      if (loginBtn) loginBtn.style.display = 'none';
      if (signupBtn) signupBtn.style.display = 'none';

      const trigger = document.getElementById('user-menu-trigger');
      const dropdown = document.getElementById('user-dropdown');
      if (trigger && dropdown) {
        trigger.onclick = (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('active');
        };
        document.addEventListener('click', () => dropdown.classList.remove('active'));
      }

      const logoutBtn = document.getElementById('user-logout-btn');
      if (logoutBtn) {
        logoutBtn.onclick = () => {
          Yatrimap.toast.show('Logged out successfully', 'info');
          setTimeout(() => location.reload(), 600);
        };
      }
    },

    renderRoleSwitcher() {
      let bar = document.getElementById('role-switcher-bar');
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'role-switcher-bar';
        bar.className = 'role-switcher-bar';
        document.body.appendChild(bar);
      }

      const current = Yatrimap.currentUser || {};
      bar.innerHTML = `
        <span>Active Persona:</span>
        <select id="role-select">
          <option value="usr-6" ${current.id === 'usr-6' ? 'selected' : ''}>Customer (Sameer Sharma)</option>
          <option value="usr-2" ${current.id === 'usr-2' ? 'selected' : ''}>Travel Agent (Priya Patel)</option>
          <option value="usr-1" ${current.id === 'usr-1' ? 'selected' : ''}>Super Admin (Vikram Mehta)</option>
        </select>
        ${current.role !== 'Customer' ? '<a href="admin.html" class="btn-primary" style="padding:4px 10px;font-size:11px;">Open Admin →</a>' : '<a href="my-trips.html" class="btn-outline" style="padding:4px 10px;font-size:11px;">My Trips →</a>'}
      `;

      const select = document.getElementById('role-select');
      if (select) {
        select.onchange = async (e) => {
          const res = await Yatrimap.api.post('/api/auth/switch-user', { userId: e.target.value });
          if (res.success) {
            Yatrimap.toast.show(res.message, 'success');
            setTimeout(() => location.reload(), 400);
          }
        };
      }
    }
  },

  // WhatsApp Integration Architectures
  whatsapp: {
    sendEnquiry(lead) {
      const msg = `Hello Yatrimap! I am planning a trip to ${lead.destination || 'Uttarakhand'} for ${lead.travellers || 2} persons around ${lead.travelDates || 'upcoming dates'}. Please share the best available package and quotation. My name is ${lead.name || 'Traveler'}.`;
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
    },

    sendQuote(quote) {
      const msg = `*YATRIMAP TRAVEL QUOTATION #${quote.id}*\n\nDear ${quote.customerName},\nHere is your custom itinerary quotation for *${quote.tripTitle}* (${quote.dates}):\n\nTotal Travellers: ${quote.travellers}\nSubtotal: ₹${(quote.subtotal || 0).toLocaleString('en-IN')}\nDiscount: -₹${(quote.discount || 0).toLocaleString('en-IN')}\n*Net Total: ₹${(quote.totalAmount || 0).toLocaleString('en-IN')}*\n\nView itinerary & accept here: ${window.location.origin}/itinerary-builder.html\n\nBest regards,\n${quote.assignedAgent || 'Yatrimap Travel Expert'}`;
      window.open(`https://wa.me/${(quote.customerPhone || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    sendBookingConfirmation(booking) {
      const msg = `*YATRIMAP BOOKING CONFIRMATION*\n\nHi ${booking.customerName},\nYour booking *#${booking.id}* for *${booking.productTitle}* is CONFIRMED!\n\nTravel Dates: ${booking.travelStartDate} to ${booking.travelEndDate}\nTotal Paid: ₹${(booking.finalAmount || 0).toLocaleString('en-IN')}\nStatus: ${booking.bookingStatus}\n\nDownload Voucher & Invoice: ${window.location.origin}/my-trips.html\n\nNeed assistance? Reply anytime on this chat!`;
      window.open(`https://wa.me/${(booking.customerPhone || '919876543210').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    openSupport(subject = 'General Travel Query') {
      const msg = `Hello Yatrimap Travel Team! I have a question regarding: ${subject}. Please assist me.`;
      window.open(`https://wa.me/919876543210?text=${encodeURIComponent(msg)}`, '_blank');
    }
  },

  // Global Search Autocomplete
  initGlobalSearch() {
    const searchInputs = document.querySelectorAll('#site-search, .nav-search input');
    searchInputs.forEach(input => {
      if (!input) return;

      const parent = input.closest('.nav-search') || input.parentElement;
      if (parent) parent.style.position = 'relative';

      let overlay = parent ? parent.querySelector('.search-results-overlay') : null;
      if (!overlay && parent) {
        overlay = document.createElement('div');
        overlay.className = 'search-results-overlay';
        parent.appendChild(overlay);
      }

      input.addEventListener('input', async (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length < 2) {
          if (overlay) overlay.classList.remove('active');
          return;
        }

        const [destRes, hotelRes, actRes, pkgRes] = await Promise.all([
          Yatrimap.api.get(`/api/destinations?search=${encodeURIComponent(query)}`),
          Yatrimap.api.get(`/api/hotels?search=${encodeURIComponent(query)}&limit=3`),
          Yatrimap.api.get(`/api/activities?search=${encodeURIComponent(query)}`),
          Yatrimap.api.get(`/api/packages?search=${encodeURIComponent(query)}`)
        ]);

        const dests = (destRes && destRes.destinations) || [];
        const hotels = (hotelRes && hotelRes.hotels) || [];
        const acts = (actRes && actRes.activities) || [];
        const pkgs = (pkgRes && pkgRes.packages) || [];

        let html = '';

        if (dests.length) {
          html += `<div class="search-result-group-title">Destinations</div>`;
          dests.slice(0, 3).forEach(d => {
            html += `
              <a href="destination.html?slug=${d.slug}" class="search-result-item">
                <img src="${d.heroImage}" alt="${d.name}">
                <div class="search-result-info">
                  <strong>${d.name}</strong>
                  <span>${d.state}, India • From ₹${d.startingPrice}</span>
                </div>
              </a>
            `;
          });
        }

        if (hotels.length) {
          html += `<div class="search-result-group-title">Hotels & Stays</div>`;
          hotels.slice(0, 3).forEach(h => {
            html += `
              <a href="hotels.html?search=${encodeURIComponent(h.name)}" class="search-result-item">
                <img src="${h.heroImage}" alt="${h.name}">
                <div class="search-result-info">
                  <strong>${h.name}</strong>
                  <span>${h.location} • ${h.type}</span>
                </div>
                <div class="search-result-price">₹${h.pricePerNight}/nt</div>
              </a>
            `;
          });
        }

        if (acts.length) {
          html += `<div class="search-result-group-title">Activities & Thrills</div>`;
          acts.slice(0, 3).forEach(a => {
            html += `
              <a href="trekking.html" class="search-result-item">
                <img src="${a.image}" alt="${a.name}">
                <div class="search-result-info">
                  <strong>${a.name}</strong>
                  <span>${a.location} • ${a.duration}</span>
                </div>
                <div class="search-result-price">₹${a.price}</div>
              </a>
            `;
          });
        }

        if (pkgs.length) {
          html += `<div class="search-result-group-title">Tour Packages</div>`;
          pkgs.slice(0, 3).forEach(p => {
            html += `
              <a href="itinerary-builder.html?package=${p.id}" class="search-result-item">
                <img src="${p.heroImage}" alt="${p.title}">
                <div class="search-result-info">
                  <strong>${p.title}</strong>
                  <span>${p.duration} • ${p.destination}</span>
                </div>
                <div class="search-result-price">₹${p.price.toLocaleString('en-IN')}</div>
              </a>
            `;
          });
        }

        if (!html) {
          html = `<div style="padding:16px;text-align:center;color:#666;font-size:13px;">No results found for "${query}". Try searching "Rishikesh", "Rafting", or "Char Dham".</div>`;
        }

        if (overlay) {
          overlay.innerHTML = html;
          overlay.classList.add('active');
        }
      });

      document.addEventListener('click', (e) => {
        if (overlay && !parent.contains(e.target)) {
          overlay.classList.remove('active');
        }
      });
    });
  },

  // Travel Enquiry / Lead Modal
  openLeadModal(destination = '') {
    let modal = document.getElementById('lead-modal-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'lead-modal-backdrop';
      modal.className = 'custom-modal-backdrop';
      modal.innerHTML = `
        <div class="custom-modal-window">
          <button class="modal-close-x" id="close-lead-modal">×</button>
          <div class="modal-header-strip">
            <span class="status-pill status-new" style="margin-bottom:6px;">Custom Trip Planning</span>
            <h2>Plan Your Himalayan Dream Trip</h2>
            <p>Tell us your travel preferences and our travel specialist will design a personalized itinerary with transparent pricing.</p>
          </div>
          <form id="lead-enquiry-form">
            <div class="modal-body-pad">
              <div class="input-grid-2">
                <div class="input-row">
                  <label>Full Name *</label>
                  <input type="text" id="lead-name" required placeholder="e.g. Sameer Sharma" value="${Yatrimap.currentUser ? Yatrimap.currentUser.name : ''}">
                </div>
                <div class="input-row">
                  <label>Mobile Number (WhatsApp) *</label>
                  <input type="tel" id="lead-phone" required placeholder="+91 98765 43210" value="${Yatrimap.currentUser ? Yatrimap.currentUser.phone : ''}">
                </div>
              </div>

              <div class="input-grid-2">
                <div class="input-row">
                  <label>Email Address *</label>
                  <input type="email" id="lead-email" required placeholder="name@example.com" value="${Yatrimap.currentUser ? Yatrimap.currentUser.email : ''}">
                </div>
                <div class="input-row">
                  <label>Destination *</label>
                  <input type="text" id="lead-destination" required placeholder="e.g. Rishikesh / Kedarnath / Auli">
                </div>
              </div>

              <div class="input-grid-3">
                <div class="input-row">
                  <label>Approx Travel Date</label>
                  <input type="date" id="lead-date">
                </div>
                <div class="input-row">
                  <label>Travellers</label>
                  <select id="lead-travellers">
                    <option value="1">1 Solo</option>
                    <option value="2" selected>2 Persons</option>
                    <option value="4">4 Family / Friends</option>
                    <option value="6">6 Group</option>
                    <option value="10">10+ Corporate</option>
                  </select>
                </div>
                <div class="input-row">
                  <label>Estimated Budget</label>
                  <select id="lead-budget">
                    <option>₹10,000 – ₹25,000</option>
                    <option selected>₹25,000 – ₹50,000</option>
                    <option>₹50,000 – ₹1,00,000</option>
                    <option>₹1,00,000+</option>
                  </select>
                </div>
              </div>

              <div class="input-row">
                <label>Interested Services & Special Requirements</label>
                <textarea id="lead-notes" rows="3" placeholder="Tell us if you need luxury riverside camps, rafting, helicopter shuttle, temple VIP tickets, or specific vehicle preferences..."></textarea>
              </div>
            </div>
            <div class="modal-footer-strip">
              <button type="button" class="btn-outline" id="cancel-lead-modal">Cancel</button>
              <button type="submit" class="btn-primary">Send Enquiry to Travel Expert →</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('close-lead-modal').onclick = () => modal.classList.remove('active');
      document.getElementById('cancel-lead-modal').onclick = () => modal.classList.remove('active');

      document.getElementById('lead-enquiry-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
          name: document.getElementById('lead-name').value,
          phone: document.getElementById('lead-phone').value,
          email: document.getElementById('lead-email').value,
          destination: document.getElementById('lead-destination').value,
          travelDates: document.getElementById('lead-date').value || 'Upcoming',
          travellers: document.getElementById('lead-travellers').value,
          budget: document.getElementById('lead-budget').value,
          specialRequirements: document.getElementById('lead-notes').value
        };

        const res = await Yatrimap.api.post('/api/leads', payload);
        if (res.success) {
          modal.classList.remove('active');
          Yatrimap.toast.show(res.message, 'success', 'Enquiry Received!');
        } else {
          Yatrimap.toast.show(res.message || 'Error submitting enquiry', 'error');
        }
      };
    }

    if (destination) {
      const destInput = document.getElementById('lead-destination');
      if (destInput) destInput.value = destination;
    }

    modal.classList.add('active');
  },

  // Mobile Bottom Navigation Bar
  initMobileNav() {
    let nav = document.querySelector('.mobile-bottom-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'mobile-bottom-nav';
      nav.innerHTML = `
        <a href="index.html" class="mobile-nav-btn ${location.pathname.endsWith('index.html') || location.pathname === '/' ? 'active' : ''}">
          <i>⌂</i><span>Home</span>
        </a>
        <a href="hotels.html" class="mobile-nav-btn ${location.pathname.includes('hotels') ? 'active' : ''}">
          <i>🏨</i><span>Hotels</span>
        </a>
        <a href="cars.html" class="mobile-nav-btn ${location.pathname.includes('cars') || location.pathname.includes('bike') ? 'active' : ''}">
          <i>🚗</i><span>Rentals</span>
        </a>
        <a href="itinerary-builder.html" class="mobile-nav-btn ${location.pathname.includes('itinerary') ? 'active' : ''}">
          <i>🗺</i><span>Builder</span>
        </a>
        <a href="my-trips.html" class="mobile-nav-btn ${location.pathname.includes('my-trips') ? 'active' : ''}">
          <i>🧳</i><span>Trips</span>
        </a>
      `;
      document.body.appendChild(nav);
    }
  },

  // Initialize all shared enhancements
  async init() {
    await this.auth.init();
    this.initGlobalSearch();
    this.initMobileNav();

    // Hook WhatsApp button if present on page
    const waBtn = document.getElementById('whatsapp');
    if (waBtn) {
      waBtn.onclick = (e) => {
        e.preventDefault();
        Yatrimap.whatsapp.openSupport('Assistance with booking & travel plans');
      };
    }
  }
};

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Yatrimap.init();
});
