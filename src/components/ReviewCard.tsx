import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  content: string;
  author: string;
  location: string;
  rating?: number;
}

const ReviewCard = ({ content, author, location, rating = 5 }: ReviewCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        <p className="text-sm text-foreground mb-4 italic">"{content}"</p>
        <p className="text-xs text-muted-foreground">
          — {author}, {location}
        </p>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
