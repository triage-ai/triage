export function relativeTime(dateInput, options = {}) {
    const {
        locale = 'en-US',
        numeric = 'auto', // 'auto' gives "yesterday", 'always' gives "1 day ago"
        fullDateFormat = { year: 'numeric', month: 'short', day: 'numeric' }
    } = options;

    const date = new Date(dateInput);
    const now = new Date();

    // Check for invalid date input
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const secondsElapsed = (date.getTime() - now.getTime()) / 1000;
    const minutesElapsed = secondsElapsed / 60;
    const hoursElapsed = minutesElapsed / 60;
    const daysElapsed = hoursElapsed / 24;
    const weeksElapsed = daysElapsed / 7;
    const monthsElapsed = daysElapsed / 30.44; // Average days in month
    const yearsElapsed = daysElapsed / 365.25; // Average days in year

    // --- Use Intl.RelativeTimeFormat ---
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: numeric });

    // Decide the best unit to use and format
    // Note: Order matters (check years first, then months, etc.)
    if (Math.abs(yearsElapsed) >= 1) {
        // If it's roughly a year or more, use the full date format
        return date.toLocaleDateString(locale, fullDateFormat);
    } else if (Math.abs(monthsElapsed) >= 1) {
        return rtf.format(Math.round(monthsElapsed), 'month');
    } else if (Math.abs(weeksElapsed) >= 1) {
        return rtf.format(Math.round(weeksElapsed), 'week');
    } else if (Math.abs(daysElapsed) >= 1) {
        return rtf.format(Math.round(daysElapsed), 'day');
    } else if (Math.abs(hoursElapsed) >= 1) {
        return rtf.format(Math.round(hoursElapsed), 'hour');
    } else if (Math.abs(minutesElapsed) >= 1) {
        return rtf.format(Math.round(minutesElapsed), 'minute');
    } else {
        // Handle very recent times specifically if desired, or let Intl handle seconds
        const roundedSeconds = Math.round(secondsElapsed);
        // Intl often shows "in 0 seconds" or "0 seconds ago" for very small differences.
        // You might want to override this for "just now".
        if (Math.abs(roundedSeconds) < 5 && numeric === 'auto') {
             // Check if it's slightly in the future or past
             return roundedSeconds <= 0 ? "just now" : "soon";
        }
        return rtf.format(roundedSeconds, 'second');
    }
}
