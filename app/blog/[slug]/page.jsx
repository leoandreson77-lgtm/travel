'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BlogReaderPage() {
  const params = useParams();
  const slug = params?.slug;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blogs/${slug}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setBlog(d.blog);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ maxWidth: '840px', margin: '60px auto', padding: '0 24px' }}>
        <div className="skeleton" style={{ height: '360px', borderRadius: '16px' }}></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2>Story Not Found</h2>
        <Link href="/blog" style={{ color: 'var(--blue)', fontWeight: 700 }}>← Back to all stories</Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '840px', margin: '40px auto 100px', padding: '0 24px' }}>
      <Link href="/blog" style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
        ← Back to Travel Journal
      </Link>
      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--blue)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
        {blog.category}
      </span>
      <h1 style={{ font: "700 40px/1.2 'Playfair Display', serif", color: 'var(--navy)', margin: '0 0 16px' }}>{blog.title}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted)', fontSize: '13px', borderBottom: '1px solid #edf2f7', paddingBottom: '16px', marginBottom: '24px' }}>
        <span>By <b>{blog.author || 'Trippie Editorial'}</b> • Published {blog.publishedAt}</span>
        <span>🕒 {blog.readTime || '6 min read'}</span>
      </div>

      <img src={blog.coverImage} alt={blog.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '14px', marginBottom: '28px' }} />

      <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--navy)', lineHeight: '1.65', borderLeft: '4px solid var(--blue)', paddingLeft: '18px', margin: '0 0 28px' }}>
        {blog.excerpt}
      </p>

      <div style={{ fontSize: '16px', lineHeight: '1.85', color: '#2d3748', whiteSpace: 'pre-line' }}>
        {blog.content}
      </div>

      <div style={{ borderTop: '1px solid #edf2f7', marginTop: '48px', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/itinerary-builder" style={{ background: 'var(--navy)', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}>
          Build Trip to this Destination →
        </Link>
      </div>
    </article>
  );
}
