'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [location, setLocation] = useState('All');
  const [type, setType] = useState('All');
  const [coupleFriendly, setCoupleFriendly] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [sort, setSort] = useState('low');
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, [location, type, coupleFriendly, breakfast, freeCancellation, sort]);

  const fetchHotels = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (location !== 'All') params.set('location', location);
    if (type !== 'All') params.set('type', type);
    if (coupleFriendly) params.set('coupleFriendly', 'true');
    if (breakfast) params.set('breakfast', 'true');
    if (freeCancellation) params.set('freeCancellation', 'true');
    if (sort) params.set('sort', sort);

    try {
      const res = await fetch(`/api/hotels?${params.toString()}`);
      const data = await res.json();
      if (data.success) setHotels(data.hotels);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '36px auto 90px', padding: '0 24px' }}>
      
      {/* Banner routing to Serviced Apartments */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
        border: '1.5px solid #7dd3fc',
        padding: '16px 24px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏡</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)' }}>
              Looking for Private Kitchenettes & Holiday Suites?
            </div>
            <div style={{ fontSize: '12px', color: '#0369a1' }}>
              Explore handpicked 1BHK, 2BHK and mountain villas across Rishikesh, Mussoorie & Dehradun.
            </div>
          </div>
        </div>
        <Link href="/apartments" className="btn-luxury" style={{ padding: '8px 18px', fontSize: '13px' }}>
          Browse Serviced Apartments →
        </Link>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <span className="badge-luxury-cyan">VETTED SANCTUARIES</span>
        <h1 style={{ font: "700 38px/1.2 'Playfair Display', serif", margin: '8px 0 6px', color: 'var(--navy)' }}>
          Himalayan Stays & Boutique Mountain Retreats
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', margin: 0 }}>
          Discover verified riverside luxury hotels, tea estate villas, and mountain view yoga resorts with direct host rates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Filter Sidebar */}
        <aside className="glass-panel" style={{ padding: '24px', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e0f2fe', paddingBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--navy)' }}>Filter Stays</h3>
            <button
              onClick={() => {
                setLocation('All');
                setType('All');
                setCoupleFriendly(false);
                setBreakfast(false);
                setFreeCancellation(false);
              }}
              style={{ background: 'transparent', border: 0, color: 'var(--blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Reset All
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📍 DESTINATION</label>
            <select
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
            >
              <option value="All">All Himalayan Valleys</option>
              <option value="Rishikesh">Rishikesh</option>
              <option value="Dehradun">Dehradun</option>
              <option value="Mussoorie">Mussoorie</option>
              <option value="Nainital">Nainital</option>
              <option value="Auli">Auli</option>
              <option value="Jim Corbett">Jim Corbett</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>🏨 PROPERTY TYPE</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
            >
              <option value="All">All Property Types</option>
              <option value="Hotel">Hotel</option>
              <option value="Resort / Camp">Resort / Camp</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'var(--navy)', fontWeight: 600 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={freeCancellation} onChange={e => setFreeCancellation(e.target.checked)} style={{ accentColor: 'var(--blue)' }} />
              🛡 Free Cancellation
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={breakfast} onChange={e => setBreakfast(e.target.checked)} style={{ accentColor: 'var(--blue)' }} />
              🍳 Breakfast Included
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={coupleFriendly} onChange={e => setCoupleFriendly(e.target.checked)} style={{ accentColor: 'var(--blue)' }} />
              👫 Couple Friendly
            </label>
          </div>
        </aside>

        {/* Main Hotel Listings */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'var(--navy)', fontSize: '15px', fontWeight: 700 }}>
              <b>{hotels.length}</b> verified properties available
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase' }}>Sort by:</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
              >
                <option value="low">💰 Price: Low to High</option>
                <option value="high">💎 Price: High to Low</option>
                <option value="rating">★ Highest Guest Rating</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="skeleton" style={{ height: '220px', borderRadius: '18px' }}></div>
              <div className="skeleton" style={{ height: '220px', borderRadius: '18px' }}></div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="glass-panel" style={{ padding: '50px 30px', textAlign: 'center', background: '#fff' }}>
              <h3>No properties match these filters</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '8px 0 20px' }}>Try resetting some filters or explore all destinations.</p>
              <button onClick={() => { setLocation('All'); setType('All'); }} className="btn-luxury">Reset Filters</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {hotels.map(h => {
                const strike = h.originalPrice || Math.round(h.pricePerNight * 1.25);
                return (
                  <article key={h.id} className="luxury-card" style={{
                    display: 'grid',
                    gridTemplateColumns: '300px 1fr 220px',
                    gap: 0
                  }}>
                    <div style={{ position: 'relative', height: '100%', minHeight: '220px', overflow: 'hidden' }}>
                      <img src={h.heroImage} alt={h.name} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        <span className="badge-luxury-gold">★ {h.rating} ({h.reviewsCount})</span>
                      </div>
                    </div>

                    <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="badge-luxury-cyan">{h.type}</span>
                        {h.coupleFriendly && <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>• Couple Friendly</span>}
                      </div>
                      
                      <h3 style={{ font: "700 22px 'Playfair Display', serif", margin: '4px 0 6px', color: 'var(--navy)' }}>{h.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '0 0 10px' }}>📍 {h.location}</p>
                      <p style={{ fontSize: '13px', color: '#4a5568', margin: '0 0 14px', lineHeight: '1.55' }}>
                        {h.description ? h.description.slice(0, 115) + '...' : ''}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(h.amenities || ['Free WiFi', 'Breakfast', 'River View']).slice(0, 4).map((am, i) => (
                          <span key={i} style={{ background: '#f0f9ff', color: '#0369a1', padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                            ✓ {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div style={{
                      padding: '24px 20px',
                      background: '#f8fcfe',
                      borderLeft: '1px solid #e0f2fe',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      textAlign: 'right'
                    }}>
                      <del style={{ fontSize: '12px', color: '#94a3b8' }}>₹{strike.toLocaleString('en-IN')}</del>
                      <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)' }}>
                        ₹{h.pricePerNight.toLocaleString('en-IN')}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '16px' }}>+ taxes & fees / night</span>
                      
                      <button
                        onClick={() => setSelectedHotel(h)}
                        className="btn-luxury-outline"
                        style={{ width: '100%', padding: '9px', fontSize: '12px', marginBottom: '8px' }}
                      >
                        View Rooms
                      </button>
                      
                      <Link
                        href={`/checkout?productId=${h.id}&productType=hotel&title=${encodeURIComponent(h.name)}&basePrice=${h.pricePerNight}`}
                        className="btn-luxury"
                        style={{ width: '100%', padding: '10px', fontSize: '12px', textAlign: 'center' }}
                      >
                        Book Now →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Room Selection Modal */}
      {selectedHotel && (
        <div className="modal-backdrop-luxury" onClick={() => setSelectedHotel(null)}>
          <div className="modal-content-luxury" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', padding: '30px' }}>
            <button
              onClick={() => setSelectedHotel(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: '1px solid #cbd5e0', background: '#fff', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '16px' }}
            >
              ✕
            </button>
            
            <h3 style={{ font: "700 26px 'Playfair Display', serif", margin: '0 0 4px', color: 'var(--navy)' }}>{selectedHotel.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 24px' }}>📍 {selectedHotel.location} • ★ {selectedHotel.rating}</p>

            <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '0.5px' }}>
              Available Room & Suite Categories
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(selectedHotel.roomTypes || [
                { name: 'Standard Deluxe Mountain View', bed: 'King Bed', price: selectedHotel.pricePerNight, capacity: 2 },
                { name: 'Executive Suite with River Balcony', bed: 'King Bed', price: Math.round(selectedHotel.pricePerNight * 1.35), capacity: 3 }
              ]).map((room, i) => (
                <div key={i} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: '#f8fcfe' }}>
                  <div>
                    <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{room.name}</b>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      {room.bed} • Up to {room.capacity} Guests • Free High Speed WiFi • Mountain Breeze Balcony
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--navy)' }}>₹{room.price.toLocaleString('en-IN')}</div>
                    <Link
                      href={`/checkout?productId=${selectedHotel.id}&productType=hotel&title=${encodeURIComponent(selectedHotel.name + ' - ' + room.name)}&basePrice=${room.price}`}
                      className="btn-luxury"
                      style={{ padding: '8px 16px', fontSize: '12px', marginTop: '6px' }}
                    >
                      Select & Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
