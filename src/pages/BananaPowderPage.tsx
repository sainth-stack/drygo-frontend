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
import { Zap, Baby, Heart, AlertTriangle, Package, Cookie, Milk } from "lucide-react";

import spinachPowder from "@/assets/spinach-powder.jpg";
import moringaPowder from "@/assets/moringa-powder.jpg";
import carrotPowder from "@/assets/carrot-powder.jpg";
import bananaPowder from "@/assets/banana-powder.jpg";

const bananaNutrition = [
  { nutrient: "Energy (kcal)", per100g: "357.00", per5g: "17.85", rda: "0.89" },
  { nutrient: "Fat (g)", per100g: "0.80", per5g: "0.07", rda: "0.06" },
  { nutrient: "Cholesterol (mg)", per100g: "0.00", per5g: "0.00", rda: "-" },
  { nutrient: "Sodium (mg)", per100g: "432.10", per5g: "0.61", rda: "1.00" },
  { nutrient: "Carbohydrates (g)", per100g: "33.50", per5g: "12.50", rda: "0.62" },
  { nutrient: "Fiber (g)", per100g: "12.50", per5g: "28.63", rda: "2.06" },
  { nutrient: "Total Sugars (g)", per100g: "22.10", per5g: "28.03", rda: "-" },
  { nutrient: "Added Sugars (g)", per100g: "0.00", per5g: "0.00", rda: "0.00" },
  { nutrient: "Protein (g)", per100g: "11.60", per5g: "0.18", rda: "0.30" },
  { nutrient: "Vitamin D", per100g: "11.40", per5g: "0.02", rda: "0.18" },
  { nutrient: "Iron (mg)", per100g: "37.60", per5g: "0.76", rda: "0.63" },
  { nutrient: "Calcium (mg)", per100g: "37.00", per5g: "17.34", rda: "0.65" },
  { nutrient: "Potassium (mg)", per100g: "330", per5g: "26.00", rda: "0.77" },
];

const BananaPowderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <Badge className="text-sm bg-[hsl(45,90%,45%)] text-white font-semibold shadow-md">
                  Energy Boost • Natural Sweetness
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  DRYGO Banana Powder
                </h1>
                <p className="text-lg text-muted-foreground">
                  Banana Powder can be added in your soups, curries, desserts, smoothies, etc., 
                  to enrich all your meals with natural energy and sweetness.
                </p>

                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-primary">₹249</span>
                  <span className="text-sm text-muted-foreground">
                    150g pouch • 100% Banana Powder
                  </span>
                </div>

                <AddToCartSection
                  productId="d47c1ee4-bbbc-44df-82b6-76e84c0720c4"
                  productName="DRYGO Banana Powder"
                  productImage={bananaPowder}
                  price={249}
                  weight="150g"
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge className="bg-[hsl(45,90%,45%)] text-white font-semibold shadow-md">High in Potassium</Badge>
                  <Badge className="bg-[hsl(45,90%,45%)] text-white font-semibold shadow-md">Natural Energy</Badge>
                  <Badge className="bg-[hsl(45,90%,45%)] text-white font-semibold shadow-md">No added sugar</Badge>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="w-full max-w-lg mx-auto">
                  <img 
                    src={bananaPowder} 
                    alt="DRYGO Banana Powder" 
                    className="w-full h-auto rounded-3xl shadow-xl"
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Net Wt: 150g
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl -z-10" />
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
              Add 1 tablespoon of banana powder instead of 1 cup of fresh banana.
            </p>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section id="benefits" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Banana Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={Zap}
              title="Natural Energy Source"
              description="Rich in natural carbohydrates and sugars for quick, sustained energy throughout the day."
            />
            <BenefitCard
              icon={Baby}
              title="Baby Food Ready"
              description="Perfect for weaning babies and toddlers - just mix with milk or water for instant nutrition."
            />
            <BenefitCard
              icon={Heart}
              title="Potassium Rich"
              description="Supports heart health and muscle function with naturally high potassium content."
            />
          </div>
        </Section>

        {/* How to Use Section */}
        <Section id="how-to-use" background="hero">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            How to Use Banana Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Milk className="h-5 w-5 text-amber-600" />
                  Instant Baby Cereal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mix 1-2 tsp with warm milk or water for a nutritious, easy-to-digest meal for babies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-amber-600" />
                  Smoothies & Shakes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add to your protein shakes, smoothies or milkshakes for natural sweetness and energy.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-amber-600" />
                  Baking & Desserts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use in pancakes, muffins, cakes and other baked goods for natural banana flavour.
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
                  <strong className="text-foreground">Ingredients:</strong> 100% Banana Powder
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

            <NutritionTable data={bananaNutrition} />
          </div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            FAQs About Banana Powder
          </h2>
          <div className="space-y-4 max-w-3xl">
            <FAQItem
              question="Is it suitable for babies?"
              answer="Yes, banana powder is excellent for weaning babies (6+ months). It's easy to digest and provides natural energy. Always consult your paediatrician before introducing new foods."
            />
            <FAQItem
              question="Does it contain added sugar?"
              answer="No, our banana powder contains only 100% dehydrated banana with no added sugars. The sweetness comes naturally from the fruit."
            />
            <FAQItem
              question="Can athletes use it as an energy supplement?"
              answer="Absolutely! Banana powder is a great natural energy source before or after workouts due to its high carbohydrate and potassium content."
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

export default BananaPowderPage;
