const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const db = require('./data/database');
const pdfService = require('./pdf-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration for Media Library
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(uploadDir));
app.use('/travel2-main', express.static(__dirname));
app.use(express.static(__dirname));

// Simple in-memory session simulation for active logged-in user
let currentUserId = 'usr-6'; // Default: Sameer Sharma (Customer)

// --------------------------------------------------------------------------
// 1. AUTH & PROFILE APIS
// --------------------------------------------------------------------------
app.get('/api/auth/me', (req, res) => {
  const user = db.findById('users', currentUserId) || db.get('users')[0];
  res.json({ success: true, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = db.findOne('users', u => u.email.toLowerCase() === (email || '').toLowerCase());
  if (user) {
    currentUserId = user.id;
    return res.json({ success: true, user, message: 'Logged in successfully' });
  }
  // If not found, create new customer
  const newUser = db.insert('users', {
    name: (email || 'Traveler').split('@')[0],
    email: email || 'traveler@example.com',
    role: 'Customer',
    phone: '+91 98000 00000',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  });
  currentUserId = newUser.id;
  res.json({ success: true, user: newUser, message: 'Account created and logged in' });
});

app.post('/api/auth/switch-user', (req, res) => {
  const { role, userId } = req.body;
  let user;
  if (userId) {
    user = db.findById('users', userId);
  } else if (role) {
    user = db.findOne('users', u => u.role.toLowerCase() === role.toLowerCase());
  }
  if (user) {
    currentUserId = user.id;
    return res.json({ success: true, user, message: `Switched active profile to ${user.name} (${user.role})` });
  }
  res.status(404).json({ success: false, message: 'User not found' });
});

app.put('/api/auth/profile', (req, res) => {
  const updates = req.body;
  const user = db.update('users', currentUserId, updates);
  res.json({ success: true, user });
});

// --------------------------------------------------------------------------
// 2. DESTINATIONS API
// --------------------------------------------------------------------------
app.get('/api/destinations', (req, res) => {
  let list = db.get('destinations');
  const { search, popular } = req.query;
  if (popular === 'true') {
    list = list.filter(d => d.isPopular);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q));
  }
  res.json({ success: true, count: list.length, destinations: list });
});

app.get('/api/destinations/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const destination = db.findOne('destinations', d => d.id === idOrSlug || d.slug === idOrSlug);
  if (!destination) {
    return res.status(404).json({ success: false, message: 'Destination not found' });
  }

  // Related hotels and activities in this destination
  const hotels = db.find('hotels', h => h.destinationSlug === destination.slug || h.location.toLowerCase() === destination.name.toLowerCase());
  const packages = db.find('packages', p => p.destinationSlug === destination.slug || p.destination.toLowerCase().includes(destination.name.toLowerCase()));
  const activities = db.find('activities', a => a.destinationSlug === destination.slug || a.location.toLowerCase().includes(destination.name.toLowerCase()));

  res.json({
    success: true,
    destination,
    related: { hotels, packages, activities }
  });
});

app.post('/api/destinations', (req, res) => {
  const newItem = db.insert('destinations', {
    ...req.body,
    slug: (req.body.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
    status: req.body.status || 'published'
  });
  res.status(201).json({ success: true, destination: newItem });
});

app.put('/api/destinations/:id', (req, res) => {
  const updated = db.update('destinations', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, destination: updated });
});

app.delete('/api/destinations/:id', (req, res) => {
  const ok = db.delete('destinations', req.params.id);
  res.json({ success: ok });
});

