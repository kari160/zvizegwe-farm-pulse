import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle } from "lucide-react";

const inventoryData = [
  { item: "Livestock Feed (25kg bags)", current: 45, minimum: 30, status: "good" },
  { item: "Veterinary Medicines", current: 12, minimum: 15, status: "low" },
  { item: "Fertilizer (50kg bags)", current: 8, minimum: 10, status: "low" },
  { item: "Seeds - Maize (kg)", current: 25, minimum: 20, status: "good" },
  { item: "Water Containers", current: 18, minimum: 15, status: "good" },
  { item: "Feeding Troughs", current: 22, minimum: 20, status: "good" },
  { item: "Protective Gear Sets", current: 5, minimum: 8, status: "critical" },
  { item: "Cleaning Supplies", current: 15, minimum: 12, status: "good" },
];

export const InventorySection = () => {
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
                {inventoryData.map((item) => (
                  <tr key={item.item} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-foreground flex items-center gap-2">
                      {item.status === "critical" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      {item.item}
                    </td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{item.current}</td>
                    <td className="py-3 px-4 text-sm text-center text-foreground">{item.minimum}</td>
                    <td className="py-3 px-4 text-center">
                      {item.status === "good" && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          Good
                        </Badge>
                      )}
                      {item.status === "low" && (
                        <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                          Low Stock
                        </Badge>
                      )}
                      {item.status === "critical" && (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                          Reorder Now
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
