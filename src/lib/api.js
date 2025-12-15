const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
  CSRF: 'csrfToken',
};

const getStoredTokens = () => ({
  accessToken: localStorage.getItem(TOKEN_KEYS.ACCESS),
  refreshToken: localStorage.getItem(TOKEN_KEYS.REFRESH),
  csrfToken: localStorage.getItem(TOKEN_KEYS.CSRF),
});

const setStoredTokens = (tokens) => {
  if (tokens.access_token) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.access_token);
  }
  if (tokens.refresh_token) {
    localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refresh_token);
  }
  if (tokens.csrf_token) {
    localStorage.setItem(TOKEN_KEYS.CSRF, tokens.csrf_token);
  }
};

const clearStoredTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem(TOKEN_KEYS.CSRF);
  localStorage.removeItem('userId');
  localStorage.removeItem('phoneNumber');
};

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const refreshAccessToken = async () => {
  try {
    const response = await fetch('/api/auth/users/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Refresh token failed');
    }

    const result = await response.json();
    
    if (result.success && result.data?.tokens) {
      setStoredTokens(result.data.tokens);
      return result.data.tokens.access_token;
    }
    
    // Handle CSRF token from root level
    if (result.success && result.csrf_token) {
      localStorage.setItem(TOKEN_KEYS.CSRF, result.csrf_token);
    }
    
    throw new Error('Invalid refresh response');
  } catch (error) {
    clearStoredTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/phone-verification';
    }
    throw error;
  }
};

const apiClient = async (url, options = {}) => {
  const { accessToken, csrfToken } = getStoredTokens();
  const method = (options.method || 'GET').toUpperCase();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      
      try {
        const newAccessToken = await refreshAccessToken();
        isRefreshing = false;
        onRefreshed(newAccessToken);
      } catch (error) {
        isRefreshing = false;
        throw error;
      }
    }

    return new Promise((resolve, reject) => {
      addRefreshSubscriber(async (newAccessToken) => {
        try {
          const { csrfToken: newCsrfToken } = getStoredTokens();
          
          const retryHeaders = {
            ...headers,
            'Authorization': `Bearer ${newAccessToken}`,
          };
          
          if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && newCsrfToken) {
            retryHeaders['X-CSRF-Token'] = newCsrfToken;
          }
          
          const retryResponse = await fetch(url, {
            ...fetchOptions,
            headers: retryHeaders,
          });
          
          resolve(retryResponse);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  return response;
};

const api = {
  get: (url, options = {}) => apiClient(url, { ...options, method: 'GET' }),
  
  post: (url, data, options = {}) => 
    apiClient(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (url, data, options = {}) => 
    apiClient(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  patch: (url, data, options = {}) => 
    apiClient(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (url, options = {}) => 
    apiClient(url, { ...options, method: 'DELETE' }),

  setTokens: setStoredTokens,
  getTokens: getStoredTokens,
  clearTokens: clearStoredTokens,
};

export default api;
export { setStoredTokens, getStoredTokens, clearStoredTokens };
