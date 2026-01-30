import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import { useState } from "react";
import ContactDialog from "@/components/ContactDialog";
import CartIcon from "@/components/CartIcon";
import OrdersSheet from "@/components/OrdersSheet";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CART_STORAGE_KEY = "drygo-cart";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const isLoggedIn = !!localStorage.getItem("LoginToken");

  const handleLogout = async () => {
    localStorage.removeItem("LoginToken");
    localStorage.removeItem("UserID");
    localStorage.removeItem("UserEmail");
    localStorage.removeItem(CART_STORAGE_KEY);
    await clearCart();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="DRYGO" 
            className="h-16 w-auto mix-blend-multiply" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/products/spinach"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Spinach Powder
          </Link>
          <Link
            to="/products/moringa"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Moringa Powder
          </Link>
          <Link
            to="/products/carrot"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Carrot Powder
          </Link>
          <Link
            to="/products/beetroot"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Beetroot Powder
          </Link>
          <Link
            to="/products/banana"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Banana Powder
          </Link>
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact Us
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <CartIcon />
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Profile menu">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsOrdersOpen(true)}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="leaf" size="sm" onClick={() => navigate("/Login")}>
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border/50 bg-background animate-fade-in">
          <div className="container py-4 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Home
            </Link>
            <Link
              to="/products/spinach"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Spinach Powder
            </Link>
            <Link
              to="/products/moringa"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Moringa Powder
            </Link>
            <Link
              to="/products/carrot"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Carrot Powder
            </Link>
            <Link
              to="/products/beetroot"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Beetroot Powder
            </Link>
            <Link
              to="/products/banana"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Banana Powder
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsContactOpen(true);
              }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 text-left"
            >
              Contact Us
            </button>
          </div>
        </nav>
      )}

      <ContactDialog open={isContactOpen} onOpenChange={setIsContactOpen} />
      <OrdersSheet open={isOrdersOpen} onOpenChange={setIsOrdersOpen} />
    </header>
  );
};

export default Header;
