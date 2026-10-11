'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DestinationsCatalogPage() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/destinations')
      .then(r => r.json())
      .then(d => { if (d.success) setDestinations(d.destinations); });
  }, []);

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', letterSpacing: '1.5px' }}>
          EXPLORE SACRED HIMALAYAS
        </span>
        <h1 style={{ font: "700 44px 'Playfair Display', serif", margin: '8px 0 14px', color: 'var(--navy)' }}>
          Himalayan Destinations & Pilgrimage Circuits
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '16px', maxWidth: '650px', margin: '0 auto 24px' }}>
          From the holy Ganges ghats of Rishikesh to high-altitude shrines of Kedarnath, explore our comprehensive travel guides.
        </p>
        <input
          type="text"
          placeholder="⌕ Search destination by name, lake, temple or vibe..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '480px', padding: '12px 18px', borderRadius: '30px', border: '1px solid #cbd5e0', fontSize: '14px', outline: 0 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '28px' }}>
        {filtered.map(d => (
          <Link key={d.id} href={`/destination/${d.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e2f0f7',
              boxShadow: '0 4px 16px rgba(22,75,104,0.06)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ position: 'relative', height: '220px' }}>
                <img src={d.heroImage} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(22,75,104,0.85)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  {d.weather ? `${d.weather.temp} • ${d.weather.condition}` : 'Pleasant'}
                </span>
              </div>
              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase' }}>{d.state}, {d.country}</span>
                <h3 style={{ font: "700 22px 'Playfair Display', serif", margin: '6px 0 8px', color: 'var(--navy)' }}>{d.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.55', margin: '0 0 16px', flex: 1 }}>{d.tagline || d.description.slice(0, 110) + '...'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Starting from</span>
                    <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--navy)' }}>₹{(d.startingPrice || 2499).toLocaleString('en-IN')}</div>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--blue)' }}>Explore Guide →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
