import PDFDocument from 'pdfkit';

class PdfService {
  // 1. Generate Professional Itinerary PDF
  generateItinerary(itinerary, dataCallback, endCallback) {
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    // Primary Colors
    const primaryColor = '#164b68';
    const accentColor = '#279ed3';
    const darkMuted = '#425b6a';
    const lightBg = '#f4fbff';

    // COVER PAGE
    doc.rect(0, 0, 595.28, 841.89).fill(primaryColor);

    // Cover brand mark
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#ffffff').text('trippie', 50, 60, { characterSpacing: 1 });
    doc.fontSize(12).font('Helvetica').fillColor('#bbd84d').text('EXPLORE THE HIMALAYAS & BEYOND', 50, 98);

    // Decorative divider
    doc.moveTo(50, 120).lineTo(545, 120).strokeColor('#279ed3').lineWidth(2).stroke();

    // Trip Title
    doc.fontSize(32).font('Helvetica-Bold').fillColor('#ffffff').text(itinerary.title || 'Custom Himalayan Itinerary', 50, 240, { width: 495, lineGap: 6 });
    
    doc.fontSize(16).font('Helvetica').fillColor('#bbd84d').text(itinerary.destination || 'Uttarakhand, India', 50, 340);

    // Metadata card
    doc.roundedRect(50, 420, 495, 180, 10).fill('#0e354b');

    doc.fontSize(12).font('Helvetica-Bold').fillColor('#bbd84d').text('TRIP OVERVIEW', 70, 440);
    
    doc.fontSize(11).font('Helvetica').fillColor('#ffffff');
    doc.text(`Travel Dates: ${itinerary.dates || 'Flexible 2026'}`, 70, 470);
    doc.text(`Duration: ${itinerary.days ? itinerary.days.length : 4} Days / ${(itinerary.days ? itinerary.days.length : 4) - 1} Nights`, 70, 495);
    doc.text(`Total Travellers: ${itinerary.travellers || 2} Persons`, 70, 520);
    doc.text(`Estimated Budget: ₹${(itinerary.estimatedCost || 18500).toLocaleString('en-IN')}`, 70, 545);
    doc.text(`Prepared By: Trippie Custom Trip Planning Team`, 70, 570);

    // Footer on cover
    doc.fontSize(10).font('Helvetica').fillColor('#9bdcf5').text('www.trippie.com  •  support@trippie.com  •  +91 1800 200 4455', 50, 770, { align: 'center', width: 495 });

    // PAGE 2: DAY-BY-DAY ITINERARY
    doc.addPage();
    doc.rect(0, 0, 595.28, 841.89).fill('#ffffff');

    // Header bar
    doc.rect(40, 30, 515, 45).fill(lightBg);
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('TRIPPIE', 55, 44);
    doc.fontSize(10).font('Helvetica').fillColor(accentColor).text('DAY-BY-DAY ITINERARY', 400, 48, { align: 'right' });

    let y = 100;
    doc.fontSize(20).font('Helvetica-Bold').fillColor(primaryColor).text('Trip Schedule & Experience Details', 40, y);
    y += 35;

    const days = itinerary.days || [
      { day: 1, title: 'Arrival & Evening Aarti', hotel: 'Riverside Stay', activities: ['Check-in', 'Ganga Aarti'], transport: 'Cab', notes: 'Rest upon arrival' }
    ];

    days.forEach((day, index) => {
      if (y > 680) {
        doc.addPage();
        y = 50;
      }

      // Day Badge
      doc.roundedRect(40, y, 65, 24, 4).fill(accentColor);
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#ffffff').text(`DAY 0${day.day || (index + 1)}`, 48, y + 6);

      // Day Title
      doc.fontSize(13).font('Helvetica-Bold').fillColor(primaryColor).text(day.title || `Day ${index + 1} Activities`, 115, y + 5);
      y += 32;

      // Details Box
      doc.roundedRect(40, y, 515, 68, 6).fill(lightBg);

      doc.fontSize(10).font('Helvetica-Bold').fillColor(darkMuted).text('Accommodation: ', 50, y + 10, { continued: true });
      doc.font('Helvetica').fillColor('#222').text(day.hotel || 'Selected Hotel/Camp');

      doc.fontSize(10).font('Helvetica-Bold').fillColor(darkMuted).text('Transport: ', 50, y + 26, { continued: true });
      doc.font('Helvetica').fillColor('#222').text(day.transport || 'Local sightseeing vehicle');

      doc.fontSize(10).font('Helvetica-Bold').fillColor(darkMuted).text('Key Activities: ', 50, y + 42, { continued: true });
      doc.font('Helvetica').fillColor('#222').text(Array.isArray(day.activities) ? day.activities.join(' • ') : (day.activities || 'Sightseeing & leisure'));

      if (day.notes) {
        doc.fontSize(9).font('Helvetica-Oblique').fillColor('#666').text(`Note: ${day.notes}`, 50, y + 56);
      }

      y += 82;
    });

    // PAGE 3: INCLUSIONS, POLICIES & SUPPORT
    doc.addPage();
    doc.rect(40, 30, 515, 45).fill(lightBg);
    doc.fontSize(16).font('Helvetica-Bold').fillColor(primaryColor).text('TRIPPIE', 55, 44);
    doc.fontSize(10).font('Helvetica').fillColor(accentColor).text('TERMS, INCLUSIONS & SUPPORT', 380, 48, { align: 'right' });

    y = 100;

    // Inclusions
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Inclusions & Features', 40, y);
    y += 22;
    const inclusions = [
      'Verified accommodations with standard mountain hygiene & backup power',
      'Daily freshly prepared breakfast & regional meals as indicated',
      'Experienced licensed Himalayan hill drivers for all transit journeys',
      '24/7 Trippie Emergency on-trip concierge assistance & local ground support',
      'All toll taxes, state permits, parking fees and driver allowances'
    ];
    inclusions.forEach(item => {
      doc.fontSize(10).font('Helvetica').fillColor('#222').text(`✓  ${item}`, 45, y);
      y += 18;
    });

    y += 20;
    // Exclusions
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('Exclusions', 40, y);
    y += 22;
    const exclusions = [
      'Personal adventure video/photo charges and camera permits',
      'Room heater charges (payable directly if applicable at basic hill hotels)',
      'Any emergency deviations or helicopter rescue beyond agreed policy'
    ];
    exclusions.forEach(item => {
      doc.fontSize(10).font('Helvetica').fillColor('#555').text(`✗  ${item}`, 45, y);
      y += 18;
    });

    y += 25;
    // Support and Emergency
    doc.roundedRect(40, y, 515, 90, 8).fill('#eaf7fc');
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text('TRIPPIE TRIP SUPPORT & HELPLINE', 55, y + 15);
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text('Call or WhatsApp 24x7: +91 98765 43210 / +91 1800 200 4455', 55, y + 36);
    doc.text('Email: concierge@trippie.com  |  Office: Tapovan Badrinath Road, Rishikesh 249192', 55, y + 54);
    doc.text('GSTIN: 05AAACY9988F1Z4  •  Licensed Uttarakhand Tourism Tour Operator', 55, y + 70);

    doc.end();
  }

