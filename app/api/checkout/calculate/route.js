import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function POST(request) {
  try {
    const {
      productType,
      productId,
      roomType,
      roomsCount = 1,
      durationDays = 1,
      travellersCount = 1,
      couponCode = ''
    } = await request.json();

    let baseUnitRate = 0;
    let productTitle = 'Travel Booking';
    let gstRate = 0.12; // 12% standard GST on travel services

    if (productType === 'hotel') {
      const hotel = db.findById('hotels', productId);
      if (hotel) {
        productTitle = hotel.name;
        if (roomType && hotel.roomTypes) {
          const selectedRoom = hotel.roomTypes.find(r => r.name === roomType);
          baseUnitRate = selectedRoom ? selectedRoom.price : hotel.pricePerNight;
        } else {
          baseUnitRate = hotel.pricePerNight;
        }
        gstRate = baseUnitRate > 7500 ? 0.18 : 0.12;
      }
    } else if (productType === 'package') {
      const pkg = db.findById('packages', productId);
      if (pkg) {
        productTitle = pkg.title;
        baseUnitRate = pkg.price;
        gstRate = 0.05; // 5% GST for pilgrimage/tour packages
      }
    } else if (productType === 'vehicle' || productType === 'taxi') {
      const v = db.findById('vehicles', productId);
      if (v) {
        productTitle = v.name;
        baseUnitRate = v.pricePerDay;
        gstRate = 0.18; // 18% GST for commercial vehicle rentals
      }
    } else if (productType === 'activity') {
      const act = db.findById('activities', productId);
      if (act) {
        productTitle = act.name;
        baseUnitRate = act.price;
        gstRate = 0.18;
      }
    }

    if (baseUnitRate === 0) {
      baseUnitRate = 2999;
    }

    let multiplier = 1;
    if (productType === 'hotel') {
      multiplier = (Number(roomsCount) || 1) * (Number(durationDays) || 1);
    } else if (productType === 'vehicle' || productType === 'taxi') {
      multiplier = Number(durationDays) || 1;
    } else if (productType === 'package' || productType === 'activity') {
      multiplier = Number(travellersCount) || 1;
    }

    const basePrice = baseUnitRate * multiplier;
    const taxes = Math.round(basePrice * gstRate);
    const serviceFee = 0;

    // Coupon evaluation
    let discount = 0;
    let couponApplied = '';
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase();
      let coupon = db.findOne('coupons', c => c.code.toUpperCase() === cleanCode && c.status === 'active');
      if (!coupon && (cleanCode === 'TRIPPIE500' || cleanCode === 'YATRI500')) {
        coupon = db.findOne('coupons', c => c.code.toUpperCase() === 'WELCOME500' && c.status === 'active') || {
          code: cleanCode,
          type: 'flat',
          discountValue: 500,
          minBookingAmount: 1500,
          applicableTo: 'all'
        };
      }
      if (coupon && basePrice >= (coupon.minBookingAmount || 0)) {
        if (coupon.applicableTo === 'all' || !productType || coupon.applicableTo === productType.toLowerCase()) {
          if (coupon.type === 'percentage') {
            discount = Math.round((basePrice * coupon.discountValue) / 100);
            if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
          } else {
            discount = coupon.discountValue;
          }
          couponApplied = cleanCode;
        }
      }
    }

    const finalAmount = Math.max(0, basePrice + taxes + serviceFee - discount);

    return NextResponse.json({
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
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
