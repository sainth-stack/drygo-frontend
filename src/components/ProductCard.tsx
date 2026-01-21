import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
  link: string;
  badge?: string;
  badgeVariant?: "default" | "gold" | "leaf" | "success" | "warning" | "beetroot" | "banana";
  productId,

}

const ProductCard = ({
  name,
  description,
  price,
  image,
  link,
  badge,
  badgeVariant = "gold",
  productId,
}: ProductCardProps) => {


  const toSlug = (name: string) =>
  name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Card className="overflow-hidden group">
      <div className="relative aspect-square bg-gradient-to-b from-muted/50 to-muted overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <Badge variant={badgeVariant} className="absolute top-4 left-4 font-semibold shadow-md">
            {badge}
          </Badge>
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="font-display text-xl font-semibold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">{price}</span>
          <Button asChild variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Link  to={`/products/${toSlug(name)}/${productId}`}>View Product</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
