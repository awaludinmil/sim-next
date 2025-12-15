export async function POST(request) {
  try {
    const body = await request.json();

    const backendBase = process.env.API_BASE_URL || 'http://localhost:8026';
    const targetUrl = `${backendBase}/api/auth/users/login`;

    const resp = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const contentType = resp.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await resp.json();
    } else {
      const text = await resp.text();
      data = { success: resp.ok, status_code: resp.status, message: text };
    }

    const responseHeaders = {
      'Content-Type': 'application/json',
    };

    const setCookieHeaders = resp.headers.getSetCookie?.() || [];
    
    const csrfToken = resp.headers.get('x-csrf-token');
    if (csrfToken && data.success) {
      data.csrf_token = csrfToken;
    }
    
    const response = new Response(JSON.stringify(data), {
      status: resp.status,
      headers: responseHeaders,
    });

    setCookieHeaders.forEach((cookie) => {
      response.headers.append('Set-Cookie', cookie);
    });

    if (setCookieHeaders.length === 0) {
      const setCookie = resp.headers.get('set-cookie');
      if (setCookie) {
        response.headers.set('Set-Cookie', setCookie);
      }
    }

    return response;
  } catch (error) {
    console.error('Proxy error /api/auth/users/login:', error);
    const msg =
      error?.cause?.code === 'ECONNREFUSED' || /fetch failed/i.test(error?.message || '')
        ? 'Backend tidak dapat dihubungi. Pastikan server backend berjalan di API_BASE_URL.'
        : error?.message || 'Terjadi kesalahan pada server.';

    return new Response(
      JSON.stringify({ success: false, status_code: 500, message: msg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}