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
  title: 'Fluffy Pancakes',
  category: 'breakfast',
  image: 'pancakes.jpg',
   type: "breakfast",
  ingredients: [
    '1 ½ cups all-purpose flour',
    '3 ½ tsp baking powder',
    '1 tbsp sugar',
    '¼ tsp salt',
    '1 ¼ cups milk',
    '1 egg',
    '3 tbsp melted butter',
    '1 tsp vanilla extract'
  ],
  instructions: [
    'In a bowl, mix flour, baking powder, sugar, and salt.',
    'In another bowl, whisk together milk, egg, melted butter, and vanilla.',
    'Pour wet ingredients into dry and mix until just combined.',
    'Heat a non-stick pan over medium heat.',
    'Pour ¼ cup of batter per pancake and cook until bubbles form.',
    'Flip and cook until golden brown on both sides.',
    'Serve with maple syrup or fruit.'
  ]
},

{
  title: "Avocado Toast",
  imagePath: "Images/avocado toast.jpg",
  altText: "Avocado Toast",
  description: "Toasted bread topped with creamy avocado and a sprinkle of chili flakes.",
  pageLink: "avocadotoast.html",
  type: "breakfast",
  ingredients: [
    "2 slices of whole grain or sourdough bread",
    "1 ripe avocado",
    "½ lemon (for juice)",
    "Salt to taste",
    "Black pepper to taste",
    "Chili flakes (optional)",
    "Olive oil (optional)",
    "Toppings like cherry tomatoes, poached egg, or microgreens (optional)"
  ],
  instructions: [
    "Toast the slices of bread to your preferred level of crispiness.",
    "Cut the avocado in half, remove the seed, and scoop the flesh into a bowl.",
    "Mash the avocado with a fork until smooth but slightly chunky.",
    "Add lemon juice, salt, and pepper to the mashed avocado and mix well.",
    "Spread the avocado mixture evenly on the toasted bread.",
    "Drizzle with a little olive oil if desired.",
    "Top with chili flakes and any additional toppings you like.",
    "Serve immediately while the toast is still warm and crisp."
  ]
},

 {
  title: "Veggie Omelette",
  imagePath: "Images/veggies.jpg",
  altText: "Veggie Omelette",
  description: "Egg omelette loaded with fresh veggies, herbs, and cheese.",
  pageLink: "veggieomelette.html",
  type: "breakfast",
  ingredients: [
    "3 large eggs",
    "¼ cup chopped onions",
    "¼ cup chopped bell peppers (red, green, or yellow)",
    "¼ cup chopped tomatoes",
    "¼ cup chopped spinach or kale",
    "¼ cup shredded cheese (cheddar, mozzarella, or feta)",
    "Salt and pepper to taste",
    "1 tbsp milk (optional, for fluffiness)",
    "1 tbsp olive oil or butter"
  ],
  instructions: [
    "Crack the eggs into a bowl, add milk (if using), salt, and pepper, and whisk until well combined.",
    "Heat oil or butter in a non-stick skillet over medium heat.",
    "Add onions and bell peppers, and sauté for 2–3 minutes until slightly softened.",
    "Add tomatoes and spinach and cook for another 1–2 minutes.",
    "Pour the egg mixture evenly over the vegetables in the pan.",
    "Sprinkle shredded cheese over the eggs while they begin to set.",
    "Cook for 2–3 minutes, then gently fold one side of the omelette over the other.",
    "Cook for another 1–2 minutes, until fully set and cheese is melted.",
    "Slide the omelette onto a plate and serve hot."
  ]
},
{
  title: "Overnight Oats",
  imagePath: "Images/Oatmeal.png",
  altText: "Oatmeal",
  description: "Warm oatmeal topped with fresh fruits, honey, and cinnamon for extra flavor.",
  pageLink: "overnightoats.html",
  type: "breakfast",
  ingredients: [
    "½ cup rolled oats",
    "½ cup milk (or any plant-based milk)",
    "¼ cup Greek yogurt (optional for creaminess)",
    "1 tbsp chia seeds (optional for texture and nutrition)",
    "1 tsp honey or maple syrup",
    "¼ tsp ground cinnamon",
    "Fresh fruits (e.g., berries, banana slices, or apple chunks)",
    "Nuts or seeds (optional for topping)"
  ],
  instructions: [
    "In a jar or bowl, combine oats, milk, yogurt, chia seeds, honey, and cinnamon.",
    "Mix everything well, ensuring oats are fully submerged.",
    "Cover the container with a lid or plastic wrap and refrigerate overnight (or at least 6 hours).",
    "In the morning, stir the oats and check consistency. Add a splash of milk if it's too thick.",
    "Top with fresh fruits, nuts, or seeds of your choice.",
    "Serve chilled or microwave for 30–60 seconds for a warm version."
  ]
},

  {
  title: "Foul Medames",
  imagePath: "Images/foul.jpg",
  altText: "Foul Medames",
  description: "Mashed fava beans with garlic, lemon, and olive oil, topped with parsley and warm pita.",
  pageLink: "foulmedames.html",
  type: "breakfast",
  ingredients: [
    "2 cups canned or cooked fava beans",
    "2 cloves garlic, minced",
    "2 tbsp lemon juice",
    "3 tbsp olive oil (plus more for garnish)",
    "Salt to taste",
    "1 tsp cumin (optional)",
    "Chopped parsley for garnish",
    "Diced tomatoes or onions (optional toppings)",
    "Warm pita bread, for serving"
  ],
  instructions: [
    "Heat the fava beans in a saucepan over medium heat until warm.",
    "Using a fork or potato masher, mash the beans slightly while keeping some texture.",
    "Stir in minced garlic, lemon juice, olive oil, salt, and cumin if using.",
    "Simmer for a few minutes to allow flavors to blend.",
    "Transfer to a serving dish and drizzle with extra olive oil.",
    "Top with chopped parsley and optional diced tomatoes or onions.",
    "Serve hot with warm pita bread."
  ]
},
{
  title: "Feteer Meshalt",
  imagePath: "Images/feteer.jpg",
  altText: "Feteer Meshalt",
  description: "Flaky, buttery layered pastry served with honey, cheese, or molasses.",
  pageLink: "feteermeshalt.html",
  type: "breakfast",
  ingredients: [
    "3 cups all-purpose flour",
    "1 tbsp sugar",
    "½ tsp salt",
    "1 ¼ cups warm water (as needed)",
    "½ cup butter or ghee (melted)",
    "Extra butter or ghee for brushing",
    "Honey, molasses, or soft cheese for serving"
  ],
  instructions: [
    "In a large bowl, mix flour, sugar, and salt.",
    "Gradually add warm water while kneading to form a soft, smooth dough.",
    "Cover the dough and let it rest for 30 minutes.",
    "Divide the dough into 4–6 balls. Brush each with melted butter.",
    "Roll out one ball into a very thin sheet on a greased surface.",
    "Brush with more butter, fold the sides inward to form a square or circle.",
    "Repeat layering with remaining balls if desired for more layers.",
    "Place on a greased baking tray and brush the top with butter.",
    "Bake in a preheated oven at 200°C (400°F) for 20–25 minutes until golden brown.",
    "Serve warm with honey, molasses, or cheese."
  ]
},

  // --- LUNCH ---
  {
  title: "Spaghetti Bolognese",
  imagePath: "Spaghetti.jpg",
  altText: "Spaghetti",
  description: "Classic Italian pasta with rich tomato and meat sauce.",
  pageLink: "SpaghettiBolognese.html",
  type: "lunch",
  ingredients: [
    "400g spaghetti",
    "2 tbsp olive oil",
    "1 onion, chopped",
    "2 garlic cloves, minced",
    "500g ground beef",
    "400g can chopped tomatoes",
    "2 tbsp tomato paste",
    "1 tsp dried oregano",
    "Salt and pepper to taste",
    "Fresh basil for garnish",
    "Grated parmesan cheese (optional)"
  ],
  instructions: [
    "Cook spaghetti according to package instructions. Drain and set aside.",
    "Heat olive oil in a pan. Add chopped onion and sauté until translucent.",
    "Add garlic and cook for another minute.",
    "Add ground beef and cook until browned.",
    "Stir in chopped tomatoes, tomato paste, and oregano.",
    "Simmer on low heat for 20 minutes. Season with salt and pepper.",
    "Serve sauce over spaghetti and garnish with basil and parmesan."
  ]
},
  {
  title: "Koshari",
  imagePath: "koshari.jpg",
  altText: "Koshari",
  description: "Hearty Egyptian dish made with lentils, rice, pasta, crispy onions, and spicy tomato sauce.",
  pageLink: "koshari.html",
  type: "lunch",
  ingredients: [
    "1 cup rice",
    "1 cup brown lentils",
    "1 cup small pasta (elbow or ditalini)",
    "2 cups chickpeas (cooked)",
    "3 onions, thinly sliced",
    "2 tbsp vegetable oil",
    "Salt to taste",
    "For tomato sauce:",
    "2 garlic cloves, minced",
    "1 can tomato sauce",
    "1 tsp vinegar",
    "1 tsp cumin",
    "Red chili flakes (optional)"
  ],
  instructions: [
    "Cook lentils in water until tender. Drain and set aside.",
    "Cook rice separately and season with salt.",
    "Boil pasta until al dente and drain.",
    "Fry onions in oil until golden brown and crispy. Drain on paper towels.",
    "To make the tomato sauce, sauté garlic in oil, add tomato sauce, vinegar, cumin, and chili. Simmer for 10 mins.",
    "Assemble by layering lentils, rice, pasta, chickpeas, sauce, and fried onions."
  ]
},
  {
  title: "Cheeseburger",
  imagePath: "burger(recipe).jpg",
  altText: "Cheeseburger",
  description: "Juicy beef patty, melted cheese, and fresh veggies in a toasted bun.",
  pageLink: "Cheeseburger.html",
  type: "lunch",
  ingredients: [
    "500g ground beef",
    "Salt and pepper to taste",
    "4 slices cheddar cheese",
    "4 burger buns",
    "Lettuce leaves",
    "Tomato slices",
    "Pickles",
    "Ketchup, mustard, mayo (optional)"
  ],
  instructions: [
    "Season ground beef with salt and pepper, form into 4 patties.",
    "Grill or pan-fry patties over medium heat for 4–5 minutes per side.",
    "Add cheese slice on top of each patty and let it melt.",
    "Toast buns on the grill or pan.",
    "Assemble burgers with lettuce, tomato, pickles, and sauces of your choice."
  ]
},
{
  title: "Chicken Caesar Salad",
  imagePath: "salad.jpg",
  altText: "Grilled Chicken Salad",
  description: "Crisp romaine lettuce tossed with Caesar dressing, croutons, and parmesan cheese.",
  pageLink: "Chicken Caesar Salad.html",
  type: "lunch",
  ingredients: [
    "2 chicken breasts",
    "Salt and pepper to taste",
    "1 head romaine lettuce, chopped",
    "1/4 cup grated parmesan cheese",
    "1 cup croutons",
    "Caesar dressing"
  ],
  instructions: [
    "Season chicken breasts with salt and pepper and grill until cooked through. Slice.",
    "Toss lettuce with Caesar dressing in a large bowl.",
    "Top with grilled chicken, parmesan, and croutons.",
    "Serve immediately."
  ]
},
  {
  title: "Grilled Steak",
  imagePath: "steak.jpg",
  altText: "Grilled Steak",
  description: "Perfectly seared steak seasoned with herbs and garlic butter, served with mashed potatoes.",
  pageLink: "GrilledSteak.html",
  type: "lunch",
  ingredients: [
    "2 ribeye steaks",
    "Salt and pepper",
    "2 tbsp olive oil",
    "2 tbsp butter",
    "2 garlic cloves, smashed",
    "Fresh rosemary or thyme"
  ],
  instructions: [
    "Season steaks generously with salt and pepper.",
    "Heat oil in a skillet over high heat.",
    "Sear steaks for 3–4 minutes per side for medium-rare.",
    "Add butter, garlic, and herbs and baste steaks for 1 minute.",
    "Let rest for 5 minutes before serving."
  ]
},
  {
  title: "Shawarma Plate",
  imagePath: "shawarma.jpg",
  altText: "Shawarma Plate",
  description: "Thinly sliced marinated meat served with garlic sauce, pickles, and flatbread.",
  pageLink: "ShawarmaPlate.html",
  type: "lunch",
  ingredients: [
    "500g boneless chicken thighs or beef",
    "2 tbsp yogurt",
    "2 tbsp vinegar",
    "2 tbsp olive oil",
    "1 tsp paprika",
    "1 tsp cumin",
    "1 tsp coriander",
    "1/2 tsp cinnamon",
    "Salt and pepper",
    "Garlic sauce, pickles, pita bread"
  ],
  instructions: [
    "Marinate meat with yogurt, vinegar, oil, spices, salt, and pepper for at least 2 hours.",
    "Grill or cook in a skillet until fully cooked.",
    "Slice meat thinly and serve with garlic sauce, pickles, and warm pita."
  ]
},
// --- DINNER ---
{
  title: "Labneh & Zaatar Sandwich",
  imagePath: "Images/labneh.jpg",
  altText: "Labneh and Zaatar Sandwich",
  description: "Soft flatbread spread with creamy labneh, sprinkled with aromatic zaatar, veggies, and drizzled with olive oil.",
  pageLink: "labnehandzaatar.html",
  type: "dinner",
  ingredients: [
    "2 flatbreads or pita",
    "1/2 cup labneh",
    "2 tbsp zaatar",
    "1 tbsp olive oil",
    "Sliced cucumbers",
    "Sliced tomatoes",
    "Fresh mint leaves",
    "Salt to taste"
  ],
  instructions: [
    "Warm the flatbread lightly in a pan or oven.",
    "Spread labneh evenly over the bread.",
    "Sprinkle zaatar generously over the labneh.",
    "Drizzle with olive oil.",
    "Top with cucumbers, tomatoes, and mint.",
    "Season with salt if desired, fold and serve."
  ]
},
{
  title: "Quinoa Salad",
  imagePath: "Images/quinoa.jpg",
  altText: "Quinoa Salad",
  description: "Protein-packed quinoa salad with cucumbers, cherry tomatoes, and lemon vinaigrette.",
  pageLink: "qinoasalad.html",
  type: "dinner",
  ingredients: [
    "1 cup quinoa",
    "2 cups water",
    "1 cup cherry tomatoes, halved",
    "1 cucumber, diced",
    "1/4 cup chopped parsley",
    "2 tbsp olive oil",
    "Juice of 1 lemon",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Rinse quinoa and cook in water until fluffy, about 15 minutes.",
    "Let quinoa cool, then place in a large bowl.",
    "Add tomatoes, cucumber, and parsley.",
    "Drizzle with olive oil and lemon juice.",
    "Season with salt and pepper.",
    "Toss to combine and serve chilled or at room temperature."
  ]
},
{
  title: "Tomato Basil Soup",
  imagePath: "Images/soup.jpg",
  altText: "Tomato Soup",
  description: "Warm and comforting tomato soup with fresh basil and a touch of cream.",
  pageLink: "tomatosoup.html",
  type: "dinner",
  ingredients: [
    "2 tbsp olive oil",
    "1 onion, chopped",
    "2 garlic cloves, minced",
    "1 can (28 oz) crushed tomatoes",
    "1 cup vegetable broth",
    "1/2 cup heavy cream",
    "1/4 cup chopped fresh basil",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Heat olive oil in a pot over medium heat.",
    "Sauté onion and garlic until softened.",
    "Add crushed tomatoes and vegetable broth. Bring to a boil.",
    "Reduce heat and simmer for 15 minutes.",
    "Stir in cream and basil, season with salt and pepper.",
    "Use immersion blender for a smooth texture if desired.",
    "Serve warm with crusty bread."
  ]
},
{
  title: "Korean Noodles",
  imagePath: "Images/noodles.jpg",
  altText: "Korean Noodles (Japchae)",
  description: "Stir-fried glass noodles with vegetables, sesame oil, and a sweet-savory sauce. Optional beef, chicken, or tofu.",
  pageLink: "koreannoodles.html",
  type: "dinner",
  ingredients: [
    "200g glass noodles",
    "1 carrot, julienned",
    "1 bell pepper, sliced",
    "1/2 onion, sliced",
    "2 cups spinach",
    "2 tbsp soy sauce",
    "1 tbsp sesame oil",
    "1 tbsp sugar",
    "1 tsp garlic, minced",
    "Protein of choice (optional): sliced beef, chicken, or tofu"
  ],
  instructions: [
    "Cook noodles according to package instructions. Rinse and drain.",
    "In a pan, sauté vegetables and optional protein in sesame oil.",
    "Add soy sauce, sugar, and garlic. Stir well.",
    "Add noodles and mix until everything is well combined.",
    "Stir in spinach until wilted.",
    "Serve warm or chilled, topped with sesame seeds if desired."
  ]
},
{
  title: "Chicken Pane",
  imagePath: "Images/pane.jpg",
  altText: "Chicken Pane Sandwich",
  description: "Crispy breaded chicken fillet in soft bread with lettuce, tomatoes, and creamy sauce.",
  pageLink: "chickenpanne.html",
  type: "dinner",
  ingredients: [
    "2 chicken breasts, flattened",
    "1 cup flour",
    "2 eggs, beaten",
    "1 cup breadcrumbs",
    "Salt, pepper, paprika to taste",
    "Oil for frying",
    "Bread rolls or sandwich bread",
    "Lettuce, tomato slices",
    "Mayonnaise or garlic sauce"
  ],
  instructions: [
    "Season chicken with salt, pepper, and paprika.",
    "Dredge in flour, dip in eggs, then coat with breadcrumbs.",
    "Fry in hot oil until golden and cooked through.",
    "Drain on paper towels.",
    "Assemble sandwich with bread, lettuce, tomato, and sauce.",
    "Add chicken fillet and serve."
  ]
},
{
  title: "Quesadillas",
  imagePath: "Images/quesadilla.jpg",
  altText: "Quesadillas",
  description: "Flour tortillas with melted cheese and fillings, grilled to crispy perfection.",
  pageLink: "quesidilas.html",
  type: "dinner",
  ingredients: [
    "4 flour tortillas",
    "1 cup shredded cheese (cheddar, mozzarella, or blend)",
    "Optional fillings: cooked chicken, beans, bell peppers, onions",
    "Butter or oil for cooking",
    "Salsa or sour cream for serving"
  ],
  instructions: [
    "Heat a skillet over medium heat.",
    "Place tortilla in pan, sprinkle cheese and fillings over half.",
    "Fold tortilla over and press down.",
    "Cook until golden, then flip and cook the other side.",
    "Remove, slice into wedges, and serve with salsa or sour cream."
  ]
},

