import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import BenefitCard from "@/components/BenefitCard";
import FAQItem from "@/components/FAQItem";
import ReviewCard from "@/components/ReviewCard";
import ProductCard from "@/components/ProductCard";
import NutritionTable from "@/components/NutritionTable";
import AddToCartSection from "@/components/AddToCartSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Trash2, Users, Briefcase, Plane, AlertTriangle, Package } from "lucide-react";

import spinachPowder from "@/assets/spinach-powder.jpg";
import moringaPowder from "@/assets/moringa-powder.jpg";
import carrotPowder from "@/assets/carrot-powder.jpg";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react"
const spinachNutrition = [
  { nutrient: "Energy (kcal)", per100g: "156.56", per5g: "7.83", rda: "0.39" },
  { nutrient: "Fat (g)", per100g: "4.35", per5g: "0.22", rda: "0.32" },
  { nutrient: "Cholesterol (mg)", per100g: "0.00", per5g: "0.00", rda: "-" },
  { nutrient: "Sodium (mg)", per100g: "537.80", per5g: "26.89", rda: "1.34" },
  { nutrient: "Carbohydrates (g)", per100g: "13.95", per5g: "0.70", rda: "0.54" },
  { nutrient: "Fiber (g)", per100g: "16.20", per5g: "0.81", rda: "2.70" },
  { nutrient: "Total Sugars (g)", per100g: "1.63", per5g: "0.08", rda: "-" },
  { nutrient: "Added Sugars (g)", per100g: "0.00", per5g: "0.00", rda: "0.00" },
  { nutrient: "Protein (g)", per100g: "14.56", per5g: "0.73", rda: "1.35" },
  { nutrient: "Vitamin D", per100g: "-", per5g: "0.00", rda: "0.00" },
  { nutrient: "Iron (mg)", per100g: "20.1", per5g: "1.01", rda: "5.29" },
  { nutrient: "Calcium (mg)", per100g: "560.2", per5g: "28.01", rda: "2.80" },
  { nutrient: "Potassium (mg)", per100g: "558", per5g: "27.90", rda: "0.80" },
];

const SpinachPowderPage = () => {
 const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [nutrition, setNutrition] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


   useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/products/${productId}`
        );
        const json = await res.json();
        setProduct(json.data);

        const nutRes = await fetch(
          `http://localhost:4000/api/products/${productId}/nutrition`
        );
        const nutJson = await nutRes.json();
        setNutrition(nutJson.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  console.log(product)
  console.log("nutrition Object",nutrition)


   if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p>Product not found</p>;



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
                  {product.badge ||""}
                </Badge>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                 {product.name ||""}
                </h1>
                <p className="text-lg text-muted-foreground">
                 {product.description ||""}
                </p>

                <div className="flex items-center gap-4">
                  <span className="font-display text-3xl font-bold text-primary">{`₹${product.price}`}</span>
                  <span className="text-sm text-muted-foreground">
                     {product.weight || "150"}g pouch • No preservatives • No added colour
                  </span>
                </div>

                <AddToCartSection
                  productId={product._id || product.id}
                  productName={product.name || "DRYGO Spinach Powder"}
                  productImage={product.image || product.imageUrl || spinachPowder}
                  price={typeof product.price === 'string' ? parseFloat(product.price.replace(/[₹,]/g, '')) : product.price || 249}
                  weight={product.weight || "150g"}
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <Badge variant="gold">Good source of iron</Badge>
                  <Badge variant="gold">Made for Indian kitchens</Badge>
                  <Badge variant="gold">No preservatives</Badge>
                </div>
              </div>

              <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <img
                  src={product.image || spinachPowder}
                  alt={product.name || "Spinach Powder"}
                  className="w-full max-w-lg mx-auto drop-shadow-2xl animate-float"
                />
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Net Wt: {product.weight||"150"}g
                </p>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-leaf/10 rounded-full blur-3xl -z-10" />
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
              Add 2 tablespoons full of spinach powder instead of a cup full of fresh spinach leaves.
            </p>
          </div>
        </Section>

        {/* Benefits Section */}
        <Section id="benefits" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Why Your Kitchen Needs Spinach Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={Zap}
              title="Easy Iron Boost"
              description="Support daily iron intake by adding 1–2 tsp to dough, soups or curries—especially useful for families that skip leafy greens."
            />
            <BenefitCard
              icon={Users}
              title="Perfect for Kids' Tiffins"
              description="Mix into paratha and poori dough to sneak in spinach without changing the taste too much."
            />
            <BenefitCard
              icon={Trash2}
              title="Zero Prep, Zero Wastage"
              description="No washing, chopping or leftover waste. Just a dry spoon from the jar whenever you cook."
            />
          </div>
        </Section>

        {/* How to Use Section */}
        <Section id="how-to-use" background="hero-green">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            How to Use Spinach Powder
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Green Rotis & Parathas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Add 1–2 tsp powder per cup of wheat flour, along with your usual spices. 
                  Knead and cook as you normally do.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Nutritious Smoothies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Blend 1 tsp with banana, curd/milk and honey for a quick breakfast or evening drink.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Dal, Soups & Khichdi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stir 1 tsp into cooked dal, soups or khichdi just before serving. Mix well and adjust salt.
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
                  <strong className="text-foreground">Ingredients:</strong> 100% Spinach powder
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

            <NutritionTable data={nutrition} />
          </div>
        </Section>

        {/* Who It's For Section */}
        <Section id="who-for" background="muted">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            Who Is This Ideal For?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={Users}
              title="Busy Parents"
              description="Make everyday tiffins and dinners more nutritious without adding work for yourself."
            />
            <BenefitCard
              icon={Briefcase}
              title="Health-Conscious Adults"
              description="Add greens to smoothies, soups and salads even when fresh spinach isn't available."
            />
            <BenefitCard
              icon={Plane}
              title="Travellers & Hostels"
              description="Carry a small jar and upgrade canteen meals or hotel food with a spoonful of spinach."
            />
          </div>
        </Section>

        {/* FAQ Section */}
        <Section id="faq">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-3xl">
            <FAQItem
              question="Can I give this to children?"
              answer="Yes, you can use small quantities in rotis, parathas, dal and soups for children. For kids with medical conditions, please consult your doctor."
            />
            <FAQItem
              question="Does it taste like raw spinach?"
              answer="When mixed in dough or cooked food, the flavour is mild. Most kids don't notice it, especially with regular spices."
            />
            <FAQItem
              question="How long does it stay fresh?"
              answer="Shelf life is mentioned on the pack. Once opened, keep it dry and tightly closed for best freshness."
            />
          </div>
        </Section>

        {/* Reviews Section */}
        <Section id="reviews" background="hero-green">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            What DRYGO Families Say
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ReviewCard
              content="My kids said yes to green rotis for the first time. So easy to use."
              author="Priya"
              location="Bengaluru"
            />
            <ReviewCard
              content="I travel a lot for work. Keeping this in my bag means one spoonful of greens even with hotel food."
              author="Anand"
              location="Mumbai"
            />
            <ReviewCard
              content="No chopping, no waste. Just mix with atta and done. Big help on busy weekdays."
              author="Megha"
              location="Hyderabad"
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
              name="Moringa Powder"
              description="Natural multivitamin leaf powder for daily nutrition."
              price="₹249"
              image={moringaPowder}
              link="/products/moringa"
              badge="Superleaf"
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

export default SpinachPowderPage;
