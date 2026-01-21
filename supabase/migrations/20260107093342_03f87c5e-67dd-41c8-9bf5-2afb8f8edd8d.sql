-- Fix 1: Orders table PUBLIC_DATA_EXPOSURE
-- Drop the overly permissive read policy
DROP POLICY IF EXISTS "Orders readable by email" ON public.orders;
DROP POLICY IF EXISTS "Order items are readable" ON public.order_items;

-- Create secure order lookup function for order confirmation page
-- This validates both order_number and customer_email
CREATE OR REPLACE FUNCTION public.get_order_by_number_and_email(
  p_order_number TEXT,
  p_customer_email TEXT
)
RETURNS TABLE (
  id UUID,
  order_number TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address_line1 TEXT,
  shipping_address_line2 TEXT,
  shipping_city TEXT,
  shipping_state TEXT,
  shipping_pincode TEXT,
  subtotal NUMERIC,
  shipping_cost NUMERIC,
  gst_amount NUMERIC,
  discount_amount NUMERIC,
  total_amount NUMERIC,
  payment_method TEXT,
  payment_status TEXT,
  order_status TEXT,
  delivery_estimate TEXT,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate inputs
  IF p_order_number IS NULL OR p_order_number = '' THEN
    RAISE EXCEPTION 'Order number is required';
  END IF;
  
  IF p_customer_email IS NULL OR p_customer_email = '' THEN
    RAISE EXCEPTION 'Customer email is required';
  END IF;
  
  RETURN QUERY
  SELECT 
    o.id,
    o.order_number,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.shipping_address_line1,
    o.shipping_address_line2,
    o.shipping_city,
    o.shipping_state,
    o.shipping_pincode,
    o.subtotal,
    o.shipping_cost,
    o.gst_amount,
    o.discount_amount,
    o.total_amount,
    o.payment_method,
    o.payment_status,
    o.order_status,
    o.delivery_estimate,
    o.created_at
  FROM public.orders o
  WHERE o.order_number = p_order_number
    AND LOWER(o.customer_email) = LOWER(p_customer_email);
END;
$$;

-- Create function to get order items by order ID (only accessible via secure function call)
CREATE OR REPLACE FUNCTION public.get_order_items_by_order_id(
  p_order_id UUID
)
RETURNS TABLE (
  id UUID,
  product_name TEXT,
  product_weight TEXT,
  quantity INTEGER,
  unit_price NUMERIC,
  total_price NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oi.id,
    oi.product_name,
    oi.product_weight,
    oi.quantity,
    oi.unit_price,
    oi.total_price
  FROM public.order_items oi
  WHERE oi.order_id = p_order_id;
END;
$$;

-- Fix 2: INPUT_VALIDATION - Create server-side order validation function
CREATE OR REPLACE FUNCTION public.create_validated_order(
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_address_line1 TEXT,
  p_address_line2 TEXT,
  p_city TEXT,
  p_state TEXT,
  p_pincode TEXT,
  p_cart_items JSONB,
  p_coupon_code TEXT DEFAULT NULL,
  p_payment_method TEXT DEFAULT 'razorpay'
)
RETURNS TABLE (
  order_id UUID,
  order_number TEXT,
  total_amount NUMERIC
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_subtotal NUMERIC := 0;
  v_discount NUMERIC := 0;
  v_shipping NUMERIC;
  v_gst NUMERIC;
  v_total NUMERIC;
  v_item JSONB;
  v_product RECORD;
  v_coupon RECORD;
  v_seq_num INTEGER;
BEGIN
  -- Validate required inputs
  IF p_customer_name IS NULL OR LENGTH(TRIM(p_customer_name)) < 2 THEN
    RAISE EXCEPTION 'Invalid customer name';
  END IF;
  
  IF p_customer_email IS NULL OR p_customer_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;
  
  IF p_customer_phone IS NULL OR p_customer_phone !~ '^[6-9]\d{9}$' THEN
    RAISE EXCEPTION 'Invalid phone number';
  END IF;
  
  IF p_address_line1 IS NULL OR LENGTH(TRIM(p_address_line1)) < 5 THEN
    RAISE EXCEPTION 'Invalid address';
  END IF;
  
  IF p_city IS NULL OR LENGTH(TRIM(p_city)) < 2 THEN
    RAISE EXCEPTION 'Invalid city';
  END IF;
  
  IF p_state IS NULL OR LENGTH(TRIM(p_state)) < 2 THEN
    RAISE EXCEPTION 'Invalid state';
  END IF;
  
  IF p_pincode IS NULL OR p_pincode !~ '^\d{6}$' THEN
    RAISE EXCEPTION 'Invalid pincode';
  END IF;
  
  IF p_cart_items IS NULL OR jsonb_array_length(p_cart_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;
  
  IF p_payment_method NOT IN ('razorpay', 'cod') THEN
    RAISE EXCEPTION 'Invalid payment method';
  END IF;

  -- Calculate subtotal from database prices (not client-provided prices)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    -- Get actual product price from database
    SELECT p.id, p.price, p.name, p.is_active, COALESCE(p.weight, '100g') as weight 
    INTO v_product
    FROM products p
    WHERE p.id = (v_item->>'product_id')::UUID
      AND p.is_active = true;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Invalid or inactive product: %', v_item->>'product_id';
    END IF;
    
    -- Validate quantity
    IF (v_item->>'quantity')::INTEGER < 1 OR (v_item->>'quantity')::INTEGER > 100 THEN
      RAISE EXCEPTION 'Invalid quantity for product: %', v_product.name;
    END IF;
    
    v_subtotal := v_subtotal + (v_product.price * (v_item->>'quantity')::INTEGER);
  END LOOP;
  
  -- Validate and apply coupon server-side
  IF p_coupon_code IS NOT NULL AND p_coupon_code != '' THEN
    SELECT * INTO v_coupon
    FROM coupons
    WHERE code = UPPER(p_coupon_code)
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
      AND (usage_limit IS NULL OR used_count < usage_limit);
    
    IF FOUND THEN
      IF v_coupon.min_order_value IS NULL OR v_subtotal >= v_coupon.min_order_value THEN
        IF v_coupon.discount_type = 'percentage' THEN
          v_discount := v_subtotal * (v_coupon.discount_value / 100);
          IF v_coupon.max_discount IS NOT NULL THEN
            v_discount := LEAST(v_discount, v_coupon.max_discount);
          END IF;
        ELSE
          v_discount := v_coupon.discount_value;
        END IF;
        
        -- Update coupon usage
        UPDATE coupons SET used_count = used_count + 1 WHERE id = v_coupon.id;
      END IF;
    END IF;
  END IF;
  
  -- Calculate shipping and GST
  v_shipping := CASE WHEN v_subtotal >= 499 THEN 0 ELSE 49 END;
  v_gst := ROUND(v_subtotal * 0.05, 2);
  v_total := v_subtotal + v_shipping + v_gst - v_discount;
  
  -- Create order (trigger will generate order_number)
  INSERT INTO orders (
    order_number,
    customer_name, 
    customer_email, 
    customer_phone,
    shipping_address_line1, 
    shipping_address_line2,
    shipping_city, 
    shipping_state, 
    shipping_pincode,
    subtotal, 
    shipping_cost, 
    gst_amount, 
    discount_amount,
    coupon_code, 
    total_amount, 
    payment_method,
    payment_status,
    order_status,
    delivery_estimate
  ) VALUES (
    '', -- Will be set by trigger
    TRIM(p_customer_name),
    LOWER(TRIM(p_customer_email)),
    p_customer_phone,
    TRIM(p_address_line1),
    NULLIF(TRIM(p_address_line2), ''),
    TRIM(p_city),
    TRIM(p_state),
    p_pincode,
    v_subtotal,
    v_shipping,
    v_gst,
    v_discount,
    NULLIF(UPPER(p_coupon_code), ''),
    v_total,
    p_payment_method,
    'pending',
    'pending',
    '3-5 business days'
  ) RETURNING id, orders.order_number INTO v_order_id, v_order_number;
  
  -- Insert order items with validated prices from database
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_cart_items)
  LOOP
    SELECT p.id, p.price, p.name, COALESCE(p.weight, '100g') as weight 
    INTO v_product
    FROM products p
    WHERE p.id = (v_item->>'product_id')::UUID;
    
    INSERT INTO order_items (
      order_id,
      product_id,
      product_name,
      product_weight,
      quantity,
      unit_price,
      total_price
    ) VALUES (
      v_order_id,
      v_product.id,
      v_product.name,
      COALESCE(v_item->>'weight', v_product.weight),
      (v_item->>'quantity')::INTEGER,
      v_product.price,
      v_product.price * (v_item->>'quantity')::INTEGER
    );
  END LOOP;
  
  RETURN QUERY SELECT v_order_id, v_order_number, v_total;
END;
$$;

-- Fix 3: DEFINER_OR_RPC_BYPASS - Improve order number generation with sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  v_seq_num INTEGER;
BEGIN
  v_seq_num := nextval('order_number_seq');
  NEW.order_number := 'DRY' || TO_CHAR(now(), 'YYYYMMDD') || '-' || LPAD(v_seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS generate_order_number_trigger ON orders;
CREATE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();