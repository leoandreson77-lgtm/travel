'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Hotels');
  const [destinations, setDestinations] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  // Form states
  const [location, setLocation] = useState('Rishikesh');
  const [type, setType] = useState('Hotel');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Hero carousel
  const [slide, setSlide] = useState(0);
  const heroImages = [
    'https://images.unsplash.com/photo-1532978379173-523e16f371f2?auto=format&fit=crop&w=2000&q=85',
    'https://images.unsplash.com/photo-1605538883669-82524632f1a5?auto=format&fit=crop&w=2000&q=85',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2000&q=85'
  ];

  const labels = {
    Hotels: ['Property Type', 'Check-in', 'Check-out', ['Hotel', 'Resort / Camp', 'Villa', 'Luxury Home Stay']],
    Apartments: ['Suite Type', 'Check-in', 'Check-out', ['1 BHK Studio', '2 BHK Family Suite', 'Mountain Villa', 'Penthouse']],
    Rental: ['Vehicle Class', 'Pick-up Date', 'Return Date', ['Car', 'Taxi', 'Motorbike', 'Scooty']],
    Activities: ['Adventure Category', 'Activity Date', 'Return Date', ['Rafting', 'Bungee Jumping', 'Trekking', 'Paragliding']],
    CharDham: ['Yatra Circuit', 'Start Date', 'Return Date', ['Complete Char Dham', 'Do Dham (Kedarnath + Badrinath)', 'Kedarnath Helipad VIP', 'Yamunotri + Gangotri']]
  };

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const future = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    setStartDate(today);
    setEndDate(future);

    const interval = setInterval(() => {
      setSlide(s => (s + 1) % heroImages.length);
    }, 6000);

    fetch('/api/destinations')
      .then(r => r.json())
      .then(d => { if (d.success) setDestinations(d.destinations.slice(0, 6)); });

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (activeTab === 'Hotels') {
      router.push(`/hotels?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`);
    } else if (activeTab === 'Apartments') {
      router.push(`/apartments?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`);
    } else if (activeTab === 'Rental') {
      if (type === 'Car') router.push(`/cars?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`);
      else if (type === 'Taxi') router.push(`/taxi?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`);
      else if (type === 'Motorbike') router.push(`/bike?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`);
      else router.push(`/scooty?location=${encodeURIComponent(location)}&start=${startDate}&end=${endDate}`);
    } else if (activeTab === 'Activities') {
      router.push(`/trekking?activity=${encodeURIComponent(type)}&location=${encodeURIComponent(location)}`);
    } else if (activeTab === 'CharDham') {
      router.push(`/packages?category=Pilgrimage&destination=Kedarnath&start=${startDate}`);
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const [field1Label, field2Label, field3Label, field1Options] = labels[activeTab] || labels.Hotels;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ position: 'relative', minHeight: '660px', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '60px 0' }}>
        {heroImages.map((img, i) => (
          <div
            key={img}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(90deg, rgba(14, 53, 75, 0.85), rgba(14, 53, 75, 0.35)), url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: slide === i ? 1 : 0,
              transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
              zIndex: 1
            }}
          />
        ))}

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '1240px', margin: '0 auto', padding: '0 28px', width: '100%' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '30px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: '11px', letterSpacing: '2px', color: '#bae6fd', fontWeight: 800 }}>
              HIMALAYAN LUXURY TRAVEL RE-IMAGINED
            </span>
          </div>

          <h1 style={{ font: "700 56px/1.08 'Playfair Display', serif", color: '#ffffff', margin: '0 0 16px', maxWidth: '720px' }}>
            Live Life Differently.<br />
            <em style={{ color: '#7dd3fc', fontStyle: 'italic', fontWeight: 400 }}>Where will your journey take you?</em>
          </h1>

          <p style={{ color: '#e0f2fe', fontSize: '17px', margin: '0 0 32px', maxWidth: '620px', lineHeight: 1.6 }}>
            Vetted serviced suites, self-drive 4x4 Thar fleets, private mountain chauffeurs, and sacred Char Dham pilgrimage expeditions.
          </p>

          {/* Search Card Container with Glassmorphism */}
          <div className="glass-panel" style={{
            background: 'rgba(255, 255, 255, 0.94)',
            borderRadius: '22px',
            boxShadow: '0 24px 60px rgba(10, 35, 50, 0.35)',
            padding: '24px 28px',
            maxWidth: '1060px',
            border: '1px solid rgba(255, 255, 255, 0.9)'
          }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e0f2fe', paddingBottom: '14px', marginBottom: '20px', overflowX: 'auto' }}>
              {[
                { id: 'Hotels', label: '🏨 Hotels & Resorts' },
                { id: 'Apartments', label: '🏡 Serviced Apartments' },
                { id: 'Rental', label: '🚗 Self-Drive & Cabs' },
                { id: 'Activities', label: '🧗 Adventure & Treks' },
                { id: 'CharDham', label: '🕉 Char Dham 2026' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setType(labels[tab.id][3][0]);
                  }}
                  className={`chip-interactive ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px', gap: '14px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📍 Destination</label>
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
                >
                  <option>Rishikesh</option>
                  <option>Dehradun</option>
                  <option>Mussoorie</option>
                  <option>Kedarnath</option>
                  <option>Badrinath</option>
                  <option>Auli</option>
                  <option>Jim Corbett</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>✨ {field1Label}</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
                >
                  {field1Options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📅 {field2Label}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--navy)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>📅 {field3Label}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1.5px solid #bae6fd', fontSize: '13px', fontWeight: 600, color: 'var(--navy)', background: '#fff', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                className="btn-luxury"
                style={{ height: '44px', width: '100%', fontSize: '13px', letterSpacing: '0.5px' }}
              >
                SEARCH ⌕
              </button>
            </form>

            {/* Quick Trend Discovery Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f8fc' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>Trending Now:</span>
              <Link href="/apartments" style={{ textDecoration: 'none', fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                🏡 Serviced 2BHKs
              </Link>
              <Link href="/cars" style={{ textDecoration: 'none', fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                🚙 Thar 4x4 Hardtop
              </Link>
              <Link href="/hotels" style={{ textDecoration: 'none', fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                🌊 Ganga View Balconies
              </Link>
              <Link href="/packages" style={{ textDecoration: 'none', fontSize: '12px', color: '#0369a1', background: '#f0f9ff', padding: '3px 10px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                🕉 Kedarnath VIP Yatra
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Proof Strip */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2f0f7', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '30px' }}>🌟</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>4.92 / 5.0</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Verified Mountain Ratings</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '30px' }}>🏔️</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>50,000+</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Happy Travelers Hosted</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '30px' }}>🛡️</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>100% Vetted</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Hotels, Apartments & Cabs</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '30px' }}>⚡</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--navy)' }}>Instant PDF</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Tax Invoices & Vouchers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Coupon Promo Banner */}
      <section style={{ background: 'linear-gradient(135deg, #0e354b 0%, #164b68 100%)', color: '#fff', padding: '18px 24px' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '20px' }}>🎉</span>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Exclusive 2026 Promotions:</span>
            
            <button
              onClick={() => copyCoupon('TRIPPIE500')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '4px 12px',
                borderRadius: '8px',
                color: '#7dd3fc',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              TRIPPIE500 (₹500 OFF) {copiedCode === 'TRIPPIE500' ? '✓ Copied!' : '📋'}
            </button>

            <button
              onClick={() => copyCoupon('DHAM1000')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '4px 12px',
                borderRadius: '8px',
                color: '#7dd3fc',
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              DHAM1000 (₹1,000 OFF) {copiedCode === 'DHAM1000' ? '✓ Copied!' : '📋'}
            </button>
          </div>

          <Link href="/itinerary-builder" className="btn-luxury" style={{ padding: '8px 18px', fontSize: '13px' }}>
            ✨ Custom 7-Day Plan →
          </Link>
        </div>
      </section>

      {/* Destinations Grid */}
      <section style={{ maxWidth: '1240px', margin: '60px auto 40px', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <span className="badge-luxury-cyan">DISCOVER UTTARAKHAND</span>
            <h2 style={{ font: "700 38px/1.2 'Playfair Display', serif", margin: '8px 0 0', color: 'var(--navy)' }}>
              Extraordinary Himalayan Sanctuaries
            </h2>
          </div>
          <Link href="/destination" className="btn-luxury-outline" style={{ fontSize: '13px' }}>
            Explore All 10 Destinations →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '28px' }}>
          {destinations.map(d => (
            <Link key={d.id} href={`/destination/${d.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="luxury-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img src={d.heroImage} alt={d.name} className="img-zoom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(14, 53, 75, 0.85)', backdropFilter: 'blur(6px)', color: '#fff', padding: '5px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 700 }}>
                    {d.weather ? `${d.weather.temp} • ${d.weather.condition}` : 'Alpine Weather'}
                  </span>
                </div>
                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.state}, {d.country}</div>
                  <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '6px 0 8px', color: 'var(--navy)' }}>{d.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6', margin: '0 0 18px', flex: 1 }}>{d.tagline || d.description.slice(0, 100) + '...'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '14px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Starting from</span>
                      <div style={{ fontWeight: 800, fontSize: '20px', color: 'var(--navy)' }}>₹{(d.startingPrice || 2499).toLocaleString('en-IN')}</div>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--blue)' }}>Explore Guide →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Luxury Features Showcase */}
      <section style={{ background: '#ffffff', borderTop: '1px solid #e0f2fe', borderBottom: '1px solid #e0f2fe', padding: '60px 24px', margin: '60px 0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
          <div className="glass-panel" style={{ padding: '24px', background: '#f8fcfe' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🛡️</div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>Best Price Guarantee</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>Direct supplier integration with zero hidden middleman markups across all bookings.</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', background: '#f8fcfe' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🏔️</div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>Verified Hill Chauffeurs</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>Commercial yellow-plate cabs with hill-certified drivers and police background verification.</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', background: '#f8fcfe' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>📄</div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>Instant PDF Vouchers</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>Download official tax invoices and travel vouchers immediately upon confirmation.</p>
          </div>
          <div className="glass-panel" style={{ padding: '24px', background: '#f8fcfe' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>📞</div>
            <h4 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: 700, color: 'var(--navy)' }}>24/7 Himalayan Concierge</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>Dedicated support agents ready to assist on WhatsApp, phone, and at temple helipads.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
