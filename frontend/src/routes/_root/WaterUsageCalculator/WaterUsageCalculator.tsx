import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, Droplet } from "lucide-react";

export default function WaterUsageCalculator() {
  const [dailyUsage, setDailyUsage] = useState({
    showerTime: 5,
    bathFrequency: 0,
    dishwashingMethod: "dishwasher",
    toiletFlushes: 5,
  });
  const [outdoorUse, setOutdoorUse] = useState({
    lawnWateringFrequency: 0,
    poolMaintenance: false,
  });
  const [diet, setDiet] = useState("mixed");
  const [waterConsumption, setWaterConsumption] = useState(0);
  const [tips, setTips] = useState<string[]>([]);

  const calculateWaterUsage = () => {
    let totalWaterUsage = 0;

    // Daily usage calculations
    totalWaterUsage += dailyUsage.showerTime * 2.1 * 7; // 2.1 gallons per minute, 7 days a week
    totalWaterUsage += dailyUsage.bathFrequency * 36 * 7; // 36 gallons per bath, 7 days a week
    totalWaterUsage +=
      dailyUsage.dishwashingMethod === "dishwasher" ? 4 * 7 : 27 * 7; // 4 gallons per load (dishwasher) or 27 gallons (hand washing), 7 days a week
    totalWaterUsage += dailyUsage.toiletFlushes * 1.6 * 7; // 1.6 gallons per flush, 7 days a week

    // Outdoor use calculations
    totalWaterUsage += outdoorUse.lawnWateringFrequency * 300; // 300 gallons per watering session
    if (outdoorUse.poolMaintenance) {
      totalWaterUsage += 300; // Assuming 300 gallons per week for pool maintenance
    }

    // Diet impact (simplified calculation)
    const dietFactor = {
      vegan: 0.8,
      vegetarian: 1,
      mixed: 1.2,
      meatHeavy: 1.5,
    };
    totalWaterUsage *= dietFactor[diet as keyof typeof dietFactor];

    setWaterConsumption(Math.round(totalWaterUsage));

    // Generate water conservation tips
    const newTips = [];
    if (dailyUsage.showerTime > 5)
      newTips.push("Reduce shower time to 5 minutes or less.");
    if (dailyUsage.bathFrequency > 1)
      newTips.push("Consider taking showers instead of baths to save water.");
    if (dailyUsage.dishwashingMethod === "handWash")
      newTips.push("Use a dishwasher instead of hand washing to save water.");
    if (dailyUsage.toiletFlushes > 5)
      newTips.push("Install a dual-flush toilet to reduce water usage.");
    if (outdoorUse.lawnWateringFrequency > 1)
      newTips.push(
        "Reduce lawn watering frequency or consider drought-resistant landscaping."
      );
    if (outdoorUse.poolMaintenance)
      newTips.push("Use a pool cover to reduce water evaporation.");
    if (diet === "meatHeavy")
      newTips.push(
        "Consider reducing meat consumption to lower your water footprint."
      );
    setTips(newTips);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Water Usage Calculator</CardTitle>
        <CardDescription>
          Estimate your personal water consumption based on daily activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Usage</TabsTrigger>
            <TabsTrigger value="outdoor">Outdoor Use</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="showerTime">Shower Time (minutes)</Label>
                <Slider
                  id="showerTime"
                  min={1}
                  max={30}
                  step={1}
                  value={[dailyUsage.showerTime]}
                  onValueChange={(value) =>
                    setDailyUsage({ ...dailyUsage, showerTime: value[0] })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {dailyUsage.showerTime} minutes
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathFrequency">Bath Frequency (per week)</Label>
                <Input
                  id="bathFrequency"
                  type="number"
                  placeholder="Baths per week"
                  value={dailyUsage.bathFrequency || ""}
                  onChange={(e) =>
                    setDailyUsage({
                      ...dailyUsage,
                      bathFrequency: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dishwashingMethod">Dishwashing Method</Label>
                <Select
                  value={dailyUsage.dishwashingMethod}
                  onValueChange={(value) =>
                    setDailyUsage({ ...dailyUsage, dishwashingMethod: value })
                  }
                >
                  <SelectTrigger id="dishwashingMethod">
                    <SelectValue placeholder="Select dishwashing method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dishwasher">Dishwasher</SelectItem>
                    <SelectItem value="handWash">Hand Wash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toiletFlushes">Toilet Flushes (per day)</Label>
                <Input
                  id="toiletFlushes"
                  type="number"
                  placeholder="Flushes per day"
                  value={dailyUsage.toiletFlushes || ""}
                  onChange={(e) =>
                    setDailyUsage({
                      ...dailyUsage,
                      toiletFlushes: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="outdoor">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lawnWateringFrequency">
                  Lawn Watering Frequency (per week)
                </Label>
                <Input
                  id="lawnWateringFrequency"
                  type="number"
                  placeholder="Times per week"
                  value={outdoorUse.lawnWateringFrequency || ""}
                  onChange={(e) =>
                    setOutdoorUse({
                      ...outdoorUse,
                      lawnWateringFrequency: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="poolMaintenance"
                  checked={outdoorUse.poolMaintenance}
                  onChange={(e) =>
                    setOutdoorUse({
                      ...outdoorUse,
                      poolMaintenance: e.target.checked,
                    })
                  }
                  className="form-checkbox h-5 w-5 text-primary"
                />
                <Label htmlFor="poolMaintenance">Pool Maintenance</Label>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="diet">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diet">Dietary Choice</Label>
                <Select value={diet} onValueChange={setDiet}>
                  <SelectTrigger id="diet">
                    <SelectValue placeholder="Select dietary choice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="mixed">Mixed Diet</SelectItem>
                    <SelectItem value="meatHeavy">Meat Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 space-y-4">
          <Button onClick={calculateWaterUsage} className="w-full">
            Calculate Water Usage
          </Button>
          {waterConsumption > 0 && (
            <div className="p-4 border rounded-md bg-secondary">
              <h3 className="text-lg font-semibold mb-2">
                Your Water Consumption
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <Droplet className="h-6 w-6 text-primary" />
                <p className="text-3xl font-bold">
                  {waterConsumption.toLocaleString()} gallons/week
                </p>
              </div>
              {tips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Water Conservation Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
