import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function POST(request) {
  try {
    const cookies = request.headers.get('cookie') || '';
    
    // Try to get refresh_token from body if provided
    let bodyRefreshToken = null;
    try {
      const body = await request.json();
      bodyRefreshToken = body.refresh_token;
    } catch {
      // Body might be empty, that's ok
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Cookie': cookies,
    };
    
    // If refresh token is provided in body, add it to Authorization header as fallback
    if (bodyRefreshToken) {
      headers['X-Refresh-Token'] = bodyRefreshToken;
    }
    
    const response = await fetch(`${BASE_URL}/api/auth/users/refresh`, {
      method: 'POST',
      headers,
      credentials: 'include',
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

