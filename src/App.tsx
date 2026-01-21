import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import CartSheet from "@/components/CartSheet";
import Index from "./pages/Index";
import SpinachPowderPage from "./pages/SpinachPowderPage";
import Register from "./pages/Registerpage";
import MoringaPowderPage from "./pages/MoringaPowderPage";
import CarrotPowderPage from "./pages/CarrotPowderPage";
import BeetrootPowderPage from "./pages/BeetrootPowderPage";
import BananaPowderPage from "./pages/BananaPowderPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import NotFound from "./pages/NotFound";
import Login from './pages/Login';
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartSheet />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products/:name/:productId" element={< SpinachPowderPage/>} />
            <Route path="/Register" element={<Register/>} />
            <Route path="/Login" element={<Login/>} />
            <Route path="/products/spinach" element={<SpinachPowderPage />} />
            <Route path="/products/moringa" element={<MoringaPowderPage />} />
            <Route path="/products/carrot" element={<CarrotPowderPage />} />
            <Route path="/products/beetroot" element={<BeetrootPowderPage />} />
            <Route path="/products/banana" element={<BananaPowderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
