import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { items, removeItem, updateQuantity, itemCount, subtotal, shipping, gst, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>
          
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="h-20 w-20 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="font-display text-2xl font-semibold mb-3">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you haven't added any products yet. Explore our range of natural vegetable powders!
              </p>
              <Button asChild size="lg">
                <Link to="/#products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-4 md:gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg bg-muted"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-display font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.weight}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive shrink-0"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-2">
                            <span className="font-bold text-lg text-primary">₹{item.price}</span>
                            {item.mrp && item.mrp > item.price && (
                              <span className="text-sm text-muted-foreground line-through">₹{item.mrp}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-10 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/#products">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? <span className="text-leaf font-medium">FREE</span> : `₹${shipping}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST (5%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-primary">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {subtotal < 499 && (
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
                        <p className="text-sm text-primary font-medium">
                          Add ₹{(499 - subtotal).toFixed(0)} more for FREE shipping!
                        </p>
                      </div>
                    )}
                    
                    <Button asChild className="w-full mt-6" size="lg">
                      <Link to="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    
                    <div className="mt-6 space-y-2 text-xs text-muted-foreground text-center">
                      <p>🚚 Free shipping on orders above ₹499</p>
                      <p>💳 Secure payments via Razorpay</p>
                      <p>📦 Cash on Delivery available</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
