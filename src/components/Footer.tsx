import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <img src={logo} alt="DRYGO" className="h-16 w-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Fuel your body naturally with DRYGO's premium dehydrated vegetable powders.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products/spinach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Spinach Powder
                </Link>
              </li>
              <li>
                <Link to="/products/moringa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Moringa Powder
                </Link>
              </li>
              <li>
                <Link to="/products/carrot" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Carrot Powder
                </Link>
              </li>
              <li>
                <Link to="/products/beetroot" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Beetroot Powder
                </Link>
              </li>
              <li>
                <Link to="/products/banana" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Banana Powder
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@drygo.in</li>
              <li>+91 63621 85820</li>
              <li>India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DRYGO. All rights reserved. Made with care in India.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
