function searchRecipes(inputId, cardClass) {
    const query = document.getElementById(inputId).value.toLowerCase();
    const recipeCards = document.querySelectorAll(`.${cardClass}`);
  
    recipeCards.forEach(card => {
      const title = card.querySelector('h2')?.textContent.toLowerCase() || '';
      const description = card.querySelector('p')?.textContent.toLowerCase() || '';
  
      if (title.includes(query) || description.includes(query)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }
  const searchInput = document.querySelector('.search-input');

searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const query = this.value.trim().toLowerCase();

        // Define redirects
        const pageMap = {
            breakfast: 'Breakfast.html',
            lunch: 'Lunch1.html',
            dinner: 'Dinner.html',
            desserts:'desserts.html'
        };

        if (pageMap[query]) {
            window.location.href = pageMap[query];
        } else {
            alert('No matching category found. Try "breakfast", "lunch", or "dinner".');
        }
    }
});
