'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success && data.user) {
        // Save session locally as well
        localStorage.setItem('trippie_admin_session', JSON.stringify(data.user));
        localStorage.setItem('trippie_user', JSON.stringify(data.user));

        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid credentials. Please verify your email and password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #164b68 0%, #092a3e 60%, #051622 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Background Decorative Rings */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(39, 158, 211, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: 'relative',
        zIndex: 2,
        boxSizing: 'border-box'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', color: '#279ed3', fontSize: '36px', fontWeight: 800 }}>t</span>
            <span style={{ fontSize: '26px', fontWeight: 800, color: '#0e354b', letterSpacing: '-0.5px' }}>rippie</span>
            <span style={{ fontSize: '10px', fontWeight: 800, background: 'linear-gradient(135deg,#279ed3,#0e354b)', color: '#fff', padding: '3px 7px', borderRadius: '12px', marginLeft: '6px' }}>LUXE</span>
          </Link>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0e354b', marginTop: '12px', marginBottom: '4px' }}>
            Agency CMS & CRM Login
          </h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Secure portal for travel executives and administrators
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trippie.com"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 38px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  color: '#0e354b',
                  background: '#f8fafc',
                  transition: 'border-color 0.2s'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#64748b' }}>
                ✉
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 38px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  color: '#0e354b',
                  background: '#f8fafc',
                  transition: 'border-color 0.2s'
                }}
              />
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#64748b' }}>
                🔒
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#64748b',
                  padding: 0
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '12px',
              border: 0,
              background: 'linear-gradient(135deg, #279ed3 0%, #164b68 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(39, 158, 211, 0.35)',
              transition: 'transform 0.15s, opacity 0.15s',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                <span>Verifying Access...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal →</span>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', textAlign: 'center' }}>
            ⚡ 1-Click Demo Logins
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              onClick={() => quickFill('admin@trippie.com', 'admin123')}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #bae6fd',
                background: '#f0f9ff',
                color: '#0369a1',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>👑 Super Admin (Aarav)</span>
              <span style={{ fontSize: '11px', color: '#0284c7' }}>admin123</span>
            </button>

            <button
              type="button"
              onClick={() => quickFill('priya@yatrimap.com', 'agent123')}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>💼 Travel Agent (Priya)</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>agent123</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/" style={{ fontSize: '12px', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Trippie Public Website
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
