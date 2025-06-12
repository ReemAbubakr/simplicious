// Recipe sorting functionality
document.addEventListener('DOMContentLoaded', () => {
    const sortDropdown = document.getElementById('sort-dropdown');
    const recipeContainer = document.querySelector('.featured-right');

    function sortRecipes(criteria) {
        const recipeCards = Array.from(document.querySelectorAll('.recipe-card2'));
        
        recipeCards.sort((a, b) => {
            const prepTimeA = parseInt(a.dataset.preptime);
            const prepTimeB = parseInt(b.dataset.preptime);
            const popularityA = parseInt(a.dataset.popularity);
            const popularityB = parseInt(b.dataset.popularity);

            if (criteria === 'prep-time') return prepTimeA - prepTimeB;
            if (criteria === 'most-popular') return popularityB - popularityA;
            return 0;
        });

        recipeContainer.innerHTML = '';
        recipeCards.forEach(card => recipeContainer.appendChild(card));
    }

    sortDropdown.addEventListener('change', (event) => {
        sortRecipes(event.target.value);
    });
});