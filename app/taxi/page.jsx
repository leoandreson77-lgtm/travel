'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TaxiPage() {
  const [taxis, setTaxis] = useState([]);
  const [activeType, setActiveType] = useState('All');
  const [sort, setSort] = useState('low');
  const [pickup, setPickup] = useState('Rishikesh, Uttarakhand');

  useEffect(() => {
    fetch('/api/vehicles?category=taxi')
      .then(r => r.json())
      .then(d => { if (d.success) setTaxis(d.vehicles); });
  }, []);

  const filtered = taxis.filter(t => activeType === 'All' || t.type === activeType);
  if (sort === 'low') filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
  else if (sort === 'high') filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ font: "700 36px 'Playfair Display', serif", margin: '0 0 6px', color: 'var(--navy)' }}>Dedicated Taxis & Airport Transfers</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Book verified mountain chauffeurs at transparent rates. Clean AC sedans, Innova Crystas, and tempo travellers.</p>
      </div>

      <div style={{ background: '#f0f9ff', padding: '16px 20px', borderRadius: '10px', border: '1px solid #bae6fd', color: '#0369a1', fontSize: '13px', fontWeight: 600, marginBottom: '24px' }}>
        ⓘ Certified licensed hill drivers with verified police credentials meet you at your pickup point. Tolls & parking as per actual receipts.
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'SUV', 'Sedan', 'Luxury SUV', 'Group Van'].map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              style={{
                background: activeType === t ? 'var(--navy)' : '#fff',
                color: activeType === t ? '#fff' : 'var(--navy)',
                border: '1px solid #cbd5e0',
                padding: '8px 18px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {t === 'All' ? 'All Taxis' : t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{filtered.length} taxis available</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', background: '#fff' }}>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filtered.map(taxi => {
          const strike = taxi.originalPrice || Math.round(taxi.pricePerDay * 1.25);
          return (
            <article key={taxi.id} style={{
              background: '#fff',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid #e2f0f7',
              boxShadow: '0 4px 14px rgba(22,75,104,0.06)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img src={taxi.image} alt={taxi.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue)' }}>★ {taxi.rating || 4.8} • {taxi.type}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#2b6cb0' }}>{taxi.seats} Seats</span>
                </div>
                <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 6px', color: 'var(--navy)' }}>{taxi.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 14px' }}>{taxi.specs || 'Includes commercial tourist permit & hill chauffeur.'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '14px', marginTop: 'auto' }}>
                  <div>
                    <del style={{ fontSize: '11px', color: '#a0aec0' }}>₹{strike.toLocaleString('en-IN')}</del>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>₹{taxi.pricePerDay.toLocaleString('en-IN')} <span style={{ fontSize: '11px', fontWeight: 400 }}>/ day</span></div>
                  </div>
                  <Link
                    href={`/checkout?type=taxi&id=${taxi.id}&days=1&pickup=${encodeURIComponent(pickup)}`}
                    style={{ background: 'var(--navy)', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}
                  >
                    Book Cab
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
