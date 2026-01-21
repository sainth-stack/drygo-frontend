import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface AddToCartSectionProps {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  mrp?: number;
  weight: string;
}

const AddToCartSection = ({
  productId,
  productName,
  productImage,
  price,
  mrp,
  weight,
}: AddToCartSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem, toggleCart } = useCart();
  const { toast } = useToast();

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    const userID = localStorage.getItem("UserID");
    console.log(userID);

    if (!userID) {
      toast({
        title: "Login required",
        description: "Please login first to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addItem({
        productId,
        name: productName,
        image: productImage,
        price,
        mrp,
        weight,
        quantity,
      });

      toast({
        title: 'Added to cart',
        description: `${quantity} x ${productName} (${weight}) added to your cart.`,
      });

      toggleCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border border-border rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="rounded-none h-10 w-10"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center font-medium">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleIncrement}
          disabled={quantity >= 10}
          className="rounded-none h-10 w-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button variant="hero" size="lg" onClick={handleAddToCart} className="gap-2">
        <ShoppingCart className="h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
};

export default AddToCartSection;
