import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password required' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // 1. Check against Environment Variables (configured in Vercel)
    const envUser = process.env.ADMIN_USERNAME || 'admin';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    let isAuthenticated = false;
    let adminProfile = {
      id: 'admin-master',
      username: envUser,
      name: 'Prof. Akshay Bora',
      email: 'akshaybora82@gmail.com',
    };

    if (cleanUsername === envUser && cleanPassword === envPass) {
      isAuthenticated = true;
    }

    // 2. Also check in Database
    try {
      const dbAdmin = await prisma.admin.findFirst({
        where: {
          username: cleanUsername,
          password: cleanPassword,
        },
      });

      if (dbAdmin) {
        isAuthenticated = true;
        adminProfile = {
          id: dbAdmin.id,
          username: dbAdmin.username,
          name: dbAdmin.name,
          email: dbAdmin.email,
        };
      } else if (isAuthenticated) {
        // Auto-seed admin into DB if authenticated via env
        await prisma.admin.upsert({
          where: { username: cleanUsername },
          update: { password: cleanPassword },
          create: {
            username: cleanUsername,
            password: cleanPassword,
            name: 'Prof. Akshay Bora',
            email: 'akshaybora82@gmail.com',
          },
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn('Database query during admin login, falling back to env authentication:', dbErr);
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      data: adminProfile,
    });

    // Set secure cookie for session validation
    response.cookies.set('ab_admin_session', 'authenticated', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please check your credentials.' },
      { status: 500 }
    );
  }
}
