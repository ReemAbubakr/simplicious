document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('keypress', async(e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();

            if (!query) return;

            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}&isCategory=true`);
                const data = await response.json();

                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            } catch (error) {
                console.error('Search failed:', error);
            }
        }
    });
});

function setupLiveSearch(inputId, resultContainerId) {
    const input = document.getElementById(inputId);
    const resultContainer = document.getElementById(resultContainerId);

    if (!input || !resultContainer) return;

    input.addEventListener('input', async() => {
        const query = input.value.trim();
        resultContainer.innerHTML = '';

        if (query.length === 0) return;

        try {
            // Add isCategory=true to check for category matches
            const res = await fetch(`/search?q=${encodeURIComponent(query)}&isCategory=true`);
            const data = await res.json();

            // Handle redirect if a category is matched
            if (data.redirect) {
                window.location.href = data.redirect;
                return;
            }

            const recipes = data.recipes || [];

            if (recipes.length === 0) {
                resultContainer.innerHTML = '<p>No results found.</p>';
                return;
            }

            recipes.forEach(recipe => {
                const card = document.createElement('div');
                card.classList.add('recipe-search-card');
                card.innerHTML = `
          <a href="/recipes/${recipe._id}">
            <strong>${recipe.title}</strong><br>
            <small>${recipe.description?.slice(0, 60) || ''}...</small>
          </a>
        `;
                resultContainer.appendChild(card);
            });
        } catch (err) {
            console.error('Error fetching recipes:', err);
            resultContainer.innerHTML = '<p>Error fetching results.</p>';
        }
    });
}