// --- DESSERT ---
{
  title: "Waffles",
  imagePath: "Images/waffles.jpg",
  altText: "Waffles",
  description: "Crispy on the outside, fluffy on the inside—perfect with syrup, berries, or ice cream.",
  pageLink: "waffles.html",
  type: "dessert",
  ingredients: [
    "2 cups flour",
    "2 tbsp sugar",
    "1 tbsp baking powder",
    "1/2 tsp salt",
    "2 eggs",
    "1 3/4 cups milk",
    "1/2 cup melted butter",
    "1 tsp vanilla extract"
  ],
  instructions: [
    "Preheat waffle iron.",
    "In a bowl, mix flour, sugar, baking powder, and salt.",
    "In another bowl, whisk eggs, milk, butter, and vanilla.",
    "Combine wet and dry ingredients until smooth.",
    "Pour batter into waffle iron and cook until golden.",
    "Serve with toppings of choice."
  ]
},
{
  title: "Brownies",
  imagePath: "Images/brownies.jpg",
  altText: "Brownies",
  description: "Rich, fudgy, and chocolatey squares of heaven—cakey or gooey, always delicious.",
  pageLink: "brownies.html",
  type: "dessert",
  ingredients: [
    "1/2 cup butter",
    "1 cup sugar",
    "2 eggs",
    "1 tsp vanilla extract",
    "1/3 cup cocoa powder",
    "1/2 cup flour",
    "1/4 tsp salt",
    "1/4 tsp baking powder"
  ],
  instructions: [
    "Preheat oven to 350°F (175°C). Grease a baking dish.",
    "Melt butter and mix in sugar, eggs, and vanilla.",
    "Add cocoa, flour, salt, and baking powder.",
    "Spread into pan and bake for 20–25 minutes.",
    "Cool before slicing."
  ]
},
{
  title: "Tiramisu",
  imagePath: "Images/tiramisu.jpg",
  altText: "Tiramisu",
  description: "Classic Italian dessert with coffee-soaked layers, mascarpone, and cocoa dusting.",
  pageLink: "tiramisu.html",
  type: "dessert",
  ingredients: [
    "1 cup strong coffee, cooled",
    "1/4 cup sugar",
    "3 eggs, separated",
    "1 cup mascarpone cheese",
    "1 pack ladyfinger biscuits",
    "Unsweetened cocoa powder"
  ],
  instructions: [
    "Beat egg yolks with sugar until pale.",
    "Fold in mascarpone.",
    "In another bowl, beat egg whites until stiff, then fold into mascarpone mix.",
    "Dip ladyfingers in coffee and layer in dish.",
    "Spread mascarpone mixture over.",
    "Repeat layers and dust with cocoa.",
    "Chill for at least 4 hours before serving."
  ]
},
{
  title: "French Toast",
  imagePath: "Images/frenchtoast.jpg",
  altText: "French Toast",
  description: "Golden, cinnamon-vanilla soaked bread, pan-fried to perfection—topped as you like.",
  pageLink: "frenchtoast.html",
  type: "dessert",
  ingredients: [
    "4 slices of bread",
    "2 eggs",
    "1/2 cup milk",
    "1 tsp vanilla extract",
    "1/2 tsp cinnamon",
    "Butter for cooking",
    "Maple syrup or fruit for topping"
  ],
  instructions: [
    "Whisk eggs, milk, vanilla, and cinnamon in a bowl.",
    "Dip bread slices in the mixture, coating both sides.",
    "Heat butter in a pan over medium heat.",
    "Cook bread until golden on both sides.",
    "Serve with toppings of choice."
  ]
},

 // --- KETO ---
{
  title: "Creamy Garlic Parmesan Chicken",
  imagePath: "creamychicken.jpg",
  altText: "Creamy Garlic Parmesan Chicken",
  description: "A rich and savory one-pan dish that's loaded with flavor and healthy fats.",
  pageLink: "creampychicken.html",
  type: "keto",
  ingredients: [
    "2 chicken breasts",
    "2 tbsp olive oil",
    "4 cloves garlic, minced",
    "1 cup heavy cream",
    "1/2 cup grated Parmesan cheese",
    "1 tsp Italian seasoning",
    "Salt and pepper to taste",
    "Fresh parsley for garnish"
  ],
  instructions: [
    "Season chicken with salt, pepper, and Italian seasoning.",
    "In a skillet over medium heat, cook chicken in olive oil until golden and cooked through. Remove and set aside.",
    "In the same skillet, sauté garlic for 1 minute.",
    "Add heavy cream and Parmesan, stir until smooth and creamy.",
    "Return chicken to pan and simmer for 5 minutes.",
    "Garnish with parsley and serve hot."
  ]
},
{
  title: "Keto Cauliflower Mac & Cheese",
  imagePath: "mac&cheese.jpg",
  altText: "Keto Cauliflower Mac & Cheese",
  description: "A low-carb twist on the classic comfort food.",
  pageLink: "mac&cheese.html",
  type: "keto",
  ingredients: [
    "1 large head of cauliflower, cut into florets",
    "1 cup heavy cream",
    "1 1/2 cups shredded cheddar cheese",
    "1/4 cup cream cheese",
    "1/2 tsp garlic powder",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Steam or boil cauliflower until tender. Drain well.",
    "In a saucepan, heat heavy cream over medium heat.",
    "Add cream cheese, garlic powder, salt, and pepper. Stir until smooth.",
    "Add cheddar cheese and stir until melted.",
    "Mix in the cauliflower and coat evenly with sauce.",
    "Serve warm as a side or main dish."
  ]
},
{
  title: "Avocado Tuna Salad Boats",
  imagePath: "avocadotuna.jpg",
  altText: "Avocado Tuna Salad Boats",
  description: "A refreshing and protein-packed meal that's great for lunch or a light dinner.",
  pageLink: "avocadotuna.html",
  type: "keto",
  ingredients: [
    "2 ripe avocados, halved and pitted",
    "1 can tuna, drained",
    "2 tbsp mayonnaise",
    "1 tbsp lemon juice",
    "1 celery stalk, finely chopped",
    "Salt and pepper to taste",
    "Chopped parsley for garnish"
  ],
  instructions: [
    "In a bowl, mix tuna, mayonnaise, lemon juice, celery, salt, and pepper.",
    "Scoop out a small portion of the avocado flesh to make space for filling.",
    "Spoon tuna salad into each avocado half.",
    "Garnish with chopped parsley.",
    "Serve chilled or at room temperature."
  ]
},
{
  title: "Zucchini Lasagna",
  imagePath: "zuchinni2.jpg",
  altText: "Zucchini Lasagna",
  description: "This keto-friendly lasagna uses thin-sliced zucchini in place of noodles, layered with seasoned meat, marinara, and a cheesy ricotta mixture.",
  pageLink: "zuchinnilasagna.html",
  type: "keto",
  ingredients: [
    "3 zucchinis, sliced lengthwise into thin strips",
    "1 lb ground beef or turkey",
    "1 cup marinara sauce (low sugar)",
    "1 cup ricotta cheese",
    "1 egg",
    "1 cup shredded mozzarella",
    "1/2 tsp garlic powder",
    "Salt and pepper to taste",
    "Fresh basil for garnish"
  ],
  instructions: [
    "Preheat oven to 375°F (190°C).",
    "In a skillet, cook ground meat until browned. Add marinara sauce and simmer 5 minutes.",
    "In a bowl, mix ricotta cheese, egg, garlic powder, salt, and pepper.",
    "Layer zucchini slices, meat sauce, and ricotta mix in a baking dish.",
    "Repeat layers and top with mozzarella.",
    "Bake for 30 minutes until bubbly. Let rest before slicing.",
    "Garnish with fresh basil and serve."
  ]
},

