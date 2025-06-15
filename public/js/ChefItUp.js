document.addEventListener('DOMContentLoaded', () => {
            // DOM Elements
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const progressBar = document.getElementById('progressBar');
            const progressText = document.getElementById('progressText');
            const submitBtn = document.getElementById('submitBtn');
            const resetBtn = document.getElementById('resetBtn');
            const resultsDiv = document.getElementById('results');

            // Event Listeners
            checkboxes.forEach(cb => {
                cb.addEventListener('change', updateProgress);
            });

            submitBtn.addEventListener('click', handleSubmit);
            resetBtn.addEventListener('click', resetSelections);

            // Progress Bar Logic
            function updateProgress() {
                const selected = document.querySelectorAll('input[type="checkbox"]:checked').length;
                const percent = Math.min((selected / 3) * 100, 100);
                progressBar.style.width = `${percent}%`;

                if (selected === 0) {
                    progressText.textContent = "Select at least 3 ingredients to continue.";
                } else if (selected === 1) {
                    progressText.textContent = "You're on your way...";
                } else if (selected === 2) {
                    progressText.textContent = "Almost there!";
                } else {
                    progressText.textContent = "Ready to cook!";
                }

                submitBtn.disabled = selected < 3;
                submitBtn.classList.toggle('enabled', selected >= 3);
                submitBtn.style.cursor = selected >= 3 ? 'pointer' : 'not-allowed';
            }

            // Reset Function
            function resetSelections() {
                checkboxes.forEach(cb => {
                    cb.checked = false;
                });
                updateProgress();
                resultsDiv.innerHTML = '';
            }

            // Create Recipe Card
            function createRecipeCard(recipe) {
                const matchPercentage = Math.round((recipe.matchCount / recipe.ingredients.length) * 100);

                return `
            <div class="recipe-card">
                <div class="recipe-header">
                    <h3>${recipe.title}</h3>
                    <span class="match-badge">${matchPercentage}% match</span>
                </div>
                ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">` : ''}
                <div class="recipe-details">
                    <div class="ingredients-section">
                        <h4>You have ${recipe.matchCount} of the required ingredients:</h4>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ingredient => `
                                <li class="${recipe.matchedIngredients.some(match => 
                                    ingredient.toLowerCase().includes(match.toLowerCase())
                                ) ? 'matched' : ''}">${ingredient}</li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="instructions-section">
                        <h4>How to make it:</h4>
                        <ol class="instructions-list">
                            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        `;
    }

    // Submit Handler
    async function handleSubmit() {
        const selectedIngredients = Array.from(
            document.querySelectorAll('input[type="checkbox"]:checked')
        ).map(cb => cb.value);

        try {
            resultsDiv.innerHTML = '<p class="loading">Finding your perfect recipes...</p>';

            const response = await fetch('/chef-it-up/find', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ingredients: selectedIngredients
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const recipes = await response.json();

            if (recipes.length > 0) {
                resultsDiv.innerHTML = `
                    <h2>Found ${recipes.length} recipe${recipes.length > 1 ? 's' : ''} you can make!</h2>
                    <div class="recipes-container">
                        ${recipes.map(recipe => createRecipeCard(recipe)).join('')}
                    </div>
                    <button onclick="resetSelections()" class="try-again-btn">Try Different Ingredients</button>
                `;
            } else {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <p>No recipes found with these ingredients.</p>
                        <p>Try selecting different ingredients!</p>
                        <button onclick="resetSelections()" class="try-again-btn">Try Again</button>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Search failed:", error);
            resultsDiv.innerHTML = `
                <div class="error">
                    <p>Sorry, something went wrong while searching for recipes.</p>
                    <button onclick="resetSelections()" class="try-again-btn">Try Again</button>
                </div>
            `;
        }
    }
});