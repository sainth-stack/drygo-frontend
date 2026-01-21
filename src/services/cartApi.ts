// Cart API Service
// Base URL can be configured via environment variable VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  mrp?: number;
  weight: string;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
  itemCount: number;
}


// Get headers with authentication token
// Backend expects token in req.headers.token (not Authorization header)
const getHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Add authentication token if available
  // Backend middleware checks: req.headers.token
  const token = localStorage.getItem('LoginToken');
  console.log('Cart API: Checking for token...', {
    tokenExists: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 30) + '...' : 'null'
  });
  
  if (token && token.trim()) {
    const trimmedToken = token.trim();
    // Explicitly set the token header
    headers['token'] = trimmedToken;
    console.log('Cart API: ✅ Token added to headers', {
      headerKey: 'token',
      tokenPreview: trimmedToken.substring(0, 20) + '...',
      allHeaders: Object.keys(headers)
    });
  } else {
    console.warn('Cart API: ⚠️ No token found in localStorage');
    const userId = localStorage.getItem('UserID');
    console.warn('Cart API: UserID in localStorage:', userId);
  }
  
  console.log('Cart API: Final headers object:', JSON.stringify(headers, null, 2));
  console.log('Cart API: Header keys:', Object.keys(headers));
  return headers;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('LoginToken');
};

// Get cart from API
export const getCart = async (): Promise<CartResponse> => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      console.log('Cart API: User not authenticated, returning empty cart');
      return {
        items: [],
        subtotal: 0,
        shipping: 0,
        gst: 0,
        total: 0,
        itemCount: 0,
      };
    }

    console.log('Cart API: Fetching cart with token');
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - keep token and UserID, let application handle the error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Unauthorized. Please check your authentication.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch cart: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Backend returns { success: true, data: {...} }
    // Return the data property if it exists, otherwise return the whole response
    return responseData.data || responseData;
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return empty cart on error
    return {
      items: [],
      subtotal: 0,
      shipping: 0,
      gst: 0,
      total: 0,
      itemCount: 0,
    };
  }
};

// Add item to cart
export const addItemToCart = async (
  productId: string,
  weight: string,
  quantity: number,
  variantId?: string
): Promise<CartResponse> => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Please login to add items to cart');
    }

    const headers = getHeaders();
    
    // Double-check token is in headers
    if (!headers.token) {
      console.error('Cart API: ❌ Token missing from headers! Cannot proceed.');
      const tokenCheck = localStorage.getItem('LoginToken');
      console.error('Cart API: Token in localStorage:', {
        exists: !!tokenCheck,
        length: tokenCheck?.length || 0,
        value: tokenCheck ? tokenCheck.substring(0, 30) + '...' : 'null'
      });
      throw new Error('Authentication token is missing. Please login again.');
    }
    
    // Verify token header is actually set
    console.log('Cart API: Final verification before fetch:', {
      tokenInHeaders: !!headers.token,
      tokenValue: headers.token ? headers.token.substring(0, 30) + '...' : 'MISSING',
      allHeaderKeys: Object.keys(headers),
      headersStringified: JSON.stringify(headers)
    });
    
    const requestBody = {
      productId,
      variantId,
      weight,
      quantity,
    };

    console.log('Cart API: Making request to /cart/add', {
      url: `${API_BASE_URL}/cart/add`,
      headers,
      hasTokenHeader: !!headers.token,
      body: requestBody,
    });

    // Ensure headers object is properly formatted
    // Fetch API accepts plain objects, but we need to ensure token is included
    console.log('Cart API: Headers before fetch:', {
      headersObject: headers,
      hasToken: 'token' in headers,
      tokenValue: headers.token ? headers.token.substring(0, 20) + '...' : 'missing',
      allKeys: Object.keys(headers)
    });

    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: headers, // Use plain object - fetch API handles this correctly
      body: JSON.stringify(requestBody),
    });

    console.log('Cart API: Response status', response.status, response.statusText);

    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `Failed to add item to cart: ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error('Cart API: Error response data:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
        
        // Log detailed error information
        if (response.status === 401) {
          console.error('Cart API: 401 Unauthorized - Token validation failed', {
            errorMessage,
            tokenSent: !!headers.token,
            tokenPreview: headers.token ? headers.token.substring(0, 20) + '...' : 'none'
          });
        }
      } catch (e) {
        const errorText = await response.text().catch(() => '');
        console.error('Cart API: Error response text:', errorText);
        errorMessage = errorText || errorMessage;
      }
      
      if (response.status === 401) {
        // Unauthorized - keep token and UserID, let application handle the error
        throw new Error(errorMessage || 'Unauthorized. Please check your authentication. Token may be expired or invalid.');
      }
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    // Backend returns { success: true, data: {...} }
    // Return the data property if it exists, otherwise return the whole response
    return responseData.data || responseData;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  productId: string,
  quantity: number
): Promise<CartResponse> => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Please login to update cart');
    }

    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - keep token and UserID, let application handle the error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Unauthorized. Please check your authentication.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to update cart item: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Backend returns { success: true, data: {...} }
    // Return the data property if it exists, otherwise return the whole response
    return responseData.data || responseData;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItem = async (productId: string): Promise<CartResponse> => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Please login to remove items from cart');
    }

    const response = await fetch(`${API_BASE_URL}/cart/item/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - keep token and UserID, let application handle the error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Unauthorized. Please check your authentication.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to remove cart item: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Backend returns { success: true, data: {...} }
    // Return the data property if it exists, otherwise return the whole response
    return responseData.data || responseData;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear cart
export const clearCart = async (): Promise<CartResponse> => {
  try {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      throw new Error('Please login to clear cart');
    }

    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Unauthorized - keep token and UserID, let application handle the error
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Unauthorized. Please check your authentication.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to clear cart: ${response.statusText}`);
    }

    const responseData = await response.json();
    // Backend returns { success: true, data: {...} }
    // Return the data property if it exists, otherwise return the whole response
    return responseData.data || responseData;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};