// --------------------------------------------------------------------------
// 3. HOTELS & APARTMENTS API
// --------------------------------------------------------------------------
app.get('/api/hotels', (req, res) => {
  let list = db.get('hotels');
  const { location, search, type, coupleFriendly, breakfast, freeCancellation, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  if (location && location !== 'All') {
    list = list.filter(h => h.location.toLowerCase().includes(location.toLowerCase()) || (h.destinationSlug && h.destinationSlug.includes(location.toLowerCase())));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));
  }
  if (type && type !== 'All') {
    list = list.filter(h => h.type.toLowerCase() === type.toLowerCase());
  }
  if (coupleFriendly === 'true') {
    list = list.filter(h => h.coupleFriendly);
  }
  if (breakfast === 'true') {
    list = list.filter(h => h.breakfastIncluded);
  }
  if (freeCancellation === 'true') {
    list = list.filter(h => h.freeCancellation);
  }
  if (minPrice) {
    list = list.filter(h => h.pricePerNight >= Number(minPrice));
  }
  if (maxPrice) {
    list = list.filter(h => h.pricePerNight <= Number(maxPrice));
  }

  // Sorting
  if (sort === 'low') {
    list.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sort === 'high') {
    list.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  const total = list.length;
  const p = Math.max(1, Number(page));
  const l = Math.max(1, Number(limit));
  const paginated = list.slice((p - 1) * l, p * l);

  res.json({
    success: true,
    total,
    page: p,
    totalPages: Math.ceil(total / l),
    hotels: paginated
  });
});

app.get('/api/hotels/:id', (req, res) => {
  const hotel = db.findById('hotels', req.params.id);
  if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
  const reviews = db.find('reviews', r => r.productId === hotel.id && r.status === 'approved');
  res.json({ success: true, hotel, reviews });
});

app.post('/api/hotels', (req, res) => {
  const newHotel = db.insert('hotels', {
    ...req.body,
    pricePerNight: Number(req.body.pricePerNight) || 2499,
    rating: req.body.rating || 4.7,
    reviewsCount: req.body.reviewsCount || 0,
    status: req.body.status || 'published'
  });
  res.status(201).json({ success: true, hotel: newHotel });
});

app.put('/api/hotels/:id', (req, res) => {
  const updated = db.update('hotels', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, hotel: updated });
});

app.delete('/api/hotels/:id', (req, res) => {
  const ok = db.delete('hotels', req.params.id);
  res.json({ success: ok });
});

// --------------------------------------------------------------------------
// 4. TOURS & PACKAGES API
// --------------------------------------------------------------------------
app.get('/api/packages', (req, res) => {
  let list = db.get('packages');
  const { destination, category, type, search, sort } = req.query;

  if (destination && destination !== 'All') {
    list = list.filter(p => p.destination.toLowerCase().includes(destination.toLowerCase()) || (p.destinationSlug && p.destinationSlug.includes(destination.toLowerCase())));
  }
  if (category && category !== 'All') {
    list = list.filter(p => p.category && p.category.toLowerCase() === category.toLowerCase());
  }
  if (type && type !== 'All') {
    list = list.filter(p => p.type && p.type.toLowerCase() === type.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q));
  }

  if (sort === 'low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: list.length, packages: list });
});

app.get('/api/packages/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  const pkg = db.findOne('packages', p => p.id === idOrSlug || p.slug === idOrSlug);
  if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
  const reviews = db.find('reviews', r => r.productId === pkg.id && r.status === 'approved');
  res.json({ success: true, package: pkg, reviews });
});

app.post('/api/packages', (req, res) => {
  const newPkg = db.insert('packages', {
    ...req.body,
    slug: (req.body.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
    price: Number(req.body.price) || 9999,
    status: req.body.status || 'published'
  });
  res.status(201).json({ success: true, package: newPkg });
});

app.put('/api/packages/:id', (req, res) => {
  const updated = db.update('packages', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, package: updated });
});

app.delete('/api/packages/:id', (req, res) => {
  const ok = db.delete('packages', req.params.id);
  res.json({ success: ok });
});

// --------------------------------------------------------------------------
// 5. VEHICLES & TAXIS API (Self-Drive Cars, Bikes, Scooties, Taxis)
// --------------------------------------------------------------------------
app.get('/api/vehicles', (req, res) => {
  let list = db.get('vehicles');
  const { category, type, location, search, sort } = req.query;

  if (category && category !== 'All') {
    list = list.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }
  if (type && type !== 'All') {
    list = list.filter(v => v.type.toLowerCase() === type.toLowerCase());
  }
  if (location && location !== 'All') {
    list = list.filter(v => v.availableLocations && v.availableLocations.some(l => l.toLowerCase().includes(location.toLowerCase())));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(v => v.name.toLowerCase().includes(q) || v.type.toLowerCase().includes(q));
  }

  if (sort === 'low') {
    list.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sort === 'high') {
    list.sort((a, b) => b.pricePerDay - a.pricePerDay);
  }

  res.json({ success: true, count: list.length, vehicles: list });
});

