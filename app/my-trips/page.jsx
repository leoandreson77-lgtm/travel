'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyTripsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [tripsData, setTripsData] = useState({ upcoming: [], completed: [], cancelled: [], all: [] });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ticket form
  const [tckSubject, setTckSubject] = useState('');
  const [tckMsg, setTckMsg] = useState('');
  const [tckCat, setTckCat] = useState('Booking Modification');
  const [ticketNotice, setTicketNotice] = useState('');

  useEffect(() => {
    fetchTrips();
    fetchTickets();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/customer/trips');
      const data = await res.json();
      if (data.success) setTripsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/customer/tickets');
      const data = await res.json();
      if (data.success) setTickets(data.tickets);
    } catch (e) {}
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setTicketNotice('Submitting ticket...');
    const res = await fetch('/api/customer/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: tckSubject,
        message: tckMsg,
        category: tckCat
      })
    }).then(r => r.json());

    if (res.success) {
      setTicketNotice('✓ Support ticket raised! A travel concierge will reply shortly.');
      setTckSubject('');
      setTckMsg('');
      fetchTickets();
      setTimeout(() => setTicketNotice(''), 3000);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm(`Are you sure you wish to cancel booking #${id}? Cancellation fee may apply per policy.`)) return;

    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingStatus: 'Cancelled',
        cancellationStatus: 'Requested'
      })
    }).then(r => r.json());

    if (res.success) {
      alert(`Booking #${id} cancelled. Refund processing initiated.`);
      fetchTrips();
    }
  };

  const totalSpend = (tripsData.all || []).reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      {/* Customer Header Card */}
      <section style={{ background: '#fff', borderRadius: '16px', border: '1px solid #d9f0fb', padding: '30px', marginBottom: '32px', boxShadow: '0 6px 20px rgba(22,75,104,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--navy)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '24px', fontWeight: 800 }}>
              S
            </div>
            <div>
              <h1 style={{ font: "700 28px 'Playfair Display', serif", margin: '0 0 4px', color: 'var(--navy)' }}>Welcome back, Sameer!</h1>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>sameer@example.com • +91 98765 43210 • Verified Trippie Traveler</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>UPCOMING TRIPS</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>{tripsData.upcoming?.length || 0}</div>
            </div>
            <div style={{ textAlign: 'center', background: '#f8fafc', padding: '10px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700 }}>TOTAL SPEND</span>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a' }}>₹{totalSpend.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e0f2fe', paddingBottom: '14px', marginBottom: '28px', overflowX: 'auto' }}>
        {[
          { id: 'upcoming', label: `Upcoming Trips (${tripsData.upcoming?.length || 0})` },
          { id: 'completed', label: `Past Journeys (${tripsData.completed?.length || 0})` },
          { id: 'cancelled', label: `Cancelled (${tripsData.cancelled?.length || 0})` },
          { id: 'support', label: `Support Tickets (${tickets.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`chip-interactive ${activeTab === t.id ? 'active' : ''}`}
            style={{ fontSize: '12px', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1 & 2 & 3: Bookings List */}
      {activeTab !== 'support' && (
        <div>
          {loading ? (
            <div className="skeleton" style={{ height: '220px', borderRadius: '18px' }}></div>
          ) : (tripsData[activeTab] || []).length === 0 ? (
            <div className="glass-panel" style={{ borderRadius: '18px', padding: '56px 24px', textAlign: 'center', background: '#fff' }}>
              <div style={{ fontSize: '42px', marginBottom: '12px' }}>🎒</div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", color: 'var(--navy)', margin: '0 0 8px' }}>No bookings found</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>Ready for your next Himalayan escape?</p>
              <Link href="/packages" className="btn-luxury">
                Explore Tour Packages →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {(tripsData[activeTab] || []).map(b => (
                <article key={b.id} className="luxury-card" style={{ padding: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e0f2fe', paddingBottom: '16px', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span className="badge-luxury-cyan">BOOKING REF #{b.id}</span>
                      <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '6px 0 0', color: 'var(--navy)' }}>{b.productTitle}</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={b.bookingStatus === 'Confirmed' ? 'badge-luxury-emerald' : 'badge-luxury-gold'}>
                        ● {b.bookingStatus}
                      </span>
                      <span className="badge-luxury-cyan">
                        {b.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '22px', fontSize: '13px', color: 'var(--navy)' }}>
                    <div>
                      <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Travel Dates</small>
                      <b>{b.travelStartDate} to {b.travelEndDate}</b>
                    </div>
                    <div>
                      <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Travellers</small>
                      <b>{b.travellers} Guests</b>
                    </div>
                    <div>
                      <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Assigned Local Agent</small>
                      <b>{b.assignedAgent || 'Priya Patel (Support)'}</b>
                    </div>
                    <div>
                      <small style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>Total Amount Paid</small>
                      <b style={{ color: 'var(--blue)', fontSize: '18px' }}>₹{b.finalAmount.toLocaleString('en-IN')}</b>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #e0f2fe', paddingTop: '18px' }}>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a
                        href={`/api/pdf/voucher/${b.id}`}
                        target="_blank"
                        className="btn-luxury"
                        style={{ padding: '9px 18px', fontSize: '12px' }}
                      >
                        📄 Download Voucher PDF
                      </a>
                      <a
                        href={`/api/pdf/invoice/${b.id}`}
                        target="_blank"
                        className="btn-luxury-outline"
                        style={{ padding: '8px 18px', fontSize: '12px' }}
                      >
                        🧾 Download Invoice PDF
                      </a>
                    </div>
                    {b.bookingStatus === 'Confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        style={{ background: 'transparent', border: 0, color: '#dc2626', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Request Cancellation
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Support Tickets */}
      {activeTab === 'support' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Your Support Inquiries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tickets.length === 0 ? (
                <div style={{ background: '#fff', padding: '30px', textAlign: 'center', borderRadius: '12px', border: '1px solid #e2e8f0', color: 'var(--muted)' }}>
                  No open support tickets. Need help? Submit a ticket on the right.
                </div>
              ) : (
                tickets.map(tck => (
                  <div key={tck.id} style={{ background: '#fff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{tck.subject}</b>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                        {tck.status}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#4a5568' }}>{tck.message}</p>
                    <small style={{ color: 'var(--muted)' }}>Category: {tck.category} • Assigned to: {tck.assignedAgent}</small>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid #d9f0fb' }}>
            <h3 style={{ font: "700 18px 'Playfair Display', serif", margin: '0 0 12px', color: 'var(--navy)' }}>Raise a Support Ticket</h3>
            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>CATEGORY</label>
                <select value={tckCat} onChange={e => setTckCat(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '12px' }}>
                  <option>Booking Modification</option>
                  <option>Pickup & Driver Query</option>
                  <option>Cancellation / Refund</option>
                  <option>Special Dietary Request</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>SUBJECT</label>
                <input type="text" required placeholder="Brief summary" value={tckSubject} onChange={e => setTckSubject(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '12px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>MESSAGE</label>
                <textarea rows="3" required placeholder="Describe your request..." value={tckMsg} onChange={e => setTckMsg(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '12px' }} />
              </div>
              <button type="submit" style={{ background: 'var(--navy)', color: '#fff', border: 0, padding: '10px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                Submit Ticket →
              </button>
              {ticketNotice && <p style={{ fontSize: '12px', color: '#16a34a', margin: '4px 0 0' }}>{ticketNotice}</p>}
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
