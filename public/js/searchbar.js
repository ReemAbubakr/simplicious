function setupLiveSearch(inputId, resultContainerId) {
  const input = document.getElementById(inputId);
  const resultContainer = document.getElementById(resultContainerId);

  if (!input || !resultContainer) return;

  input.addEventListener('input', async () => {
    const query = input.value.trim();
    resultContainer.innerHTML = '';

    if (query.length === 0) return;

    try {
      const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.length === 0) {
        resultContainer.innerHTML = '<p>No results found.</p>';
        return;
      }

      data.forEach(recipe => {
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
