import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function POST(request) {
  try {
    const cookies = request.headers.get('cookie') || '';
    
    const response = await fetch(`${BASE_URL}/api/auth/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
      },
    });

    const data = await response.json();
    
    // Extract CSRF token from backend response
    const csrfToken = response.headers.get('x-csrf-token');
    if (csrfToken && data.success) {
      data.csrf_token = csrfToken;
    }
    
    const res = NextResponse.json(data, { status: response.status });

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
    console.error('Refresh Token API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}
