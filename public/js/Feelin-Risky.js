async function revealRecipe(cardElement) {
    if (cardElement.classList.contains("flipped")) return;

    try {
        const response = await fetch('/feelin-risky/random');
        const recipe = await response.json();

        const back = cardElement.querySelector(".card-back");

        // Remove any existing background image
        back.style.backgroundImage = 'none';

        // Create a preview of the recipe card
        back.innerHTML = `
            <div class="recipe-content">
                <img src="${recipe.imagePath}" alt="${recipe.title}" class="recipe-image">
                <h3>${recipe.title}</h3>
                <span class="recipe-type">${recipe.type}</span>
                ${recipe.description ? `<p class="description">${recipe.description}</p>` : ''}
                <div class="preview-text">Redirecting to full recipe...</div>
            </div>
        `;

        cardElement.classList.add("flipped");
        
        // Wait for the flip animation to complete (0.8s) and a little extra time to show the preview
        setTimeout(() => {
            window.location.href = `/recipes/${recipe._id}`;
        }, 1500);
    } catch (error) {
        console.error("Failed to load recipe:", error);
        cardElement.querySelector(".card-back").innerHTML = `
            <div class="error">
                <p>Failed to reveal recipe</p>
                <button onclick="retryRecipe(this)">Try Again</button>
            </div>
        `;
    }
}

function retryRecipe(button) {
    const card = button.closest('.card');
    card.classList.remove("flipped");
    setTimeout(() => revealRecipe(card), 500);
}