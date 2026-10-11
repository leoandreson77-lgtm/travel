'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [sort, setSort] = useState('low');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('Rishikesh');

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const end = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(end);

    fetch('/api/vehicles?category=car')
      .then(r => r.json())
      .then(d => { if (d.success) setCars(d.vehicles); });
  }, []);

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diff = Math.ceil(Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff || 1);
  };

  const days = calculateDays();

  const filtered = cars.filter(c => activeTab === 'All' || c.type === activeTab);
  if (sort === 'low') filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
  else if (sort === 'high') filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);

  return (
    <div style={{ maxWidth: '1280px', margin: '36px auto 90px', padding: '0 24px' }}>
      
      <div style={{ marginBottom: '28px' }}>
        <span className="badge-luxury-cyan">4X4 & SUV EXPEDITIONS</span>
        <h1 style={{ font: "700 38px/1.2 'Playfair Display', serif", margin: '8px 0 6px', color: 'var(--navy)' }}>
          Self-Drive Fleet & Mountain SUVs
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', margin: 0 }}>
          Certified Mahindra Thar 4x4, Toyota Fortuner, and compact hatchbacks with zero security deposit headaches and unlimited mountain kilometers.
        </p>
      </div>

      {/* Date & Location Search Bar */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, #0e354b 0%, #164b68 100%)',
        padding: '22px 28px',
        color: '#fff',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 160px',
        gap: '16px',
        marginBottom: '32px',
        alignItems: 'flex-end'
      }}>
        <div>
          <label style={{ fontSize: '11px', color: '#bae6fd', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📍 PICKUP CITY</label>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            style={{ width: '100%', background: '#fff', color: 'var(--navy)', border: '1.5px solid #7dd3fc', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, outline: 'none' }}
          >
            <option>Rishikesh (Tapovan / Helipad)</option>
            <option>Dehradun (Jolly Grant Airport)</option>
            <option>Haridwar (Railway Junction)</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#bae6fd', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📅 START DATE</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{ width: '100%', background: '#fff', color: 'var(--navy)', border: '1.5px solid #7dd3fc', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#bae6fd', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📅 RETURN DATE</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{ width: '100%', background: '#fff', color: 'var(--navy)', border: '1.5px solid #7dd3fc', padding: '10px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, outline: 'none' }}
          />
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', padding: '9px 12px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <small style={{ fontSize: '10px', color: '#bae6fd', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Total Duration</small>
          <b style={{ fontSize: '15px', color: '#fff' }}>{days} {days === 1 ? 'Day' : 'Days'}</b>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '26px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['All', 'SUV', 'Hatchback', 'Sedan'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`chip-interactive ${activeTab === t ? 'active' : ''}`}
            >
              {t === 'All' ? '🚗 All Cars' : t}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>{filtered.length} vehicles available</span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', background: '#fff', outline: 'none', fontWeight: 600, color: 'var(--navy)' }}
          >
            <option value="low">💰 Price: Low to High</option>
            <option value="high">💎 Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Car Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '26px' }}>
        {filtered.map(car => {
          const strike = car.originalPrice || Math.round(car.pricePerDay * 1.25);
          const total = car.pricePerDay * days;
          return (
            <article key={car.id} className="luxury-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                <img src={car.image} alt={car.name} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span className="badge-luxury-gold">★ {car.rating || 4.8}</span>
                  <span className="badge-luxury-cyan">{car.seats} Seats</span>
                </div>
              </div>

              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase' }}>
                    {car.type} • Unlimited KM
                  </span>
                  <span className="badge-luxury-emerald">Zero Deposit</span>
                </div>

                <h3 style={{ font: "700 22px 'Playfair Display', serif", margin: '4px 0 6px', color: 'var(--navy)' }}>
                  {car.name}
                </h3>
                
                <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 16px' }}>
                  {car.specs || `${car.fuel || 'Diesel / Petrol'} • 4x4 / All-Terrain • Sanitized AC`}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '16px', marginTop: 'auto' }}>
                  <div>
                    <del style={{ fontSize: '11px', color: '#94a3b8' }}>₹{strike.toLocaleString('en-IN')}</del>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>
                      ₹{car.pricePerDay.toLocaleString('en-IN')} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--muted)' }}>/ day</span>
                    </div>
                    <small style={{ color: 'var(--muted)', fontSize: '11px', display: 'block', marginTop: '2px' }}>
                      Total for {days} {days === 1 ? 'day' : 'days'}: <b style={{ color: 'var(--navy)' }}>₹{total.toLocaleString('en-IN')}</b>
                    </small>
                  </div>

                  <Link
                    href={`/checkout?productId=${car.id}&productType=vehicle&title=${encodeURIComponent(car.name)}&basePrice=${total}&days=${days}&startDate=${startDate}&endDate=${endDate}`}
                    className="btn-luxury"
                    style={{ padding: '10px 18px', fontSize: '12px' }}
                  >
                    Reserve Car →
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
