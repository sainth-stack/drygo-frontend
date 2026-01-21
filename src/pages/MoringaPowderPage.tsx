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
import { Sparkles, Utensils, Briefcase, AlertTriangle, Package } from "lucide-react";

import spinachPowder from "@/assets/spinach-powder.jpg";
import moringaPowder from "@/assets/moringa-powder.jpg";
import carrotPowder from "@/assets/carrot-powder.jpg";

const moringaNutrition = [
  { nutrient: "Energy (kcal)", per100g: "271.54", per5g: "13.58", rda: "0.68" },
  { nutrient: "Fat (g)", per100g: "7.01", per5g: "0.35", rda: "0.52" },
  { nutrient: "Cholesterol (mg)", per100g: "0.00", per5g: "0.00", rda: "-" },
  { nutrient: "Sodium (mg)", per100g: "233.00", per5g: "11.65", rda: "0.58" },
  { nutrient: "Carbohydrates (g)", per100g: "28.32", per5g: "1.42", rda: "1.09" },
  { nutrient: "Fiber (g)", per100g: "11.80", per5g: "0.59", rda: "1.97" },
  { nutrient: "Total Sugars (g)", per100g: "0.00", per5g: "0.00", rda: "-" },
  { nutrient: "Added Sugars (g)", per100g: "0.00", per5g: "0.00", rda: "0.00" },
  { nutrient: "Protein (g)", per100g: "23.78", per5g: "1.19", rda: "2.20" },
  { nutrient: "Vitamin D", per100g: "-", per5g: "0.00", rda: "0.00" },
  { nutrient: "Iron (mg)", per100g: "19", per5g: "0.95", rda: "5.00" },
  { nutrient: "Calcium (mg)", per100g: "3467", per5g: "173.35", rda: "17.34" },
  { nutrient: "Potassium (mg)", per100g: "259", per5g: "12.95", rda: "0.37" },
];

const MoringaPowderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero-green py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <Badge variant="leaf" className="text-sm">
                  Superleaf • Everyday Multivitamin
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  DRYGO Moringa Powder
                </h1>
                <p className="text-lg text-muted-foreground">
                  Moringa Powder can be added to fortify your meals including smoothies, shakes, 
                  flat breads, rice, doughs, batters, salads & more.
                </p>

                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-primary">₹249</span>
                  <span className="text-sm text-muted-foreground">
                    150g pouch • 100% Moringa Powder
                  </span>
                </div>

                <AddToCartSection
                  productId="e3688eb5-4b29-41e2-87de-fff60f69bb0d"
                  productName="DRYGO Moringa Powder"
                  productImage={moringaPowder}
                  price={249}
                  weight="150g"
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="gold">High in Calcium</Badge>
                  <Badge variant="gold">No preservatives</Badge>
                  <Badge variant="gold">Vegan</Badge>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <img
                  src={moringaPowder}
                  alt="DRYGO Moringa Powder"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
                />
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Net Wt: 150g
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-moringa/10 rounded-full blur-3xl -z-10" />
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
              Add 2 tablespoons of Moringa powder to your favourite recipes instead of a cup of fresh moringa leaves.
            </p>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section id="benefits" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Benefits of Moringa Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={Sparkles}
              title="Daily Micronutrient Support"
              description="Naturally contains vitamins, minerals and antioxidants that complement your regular diet. Exceptionally high in calcium."
            />
            <BenefitCard
              icon={Utensils}
              title="Easy to Add Anywhere"
              description="Works well in buttermilk, dals, sabzis, smoothies and even chutneys."
            />
            <BenefitCard
              icon={Briefcase}
              title="Ideal for Busy Professionals"
              description="A spoonful of green goodness when you can't cook elaborate meals every day."
            />
          </div>
        </Section>

        {/* How to Use Section */}
        <Section id="how-to-use" background="hero-green">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            How to Use Moringa Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Moringa Chaas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add 1 tsp powder to buttermilk with roasted jeera and salt for an easy mid-day drink.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Dal & Sabzi Upgrade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stir 1 tsp into cooked dal or sabzi just before serving. Mix well and simmer for 1–2 minutes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Smoothies & Bowls</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blend with fruits, curd/milk and honey for a filling breakfast smoothie.
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
                  <strong className="text-foreground">Ingredients:</strong> 100% Moringa Powder
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

            <NutritionTable data={moringaNutrition} />
          </div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            FAQs About Moringa Powder
          </h2>
          <div className="space-y-4 max-w-3xl">
            <FAQItem
              question="Can I take it on an empty stomach?"
              answer="It's generally better to consume moringa with meals or drinks. Listen to your body and adjust accordingly."
            />
            <FAQItem
              question="Will it make my food bitter?"
              answer="Moringa has a natural earthy taste. In small quantities with buttermilk, dal or smoothies, most people find it easy to accept."
            />
            <FAQItem
              question="Is it the same as moringa capsules?"
              answer="DRYGO Moringa Powder is pure dehydrated leaf powder you can mix with real food, not a capsule or tablet."
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

export default MoringaPowderPage;
