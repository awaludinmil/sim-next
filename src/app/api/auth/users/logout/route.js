import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function POST(request) {
  try {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const csrfToken = request.headers.get('x-csrf-token');

    const response = await fetch(`${BASE_URL}/api/auth/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      credentials: 'include',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}
