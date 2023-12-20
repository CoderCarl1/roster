export function formatDate(dateString: Date | string) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {
        // year: 'numeric',
        // month: 'long',
        // day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        // second: 'numeric',
        hour12: false, // Use 24-hour format
        // timeZoneName: 'short',
    };

    // Format the date according to the user's locale
    return date.toLocaleString(undefined, options);
}

export function dayNumberFromDate(dateString: Date | string){
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',        
    };
    return date.toLocaleString(undefined, options);
}

// const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function startOfWeek(date: Date){
    const currentDate = new Date(date);
    const currentDayIndex =  currentDate.getDay()
    
    const sundayDate = new Date(currentDate);
    sundayDate.setDate(currentDate.getDate() - currentDayIndex);
    return sundayDate;
}

/**
 * Calculates the end of the week for a given date.
 *
 * @param date The input date.
 * @returns The end of the week date.
 * @example
 * const inputDate = new Date('2023-12-15');
 * const endOfWeekDate = endOfWeek(inputDate);
 * console.log(endOfWeekDate); // Output: Sat Dec 17 2023 23:59:59 GMT+0000 (Coordinated Universal Time)
 */
export function endOfWeek(date: Date) {
    const currentDate = new Date(date);
    const currentDayIndex = currentDate.getDay();
    const daysUntilSaturday = 6 - currentDayIndex;

    const endOfWeekDate = new Date(currentDate);
    endOfWeekDate.setDate(currentDate.getDate() + daysUntilSaturday);

    return endOfWeekDate;
}


export function getDaysInMonth(year: number, month: number) {
    const nextMonth = new Date(year, month, 0);
    return nextMonth.getDate();
}
/**
* Calculates the number of days between two dates, inclusive.
*
* @param {Date} startDate - The start date.
* @param {Date} endDate - The end date.
* @returns {number} - The number of days between the two dates, inclusive.
* @example
* const startDate = new Date('2023-12-15');
* const endDate = new Date('2023-12-20');
* const daysBetween = getNumberOfDays(startDate, endDate);
* console.log(daysBetween); // Output: 6
*/
export function getNumberOfDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;

    const startUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endUtc = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    return Math.abs(Math.round((endUtc - startUtc) / oneDay)) + 1;
}
export function incrementDayByOne(date: Date): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
}
export function getDayName(date: Date) {
    const dateClone = new Date(date)
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return dateClone.toLocaleDateString('en-US', options);
}