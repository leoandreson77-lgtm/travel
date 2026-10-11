'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params?.slug || 'rishikesh';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', travellers: 2, dates: '', budget: 'Standard' });
  const [enquiryStatus, setEnquiryStatus] = useState('');

  useEffect(() => {
    fetch(`/api/destinations/${slug}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const submitEnquiry = async (e) => {
    e.preventDefault();
    setEnquiryStatus('Submitting...');
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        destination: data?.destination?.name || slug,
        notes: `Enquiry submitted from ${data?.destination?.name} guide page.`
      })
    }).then(r => r.json());

    if (res.success) {
      setEnquiryStatus('Thank you! An assigned travel agent will contact you on WhatsApp.');
      setTimeout(() => {
        setEnquiryOpen(false);
        setEnquiryStatus('');
      }, 2500);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '360px', borderRadius: '16px', marginBottom: '24px' }}></div>
      </div>
    );
  }

  if (!data || !data.destination) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
        <h2>Destination Not Found</h2>
        <p style={{ color: 'var(--muted)' }}>We couldn’t locate details for this destination.</p>
        <Link href="/" style={{ background: 'var(--navy)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', marginTop: '16px' }}>Back to Home</Link>
      </div>
    );
  }

  const { destination, related } = data;

  return (
    <div>
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        height: '420px',
        backgroundImage: `linear-gradient(180deg, rgba(22,75,104,0.4) 0%, rgba(22,75,104,0.95) 100%), url(${destination.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 24px 48px'
      }}>
        <div style={{ maxWidth: '1240px', width: '100%', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#72c9ef' }}>
                📍 {destination.state}, {destination.country}
              </span>
              <h1 style={{ font: "700 52px 'Playfair Display', serif", margin: '8px 0 10px' }}>{destination.name}</h1>
              <p style={{ fontSize: '18px', color: '#e5f7ff', maxWidth: '700px', margin: 0 }}>{destination.tagline}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setEnquiryOpen(true)}
                style={{ background: 'var(--orange)', color: '#fff', border: 0, padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
              >
                Plan Trip to {destination.name}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div style={{ maxWidth: '1240px', margin: '40px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
        <div>
          {/* Overview */}
          <section style={{ background: '#fff', padding: '30px', borderRadius: '14px', border: '1px solid #d9f0fb', marginBottom: '32px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 14px', color: 'var(--navy)' }}>About {destination.name}</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.75', color: '#4a5568', margin: '0 0 18px' }}>{destination.overview || destination.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', background: '#f7fafc', padding: '16px', borderRadius: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, display: 'block' }}>BEST TIME TO VISIT</span>
                <b style={{ fontSize: '13px', color: 'var(--navy)' }}>{destination.bestTime || 'March to June & Sept to Nov'}</b>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, display: 'block' }}>CURRENT WEATHER</span>
                <b style={{ fontSize: '13px', color: 'var(--navy)' }}>{destination.weather ? `${destination.weather.temp} (${destination.weather.condition})` : 'Pleasant'}</b>
              </div>
            </div>
          </section>

          {/* Top Attractions */}
          {destination.topAttractions && (
            <section style={{ background: '#fff', padding: '30px', borderRadius: '14px', border: '1px solid #d9f0fb', marginBottom: '32px' }}>
              <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 18px', color: 'var(--navy)' }}>Top Attractions & Sacred Landmarks</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {destination.topAttractions.map((att, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #e0f2fe' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--blue)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>{i + 1}</div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)' }}>{att}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Linked Hotels */}
          {related?.hotels?.length > 0 && (
            <section style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: 0, color: 'var(--navy)' }}>Verified Stays in {destination.name}</h2>
                <Link href={`/hotels?location=${encodeURIComponent(destination.name)}`} style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>View All ({related.hotels.length}) →</Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '18px' }}>
                {related.hotels.slice(0, 3).map(h => (
                  <div key={h.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2f0f7' }}>
                    <img src={h.heroImage} alt={h.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '14px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--blue)' }}>★ {h.rating} ({h.reviewsCount})</span>
                      <h4 style={{ margin: '4px 0 8px', fontSize: '15px', color: 'var(--navy)' }}>{h.name}</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <b style={{ fontSize: '16px', color: 'var(--navy)' }}>₹{h.pricePerNight.toLocaleString('en-IN')}<small style={{ fontWeight: 400, fontSize: '11px' }}> / night</small></b>
                        <Link href={`/checkout?type=hotel&id=${h.id}`} style={{ background: 'var(--navy)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textDecoration: 'none' }}>Book</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky Booking Card */}
        <aside>
          <div style={{ position: 'sticky', top: '90px', background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px', boxShadow: '0 8px 24px rgba(22,75,104,0.06)' }}>
            <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 10px', color: 'var(--navy)' }}>Experience {destination.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 20px', lineHeight: '1.6' }}>Let local Himalayan specialists book your 4x4 permits, riverside luxury stay, and temple VIP passes.</p>
            <button
              onClick={() => setEnquiryOpen(true)}
              style={{ width: '100%', background: 'var(--navy)', color: '#fff', border: 0, padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginBottom: '12px' }}
            >
              Get Custom Trip Quote
            </button>
            <Link
              href={`/itinerary-builder?destination=${encodeURIComponent(destination.name)}`}
              style={{ display: 'block', textAlign: 'center', border: '1px solid var(--navy)', color: 'var(--navy)', padding: '10px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}
            >
              Build Custom Itinerary →
            </Link>
          </div>
        </aside>
      </div>

      {/* Enquiry Modal */}
      {enquiryOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '28px', position: 'relative' }}>
            <button onClick={() => setEnquiryOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', border: 0, background: '#edf2f7', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}>✕</button>
            <h3 style={{ font: "700 22px 'Playfair Display', serif", margin: '0 0 8px', color: 'var(--navy)' }}>Plan Your Trip to {destination.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: '0 0 20px' }}>A certified travel specialist will prepare a customized package with hotel, transport, and guide.</p>
            <form onSubmit={submitEnquiry} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Your Full Name" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
              <input type="tel" placeholder="WhatsApp / Phone Number" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
              <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
              <input type="text" placeholder="Travel Dates (e.g. 15-20 Oct)" value={formData.dates} onChange={e => setFormData({ ...formData, dates: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
              <button type="submit" style={{ background: 'var(--navy)', color: '#fff', border: 0, padding: '12px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '8px' }}>
                Send Enquiry to Agent →
              </button>
              {enquiryStatus && <p style={{ fontSize: '13px', color: '#16a34a', margin: '4px 0 0', fontWeight: 600 }}>{enquiryStatus}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