  // 2. Generate Professional Tax Invoice PDF
  generateInvoice(booking, dataCallback, endCallback) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    const primary = '#164b68';
    const accent = '#279ed3';

    // Header
    doc.rect(40, 40, 515, 80).fill('#f4fbff');
    doc.fontSize(24).font('Helvetica-Bold').fillColor(primary).text('TRIPPIE', 60, 55);
    doc.fontSize(10).font('Helvetica').fillColor(accent).text('TRAVEL OPERATING SYSTEM', 60, 85);
    doc.fontSize(18).font('Helvetica-Bold').fillColor(primary).text('TAX INVOICE', 400, 55, { align: 'right' });
    doc.fontSize(10).font('Helvetica').fillColor('#555').text(`Invoice #: INV-${booking.id}`, 400, 85, { align: 'right' });

    // Details Grid
    let y = 145;
    doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Billed To (Customer):', 40, y);
    doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Invoice & Booking Meta:', 320, y);

    y += 18;
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text(booking.customerName || 'Customer', 40, y);
    doc.text(`Booking Reference: ${booking.id}`, 320, y);

    y += 15;
    doc.text(`Email: ${booking.customerEmail || 'N/A'}`, 40, y);
    doc.text(`Date of Issue: ${booking.bookingDate || new Date().toISOString().slice(0, 10)}`, 320, y);

