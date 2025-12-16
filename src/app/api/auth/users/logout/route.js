import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function POST(request) {
  try {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const csrfToken = request.headers.get('x-csrf-token');
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(`${BASE_URL}/api/auth/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
    });

    const data = await response.json();
    
    const res = NextResponse.json(data, { status: response.status });
    
    // Forward any Set-Cookie headers (to clear cookies on client)
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach((cookie) => {
      res.headers.append('Set-Cookie', cookie);
    });

    if (setCookieHeaders.length === 0) {
      const setCookie = response.headers.get('set-cookie');
      if (setCookie) {
        res.headers.set('Set-Cookie', setCookie);
      }
    }
    
    return res;
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}

