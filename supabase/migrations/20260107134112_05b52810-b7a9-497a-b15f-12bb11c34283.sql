-- Drop existing function and recreate with email verification
DROP FUNCTION IF EXISTS public.get_order_items_by_order_id(UUID);

-- Recreate function with email parameter for access control
CREATE OR REPLACE FUNCTION public.get_order_items_by_order_id(
  p_order_id UUID,
  p_customer_email TEXT
)
RETURNS TABLE (
  id UUID,
  product_name TEXT,
  product_weight TEXT,
  quantity INTEGER,
  unit_price NUMERIC,
  total_price NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate email matches the order
  IF NOT EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = p_order_id 
    AND LOWER(orders.customer_email) = LOWER(TRIM(p_customer_email))
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Email does not match order';
  END IF;
  
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