    y += 15;
    doc.text(`Phone: ${booking.customerPhone || 'N/A'}`, 40, y);
    doc.text(`Payment Status: ${booking.paymentStatus || 'Paid'}`, 320, y);

    y += 15;
    doc.text(`Travel Dates: ${booking.travelStartDate || 'N/A'} to ${booking.travelEndDate || 'N/A'}`, 320, y);

    // Table Header
    y = 230;
    doc.rect(40, y, 515, 26).fill(primary);
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('Description', 50, y + 8);
    doc.text('Qty / Pax', 330, y + 8);
    doc.text('Rate', 410, y + 8);
    doc.text('Amount (₹)', 480, y + 8, { width: 65, align: 'right' });

    // Table Content
    y += 26;
    doc.rect(40, y, 515, 45).fill('#ffffff');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#222').text(booking.productTitle || 'Travel Booking', 50, y + 10);
    doc.fontSize(9).font('Helvetica').fillColor('#666').text(`Category: ${booking.productType ? booking.productType.toUpperCase() : 'TRAVEL'}`, 50, y + 25);

    doc.fontSize(10).font('Helvetica').fillColor('#222');
    doc.text(`${booking.travellers || 1}`, 330, y + 15);
    doc.text(`₹${(booking.basePrice || 0).toLocaleString('en-IN')}`, 410, y + 15);
    doc.text(`₹${(booking.basePrice || 0).toLocaleString('en-IN')}`, 480, y + 15, { width: 65, align: 'right' });

    // Summary lines
    y += 55;
    doc.moveTo(40, y).lineTo(555, y).strokeColor('#ccc').lineWidth(1).stroke();

    y += 10;
    doc.fontSize(10).font('Helvetica').fillColor('#444');
    doc.text('Subtotal:', 380, y);
    doc.text(`₹${(booking.basePrice || 0).toLocaleString('en-IN')}`, 480, y, { width: 65, align: 'right' });

    y += 18;
    doc.text('Taxes & GST (18% / 5%):', 380, y);
    doc.text(`₹${(booking.taxes || 0).toLocaleString('en-IN')}`, 480, y, { width: 65, align: 'right' });

    if (booking.discount) {
      y += 18;
      doc.text(`Discount (${booking.couponApplied || 'PROMO'}):`, 380, y);
      doc.text(`- ₹${(booking.discount || 0).toLocaleString('en-IN')}`, 480, y, { width: 65, align: 'right' });
    }

    y += 24;
    doc.rect(370, y - 5, 185, 32).fill(accent);
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('Total Paid:', 380, y + 4);
    doc.text(`₹${(booking.finalAmount || 0).toLocaleString('en-IN')}`, 470, y + 4, { width: 75, align: 'right' });

    // Footer & Bank Details
    y = 500;
    doc.roundedRect(40, y, 515, 100, 6).fill('#f8fcfe');
    doc.fontSize(10).font('Helvetica-Bold').fillColor(primary).text('Company Details & Terms', 50, y + 12);
    doc.fontSize(9).font('Helvetica').fillColor('#444');
    doc.text('Trippie Private Limited  •  GSTIN: 05AAACY9988F1Z4  •  PAN: AAACY9988F', 50, y + 30);
    doc.text('Bank: HDFC Bank Ltd  •  A/C: 50200088991122  •  IFSC: HDFC0001234', 50, y + 46);
    doc.text('Computer-generated tax invoice. No signature required.', 50, y + 62);
    doc.text('Thank you for choosing Trippie for your journeys!', 50, y + 78);