// --- COCKTAILS ---
{
  title: "Sparkling Cucumber Mint",
  imagePath: "../public/Images/sparklingcucumber.jpg",
  altText: "Sparkling Cucumber Mint Cooler",
  description: "Refreshing sparkling water with cucumber slices, mint leaves, and a splash of lemon juice.",
  pageLink: "sparkling.html",
  type: "cocktails",
  ingredients: [
    "1/2 cucumber, thinly sliced",
    "8 fresh mint leaves",
    "1 tbsp lemon juice",
    "1 cup sparkling water",
    "Ice cubes"
  ],
  instructions: [
    "Muddle cucumber slices and mint leaves in a glass.",
    "Add lemon juice and ice cubes.",
    "Pour sparkling water over and stir gently.",
    "Garnish with extra cucumber or mint if desired.",
    "Serve immediately."
  ]
},
{
  title: "Fruity Iced Tea",
  imagePath: "../public/Images/icedtea.jpg",
  altText: "Fruity Iced Tea",
  description: "Black or green tea chilled with peach or berry juice, finished with lemon slices and ice.",
  pageLink: "icedtea.html",
  type: "cocktails",
  ingredients: [
    "2 cups brewed black or green tea, cooled",
    "1/2 cup peach or berry juice",
    "1 tbsp lemon juice",
    "Lemon slices",
    "Ice cubes"
  ],
  instructions: [
    "In a pitcher, mix brewed tea with fruit juice and lemon juice.",
    "Add ice cubes and lemon slices.",
    "Stir well and chill before serving.",
    "Serve over more ice if desired."
  ]
},
{
  title: "Lemonade Refresher",
  imagePath: "../public/Images/lemonade.jpg",
  altText: "Lemonade Refresher",
  description: "Classic lemonade jazzed up with muddled berries and fresh mint for a fruity twist.",
  pageLink: "Lemonade Refresher.html",
  type: "cocktails",
  ingredients: [
    "1 cup lemonade",
    "1/4 cup mixed berries (strawberries, raspberries, etc.)",
    "4 mint leaves",
    "Ice cubes"
  ],
  instructions: [
    "Muddle berries and mint in a glass.",
    "Add lemonade and stir.",
    "Fill with ice cubes and garnish with more mint or berries.",
    "Serve cold."
  ]
},
{
  title: "Passion Fruit Mojito",
  imagePath: "../public/Images/virginmojito.jpg",
  altText: "Virgin Mojito",
  description: "Tropical fruit, tangy lime juice and fresh mint make quite a powerful drink!",
  pageLink: "virginmojito.html",
  type: "cocktails",
  ingredients: [
    "1/2 cup passion fruit juice",
    "1 tbsp lime juice",
    "6-8 mint leaves",
    "1 tsp sweetener (optional)",
    "1/2 cup soda water",
    "Ice cubes"
  ],
  instructions: [
    "Muddle mint leaves and lime juice in a glass.",
    "Add passion fruit juice and sweetener if using.",
    "Fill with ice and top with soda water.",
    "Stir and garnish with mint leaves.",
    "Serve immediately."
  ]
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
