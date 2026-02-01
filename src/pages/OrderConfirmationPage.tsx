import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Package, Truck, Home, Phone, Loader2, Mail } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/const";

interface Order {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  gst: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: string;
  deliveryEstimate: string | null;
  createdAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
}

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);

  useEffect(() => {
    const checkStoredEmail = () => {
      if (!orderNumber) return null;
      
      // Check sessionStorage for email from checkout
      const storedEmail = sessionStorage.getItem(`order_email_${orderNumber}`);
      return storedEmail;
    };

    const storedEmail = checkStoredEmail();
    if (storedEmail) {
      // Auto-fetch with stored email
      fetchOrder(storedEmail);
    } else {
      // Need email verification
      setNeedsVerification(true);
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrder = async (email: string) => {
    if (!orderNumber) return;
    
    setLoading(true);
    setEmailError('');
    
    try {
      // Use MongoDB API to fetch order with email verification
      const response = await axios.get(`${BASE_URL}/orders/${orderNumber}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-verify-email': email.trim().toLowerCase(), // Email verification header
        },
      });
      
      const responseData = response.data;
      const orderResult = responseData.data || responseData;
      
      if (!orderResult) {
        setEmailError('No order found with this email. Please check and try again.');
        setNeedsVerification(true);
        setLoading(false);
        return;
      }
      
      // Map MongoDB order format to our Order interface
      const mappedOrder: Order = {
        orderId: orderResult.orderId,
        orderNumber: orderResult.orderNumber,
        customerName: orderResult.customerName,
        customerEmail: orderResult.customerEmail,
        customerPhone: orderResult.customerPhone,
        shippingAddress: orderResult.shippingAddress,
        items: orderResult.items || [],
        subtotal: orderResult.subtotal,
        shipping: orderResult.shipping,
        gst: orderResult.gst,
        discount: orderResult.discount,
        totalAmount: orderResult.totalAmount,
        paymentMethod: orderResult.paymentMethod,
        orderStatus: orderResult.orderStatus,
        deliveryEstimate: orderResult.deliveryEstimate,
        createdAt: orderResult.createdAt,
      };
      
      setOrder(mappedOrder);
      setNeedsVerification(false);
      
      // Store verified email for future page loads
      sessionStorage.setItem(`order_email_${orderNumber}`, email.trim().toLowerCase());
      
      // Map items for display
      const mappedItems = (orderResult.items || []).map((item: any, index: number) => ({
        id: item.productId || index.toString(),
        product_name: item.name,
        product_weight: item.weight || '',
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      }));
      setItems(mappedItems);
    } catch (error) {
      console.error('Error fetching order:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setEmailError('No order found with this email. Please check and try again.');
        setNeedsVerification(true);
        return;
      }
      setEmailError('Unable to verify your order. Please try again.');
      setNeedsVerification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.trim() || !emailRegex.test(emailInput.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    
    fetchOrder(emailInput);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  // Email verification form
  if (needsVerification) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-semibold mb-2">Verify Your Order</h2>
                <p className="text-muted-foreground">
                  Enter the email address used for order <strong>{orderNumber}</strong>
                </p>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setEmailError('');
                    }}
                    className={emailError ? 'border-destructive' : ''}
                  />
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'View Order'
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/">Return Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <Package className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-semibold mb-3">Order Not Found</h2>
            <p className="text-muted-foreground mb-8">We couldn't find this order.</p>
            <Button asChild size="lg">
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I'd like to track my order ${order.orderNumber}. My name is ${order.customerName}.`
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-16">
        <div className="container max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-leaf/10 mb-6">
              <CheckCircle className="h-10 w-10 text-leaf" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Thank You for Your Order!
            </h1>
            <p className="text-muted-foreground text-lg">
              Your order has been placed successfully.
            </p>
          </div>

          {/* Order Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Order Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Number</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Date</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge variant="warning">
                      {order.paymentMethod === 'cod' ? 'COD' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Delivery Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="default" className="capitalize">{order.orderStatus}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Delivery</span>
                    <span className="font-medium">{order.deliveryEstimate || 'Not set'}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-start gap-3">
                  <Home className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-muted-foreground">
                      {order.shippingAddress.line1}
                      {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">{item.product_weight} × {item.quantity}</p>
                    </div>
                    <span className="font-medium">₹{Number(item.total_price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-leaf">
                    <span>Discount</span>
                    <span>-₹{Number(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{Number(order.shipping) === 0 ? <span className="text-leaf">FREE</span> : `₹${Number(order.shipping).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST</span>
                  <span>₹{Number(order.gst).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`https://wa.me/916362185820?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                Track on WhatsApp
              </a>
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            A confirmation email has been sent to <strong>{order.customerEmail}</strong>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;