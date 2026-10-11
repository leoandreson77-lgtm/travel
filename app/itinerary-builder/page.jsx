'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ItineraryBuilderPage() {
  const [step, setStep] = useState(1);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [activities, setActivities] = useState([]);

  // Selections
  const [destination, setDestination] = useState('Rishikesh');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(4);
  const [travellers, setTravellers] = useState(2);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Daily Schedule
  const [days, setDays] = useState([]);
  const [savedItinId, setSavedItinId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setStartDate(today);

    fetch('/api/destinations').then(r => r.json()).then(d => { if (d.success) setDestinations(d.destinations); });
    fetch('/api/hotels').then(r => r.json()).then(d => {
      if (d.success) {
        setHotels(d.hotels);
        if (d.hotels.length) setSelectedHotel(d.hotels[0]);
      }
    });
    fetch('/api/vehicles').then(r => r.json()).then(d => {
      if (d.success) {
        setVehicles(d.vehicles);
        if (d.vehicles.length) setSelectedVehicle(d.vehicles[0]);
      }
    });
    fetch('/api/activities').then(r => r.json()).then(d => { if (d.success) setActivities(d.activities); });
  }, []);

  useEffect(() => {
    const newDays = [];
    for (let i = 1; i <= duration; i++) {
      newDays.push({
        dayNumber: i,
        title: i === 1 ? 'Arrival & Welcome Dinner' : i === duration ? 'Farewell & Departure' : `Exploration & Mountain Leisure`,
        morning: i === 1 ? 'Scenic airport / train pickup & hotel check-in' : 'Morning mountain yoga or riverfront walk',
        afternoon: 'Sightseeing, temple darshan & authentic local cafe meal',
        evening: 'Sunset Ganga Aarti and evening campfire'
      });
    }
    setDays(newDays);
  }, [duration]);

  const hotelCost = selectedHotel ? selectedHotel.pricePerNight * duration : 0;
  const transportCost = selectedVehicle ? selectedVehicle.pricePerDay * duration : 0;
  const activityCost = selectedActivities.reduce((sum, actId) => {
    const act = activities.find(a => a.id === actId);
    return sum + (act ? act.price * travellers : 0);
  }, 0);
  const totalCost = hotelCost + transportCost + activityCost;

  const toggleActivity = (id) => {
    if (selectedActivities.includes(id)) {
      setSelectedActivities(selectedActivities.filter(x => x !== id));
    } else {
      setSelectedActivities([...selectedActivities, id]);
    }
  };

  const handleSaveTrip = async () => {
    setStatusMsg('Saving your custom itinerary to database...');
    const payload = {
      title: `${duration}-Day Bespoke ${destination} Expedition`,
      destination,
      durationDays: duration,
      travellers,
      hotelId: selectedHotel?.id || '',
      hotelName: selectedHotel?.name || 'Selected Mountain Stay',
      vehicleId: selectedVehicle?.id || '',
      vehicleName: selectedVehicle?.name || 'Selected Transport',
      totalEstimatedCost: totalCost,
      days
    };

    const res = await fetch('/api/itineraries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json());

    if (res.success) {
      setSavedItinId(res.itinerary.id);
      setStatusMsg('✓ Itinerary saved! You can now download the PDF or proceed to booking.');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '30px auto 80px', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--blue)', letterSpacing: '2px' }}>
          7-STEP BESPOKE TRAVEL ENGINE
        </span>
        <h1 style={{ font: "700 42px 'Playfair Display', serif", margin: '8px 0 10px', color: 'var(--navy)' }}>
          Design Your Custom Himalayan Itinerary
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '650px', margin: '0 auto' }}>
          Mix & match verified boutique hotels, private 4x4s or taxis, thrilling adventure slots, and generate a professional branded PDF in seconds.
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '36px', overflowX: 'auto', paddingBottom: '8px' }}>
        {[
          '1. Destination',
          '2. Dates & Travellers',
          '3. Stays',
          '4. Transport',
          '5. Thrills',
          '6. Daily Planner',
          '7. Summary & PDF'
        ].map((lbl, idx) => (
          <button
            key={idx}
            onClick={() => setStep(idx + 1)}
            className={`chip-interactive ${step === idx + 1 ? 'active' : ''}`}
            style={{ fontSize: '12px', padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            {lbl}
          </button>
        ))}
      </div>

      {/* Main Form Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #d9f0fb', boxShadow: '0 6px 20px rgba(22,75,104,0.06)' }}>
          {/* STEP 1: Destination */}
          {step === 1 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Select Your Primary Himalayan Region</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                {destinations.map(d => (
                  <div
                    key={d.id}
                    onClick={() => setDestination(d.name)}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: destination === d.name ? 'var(--blue)' : '#edf2f7',
                      background: destination === d.name ? '#f0f9ff' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{d.name}</b>
                    <small style={{ display: 'block', color: 'var(--muted)', marginTop: '4px' }}>{d.state}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Dates & Travellers */}
          {step === 2 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Trip Duration & Travelers</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>START DATE</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e0' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>TOTAL DAYS: {duration}</label>
                  <input type="range" min="2" max="10" value={duration} onChange={e => setDuration(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>TRAVELLERS: {travellers} Adults</label>
                  <input type="range" min="1" max="12" value={travellers} onChange={e => setTravellers(Number(e.target.value))} style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Accommodation */}
          {step === 3 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Choose Verified Hotel or Resort</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {hotels.slice(0, 5).map(h => (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHotel(h)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: selectedHotel?.id === h.id ? 'var(--blue)' : '#edf2f7',
                      background: selectedHotel?.id === h.id ? '#f0f9ff' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={h.heroImage} alt={h.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{h.name}</b>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>📍 {h.location} • ★ {h.rating}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--navy)' }}>₹{h.pricePerNight.toLocaleString('en-IN')}</div>
                      <small style={{ color: 'var(--muted)' }}>/ night</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Transport */}
          {step === 4 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Choose Transport or Rental</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {vehicles.slice(0, 6).map(v => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '14px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: selectedVehicle?.id === v.id ? 'var(--blue)' : '#edf2f7',
                      background: selectedVehicle?.id === v.id ? '#f0f9ff' : '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={v.image} alt={v.name} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <b style={{ color: 'var(--navy)', fontSize: '15px' }}>{v.name}</b>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>{v.category.toUpperCase()} • {v.type}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: 'var(--navy)' }}>₹{v.pricePerDay.toLocaleString('en-IN')}</div>
                      <small style={{ color: 'var(--muted)' }}>/ day</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Activities */}
          {step === 5 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Select Activities & Adventures</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {activities.slice(0, 8).map(a => {
                  const isChecked = selectedActivities.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      onClick={() => toggleActivity(a.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: isChecked ? 'var(--blue)' : '#edf2f7',
                        background: isChecked ? '#f0f9ff' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <b style={{ color: 'var(--navy)', fontSize: '14px', display: 'block' }}>{isChecked ? '✓ ' : '+ '}{a.name}</b>
                      <p style={{ margin: '4px 0 8px', fontSize: '11px', color: 'var(--muted)' }}>⏱ {a.duration} • 📍 {a.location}</p>
                      <div style={{ fontWeight: 800, color: 'var(--navy)', fontSize: '14px' }}>₹{a.price.toLocaleString('en-IN')} / person</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Daily Planner */}
          {step === 6 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Review & Customize Day-by-Day Schedule</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {days.map((d, idx) => (
                  <div key={idx} style={{ padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ background: 'var(--navy)', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', display: 'grid', placeItems: 'center', fontSize: '12px', fontWeight: 800 }}>{d.dayNumber}</span>
                      <input
                        type="text"
                        value={d.title}
                        onChange={e => {
                          const copy = [...days];
                          copy[idx].title = e.target.value;
                          setDays(copy);
                        }}
                        style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '14px', fontWeight: 700 }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', fontSize: '12px' }}>
                      <div>
                        <small style={{ color: 'var(--muted)', display: 'block' }}>Morning</small>
                        <input type="text" value={d.morning} onChange={e => { const c = [...days]; c[idx].morning = e.target.value; setDays(c); }} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px' }} />
                      </div>
                      <div>
                        <small style={{ color: 'var(--muted)', display: 'block' }}>Afternoon</small>
                        <input type="text" value={d.afternoon} onChange={e => { const c = [...days]; c[idx].afternoon = e.target.value; setDays(c); }} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px' }} />
                      </div>
                      <div>
                        <small style={{ color: 'var(--muted)', display: 'block' }}>Evening</small>
                        <input type="text" value={d.evening} onChange={e => { const c = [...days]; c[idx].evening = e.target.value; setDays(c); }} style={{ width: '100%', padding: '6px', border: '1px solid #cbd5e0', borderRadius: '4px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Summary */}
          {step === 7 && (
            <div>
              <h3 style={{ font: "700 24px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>Ready to Finalize Your Journey</h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                Your custom <b>{duration}-day</b> trip to <b>{destination}</b> for <b>{travellers} travellers</b> is prepared.
                You can save this itinerary to your profile, download an official PDF document, or book instantly.
              </p>

              {statusMsg && (
                <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0', margin: '16px 0', fontSize: '13px', fontWeight: 600 }}>
                  {statusMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '28px' }}>
                <button
                  onClick={handleSaveTrip}
                  className="btn-luxury-outline"
                >
                  💾 Save Itinerary
                </button>

                {savedItinId && (
                  <a
                    href={`/api/pdf/itinerary/${savedItinId}`}
                    target="_blank"
                    className="btn-luxury-outline"
                    style={{ border: '1.5px solid #0284c7', color: '#0284c7' }}
                  >
                    📄 Download PDF Itinerary
                  </a>
                )}

                <Link
                  href={`/checkout?productId=custom-itin&productType=package&title=${encodeURIComponent(`${duration}-Day Custom ${destination} Trip`)}&basePrice=${totalCost}`}
                  className="btn-luxury"
                >
                  Book Trip Instantly →
                </Link>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '22px', borderTop: '1px solid #e0f2fe' }}>
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="btn-luxury-outline"
              style={{ opacity: step === 1 ? 0.4 : 1, cursor: step === 1 ? 'not-allowed' : 'pointer' }}
            >
              ← Previous Step
            </button>
            <button
              onClick={() => setStep(Math.min(7, step + 1))}
              disabled={step === 7}
              className="btn-luxury"
              style={{ opacity: step === 7 ? 0.4 : 1, cursor: step === 7 ? 'not-allowed' : 'pointer' }}
            >
              Next Step →
            </button>
          </div>
        </div>

        {/* Live Trip Summary Card */}
        <aside className="glass-panel" style={{ padding: '26px', background: '#fff', position: 'sticky', top: '96px' }}>
          <h3 style={{ font: "700 20px 'Playfair Display', serif", margin: '0 0 16px', color: 'var(--navy)' }}>
            Live Trip Estimate
          </h3>
          <div style={{ fontSize: '13px', lineHeight: '2', color: 'var(--navy)', borderBottom: '1px solid #e0f2fe', paddingBottom: '16px', marginBottom: '16px' }}>
            <div>📍 Destination: <b>{destination}</b></div>
            <div>⏱ Duration: <b>{duration} Days</b></div>
            <div>👥 Travellers: <b>{travellers} Guests</b></div>
            <div>🏨 Stay: <b>{selectedHotel ? selectedHotel.name : 'None selected'}</b></div>
            <div>🚗 Transport: <b>{selectedVehicle ? selectedVehicle.name : 'None selected'}</b></div>
            <div>🧗 Thrills: <b>{selectedActivities.length} activities</b></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>Accommodation ({duration} nights):</span>
            <b style={{ color: 'var(--navy)' }}>₹{hotelCost.toLocaleString('en-IN')}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
            <span style={{ color: 'var(--muted)' }}>Transit ({duration} days):</span>
            <b style={{ color: 'var(--navy)' }}>₹{transportCost.toLocaleString('en-IN')}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '16px' }}>
            <span style={{ color: 'var(--muted)' }}>Activities ({travellers} pax):</span>
            <b style={{ color: 'var(--navy)' }}>₹{activityCost.toLocaleString('en-IN')}</b>
          </div>

          <div style={{ borderTop: '2px solid #e0f2fe', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)' }}>Total Estimated:</span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--blue)' }}>₹{totalCost.toLocaleString('en-IN')}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
