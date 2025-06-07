const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const recipeData = {
  bases: [
    { name: "Mediterranean Chickpea", prep: "15m", total: "1h 15m", serves: "2-3" },
    { name: "Quinoa Power", prep: "10m", total: "25m", serves: "2" },
    { name: "Ancient Grain", prep: "5m", total: "45m", serves: "4" },
    { name: "Superfood Kale", prep: "20m", total: "20m", serves: "3-4" }
  ],
  proteins: [
    { name: "with grilled chicken", tags: ["High-Protein"] },
    { name: "with roasted salmon", tags: ["Omega-3"] },
    { name: "with chickpeas", tags: ["Vegan", "Vegetarian"] },
    { name: "with tofu", tags: ["Vegan", "Low-Carb"] }
  ],
  veggies: [
    { items: ["cherry tomatoes", "cucumber", "red onion"], descriptor: "fresh summer vegetables" },
    { items: ["roasted bell peppers", "zucchini", "eggplant"], descriptor: "roasted Mediterranean veggies" },
    { items: ["spinach", "kale", "arugula"], descriptor: "hearty greens" },
    { items: ["beets", "carrots", "radishes"], descriptor: "root vegetables" }
  ],
  dressings: [
    { name: "Lemon-Tahini", ingredients: ["2 tbsp tahini", "1 lemon, juiced", "1 garlic clove", "salt to taste"], tags: ["Creamy"] },
    { name: "Balsamic Vinaigrette", ingredients: ["3 tbsp olive oil", "1 tbsp balsamic vinegar", "1 tsp honey", "1/2 tsp mustard"], tags: ["Tangy"] },
    { name: "Yogurt-Herb", ingredients: ["1/4 cup Greek yogurt", "2 tbsp chopped herbs", "1 tbsp lemon juice"], tags: ["Creamy", "Probiotic"] }
  ],
  toppings: [
    { items: ["feta cheese", "kalamata olives"], descriptor: "Greek-inspired" },
    { items: ["avocado slices", "pumpkin seeds"], descriptor: "California-style" },
    { items: ["goat cheese", "walnuts"], descriptor: "gourmet" },
    { items: ["sun-dried tomatoes", "pine nuts"], descriptor: "Italian-inspired" }
  ]
};

function generateFullRecipe() {
  const base = getRandom(recipeData.bases);
  const protein = getRandom(recipeData.proteins);
  const veggies = getRandom(recipeData.veggies);
  const dressing = getRandom(recipeData.dressings);
  const topping = getRandom(recipeData.toppings);

  // Combine all tags
  const allTags = protein.tags.concat(dressing.tags)
    .filter((value, index, self) => self.indexOf(value) === index);

  // Generate ingredients list
  const ingredients = [
    `2 cups ${base.name.toLowerCase()} base`,
    `1 cup ${protein.name.replace("with ", "")}`,
    ...veggies.items.map(v => `1/2 cup diced ${v}`),
    ...dressing.ingredients,
    ...topping.items.map(t => `1/4 cup ${t}`),
    "Salt and pepper to taste"
  ];

  // Generate instructions
  const instructions = [
    "1. Prepare the base according to package instructions and let cool.",
    `2. In a large bowl, combine the base with ${protein.name.replace("with ", "")} and ${veggies.descriptor}.`,
    `3. In a small bowl, whisk together ${dressing.name.toLowerCase()} dressing ingredients until emulsified.`,
    "4. Pour dressing over salad and toss gently to combine.",
    `5. Top with ${topping.descriptor} toppings: ${topping.items.join(", ")}.`,
    "6. Season with salt and pepper to taste.",
    "7. Serve immediately or refrigerate for up to 3 days."
  ];

  return {
    title: `${base.name} Salad ${protein.name}`,
    subtitle: `with ${veggies.descriptor}`,
    heading: `${base.name} Salad`,
    serves: base.serves,
    prep: base.prep,
    total: base.total,
    tags: allTags,
    ingredients: ingredients,
    instructions: instructions,
    fullRecipe: true
  };
}

module.exports = generateFullRecipe;