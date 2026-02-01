import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, Home, Loader2, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/const";

interface Order {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  items?: Array<{ name: string; quantity: number; weight?: string; price: number }>;
  subtotal?: number;
  shipping?: number;
  gst?: number;
  discount?: number;
  totalAmount?: number;
  paymentMethod?: string;
  orderStatus?: string;
  deliveryEstimate?: string | null;
  createdAt?: string;
}

interface OrdersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrdersSheet = ({ open, onOpenChange }: OrdersSheetProps) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem("UserID") || "";
  const token = localStorage.getItem("LoginToken") || "";
  const isLoggedIn = !!token;

  useEffect(() => {
    if (open && isLoggedIn && userId) {
      fetchOrders();
    } else if (open && !isLoggedIn) {
      setOrders([]);
      setError(null);
    }
  }, [open, isLoggedIn, userId]);

  const fetchOrders = async () => {
    if (!userId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BASE_URL}/orders/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          token: token.trim(),
        },
      });

      const responseData = response.data;
      const ordersData = responseData.data ?? responseData;

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else if (ordersData && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Unable to load orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatDeliveryDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Your Orders
          </SheetTitle>
        </SheetHeader>

        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">Login to view orders</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Sign in to see your order history and track deliveries.
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate("/Login");
              }}
              variant="default"
            >
              Login
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <p className="text-sm text-destructive mb-4">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              Try Again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="font-display text-lg font-semibold mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Place your first order to see it here!
            </p>
            <Button
              onClick={() => {
                onOpenChange(false);
                navigate("/");
              }}
              variant="outline"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {orders.map((order) => (
              <Card key={order.orderId || order.orderNumber} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 gap-0">
                    {/* Order Details Card */}
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">Order Details</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Number</span>
                          <span className="font-mono font-medium">{order.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Date</span>
                          <span>{order.createdAt ? formatDate(order.createdAt) : "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment Method</span>
                          <span className="capitalize">
                            {order.paymentMethod === "cod"
                              ? "Cash On Delivery"
                              : order.paymentMethod
                                ? "Online Payment"
                                : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Payment Status</span>
                          <Badge variant="warning">
                            {order.paymentMethod === "cod" ? "COD" : "Paid"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information Card */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="h-4 w-4 text-primary" />
                        <h4 className="font-semibold text-sm">Delivery Information</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Status</span>
                          <Badge
                            variant={
                              order.orderStatus?.toLowerCase() === "delivered"
                                ? "success"
                                : "warning"
                            }
                            className="capitalize"
                          >
                            {order.orderStatus || "Pending"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Delivery</span>
                          <span className="font-medium">
                            {formatDeliveryDate(order.deliveryEstimate)}
                          </span>
                        </div>
                        {order.shippingAddress && (
                          <div className="flex items-start gap-2 pt-2 mt-2 border-t">
                            <Home className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div className="text-sm min-w-0">
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-muted-foreground break-words">
                                {order.shippingAddress.line1}
                                {order.shippingAddress.line2 &&
                                  `, ${order.shippingAddress.line2}`}
                                <br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                {order.shippingAddress.pincode}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-muted/30 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total</span>
                      <span className="font-semibold text-primary">
                        ₹{order.totalAmount != null ? Number(order.totalAmount).toFixed(2) : "—"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        if (order.customerEmail) {
                          sessionStorage.setItem(
                            `order_email_${order.orderNumber}`,
                            order.customerEmail.toLowerCase()
                          );
                        }
                        onOpenChange(false);
                        navigate(`/order-confirmation/${order.orderNumber}`);
                      }}
                    >
                      View Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrdersSheet;