    doc.end();
  }

  // 3. Generate Travel / Hotel / Taxi Voucher PDF
  generateVoucher(booking, dataCallback, endCallback) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    const primary = '#164b68';
    const accent = '#279ed3';

    // Header badge
    doc.rect(40, 40, 515, 90).fill('#0e354b');
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#ffffff').text('TRIPPIE', 60, 55);
    doc.fontSize(11).font('Helvetica').fillColor('#bbd84d').text('OFFICIAL BOOKING & SERVICE VOUCHER', 60, 85);
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#ffffff').text('CONFIRMED', 420, 65, { align: 'right' });
    doc.fontSize(10).font('Helvetica').fillColor('#bbd84d').text(`Ref: ${booking.id}`, 420, 85, { align: 'right' });

    let y = 150;
    doc.fontSize(14).font('Helvetica-Bold').fillColor(primary).text('Service & Accommodation Voucher', 40, y);
    y += 24;

    doc.roundedRect(40, y, 515, 120, 8).fill('#f4fbff');
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primary).text(booking.productTitle || 'Himalayan Experience', 55, y + 16);
    
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text(`Primary Traveller: ${booking.customerName} (${booking.travellers || 1} Guests)`, 55, y + 40);
    doc.text(`Travel Date(s): ${booking.travelStartDate} to ${booking.travelEndDate || booking.travelStartDate}`, 55, y + 58);
    doc.text(`Assigned Agency Agent: ${booking.assignedAgent || 'Trippie Central Operations'}`, 55, y + 76);
    doc.text(`Status: Service Guaranteed & Confirmed with Supplier`, 55, y + 94);

    y += 140;
    doc.fontSize(12).font('Helvetica-Bold').fillColor(primary).text('Instructions for Guest', 40, y);
    y += 20;

    const instructions = [
      'Please present this digital or printed voucher along with a Government Photo ID (Aadhaar / Passport / Driving License) upon arrival.',
      'Check-in time for hotels is standard 12:00 PM; Check-out is 11:00 AM.',
      'For vehicle/taxi pickups: The driver will contact you 2 hours prior to scheduled departure.',
      'For adventure activities (rafting/bungee): Wear athletic footwear and comfortable clothing. Strictly follow the safety master briefing.'
    ];

    instructions.forEach(ins => {
      doc.fontSize(10).font('Helvetica').fillColor('#333').text(`•  ${ins}`, 45, y, { width: 505 });
      y += 24;
    });

    y += 20;
    // 24x7 Support Box
    doc.roundedRect(40, y, 515, 80, 6).fill('#eaf7fc');
    doc.fontSize(11).font('Helvetica-Bold').fillColor(primary).text('Emergency Supplier & Ground Coordinator Contact', 55, y + 15);
    doc.fontSize(10).font('Helvetica').fillColor('#333');
    doc.text('Hotline: +91 98765 43210 / WhatsApp: +91 98330 44556', 55, y + 36);
    doc.text('Email: vouchers@trippie.com  •  Website: www.trippie.com', 55, y + 54);

    doc.end();
  }
}

const defaultPdfService = new PdfService();

export function generateTaxInvoice(booking) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    defaultPdfService.generateInvoice(
      booking,
      (chunk) => chunks.push(chunk),
      () => resolve(Buffer.concat(chunks))
    );
  });
}

export function generateVoucher(booking) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    defaultPdfService.generateVoucher(
      booking,
      (chunk) => chunks.push(chunk),
      () => resolve(Buffer.concat(chunks))
    );
  });
}

export function generateItineraryPdf(itinerary) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    defaultPdfService.generateItinerary(
      itinerary,
      (chunk) => chunks.push(chunk),
      () => resolve(Buffer.concat(chunks))
    );
  });
}

export default defaultPdfService;
export { PdfService };
