import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: "Up" | "Down" | "Stable";
    trendValue?: number;
    subtitle?: string;
}

export const StatCard = ({
                             title,
                             value,
                             icon,
                             trend,
                             trendValue,
                             subtitle,
                         }: StatCardProps) => {
    const getTrendIcon = () => {
        switch (trend) {
            case "Up":
                return <TrendingUp className="h-4 w-4" />;
            case "Down":
                return <TrendingDown className="h-4 w-4" />;
            case "Stable":
                return <Minus className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case "Up":
                return "text-green-600";
            case "Down":
                return "text-red-600";
            case "Stable":
                return "text-gray-500";
            default:
                return "";
        }
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="text-primary">{icon}</div>
            </CardHeader>

            <CardContent>
                <div className="flex items-baseline justify-between">
                    <div className="text-3xl font-bold text-foreground">{value}</div>
                    {trend && typeof trendValue === "number" && (
                        <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor())}>
                            {getTrendIcon()}
                            <span>{trendValue}%</span>
                        </div>
                    )}
                </div>

                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
            </CardContent>
        </Card>
    );
};
