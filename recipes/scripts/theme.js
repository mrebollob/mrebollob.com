// scripts/theme.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-theme');
    const themeIcon = document.getElementById('theme-icon');

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }

    toggleBtn.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Animate icon change
        themeIcon.textContent = isDark ? '☀️' : '🌙';
        themeIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeIcon.style.transform = 'none';
        }, 300);
    });
});
