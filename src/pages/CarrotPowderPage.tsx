import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import BenefitCard from "@/components/BenefitCard";
import ProductCard from "@/components/ProductCard";
import NutritionTable from "@/components/NutritionTable";
import AddToCartSection from "@/components/AddToCartSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, Trash2, Cookie, Milk, AlertTriangle, Package } from "lucide-react";

import spinachPowder from "@/assets/spinach-powder.jpg";
import moringaPowder from "@/assets/moringa-powder.jpg";
import carrotPowder from "@/assets/carrot-powder.jpg";

const carrotNutrition = [
  { nutrient: "Energy (kcal)", per100g: "236.86", per5g: "11.84", rda: "0.59" },
  { nutrient: "Fat (g)", per100g: "2.72", per5g: "0.14", rda: "0.20" },
  { nutrient: "Cholesterol (mg)", per100g: "0.00", per5g: "0.00", rda: "-" },
  { nutrient: "Sodium (mg)", per100g: "398.61", per5g: "19.93", rda: "1.00" },
  { nutrient: "Carbohydrates (g)", per100g: "32.06", per5g: "1.60", rda: "1.23" },
  { nutrient: "Fiber (g)", per100g: "24.15", per5g: "1.21", rda: "4.03" },
  { nutrient: "Total Sugars (g)", per100g: "18.66", per5g: "0.93", rda: "-" },
  { nutrient: "Added Sugars (g)", per100g: "0.00", per5g: "0.00", rda: "0.00" },
  { nutrient: "Protein (g)", per100g: "5.49", per5g: "0.27", rda: "0.51" },
  { nutrient: "Vitamin D", per100g: "-", per5g: "0.00", rda: "0.00" },
  { nutrient: "Iron (mg)", per100g: "3.47", per5g: "0.17", rda: "0.91" },
  { nutrient: "Calcium (mg)", per100g: "202.72", per5g: "10.14", rda: "1.01" },
  { nutrient: "Potassium (mg)", per100g: "199.3", per5g: "9.97", rda: "0.28" },
];

const CarrotPowderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero py-16 md:py-24">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-up">
                <Badge variant="warning" className="text-sm">
                  Kid-Favourite • Vitamin A Support
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  DRYGO Carrot Powder
                </h1>
                <p className="text-lg text-muted-foreground">
                  Carrot Powder can be added in your soups, curries, desserts, smoothies, etc., 
                  to enrich all your meals.
                </p>

                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-primary">₹249</span>
                  <span className="text-sm text-muted-foreground">
                    150g pouch • Just carrots, nothing else
                  </span>
                </div>

                <AddToCartSection
                  productId="79aa0b6a-08b5-4f69-9828-f8902cbe0be7"
                  productName="DRYGO Carrot Powder"
                  productImage={carrotPowder}
                  price={249}
                  weight="150g"
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="gold">High in Fiber</Badge>
                  <Badge variant="gold">Kid-friendly recipes</Badge>
                  <Badge variant="gold">No added sugar</Badge>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <img
                  src={carrotPowder}
                  alt="DRYGO Carrot Powder"
                  className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
                />
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Net Wt: 150g
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-carrot/10 rounded-full blur-3xl -z-10" />
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
              Add 2 tablespoons of carrot powder instead of 1 cup of fresh carrots.
            </p>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section id="benefits" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Why Families Love Carrot Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={Eye}
              title="Easy Vitamin A Boost"
              description="A convenient way to include carrot goodness in daily meals, especially for kids who avoid vegetables."
            />
            <BenefitCard
              icon={Heart}
              title="Sweet & Versatile"
              description="Works in both sweet and savoury dishes—from halwa and kheer to dosas and rotis."
            />
            <BenefitCard
              icon={Trash2}
              title="Zero Mess, No Peeling"
              description="Forget peeling and grating large batches of carrots. Just add a spoonful to your recipe."
            />
          </div>
        </Section>

        {/* How to Use Section */}
        <Section id="how-to-use" background="hero">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            How to Use Carrot Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-carrot" />
                  Instant Carrot Halwa Hack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Roast the powder lightly in ghee, add milk, sugar/jaggery and dry fruits. 
                  Cook till thick and serve warm.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5 text-carrot" />
                  Morning Pancakes & Dosa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Mix 1–2 tsp into dosa or pancake batter for a colourful, tasty breakfast.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Milk className="h-5 w-5 text-carrot" />
                  Carrot Milkshake for Kids
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blend milk, banana, 1 tsp powder and honey. Chill and serve as an evening drink.
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
                  <strong className="text-foreground">Ingredients:</strong> 100% Carrot Powder
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

            <NutritionTable data={carrotNutrition} />
          </div>
        </Section>

        {/* Related Products Section */}
        <Section id="related" background="muted">
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
        <Section id="manufacturer">
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

export default CarrotPowderPage;
