import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    const admin = await prisma.admin.findFirst({
      where: {
        username: username.trim(),
        password: password.trim(),
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
      },
    });

    // Set simple cookie for session validation
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
      { success: false, error: 'Failed to authenticate admin' },
      { status: 500 }
    );
  }
}
