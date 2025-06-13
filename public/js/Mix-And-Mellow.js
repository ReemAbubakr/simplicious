let recipes = [];

// Initialize
document.addEventListener('DOMContentLoaded', async() => {
    try {
        const response = await fetch('/api/mix-mellow/recipes');
        recipes = await response.json();
        renderRecipes();
    } catch (error) {
        console.error("Failed to load recipes:", error);
    }
});

function renderRecipes() {
    const container = document.querySelector('.meal-selection');
    container.innerHTML = recipes.map(recipe => `
    <div class="recipe-card" 
         draggable="true"
         data-recipe-id="${recipe._id}"
         ondragstart="drag(event)">
      <img src="${recipe.imageUrl || '/images/default-food.jpg'}" alt="${recipe.name}">
      <h4>${recipe.name}</h4>
      <p>${recipe.prepTime || '30'} mins</p>
    </div>
  `).join('');
}

// Drag & Drop
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.dataset.recipeId);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const recipeId = ev.dataTransfer.getData("text");
    const recipe = recipes.find(r => r._id === recipeId);

    if (recipe) {
        ev.target.innerHTML = `
      <div class="planned-meal" data-recipe-id="${recipe._id}">
        <h4>${recipe.name}</h4>
        <img src="${recipe.imageUrl || '/images/default-food.jpg'}" alt="${recipe.name}">
      </div>
    `;
    }
}

// Save Plan
async function savePlan() {
    const plan = {};
    document.querySelectorAll('.meal-slot').forEach(slot => {
        const meal = slot.querySelector('.planned-meal');
        if (meal) plan[slot.id] = meal.dataset.recipe - id;
    });

    try {
        const response = await fetch('/api/mix-mellow/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        });

        if (response.ok) alert('Plan saved successfully!');
        else throw new Error(await response.text());
    } catch (error) {
        alert(`Failed to save: ${error.message}`);
    }
}