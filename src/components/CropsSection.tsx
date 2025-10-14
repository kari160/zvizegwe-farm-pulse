import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";

const cropsData = [
  {
    crop: "Maize",
    landSize: "2.5 hectares",
    plantedDate: "2024-09-15",
    expectedHarvest: "2025-01-20",
    expectedYield: "6 tonnes",
  },
  {
    crop: "Tomatoes",
    landSize: "0.8 hectares",
    plantedDate: "2024-10-01",
    expectedHarvest: "2024-12-15",
    expectedYield: "3.2 tonnes",
  },
  {
    crop: "Cabbage",
    landSize: "1.2 hectares",
    plantedDate: "2024-09-20",
    expectedHarvest: "2024-12-01",
    expectedYield: "4.5 tonnes",
  },
  {
    crop: "Spinach",
    landSize: "0.5 hectares",
    plantedDate: "2024-10-10",
    expectedHarvest: "2024-11-25",
    expectedYield: "1.8 tonnes",
  },
];

export const CropsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Sprout className="h-6 w-6 text-primary" />
        Crops in Field
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>Active Crops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Crop Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Land Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Planted</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expected Harvest</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Expected Yield</th>
                </tr>
              </thead>
              <tbody>
                {cropsData.map((crop) => (
                  <tr key={crop.crop} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{crop.crop}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{crop.landSize}</td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {new Date(crop.plantedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {new Date(crop.expectedHarvest).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">{crop.expectedYield}</td>
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
