import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const financialData = {
  month: "October 2024",
  budget: 12500,
  actual: 11800,
  categories: [
    { name: "Feed", budget: 4500, actual: 4200 },
    { name: "Veterinary", budget: 2000, actual: 2300 },
    { name: "Labor", budget: 3500, actual: 3500 },
    { name: "Utilities", budget: 1500, actual: 1400 },
    { name: "Maintenance", budget: 1000, actual: 400 },
  ],
};

export const FinancialSection = () => {
  const variance = financialData.actual - financialData.budget;
  const variancePercent = ((variance / financialData.budget) * 100).toFixed(1);
  const isUnderBudget = variance < 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-primary" />
        Financial Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${financialData.budget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{financialData.month}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actual Expenditure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${financialData.actual.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{financialData.month}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-3xl font-bold flex items-center gap-2", isUnderBudget ? "text-success" : "text-destructive")}>
              {isUnderBudget ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
              ${Math.abs(variance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isUnderBudget ? "Under" : "Over"} budget by {Math.abs(Number(variancePercent))}%
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Budget</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actual</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Variance</th>
                </tr>
              </thead>
              <tbody>
                {financialData.categories.map((category) => {
                  const catVariance = category.actual - category.budget;
                  const isUnder = catVariance < 0;
                  return (
                    <tr key={category.name} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{category.name}</td>
                      <td className="py-3 px-4 text-sm text-right text-foreground">${category.budget.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-right text-foreground">${category.actual.toLocaleString()}</td>
                      <td className={cn("py-3 px-4 text-sm text-right font-medium", isUnder ? "text-success" : "text-destructive")}>
                        {isUnder ? "-" : "+"}${Math.abs(catVariance).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
