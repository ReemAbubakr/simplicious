document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultsDiv = document.getElementById('results');

    if (!submitBtn || !resetBtn || !progressBar || !progressText) {
        console.error('Required elements not found on page');
        return;
    }

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

    // Handle Submit
    async function handleSubmit() {
        const selectedIngredients = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        if (selectedIngredients.length < 3) {
            alert('Please select at least 3 ingredients');
            return;
        }

        try {
            resultsDiv.innerHTML = `
                <div class="loading">
                    <p>Finding your perfect recipe...</p>
                    <div class="spinner"></div>
                </div>`;

            const response = await fetch('/chef-it-up/find', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ingredients: selectedIngredients })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                resultsDiv.innerHTML = `
                    <div class="success">
                        <h3>Found a perfect match!</h3>
                        <p>Recipe: ${data.recipe.title}</p>
                        <p>Matching ingredients: ${data.matchCount}</p>
                        <p>Redirecting to recipe...</p>
                        <div class="spinner"></div>
                    </div>`;

                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                resultsDiv.innerHTML = `
                    <div class="error">
                        <p>${data.message || 'No matching recipes found'}</p>
                        <button class="try-again-btn" onclick="resetSelections()">Try Again</button>
                    </div>`;
            }
        } catch (error) {
            console.error('Error:', error);
            resultsDiv.innerHTML = `
                <div class="error">
                    <p>Failed to find recipes. Please try again.</p>
                    <button class="try-again-btn" onclick="resetSelections()">Try Again</button>
                </div>`;
        }
    }
});