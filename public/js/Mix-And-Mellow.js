// Drag & Drop functionality for meal planning
document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
});

function initializeDragAndDrop() {
    const mealCards = document.querySelectorAll('.meal-card');
    mealCards.forEach(card => {
        card.addEventListener('dragstart', drag);
    });
}

// Drag & Drop
function drag(ev) {
    const mealCard = ev.target.closest('.meal-card');
    if (!mealCard) return;

    ev.dataTransfer.setData("text", mealCard.id);
    ev.dataTransfer.effectAllowed = "copy";
}

function allowDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
}

function drop(ev) {
    ev.preventDefault();
    const target = ev.target.closest('.meal-slot');
    if (!target) return;

    const mealId = ev.dataTransfer.getData("text");
    const originalCard = document.getElementById(mealId);

    if (originalCard) {
        const mealName = originalCard.querySelector('h4').textContent.trim();
        const mealEmoji = originalCard.querySelector('p').textContent.split('|')[0].trim();
        const mealTime = originalCard.querySelector('p').textContent.split('⏱️')[1].trim();

        // Keep the meal type heading
        const mealTypeHeading = target.querySelector('h4').outerHTML;

        target.innerHTML = mealTypeHeading + `
            <div class="planned-meal" data-meal-id="${mealId}">
                <div class="meal-content">
                    <span class="meal-emoji">${mealEmoji}</span>
                    <h5>${mealName}</h5>
                    <p class="meal-time">⏱️ ${mealTime}</p>
                </div>
                <button onclick="removeMeal(this)" class="remove-meal">×</button>
            </div>
        `;
    }
}

function removeMeal(button) {
    const mealSlot = button.closest('.meal-slot');
    const mealType = mealSlot.dataset.mealType;
    mealSlot.innerHTML = `<h4>${mealType}</h4>`;
}

function resetPlanner() {
    if (confirm('Are you sure you want to clear all planned meals?')) {
        document.querySelectorAll('.meal-slot').forEach(slot => {
            const mealType = slot.dataset.mealType;
            slot.innerHTML = `<h4>${mealType}</h4>`;
        });
    }
}

// Save and load functionality
async function savePlan() {
    const plan = {};
    document.querySelectorAll('.meal-slot').forEach(slot => {
        const meal = slot.querySelector('.planned-meal');
        if (meal) {
            const dayType = `${slot.closest('.day-column').dataset.day}-${slot.dataset.mealType}`;
            plan[dayType] = {
                mealId: meal.dataset.mealId,
                mealName: meal.querySelector('h5').textContent,
                mealEmoji: meal.querySelector('.meal-emoji').textContent,
                mealTime: meal.querySelector('.meal-time').textContent.replace('⏱️ ', '')
            };
        }
    });

    try {
        const response = await fetch('/mix-and-mellow/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plan,
                name: `Meal Plan ${new Date().toLocaleDateString()}`
            })
        });

        const data = await response.json();

        if (data.success) {
            alert('Meal plan saved successfully to your account!');
        } else {
            throw new Error(data.error || 'Failed to save meal plan');
        }
    } catch (error) {
        console.error('Error saving meal plan:', error);
        if (error.message.includes('log in')) {
            if (confirm('Please log in to save your meal plan. Would you like to log in now?')) {
                window.location.href = '/login?redirect=/mix-and-mellow';
            }
        } else {
            alert(error.message || 'Failed to save meal plan. Please try again.');
        }
    }
}

function loadPlan() {
    try {
        const plan = JSON.parse(localStorage.getItem('mealPlan'));
        if (!plan) return;

        Object.entries(plan).forEach(([slotId, mealData]) => {
            const slot = document.getElementById(slotId);
            if (slot && mealData.content) {
                const mealType = slot.dataset.mealType;
                slot.innerHTML = `<h4>${mealType}</h4>` +
                    `<div class="planned-meal" data-meal-id="${mealData.mealId}">${mealData.content}</div>`;
            }
        });
    } catch (error) {
        console.error('Failed to load meal plan:', error);
    }
}

// Initialize the plan when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPlan();
});