import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStrapiResources } from "@/hooks/useStrapiResources";

interface FinancialSummary {
    id: number;
    documentId: string;
    Category: string;
    Budget: string;
    Actual: string;
    Variance: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

// Helper function to parse currency strings with symbols and commas
const parseCurrency = (currencyString: string): number => {
    if (!currencyString) return 0;

    // Remove currency symbols, commas, and trim whitespace
    const cleaned = currencyString.replace(/[$,]/g, '').trim();

    // Parse as float
    const number = parseFloat(cleaned);

    // Return 0 if parsing fails
    return isNaN(number) ? 0 : number;
};

export const FinancialSection = () => {
    const { data: financialData = [], isLoading, error } = useStrapiResources<FinancialSummary>("financial-summaries");

    if (isLoading) return <div className="flex justify-center items-center p-8">Loading financial data...</div>;
    if (error) return <div className="text-red-500 p-4">Error loading financial data: {error}</div>;

    console.log("Financial Data:", financialData);

    // Calculate totals from the API data with proper currency parsing
    const totals = financialData.reduce((acc, item) => {
        const budget = parseCurrency(item.Budget);
        const actual = parseCurrency(item.Actual);
        const variance = parseCurrency(item.Variance);

        return {
            totalBudget: acc.totalBudget + budget,
            totalActual: acc.totalActual + actual,
            totalVariance: acc.totalVariance + variance
        };
    }, { totalBudget: 0, totalActual: 0, totalVariance: 0 });

    const variancePercent = totals.totalBudget > 0 ? ((totals.totalVariance / totals.totalBudget) * 100).toFixed(1) : "0";
    const isUnderBudget = totals.totalVariance < 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                Financial Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">${totals.totalBudget.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All Categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Actual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">${totals.totalActual.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All Categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Variance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-3xl font-bold flex items-center gap-2", isUnderBudget ? "text-success" : "text-destructive")}>
                            {isUnderBudget ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6" />}
                            ${Math.abs(totals.totalVariance).toLocaleString()}
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
                    {financialData.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No financial data found.
                        </div>
                    ) : (
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
                                {financialData.map((item) => {
                                    const budget = parseCurrency(item.Budget);
                                    const actual = parseCurrency(item.Actual);
                                    const variance = parseCurrency(item.Variance);
                                    const isUnder = variance < 0;

                                    return (
                                        <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm font-medium text-foreground capitalize">
                                                {item.Category?.trim().toLowerCase() || "Uncategorized"}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-right text-foreground">${budget.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm text-right text-foreground">${actual.toLocaleString()}</td>
                                            <td className={cn("py-3 px-4 text-sm text-right font-medium", isUnder ? "text-success" : "text-destructive")}>
                                                {isUnder ? "-" : "+"}${Math.abs(variance).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};