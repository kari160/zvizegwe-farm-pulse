// components/LivestockSection.tsx
import { useState } from "react";
import { useStrapiResources } from "@/hooks/useStrapiResources";
import { StatCard } from "./StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SheepIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
    </svg>
);

const GoatsIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12l6 6 6-6" />
    </svg>
);

const RabbitsIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l4 10H8l4-10z" />
        <circle cx="12" cy="16" r="4" />
    </svg>
);

type AnimalType = "all" | "sheep" | "goats" | "rabbits";
type Trend = "Up" | "Down" | "Stable";

interface LivestockStat {
    id: number;
    documentId: string;
    animal: "sheep" | "goats";
    trend?: string;
    trendValue?: number;
    maleAdults?: number | null;
    femaleAdults?: number | null;
    maleWeaners?: number | null;
    femaleWeaners?: number | null;
    maleKids?: number | null;
    femaleKids?: number | null;
    birthMale?: number | null;
    birthFemale?: number | null;
    totalBirths?: number | null;
    purchaseMale?: number | null;
    purchaseFemale?: number | null;
    totalPurchases?: number | null;
    deathMaleAdult?: number | null;
    deathFemaleAdult?: number | null;
    deathMaleWeaner?: number | null;
    deathFemaleWeaner?: number | null;
    deathMaleKids?: number | null;
    deathFemaleKids?: number | null;
    totalDeaths?: number | null;
    Date: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface RabbitStat {
    id: number;
    Tag_Id: string;
    Weekly_Weights: string;
    Total_Rabbits: number;
    Male_Rabbits: number;
    Female_Rabbits: number;
    Kids: number;
    Deaths?: number;
    Births?: number;
    Purchases?: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface MarketReady {
    id: number;
    documentId: string;
    animal: "sheep" | "goats" | "rabbits";
    count: number;
    avgWeight: string;
    avgAge: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

interface RabbitTotals {
    id: number;
    animal: "rabbits";
    total: number;
    males: number;
    females: number;
    kids: number;
    deaths: number;
    births: number;
    purchases: number;
}

export const LivestockSection = () => {
    const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>("all");

    const { data: livestockData = [], isLoading: livestockLoading, error: livestockError } = useStrapiResources<LivestockStat>("livestock-statistics");
    const { data: rabbitData = [], isLoading: rabbitLoading, error: rabbitError } = useStrapiResources<RabbitStat>("rabbits-statistics");
    const { data: marketReadyData = [] } = useStrapiResources<MarketReady>("market-readies");

    if ((livestockLoading && selectedAnimal !== "rabbits") || (rabbitLoading && (selectedAnimal === "rabbits" || selectedAnimal === "all"))) {
        return <div className="flex justify-center items-center p-8">Loading livestock data...</div>;
    }

    if ((livestockError && selectedAnimal !== "rabbits") || (rabbitError && (selectedAnimal === "rabbits" || selectedAnimal === "all"))) {
        return <div className="text-red-500 p-4">Error loading livestock data</div>;
    }

    const safeNumber = (value: number | null | undefined): number => value || 0;

    // Process sheep/goats
    const processedLivestock: LivestockStat[] = Object.values(
        livestockData
            .filter((stat) => stat.Date)
            .reduce<Record<string, LivestockStat>>((acc, stat) => {
                const date = new Date(stat.Date!);
                const existing = acc[stat.animal];
                if (!existing || date > new Date(existing.Date!)) acc[stat.animal] = stat;
                return acc;
            }, {})
    );

    // Aggregate rabbit totals including deaths, births, purchases
    const rabbitTotals: RabbitTotals = rabbitData.reduce<RabbitTotals>(
        (acc, stat) => {
            acc.total += stat.Total_Rabbits;
            acc.males += stat.Male_Rabbits;
            acc.females += stat.Female_Rabbits;
            acc.kids += stat.Kids;
            acc.deaths += safeNumber(stat.Deaths);
            acc.births += safeNumber(stat.Births);
            acc.purchases += safeNumber(stat.Purchases);
            return acc;
        },
        { id: 1, animal: "rabbits", total: 0, males: 0, females: 0, kids: 0, deaths: 0, births: 0, purchases: 0 }
    );

    // Combine for display based on selectedAnimal
    const dataToDisplay: (LivestockStat | RabbitTotals)[] = (() => {
        if (selectedAnimal === "all") return [...processedLivestock, rabbitTotals];
        if (selectedAnimal === "rabbits") return [rabbitTotals];
        return processedLivestock.filter((stat) => stat.animal === selectedAnimal);
    })();

    const getIcon = (animal: string) => {
        if (animal === "sheep") return <SheepIcon />;
        if (animal === "goats") return <GoatsIcon />;
        return <RabbitsIcon />;
    };

    const mapTrend = (trend?: string): Trend => {
        if (!trend) return "Stable";
        const t = trend.toLowerCase();
        if (t === "up") return "Up";
        if (t === "down") return "Down";
        return "Stable";
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Livestock Overview</h2>
                <div className="flex gap-2">
                    {["all", "sheep", "goats", "rabbits"].map((animal) => (
                        <Badge
                            key={animal}
                            variant={selectedAnimal === animal ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedAnimal(animal as AnimalType)}
                        >
                            {animal === "all" ? "All Animals" : animal.charAt(0).toUpperCase() + animal.slice(1)}
                        </Badge>
                    ))}
                </div>
            </div>

            {dataToDisplay.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No livestock data found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {dataToDisplay.map((stat) => {
                        if ("animal" in stat && stat.animal === "rabbits") {
                            const rabbit = stat as RabbitTotals;
                            return (
                                <Card key={rabbit.id} className="hover:shadow-xl transition-shadow border border-gray-200 rounded-xl">
                                    <CardHeader className="border-b border-gray-200">
                                        <CardTitle className="text-xl capitalize flex items-center gap-2">
                                            {getIcon(rabbit.animal)} {rabbit.animal}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-3">
                                        <StatCard
                                            title="Total Population"
                                            value={rabbit.total}
                                            icon={getIcon("rabbits")}
                                            trend="Stable"
                                            trendValue={0}
                                            subtitle={`Males ♂ ${rabbit.males} | Females ♀ ${rabbit.females} | Kids 🐇 ${rabbit.kids}`}
                                        />
                                        <StatCard
                                            title="Total Deaths"
                                            value={rabbit.deaths}
                                            icon={getIcon("rabbits")}
                                            trend="Stable"
                                            trendValue={0}
                                            subtitle={`Deaths from all sources`}
                                        />
                                        <StatCard
                                            title="Total Births"
                                            value={rabbit.births}
                                            icon={getIcon("rabbits")}
                                            trend="Stable"
                                            trendValue={0}
                                            subtitle={`Births from all sources`}
                                        />
                                        <StatCard
                                            title="Total Purchases"
                                            value={rabbit.purchases}
                                            icon={getIcon("rabbits")}
                                            trend="Stable"
                                            trendValue={0}
                                            subtitle={`Purchases from all sources`}
                                        />
                                    </CardContent>
                                </Card>
                            );
                        }

                        const livestock = stat as LivestockStat;
                        const deaths =
                            safeNumber(livestock.deathMaleAdult) +
                            safeNumber(livestock.deathFemaleAdult) +
                            safeNumber(livestock.deathMaleWeaner) +
                            safeNumber(livestock.deathFemaleWeaner) +
                            safeNumber(livestock.deathMaleKids) +
                            safeNumber(livestock.deathFemaleKids);

                        const births = safeNumber(livestock.totalBirths) || (safeNumber(livestock.birthMale) + safeNumber(livestock.birthFemale));
                        const purchases = safeNumber(livestock.totalPurchases) || (safeNumber(livestock.purchaseMale) + safeNumber(livestock.purchaseFemale));

                        const totalPopulation =
                            safeNumber(livestock.maleAdults) +
                            safeNumber(livestock.femaleAdults) +
                            safeNumber(livestock.maleWeaners) +
                            safeNumber(livestock.femaleWeaners) +
                            safeNumber(livestock.maleKids) +
                            safeNumber(livestock.femaleKids);

                        return (
                            <Card key={livestock.id} className="hover:shadow-xl transition-shadow border border-gray-200 rounded-xl">
                                <CardHeader className="border-b border-gray-200">
                                    <CardTitle className="text-xl capitalize flex items-center gap-2">
                                        {getIcon(livestock.animal)}
                                        {livestock.animal}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <StatCard
                                        title="Total Population"
                                        value={totalPopulation}
                                        icon={getIcon(livestock.animal)}
                                        trend={mapTrend(livestock.trend)}
                                        trendValue={livestock.trendValue ?? 0}
                                        subtitle={`Males ♂ ${safeNumber(livestock.maleAdults) + safeNumber(livestock.maleWeaners) + safeNumber(livestock.maleKids)} | Females ♀ ${safeNumber(livestock.femaleAdults) + safeNumber(livestock.femaleWeaners) + safeNumber(livestock.femaleKids)}`}
                                    />
                                    <StatCard
                                        title="Total Deaths"
                                        value={deaths}
                                        icon={getIcon(livestock.animal)}
                                        trend={mapTrend(livestock.trend)}
                                        trendValue={livestock.trendValue ?? 0}
                                        subtitle={`Males ♂ ${safeNumber(livestock.deathMaleAdult) + safeNumber(livestock.deathMaleWeaner) + safeNumber(livestock.deathMaleKids)} | Females ♀ ${safeNumber(livestock.deathFemaleAdult) + safeNumber(livestock.deathFemaleWeaner) + safeNumber(livestock.deathFemaleKids)}`}
                                    />
                                    <StatCard
                                        title="Total Births"
                                        value={births}
                                        icon={getIcon(livestock.animal)}
                                        trend={mapTrend(livestock.trend)}
                                        trendValue={livestock.trendValue ?? 0}
                                        subtitle={`Males ♂ ${safeNumber(livestock.birthMale)} | Females ♀ ${safeNumber(livestock.birthFemale)}`}
                                    />
                                    <StatCard
                                        title="Total Purchases"
                                        value={purchases}
                                        icon={getIcon(livestock.animal)}
                                        trend={mapTrend(livestock.trend)}
                                        trendValue={livestock.trendValue ?? 0}
                                        subtitle={`Males ♂ ${safeNumber(livestock.purchaseMale)} | Females ♀ ${safeNumber(livestock.purchaseFemale)}`}
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
