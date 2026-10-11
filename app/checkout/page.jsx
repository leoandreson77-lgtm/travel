'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productType = searchParams.get('productType') || searchParams.get('type') || 'hotel';
  const productId = searchParams.get('productId') || searchParams.get('id') || 'htl-1';
  const initialTitle = searchParams.get('title') || 'Travel Booking';
  const initialBasePrice = parseFloat(searchParams.get('basePrice') || '0');
  const initialDays = parseInt(searchParams.get('days') || '1');
  const initialGuests = parseInt(searchParams.get('guests') || '2');

  const [customerName, setCustomerName] = useState('Sameer Sharma');
  const [customerEmail, setCustomerEmail] = useState('sameer@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [specialRequests, setSpecialRequests] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // Server-calculated pricing
  const [pricing, setPricing] = useState({
    productTitle: initialTitle,
    basePrice: initialBasePrice,
    taxes: Math.round(initialBasePrice * 0.12),
    discount: 0,
    couponApplied: '',
    finalAmount: Math.round(initialBasePrice * 1.12)
  });

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    recalculatePrice();
  }, [productType, productId, initialDays, initialGuests]);

  const recalculatePrice = async (couponToApply) => {
    try {
      const res = await fetch('/api/checkout/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          productId,
          roomsCount: 1,
          durationDays: initialDays,
          travellersCount: initialGuests,
          couponCode: couponToApply !== undefined ? couponToApply : couponCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setPricing(data);
      }
    } catch (e) {
      console.error('Calculation error:', e);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    recalculatePrice(couponCode);
  };

  const handleCompleteBooking = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        productId,
        productType,
        productTitle: pricing.productTitle,
        customerName,
        customerEmail,
        customerPhone,
        travelStartDate: searchParams.get('startDate') || new Date().toISOString().slice(0, 10),
        travelEndDate: searchParams.get('endDate') || new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
        travellers: initialGuests,
        basePrice: pricing.basePrice,
        taxes: pricing.taxes,
        discount: pricing.discount,
        couponApplied: pricing.couponApplied,
        finalAmount: pricing.finalAmount,
        paymentMethod,
        specialRequests
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setConfirmedBooking(data.booking);
      }
    } catch (err) {
      alert('Booking error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmedBooking) {
    return (
      <div style={{ maxWidth: '720px', margin: '60px auto 100px', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #bbf7d0', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#15803d', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '32px', margin: '0 auto 16px' }}>
            ✓
          </div>
          <h1 style={{ font: "700 32px 'Playfair Display', serif", color: 'var(--navy)', margin: '0 0 8px' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', margin: '0 0 24px' }}>
            Your reservation has been locked with the supplier. Booking Reference: <b style={{ color: 'var(--navy)' }}>{confirmedBooking.id}</b>
          </p>

          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '28px', fontSize: '14px', lineHeight: '1.8' }}>
            <div>Product: <b>{confirmedBooking.productTitle}</b></div>
            <div>Travel Dates: <b>{confirmedBooking.travelStartDate} to {confirmedBooking.travelEndDate}</b></div>
            <div>Customer: <b>{confirmedBooking.customerName} ({confirmedBooking.customerPhone})</b></div>
            <div>Amount Paid: <b>₹{confirmedBooking.finalAmount.toLocaleString('en-IN')}</b> ({confirmedBooking.paymentMethod})</div>
            <div>Booking Status: <span style={{ color: '#16a34a', fontWeight: 700 }}>Confirmed</span></div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`/api/pdf/voucher/${confirmedBooking.id}`}
              target="_blank"
              style={{ background: 'var(--navy)', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}
            >
              📄 Download Travel Voucher
            </a>
            <a
              href={`/api/pdf/invoice/${confirmedBooking.id}`}
              target="_blank"
              style={{ background: '#fff', border: '1px solid var(--navy)', color: 'var(--navy)', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}
            >
              🧾 Download Tax Invoice
            </a>
            <Link
              href="/my-trips"
              style={{ background: '#0284c7', color: '#fff', textDecoration: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '14px' }}
            >
              Go to My Trips Portal →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto 80px', padding: '0 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ font: "700 32px 'Playfair Display', serif", margin: '0 0 6px', color: 'var(--navy)' }}>Secure Unified Checkout</h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>Transparent pricing with GST calculation, instant booking confirmation, and 24/7 dedicated travel support.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '36px', alignItems: 'start' }}>
        {/* Customer & Traveller Form */}
        <form onSubmit={handleCompleteBooking} style={{ background: '#fff', padding: '30px', borderRadius: '16px', border: '1px solid #d9f0fb', boxShadow: '0 6px 20px rgba(22,75,104,0.06)' }}>
          <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>1. Primary Contact Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
              <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>PHONE / WHATSAPP</label>
              <input type="tel" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
              <input type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }} />
            </div>
          </div>

          <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>2. Special Requests & Notes</h3>
          <div style={{ marginBottom: '24px' }}>
            <textarea
              rows="3"
              placeholder="e.g. Vegetarian meals only, infant car seat, early hotel check-in..."
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '13px' }}
            />
          </div>

          <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>3. Payment Method</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '28px' }}>
            {[
              { id: 'UPI', label: 'UPI / QR' },
              { id: 'Card', label: 'Credit / Debit Card' },
              { id: 'Advance', label: '25% Advance' },
              { id: 'Pay Later', label: 'Pay at Property' }
            ].map(m => (
              <div
                key={m.id}
                onClick={() => setPaymentMethod(m.id)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid',
                  borderColor: paymentMethod === m.id ? 'var(--blue)' : '#cbd5e0',
                  background: paymentMethod === m.id ? '#f0f9ff' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--navy)'
                }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: 'var(--orange)', color: '#fff', border: 0, padding: '14px', borderRadius: '8px', fontWeight: 800, fontSize: '15px', cursor: 'pointer', letterSpacing: '0.5px' }}
          >
            {loading ? 'Processing Reservation...' : `Confirm & Pay ₹${pricing.finalAmount.toLocaleString('en-IN')}`}
          </button>
        </form>

        {/* Price Breakdown Sidebar */}
        <aside style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #d9f0fb', boxShadow: '0 6px 20px rgba(22,75,104,0.06)' }}>
          <h3 style={{ font: "700 18px 'Playfair Display', serif", margin: '0 0 12px', color: 'var(--navy)' }}>Order Summary</h3>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '16px' }}>{pricing.productTitle}</div>

          {/* Coupon Input */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Promo Code"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '13px', textTransform: 'uppercase' }}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              style={{ background: 'var(--navy)', color: '#fff', border: 0, padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              Apply
            </button>
          </div>

          <div style={{ fontSize: '13px', lineHeight: '2.2', color: '#4a5568', borderTop: '1px solid #edf2f7', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Base Price ({pricing.multiplier} units):</span>
              <b>₹{pricing.basePrice.toLocaleString('en-IN')}</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>GST & Taxes (Official):</span>
              <b>+ ₹{pricing.taxes.toLocaleString('en-IN')}</b>
            </div>
            {pricing.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                <span>Coupon Discount ({pricing.couponApplied}):</span>
                <b>- ₹{pricing.discount.toLocaleString('en-IN')}</b>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0369a1' }}>
              <span>Convenience & Booking Fee:</span>
              <b>FREE (₹0)</b>
            </div>
          </div>

          <div style={{ borderTop: '2px solid #edf2f7', paddingTop: '14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)' }}>Final Payable:</span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--navy)' }}>₹{pricing.finalAmount.toLocaleString('en-IN')}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>Loading checkout details...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