app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = db.findById('vehicles', req.params.id);
  if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
  res.json({ success: true, vehicle });
});

app.post('/api/vehicles', (req, res) => {
  const newV = db.insert('vehicles', {
    ...req.body,
    pricePerDay: Number(req.body.pricePerDay) || 999,
    status: req.body.status || 'available'
  });
  res.status(201).json({ success: true, vehicle: newV });
});

app.put('/api/vehicles/:id', (req, res) => {
  const updated = db.update('vehicles', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, vehicle: updated });
});

app.delete('/api/vehicles/:id', (req, res) => {
  const ok = db.delete('vehicles', req.params.id);
  res.json({ success: ok });
});

// --------------------------------------------------------------------------
// 6. ACTIVITIES & ADVENTURES API (Rafting, Bungee, Treks, Safaris)
// --------------------------------------------------------------------------
app.get('/api/activities', (req, res) => {
  let list = db.get('activities');
  const { category, destination, difficulty, search, sort } = req.query;

  if (category && category !== 'All') {
    list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
  }
  if (destination && destination !== 'All') {
    list = list.filter(a => a.location.toLowerCase().includes(destination.toLowerCase()) || (a.destinationSlug && a.destinationSlug.includes(destination.toLowerCase())));
  }
  if (difficulty && difficulty !== 'All') {
    list = list.filter(a => a.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a => a.name.toLowerCase().includes(q) || a.location.toLowerCase().includes(q) || a.highlights.toLowerCase().includes(q));
  }

  if (sort === 'low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: list.length, activities: list });
});

app.get('/api/activities/:id', (req, res) => {
  const activity = db.findById('activities', req.params.id);
  if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
  res.json({ success: true, activity });
});

app.post('/api/activities', (req, res) => {
  const newAct = db.insert('activities', {
    ...req.body,
    price: Number(req.body.price) || 1299,
    status: req.body.status || 'published'
  });
  res.status(201).json({ success: true, activity: newAct });
});

app.put('/api/activities/:id', (req, res) => {
  const updated = db.update('activities', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, activity: updated });
});

app.delete('/api/activities/:id', (req, res) => {
  const ok = db.delete('activities', req.params.id);
  res.json({ success: ok });
});

