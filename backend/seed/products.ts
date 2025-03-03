import { db } from "../src/lib/db";
import { absoluteServerUrl } from "../src/lib/utils";

enum CategoryEnum {
  REDUCING_PLASTIC_USE = "Reducing Plastic Use",
  REDUCING_ENERGY_CONSUMPTION = "Reducing Energy Consumption",
  SAVE_WATER = "Save Water",
  MINIMALIZING_FOOD_WASTE = "Minimalizing Food Waste",
}

async function main() {
  const products = [
    // 1. Reducing plastic use
    {
      name: "Reusable Snack Bag",
      description:
        "Eco-friendly alternative to disposable plastic bags for snacks.",
      price: 12.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "reusable-snack-bag.jpg",
    },
    {
      name: "Bamboo Utensil Set",
      description:
        "Portable set of bamboo utensils to replace single-use plastic cutlery.",
      price: 15.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "bamboo-utensil-set.jpg",
    },
    {
      name: "Stainless Steel Water Bottle",
      description:
        "Durable and reusable water bottle to reduce plastic bottle waste.",
      price: 24.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "stainless-steel-water-bottle.jpg",
    },
    {
      name: "Bamboo Hairbrush",
      description: "Eco-friendly hairbrush made from sustainable bamboo.",
      price: 9.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "bamboo-hairbrush.jpeg",
    },
    {
      name: "Reusable Shopping Bag",
      description:
        "Sturdy, foldable bag for grocery shopping to replace plastic bags.",
      price: 7.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "reusable-shopping-bag.jpg",
    },
    {
      name: "Glass Straw Set with Cleaner",
      description: "Set of reusable glass straws with cleaning brush.",
      price: 14.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "glass-straw-set-with-cleaner.jpg",
    },
    {
      name: "Silicone Food Storage Bags",
      description:
        "Reusable silicone bags for food storage, replacing zip-lock bags.",
      price: 19.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "silicone-food-storage-bags.jpeg",
    },
    {
      name: "Beeswax Food Wraps",
      description:
        "Natural, reusable alternative to plastic wrap for food storage.",
      price: 16.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "beeswax-food-wraps.jpg",
    },
    {
      name: "Bamboo Toothbrush Set",
      description: "Pack of eco-friendly bamboo toothbrushes.",
      price: 11.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "bamboo-toothbrush-set.jpg",
    },
    {
      name: "Reusable Produce Bags",
      description:
        "Set of mesh bags for grocery shopping, replacing single-use plastic produce bags.",
      price: 13.99,
      category: CategoryEnum["REDUCING_PLASTIC_USE"],
      imageUrl: "reusable-produce-bags.jpg",
    },

    // 2. Reducing energy consumption
    {
      name: "LED Light Bulb Pack",
      description:
        "Energy-efficient LED bulbs to replace traditional incandescent bulbs.",
      price: 19.99,
      category: CategoryEnum["REDUCING_ENERGY_CONSUMPTION"],
      imageUrl: "led-light-bulb-pack.jpg",
    },
    {
      name: "Smart Light Switch",
      description: "Wi-Fi enabled switch to control lights and save energy.",
      price: 34.99,
      category: CategoryEnum["REDUCING_ENERGY_CONSUMPTION"],
      imageUrl: "smart-light-switch.jpg",
    },
    {
      name: "Energy-Efficient Clothes Dryer",
      description: "High-efficiency clothes dryer that uses less energy.",
      price: 599.99,
      category: CategoryEnum["REDUCING_ENERGY_CONSUMPTION"],
      imageUrl: "energy-efficient-clothes-dryer.jpg",
    },
    {
      name: "Smart Thermostat",
      description:
        "Programmable thermostat to optimize home heating and cooling.",
      price: 149.99,
      category: CategoryEnum["REDUCING_ENERGY_CONSUMPTION"],
      imageUrl: "smart-thermostat.jpg",
    },
    {
      name: "Solar Panel Kit",
      description: "DIY solar panel kit for home energy production.",
      price: 799.99,
      category: CategoryEnum["REDUCING_ENERGY_CONSUMPTION"],
      imageUrl: "solar-panel-kit.jpg",
    },

    // 3. Save water
    {
      name: "Low-Flow Shower Head",
      description:
        "Water-saving shower head that maintains pressure while reducing water usage.",
      price: 29.99,
      category: CategoryEnum["SAVE_WATER"],
      imageUrl: "low-flow-shower-head.jpg",
    },
    {
      name: "Water-Efficient Faucet Aerator",
      description:
        "Easy-to-install aerator that reduces water flow in sink faucets.",
      price: 7.99,
      category: CategoryEnum["SAVE_WATER"],
      imageUrl: "water-efficient-faucet-aerator.jpg",
    },
    {
      name: "Multi-Function Garden Hose Nozzle",
      description: "Adjustable nozzle for efficient garden watering.",
      price: 14.99,
      category: CategoryEnum["SAVE_WATER"],
      imageUrl: "multi-function-garden-hose-nozzle.jpg",
    },
    {
      name: "Drip Irrigation System",
      description: "Water-saving irrigation system for gardens and plants.",
      price: 49.99,
      category: CategoryEnum["SAVE_WATER"],
      imageUrl: "drip-irrigation-system.jpeg",
    },
    {
      name: "Shower Timer",
      description:
        "Simple timer to help reduce shower duration and save water.",
      price: 9.99,
      category: CategoryEnum["SAVE_WATER"],
      imageUrl: "shower-timer.jpeg",
    },

    // 4. Minimizing food waste
    {
      name: "Potato and Onion Preserving Bags",
      description:
        "Specialized bags to extend the shelf life of potatoes and onions.",
      price: 11.99,
      category: CategoryEnum["MINIMALIZING_FOOD_WASTE"],
      imageUrl: "potato-and-onion-preserving-bags.jpeg",
    },
    {
      name: "Cheese Storage Paper",
      description:
        "Breathable paper for proper cheese storage to reduce waste.",
      price: 8.99,
      category: CategoryEnum["MINIMALIZING_FOOD_WASTE"],
      imageUrl: "cheese-storage-paper.jpeg",
    },
    {
      name: "Food Vacuum Sealer",
      description: "Machine to vacuum seal food for extended freshness.",
      price: 79.99,
      category: CategoryEnum["MINIMALIZING_FOOD_WASTE"],
      imageUrl: "food-vacuum-sealer.jpeg",
    },
    {
      name: "Reusable Bag Clips Set",
      description: "Set of clips to seal open bags and keep food fresh.",
      price: 9.99,
      category: CategoryEnum["MINIMALIZING_FOOD_WASTE"],
      imageUrl: "reusable-bag-clips-set.jpg",
    },
    {
      name: "Bamboo Bread Box",
      description: "Natural bamboo box to keep bread fresh and reduce waste.",
      price: 34.99,
      category: CategoryEnum["MINIMALIZING_FOOD_WASTE"],
      imageUrl: "bamboo-bread-box.jpeg",
    },
    {
      name: "Countertop Compost Bin",
      description: "Stylish bamboo compost bin for kitchen scraps.",
      price: 24.99,
      category: CategoryEnum["MINIMALIZING_FOOD_WASTE"],
      imageUrl: "countertop-compost-bin.jpeg",
    },
  ];

  for (const product of products) {
    await db.product.create({
      data: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
