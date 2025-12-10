import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";
import { useStrapiResources } from "@/hooks/useStrapiResources";

interface Crop {
    id: number;
    documentId: string;
    Crop_Type: string;
    Land_Size?: string;
    Date_Planted: string;
    Date_Of_Expected_Harvest?: string;
    Expected_Yield?: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export const CropsSection = () => {
    const { data: crops = [], isLoading, error } = useStrapiResources<Crop>("crops-in-fields");

    if (isLoading) return <div className="flex justify-center items-center p-8">Loading crops data...</div>;
    if (error) return <div className="text-red-500 p-4">Error loading crops data: {error}</div>;

    console.log("Crops Data:", crops);

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
                    {crops.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            No active crops found.
                        </div>
                    ) : (
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
                                {crops.map((crop) => (
                                    <tr key={crop.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                        <td className="py-3 px-4 text-sm font-medium text-foreground">{crop.Crop_Type}</td>
                                        <td className="py-3 px-4 text-sm text-foreground">{crop.Land_Size || "-"}</td>
                                        <td className="py-3 px-4 text-sm text-foreground">
                                            {new Date(crop.Date_Planted).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-foreground">
                                            {crop.Date_Of_Expected_Harvest ? new Date(crop.Date_Of_Expected_Harvest).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-foreground">{crop.Expected_Yield || "-"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};