// recipesdata.js

const mongoose = require('mongoose');
const Recipe = require('./models/recipe'); 

mongoose.connect('mongodb://localhost:27017/simpliciousDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const recipeSchema = [
  // --- BREAKFAST ---
  {
    title: "Fluffy Pancakes",
    imagePath: "Images/pancakes.jpg",
    altText: "Fluffy Pancakes",
    description: "A classic breakfast favorite—light, fluffy pancakes served with maple syrup.",
    pageLink: "fluffypancake.html",
    type: "breakfast"
  },
  {
    title: "Avocado Toast",
    imagePath: "Images/avocado toast.jpg",
    altText: "Avocado Toast",
    description: "Toasted bread topped with creamy avocado and a sprinkle of chili flakes.",
    pageLink: "avocadotoast.html",
    type: "breakfast"
  },
  {
    title: "Veggie Omelette",
    imagePath: "Images/veggies.jpg",
    altText: "Veggie Omelette",
    description: "Egg omelette loaded with fresh veggies, herbs, and cheese.",
    pageLink: "veggieomelette.html",
    type: "breakfast"
  },
  {
    title: "Overnight Oats",
    imagePath: "Images/Oatmeal.png",
    altText: "Oatmeal",
    description: "Warm oatmeal topped with fresh fruits, honey, and cinnamon for extra flavor.",
    pageLink: "overnightoats.html",
    type: "breakfast"
  },
  {
    title: "Foul Medames",
    imagePath: "Images/foul.jpg",
    altText: "Foul Medames",
    description: "Mashed fava beans with garlic, lemon, and olive oil, topped with parsley and warm pita.",
    pageLink: "foulmedames.html",
    type: "breakfast"
  },
  {
    title: "Feteer Meshalt",
    imagePath: "Images/feteer.jpg",
    altText: "Feteer Meshalt",
    description: "Flaky, buttery layered pastry served with honey, cheese, or molasses.",
    pageLink: "feteermeshalt.html",
    type: "breakfast"
  },

  // --- LUNCH ---
  {
    title: "Spaghetti Bolognese",
    imagePath: "Spaghetti.jpg",
    altText: "Spaghetti",
    description: "Classic Italian pasta with rich tomato and meat sauce.",
    pageLink: "SpaghettiBolognese.html",
    type: "lunch"
  },
  {
    title: "Koshari",
    imagePath: "koshari.jpg",
    altText: "Koshari",
    description: "Hearty Egyptian dish made with lentils, rice, pasta, crispy onions, and spicy tomato sauce.",
    pageLink: "koshari.html",
    type: "lunch"
  },
  {
    title: "Cheeseburger",
    imagePath: "burger(recipe).jpg",
    altText: "Cheeseburger",
    description: "Juicy beef patty, melted cheese, and fresh veggies in a toasted bun.",
    pageLink: "Cheeseburger.html",
    type: "lunch"
  },
  {
    title: "Chicken Caesar Salad",
    imagePath: "salad.jpg",
    altText: "Grilled Chicken Salad",
    description: "Crisp romaine lettuce tossed with Caesar dressing, croutons, and parmesan cheese.",
    pageLink: "Chicken Caesar Salad.html",
    type: "lunch"
  },
  {
    title: "Grilled Steak",
    imagePath: "steak.jpg",
    altText: "Grilled Steak",
    description: "Perfectly seared steak seasoned with herbs and garlic butter, served with mashed potatoes.",
    pageLink: "GrilledSteak.html",
    type: "lunch"
  },
  {
    title: "Shawarma Plate",
    imagePath: "shawarma.jpg",
    altText: "Shawarma Plate",
    description: "Thinly sliced marinated meat served with garlic sauce, pickles, and flatbread.",
    pageLink: "ShawarmaPlate.html",
    type: "lunch"
  },

  // --- DINNER ---
  {
    title: "Labneh & Zaatar Sandwich",
    imagePath: "Images/labneh.jpg",
    altText: "Labneh and Zaatar Sandwich",
    description: "Soft flatbread spread with creamy labneh, sprinkled with aromatic zaatar, veggies, and drizzled with olive oil.",
    pageLink: "labnehandzaatar.html",
    type: "dinner"
  },
  {
    title: "Quinoa Salad",
    imagePath: "Images/quinoa.jpg",
    altText: "Quinoa Salad",
    description: "Protein-packed quinoa salad with cucumbers, cherry tomatoes, and lemon vinaigrette.",
    pageLink: "qinoasalad.html",
    type: "dinner"
  },
  {
    title: "Tomato Basil Soup",
    imagePath: "Images/soup.jpg",
    altText: "Tomato Soup",
    description: "Warm and comforting tomato soup with fresh basil and a touch of cream.",
    pageLink: "tomatosoup.html",
    type: "dinner"
  },
  {
    title: "Korean Noodles",
    imagePath: "Images/noodles.jpg",
    altText: "Korean Noodles (Japchae)",
    description: "Stir-fried glass noodles with vegetables, sesame oil, and a sweet-savory sauce. Optional beef, chicken, or tofu.",
    pageLink: "koreannoodles.html",
    type: "dinner"
  },
  {
    title: "Chicken Pane",
    imagePath: "Images/pane.jpg",
    altText: "Chicken Pane Sandwich",
    description: "Crispy breaded chicken fillet in soft bread with lettuce, tomatoes, and creamy sauce.",
    pageLink: "chickenpanne.html",
    type: "dinner"
  },
  {
    title: "Quesadillas",
    imagePath: "Images/quesadilla.jpg",
    altText: "Quesadillas",
    description: "Flour tortillas with melted cheese and fillings, grilled to crispy perfection.",
    pageLink: "quesidilas.html",
    type: "dinner"
  },

  // --- DESSERT ---
  {
    title: "Waffles",
    imagePath: "Images/waffles.jpg",
    altText: "Waffles",
    description: "Crispy on the outside, fluffy on the inside—perfect with syrup, berries, or ice cream.",
    pageLink: "waffles.html",
    type: "dessert"
  },
  {
    title: "Brownies",
    imagePath: "Images/brownies.jpg",
    altText: "Brownies",
    description: "Rich, fudgy, and chocolatey squares of heaven—cakey or gooey, always delicious.",
    pageLink: "brownies.html",
    type: "dessert"
  },
  {
    title: "Tiramisu",
    imagePath: "Images/tiramisu.jpg",
    altText: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked layers, mascarpone, and cocoa dusting.",
    pageLink: "tiramisu.html",
    type: "dessert"
  },
  {
    title: "French Toast",
    imagePath: "Images/frenchtoast.jpg",
    altText: "French Toast",
    description: "Golden, cinnamon-vanilla soaked bread, pan-fried to perfection—topped as you like.",
    pageLink: "frenchtoast.html",
    type: "dessert"
  },

  // --- KETO ---
  {
    title: "Creamy Garlic Parmesan Chicken",
    imagePath: "creamychicken.jpg",
    altText: "Creamy Garlic Parmesan Chicken",
    description: "A rich and savory one-pan dish that's loaded with flavor and healthy fats.",
    pageLink: "creampychicken.html",
    type: "keto"
  },
  {
    title: "Keto Cauliflower Mac & Cheese",
    imagePath: "mac&cheese.jpg",
    altText: "Keto Cauliflower Mac & Cheese",
    description: "A low-carb twist on the classic comfort food.",
    pageLink: "mac&cheese.html",
    type: "keto"
  },
  {
    title: "Avocado Tuna Salad Boats",
    imagePath: "avocadotuna.jpg",
    altText: "Avocado Tuna Salad Boats",
    description: "A refreshing and protein-packed meal that's great for lunch or a light dinner.",
    pageLink: "avocadotuna.html",
    type: "keto"
  },
  {
    title: "Zucchini Lasagna",
    imagePath: "zuchinni2.jpg",
    altText: "Zucchini Lasagna",
    description: "This keto-friendly lasagna uses thin-sliced zucchini in place of noodles, layered with seasoned meat, marinara, and a cheesy ricotta mixture.",
    pageLink: "zuchinnilasagna.html",
    type: "keto"
  },

  // --- COCKTAILS ---
  {
    title: "Sparkling Cucumber Mint",
    imagePath: "../public/Images/sparklingcucumber.jpg",
    altText: "Sparkling Cucumber Mint Cooler",
    description: "Refreshing sparkling water with cucumber slices, mint leaves, and a splash of lemon juice.",
    pageLink: "sparkling.html",
    type: "cocktails"
  },
  {
    title: "Fruity Iced Tea",
    imagePath: "../public/Images/icedtea.jpg",
    altText: "Fruity Iced Tea",
    description: "Black or green tea chilled with peach or berry juice, finished with lemon slices and ice.",
    pageLink: "icedtea.html",
    type: "cocktails"
  },
  {
    title: "Lemonade Refresher",
    imagePath: "../public/Images/lemonade.jpg",
    altText: "Lemonade Refresher",
    description: "Classic lemonade jazzed up with muddled berries and fresh mint for a fruity twist.",
    pageLink: "Lemonade Refresher.html",
    type: "cocktails"
  },
  {
    title: "Passion Fruit Mojito",
    imagePath: "../public/Images/virginmojito.jpg",
    altText: "Virgin Mojito",
    description: "Tropical fruit, tangy lime juice and fresh mint make quite a powerful drink!",
    pageLink: "virginmojito.html",
    type: "cocktails"
  }
];

async function seedDB() {
  try {
    await Recipe.deleteMany({});
   await Recipe.insertMany(recipeSchema);
    console.log("✅ Recipes seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding recipes:", error);
  } finally {
    mongoose.disconnect();
  }
}

seedDB();
