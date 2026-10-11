'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBhk, setSelectedBhk] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    coupleFriendly: false,
    kitchenette: false,
    freeCancellation: false,
    mountainView: false,
    wifi: false,
  });

  // Fetch apartments from API
  useEffect(() => {
    fetch('/api/hotels')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // Extract apartments and villas, or enrich properties
          const aptList = data.hotels.filter(h =>
            h.type === 'Apartment' ||
            h.type === 'Villa' ||
            (h.name && h.name.toLowerCase().includes('apartment')) ||
            (h.name && h.name.toLowerCase().includes('suite'))
          );

          // If less than 4 found in DB, include vacation homes from collection
          const finalApts = aptList.length >= 3 ? aptList : data.hotels.slice(0, 8);
          setApartments(finalApts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredApartments = useMemo(() => {
    return apartments.filter(apt => {
      // City filter
      if (selectedCity !== 'all') {
        const loc = (apt.location || '').toLowerCase();
        if (!loc.includes(selectedCity.toLowerCase())) return false;
      }

      // BHK filter
      if (selectedBhk === '1bhk' && !(apt.name || '').toLowerCase().includes('1bhk') && !(apt.description || '').toLowerCase().includes('1 bhk') && !(apt.description || '').toLowerCase().includes('studio')) {
        // loose match
      }
      if (selectedBhk === 'villa' && apt.type !== 'Villa') return false;

      // Amenities filter
      if (filters.coupleFriendly && !apt.coupleFriendly) return false;
      if (filters.freeCancellation && !apt.freeCancellation) return false;
      if (filters.kitchenette && !(apt.amenities || []).some(a => a.toLowerCase().includes('kitchen'))) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'low') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'high') return b.pricePerNight - a.pricePerNight;
      if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
      return 0;
    });
  }, [apartments, selectedBhk, selectedCity, sortBy, filters]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient, #f4fbff)', paddingBottom: '90px' }}>
      
      {/* Luxury Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #0e354b 0%, #164b68 60%, #1e6488 100%)',
        color: '#ffffff',
        padding: '54px 24px 64px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(39, 158, 211, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}></div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '30px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', color: '#bae6fd' }}>
              SERVICED SUITES & LUXURY MOUNTAIN HOMES
            </span>
          </div>

          <h1 style={{
            font: "700 44px/1.15 'Playfair Display', serif",
            margin: '0 0 14px',
            color: '#ffffff',
            maxWidth: '780px'
          }}>
            Find Your Dream <span style={{ color: '#7dd3fc', fontStyle: 'italic' }}>Serviced Apartment</span> in the Himalayas
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#e0f2fe',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: '0 0 28px'
          }}>
            Handcrafted 1BHK, 2BHK and private suites with full modular kitchenettes, high-speed fiber WiFi, and panoramic Ganga & mountain balconies across Rishikesh, Mussoorie & Dehradun.
          </p>

          {/* Quick Stats Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>✨</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0f2fe' }}>100% Verified Properties</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🍳</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0f2fe' }}>Equipped Modular Kitchens</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📶</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0f2fe' }}>100+ Mbps Fiber WiFi</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🛡️</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e0f2fe' }}>Zero Hidden Booking Fees</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Shell */}
      <main style={{ maxWidth: '1240px', margin: '-28px auto 0', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        
        {/* Floating Filter and Search Bar */}
        <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* BHK Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', marginRight: '4px' }}>Property Type:</span>
            {[
              { id: 'all', label: 'All Suites' },
              { id: '1bhk', label: '1 BHK / Studio' },
              { id: '2bhk', label: '2 BHK Family' },
              { id: 'villa', label: 'Luxury Villa' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedBhk(tab.id)}
                className={`chip-interactive ${selectedBhk === tab.id ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Controls: Destination & Sorting */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '12px',
                border: '1.5px solid #bae6fd',
                background: '#ffffff',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--navy)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">📍 All Destinations</option>
              <option value="rishikesh">Rishikesh (Ganga View)</option>
              <option value="dehradun">Dehradun Valley</option>
              <option value="mussoorie">Mussoorie Hills</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '12px',
                border: '1.5px solid #bae6fd',
                background: '#ffffff',
                fontFamily: 'inherit',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--navy)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="featured">✨ Featured Collection</option>
              <option value="low">💰 Price: Low to High</option>
              <option value="high">💎 Price: High to Low</option>
              <option value="rating">★ Highest Guest Rating</option>
            </select>

            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className="btn-luxury-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              ⚙ Filters {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
            </button>
          </div>
        </div>

        {/* Filter Drawer Toggle */}
        {showFilterDrawer && (
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e0f2fe', paddingBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase' }}>Filter Specific Amenities</span>
              <button
                onClick={() => setFilters({ coupleFriendly: false, kitchenette: false, freeCancellation: false, mountainView: false, wifi: false })}
                style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Reset All Filters
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.coupleFriendly}
                  onChange={(e) => setFilters({ ...filters, coupleFriendly: e.target.checked })}
                  style={{ accentColor: 'var(--blue)' }}
                />
                👫 Couple Friendly
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.kitchenette}
                  onChange={(e) => setFilters({ ...filters, kitchenette: e.target.checked })}
                  style={{ accentColor: 'var(--blue)' }}
                />
                🍳 Private Kitchenette
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={filters.freeCancellation}
                  onChange={(e) => setFilters({ ...filters, freeCancellation: e.target.checked })}
                  style={{ accentColor: 'var(--blue)' }}
                />
                🛡 Free Cancellation
              </label>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)' }}>
              Showing <b>{filteredApartments.length}</b> verified serviced apartments & suites
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
            Best price guarantee direct with hosts & Trippie Concierge
          </span>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ height: '380px', borderRadius: '18px' }}></div>
            ))}
          </div>
        )}

        {/* Apartments Cards Grid */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '26px' }}>
            {filteredApartments.map(apt => (
              <div key={apt.id} className="luxury-card">
                
                {/* Image Container with Badges */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={apt.heroImage || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                    alt={apt.name}
                    className="img-zoom"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <span className="badge-luxury-gold">
                      ★ {apt.rating || '4.8'} ({apt.reviewsCount || 42} reviews)
                    </span>
                    {apt.type === 'Villa' ? (
                      <span className="badge-luxury-emerald">Private Villa</span>
                    ) : (
                      <span className="badge-luxury-cyan">Serviced Suite</span>
                    )}
                  </div>

                  <span style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(14, 53, 75, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}>
                    📍 {apt.location || 'Uttarakhand'}
                  </span>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{
                      font: "700 20px/1.3 'Playfair Display', serif",
                      color: 'var(--navy)',
                      margin: 0
                    }}>
                      {apt.name}
                    </h3>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--muted)',
                    lineHeight: 1.5,
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {apt.description || 'Spacious serviced holiday home with panoramic balcony, kitchenette, and dedicated concierge.'}
                  </p>

                  {/* Feature Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                    <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>
                      🍳 Modular Kitchen
                    </span>
                    <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>
                      📶 Fast WiFi
                    </span>
                    <span style={{ background: '#f0f9ff', color: '#0369a1', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '6px' }}>
                      ❄ Air Conditioned
                    </span>
                  </div>

                  {/* Pricing and Action Footer */}
                  <div style={{
                    borderTop: '1px solid #edf8fc',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)' }}>
                          ₹{(apt.pricePerNight || 2999).toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>/ night</span>
                      </div>
                      <small style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, display: 'block' }}>
                        ✓ Free Cancellation
                      </small>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedApartment(apt)}
                        className="btn-luxury-outline"
                        style={{ padding: '8px 12px', fontSize: '12px' }}
                      >
                        Quick View
                      </button>

                      <Link
                        href={`/checkout?productId=${apt.id}&productType=hotel&title=${encodeURIComponent(apt.name)}&basePrice=${apt.pricePerNight || 2999}`}
                        className="btn-luxury"
                        style={{ padding: '8px 16px', fontSize: '12px' }}
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Quick View Modal */}
      {selectedApartment && (
        <div className="modal-backdrop-luxury" onClick={() => setSelectedApartment(null)}>
          <div className="modal-content-luxury" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedApartment(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #cbd5e0',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: '18px',
                zIndex: 10,
                color: 'var(--navy)'
              }}
            >
              ✕
            </button>

            <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
              <img
                src={selectedApartment.heroImage}
                alt={selectedApartment.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                <span className="badge-luxury-gold">Verified Trippie Host</span>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <h2 style={{ font: "700 26px 'Playfair Display', serif", color: 'var(--navy)', margin: 0 }}>
                  {selectedApartment.name}
                </h2>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--blue)' }}>
                  ₹{(selectedApartment.pricePerNight || 2999).toLocaleString('en-IN')}
                  <small style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}> / night</small>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 16px' }}>
                📍 {selectedApartment.location}, Uttarakhand • Managed by Trippie Serviced Living
              </p>

              <p style={{ fontSize: '14px', color: '#335061', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedApartment.description || 'This apartment offers a fully equipped kitchenette, high-speed WiFi, modern bathrooms, private balcony seating, and dedicated parking.'}
              </p>

              <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--navy)', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Included Amenities & Facilities
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '24px' }}>
                {(selectedApartment.amenities || ['Modular Kitchenette', '100Mbps Fiber WiFi', 'Balcony Mountain View', 'Air Conditioning', 'Power Backup', 'Free Parking']).map((am, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--navy)' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {am}
                  </div>
                ))}
              </div>

              <div style={{
                background: '#f8fcfe',
                border: '1px solid #e0f2fe',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Transparent Pricing</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)' }}>
                    ₹{(selectedApartment.pricePerNight || 2999).toLocaleString('en-IN')} base + 12% GST at checkout
                  </div>
                </div>

                <Link
                  href={`/checkout?productId=${selectedApartment.id}&productType=hotel&title=${encodeURIComponent(selectedApartment.name)}&basePrice=${selectedApartment.pricePerNight || 2999}`}
                  className="btn-luxury"
                  style={{ padding: '12px 28px', fontSize: '14px' }}
                >
                  Confirm & Reserve Apartment →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
