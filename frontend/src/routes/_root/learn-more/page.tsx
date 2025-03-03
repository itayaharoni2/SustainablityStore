import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { Apple, LeafIcon, Recycle, Waves } from "lucide-react";

const content = [
  {
    icon: Recycle,
    heading: "Reducing Plastic Use",
    paragraph:
      "Plastic pollution is a pervasive environmental problem. Single-use plastics, such as bottles, bags, and straws, often end up in oceans, harming marine life and ecosystems. These plastics do not biodegrade; instead, they break down into microplastics, contaminating our food and water. By making conscious choices, you can significantly reduce your plastic consumption:",
    tips: [
      "Opt for reusable alternatives: Use reusable bags, bottles, and containers.",
      "Choose products with minimal packaging: Select items with recyclable or biodegradable packaging.",
      "Support sustainable brands: Patronize companies that prioritize reducing plastic use and promoting eco-friendly practices.",
    ],
    conclusion:
      "By reducing our reliance on plastic, we can decrease waste, protect wildlife, and improve the health of our planet.",
  },
  {
    icon: LeafIcon,
    heading: "Reducing Energy Consumption",
    paragraph:
      "Energy consumption is a major contributor to greenhouse gas emissions. When energy is produced from fossil fuels like coal, oil, and natural gas, it releases carbon dioxide, accelerating climate change.",
    tips: [
      "Conserve energy: Turn off lights and unplug electronics when not in use.",
      "Invest in efficiency: Use energy-efficient appliances and LED light bulbs.",
      "Consider renewables: Explore renewable energy sources like solar or wind power.",
    ],
    conclusion:
      "Lowering your energy consumption not only reduces your carbon footprint but also saves money and conserves valuable resources.",
  },
  {
    icon: Waves,
    heading: "Saving Water",
    paragraph:
      "Water is a precious resource that is often taken for granted. Overuse and pollution of water resources lead to shortages and impact ecosystems and communities. Climate change exacerbates water scarcity, with some areas experiencing severe droughts.",
    tips: [
      "Fix leaks: Repair leaky faucets and pipes to prevent water waste.",
      "Reduce water usage: Take shorter showers, turn off the tap while brushing teeth, and use water-saving fixtures.",
      "Use water efficiently: Choose water-efficient appliances and consider recycling graywater.",
    ],
    conclusion:
      "By conserving water, you help ensure there is enough for everyone, reduce energy consumption for water heating and treatment, and protect aquatic ecosystems.",
  },
  {
    icon: Apple,
    heading: "Minimizing Food Waste",
    paragraph:
      "Food waste is a significant contributor to greenhouse gas emissions. When food decomposes in landfills, it releases methane, a potent greenhouse gas. Additionally, wasting food means wasting the energy, water, and resources used to produce it.",
    tips: [
      "Plan and shop wisely: Create meal plans and buy only what you need.",
      "Store food properly: Store food correctly to extend its shelf life.",
      "Compost food scraps: Compost food scraps instead of throwing them away.",
    ],
    conclusion:
      "By minimizing food waste, you reduce your environmental impact, conserve resources, and support a more sustainable food system.",
  },
];

export default function LearnMorePage() {
  return (
    <main>
      <section className="bg-muted py-12 md:py-24">
        <MaxWidthWrapper>
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                The Importance of a{" "}
                <span className="text-green-600">Sustainable Lifestyle</span>
              </h1>
              <p className="text-muted-foreground mt-4 max-w-[600px] md:text-lg/relaxed">
                Climate change is a pressing global issue. Human activities are
                causing rising temperatures, sea levels, and extreme weather
                events. Adopting a sustainable lifestyle is essential to combat
                climate change and protect the planet. By making conscious
                choices, individuals can reduce their carbon footprint and
                contribute to a more sustainable future.
              </p>
            </div>
            <img
              src="/learn-more.jpg"
              width="500"
              height="400"
              alt="Sustainable Living"
              className="mx-auto rounded-xl object-cover"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
          </div>
        </MaxWidthWrapper>
      </section>
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Our <span className="text-green-600">Positive</span> Impact
              </h2>
              <p className="text-muted-foreground mt-4 max-w-[700px] md:text-xl/relaxed">
                By choosing our sustainable products, you're making a real
                difference in the fight against climate change. Here's how:
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {content.map((item, idx) => (
                <div
                  key={"c" + idx}
                  className="rounded-lg border p-6 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-8 w-8 text-primary" />
                    <h3 className="text-xl font-bold">{item.heading}</h3>
                  </div>
                  <p className="text-muted-foreground">{item.paragraph}</p>

                  <div>
                    <h4 className="text-xl font-bold">How You Can Help</h4>
                    <ul className="list-disc pl-6 text-muted-foreground">
                      {item.tips.map((tip, index) => (
                        <li key={"t" + idx + index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-muted py-12 md:py-24">
        <MaxWidthWrapper>
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <img
              src="/cycle.jpg"
              width="500"
              height="400"
              alt="Sustainable Living"
              className="mx-auto rounded-xl object-cover"
              style={{ aspectRatio: "500/400", objectFit: "cover" }}
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Every <span className="text-green-600">Choice</span> Matters
              </h1>
              <p className="text-muted-foreground mt-4 max-w-[600px] md:text-xl/relaxed">
                Every small step counts in the fight against climate change. By
                reducing plastic, conserving resources, and minimizing waste, we
                can create a healthier planet. Let’s work together to inspire
                others to join the sustainability movement. Remember, even the
                smallest actions can make a big difference.
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
     
    </main>
  );
}
