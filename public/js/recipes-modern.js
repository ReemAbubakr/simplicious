// Modern Recipes Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    initializeCarousel();
    
    // Search and filter functionality
    initializeSearchAndFilters();
    
    // Category card animations
    initializeAnimations();
});

function initializeCarousel() {
    const carouselImages = document.getElementById('carouselImages');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    const totalSlides = dots.length || 3; // Dynamic based on actual number of slides
    
    // Auto-play carousel
    let autoplayInterval = setInterval(nextSlide, 4000);
    
    function updateCarousel() {
        const translateX = -currentSlide * 100;
        carouselImages.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
    });
    
    // Reset autoplay when user interacts
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 4000);
    }
    
    // Pause autoplay on hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        carousel.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 4000);
        });
    }
}

function initializeSearchAndFilters() {
    const searchInput = document.getElementById('recipeSearch');
    const searchBtn = document.getElementById('searchBtn');
    const prepTimeFilter = document.getElementById('prepTimeFilter');
    const servingsFilter = document.getElementById('servingsFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    // Search functionality
    function performSearch() {
        const searchTerm = searchInput?.value.trim();
        if (searchTerm) {
            // Redirect to search results page
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
    
    // Filter change handlers
    function applyFilters() {
        const filters = {
            prepTime: prepTimeFilter?.value || '',
            servings: servingsFilter?.value || '',
            difficulty: difficultyFilter?.value || ''
        };
        
        // Build query string
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                queryParams.append(key, filters[key]);
            }
        });
        
        // Add search term if exists
        const searchTerm = searchInput?.value.trim();
        if (searchTerm) {
            queryParams.append('q', searchTerm);
        }
        
        // Redirect to filtered results
        if (queryParams.toString()) {
            window.location.href = `/search?${queryParams.toString()}`;
        }
    }
    
    // Add event listeners to filters
    [prepTimeFilter, servingsFilter, difficultyFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
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
    const animateElements = document.querySelectorAll('.category-card, .idea-card');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Category card hover effects
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Idea card hover effects
    const ideaCards = document.querySelectorAll('.idea-card');
    ideaCards.forEach(card => {
        const icon = card.querySelector('.idea-icon');
        
        card.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Utility function for smooth scrolling
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for global access
window.smoothScrollTo = smoothScrollTo; 