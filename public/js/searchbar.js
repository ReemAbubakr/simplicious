async function searchRecipes(inputId, resultContainerId) {
  const query = document.getElementById(inputId).value;

  try {
    const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    const resultContainer = document.getElementById(resultContainerId);
    resultContainer.innerHTML = '';

    data.forEach(recipe => {
      const card = document.createElement('div');
      card.classList.add('recipe-card');
      card.innerHTML = `
        <h2>${recipe.title}</h2>
        <p>${recipe.description}</p>
      `;
      resultContainer.appendChild(card);
    });
  } catch (err) {
    console.error('Error fetching recipes:', err);
  }
}
