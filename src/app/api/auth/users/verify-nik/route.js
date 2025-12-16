import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8026';

export async function PUT(request) {
  try {
    const body = await request.json();
    const accessToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const csrfToken = request.headers.get('x-csrf-token');
    const cookies = request.headers.get('cookie') || '';

    const response = await fetch(`${BASE_URL}/api/auth/users/verify-nik`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    // Extract CSRF token from response headers if available
    const newCsrfToken = response.headers.get('x-csrf-token');
    
    // Add CSRF token to response data if present
    if (newCsrfToken && data.success) {
      data.csrf_token = newCsrfToken;
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Verify NIK API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 500 }
    );
  }
}
