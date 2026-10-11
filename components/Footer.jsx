'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: '#0e354b',
      color: '#ffffff',
      padding: '70px 24px 80px',
      marginTop: '80px',
      borderTop: '4px solid #279ed3',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '40px'
      }}>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontFamily: 'Playfair Display, serif', color: '#279ed3', fontSize: '34px' }}>t</span>
            <span style={{ letterSpacing: '-0.5px', color: '#ffffff' }}>rippie</span>
            <span style={{ fontSize: '9px', fontWeight: 800, background: 'linear-gradient(135deg,#279ed3,#164b68)', color: '#fff', padding: '2px 6px', borderRadius: '10px', marginLeft: '6px', letterSpacing: '0.5px' }}>LUXE</span>
          </div>
          <p style={{ fontSize: '13px', color: '#dbeafe', lineHeight: '1.75', margin: '0 0 18px' }}>
            India’s premier travel marketplace and mountain operating system. Connecting pilgrims, explorers, and families to vetted Himalayan stays, verified chauffeurs, and transformative adventures.
          </p>
          <div style={{ fontSize: '13px', lineHeight: '1.8', color: '#93c5fd' }}>
            <div>📞 24x7 Helpline: <b style={{ color: '#ffffff' }}>+91 98765 43210</b></div>
            <div>✉ Concierge: <b style={{ color: '#ffffff' }}>support@trippie.com</b></div>
          </div>
        </div>

        <div>
          <h4 style={{ font: "700 17px 'Playfair Display', serif", margin: '0 0 16px', color: '#ffffff' }}>Himalayan Escapes</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '2.3', color: '#e0f2fe' }}>
            <li><Link href="/destination/rishikesh" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Rishikesh (Ganga Retreats)</Link></li>
            <li><Link href="/destination/kedarnath" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Kedarnath Yatra & Helipads</Link></li>
            <li><Link href="/destination/badrinath" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Badrinath & Mana Village</Link></li>
            <li><Link href="/destination/auli" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Auli Skiing & Meadows</Link></li>
            <li><Link href="/destination/jim-corbett" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Jim Corbett Tiger Reserve</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ font: "700 17px 'Playfair Display', serif", margin: '0 0 16px', color: '#ffffff' }}>Services & Rentals</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '2.3', color: '#e0f2fe' }}>
            <li><Link href="/hotels" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Riverside Boutique Hotels</Link></li>
            <li><Link href="/apartments" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Serviced Suites & Villas</Link></li>
            <li><Link href="/packages" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Char Dham Tour Packages</Link></li>
            <li><Link href="/cars" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Self Drive 4x4 Thar Rentals</Link></li>
            <li><Link href="/taxi" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Certified Mountain Taxis</Link></li>
            <li><Link href="/bike" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Royal Enfield Bike Rentals</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ font: "700 17px 'Playfair Display', serif", margin: '0 0 16px', color: '#ffffff' }}>Agency Portal & Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', lineHeight: '2.3', color: '#e0f2fe' }}>
            <li><Link href="/itinerary-builder" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Custom Itinerary Generator</Link></li>
            <li><Link href="/my-trips" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Customer Portal & Invoices</Link></li>
            <li><Link href="/admin" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Agency CRM & CMS</Link></li>
            <li><Link href="/blog" style={{ color: '#e0f2fe', textDecoration: 'none' }}>Travel Journal & Guides</Link></li>
            <li><span style={{ color: '#38bdf8', fontWeight: 600 }}>GSTIN: 05AABCY9876Q1Z9</span></li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '48px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid rgba(255,255,255,0.18)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '12px',
        color: '#93c5fd'
      }}>
        <div>© 2026 Trippie Technologies Pvt Ltd. All rights reserved. Built for Himalayan Tourism.</div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <span>✓ 100% Verified Local Suppliers</span>
          <span>✓ Instant PDF Invoices & Vouchers</span>
          <span>✓ Safe & Encrypted Gateway</span>
        </div>
      </div>
    </footer>
  );
}
