import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import db from '../../../../lib/db';

// Allowed admin roles
const ADMIN_ROLES = ['Super Admin', 'Travel Agent', 'Sales Manager', 'Content Manager', 'Finance Manager'];

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Built-in Super Admin fallback credentials
    let authenticatedUser = null;

    if (cleanEmail === 'admin@trippie.com' && (cleanPassword === 'admin123' || cleanPassword === 'admin')) {
      authenticatedUser = {
        id: 'usr-admin',
        name: 'Aarav Malhotra',
        email: 'admin@trippie.com',
        role: 'Super Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      };
    } else {
      // Check database users
      const users = db.get('users') || [];
      const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

      if (user && ADMIN_ROLES.includes(user.role)) {
        // Accepts admin123 or agent123 or password
        if (cleanPassword === 'admin123' || cleanPassword === 'agent123' || cleanPassword === 'admin' || cleanPassword === 'password') {
          authenticatedUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
          };
        }
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials. Use admin@trippie.com / admin123' },
        { status: 401 }
      );
    }

    const sessionPayload = {
      ...authenticatedUser,
      loggedAt: new Date().toISOString()
    };

    const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

    const res = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: authenticatedUser
    });

    res.cookies.set('trippie_admin_token', token, {
      httpOnly: false, // accessible for client-side persistence as well
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
  } catch (err) {
    console.error('[Admin Auth POST Error]', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('trippie_admin_token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decoded && decoded.email && ADMIN_ROLES.includes(decoded.role)) {
        return NextResponse.json({
          authenticated: true,
          user: decoded
        });
      }
    } catch (e) {
      // Invalid token
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    console.error('[Admin Auth GET Error]', err);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });

  res.cookies.delete('trippie_admin_token');
  return res;
}
