import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <Card hover={false} className="border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  );
};

export default FAQItem;
