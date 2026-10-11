'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load and verify authentication state
  useEffect(() => {
    const syncUser = () => {
      // 1. Check for active admin session
      const adminSession = localStorage.getItem('trippie_admin_session');
      if (adminSession) {
        try {
          const parsed = JSON.parse(adminSession);
          if (parsed && parsed.email) {
            setUser(parsed);
            return;
          }
        } catch (e) {}
      }

      // 2. Check for customer session
      const customerSession = localStorage.getItem('trippie_user');
      if (customerSession) {
        try {
          const parsed = JSON.parse(customerSession);
          if (parsed && parsed.email) {
            setUser(parsed);
            return;
          }
        } catch (e) {}
      }

      // Default demo profile for seamless browsing
      setUser({ name: 'Sameer Sharma', role: 'Customer', email: 'sameer@example.com' });
    };

    syncUser();

    // Verify server cookie session in background
    fetch('/api/admin/auth')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          localStorage.setItem('trippie_admin_session', JSON.stringify(data.user));
        }
      })
      .catch(() => {});
  }, []);

  // Close menus on page route changes
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {}
    localStorage.removeItem('trippie_admin_session');
    localStorage.removeItem('trippie_user');
    setUser(null);
    setDropdownOpen(false);
    router.push('/');
  };

  const navLinks = [
    { href: '/', label: 'Explore' },
    { href: '/destination', label: 'Destinations' },
    { href: '/hotels', label: 'Hotels' },
    { href: '/apartments', label: 'Apartments', badge: 'SUITES' },
    { href: '/packages', label: 'Packages' },
    { href: '/cars', label: 'Rentals' },
    { href: '/taxi', label: 'Taxi' },
    { href: '/trekking', label: 'Treks' },
    { href: '/jungle-safari', label: 'Safari' },
  ];

  const isAdmin = user && ['Super Admin', 'Travel Agent', 'Sales Manager', 'Content Manager', 'Finance Manager'].includes(user.role);

  return (
    <>
      <header className="topbar glass-nav" id="top" style={{
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #d9f0fb'
      }}>
        {/* Left Side: Brand Logo & Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <Link href="/" className="brand" style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', color: 'var(--blue)', fontSize: '30px' }}>t</span>
            <span style={{ letterSpacing: '-0.5px' }}>rippie</span>
            <span style={{ fontSize: '9px', fontWeight: 800, background: 'linear-gradient(135deg,#279ed3,#164b68)', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginLeft: '5px', letterSpacing: '0.5px' }}>LUXE</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    padding: '6px 9px',
                    borderRadius: '8px',
                    color: isActive ? 'var(--blue)' : 'var(--navy)',
                    background: isActive ? '#f0f9ff' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {item.label}
                  {item.badge && (
                    <span style={{ fontSize: '8.5px', background: '#e0f2fe', color: '#0284c7', padding: '1px 5px', borderRadius: '6px' }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/itinerary-builder"
              style={{
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
                padding: '6px 12px',
                borderRadius: '20px',
                color: '#0369a1',
                background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                border: '1px solid #7dd3fc',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <span>✨</span> Custom Trip
            </Link>
          </nav>
        </div>

        {/* Right Side: My Trips & Account Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/my-trips"
            className="nav-btn-hide-mobile"
            style={{
              textDecoration: 'none',
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'var(--navy)',
              background: '#f0f9ff',
              padding: '7px 13px',
              borderRadius: '20px',
              border: '1px solid #bae6fd',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🎒</span> My Trips
          </Link>

          {/* User Profile Pill & Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User Account Menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#fff',
                  border: isAdmin ? '1.5px solid #7dd3fc' : '1px solid #cbd5e0',
                  borderRadius: '24px',
                  padding: '4px 10px 4px 5px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isAdmin ? 'linear-gradient(135deg, #0e354b, #279ed3)' : 'linear-gradient(135deg, #164b68, #52778c)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  {isAdmin ? '👑' : (user.name ? user.name[0] : 'U')}
                </div>
                <span className="user-name-label" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name ? user.name.split(' ')[0] : 'Account'}
                </span>
                <span style={{ fontSize: '9px', color: 'var(--muted)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop Overlay for closing anywhere */}
                  <div
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 1998,
                      background: 'rgba(14, 53, 75, 0.15)',
                      backdropFilter: 'blur(2px)',
                      WebkitBackdropFilter: 'blur(2px)'
                    }}
                  />

                  {/* Dropdown Menu */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: 'min(280px, calc(100vw - 28px))',
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: '0 16px 36px rgba(22, 75, 104, 0.22)',
                      border: '1px solid #d9f0fb',
                      padding: '14px',
                      zIndex: 1999,
                      animation: 'scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxSizing: 'border-box'
                    }}
                  >
                    {/* User Profile Card */}
                    <div style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '10px', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--navy)' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', wordBreak: 'break-all' }}>{user.email}</div>
                      <span style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        background: isAdmin ? '#ecfdf5' : '#e0f2fe',
                        color: isAdmin ? '#065f46' : '#0369a1',
                        border: isAdmin ? '1px solid #6ee7b7' : '1px solid #bae6fd',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10.5px',
                        fontWeight: 700
                      }}>
                        {isAdmin ? `👑 ${user.role}` : `👤 ${user.role}`}
                      </span>
                    </div>

                    {/* Navigation Links inside Dropdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '9px 10px',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: '#0e354b',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            background: '#f0f9ff',
                            border: '1px solid #bae6fd'
                          }}
                        >
                          <span>⚙️</span>
                          <span>Admin CMS / CRM Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          href="/admin/login"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--navy)',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            background: '#f8fafc'
                          }}
                        >
                          <span>🔐</span>
                          <span>Admin / Staff Portal Login</span>
                        </Link>
                      )}

                      <Link
                        href="/my-trips"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--navy)',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          background: '#f8fafc'
                        }}
                      >
                        <span>🎒</span>
                        <span>My Trips & Bookings</span>
                      </Link>

                      <Link
                        href="/itinerary-builder"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--navy)',
                          textDecoration: 'none',
                          borderRadius: '8px',
                          background: '#f8fafc'
                        }}
                      >
                        <span>✨</span>
                        <span>Custom Trip Planner</span>
                      </Link>
                    </div>

                    {/* Sign Out Action */}
                    <div style={{ borderTop: '1px solid #edf2f7', marginTop: '10px', paddingTop: '10px' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          background: '#fef2f2',
                          color: '#dc2626',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>🚪</span>
                        <span>Sign Out (Logout)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/admin/login"
              style={{
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #279ed3 0%, #164b68 100%)',
                padding: '7px 14px',
                borderRadius: '20px',
                whiteSpace: 'nowrap'
              }}
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: '1px solid #bae6fd',
              background: '#f0f9ff',
              color: 'var(--navy)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 700
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9998 }}>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(14, 53, 75, 0.45)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
          />

          {/* Drawer Panel */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(300px, 82vw)',
              background: '#ffffff',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.18)',
              display: 'flex',
              flexDirection: 'column',
              padding: '20px',
              overflowY: 'auto',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '14px', marginBottom: '14px' }}>
              <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--navy)' }}>Quick Navigation</div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ border: 0, background: '#f1f5f9', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--navy)' }}
              >
                ✕
              </button>
            </div>

            {/* User status card in drawer */}
            {user && (
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--navy)' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{user.email}</div>
                <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 700, color: isAdmin ? '#065f46' : '#0284c7' }}>
                  {isAdmin ? `👑 ${user.role}` : `👤 ${user.role}`}
                </span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    color: pathname === item.href ? 'var(--blue)' : 'var(--navy)',
                    background: pathname === item.href ? '#f0f9ff' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '9px', background: '#e0f2fe', color: '#0284c7', padding: '2px 6px', borderRadius: '8px' }}>{item.badge}</span>
                  )}
                </Link>
              ))}

              <Link
                href="/itinerary-builder"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  marginTop: '10px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  color: '#0369a1',
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                  border: '1px solid #7dd3fc',
                  textAlign: 'center',
                  display: 'block'
                }}
              >
                ✨ Plan Custom Trip
              </Link>

              {/* Portal Links */}
              <div style={{ borderTop: '1px solid #edf2f7', marginTop: '12px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  href="/my-trips"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, color: 'var(--navy)', padding: '8px 12px', borderRadius: '8px', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>🎒</span> My Trips & Bookings
                </Link>

                <Link
                  href={isAdmin ? '/admin' : '/admin/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', fontSize: '13px', fontWeight: 700, color: '#0e354b', padding: '8px 12px', borderRadius: '8px', background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>⚙️</span> {isAdmin ? 'Admin CMS / CRM' : 'Admin / Staff Login'}
                </Link>

                {user && (
                  <button
                    onClick={handleLogout}
                    style={{
                      marginTop: '6px',
                      padding: '10px',
                      border: '1px solid #fecaca',
                      background: '#fef2f2',
                      color: '#dc2626',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>🚪</span> Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
        <Link href={isAdmin ? '/admin' : '/admin/login'} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', color: pathname.startsWith('/admin') ? 'var(--blue)' : 'var(--navy)', fontSize: '11px', fontWeight: 700 }}>
          <span>⚙</span> Admin
        </Link>
      </nav>
    </>
  );
}
