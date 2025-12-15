import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function GET(request) {
  try {
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');

    const response = await fetch(`${BASE_URL}/api/auth/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    const data = await response.json();
    
    // Extract CSRF token from response headers if available
    const csrfToken = response.headers.get('x-csrf-token');
    
    // Add CSRF token to response data if present
    if (csrfToken && data.success) {
      data.csrf_token = csrfToken;
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('User Profile API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}