// --------------------------------------------------------------------------
// 7. COUPONS & PROMOS API
// --------------------------------------------------------------------------
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, coupons: db.get('coupons') });
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, amount, productType } = req.body;
  const coupon = db.findOne('coupons', c => c.code.toUpperCase() === (code || '').trim().toUpperCase() && c.status === 'active');
  if (!coupon) {
    return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
  }

  const bookingAmt = Number(amount) || 0;
  if (bookingAmt < coupon.minBookingAmount) {
    return res.status(400).json({ success: false, message: `Coupon requires minimum booking of ₹${coupon.minBookingAmount.toLocaleString('en-IN')}` });
  }

  if (coupon.applicableTo !== 'all' && productType && coupon.applicableTo !== productType.toLowerCase()) {
    return res.status(400).json({ success: false, message: `Coupon is valid only for ${coupon.applicableTo} bookings` });
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round((bookingAmt * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  res.json({
    success: true,
    code: coupon.code,
    discount,
    description: coupon.description
  });
});

// --------------------------------------------------------------------------
// 8. UNIFIED SERVER-SIDE PRICE CHECK & CHECKOUT ENGINE
// --------------------------------------------------------------------------
app.post('/api/checkout/calculate', (req, res) => {
  const { productId, productType, days = 1, travellers = 1, couponCode } = req.body;
  let baseUnitRate = 0;
  let productTitle = '';

  // Look up source truth from DB
  if (productType === 'hotel') {
    const hotel = db.findById('hotels', productId);
    if (!hotel) return res.status(404).json({ success: false, message: 'Selected hotel not found' });
    baseUnitRate = hotel.pricePerNight;
    productTitle = hotel.name;
  } else if (productType === 'package') {
    const pkg = db.findById('packages', productId);
    if (!pkg) return res.status(404).json({ success: false, message: 'Selected package not found' });
    baseUnitRate = pkg.price;
    productTitle = pkg.title;
  } else if (productType === 'vehicle' || productType === 'taxi') {
    const veh = db.findById('vehicles', productId);
    if (!veh) return res.status(404).json({ success: false, message: 'Selected vehicle not found' });
    baseUnitRate = veh.pricePerDay;
    productTitle = veh.name;
  } else if (productType === 'activity') {
    const act = db.findById('activities', productId);
    if (!act) return res.status(404).json({ success: false, message: 'Selected activity not found' });
    baseUnitRate = act.price;
    productTitle = act.name;
  } else {
    baseUnitRate = Number(req.body.customRate) || 2000;
    productTitle = req.body.customTitle || 'Custom Travel Service';
  }

  const multiplier = productType === 'hotel' || productType === 'vehicle' || productType === 'taxi'
    ? Math.max(1, Number(days))
    : Math.max(1, Number(travellers));

  const basePrice = baseUnitRate * multiplier;
  
  // Tax calculation (GST rules: 18% on hotel > 7500 or vehicles, 12% on standard hotels, 5% on tours/rafting)
  const gstRate = productType === 'package' || productType === 'activity' ? 0.05 : 0.12;
  const taxes = Math.round(basePrice * gstRate);
  const serviceFee = 0;

  // Coupon evaluation
  let discount = 0;
  let couponApplied = '';
  if (couponCode) {
    const coupon = db.findOne('coupons', c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.status === 'active');
    if (coupon && basePrice >= coupon.minBookingAmount) {
      if (coupon.applicableTo === 'all' || !productType || coupon.applicableTo === productType.toLowerCase()) {
        if (coupon.type === 'percentage') {
          discount = Math.round((basePrice * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
        } else {
          discount = coupon.discountValue;
        }
        couponApplied = coupon.code;
      }
    }
  }

  const finalAmount = Math.max(0, basePrice + taxes + serviceFee - discount);

  res.json({
    success: true,
    productTitle,
    baseUnitRate,
    multiplier,
    basePrice,
    taxes,
    serviceFee,
    discount,
    couponApplied,
    finalAmount
  });
});

app.post('/api/bookings', (req, res) => {
  const {
    productId,
    productType,
    productTitle,
    travelStartDate,
    travelEndDate,
    travellers = 1,
    travellerDetails = [],
    customerName,
    customerEmail,
    customerPhone,
    paymentMethod = 'Online UPI',
    couponCode,
    specialRequests
  } = req.body;

  // Recalculate server-side price
  let baseUnitRate = 0;
  if (productType === 'hotel') {
    const hotel = db.findById('hotels', productId);
    baseUnitRate = hotel ? hotel.pricePerNight : 3000;
  } else if (productType === 'package') {
    const pkg = db.findById('packages', productId);
    baseUnitRate = pkg ? pkg.price : 12000;
  } else if (productType === 'vehicle' || productType === 'taxi') {
    const veh = db.findById('vehicles', productId);
    baseUnitRate = veh ? veh.pricePerDay : 1200;
  } else if (productType === 'activity') {
    const act = db.findById('activities', productId);
    baseUnitRate = act ? act.price : 1500;
  } else {
    baseUnitRate = Number(req.body.price) || 2500;
  }

  const daysDiff = (travelStartDate && travelEndDate)
    ? Math.max(1, Math.round((new Date(travelEndDate) - new Date(travelStartDate)) / (1000 * 60 * 60 * 24)))
    : 1;

  const mult = (productType === 'hotel' || productType === 'vehicle' || productType === 'taxi') ? daysDiff : travellers;
  const basePrice = baseUnitRate * mult;
  const gstRate = productType === 'package' || productType === 'activity' ? 0.05 : 0.12;
  const taxes = Math.round(basePrice * gstRate);

  let discount = 0;
  let couponApplied = '';
  if (couponCode) {
    const coupon = db.findOne('coupons', c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.status === 'active');
    if (coupon && basePrice >= coupon.minBookingAmount) {
      discount = coupon.type === 'percentage'
        ? Math.min(coupon.maxDiscount || 9999, Math.round((basePrice * coupon.discountValue) / 100))
        : coupon.discountValue;
      couponApplied = coupon.code;
    }
  }

  const finalAmount = Math.max(0, basePrice + taxes - discount);

  const currentUser = db.findById('users', currentUserId) || {};

  const booking = db.insert('bookings', {
    id: `YM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: currentUser.id || currentUserId,
    customerName: customerName || currentUser.name || 'Sameer Sharma',
    customerEmail: customerEmail || currentUser.email || 'sameer@example.com',
    customerPhone: customerPhone || currentUser.phone || '+91 98765 43210',
    productId: productId || 'custom-trip',
    productType: productType || 'custom',
    productTitle: productTitle || 'Custom Himalayan Booking',
    bookingDate: new Date().toISOString().slice(0, 10),
    travelStartDate: travelStartDate || new Date().toISOString().slice(0, 10),
    travelEndDate: travelEndDate || travelStartDate || new Date().toISOString().slice(0, 10),
    travellers: Number(travellers) || 1,
    travellerDetails: travellerDetails.length ? travellerDetails : [{ name: customerName || 'Lead Traveller', age: 30, gender: 'Not specified' }],
    specialRequests: specialRequests || '',
    basePrice,
    taxes,
    serviceFee: 0,
    discount,
    couponApplied,
    finalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'Pay at Property' ? 'Payment Pending' : 'Paid',
    bookingStatus: 'Confirmed',
    cancellationStatus: 'None',
    assignedAgent: 'Priya Patel'
  });

  // Automatically create a notification for the user
  db.insert('notifications', {
    userId: booking.customerId,
    title: `Booking Confirmed: ${booking.id}`,
    message: `Your booking for ${booking.productTitle} has been confirmed. Download your voucher & invoice now!`,
    type: 'booking',
    read: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    booking,
    message: 'Booking created successfully'
  });
});

app.get('/api/bookings', (req, res) => {
  const { customerId, status } = req.query;
  let list = db.get('bookings');
  if (customerId) {
    list = list.filter(b => b.customerId === customerId);
  }
  if (status && status !== 'All') {
    list = list.filter(b => b.bookingStatus.toLowerCase() === status.toLowerCase());
  }
  list.sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate));
  res.json({ success: true, count: list.length, bookings: list });
});

app.get('/api/bookings/:id', (req, res) => {
  const booking = db.findById('bookings', req.params.id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, booking });
});

app.patch('/api/bookings/:id/status', (req, res) => {
  const { bookingStatus, paymentStatus, cancellationReason } = req.body;
  const updates = {};
  if (bookingStatus) updates.bookingStatus = bookingStatus;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (cancellationReason) updates.cancellationStatus = cancellationReason;

  const updated = db.update('bookings', req.params.id, updates);
  if (!updated) return res.status(404).json({ success: false, message: 'Booking not found' });
  res.json({ success: true, booking: updated });
});

// --------------------------------------------------------------------------
// 9. ITINERARY BUILDER & SAVED TRIPS
// --------------------------------------------------------------------------
app.get('/api/itineraries', (req, res) => {
  const list = db.get('itineraries');
  res.json({ success: true, count: list.length, itineraries: list });
});

app.get('/api/itineraries/:id', (req, res) => {
  const itin = db.findById('itineraries', req.params.id);
  if (!itin) return res.status(404).json({ success: false, message: 'Itinerary not found' });
  res.json({ success: true, itinerary: itin });
});

app.post('/api/itineraries', (req, res) => {
  const newItin = db.insert('itineraries', {
    ...req.body,
    userId: currentUserId,
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ success: true, itinerary: newItin, message: 'Itinerary saved successfully' });
});

// --------------------------------------------------------------------------
// 10. REAL PDF DOWNLOAD APIS (Itinerary, Tax Invoice, Travel Voucher)
// --------------------------------------------------------------------------
app.get('/api/pdf/itinerary/:id', (req, res) => {
  const itin = db.findById('itineraries', req.params.id) || db.get('itineraries')[0];
  if (!itin) return res.status(404).send('Itinerary not found');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Yatrimap-Itinerary-${itin.id}.pdf`);

  pdfService.generateItinerary(itin, chunk => res.write(chunk), () => res.end());
});

app.get('/api/pdf/invoice/:bookingId', (req, res) => {
  const booking = db.findById('bookings', req.params.bookingId);
  if (!booking) return res.status(404).send('Booking not found');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice-${booking.id}.pdf`);

  pdfService.generateInvoice(booking, chunk => res.write(chunk), () => res.end());
});

app.get('/api/pdf/voucher/:bookingId', (req, res) => {
  const booking = db.findById('bookings', req.params.bookingId);
  if (!booking) return res.status(404).send('Booking not found');

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Voucher-${booking.id}.pdf`);

  pdfService.generateVoucher(booking, chunk => res.write(chunk), () => res.end());
});

// --------------------------------------------------------------------------
// 11. CRM LEADS & QUOTATION BUILDER APIS
// --------------------------------------------------------------------------
app.post('/api/leads', (req, res) => {
  const { name, phone, email, destination, travelDates, travellers, budget, hotelCategory, transportPreference, activities, specialRequirements } = req.body;
  const newLead = db.insert('leads', {
    name: name || 'Prospective Traveler',
    phone: phone || '',
    email: email || '',
    source: req.body.source || 'Website Travel Enquiry',
    destination: destination || 'Uttarakhand',
    travelDates: travelDates || 'Upcoming',
    travellers: Number(travellers) || 2,
    adults: Number(req.body.adults) || 2,
    children: Number(req.body.children) || 0,
    budget: budget || '₹50,000',
    hotelCategory: hotelCategory || 'Deluxe',
    transportPreference: transportPreference || 'Dedicated Cab',
    activities: activities || 'Sightseeing & Adventure',
    specialRequirements: specialRequirements || '',
    assignedAgent: 'Priya Patel',
    status: 'New',
    followUpDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    notes: 'New enquiry received through website form.'
  });

  // Notify team
  db.insert('notifications', {
    userId: 'usr-2', // Priya Patel
    title: `New CRM Lead: ${newLead.name}`,
    message: `Inquiry for ${newLead.destination} (${newLead.travellers} pax, Budget: ${newLead.budget}).`,
    type: 'lead',
    read: false,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ success: true, lead: newLead, message: 'Enquiry submitted successfully! A travel expert will connect with you within 30 minutes.' });
});

app.get('/api/leads', (req, res) => {
  const { status, search } = req.query;
  let list = db.get('leads');
  if (status && status !== 'All') {
    list = list.filter(l => l.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(l => l.name.toLowerCase().includes(q) || l.destination.toLowerCase().includes(q) || l.phone.includes(q));
  }
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: list.length, leads: list });
});

app.put('/api/leads/:id', (req, res) => {
  const updated = db.update('leads', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Lead not found' });
  res.json({ success: true, lead: updated });
});

app.patch('/api/leads/:id/status', (req, res) => {
  const { status, notes, followUpDate } = req.body;
  const updates = {};
  if (status) updates.status = status;
  if (notes) updates.notes = notes;
  if (followUpDate) updates.followUpDate = followUpDate;
  const updated = db.update('leads', req.params.id, updates);
  res.json({ success: true, lead: updated });
});

// Quotations
app.get('/api/quotations', (req, res) => {
  const list = db.get('quotations');
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, count: list.length, quotations: list });
});

app.post('/api/quotations', (req, res) => {
  const { leadId, customerName, customerPhone, customerEmail, tripTitle, destination, dates, travellers, items, discount = 0, tax = 0 } = req.body;
  const lineItems = items || [];
  const subtotal = lineItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const totalAmount = Math.max(0, subtotal - Number(discount) + Number(tax));

  const quote = db.insert('quotations', {
    id: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
    leadId: leadId || null,
    customerName: customerName || 'Valued Guest',
    customerPhone: customerPhone || '',
    customerEmail: customerEmail || '',
    tripTitle: tripTitle || `${destination} Custom Package`,
    destination: destination || 'Uttarakhand',
    dates: dates || 'Flexible 2026',
    travellers: Number(travellers) || 2,
    items: lineItems,
    subtotal,
    discount: Number(discount),
    tax: Number(tax),
    totalAmount,
    status: req.body.status || 'Sent',
    assignedAgent: req.body.assignedAgent || 'Priya Patel',
    validUntil: req.body.validUntil || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  });

  // If connected to a lead, update lead status to 'Quotation Sent'
  if (leadId) {
    db.update('leads', leadId, { status: 'Quotation Sent', notes: `Quotation #${quote.id} created for ₹${quote.totalAmount.toLocaleString('en-IN')}` });
  }

  res.status(201).json({ success: true, quotation: quote, message: 'Quotation generated successfully' });
});

app.post('/api/quotations/:id/convert-to-booking', (req, res) => {
  const quote = db.findById('quotations', req.params.id);
  if (!quote) return res.status(404).json({ success: false, message: 'Quotation not found' });

  // Create booking directly from quotation!
  const booking = db.insert('bookings', {
    id: `YM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: currentUserId,
    customerName: quote.customerName,
    customerEmail: quote.customerEmail,
    customerPhone: quote.customerPhone,
    productId: quote.id,
    productType: 'package',
    productTitle: quote.tripTitle,
    bookingDate: new Date().toISOString().slice(0, 10),
    travelStartDate: (quote.dates || '').split('–')[0].trim() || new Date().toISOString().slice(0, 10),
    travelEndDate: (quote.dates || '').split('–')[1] ? quote.dates.split('–')[1].trim() : new Date().toISOString().slice(0, 10),
    travellers: quote.travellers || 2,
    basePrice: quote.subtotal,
    taxes: quote.tax,
    serviceFee: 0,
    discount: quote.discount,
    couponApplied: 'QUOTE-CONVERT',
    finalAmount: quote.totalAmount,
    paymentMethod: 'Bank Transfer / Gateway',
    paymentStatus: 'Paid',
    bookingStatus: 'Confirmed',
    cancellationStatus: 'None',
    assignedAgent: quote.assignedAgent || 'Priya Patel'
  });

  // Update quotation status
  db.update('quotations', quote.id, { status: 'Converted' });

  // Update lead status if present
  if (quote.leadId) {
    db.update('leads', quote.leadId, { status: 'Confirmed', notes: `Converted to confirmed booking #${booking.id}` });
  }

  res.json({ success: true, booking, message: `Quotation successfully converted into Booking #${booking.id}` });
});

// --------------------------------------------------------------------------
// 12. CUSTOMER PORTAL & SUPPORT TICKETS
// --------------------------------------------------------------------------
app.get('/api/customer/trips', (req, res) => {
  const userBookings = db.find('bookings', b => b.customerId === currentUserId || b.customerEmail === 'sameer@example.com');
  const now = new Date().toISOString().slice(0, 10);

  const upcoming = userBookings.filter(b => b.bookingStatus === 'Confirmed' && b.travelStartDate >= now);
  const completed = userBookings.filter(b => b.bookingStatus === 'Completed' || (b.bookingStatus === 'Confirmed' && b.travelStartDate < now));
  const cancelled = userBookings.filter(b => b.bookingStatus === 'Cancelled');

  res.json({
    success: true,
    upcoming,
    completed,
    cancelled,
    all: userBookings
  });
});

app.get('/api/customer/notifications', (req, res) => {
  const notifs = db.find('notifications', n => n.userId === currentUserId || n.userId === 'usr-6');
  notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ success: true, notifications: notifs });
});

