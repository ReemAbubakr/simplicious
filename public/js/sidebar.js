// Sidebar menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const anchor = item.querySelector('a').getAttribute('href');
            window.location.href = anchor; // Works with Express routes
        });
    });
});