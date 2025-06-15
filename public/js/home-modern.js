// Home Page Modern JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter tag functionality
    const filterTags = document.querySelectorAll('.filter-tag');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Handle filter tag clicks
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Set search input value
            const filterValue = this.getAttribute('data-filter');
            if (searchInput) {
                searchInput.value = filterValue;
            }
        });
    });

    // Handle search
    function performSearch() {
        const searchTerm = searchInput?.value.trim();
        if (searchTerm) {
            // Redirect to search page with query
            window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
        }
    }

    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    // Search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // Newsletter form
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.email-input').value;
            
            if (email) {
                // Simple validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(email)) {
                    alert('Thank you for subscribing! We\'ll keep you updated.');
                    this.reset();
                } else {
                    alert('Please enter a valid email address.');
                }
            }
        });
    }

    // Smooth animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .recipe-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}); 