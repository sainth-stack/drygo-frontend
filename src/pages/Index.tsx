import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Section from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


import spinachPowder from "@/assets/spinach-powder.jpg";
import moringaPowder from "@/assets/moringa-powder.jpg";
import carrotPowder from "@/assets/carrot-powder.jpg";
import beetrootPowder from "@/assets/beetroot-powder.jpg";
import bananaPowder from "@/assets/banana-powder.jpg";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/products");
      const json = await res.json();
      

      if (json.success) {
        setProducts(json.data);
        
      } else {
        setError("Failed to load products");
      }
    } catch (err) {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

console.log(products[0]?.name);



  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <Badge variant="gold" className="text-sm">
                  100% Natural • No Preservatives
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Fuel Your Body{" "}
                  <span className="text-primary">Naturally</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg">
                  Premium dehydrated vegetable powders made for Indian kitchens.
                  Add a spoonful of nutrition to your rotis, dals, and smoothies—without
                  the washing, chopping, or cooking.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild variant="hero" size="lg">
                    <Link to="/products/spinach">
                      Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="hero-outline" size="lg">
                    <a href="#products">View Products</a>
                  </Button>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Leaf className="h-5 w-5 text-leaf" />
                    <span>Made in India</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>FSSAI Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-5 w-5 text-carrot" />
                    <span>Zero Additives</span>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="relative z-10">
                  <img
                    src={spinachPowder}
                    alt="DRYGO Spinach Powder"
                    className="w-full max-w-md mx-auto drop-shadow-2xl animate-float"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <Section id="products" background="muted">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Our Products
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Premium dehydrated powders made from fresh vegetables, perfect for
              busy families who want nutrition without the hassle.
            </p>
          </div>

<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
  {loading && (
    <p className="col-span-full text-center text-muted-foreground">
      Loading products...
    </p>
  )}

  {error && (
    <p className="col-span-full text-center text-red-500">
      {error}
    </p>
  )}

  {!loading &&
    !error &&
    products.map((product) => (
      <ProductCard
        key={product._id}
        name={product.name}
        description={product.description}
        price={product.price}
        image= {spinachPowder} // {`http://localhost:4000${product.image}`}
        link={product.name}
        badge={product.badge}
        badgeVariant={product.badgeVariant}
        productId={product._id}
      />
    ))}
</div>

        </Section>

        {/* Why DRYGO Section */}
        <Section>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Why Indian Families Choose DRYGO
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-leaf/10 flex items-center justify-center">
                    <Leaf className="h-5 w-5 text-leaf" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">Zero Prep, Zero Waste</h3>
                    <p className="text-muted-foreground text-sm">
                      No washing, chopping, or leftover waste. Just a dry spoon from the jar.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">Made for Indian Kitchens</h3>
                    <p className="text-muted-foreground text-sm">
                      Works perfectly with rotis, parathas, dals, curries, and traditional recipes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-carrot/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-carrot" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">Kid-Friendly Nutrition</h3>
                    <p className="text-muted-foreground text-sm">
                      Sneak in vegetables without changing the taste. Perfect for picky eaters.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={moringaPowder}
                alt="DRYGO Moringa Powder"
                className="w-full max-w-sm mx-auto drop-shadow-xl"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-leaf/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </Section>

        {/* CTA Section */}
        <Section background="hero-green">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Add More Green to Your Kitchen?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start with our best-selling Spinach Powder and discover how easy nutrition can be.
            </p>
            <Button asChild variant="hero" size="xl">
              <Link to="/products/spinach">
                Shop Spinach Powder <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