app.post('/api/customer/notifications/:id/read', (req, res) => {
  const updated = db.update('notifications', req.params.id, { read: true });
  res.json({ success: true, notification: updated });
});

app.get('/api/customer/tickets', (req, res) => {
  const tickets = db.find('tickets', t => t.customerId === currentUserId || t.customerId === 'usr-6');
  res.json({ success: true, tickets });
});

app.post('/api/customer/tickets', (req, res) => {
  const user = db.findById('users', currentUserId) || {};
  const newTicket = db.insert('tickets', {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: currentUserId,
    customerName: user.name || 'Sameer Sharma',
    bookingId: req.body.bookingId || '',
    category: req.body.category || 'General Enquiry',
    priority: req.body.priority || 'Medium',
    subject: req.body.subject,
    message: req.body.message,
    status: 'Open',
    assignedAgent: 'Support Team'
  });
  res.status(201).json({ success: true, ticket: newTicket, message: 'Ticket raised successfully' });
});

// --------------------------------------------------------------------------
// 13. ADMIN CMS, REVIEWS & ANALYTICS
// --------------------------------------------------------------------------
app.get('/api/admin/stats', (req, res) => {
  const bookings = db.get('bookings');
  const leads = db.get('leads');
  const customers = db.get('users').filter(u => u.role === 'Customer');
  const hotels = db.get('hotels');
  const packages = db.get('packages');

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const pendingPayments = bookings
    .filter(b => b.paymentStatus === 'Payment Pending')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const upcomingTripsCount = bookings.filter(b => b.bookingStatus === 'Confirmed').length;

  res.json({
    success: true,
    totalBookings: bookings.length,
    totalRevenue,
    pendingPayments,
    totalCustomers: customers.length,
    newLeadsCount,
    upcomingTripsCount,
    inventory: {
      hotels: hotels.length,
      packages: packages.length,
      vehicles: db.get('vehicles').length,
      activities: db.get('activities').length
    }
  });
});

