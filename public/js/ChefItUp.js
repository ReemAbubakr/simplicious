// DOM Elements
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsDiv = document.getElementById('results');

// Event Listeners (unchanged from your original)
checkboxes.forEach(cb => {
    cb.addEventListener('change', updateProgress);
});

submitBtn.addEventListener('click', handleSubmit);
resetBtn.addEventListener('click', resetSelections);

// Progress Bar Logic (unchanged)
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

// Modified Submit Handler
async function handleSubmit() {
    const selectedIngredients = Array.from(
        document.querySelectorAll('input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    try {
        resultsDiv.innerHTML = '<p class="loading">Finding your perfect recipe...</p>';

        const response = await fetch('/api/chef-it-up/match', {
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
            // Find best match (recipe with most ingredient matches)
            const bestMatch = recipes.reduce((best, current) => {
                    const currentMatches = current.ingredients.filter(ing =>
                        selectedIngredients.some(sel =>
                            new RegExp(sel, 'i').test(ing)
                        ).length);

                    const bestMatches = best.ingredients.filter(ing =>
                        selectedIngredients.some(sel =>
                            new RegExp(sel, 'i').test(ing)
                        )
                    ).length;

                    return currentMatches > bestMatches ? current : best;
                },
                recipes[0]);

            resultsDiv.innerHTML = `<p class="success">Taking you to ${bestMatch.name}...</p>`;
            setTimeout(() => {
                window.location.href = `/recipes/${bestMatch._id}`;
            }, 1500);
        } else {
            resultsDiv.innerHTML = `
                <p class="no-match">No recipes found with these ingredients.</p>
                <button onclick="window.location.reload()">Try Again</button>
            `;
        }
    } catch (error) {
        console.error("Search failed:", error);
        resultsDiv.innerHTML = `
            <p class="error">Recipe search failed. Please try again.</p>
            <button onclick="window.location.reload()">Retry</button>
        `;
    }
}

// Reset Function (unchanged)
function resetSelections() {
    checkboxes.forEach(cb => {
        cb.checked = false;
    });
    progressBar.style.width = '0%';
    progressText.textContent = "Select at least 3 ingredients to continue.";
    submitBtn.disabled = true;
    submitBtn.classList.remove('enabled');
    submitBtn.style.cursor = 'not-allowed';
    resultsDiv.innerHTML = '';
}