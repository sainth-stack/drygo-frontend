import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import BenefitCard from "@/components/BenefitCard";
import FAQItem from "@/components/FAQItem";
import ProductCard from "@/components/ProductCard";
import NutritionTable from "@/components/NutritionTable";
import AddToCartSection from "@/components/AddToCartSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Heart, Sparkles, AlertTriangle, Package, Cookie } from "lucide-react";

import spinachPowder from "@/assets/spinach-powder.jpg";
import moringaPowder from "@/assets/moringa-powder.jpg";
import carrotPowder from "@/assets/carrot-powder.jpg";
import beetrootPowder from "@/assets/beetroot-powder.jpg";

const beetrootNutrition = [
  { nutrient: "Energy (kcal)", per100g: "238.23", per5g: "11.01", rda: "0.60" },
  { nutrient: "Fat (g)", per100g: "0.80", per5g: "0.04", rda: "0.06" },
  { nutrient: "Cholesterol (mg)", per100g: "0.00", per5g: "0.00", rda: "-" },
  { nutrient: "Sodium (mg)", per100g: "432.10", per5g: "21.61", rda: "1.08" },
  { nutrient: "Carbohydrates (g)", per100g: "34.20", per5g: "1.71", rda: "1.32" },
  { nutrient: "Fiber (g)", per100g: "18.30", per5g: "0.92", rda: "3.05" },
  { nutrient: "Total Sugars (g)", per100g: "24.10", per5g: "1.21", rda: "-" },
  { nutrient: "Added Sugars (g)", per100g: "0.00", per5g: "0.00", rda: "0.00" },
  { nutrient: "Protein (g)", per100g: "10.80", per5g: "0.54", rda: "1.00" },
  { nutrient: "Vitamin D", per100g: "0", per5g: "0.00", rda: "0.00" },
  { nutrient: "Iron (mg)", per100g: "1.26", per5g: "0.06", rda: "0.33" },
  { nutrient: "Calcium (mg)", per100g: "28.71", per5g: "1.44", rda: "0.14" },
  { nutrient: "Potassium (mg)", per100g: "340", per5g: "17.00", rda: "0.49" },
];

const BeetrootPowderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <Badge className="text-sm bg-[hsl(340,60%,45%)] text-white font-semibold shadow-md">
                  Natural Colouring • Sweet-Earthy Taste
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  DRYGO Beetroot Powder
                </h1>
                <p className="text-lg text-muted-foreground">
                  Beetroot powder is the best natural food colouring substitute with an addition of the 
                  sweet-earthy taste to all your rotis, kebabs, soups, cakes, curries or beverages.
                </p>

                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-primary">₹249</span>
                  <span className="text-sm text-muted-foreground">
                    150g pouch • 100% Beetroot Powder
                  </span>
                </div>

                <AddToCartSection
                  productId="73d9bf8a-f5f5-4594-a8b4-3a6d8f7ac93f"
                  productName="DRYGO Beetroot Powder"
                  productImage={beetrootPowder}
                  price={249}
                  weight="150g"
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge className="bg-[hsl(340,60%,45%)] text-white font-semibold shadow-md">Natural food colour</Badge>
                  <Badge className="bg-[hsl(340,60%,45%)] text-white font-semibold shadow-md">High in Fiber</Badge>
                  <Badge className="bg-[hsl(340,60%,45%)] text-white font-semibold shadow-md">No preservatives</Badge>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="w-full max-w-lg mx-auto">
                  <img 
                    src={beetrootPowder} 
                    alt="DRYGO Beetroot Powder" 
                    className="w-full h-auto rounded-3xl shadow-xl"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Net Wt: 150g
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* Cooking Suggestion */}
        <Section id="cooking">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Cooking Suggestion
            </h2>
            <p className="text-lg text-muted-foreground">
              Add 3 tablespoons full of beetroot powder instead of a cup full of fresh shredded beetroot. 
              Just wait until your nutrients are on your way.
            </p>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section id="benefits" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Beetroot Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={Palette}
              title="Natural Food Colouring"
              description="Add beautiful pink-red colour to your dishes naturally without any artificial colours or additives."
            />
            <BenefitCard
              icon={Heart}
              title="Sweet-Earthy Flavour"
              description="Unique taste profile that enhances both sweet and savoury dishes with a natural sweetness."
            />
            <BenefitCard
              icon={Sparkles}
              title="Versatile Usage"
              description="Perfect for rotis, kebabs, soups, cakes, curries, smoothies and beverages."
            />
          </div>
        </Section>

        {/* How to Use Section */}
        <Section id="how-to-use" background="hero-green">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            How to Use Beetroot Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-pink-600" />
                  Pink Rotis & Parathas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add 1-2 tsp to wheat flour while kneading for beautiful pink rotis that kids love.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-pink-600" />
                  Healthy Smoothies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blend with banana, yogurt and honey for a naturally pink, nutrient-rich smoothie.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-pink-600" />
                  Natural Cake Colour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use in cake batters, frostings and desserts for natural pink-red colouring.
                </p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Ingredients & Nutrition Section */}
        <Section id="ingredients">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="font-display text-3xl font-bold">Ingredients & Storage</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Ingredients:</strong> 100% Beetroot Powder
                </p>
                
                <Card hover={false} className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Allergen Advice:</p>
                        <p className="text-sm">Processed in a facility which also processes peanuts & tree nuts.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card hover={false}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Package className="h-5 w-5" />
                      Storage Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>• Keep away from direct sunlight</p>
                    <p>• Store in cool and dry place</p>
                    <p>• Do not buy if the product seal is tampered</p>
                    <p>• Keep the packet always closed</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <NutritionTable data={beetrootNutrition} />
          </div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            FAQs About Beetroot Powder
          </h2>
          <div className="space-y-4 max-w-3xl">
            <FAQItem
              question="Will it change the taste of my food significantly?"
              answer="Beetroot powder adds a mild sweet-earthy flavour. In small quantities, it primarily adds colour without overpowering the dish."
            />
            <FAQItem
              question="Is it safe for children?"
              answer="Yes, beetroot powder is safe for children and adds natural nutrients to their meals. The pink colour often makes food more appealing to kids."
            />
            <FAQItem
              question="Can I use it as a replacement for artificial food colour?"
              answer="Absolutely! Beetroot powder is a perfect natural alternative to artificial red/pink food colours in cakes, desserts and beverages."
            />
          </div>
        </Section>

        {/* Related Products Section */}
        <Section id="related">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            You May Also Like
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard
              name="Spinach Powder"
              description="Iron-rich green powder for rotis, parathas, and dals."
              price="₹249"
              image={spinachPowder}
              link="/products/spinach"
              badge="Best Seller"
              badgeVariant="leaf"
            />
            <ProductCard
              name="Carrot Powder"
              description="Vitamin A support for kids & adults. Perfect for halwa."
              price="₹249"
              image={carrotPowder}
              link="/products/carrot"
              badge="Kid Favourite"
              badgeVariant="gold"
            />
            <ProductCard
              name="Moringa Powder"
              description="Natural multivitamin leaf powder for daily nutrition."
              price="₹249"
              image={moringaPowder}
              link="/products/moringa"
              badge="Superleaf"
              badgeVariant="leaf"
            />
          </div>
        </Section>

        {/* Manufacturer Info */}
        <Section id="manufacturer" background="muted">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h3 className="font-display text-xl font-bold">Manufactured and Marketed by:</h3>
            <p className="text-muted-foreground">
              SRI VARADHA NATURE HARVESTS INDUSTRIES<br />
              No.54, Ganagaluru, Anugondanahalli Hobali, Hosakote Taluk,<br />
              Bengaluru Rural, Karnataka, Bangalore Rural, Karnataka-560067
            </p>
            <p className="text-sm text-muted-foreground">
              For Feedback/Complaints: info@drygo.in | Contact: +91 63621 85820
            </p>
            <p className="text-sm font-medium">FSSAI: 11225303000567</p>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default BeetrootPowderPage;
