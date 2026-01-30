import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersIconProps {
  onClick: () => void;
}

const OrdersIcon = ({ onClick }: OrdersIconProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label="View your orders"
    >
      <ClipboardList className="h-5 w-5" />
    </Button>
  );
};

export default OrdersIcon;
