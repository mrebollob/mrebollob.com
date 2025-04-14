// scripts/checklist.js

document.addEventListener('DOMContentLoaded', () => {
    const checklists = document.querySelectorAll('.checklist');

    checklists.forEach((list, index) => {
        const recipeId = list.getAttribute('data-recipe') || `recipe-${index}`;
        const savedState = JSON.parse(localStorage.getItem(`checklist-${recipeId}`) || '[]');

        // Restore saved state
        list.querySelectorAll('input[type="checkbox"]').forEach((checkbox, i) => {
            checkbox.checked = savedState[i] || false;

            // Save state on change
            checkbox.addEventListener('change', () => {
                const newState = Array.from(list.querySelectorAll('input[type="checkbox"]'))
                    .map(cb => cb.checked);
                localStorage.setItem(`checklist-${recipeId}`, JSON.stringify(newState));
            });
        });
    });
});

function clearChecklist(recipeId) {
    localStorage.removeItem(`checklist-${recipeId}`);
    document.querySelectorAll(`[data-recipe="${recipeId}"] input[type="checkbox"]`).forEach(cb => cb.checked = false);
}
