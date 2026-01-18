// Training Plan - Shared JavaScript Utilities

// Storage utilities with namespacing
const TrainingStorage = {
  getKey: function(planType, key) {
    return `training_${planType}_${key}`;
  },

  save: function(planType, key, value) {
    localStorage.setItem(this.getKey(planType, key), value);
  },

  load: function(planType, key, defaultValue = null) {
    return localStorage.getItem(this.getKey(planType, key)) || defaultValue;
  },

  saveDate: function(planType, date) {
    this.save(planType, 'raceDate', date);
  },

  loadDate: function(planType) {
    return this.load(planType, 'raceDate');
  },

  saveGoalTime: function(planType, time) {
    this.save(planType, 'goalTime', time);
  },

  loadGoalTime: function(planType) {
    return this.load(planType, 'goalTime');
  },

  saveUnitPreference: function(planType, units) {
    this.save(planType, 'unitPreference', units);
  },

  loadUnitPreference: function(planType) {
    return this.load(planType, 'unitPreference', 'km');
  }
};

// Time parsing and formatting utilities
const TimeUtils = {
  // Parse time string (H:MM:SS or HH:MM:SS or M:SS or MM:SS) to total seconds
  parseTimeToSeconds: function(timeStr) {
    if (!timeStr) return null;

    const parts = timeStr.split(':');
    
    if (parts.length === 3) {
      // H:MM:SS or HH:MM:SS format
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      
      if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
          minutes >= 60 || seconds >= 60) return null;
      
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      // M:SS or MM:SS format
      const minutes = parseInt(parts[0]);
      const seconds = parseInt(parts[1]);
      
      if (isNaN(minutes) || isNaN(seconds) || seconds >= 60) return null;
      
      return minutes * 60 + seconds;
    }
    
    return null;
  },

  // Format seconds to time string (H:MM:SS or MM:SS)
  formatSecondsToTime: function(totalSeconds, includeHours = false) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (includeHours || hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  },

  // Format pace (seconds per unit) to MM:SS
  formatPace: function(secondsPerUnit) {
    const minutes = Math.floor(secondsPerUnit / 60);
    const seconds = Math.floor(secondsPerUnit % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

// Date utilities
const DateUtils = {
  // Calculate days between two dates
  daysBetween: function(date1, date2) {
    const timeDiff = date2.getTime() - date1.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  },

  // Get the Monday of the week containing a date
  getMonday: function(date) {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    d.setDate(d.getDate() - daysToSubtract);
    return d;
  },

  // Format date as short string (e.g., "Jan 15")
  formatShort: function(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  },

  // Check if today is within a week range
  isCurrentWeek: function(weekStartDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekStart = new Date(weekStartDate);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return today >= weekStart && today <= weekEnd;
  }
};

// Update week dates and highlight current week
function updateWeekDates(raceDate, weekDateCells) {
  const today = new Date();

  weekDateCells.forEach(cell => {
    const weeksToGo = parseInt(cell.dataset.week);
    const weekStartDate = new Date(raceDate);

    if (weeksToGo === 0) {
      // For race week, find the Monday of the race week
      const dayOfWeek = raceDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weekStartDate.setDate(raceDate.getDate() - daysToSubtract);
    } else {
      // Go back weeksToGo weeks from race date, then find the Monday
      weekStartDate.setDate(raceDate.getDate() - (weeksToGo * 7));

      const dayOfWeek = weekStartDate.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      weekStartDate.setDate(weekStartDate.getDate() - daysToSubtract);
    }

    cell.textContent = DateUtils.formatShort(weekStartDate);

    // Check if this is the current week
    const weekCard = cell.closest('.week-card');
    if (weekCard) {
      weekCard.classList.remove('current-week');

      if (DateUtils.isCurrentWeek(weekStartDate)) {
        weekCard.classList.add('current-week');
      }
    }
  });
}

// Initialize collapsible sections
function initCollapsibleSections() {
  const toggles = document.querySelectorAll('.intervals-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const content = this.nextElementSibling;
      this.classList.toggle('active');
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

// Export utilities for use in specific training pages
window.TrainingStorage = TrainingStorage;
window.TimeUtils = TimeUtils;
window.DateUtils = DateUtils;
window.updateWeekDates = updateWeekDates;
window.initCollapsibleSections = initCollapsibleSections;
