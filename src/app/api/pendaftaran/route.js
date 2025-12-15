import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function POST(request) {
  try {
    const body = await request.json();
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const csrfToken = request.headers.get('x-csrf-token');
    const cookie = request.headers.get('cookie');

    const response = await fetch(`${BASE_URL}/api/pendaftaran`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        ...(cookie && { Cookie: cookie }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Forward CSRF token if returned
    const newCsrfToken = response.headers.get('x-csrf-token');
    if (newCsrfToken && data.success) {
      data.csrf_token = newCsrfToken;
    }

    const res = NextResponse.json(data, { status: response.status });

    // Forward Set-Cookie headers
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
    console.error('Pendaftaran API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';

    const response = await fetch(
      `${BASE_URL}/api/pendaftaran/me?page=${page}&limit=${limit}&sort_by=created_at&sort_order=desc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Pendaftaran GET API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}
