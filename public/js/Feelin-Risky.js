async function revealRecipe(cardElement) {
    cardElement.classList.add("flipped");
    if (cardElement.classList.contains("flipped")) return;

    try {
        const response = await fetch('/feelin-risky/random');
        const recipe = await response.json();

        const back = cardElement.querySelector(".card-back");
        back.style.backgroundImage = 'none';

        // Only show the title (no extra HTML)
        back.innerHTML = `<h3 class="flipped-title">${recipe.title}</h3>`; // 👈 Key change




        window.location.href = `/recipes/${recipe._id}`;

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