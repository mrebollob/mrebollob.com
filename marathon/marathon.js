// Marathon Training Plan JavaScript

// Save marathon date to localStorage
function saveMarathonDate(date) {
  localStorage.setItem('marathonDate', date);
}

// Load marathon date from localStorage
function loadMarathonDate() {
  return localStorage.getItem('marathonDate');
}

// Save goal time to localStorage
function saveGoalTime(time) {
  localStorage.setItem('goalTime', time);
}

// Load goal time from localStorage
function loadGoalTime() {
  return localStorage.getItem('goalTime');
}

// Parse time string (H:MM:SS or HH:MM:SS) to total seconds
function parseTimeToSeconds(timeStr) {
  if (!timeStr) return null;
  
  const parts = timeStr.split(':');
  if (parts.length !== 3) return null;
  
  const hours = parseInt(parts[0]);
  const minutes = parseInt(parts[1]);
  const seconds = parseInt(parts[2]);
  
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || 
      minutes >= 60 || seconds >= 60) return null;
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Format seconds to time string (H:MM:SS or MM:SS)
function formatSecondsToTime(totalSeconds, includeHours = false) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (includeHours || hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Calculate and display pace information
function updatePaceDisplay() {
  const goalTimeInput = document.getElementById('goal-time');
  const paceCard = document.getElementById('pace-card');
  
  if (!goalTimeInput.value) {
    paceCard.style.display = 'none';
    return;
  }
  
  const totalSeconds = parseTimeToSeconds(goalTimeInput.value);
  if (!totalSeconds) {
    paceCard.style.display = 'none';
    return;
  }
  
  // Show the pace card
  paceCard.style.display = 'block';
  
  // Calculate pace per mile (26.2 miles)
  const pacePerMileSeconds = Math.round(totalSeconds / 26.2);
  document.getElementById('pace-per-mile').textContent = formatSecondsToTime(pacePerMileSeconds);
  
  // Calculate pace per km (42.195 km)
  const pacePerKmSeconds = Math.round(totalSeconds / 42.195);
  document.getElementById('pace-per-km').textContent = formatSecondsToTime(pacePerKmSeconds);
  
  // Calculate split times
  const split5k = Math.round(totalSeconds * (5 / 42.195));
  const split10k = Math.round(totalSeconds * (10 / 42.195));
  const splitHalf = Math.round(totalSeconds / 2);
  
  document.getElementById('split-5k').textContent = formatSecondsToTime(split5k);
  document.getElementById('split-10k').textContent = formatSecondsToTime(split10k);
  document.getElementById('split-half').textContent = formatSecondsToTime(splitHalf, true);
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
    if (weeksToGo === 0) {
      // For race week (Week 0), find the Monday of the marathon week
      const dayOfWeek = marathonDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days; otherwise go back (dayOfWeek - 1) days
      weekStartDate.setDate(marathonDate.getDate() - daysToSubtract);
    } else {
      // Go back weeksToGo weeks from marathon date, then find the Monday of that week
      weekStartDate.setDate(marathonDate.getDate() - (weeksToGo * 7));

      // Adjust to get Monday of that week (0 = Sunday, 1 = Monday)
      const dayOfWeek = weekStartDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If Sunday, go back 6 days; otherwise go back (dayOfWeek - 1) days
      weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract);
    }

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
  const goalTimeInput = document.getElementById('goal-time');

  // Try to load saved date from localStorage
  const savedDate = loadMarathonDate();
  const savedGoalTime = loadGoalTime();

  if (savedDate) {
    // Use saved date if available
    marathonDateInput.value = savedDate;
  } else {
    // Use default date (18 weeks from today) if no saved date
    const today = new Date();
    const defaultMarathonDate = new Date(today.getTime() + (18 * 7 * 24 * 60 * 60 * 1000));
    marathonDateInput.value = defaultMarathonDate.toISOString().split('T')[0];
  }

  if (savedGoalTime) {
    // Use saved goal time if available
    goalTimeInput.value = savedGoalTime;
  }

  // Add event listener for date changes
  marathonDateInput.addEventListener('change', function () {
    // Save the new date to localStorage
    saveMarathonDate(marathonDateInput.value);
    // Update the display
    updateDates();
  });

  // Add event listener for goal time changes
  goalTimeInput.addEventListener('input', function () {
    // Save the new goal time to localStorage
    saveGoalTime(goalTimeInput.value);
    // Update the pace display
    updatePaceDisplay();
  });

  // Initial updates
  updateDates();
  updatePaceDisplay();
});
