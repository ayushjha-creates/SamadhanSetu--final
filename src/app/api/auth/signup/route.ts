import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name, username, phone, birthdate } = body;

    if (!email || !password || !full_name || !username) {
      return NextResponse.json(
        { success: false, error: 'Email, password, full name, and username are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await db.createUser({
      email,
      password,
      full_name,
      username,
      phone: phone || '',
      birthdate: birthdate || '',
    });

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user,
      message: 'Registration successful',
    });

    response.cookies.set(setAuthCookie(token));

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
