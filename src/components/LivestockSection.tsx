import { useState } from "react";
import { StatCard } from "./StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rabbit, CircleDot } from "lucide-react";

type AnimalType = "all" | "sheep" | "goats" | "rabbits";

const livestockData = {
  sheep: {
    total: { male: 45, female: 67, trend: "up", trendValue: 8 },
    births: { male: 3, female: 5, trend: "up", trendValue: 12 },
    deaths: { male: 1, female: 0, trend: "down", trendValue: 50 },
    mating: { male: 8, female: 12, trend: "stable", trendValue: 0 },
  },
  goats: {
    total: { male: 32, female: 48, trend: "up", trendValue: 5 },
    births: { male: 2, female: 4, trend: "up", trendValue: 20 },
    deaths: { male: 0, female: 1, trend: "down", trendValue: 33 },
    mating: { male: 6, female: 10, trend: "up", trendValue: 10 },
  },
  rabbits: {
    total: { male: 58, female: 89, trend: "up", trendValue: 15 },
    births: { male: 12, female: 15, trend: "up", trendValue: 25 },
    deaths: { male: 2, female: 1, trend: "stable", trendValue: 0 },
    mating: { male: 15, female: 20, trend: "up", trendValue: 18 },
  },
};

const marketReadyData = [
  { animal: "Sheep", count: 12, avgWeight: "45kg", avgAge: "8 months" },
  { animal: "Goats", count: 8, avgWeight: "38kg", avgAge: "7 months" },
  { animal: "Rabbits", count: 25, avgWeight: "2.5kg", avgAge: "4 months" },
];

export const LivestockSection = () => {
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>("all");

  const getAnimalData = () => {
    if (selectedAnimal === "all") return livestockData;
    return { [selectedAnimal]: livestockData[selectedAnimal] };
  };

  const getIcon = (animal: string) => {
    if (animal === "sheep") return <CircleDot className="h-5 w-5" />;
    if (animal === "goats") return <CircleDot className="h-5 w-5" />;
    return <Rabbit className="h-5 w-5" />;
  };

  const data = getAnimalData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Livestock Overview</h2>
        <div className="flex gap-2">
          <Badge
            variant={selectedAnimal === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedAnimal("all")}
          >
            All Animals
          </Badge>
          <Badge
            variant={selectedAnimal === "sheep" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedAnimal("sheep")}
          >
            Sheep
          </Badge>
          <Badge
            variant={selectedAnimal === "goats" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedAnimal("goats")}
          >
            Goats
          </Badge>
          <Badge
            variant={selectedAnimal === "rabbits" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedAnimal("rabbits")}
          >
            Rabbits
          </Badge>
        </div>
      </div>

      {Object.entries(data).map(([animal, stats]) => (
        <div key={animal} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground capitalize flex items-center gap-2">
            {getIcon(animal)}
            {animal}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Population"
              value={stats.total.male + stats.total.female}
              icon={getIcon(animal)}
              trend={stats.total.trend as "up" | "down" | "stable"}
              trendValue={stats.total.trendValue}
              subtitle={`♂ ${stats.total.male} | ♀ ${stats.total.female}`}
            />
            <StatCard
              title="Births This Week"
              value={stats.births.male + stats.births.female}
              icon={getIcon(animal)}
              trend={stats.births.trend as "up" | "down" | "stable"}
              trendValue={stats.births.trendValue}
              subtitle={`♂ ${stats.births.male} | ♀ ${stats.births.female}`}
            />
            <StatCard
              title="Deaths This Week"
              value={stats.deaths.male + stats.deaths.female}
              icon={getIcon(animal)}
              trend={stats.deaths.trend as "up" | "down" | "stable"}
              trendValue={stats.deaths.trendValue}
              subtitle={`♂ ${stats.deaths.male} | ♀ ${stats.deaths.female}`}
            />
            <StatCard
              title="Currently Mating"
              value={stats.mating.male + stats.mating.female}
              icon={getIcon(animal)}
              trend={stats.mating.trend as "up" | "down" | "stable"}
              trendValue={stats.mating.trendValue}
              subtitle={`♂ ${stats.mating.male} | ♀ ${stats.mating.female}`}
            />
          </div>
        </div>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Market Ready Animals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Animal</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Count</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Avg Weight</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Avg Age</th>
                </tr>
              </thead>
              <tbody>
                {marketReadyData.map((item) => (
                  <tr key={item.animal} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{item.animal}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{item.count}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{item.avgWeight}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{item.avgAge}</td>
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
