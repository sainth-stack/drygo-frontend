import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NutritionRow {
  nutrient: string;
  per100g: string;
  per5g: string;
  rda: string;
}

interface NutritionTableProps {
  data: NutritionRow[];
  servingsPerPack?: number;
  servingSize?: string;
}

const NutritionTable = ({ data, servingsPerPack = 20, servingSize = "5g" }: NutritionTableProps) => {
  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Nutrition Facts</CardTitle>
        <p className="text-xs text-muted-foreground">
          Servings Per Pack {servingsPerPack} | Serving Size {servingSize}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium"></th>
                <th className="text-right py-2 font-medium">100g</th>
                <th className="text-right py-2 font-medium">{servingSize}</th>
                <th className="text-right py-2 font-medium">% RDA</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-2">{row.nutrient}</td>
                  <td className="text-right py-2">{row.per100g}</td>
                  <td className="text-right py-2">{row.per5g}</td>
                  <td className="text-right py-2">{row.rda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          *The % of Daily value tells you how much a nutrient in a serving of food contributes to a daily diet. 2000 calories a day is used for general nutritional advice.
        </p>
      </CardContent>
    </Card>
  );
};

export default NutritionTable;
