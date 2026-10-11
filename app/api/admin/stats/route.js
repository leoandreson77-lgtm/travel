import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET() {
  const bookings = db.get('bookings');
  const leads = db.get('leads');
  const customers = db.get('users').filter(u => u.role === 'Customer');
  const hotels = db.get('hotels');
  const packages = db.get('packages');
  const vehicles = db.get('vehicles');
  const activities = db.get('activities');

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const pendingPayments = bookings
    .filter(b => b.paymentStatus === 'Payment Pending')
    .reduce((sum, b) => sum + (b.finalAmount || 0), 0);

  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const upcomingTripsCount = bookings.filter(b => b.bookingStatus === 'Confirmed').length;

  return NextResponse.json({
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
      vehicles: vehicles.length,
      activities: activities.length
    }
  });
}
