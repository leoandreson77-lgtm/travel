'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JungleSafariPage() {
  const [safaris, setSafaris] = useState([]);

  useEffect(() => {
    fetch('/api/activities')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const list = d.activities.filter(a => a.category === 'safari');
          setSafaris(list);
        }
      });
  }, []);

  const parks = [
    {
      id: 'act-7',
      name: 'Jim Corbett National Park',
      location: 'Ramnagar, Uttarakhand',
      rating: '4.9',
      reviews: '34.7K',
      highlight: 'India’s premier tiger reserve. Track Royal Bengal Tigers, wild elephant herds, and scenic Ramganga riverbanks in open 4x4 gypsies.',
      image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=900&q=80',
      price: 4299
    },
    {
      id: 'act-15',
      name: 'Ranthambore National Park',
      location: 'Sawai Madhopur, Rajasthan',
      rating: '4.8',
      reviews: '13.0K',
      highlight: 'Famous for high chances of spotting tigers roaming amid ancient 10th-century ruins and royal fort lakes.',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
      price: 3899
    },
    {
      id: 'act-16',
      name: 'Rajaji National Park',
      location: 'Haridwar / Rishikesh, Uttarakhand',
      rating: '4.7',
      reviews: '8.4K',
      highlight: 'Vital Shivalik elephant corridor and tiger habitat situated right at the foothills between Rishikesh and Haridwar.',
      image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80',
      price: 2999
    },
    {
      id: 'act-safari-bandhavgarh',
      name: 'Bandhavgarh National Park',
      location: 'Umaria, Madhya Pradesh',
      rating: '4.9',
      reviews: '4.2K',
      highlight: 'Boasts the highest known density of Royal Bengal Tigers in central India, set around dramatic cliffs and sal forests.',
      image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80',
      price: 4599
    },
    {
      id: 'act-safari-gir',
      name: 'Gir National Park',
      location: 'Junagadh, Gujarat',
      rating: '4.8',
      reviews: '9.6K',
      highlight: 'The last natural refuge on earth for the rare and magnificent Asiatic Lion in dry deciduous teak scrub forests.',
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=80',
      price: 3999
    },
    {
      id: 'act-safari-kaziranga',
      name: 'Kaziranga National Park',
      location: 'Golaghat, Assam',
      rating: '4.9',
      reviews: '9.4K',
      highlight: 'UNESCO World Heritage Site sheltering two-thirds of the world’s great one-horned rhinoceros population.',
      image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=900&q=80',
      price: 4899
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', letterSpacing: '2px' }}>
          WILD INDIA AWAITS
        </span>
        <h1 style={{ font: "700 44px 'Playfair Display', serif", margin: '8px 0 10px', color: 'var(--navy)' }}>
          Top Safari Destinations & Tiger Reserves
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
          Book verified 4x4 open gypsy permits, certified forest naturalists, and luxury jungle lodges across India’s premier national parks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '26px' }}>
        {parks.map((p, idx) => {
          const matched = safaris.find(s => s.name.toLowerCase().includes(p.name.toLowerCase()));
          const bookingId = matched ? matched.id : 'act-7';
          const price = matched ? matched.price : p.price;

          return (
            <article key={p.id} style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e2f0f7',
              boxShadow: '0 4px 16px rgba(22,75,104,0.06)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--blue)', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '13px', fontWeight: 800 }}>
                  {idx + 1}
                </span>
              </div>
              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue)', marginBottom: '4px' }}>📍 {p.location}</span>
                <h3 style={{ font: "700 21px 'Playfair Display', serif", margin: '0 0 8px', color: 'var(--navy)' }}>{p.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.55', margin: '0 0 16px', flex: 1 }}>{p.highlight}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '14px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>Permit + 4x4 Gypsy</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>₹{price.toLocaleString('en-IN')}</div>
                  </div>
                  <Link
                    href={`/checkout?type=activity&id=${bookingId}&guests=2`}
                    style={{ background: 'var(--navy)', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                  >
                    Book Gypsy →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
