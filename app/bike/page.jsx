'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BikePage() {
  const [bikes, setBikes] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [city, setCity] = useState('Rishikesh');
  const [sort, setSort] = useState('low');

  useEffect(() => {
    fetch('/api/vehicles?category=bike')
      .then(r => r.json())
      .then(d => { if (d.success) setBikes(d.vehicles); });
  }, []);

  const filtered = bikes.filter(b => {
    const tabMatch = activeTab === 'All' || b.type.toLowerCase() === activeTab.toLowerCase();
    const cityMatch = !city || !b.availableLocations || b.availableLocations.some(l => l.toLowerCase().includes(city.toLowerCase()));
    return tabMatch && cityMatch;
  });

  if (sort === 'low') filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
  else if (sort === 'high') filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ font: "700 36px 'Playfair Display', serif", margin: '0 0 6px', color: 'var(--navy)' }}>Bike Rentals in Uttarakhand</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Rent Royal Enfield Classic 350, Himalayan 450, and sports bikes with complimentary sanitized helmets.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'Cruiser', 'Adventure', 'Sports', 'Commuter', 'Electric'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                background: activeTab === t ? 'var(--navy)' : '#fff',
                color: activeTab === t ? '#fff' : 'var(--navy)',
                border: '1px solid #cbd5e0',
                padding: '8px 18px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {t === 'All' ? 'All Bikes' : t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select value={city} onChange={e => setCity(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', background: '#fff' }}>
            <option value="Rishikesh">Rishikesh</option>
            <option value="Dehradun">Dehradun</option>
            <option value="Haridwar">Haridwar</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', background: '#fff' }}>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '22px' }}>
        {filtered.map(b => (
          <article key={b.id} style={{
            background: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #e2f0f7',
            padding: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(22,75,104,0.06)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <img src={b.image} alt={b.name} style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '10px' }} />
            <span style={{ fontSize: '11px', color: 'var(--blue)', fontWeight: 700 }}>{b.type} • Helmet included</span>
            <h3 style={{ fontSize: '16px', margin: '4px 0 8px', color: 'var(--navy)' }}>{b.name}</h3>
            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f0f7fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Daily Rate</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>₹{b.pricePerDay.toLocaleString('en-IN')}</div>
              </div>
              <Link href={`/checkout?type=vehicle&id=${b.id}&city=${encodeURIComponent(city)}`} style={{ background: 'var(--orange)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                Rent Now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
