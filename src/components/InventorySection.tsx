import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle } from "lucide-react";
import { useStrapiResources } from "@/hooks/useStrapiResources";

interface InventoryItem {
    id: number;
    documentId: string;
    Item_Name: string;
    Current_Stock: string;
    Minimum_Required: string;
    Status_of_Inventory: "Good" | "Low Stock" | "Reorder Now";
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export const InventorySection = () => {
    const { data: inventoryData = [], isLoading, error } = useStrapiResources<InventoryItem>("inventory-stock-lists");

    if (isLoading) return <div className="flex justify-center items-center p-8">Loading inventory data...</div>;
    if (error) return <div className="text-red-500 p-4">Error loading inventory data: {error}</div>;

    console.log("Inventory Data:", inventoryData);

    // Helper function to parse stock numbers
    const parseStock = (stockString: string): number => {
        if (!stockString) return 0;
        const number = parseInt(stockString);
        return isNaN(number) ? 0 : number;
    };

    // Helper to determine status level for styling
    const getStatusLevel = (status: string): "good" | "low" | "critical" => {
        switch (status) {
            case "Good":
                return "good";
            case "Low Stock":
                return "low";
            case "Reorder Now":
                return "critical";
            default:
                return "good";
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Inventory Stock List
            </h2>

            <Card>
                <CardHeader>
                    <CardTitle>Stock Levels</CardTitle>
                </CardHeader>
                <CardContent>
                    {inventoryData.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No inventory data found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Item Name</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Current Stock</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Minimum Required</th>
                                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {inventoryData.map((item) => {
                                    const currentStock = parseStock(item.Current_Stock);
                                    const minimumRequired = parseStock(item.Minimum_Required);
                                    const statusLevel = getStatusLevel(item.Status_of_Inventory);

                                    return (
                                        <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                            <td className="py-3 px-4 text-sm font-medium text-foreground flex items-center gap-2">
                                                {statusLevel === "critical" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                                                {item.Item_Name}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-center text-foreground">{currentStock}</td>
                                            <td className="py-3 px-4 text-sm text-center text-foreground">{minimumRequired}</td>
                                            <td className="py-3 px-4 text-center">
                                                {statusLevel === "good" && (
                                                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                                        {item.Status_of_Inventory}
                                                    </Badge>
                                                )}
                                                {statusLevel === "low" && (
                                                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                                        {item.Status_of_Inventory}
                                                    </Badge>
                                                )}
                                                {statusLevel === "critical" && (
                                                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                                                        {item.Status_of_Inventory}
                                                    </Badge>
                                                )}
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