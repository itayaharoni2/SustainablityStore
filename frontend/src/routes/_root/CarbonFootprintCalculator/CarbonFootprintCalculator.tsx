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
import { AlertCircle } from "lucide-react";

export default function CarbonFootprintCalculator() {
  const [transportation, setTransportation] = useState({
    vehicleType: "",
    fuelEfficiency: 0,
    milesTraveled: 0,
  });
  const [homeEnergy, setHomeEnergy] = useState({
    electricity: 0,
    gas: 0,
    homeSize: 0,
    people: 1,
  });
  const [diet, setDiet] = useState("");
  const [waste, setWaste] = useState({
    recycling: "",
    wasteProduced: 0,
  });
  const [emissions, setEmissions] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const calculateEmissions = () => {
    // This is a simplified calculation and should be replaced with more accurate formulas
    let totalEmissions = 0;

    // Transportation emissions
    const transportationEmissions =
      (transportation.milesTraveled / transportation.fuelEfficiency) * 19.6; // 19.6 lbs CO2 per gallon of gasoline
    totalEmissions += transportationEmissions;

    // Home energy emissions
    const energyEmissions =
      (homeEnergy.electricity * 0.92 + homeEnergy.gas * 11.7) * 12; // Monthly to yearly, electricity in kWh, gas in therms
    totalEmissions += energyEmissions;

    // Diet emissions (very simplified)
    const dietFactors = { omnivore: 2.5, vegetarian: 1.7, vegan: 1.5 };
    totalEmissions +=
      (dietFactors[diet as keyof typeof dietFactors] || 2.5) *
      365 *
      homeEnergy.people;

    // Waste emissions (very simplified)
    const wasteEmissions =
      waste.wasteProduced * 365 * (waste.recycling === "yes" ? 0.5 : 1);
    totalEmissions += wasteEmissions;

    // Convert to tons
    setEmissions(totalEmissions / 2000);

    // Generate suggestions
    const newSuggestions = [];
    if (transportationEmissions > 5000)
      newSuggestions.push(
        "Consider using public transportation or carpooling to reduce emissions."
      );
    if (energyEmissions > 10000)
      newSuggestions.push(
        "Switch to energy-efficient appliances and consider renewable energy sources."
      );
    if (diet === "omnivore")
      newSuggestions.push(
        "Reducing meat consumption can significantly lower your carbon footprint."
      );
    if (waste.recycling === "no")
      newSuggestions.push("Start recycling to reduce your waste emissions.");
    setSuggestions(newSuggestions);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Carbon Footprint Calculator</CardTitle>
        <CardDescription>
          Calculate your personal or household carbon emissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transportation">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="energy">Home Energy</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
          </TabsList>
          <TabsContent value="transportation">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setTransportation({
                        ...transportation,
                        vehicleType: value,
                      })
                    }
                  >
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="bus">Bus</SelectItem>
                      <SelectItem value="plane">Plane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelEfficiency">Fuel Efficiency (mpg)</Label>
                  <Input
                    id="fuelEfficiency"
                    type="number"
                    placeholder="Enter fuel efficiency"
                    value={transportation.fuelEfficiency || ""}
                    onChange={(e) =>
                      setTransportation({
                        ...transportation,
                        fuelEfficiency: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="milesTraveled">Miles Traveled (per year)</Label>
                <Input
                  id="milesTraveled"
                  type="number"
                  placeholder="Enter miles traveled"
                  value={transportation.milesTraveled || ""}
                  onChange={(e) =>
                    setTransportation({
                      ...transportation,
                      milesTraveled: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="energy">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity">
                    Electricity Usage (kWh/month)
                  </Label>
                  <Input
                    id="electricity"
                    type="number"
                    placeholder="Enter electricity usage"
                    value={homeEnergy.electricity || ""}
                    onChange={(e) =>
                      setHomeEnergy({
                        ...homeEnergy,
                        electricity: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gas">Gas Usage (therms/month)</Label>
                  <Input
                    id="gas"
                    type="number"
                    placeholder="Enter gas usage"
                    value={homeEnergy.gas || ""}
                    onChange={(e) =>
                      setHomeEnergy({
                        ...homeEnergy,
                        gas: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeSize">Home Size (sq ft)</Label>
                  <Input
                    id="homeSize"
                    type="number"
                    placeholder="Enter home size"
                    value={homeEnergy.homeSize || ""}
                    onChange={(e) =>
                      setHomeEnergy({
                        ...homeEnergy,
                        homeSize: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="people">Number of People</Label>
                  <Input
                    id="people"
                    type="number"
                    placeholder="Enter number of people"
                    value={homeEnergy.people || ""}
                    onChange={(e) =>
                      setHomeEnergy({
                        ...homeEnergy,
                        people: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="diet">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diet">Dietary Choice</Label>
                <Select onValueChange={(value) => setDiet(value)}>
                  <SelectTrigger id="diet">
                    <SelectValue placeholder="Select dietary choice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="waste">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recycling">Do you recycle?</Label>
                <Select
                  value={waste.recycling || ""}
                  onValueChange={(value) =>
                    setWaste({ ...waste, recycling: value })
                  }
                >
                  <SelectTrigger id="recycling">
                    <SelectValue placeholder="Select recycling habit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="wasteProduced">Waste Produced (lbs/day)</Label>
                <Input
                  id="wasteProduced"
                  type="number"
                  placeholder="Enter waste produced"
                  value={waste.wasteProduced || ""}
                  onChange={(e) =>
                    setWaste({
                      ...waste,
                      wasteProduced: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-6 space-y-4">
          <Button onClick={calculateEmissions} className="w-full">
            Calculate Emissions
          </Button>
          {emissions > 0 && (
            <div className="p-4 border rounded-md bg-secondary">
              <h3 className="text-lg font-semibold mb-2">
                Your Carbon Footprint
              </h3>
              <p className="text-3xl font-bold mb-4">
                {emissions.toFixed(2)} tons CO2/year
              </p>
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">
                    Suggestions to reduce your footprint:
                  </h4>
                  <ul className="list-disc list-inside space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                        <span>{suggestion}</span>
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
