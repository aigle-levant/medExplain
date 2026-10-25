/**
 * Default meal timings in 24-hour format (HH:mm)
 */
export const DEFAULT_MEAL_TIMINGS = {
  breakfast: '08:30',
  lunch: '13:30',
  dinner: '20:30'
};

/**
 * Standard offset in minutes for taking medicine relative to meal
 */
export const MEAL_OFFSETS = {
  before_food: -30, // 30 minutes before meal
  after_food: 30,   // 30 minutes after meal
  with_food: 0      // At meal time
};

/**
 * Parses "HH:mm" string into hours and minutes integers
 */
export const parseTimeString = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
    return { hours: 8, minutes: 0 };
  }
  const [hours, minutes] = timeStr.split(':').map((val) => parseInt(val.trim(), 10));
  return {
    hours: isNaN(hours) ? 8 : Math.max(0, Math.min(23, hours)),
    minutes: isNaN(minutes) ? 0 : Math.max(0, Math.min(59, minutes))
  };
};

/**
 * Adjusts a time (hours, minutes) by offset minutes (positive or negative)
 */
export const adjustTimeByMinutes = (hours, minutes, offsetMinutes) => {
  let totalMinutes = hours * 60 + minutes + offsetMinutes;
  
  // Wrap around 24 hours if needed
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  totalMinutes = totalMinutes % (24 * 60);

  const adjustedHours = Math.floor(totalMinutes / 60);
  const adjustedMinutes = totalMinutes % 60;

  return {
    hours: adjustedHours,
    minutes: adjustedMinutes
  };
};

/**
 * Formats a Date object or date-parts into an ISO 8601 string without UTC conversion
 * for Google Calendar with explicit timeZone: "YYYY-MM-DDTHH:mm:ss"
 */
export const formatCalendarDateTime = (year, month, day, hours, minutes, seconds = 0) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Calculates start and end times for a medicine reminder slot based on user's meal timings
 * @param {string} slot - 'breakfast' | 'lunch' | 'dinner'
 * @param {string} foodTiming - 'before_food' | 'after_food' | 'with_food'
 * @param {Object} userMealTimings - e.g. { breakfast: '08:30', lunch: '13:30', dinner: '20:30' }
 * @param {string} [startDateStr] - Starting date "YYYY-MM-DD", defaults to today
 * @returns {{ startDateTime: string, endDateTime: string, reminderTimeStr: string }}
 */
export const calculateReminderTime = (
  slot,
  foodTiming = 'after_food',
  userMealTimings = DEFAULT_MEAL_TIMINGS,
  startDateStr = null
) => {
  const mealTimeStr = userMealTimings[slot] || DEFAULT_MEAL_TIMINGS[slot] || '08:30';
  const { hours, minutes } = parseTimeString(mealTimeStr);
  const offset = MEAL_OFFSETS[foodTiming] ?? MEAL_OFFSETS.after_food;
  const adjusted = adjustTimeByMinutes(hours, minutes, offset);

  // Determine starting date
  let dateObj = new Date();
  if (startDateStr) {
    const parsed = new Date(startDateStr);
    if (!isNaN(parsed.getTime())) {
      dateObj = parsed;
    }
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  const startDateTime = formatCalendarDateTime(year, month, day, adjusted.hours, adjusted.minutes, 0);

  // End event 15 minutes after start
  const endAdjusted = adjustTimeByMinutes(adjusted.hours, adjusted.minutes, 15);
  const endDateTime = formatCalendarDateTime(year, month, day, endAdjusted.hours, endAdjusted.minutes, 0);

  const pad = (n) => String(n).padStart(2, '0');
  const reminderTimeStr = `${pad(adjusted.hours)}:${pad(adjusted.minutes)}`;

  return {
    startDateTime,
    endDateTime,
    reminderTimeStr
  };
};

/**
 * Builds RFC 5545 recurrence rule array for Google Calendar
 */
export const buildRecurrenceRule = (durationDays = 5) => {
  const count = Math.max(1, parseInt(durationDays, 10) || 5);
  return [`RRULE:FREQ=DAILY;COUNT=${count}`];
};
