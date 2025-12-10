import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, User } from "lucide-react";
import { useStrapiResources } from "@/hooks/useStrapiResources";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MedicalHistory {
    id: number;
    documentId: string;
    Animal_Id: string;
    Animal_Type: string;
    Treatment_Date: string;
    Condition_or_Diagnosis: string;
    Treatment_Given?: string;
    Dosage?: string;
    Vet_Name?: string;
    Next_Checkup_Date?: string;
    Status_of_livestock: "Treated" | "Under Observation" | "Critical" | "Recovered";
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export const MedicalHistorySection = () => {
    const { data: medicalData = [], isLoading, error } = useStrapiResources<MedicalHistory>("medical-histories");
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    if (isLoading) return <div className="flex justify-center items-center p-8">Loading medical history...</div>;
    if (error) return <div className="text-red-500 p-4">Error loading medical history: {error}</div>;

    // Sort by treatment date (newest first)
    const sortedData = [...medicalData].sort((a, b) =>
        new Date(b.Treatment_Date).getTime() - new Date(a.Treatment_Date).getTime()
    );

    // Apply filter from summary cards
    const filteredData = filterStatus
        ? sortedData.filter(record => record.Status_of_livestock === filterStatus)
        : sortedData;

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Treated": return "default";
            case "Under Observation": return "secondary";
            case "Critical": return "destructive";
            case "Recovered": return "outline";
            default: return "outline";
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Treated": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Under Observation": return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "Critical": return "bg-red-50 text-red-700 border-red-200";
            case "Recovered": return "bg-green-50 text-green-700 border-green-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const getAnimalIcon = (animalType: string) => {
        const icons: Record<string, string> = {
            sheep: "🐑",
            goat: "🐐",
            goats: "🐐",
            rabbit: "🐇",
            rabbits: "🐇",
            cattle: "🐄",
            cow: "🐄",
            poultry: "🐔",
            chicken: "🐔"
        };
        return icons[animalType.toLowerCase()] || "🐾";
    };

    const statusCounts = {
        Total: sortedData.length,
        Treated: sortedData.filter(r => r.Status_of_livestock === "Treated").length,
        "Under Observation": sortedData.filter(r => r.Status_of_livestock === "Under Observation").length,
        Critical: sortedData.filter(r => r.Status_of_livestock === "Critical").length,
        Recovered: sortedData.filter(r => r.Status_of_livestock === "Recovered").length,
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                Medical History
            </h2>

            {/* Summary Cards as single filter */}
            {sortedData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <Card
                            key={status}
                            className={cn(
                                "cursor-pointer transition-all hover:shadow-md",
                                filterStatus === status || (!filterStatus && status === "Total") ? "ring-2 ring-primary" : ""
                            )}
                            onClick={() => setFilterStatus(status === "Total" ? null : status)}
                        >
                            <CardContent className="p-4 text-center">
                                <div className={cn(
                                    "text-2xl font-bold",
                                    status === "Treated" ? "text-blue-600" :
                                        status === "Under Observation" ? "text-yellow-600" :
                                            status === "Critical" ? "text-red-600" :
                                                status === "Recovered" ? "text-green-600" : "text-foreground"
                                )}>
                                    {count}
                                </div>
                                <div className="text-sm text-muted-foreground">{status}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Medical Records */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {filterStatus ? `${filterStatus} Animals` : "All Animal Medical Records"}
                        {filterStatus && (
                            <Badge variant="secondary" className="ml-2">
                                {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredData.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">
                            {filterStatus
                                ? `No ${filterStatus.toLowerCase()} medical records found.`
                                : "No medical records found."
                            }
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredData.map((record) => (
                                <Card key={record.id} className={cn(
                                    "border-l-4",
                                    record.Status_of_livestock === "Critical" ? "border-l-destructive" :
                                        record.Status_of_livestock === "Under Observation" ? "border-l-warning" :
                                            record.Status_of_livestock === "Recovered" ? "border-l-success" :
                                                "border-l-primary"
                                )}>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getAnimalIcon(record.Animal_Type)}</span>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">
                                                            {record.Animal_Id} - {record.Animal_Type}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {record.Condition_or_Diagnosis}
                                                        </p>
                                                    </div>
                                                </div>

                                                {record.Treatment_Given && (
                                                    <div>
                                                        <p className="text-sm font-medium">Treatment Given:</p>
                                                        <p className="text-sm text-muted-foreground">{record.Treatment_Given}</p>
                                                    </div>
                                                )}

                                                {record.Dosage && (
                                                    <div>
                                                        <p className="text-sm font-medium">Dosage:</p>
                                                        <p className="text-sm text-muted-foreground">{record.Dosage}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-3 text-sm min-w-[200px]">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>Treated: {new Date(record.Treatment_Date).toLocaleDateString()}</span>
                                                </div>

                                                {record.Vet_Name && (
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span>Dr. {record.Vet_Name}</span>
                                                    </div>
                                                )}

                                                {record.Next_Checkup_Date && (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-blue-500" />
                                                        <span className="text-blue-600">
                                                            Next: {new Date(record.Next_Checkup_Date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}

                                                <Badge
                                                    variant={getStatusVariant(record.Status_of_livestock)}
                                                    className={cn("w-fit", getStatusStyles(record.Status_of_livestock))}
                                                >
                                                    {record.Status_of_livestock}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
