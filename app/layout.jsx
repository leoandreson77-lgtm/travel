import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Trippie — Live Life Differently | Travel Marketplace & Agency',
  description: 'Book extraordinary stays, self-drive 4x4 cars, mountain bikes, taxi transfers, Char Dham yatra packages, and custom Himalayan itineraries.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/platform.css" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/overrides.css" />
      </head>
      <body style={{ margin: 0, background: '#f4fbff', fontFamily: "'DM Sans', sans-serif", color: '#164b68' }}>
        <div id="toast-container" style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '10px' }}></div>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <script src="/platform.js" async></script>
      </body>
    </html>
  );
}
