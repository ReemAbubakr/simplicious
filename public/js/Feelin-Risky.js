async function revealRecipe(cardElement) {
    if (cardElement.classList.contains("flipped")) return;

    try {
        const response = await fetch('/feelin-risky/random');
        const recipe = await response.json();

        const back = cardElement.querySelector(".card-back");
        back.style.backgroundImage = `url('${recipe.imagePath}')`;
        back.innerHTML = `
        <h3>${recipe.title}</h3>
        <p>${recipe.ingredients.join(' • ')}</p>
      `;

        cardElement.classList.add("flipped");
        setTimeout(() => {
            window.location.href = recipe.pageLink || `/recipes/${recipe._id}`;
        }, 2000);
    } catch (error) {
        console.error("Failed to load recipe:", error);
        cardElement.querySelector(".card-back").innerHTML = `
        <p class="error">Failed to reveal recipe</p>
      `;
    }
}