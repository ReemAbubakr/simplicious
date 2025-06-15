async function revealRecipe(cardElement) {
    if (cardElement.classList.contains("flipped")) return;

    try {
        const response = await fetch('/feelin-risky/random');
        const recipe = await response.json();

        const back = cardElement.querySelector(".card-back");
        back.style.backgroundImage = 'none';

        // Show only the recipe title in a centered container
        back.innerHTML = `
            <div class="recipe-title-only">
                <h3>${recipe.title}</h3>
            </div>
        `;

        cardElement.classList.add("flipped");

        // Redirect after a short delay to show the title
        setTimeout(() => {
            window.location.href = `/recipes/${recipe._id}`;
        }, 1000);

    } catch (error) {
        console.error("Failed to load recipe:", error);
        back.innerHTML = `
            <div class="error">
                <p>Failed to reveal recipe</p>
                <button onclick="retryRecipe(this)">Try Again</button>
            </div>
        `;
    }
}

// Retry function (unchanged)
function retryRecipe(button) {
    const card = button.closest('.card');
    card.classList.remove("flipped");
    setTimeout(() => revealRecipe(card), 500);
}