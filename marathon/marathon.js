// Marathon Training Plan JavaScript

// Save marathon date to localStorage
function saveMarathonDate(date) {
  localStorage.setItem('marathonDate', date);
}

// Load marathon date from localStorage
function loadMarathonDate() {
  return localStorage.getItem('marathonDate');
}

function updateDates() {
  const marathonDateInput = document.getElementById('marathon-date');
  const countdownInfo = document.getElementById('countdown-info');
  const weekDateCells = document.querySelectorAll('.week-date');

  if (!marathonDateInput.value) {
    countdownInfo.innerHTML = '';
    weekDateCells.forEach(cell => {
      cell.textContent = '-';
    });
    return;
  }

  const marathonDate = new Date(marathonDateInput.value);
  const today = new Date();

  // Calculate days until marathon
  const timeDiff = marathonDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const weeksUntil = Math.floor(daysUntil / 7);

  // Display countdown info
  if (daysUntil > 0) {
    countdownInfo.innerHTML = `<strong>${daysUntil} days</strong> (${weeksUntil} weeks) until marathon`;
  } else if (daysUntil === 0) {
    countdownInfo.innerHTML = '<strong>Marathon is today!</strong>';
  } else {
    countdownInfo.innerHTML = `Marathon was ${Math.abs(daysUntil)} days ago`;
  }

  // Update week dates and highlight current week
  weekDateCells.forEach(cell => {
    const weeksToGo = parseInt(cell.dataset.week);
    const weekStartDate = new Date(marathonDate);

    // Calculate the Monday of the training week
    // Go back weeksToGo weeks from marathon date, then find the Monday of that week
    weekStartDate.setDate(marathonDate.getDate() - (weeksToGo * 7));

    // Adjust to get Monday of that week (0 = Sunday, 1 = Monday)
    const dayOfWeek = weekStartDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days; otherwise go back (dayOfWeek - 1) days
    weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract);

    const options = { month: 'short', day: 'numeric' };
    cell.textContent = weekStartDate.toLocaleDateString('en-US', options);

    // Check if this is the current week
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6); // End on Sunday

    // Find the week card (parent of the week-date element)
    const weekCard = cell.closest('.week-card');
    if (weekCard) {
      weekCard.classList.remove('current-week');

      if (today >= weekStartDate && today <= weekEndDate) {
        weekCard.classList.add('current-week');
      }
    }
  });
}

// Initialize page when loaded
window.addEventListener('load', function () {
  const marathonDateInput = document.getElementById('marathon-date');

  // Try to load saved date from localStorage
  const savedDate = loadMarathonDate();

  if (savedDate) {
    // Use saved date if available
    marathonDateInput.value = savedDate;
  } else {
    // Use default date (18 weeks from today) if no saved date
    const today = new Date();
    const defaultMarathonDate = new Date(today.getTime() + (18 * 7 * 24 * 60 * 60 * 1000));
    marathonDateInput.value = defaultMarathonDate.toISOString().split('T')[0];
  }

  // Add event listener for date changes
  marathonDateInput.addEventListener('change', function () {
    // Save the new date to localStorage
    saveMarathonDate(marathonDateInput.value);
    // Update the display
    updateDates();
  });

  // Initial update
  updateDates();
});
