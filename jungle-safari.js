/**
 * YATRIMAP - Jungle Safari Experiences
 * Connects to live backend API (/api/activities?category=safari)
 */

async function loadSafaris() {
  const grid = document.querySelector('#park-grid');
  if (!grid) return;

  grid.innerHTML = `
    <div style="grid-column: 1/-1; padding: 40px; text-align: center;">
      <div class="skeleton" style="height: 320px; border-radius: 14px; margin-bottom: 20px;"></div>
    </div>
  `;

  try {
    const res = await fetch('/api/activities');
    const data = await res.json();
    let safaris = [];
    if (data.success && data.activities) {
      safaris = data.activities.filter(a => a.category === 'safari');
    }

    // Default top curated parks list with real images and direct checkout links
    const curatedParks = [
      {
        id: 'act-7',
        name: 'Jim Corbett National Park',
        location: 'Ramnagar, Uttarakhand',
        rating: '4.9',
        reviews: '34.7K',
        highlight: 'India’s premier tiger reserve. Track Royal Bengal Tigers, wild elephant herds, and scenic Ramganga riverbanks in open 4x4 gypsies.',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80',
        price: 4299,
        badge: 'Top Pick'
      },
      {
        id: 'act-15',
        name: 'Ranthambore National Park',
        location: 'Sawai Madhopur, Rajasthan',
        rating: '4.8',
        reviews: '13.0K',
        highlight: 'Famous for high chances of spotting tigers roaming amid ancient 10th-century ruins and royal fort lakes.',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
        price: 3899,
        badge: 'Historic Fort'
      },
      {
        id: 'act-16',
        name: 'Rajaji National Park',
        location: 'Haridwar / Rishikesh, Uttarakhand',
        rating: '4.7',
        reviews: '8.4K',
        highlight: 'Vital Shivalik elephant corridor and tiger habitat situated right at the foothills between Rishikesh and Haridwar.',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80',
        price: 2999,
        badge: 'Close to Rishikesh'
      },
      {
        id: 'act-safari-bandhavgarh',
        name: 'Bandhavgarh National Park',
        location: 'Umaria, Madhya Pradesh',
        rating: '4.9',
        reviews: '4.2K',
        highlight: 'Boasts the highest known density of Royal Bengal Tigers in central India, set around dramatic cliffs and sal forests.',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
        price: 4599,
        badge: 'High Tiger Density'
      },
      {
        id: 'act-safari-kanha',
        name: 'Kanha Tiger Reserve',
        location: 'Mandla, Madhya Pradesh',
        rating: '4.8',
        reviews: '10.8K',
        highlight: 'The lush sal meadows that inspired Rudyard Kipling’s The Jungle Book and rescued the hardground barasingha deer.',
        image: 'https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=900&q=80',
        price: 4199,
        badge: 'Jungle Book'
      },
      {
        id: 'act-safari-kaziranga',
        name: 'Kaziranga National Park',
        location: 'Golaghat, Assam',
        rating: '4.9',
        reviews: '9.4K',
        highlight: 'UNESCO World Heritage Site sheltering two-thirds of the world’s great one-horned rhinoceros population and wild buffaloes.',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80',
        price: 4899,
        badge: 'UNESCO Heritage'
      },
      {
        id: 'act-safari-gir',
        name: 'Gir National Park',
        location: 'Junagadh, Gujarat',
        rating: '4.8',
        reviews: '9.6K',
        highlight: 'The last natural refuge on earth for the rare and magnificent Asiatic Lion in dry deciduous teak scrub forests.',
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=80',
        price: 3999,
        badge: 'Asiatic Lions'
      },
      {
        id: 'act-safari-tadoba',
        name: 'Tadoba Andhari Tiger Reserve',
        location: 'Chandrapur, Maharashtra',
        rating: '4.7',
        reviews: '4.6K',
        highlight: 'Known as the Jewel of Vidarbha, famous for dramatic waterhole sightings and thriving predator populations.',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
        price: 3699,
        badge: 'Summer Hotspot'
      },
      {
        id: 'act-safari-periyar',
        name: 'Periyar Tiger Reserve',
        location: 'Thekkady, Kerala',
        rating: '4.7',
        reviews: '16.6K',
        highlight: 'Nestled in the Western Ghats; experience peaceful boat safaris on Periyar Lake watching herds of wild elephants swim.',
        image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80',
        price: 2499,
        badge: 'Lake Boat Safari'
      }
    ];

    grid.innerHTML = curatedParks.map((park, index) => {
      // Find matching activity if present
      const matchedAct = safaris.find(s => s.name.toLowerCase().includes(park.name.toLowerCase()) || park.id === s.id);
      const bookingId = matchedAct ? matchedAct.id : (park.id.startsWith('act-') && !park.id.includes('safari-') ? park.id : 'act-7');
      const price = matchedAct ? matchedAct.price : park.price;

      return `
        <article class="park-card">
          <img src="${park.image}" alt="${park.name}" onerror="this.src='https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80'">
          <div class="park-body">
            <span class="number">${String(index + 1).padStart(2, '0')}</span>
            <p class="location">⌖ ${park.location}</p>
            <h3>${park.name}</h3>
            <p class="rating">★ ${park.rating} <span>(${park.reviews} verified reviews)</span></p>
            <p class="highlight">${park.highlight}</p>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin: 12px 0 14px;">
              <div>
                <span style="font-size:11px; color:var(--muted); display:block;">Permit + 4x4 Gypsy</span>
                <b style="font-size:18px; color:var(--navy);">₹${price.toLocaleString('en-IN')}</b>
              </div>
              <a href="checkout.html?type=activity&id=${bookingId}&guests=2" 
                 style="background:var(--navy); color:#fff; padding:8px 16px; border-radius:6px; font-weight:700; font-size:12px; text-decoration:none; display:inline-block;">
                 Book Gypsy →
              </a>
            </div>

            <div class="actions">
              <a href="tel:+919876543210" aria-label="Call for ${park.name} permits">📞 Permit Help</a>
              <a target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(park.name + ', ' + park.location)}">Directions</a>
              <a href="javascript:void(0)" onclick="if(window.Yatrimap) Yatrimap.openLeadModal('${park.name} Safari Permit')">Enquire Now</a>
            </div>
          </div>
        </article>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading safaris:', err);
    grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:30px; color:#e53e3e;">Unable to load safari permits. Please check server.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadSafaris);
