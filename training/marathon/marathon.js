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

// Save unit preference to localStorage
function saveUnitPreference(units) {
  localStorage.setItem('unitPreference', units);
}

// Load unit preference from localStorage
function loadUnitPreference() {
  return localStorage.getItem('unitPreference') || 'miles';
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

// Calculate training paces based on Pfitzinger recommendations
function calculateTrainingPaces(marathonPaceSeconds) {
  // All calculations based on Pfitzinger Advanced Marathoning 2nd Ed
  
  // Marathon pace (base pace)
  const mp = { min: marathonPaceSeconds, max: marathonPaceSeconds };
  
  // General aerobic: 10-20% slower than marathon pace
  const ga = { 
    min: Math.round(mp.min * 1.10), // 10% slower (faster end)
    max: Math.round(mp.min * 1.20)  // 20% slower (slower end)
  };
  
  // LT (Lactate Threshold): 15-20 seconds per mile faster than marathon pace
  const lt = { 
    min: Math.round(mp.min - 20), // 20 seconds faster (faster end)
    max: Math.round(mp.min - 15)  // 15 seconds faster (slower end)
  };
  
  // Half marathon: ~10-15 seconds per mile faster than marathon pace
  const hm = { 
    min: Math.round(mp.min - 15), // 15 seconds faster (faster end)
    max: Math.round(mp.min - 10)  // 10 seconds faster (slower end)
  };
  
  // Recovery: 20-30% slower than marathon pace
  const recovery = { 
    min: Math.round(mp.min * 1.20), // 20% slower (faster end)
    max: Math.round(mp.min * 1.30)  // 30% slower (slower end)
  };
  
  // VO2 max: approximately 5K pace, ~30-40 seconds per mile faster than marathon pace
  const vo2 = { 
    min: Math.round(mp.min - 40), // 40 seconds faster (faster end)
    max: Math.round(mp.min - 30)  // 30 seconds faster (slower end)
  };
  
  // Med-long run: similar to general aerobic, maybe slightly faster (8-15% slower)
  const medlong = { 
    min: Math.round(mp.min * 1.08), // 8% slower (faster end)
    max: Math.round(mp.min * 1.15)  // 15% slower (slower end)
  };
  
  // Long run: 10-20% slower than marathon pace
  const longrun = { 
    min: Math.round(mp.min * 1.10), // 10% slower (faster end)
    max: Math.round(mp.min * 1.20)  // 20% slower (slower end)
  };
  
  return {
    mp,
    ga,
    lt,
    hm,
    recovery,
    vo2,
    medlong,
    longrun
  };
}

// Update pace display based on unit preference
function updatePaceValues(paceId, milePaceRange, kmPaceRange, unitPreference) {
  const mileElement = document.getElementById(paceId + '-mile');
  const kmElement = document.getElementById(paceId + '-km');
  const container = mileElement.closest('.pace-times');
  
  if (unitPreference === 'miles') {
    if (milePaceRange.min === milePaceRange.max) {
      // Single pace (like marathon pace)
      container.innerHTML = `<span id="${paceId}-mile">${formatSecondsToTime(milePaceRange.min)}</span>`;
    } else {
      // Range of paces
      container.innerHTML = `<span id="${paceId}-mile">${formatSecondsToTime(milePaceRange.min)} - ${formatSecondsToTime(milePaceRange.max)}</span>`;
    }
  } else {
    if (kmPaceRange.min === kmPaceRange.max) {
      // Single pace (like marathon pace)
      container.innerHTML = `<span id="${paceId}-km">${formatSecondsToTime(kmPaceRange.min)}</span>`;
    } else {
      // Range of paces
      container.innerHTML = `<span id="${paceId}-km">${formatSecondsToTime(kmPaceRange.min)} - ${formatSecondsToTime(kmPaceRange.max)}</span>`;
    }
  }
}

// Update goal pace card display based on unit preference
function updateGoalPaceDisplay(pacePerMileSeconds, pacePerKmSeconds, unitPreference) {
  const paceInfo = document.querySelector('.pace-info');
  
  if (unitPreference === 'miles') {
    paceInfo.innerHTML = `
      <div class="pace-value">
        <span id="pace-per-mile">${formatSecondsToTime(pacePerMileSeconds)}</span>
        <span class="pace-unit">per mile</span>
      </div>
    `;
  } else {
    paceInfo.innerHTML = `
      <div class="pace-value">
        <span id="pace-per-km">${formatSecondsToTime(pacePerKmSeconds)}</span>
        <span class="pace-unit">per km</span>
      </div>
    `;
  }
}

// Calculate and display pace information
function updatePaceDisplay() {
  const goalTimeInput = document.getElementById('goal-time');
  const unitSelector = document.getElementById('unit-selector');
  const paceCard = document.getElementById('pace-card');
  const trainingPacesCard = document.getElementById('training-paces-card');
  
  if (!goalTimeInput.value) {
    paceCard.style.display = 'none';
    trainingPacesCard.style.display = 'none';
    return;
  }
  
  const totalSeconds = parseTimeToSeconds(goalTimeInput.value);
  if (!totalSeconds) {
    paceCard.style.display = 'none';
    trainingPacesCard.style.display = 'none';
    return;
  }
  
  // Show the cards
  paceCard.style.display = 'block';
  trainingPacesCard.style.display = 'block';
  
  const unitPreference = unitSelector.value;
  
  // Calculate pace per mile (26.2 miles)
  const pacePerMileSeconds = Math.round(totalSeconds / 26.2);
  // Calculate pace per km (42.195 km)
  const pacePerKmSeconds = Math.round(totalSeconds / 42.195);
  
  // Update goal pace display
  updateGoalPaceDisplay(pacePerMileSeconds, pacePerKmSeconds, unitPreference);
  
  // Calculate split times
  const split5k = Math.round(totalSeconds * (5 / 42.195));
  const split10k = Math.round(totalSeconds * (10 / 42.195));
  const splitHalf = Math.round(totalSeconds / 2);
  
  document.getElementById('split-5k').textContent = formatSecondsToTime(split5k);
  document.getElementById('split-10k').textContent = formatSecondsToTime(split10k);
  document.getElementById('split-half').textContent = formatSecondsToTime(splitHalf, true);
  
  // Calculate training paces
  const paces = calculateTrainingPaces(pacePerMileSeconds);
  
  // Convert mile pace ranges to km pace ranges
  const convertToKmRange = (mileRange) => ({
    min: Math.round(mileRange.min * 0.621371),
    max: Math.round(mileRange.max * 0.621371)
  });

  // Update all training paces based on unit preference
  updatePaceValues('mp', paces.mp, convertToKmRange(paces.mp), unitPreference);
  updatePaceValues('ga', paces.ga, convertToKmRange(paces.ga), unitPreference);
  updatePaceValues('lt', paces.lt, convertToKmRange(paces.lt), unitPreference);
  updatePaceValues('hm', paces.hm, convertToKmRange(paces.hm), unitPreference);
  updatePaceValues('recovery', paces.recovery, convertToKmRange(paces.recovery), unitPreference);
  updatePaceValues('vo2', paces.vo2, convertToKmRange(paces.vo2), unitPreference);
  updatePaceValues('medlong', paces.medlong, convertToKmRange(paces.medlong), unitPreference);
  updatePaceValues('longrun', paces.longrun, convertToKmRange(paces.longrun), unitPreference);
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
  const unitSelector = document.getElementById('unit-selector');

  // Try to load saved values from localStorage
  const savedDate = loadMarathonDate();
  const savedGoalTime = loadGoalTime();
  const savedUnitPreference = loadUnitPreference();

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

  // Set saved unit preference
  unitSelector.value = savedUnitPreference;

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

  // Add event listener for unit selector changes
  unitSelector.addEventListener('change', function () {
    // Save the new unit preference to localStorage
    saveUnitPreference(unitSelector.value);
    // Update the pace display
    updatePaceDisplay();
  });

  // Initial updates
  updateDates();
  updatePaceDisplay();
  
  // Initialize intervals.icu collapsible sections
  initIntervalsToggles();
});

// Initialize collapsible intervals.icu sections
function initIntervalsToggles() {
  const toggles = document.querySelectorAll('.intervals-toggle');
  
  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      
      // Toggle active class on button
      this.classList.toggle('active');
      
      // Toggle show class on content
      content.classList.toggle('show');
    });
  });
  
  // Initialize copy buttons
  const copyBtns = document.querySelectorAll('.copy-btn');
  
  copyBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      
      const codeElement = this.closest('.intervals-day').querySelector('.intervals-code');
      if (!codeElement) return;
      
      const text = codeElement.textContent;
      
      navigator.clipboard.writeText(text).then(() => {
        this.classList.add('copied');
        this.textContent = 'Copied!';
        
        setTimeout(() => {
          this.classList.remove('copied');
          this.textContent = 'Copy';
        }, 2000);
      });
    });
  });
}
