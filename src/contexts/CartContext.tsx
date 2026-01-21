import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import * as cartApi from '@/services/cartApi';
import type { CartItem as ApiCartItem } from '@/services/cartApi';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp?: number;
  weight: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  itemCount: number;
  subtotal: number;
  shipping: number;
  gst: number;
  total: number;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'drygo-cart';
const FREE_SHIPPING_THRESHOLD = 499;
const GST_RATE = 0.05; // 5% GST

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId && item.weight === action.payload.weight
      );
      
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }
      
      const newItem: CartItem = {
        ...action.payload,
        id: `${action.payload.productId}-${action.payload.weight}-${Date.now()}`,
      };
      return { ...state, items: [...state.items, newItem] };
    }
    
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
}

// Helper function to convert API cart item to local cart item
const convertApiItemToCartItem = (apiItem: ApiCartItem): CartItem => {
  return {
    id: apiItem.id || `${apiItem.productId}-${apiItem.weight}-${Date.now()}`,
    productId: apiItem.productId,
    name: apiItem.name || 'Product',
    image: apiItem.image || '',
    price: apiItem.price || 0,
    mrp: apiItem.mrp,
    weight: apiItem.weight || '',
    quantity: apiItem.quantity || 1,
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false, isLoading: false });

  // Sync cart from API
  const syncCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await cartApi.getCart();
      
      if (cartData && cartData.items) {
        const convertedItems = cartData.items.map(convertApiItemToCartItem);
        dispatch({ type: 'LOAD_CART', payload: convertedItems });
        // Also save to localStorage as backup
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(convertedItems));
      }
    } catch (error) {
      console.error('Error syncing cart from API:', error);
      // Fallback to localStorage if API fails
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: parsedCart });
        }
      } catch (localError) {
        console.error('Error loading cart from localStorage:', localError);
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Load cart from API on mount, fallback to localStorage
  useEffect(() => {
    syncCart();
  }, [syncCart]);

  // Listen for storage changes (login/logout events)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'LoginToken') {
        // User logged in or out - sync cart
        syncCart();
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom login event (from same tab)
    const handleLogin = () => {
      // Wait a bit to ensure localStorage is fully written
      setTimeout(() => {
        const token = localStorage.getItem('LoginToken');
        if (token) {
          console.log('Cart sync triggered after login, token found');
          syncCart();
        } else {
          console.warn('Cart sync triggered but no token found in localStorage');
        }
      }, 150);
    };

    window.addEventListener('user-login', handleLogin);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-login', handleLogin);
    };
  }, [syncCart]);

  // Save cart to localStorage on changes (as backup)
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  const total = subtotal + shipping + gst;

  // Add item to cart (with API sync)
  const addItem = useCallback(async (item: Omit<CartItem, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await cartApi.addItemToCart(
        item.productId,
        item.weight,
        item.quantity
      );
      
      if (cartData && cartData.items) {
        const convertedItems = cartData.items.map(convertApiItemToCartItem);
        dispatch({ type: 'LOAD_CART', payload: convertedItems });
      } else {
        // Fallback to local state if API response is invalid
        dispatch({ type: 'ADD_ITEM', payload: item });
      }
    } catch (error) {
      console.error('Error adding item to cart via API:', error);
      // Fallback to local state on error
      dispatch({ type: 'ADD_ITEM', payload: item });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Remove item from cart (with API sync)
  const removeItem = useCallback(async (id: string) => {
    // Find the item to get productId
    const item = state.items.find(item => item.id === id);
    if (!item) {
      // If item not found, just remove from local state
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await cartApi.removeCartItem(item.productId);
      
      if (cartData && cartData.items) {
        const convertedItems = cartData.items.map(convertApiItemToCartItem);
        dispatch({ type: 'LOAD_CART', payload: convertedItems });
      } else {
        // Fallback to local state
        dispatch({ type: 'REMOVE_ITEM', payload: id });
      }
    } catch (error) {
      console.error('Error removing item from cart via API:', error);
      // Fallback to local state on error
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.items]);

  // Update quantity (with API sync)
  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    // Find the item to get productId
    const item = state.items.find(item => item.id === id);
    if (!item) {
      // If item not found, just update local state
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cartData = await cartApi.updateCartItemQuantity(item.productId, quantity);
      
      if (cartData && cartData.items) {
        const convertedItems = cartData.items.map(convertApiItemToCartItem);
        dispatch({ type: 'LOAD_CART', payload: convertedItems });
      } else {
        // Fallback to local state
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
      }
    } catch (error) {
      console.error('Error updating cart item quantity via API:', error);
      // Fallback to local state on error
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.items, removeItem]);

  // Clear cart (with API sync)
  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartApi.clearCart();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart via API:', error);
      // Fallback to local state on error
      dispatch({ type: 'CLEAR_CART' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value: CartContextType = {
    items: state.items,
    isOpen: state.isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    itemCount,
    subtotal,
    shipping,
    gst,
    total,
    isLoading: state.isLoading,
    syncCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
