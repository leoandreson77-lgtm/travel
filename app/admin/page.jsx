'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Quote Builder states
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteCustomer, setQuoteCustomer] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteItems, setQuoteItems] = useState([
    { category: 'Stay', name: 'Deluxe Riverside Cottage (3 Nights)', cost: 10500 },
    { category: 'Transport', name: 'Innova Crysta with Hill Chauffeur', cost: 7500 },
    { category: 'Activities', name: 'Grade IV River Rafting & Cliff Jump', cost: 2400 }
  ]);
  const [quoteNotice, setQuoteNotice] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { if (d.success) setStats(d); });
    fetch('/api/bookings').then(r => r.json()).then(d => { if (d.success) setBookings(d.bookings); });
    fetch('/api/leads').then(r => r.json()).then(d => { if (d.success) setLeads(d.leads); });
    fetch('/api/quotations').then(r => r.json()).then(d => { if (d.success) setQuotations(d.quotations); });
    fetch('/api/hotels').then(r => r.json()).then(d => { if (d.success) setHotels(d.hotels); });
    fetch('/api/packages').then(r => r.json()).then(d => { if (d.success) setPackages(d.packages); });
    fetch('/api/vehicles').then(r => r.json()).then(d => { if (d.success) setVehicles(d.vehicles); });
    fetch('/api/reviews').then(r => r.json()).then(d => { if (d.success) setReviews(d.reviews); });
  };

  const handleConvertQuote = async (id) => {
    const res = await fetch(`/api/quotations/${id}/convert-to-booking`, { method: 'POST' }).then(r => r.json());
    if (res.success) {
      alert(`Quotation #${id} converted into Booking #${res.booking.id}! Documents dispatched.`);
      loadData();
    }
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    const subtotal = quoteItems.reduce((s, it) => s + (Number(it.cost) || 0), 0);
    const tax = Math.round(subtotal * 0.05);

    const payload = {
      customerName: quoteCustomer,
      customerPhone: quotePhone,
      tripTitle: quoteTitle,
      destination: 'Himalayas',
      items: quoteItems,
      tax,
      discount: 0
    };

    const res = await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success) {
      setQuoteNotice('✓ Quotation created and dispatched to pipeline!');
      setShowQuoteForm(false);
      setQuoteCustomer('');
      setQuotePhone('');
      setQuoteTitle('');
      loadData();
      setTimeout(() => setQuoteNotice(''), 3000);
    }
  };

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { category: 'Activities', name: 'Sightseeing & Guide', cost: 2000 }]);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 68px)' }}>
      {/* Admin Sidebar */}
      <aside style={{ background: '#092a3e', color: '#fff', padding: '24px 16px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#72c9ef', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
          AGENCY CMS & CRM
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'dashboard', label: '📊 KPI Dashboard' },
            { id: 'bookings', label: `📦 Bookings (${bookings.length})` },
            { id: 'leads', label: `🎯 CRM Leads (${leads.length})` },
            { id: 'quotations', label: `📝 Quotations (${quotations.length})` },
            { id: 'hotels', label: `🏨 Stays (${hotels.length})` },
            { id: 'packages', label: `🏔 Packages (${packages.length})` },
            { id: 'vehicles', label: `🚗 Vehicles (${vehicles.length})` },
            { id: 'reviews', label: `★ Reviews (${reviews.length})` }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 0,
                background: activeTab === item.id ? 'var(--blue)' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Admin Workspace */}
      <main style={{ padding: '32px 40px', background: '#f4fbff' }}>
        {/* KPI DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ font: "700 28px 'Playfair Display', serif", margin: 0, color: 'var(--navy)' }}>Agency Overview & Metrics</h2>
              <a href="/api/admin/export/bookings" style={{ background: 'var(--navy)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
                📥 Export Bookings (CSV)
              </a>
            </div>

            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <div className="glass-panel" style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase' }}>REVENUE COLLECTED</span>
                    <span className="badge-luxury-emerald">▲ +18.4%</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#16a34a', margin: '4px 0' }}>₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>Across 100% verified paid bookings</small>
                </div>

                <div className="glass-panel" style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase' }}>TOTAL BOOKINGS</span>
                    <span className="badge-luxury-cyan">● ACTIVE</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)', margin: '4px 0' }}>{stats.totalBookings}</div>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>{stats.upcomingTripsCount} active Himalayan journeys</small>
                </div>

                <div className="glass-panel" style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase' }}>PENDING DISPATCH</span>
                    <span className="badge-luxury-gold">⏳ PENDING</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#d97706', margin: '4px 0' }}>₹{stats.pendingPayments.toLocaleString('en-IN')}</div>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>Pay-at-property & balance permits</small>
                </div>

                <div className="glass-panel" style={{ background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 800, textTransform: 'uppercase' }}>INBOUND LEADS</span>
                    <span className="badge-luxury-cyan">🎯 PIPELINE</span>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue)', margin: '4px 0' }}>{stats.newLeadsCount}</div>
                  <small style={{ color: 'var(--muted)', fontSize: '12px' }}>Awaiting travel agent callback</small>
                </div>
              </div>
            )}

            {/* Recent Bookings Snapshot */}
            <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
              <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Recent Agency Bookings</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #edf2f7' }}>
                      <th style={{ padding: '10px' }}>Booking ID</th>
                      <th style={{ padding: '10px' }}>Customer</th>
                      <th style={{ padding: '10px' }}>Product</th>
                      <th style={{ padding: '10px' }}>Amount</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 6).map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px', fontWeight: 700 }}>{b.id}</td>
                        <td style={{ padding: '10px' }}>{b.customerName}</td>
                        <td style={{ padding: '10px' }}>{b.productTitle}</td>
                        <td style={{ padding: '10px', fontWeight: 700 }}>₹{b.finalAmount.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '10px' }}><span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>{b.bookingStatus}</span></td>
                        <td style={{ padding: '10px' }}>
                          <a href={`/api/pdf/voucher/${b.id}`} target="_blank" style={{ color: 'var(--blue)', fontWeight: 700, marginRight: '10px', textDecoration: 'none' }}>Voucher</a>
                          <a href={`/api/pdf/invoice/${b.id}`} target="_blank" style={{ color: 'var(--blue)', fontWeight: 700, textDecoration: 'none' }}>Invoice</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>All Customer Bookings ({bookings.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #edf2f7' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Customer</th>
                    <th style={{ padding: '10px' }}>Phone</th>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Travel Dates</th>
                    <th style={{ padding: '10px' }}>Amount</th>
                    <th style={{ padding: '10px' }}>Payment</th>
                    <th style={{ padding: '10px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{b.id}</td>
                      <td style={{ padding: '10px' }}>{b.customerName}</td>
                      <td style={{ padding: '10px' }}>{b.customerPhone}</td>
                      <td style={{ padding: '10px' }}>{b.productTitle}</td>
                      <td style={{ padding: '10px' }}>{b.travelStartDate}</td>
                      <td style={{ padding: '10px', fontWeight: 700 }}>₹{b.finalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px' }}><span style={{ background: '#f0f9ff', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>{b.paymentStatus}</span></td>
                      <td style={{ padding: '10px' }}>
                        <a href={`/api/pdf/voucher/${b.id}`} target="_blank" style={{ color: 'var(--blue)', fontWeight: 700, marginRight: '8px', textDecoration: 'none' }}>Voucher PDF</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CRM LEADS PIPELINE */}
        {activeTab === 'leads' && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>CRM Lead Pipeline ({leads.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {leads.map(lead => (
                <div key={lead.id} style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{lead.name}</b>
                    <span style={{ background: lead.status === 'New' ? '#dbeafe' : '#f0fdf4', color: lead.status === 'New' ? '#1d4ed8' : '#15803d', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                      {lead.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#4a5568', lineHeight: '1.6' }}>
                    <div>📍 Destination: <b>{lead.destination}</b></div>
                    <div>📞 Phone: <b>{lead.phone}</b></div>
                    <div>👥 Travellers: <b>{lead.travellers || 2} Pax</b></div>
                    <div>💰 Budget: <b>{lead.budget || 'Standard'}</b></div>
                    {lead.notes && <p style={{ fontSize: '12px', color: 'var(--muted)', margin: '6px 0 0' }}>“{lead.notes}”</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUOTATION BUILDER */}
        {activeTab === 'quotations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: 0, color: 'var(--navy)' }}>Travel Quotations ({quotations.length})</h2>
              <button onClick={() => setShowQuoteForm(!showQuoteForm)} style={{ background: 'var(--navy)', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                {showQuoteForm ? '✕ Close Builder' : '+ Create New Quotation'}
              </button>
            </div>

            {quoteNotice && <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', marginBottom: '20px', fontSize: '13px', fontWeight: 600 }}>{quoteNotice}</div>}

            {showQuoteForm && (
              <form onSubmit={handleSaveQuote} style={{ background: '#fff', padding: '24px', borderRadius: '14px', border: '1px solid #d9f0fb', marginBottom: '28px' }}>
                <h3 style={{ font: "700 18px 'Playfair Display', serif", margin: '0 0 14px', color: 'var(--navy)' }}>Bespoke Quotation Builder</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <input type="text" placeholder="Customer Full Name" required value={quoteCustomer} onChange={e => setQuoteCustomer(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
                  <input type="tel" placeholder="Customer WhatsApp / Phone" required value={quotePhone} onChange={e => setQuotePhone(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
                  <input type="text" placeholder="Trip Title (e.g. Kedarnath Luxury Heli)" required value={quoteTitle} onChange={e => setQuoteTitle(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)' }}>LINE ITEMS</label>
                    <button type="button" onClick={addQuoteItem} style={{ background: 'transparent', border: 0, color: 'var(--blue)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>+ Add Item</button>
                  </div>
                  {quoteItems.map((it, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" value={it.category} onChange={e => { const c = [...quoteItems]; c[i].category = e.target.value; setQuoteItems(c); }} style={{ padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '12px' }} />
                      <input type="text" value={it.name} onChange={e => { const c = [...quoteItems]; c[i].name = e.target.value; setQuoteItems(c); }} style={{ padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '12px' }} />
                      <input type="number" value={it.cost} onChange={e => { const c = [...quoteItems]; c[i].cost = Number(e.target.value); setQuoteItems(c); }} style={{ padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px', fontSize: '12px' }} />
                    </div>
                  ))}
                </div>

                <button type="submit" style={{ background: 'var(--orange)', color: '#fff', border: 0, padding: '10px 20px', borderRadius: '6px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  Save & Generate Quotation
                </button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {quotations.map(q => (
                <div key={q.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2f0f7', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <b style={{ color: 'var(--navy)', fontSize: '16px' }}>{q.tripTitle}</b>
                      <small style={{ color: 'var(--muted)', display: 'block' }}>Customer: {q.customerName} ({q.customerPhone})</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)' }}>₹{q.totalAmount.toLocaleString('en-IN')}</div>
                      <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{q.status}</span>
                    </div>
                  </div>
                  {q.status !== 'Converted' && (
                    <button
                      onClick={() => handleConvertQuote(q.id)}
                      style={{ background: '#16a34a', color: '#fff', border: 0, padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Convert to Confirmed Booking →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVENTORY: HOTELS */}
        {activeTab === 'hotels' && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Hotels Inventory ({hotels.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #edf2f7' }}>
                    <th style={{ padding: '8px' }}>Hotel Name</th>
                    <th style={{ padding: '8px' }}>Location</th>
                    <th style={{ padding: '8px' }}>Type</th>
                    <th style={{ padding: '8px' }}>Nightly Rate</th>
                    <th style={{ padding: '8px' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map(h => (
                    <tr key={h.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>{h.name}</td>
                      <td style={{ padding: '8px' }}>{h.location}</td>
                      <td style={{ padding: '8px' }}>{h.type}</td>
                      <td style={{ padding: '8px', fontWeight: 700 }}>₹{h.pricePerNight.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px' }}>★ {h.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY: PACKAGES */}
        {activeTab === 'packages' && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Tour Packages ({packages.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #edf2f7' }}>
                    <th style={{ padding: '8px' }}>Package Title</th>
                    <th style={{ padding: '8px' }}>Destination</th>
                    <th style={{ padding: '8px' }}>Duration</th>
                    <th style={{ padding: '8px' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>{p.title}</td>
                      <td style={{ padding: '8px' }}>{p.destination}</td>
                      <td style={{ padding: '8px' }}>{p.duration}</td>
                      <td style={{ padding: '8px', fontWeight: 700 }}>₹{p.price.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY: VEHICLES */}
        {activeTab === 'vehicles' && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Fleet & Rentals ({vehicles.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #edf2f7' }}>
                    <th style={{ padding: '8px' }}>Vehicle Name</th>
                    <th style={{ padding: '8px' }}>Category</th>
                    <th style={{ padding: '8px' }}>Type</th>
                    <th style={{ padding: '8px' }}>Rate / Day</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>{v.name}</td>
                      <td style={{ padding: '8px', textTransform: 'uppercase' }}>{v.category}</td>
                      <td style={{ padding: '8px' }}>{v.type}</td>
                      <td style={{ padding: '8px', fontWeight: 700 }}>₹{v.pricePerDay.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS DESK */}
        {activeTab === 'reviews' && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #d9f0fb', padding: '24px' }}>
            <h2 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Review Moderation Desk ({reviews.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <b style={{ color: 'var(--navy)' }}>{r.author} • ★ {r.rating}</b>
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{r.status}</span>
                  </div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px' }}>{r.title}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>“{r.comment}”</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
