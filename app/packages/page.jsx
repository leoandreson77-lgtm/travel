'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCat, setCurrentCat] = useState('All');
  const [sort, setSort] = useState('pop');
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(d => {
        if (d.success) setPackages(d.packages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = packages.filter(p => {
    if (currentCat === 'All') return true;
    if (currentCat === 'Pilgrimage') return p.category === 'Pilgrimage' || p.title.includes('Kedarnath') || p.title.includes('Char Dham');
    if (currentCat === 'Adventure') return p.category === 'Adventure' || p.title.includes('Trek');
    if (currentCat === 'Wildlife') return p.category === 'Wildlife' || p.title.includes('Safari');
    return true;
  });

  if (sort === 'low') filtered.sort((a, b) => a.price - b.price);
  else if (sort === 'high') filtered.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div style={{ maxWidth: '1300px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', letterSpacing: '1.5px' }}>
          CURATED HIMALAYAN EXPEDITIONS
        </span>
        <h1 style={{ font: "700 42px 'Playfair Display', serif", margin: '8px 0 10px', color: 'var(--navy)' }}>
          All-Inclusive Tour Packages & Pilgrimages
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '680px', margin: '0 auto' }}>
          Handcrafted itineraries featuring verified mountain hotels, certified temple guides, helicopter slots, and private 4x4 transfers.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', background: '#fff', padding: '16px 24px', borderRadius: '12px', border: '1px solid #d9f0fb', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'Pilgrimage', 'Adventure', 'Wildlife'].map(cat => (
            <button
              key={cat}
              onClick={() => setCurrentCat(cat)}
              style={{
                background: currentCat === cat ? 'var(--navy)' : '#f7fafc',
                color: currentCat === cat ? '#fff' : 'var(--navy)',
                border: '1px solid',
                borderColor: currentCat === cat ? 'var(--navy)' : '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {cat === 'All' ? 'All Packages' : cat === 'Pilgrimage' ? 'Char Dham & Yatra' : cat === 'Adventure' ? 'Trekking' : 'Wildlife Safari'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{filtered.length} packages found</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', background: '#fff' }}
          >
            <option value="pop">Recommended</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="skeleton" style={{ height: '320px', borderRadius: '16px' }}></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '26px' }}>
          {filtered.map(p => {
            const strike = p.originalPrice || Math.round(p.price * 1.25);
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
                <div style={{ position: 'relative', height: '220px' }}>
                  <img src={p.coverImage || p.heroImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(22,75,104,0.92)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                    {p.type || 'Private Tour'}
                  </span>
                  <span style={{ position: 'absolute', bottom: '12px', right: '12px', background: '#fff', color: '#d97706', padding: '4px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 800 }}>
                    ★ {p.rating || 4.9}
                  </span>
                </div>
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)', marginBottom: '6px' }}>
                    📍 {p.destination} • ⏱ {p.duration}
                  </div>
                  <h3 style={{ font: "700 21px 'Playfair Display', serif", margin: '0 0 8px', color: 'var(--navy)' }}>{p.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 16px', flex: 1 }}>
                    {p.overview ? p.overview.slice(0, 110) + '...' : (p.highlights || 'All-inclusive tour with vetted mountain stays and private transfers.')}
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {(p.inclusions || ['Hotel Stay', 'Private Cab', 'Breakfast & Dinner']).slice(0, 3).map((inc, i) => (
                      <span key={i} style={{ background: '#f0f9ff', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>✓ {inc}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '14px' }}>
                    <div>
                      <del style={{ fontSize: '11px', color: '#a0aec0' }}>₹{strike.toLocaleString('en-IN')}</del>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>₹{p.price.toLocaleString('en-IN')} <small style={{ fontSize: '11px', fontWeight: 400 }}>/ person</small></div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setSelectedPkg(p)} style={{ background: '#f7fafc', border: '1px solid #cbd5e0', padding: '8px 12px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Itinerary</button>
                      <Link href={`/checkout?type=package&id=${p.id}&guests=2`} style={{ background: 'var(--navy)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '12px', textDecoration: 'none' }}>Book Now</Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Package Day-by-Day Modal */}
      {selectedPkg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '28px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setSelectedPkg(null)} style={{ position: 'absolute', top: '16px', right: '16px', border: 0, background: '#edf2f7', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 6px', color: 'var(--navy)' }}>{selectedPkg.title}</h3>
            <p style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '13px', margin: '0 0 16px' }}>📍 {selectedPkg.destination} • ⏱ {selectedPkg.duration}</p>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4a5568', margin: '0 0 20px' }}>{selectedPkg.overview || selectedPkg.highlights}</p>

            <h4 style={{ margin: '0 0 12px', fontSize: '15px', color: 'var(--navy)' }}>Day-by-Day Itinerary</h4>
            <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              {(selectedPkg.dayWiseItinerary || [
                { day: 1, title: 'Arrival & Scenic Transfer', desc: 'Welcome pickup by your dedicated chauffeur and transfer to your luxury mountain resort.' },
                { day: 2, title: 'Guided Sightseeing & Exploration', desc: 'Full-day escorted excursion with certified local guide and temple darshan.' },
                { day: 3, title: 'Departure with Cherished Memories', desc: 'Morning leisure breakfast and transfer back to airport/station.' }
              ]).map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ background: 'var(--navy)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>{d.day}</div>
                  <div>
                    <b style={{ color: 'var(--navy)', fontSize: '14px', display: 'block' }}>{d.title}</b>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5' }}>{d.desc || d.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #edf2f7', paddingTop: '16px' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Starting from</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)' }}>₹{selectedPkg.price.toLocaleString('en-IN')} <small style={{ fontSize: '12px', fontWeight: 400 }}>/ person</small></div>
              </div>
              <Link href={`/checkout?type=package&id=${selectedPkg.id}&guests=2`} style={{ background: 'var(--navy)', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                Proceed to Booking →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
