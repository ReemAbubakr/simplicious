function setupCategorySearch(inputId, resultContainerId) {
  const input = document.getElementById(inputId);
  const resultContainer = document.getElementById(resultContainerId);

  if (!input || !resultContainer) return;

  // Initialize as hidden
  resultContainer.style.display = 'none';

  const allowedCategories = ['breakfast', 'lunch', 'dinner', 'dessert', 'keto', 'cocktails'];

  input.addEventListener('input', debounce(async () => {
    const query = input.value.trim().toLowerCase();
    
    if (!query) {
      resultContainer.style.display = 'none';
      return;
    }

    try {
      // Add isCategory=true parameter
      const res = await fetch(`/search?q=${encodeURIComponent(query)}&isCategory=true`);
      const data = await res.json();

      resultContainer.innerHTML = '';
      
      if (data.length > 0) {
        // Group by category
        const byCategory = {};
        data.forEach(recipe => {
          if (!byCategory[recipe.type]) {
            byCategory[recipe.type] = [];
          }
          byCategory[recipe.type].push(recipe);
        });

        // Display categories with sample recipes
        Object.entries(byCategory).forEach(([category, recipes]) => {
          const categoryDiv = document.createElement('div');
          categoryDiv.classList.add('search-category-group');
          categoryDiv.innerHTML = `
            <div class="search-category-header">
              <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <a href="/recipes/category/${category}">View all</a>
            </div>
          `;
          
          recipes.slice(0, 3).forEach(recipe => {
            const card = document.createElement('div');
            card.classList.add('category-search-card');
            card.innerHTML = `
              <a href="/recipes/${recipe._id}">
                <strong>${recipe.title}</strong>
              </a>
            `;
            categoryDiv.appendChild(card);
          });
          
          resultContainer.appendChild(categoryDiv);
        });

        resultContainer.style.display = 'block';
      } else {
        resultContainer.innerHTML = `
          <div class="search-no-results">
            <p>No matching categories found for "${query}"</p>
            <p>Try: ${allowedCategories.join(', ')}</p>
          </div>
        `;
        resultContainer.style.display = 'block';
      }
    } catch (err) {
      console.error('Search error:', err);
      resultContainer.style.display = 'none';
    }
  }, 300));

  // Handle click outside
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultContainer.contains(e.target)) {
      resultContainer.style.display = 'none';
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}