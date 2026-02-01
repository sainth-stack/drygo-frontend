import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";
import { BASE_URL } from "@/const";
import { ArrowLeft, CreditCard, Truck, Loader2, Shield, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").max(255),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  addressLine1: z.string().min(5, "Address is too short").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Invalid pincode"),
});

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, subtotal, shipping, gst, total, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
  } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      checkoutSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Coupon Code Required",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }
    
    setApplyingCoupon(true);
    
    try {
      // Get authentication token if available
      const token = localStorage.getItem('LoginToken');
      
      const response = await axios.post(
        `${BASE_URL}/coupon/validate`,
        {
          code: couponCode.toUpperCase().trim(),
          cartTotal: subtotal,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { token: token.trim() }),
          },
        }
      );

      const responseData = response.data;

      if (!responseData.success) {
        toast({
          title: "Invalid Coupon",
          description: responseData.message || "This coupon code is not valid.",
          variant: "destructive",
        });
        setDiscount(0);
        setAppliedCoupon(null);
        return;
      }

      // Calculate discount from response data
      const couponData = responseData.data;
      let discountAmount = 0;
      
      if (couponData.discountType === 'percentage') {
        discountAmount = subtotal * (couponData.discountValue / 100);
        if (couponData.maxDiscount) {
          discountAmount = Math.min(discountAmount, couponData.maxDiscount);
        }
      } else {
        discountAmount = couponData.discountValue;
      }

      setDiscount(discountAmount);
      setAppliedCoupon({
        code: couponData.code,
        description: couponData.description,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
      });
      
      toast({
        title: "Coupon Applied!",
        description: responseData.message || `You saved ₹${discountAmount.toFixed(2)}`,
      });
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Coupon Error",
        description: error instanceof Error ? error.message : "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
      setDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your order.",
    });
  };

  const finalTotal = total - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix errors",
        description: "Check the form for validation errors.",
        variant: "destructive",
      });
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('LoginToken');
      if (!token) {
        throw new Error('Please login to place an order');
      }

      // Prepare cart items for MongoDB API (productId, quantity, weight, variantId)
      const cartItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        weight: item.weight,
        variantId: (item as any).variantId || null,
      }));

      // Prepare shipping address
      const shippingAddress = {
        line1: formData.addressLine1,
        line2: formData.addressLine2 || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: 'India',
      };

      // Create order using MongoDB API
      const response = await axios.post(
        `${BASE_URL}/orders`,
        {
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress,
          cartItems,
          couponCode: appliedCoupon?.code || null,
          paymentMethod,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: token.trim(),
          },
        }
      );

      const responseData = response.data;
      const orderData = responseData.data || responseData;
      
      if (!orderData) {
        throw new Error('No order data returned');
      }

      const order = {
        orderId: orderData.orderId,
        orderNumber: orderData.orderNumber,
        totalAmount: orderData.totalAmount,
        paymentMethod: orderData.paymentMethod,
        orderStatus: orderData.orderStatus,
        deliveryEstimate: orderData.deliveryEstimate,
      };
      
      // Store email in sessionStorage for order confirmation page verification
      sessionStorage.setItem(`order_email_${order.orderNumber}`, formData.email.toLowerCase());
      
      if (paymentMethod === 'cod') {
        // COD - Order complete
        clearCart();
        navigate(`/order-confirmation/${order.orderNumber}`);
      } else {
        // Razorpay payment - use server-calculated total
        const { data: paymentData, error: paymentError } = await supabase.functions.invoke('create-razorpay-order', {
          body: {
            amount: Math.round(Number(order.totalAmount) * 100), // Razorpay expects paise
            orderId: order.orderId,
            orderNumber: order.orderNumber,
          },
        });
        
        if (paymentError) throw paymentError;
        
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        script.onload = () => {
          const options = {
            key: paymentData.keyId,
            amount: paymentData.amount,
            currency: 'INR',
            name: 'DRYGO',
            description: `Order ${order.orderNumber}`,
            order_id: paymentData.razorpayOrderId,
            handler: async (response: any) => {
              // Verify payment
              const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  orderId: order.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              });
              
              if (verifyError) {
                toast({
                  title: "Payment Verification Failed",
                  description: "Please contact support.",
                  variant: "destructive",
                });
                return;
              }
              
              clearCart();
              navigate(`/order-confirmation/${order.orderNumber}`);
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#d4a247',
            },
          };
          
          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
        };
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Package className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-semibold mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add some products before checkout.</p>
            <Button asChild size="lg">
              <Link to="/#products">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container max-w-6xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
          
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Customer & Shipping Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Mobile Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="10-digit mobile number"
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address Line 1 *</Label>
                      <Input
                        id="addressLine1"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        placeholder="House/Flat No., Building Name, Street"
                        className={errors.addressLine1 ? 'border-destructive' : ''}
                      />
                      {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address Line 2</Label>
                      <Input
                        id="addressLine2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Area (optional)"
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="City"
                          className={errors.city ? 'border-destructive' : ''}
                        />
                        {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          placeholder="State"
                          className={errors.state ? 'border-destructive' : ''}
                        />
                        {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="6-digit pincode"
                          className={errors.pincode ? 'border-destructive' : ''}
                        />
                        {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'razorpay' | 'cod')}>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="font-medium">Pay Online (UPI, Cards, Net Banking)</div>
                          <div className="text-sm text-muted-foreground">Powered by Razorpay - Secure payments</div>
                        </Label>
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 mt-3">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                        </Label>
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground">{item.weight} × {item.quantity}</p>
                          </div>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    {/* Coupon */}
                    {!appliedCoupon ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Coupon code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                applyCoupon();
                              }
                            }}
                            className="flex-1"
                            disabled={applyingCoupon}
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={applyCoupon}
                            disabled={applyingCoupon || !couponCode.trim()}
                          >
                            {applyingCoupon ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Applying...
                              </>
                            ) : (
                              'Apply'
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-leaf/10 border border-leaf/20 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-leaf">{appliedCoupon.code}</span>
                              <span className="text-xs text-muted-foreground">Applied</span>
                            </div>
                            {appliedCoupon.description && (
                              <p className="text-xs text-muted-foreground mt-1">{appliedCoupon.description}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={removeCoupon}
                            className="text-destructive hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {/* Totals */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-leaf">
                          <span>Discount</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? <span className="text-leaf">FREE</span> : `₹${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (5%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg pt-2">
                        <span>Total</span>
                        <span className="text-primary">₹{finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full mt-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      By placing your order, you agree to our Terms & Conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;