'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Sameer Sharma', role: 'Customer', email: 'sameer@example.com' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('trippie_user') || localStorage.getItem('yatrimap_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const switchRole = (role) => {
    let newUser;
    if (role === 'Super Admin') newUser = { name: 'Aarav Malhotra', role: 'Super Admin', email: 'admin@trippie.com' };
    else if (role === 'Travel Agent') newUser = { name: 'Priya Patel', role: 'Travel Agent', email: 'priya@trippie.com' };
    else newUser = { name: 'Sameer Sharma', role: 'Customer', email: 'sameer@example.com' };

    setUser(newUser);
    localStorage.setItem('trippie_user', JSON.stringify(newUser));
    setDropdownOpen(false);
    window.location.reload();
  };

  return (
    <>
      <header className="topbar glass-nav" id="top" style={{
        height: '72px',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/" className="brand" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--navy)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', color: 'var(--blue)', fontSize: '32px' }}>t</span>
            <span style={{ letterSpacing: '-0.5px' }}>rippie</span>
            <span style={{ fontSize: '9px', fontWeight: 800, background: 'linear-gradient(135deg,#279ed3,#164b68)', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px', letterSpacing: '0.5px' }}>LUXE</span>
          </Link>

          <nav className="desktop-nav" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Link href="/" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/' ? '#f0f9ff' : 'transparent' }}>Explore</Link>
            <Link href="/destination" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname.startsWith('/destination') ? 'var(--blue)' : 'var(--navy)', background: pathname.startsWith('/destination') ? '#f0f9ff' : 'transparent' }}>Destinations</Link>
            <Link href="/hotels" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/hotels' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/hotels' ? '#f0f9ff' : 'transparent' }}>Hotels</Link>
            <Link href="/apartments" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/apartments' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/apartments' ? '#f0f9ff' : 'transparent', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Apartments <span style={{ fontSize: '9px', background: '#e0f2fe', color: '#0284c7', padding: '1px 5px', borderRadius: '8px' }}>SUITES</span>
            </Link>
            <Link href="/packages" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/packages' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/packages' ? '#f0f9ff' : 'transparent' }}>Packages</Link>
            <Link href="/cars" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/cars' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/cars' ? '#f0f9ff' : 'transparent' }}>Rentals</Link>
            <Link href="/taxi" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/taxi' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/taxi' ? '#f0f9ff' : 'transparent' }}>Taxi</Link>
            <Link href="/trekking" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/trekking' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/trekking' ? '#f0f9ff' : 'transparent' }}>Treks</Link>
            <Link href="/jungle-safari" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 10px', borderRadius: '8px', color: pathname === '/jungle-safari' ? 'var(--blue)' : 'var(--navy)', background: pathname === '/jungle-safari' ? '#f0f9ff' : 'transparent' }}>Safari</Link>
            <Link href="/itinerary-builder" style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', padding: '6px 12px', borderRadius: '20px', color: '#0369a1', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', border: '1px solid #7dd3fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>✨</span> Custom Trip
            </Link>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/my-trips" style={{
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--navy)',
            background: '#f0f9ff',
            padding: '7px 14px',
            borderRadius: '20px',
            border: '1px solid #bae6fd'
          }}>
            🎒 My Trips
          </Link>

          {(user.role === 'Super Admin' || user.role === 'Travel Agent') && (
            <Link href="/admin" style={{
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              color: '#fff',
              background: 'var(--navy)',
              padding: '7px 14px',
              borderRadius: '20px'
            }}>
              ⚙ CRM Admin
            </Link>
          )}

          {/* User profile with role switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                border: '1px solid #cbd5e0',
                borderRadius: '24px',
                padding: '4px 12px 4px 6px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>
                {user.name ? user.name[0] : 'S'}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)' }}>{user.name.split(' ')[0]}</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)' }}>▼</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '240px',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(22,75,104,0.18)',
                border: '1px solid #e2e8f0',
                padding: '12px',
                zIndex: 2000
              }}>
                <div style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '8px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{user.email}</div>
                  <span style={{ display: 'inline-block', marginTop: '4px', background: '#ebf8ff', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 700 }}>
                    Role: {user.role}
                  </span>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Switch Role / Persona:
                </div>
                <button onClick={() => switchRole('Customer')} style={{ width: '100%', textAlign: 'left', padding: '6px 8px', border: 0, background: user.role === 'Customer' ? '#f0fdf4' : 'transparent', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'block' }}>
                  👤 Customer (Sameer)
                </button>
                <button onClick={() => switchRole('Travel Agent')} style={{ width: '100%', textAlign: 'left', padding: '6px 8px', border: 0, background: user.role === 'Travel Agent' ? '#f0fdf4' : 'transparent', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'block' }}>
                  💼 Travel Agent (Priya)
                </button>
                <button onClick={() => switchRole('Super Admin')} style={{ width: '100%', textAlign: 'left', padding: '6px 8px', border: 0, background: user.role === 'Super Admin' ? '#f0fdf4' : 'transparent', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'block' }}>
                  👑 Super Admin (Aarav)
                </button>

                <div style={{ borderTop: '1px solid #edf2f7', marginTop: '8px', paddingTop: '8px' }}>
                  <Link href="/my-trips" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '4px 8px', fontSize: '12px', color: 'var(--navy)', textDecoration: 'none' }}>Customer Portal</Link>
                  <Link href="/admin" onClick={() => setDropdownOpen(false)} style={{ display: 'block', padding: '4px 8px', fontSize: '12px', color: 'var(--navy)', textDecoration: 'none' }}>Admin CMS / CRM</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Mobile Viewports Only) */}
      <nav className="mobile-bottom-nav">
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: pathname === '/' ? 'var(--blue)' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
          <span>🏠</span> Home
        </Link>
        <Link href="/destination" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: pathname.startsWith('/destination') ? 'var(--blue)' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
          <span>🗺️</span> Explore
        </Link>
        <Link href="/itinerary-builder" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: pathname === '/itinerary-builder' ? 'var(--blue)' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
          <span>✨</span> Plan Trip
        </Link>
        <Link href="/my-trips" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: pathname === '/my-trips' ? 'var(--blue)' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
          <span>🎒</span> My Trips
        </Link>
        <Link href="/admin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: pathname === '/admin' ? 'var(--blue)' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
          <span>⚙</span> Admin
        </Link>
      </nav>
    </>
  );
}
