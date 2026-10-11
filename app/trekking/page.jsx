'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TrekkingPage() {
  const [treks, setTreks] = useState([]);
  const [activeVibe, setActiveVibe] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTrek, setSelectedTrek] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetch('/api/activities')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          const list = d.activities.filter(a => ['trekking', 'adventure', 'camping'].includes(a.category.toLowerCase()));
          setTreks(list.length ? list : d.activities);
        }
      });

    try {
      const favs = JSON.parse(localStorage.getItem('trippie_fav_treks') || localStorage.getItem('yatrimap_fav_treks') || '[]');
      setFavorites(favs);
    } catch (e) {}
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter(x => x !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem('trippie_fav_treks', JSON.stringify(updated));
  };

  const filtered = treks.filter(t => {
    const matchVibe = activeVibe === 'All' || t.category.toLowerCase() === activeVibe.toLowerCase() || (t.difficulty && t.difficulty.toLowerCase() === activeVibe.toLowerCase());
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.highlights && t.highlights.toLowerCase().includes(search.toLowerCase()));
    return matchVibe && matchSearch;
  });

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', letterSpacing: '2px' }}>
          UN-CANCEL YOUR OUTDOOR ERA
        </span>
        <h1 style={{ font: "700 44px 'Playfair Display', serif", margin: '8px 0 10px', color: 'var(--navy)' }}>
          Serotonin Dumps & High-Altitude Vibes
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '640px', margin: '0 auto 24px' }}>
          Pure aesthetics, alpine glacial lakes, snowy summits, and peak weekend resets. Certified guides and high-altitude safety equipment.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <input
            type="text"
            placeholder="⌕ Search by lake, peak, difficulty or vibe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', maxWidth: '450px', padding: '10px 18px', borderRadius: '30px', border: '1px solid #cbd5e0', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px', overflowX: 'auto' }}>
        {['All', 'Trekking', 'Adventure', 'Camping', 'Moderate'].map(v => (
          <button
            key={v}
            onClick={() => setActiveVibe(v)}
            style={{
              background: activeVibe === v ? 'var(--navy)' : '#fff',
              color: activeVibe === v ? '#fff' : 'var(--navy)',
              border: '1px solid #cbd5e0',
              padding: '8px 20px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {v === 'All' ? 'All Expeditions' : v}
          </button>
        ))}
      </div>

      {/* Trek Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '26px' }}>
        {filtered.map(t => {
          const isFav = favorites.includes(t.id);
          return (
            <article
              key={t.id}
              onClick={() => setSelectedTrek(t)}
              style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2f0f7',
                boxShadow: '0 4px 16px rgba(22,75,104,0.06)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '220px' }}>
                <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={(e) => toggleFavorite(t.id, e)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#fff',
                    border: 0,
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    fontSize: '16px',
                    color: isFav ? '#e53e3e' : '#a0aec0',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  {isFav ? '♥' : '♡'}
                </button>
                <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(22,75,104,0.9)', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                  {t.difficulty || 'Moderate'} • {t.altitude || '12,500 ft'}
                </span>
              </div>
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue)', marginBottom: '4px' }}>📍 {t.location}</span>
                <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 8px', color: 'var(--navy)' }}>{t.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.5', margin: '0 0 16px', flex: 1 }}>“{t.highlights ? t.highlights.slice(0, 95) + '...' : ''}”</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Starting from</span>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>₹{t.price.toLocaleString('en-IN')}</div>
                  </div>
                  <Link href={`/checkout?type=activity&id=${t.id}`} onClick={e => e.stopPropagation()} style={{ background: 'var(--navy)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                    Claim Spot →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Trek Detail Modal */}
      {selectedTrek && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '28px', position: 'relative' }}>
            <button onClick={() => setSelectedTrek(null)} style={{ position: 'absolute', top: '16px', right: '16px', border: 0, background: '#edf2f7', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            <img src={selectedTrek.image} alt={selectedTrek.name} style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
            <span style={{ color: 'var(--blue)', fontSize: '12px', fontWeight: 700 }}>📍 {selectedTrek.location} • {selectedTrek.difficulty}</span>
            <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '4px 0 10px', color: 'var(--navy)' }}>{selectedTrek.name}</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#4a5568', margin: '0 0 16px' }}>{selectedTrek.highlights}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f7fafc', padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px' }}>
              <div><small style={{ color: 'var(--muted)', display: 'block' }}>Duration</small><b>{selectedTrek.duration || '3 Days'}</b></div>
              <div><small style={{ color: 'var(--muted)', display: 'block' }}>Altitude</small><b>{selectedTrek.altitude || '12,500 ft'}</b></div>
              <div><small style={{ color: 'var(--muted)', display: 'block' }}>Rate</small><b>₹{selectedTrek.price.toLocaleString('en-IN')}</b></div>
            </div>
            <Link href={`/checkout?type=activity&id=${selectedTrek.id}`} style={{ display: 'block', textAlign: 'center', background: 'var(--navy)', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              Reserve Spot Instantly →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