app.get('/api/admin/export-bookings-csv', (req, res) => {
  const bookings = db.get('bookings');
  let csv = 'Booking ID,Customer,Email,Product,Travel Start,Travel End,Final Amount,Payment Status,Booking Status\n';
  bookings.forEach(b => {
    csv += `"${b.id}","${b.customerName}","${b.customerEmail}","${b.productTitle}","${b.travelStartDate}","${b.travelEndDate}",${b.finalAmount},"${b.paymentStatus}","${b.bookingStatus}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=yatrimap-bookings-report.csv');
  res.send(csv);
});

// Media Library
app.get('/api/admin/media', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.json({ success: true, files: [] });
    const list = files.map(f => ({
      name: f,
      url: `/uploads/${f}`,
      size: fs.statSync(path.join(uploadDir, f)).size
    }));
    res.json({ success: true, files: list });
  });
});

app.post('/api/admin/media/upload', upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
  res.json({
    success: true,
    file: {
      name: req.file.filename,
      url: `/uploads/${req.file.filename}`
    }
  });
});

// Reviews moderation
app.get('/api/reviews', (req, res) => {
  res.json({ success: true, reviews: db.get('reviews') });
});

app.post('/api/reviews', (req, res) => {
  const user = db.findById('users', currentUserId) || {};
  const newRev = db.insert('reviews', {
    ...req.body,
    author: user.name || req.body.author || 'Traveler',
    date: new Date().toISOString().slice(0, 10),
    status: 'approved'
  });
  res.status(201).json({ success: true, review: newRev });
});

app.patch('/api/reviews/:id/moderate', (req, res) => {
  const { status } = req.body;
  const updated = db.update('reviews', req.params.id, { status });
  res.json({ success: true, review: updated });
});

// Blogs API
app.get('/api/blogs', (req, res) => {
  res.json({ success: true, blogs: db.get('blogs') });
});

app.get('/api/blogs/:slug', (req, res) => {
  const blog = db.findOne('blogs', b => b.slug === req.params.slug || b.id === req.params.slug);
  if (!blog) return res.status(404).json({ success: false, message: 'Blog post not found' });
  const related = db.get('blogs').filter(b => b.id !== blog.id).slice(0, 3);
  res.json({ success: true, blog, related });
});

app.post('/api/blogs', (req, res) => {
  const newBlog = db.insert('blogs', {
    ...req.body,
    slug: (req.body.title || '').toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 60),
    publishedAt: new Date().toISOString().slice(0, 10)
  });
  res.status(201).json({ success: true, blog: newBlog });
});

app.put('/api/blogs/:id', (req, res) => {
  const updated = db.update('blogs', req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, blog: updated });
});

app.delete('/api/blogs/:id', (req, res) => {
  const ok = db.delete('blogs', req.params.id);
  res.json({ success: ok });
});

// Universal Catch-All for HTML navigation (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  YATRIMAP TRAVEL PLATFORM BACKEND RUNNING`);
  console.log(`  Local URL: http://localhost:${PORT}`);
  console.log(`  Admin CMS: http://localhost:${PORT}/admin.html`);
  console.log(`  Customer Portal: http://localhost:${PORT}/my-trips.html`);
  console.log(`  Itinerary Builder: http://localhost:${PORT}/itinerary-builder.html`);
  console.log(`  Checkout Engine: http://localhost:${PORT}/checkout.html`);
  console.log(`====================================================`);
});
