'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BlogCatalogPage() {
  const [blogs, setBlogs] = useState([]);
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(d => { if (d.success) setBlogs(d.blogs); });
  }, []);

  const filtered = blogs.filter(b => activeCat === 'All' || b.category === activeCat);

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', letterSpacing: '2px' }}>
          TRIPPIE TRAVEL JOURNAL
        </span>
        <h1 style={{ font: "700 42px 'Playfair Display', serif", margin: '8px 0 10px', color: 'var(--navy)' }}>
          Himalayan Stories, Guides & Insights
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
          Curated pilgrimage advisories, trekking gear checklists, and insider mountain road guides from local specialists.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', overflowX: 'auto' }}>
        {['All', 'Pilgrimage Guide', 'Adventure', 'Travel Tips', 'Travel & Lifestyle'].map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            style={{
              background: activeCat === c ? 'var(--navy)' : '#fff',
              color: activeCat === c ? '#fff' : 'var(--navy)',
              border: '1px solid #cbd5e0',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {c === 'All' ? 'All Stories' : c}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '26px' }}>
        {filtered.map(b => (
          <Link key={b.id} href={`/blog/${b.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e2f0f7',
              boxShadow: '0 4px 16px rgba(22,75,104,0.06)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img src={b.coverImage} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  {b.category}
                </span>
                <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 8px', color: 'var(--navy)' }}>{b.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '1.55', margin: '0 0 16px', flex: 1 }}>{b.excerpt || b.content.slice(0, 110) + '...'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f7fa', paddingTop: '12px', fontSize: '12px', color: '#718096' }}>
                  <span>✍ {b.author || 'Trippie Team'}</span>
                  <span>🕒 {b.readTime || '5 min read'}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
