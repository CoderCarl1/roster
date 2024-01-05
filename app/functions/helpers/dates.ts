import log from './log';

/**
 * Parses a date or date string and returns a valid Date object.
 *
 * @param possibleDate - The value to be parsed. Should be either a string representing a date or a Date object.
 * @throws {Error} If the provided value is not a string or Date.
 * @throws {Error} If the provided string is not a valid date string.
 * @throws {Error} If the resulting Date object is not a valid date.
 * @returns A valid Date object.
 */
export function parseDate(possibleDate: unknown): Date {
    if (typeof possibleDate !== 'string' && !(possibleDate instanceof Date)) {
        throw new Error('Invalid date type provided.');
    }

    if (typeof possibleDate === 'string') {
        if (isNaN(Date.parse(possibleDate))) {
            throw new Error('Invalid date string provided.');
        }
    }

    const dateObj = new Date(possibleDate);

    if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided.');
    }

    return dateObj;
}

export function formatDate(dateString: Date | string): string {
    const date = parseDate(dateString);

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

    return date.toLocaleString(undefined, options);
}

export function dayNumberFromDate(dateString: Date | string) {
    const date = parseDate(dateString);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
    };
    return date.toLocaleString(undefined, options);
}

function dayNumberFromParsedDate(dateString: Date | string) {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
    };
    return dateString.toLocaleString(undefined, options);
}

function getMonthNumberFromDate(dateString: Date | string){
    const date = parseDate(dateString);
    const options: Intl.DateTimeFormatOptions = {
        month: 'numeric',
    };
    return date.toLocaleString(undefined, options);
}
function getMonthNumberFromParsedDate(dateString: Date | string){
    const options: Intl.DateTimeFormatOptions = {
        month: 'numeric',
    };
    return dateString.toLocaleString(undefined, options);
}

// const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export function startOfWeek(date: Date) {
    const currentDate = parseDate(date);
    const currentDayIndex = currentDate.getDay();

    const sundayDate = new Date(currentDate);
    sundayDate.setDate(currentDate.getDate() - currentDayIndex);
    return sundayDate;
}
export function startOfWeekFromParsedDate(currentDate: Date) {
    const currentDayIndex = currentDate.getDay();
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
 * endOfWeek(inputDate);
 * Output: Sat Dec 17 2023 23:59:59 GMT+0000 (Coordinated Universal Time)
 */
export function endOfWeek(date: Date) {
    const currentDate = parseDate(date);
    const currentDayIndex = currentDate.getDay();
    const daysUntilSaturday = 6 - currentDayIndex;

    const endOfWeekDate = new Date(currentDate);
    endOfWeekDate.setDate(currentDate.getDate() + daysUntilSaturday);

    return endOfWeekDate;
}

export function getDaysInMonth(year: number, month: number) {
    console.log("received month", month)
    if (month < 0 || month > 11) {
        throw new Error(`Invalid month provided: ${month}`);
    }
    return new Date(year, month + 1, 0).getDate();
}

/**
 * Calculates the number of days between two dates, inclusive.
 *
 * @param start - The start date.
 * @param end - The end date.
 * @returns The number of days between the two dates, inclusive.
 * @example
 * const startDate = new Date('2023-12-15');
 * const endDate = new Date('2023-12-20');
 * getNumberOfDays(startDate, endDate);
 * Output: 6
 */
export function getNumberOfDays(start: Date, end: Date): number {
    const startDate = parseDate(start);
    const endDate = parseDate(end);

    const oneDay = 24 * 60 * 60 * 1000;

    const startUtc = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );
    const endUtc = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    return Math.abs(Math.round((endUtc - startUtc) / oneDay)) + 1;
}

function getNumberOfDaysFromParsedDates(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;

    const startUtc = Date.UTC(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );
    const endUtc = Date.UTC(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    return Math.abs(Math.round((endUtc - startUtc) / oneDay)) + 1;
}

export function incrementDayByOne(date: Date): Date {
    const nextDate = parseDate(date);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
}
export function getDayName(date: Date) {
    try {
        const dateClone = parseDate(date);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
        return dateClone.toLocaleDateString('en-US', options);
    } catch (err) {
        return 'day name not found';
    }
}
export function getMonthName(date: Date) {
    try {
        const dateClone = parseDate(date);
        const options: Intl.DateTimeFormatOptions = { month: 'long' };
        return dateClone.toLocaleDateString('en-US', options);
    } catch (err) {
        return 'month name not found';
    }
}

export function getMonthNameByNumber(monthNum: number) {
    try {
        if (monthNum > 11 || monthNum < 0) {
            throw new Error();
        }
        const monthNames = [
            'January','February','March','April','May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          
        return monthNames[monthNum];
    } catch (err) {
        return `month name not found by given number ${monthNum}`;
    }
}

type visibleDayType = {
    number: string;
    inMonth: boolean;
    date: Date;
}
function getVisibleDayNumbersInArray(date: Date){
    const calendarMonth: visibleDayType[][] = [];
    const currentDate = parseDate(date);
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    );
    let startDate = startOfWeekFromParsedDate(firstDayOfMonth);

    let newYear = currentDate.getFullYear();
    let newMonth = currentDate.getMonth() + 1;

    if (newMonth > 11){
        newMonth = 1;
        newYear = currentDate.getFullYear() + 1;
    }

    const lastDayOfMonth = new Date(newYear,newMonth, 0);
    const endDate = endOfWeek(lastDayOfMonth);

    const totalDays = getNumberOfDaysFromParsedDates(startDate, endDate);
    const numberOfWeeks = Math.ceil(totalDays / 7);

    for (let week = 0; week < numberOfWeeks; week++) {
        const calendarWeek: visibleDayType[] = [];

        for (let day = 0; day < 7; day++) {
            const calendarDay = {
                number: dayNumberFromParsedDate(startDate),
                inMonth: startDate.getMonth() === currentDate.getMonth(),
                date: startDate,
            };
            calendarWeek.push(calendarDay);

            startDate = incrementDayByOne(startDate);
        }

        calendarMonth.push(calendarWeek);
    }
    return calendarMonth;
}

/**
 * Get a date range based on a given date and a specified number of days.
 *
 * @param date - The reference date. Defaults to the current date.
 * @param days - The number of days to go back from the reference date. Defaults to 0.
 * @param future - Set to true to get a future date range, false for a past date range. Defaults to true.
 * @returns An object with "from" and "to" strings with the short day, and et to the most recent date.
 *
 */
export function getDateRange(
    date: Date | string = new Date(),
    days = 0,
    future = true
): { from: string; to: string } {
    try {
        if (isNaN(days) || days < 0) {
            throw new Error('Days must be a non-negative number.');
        }
        const dateObj = parseDate(date);
        const adjustedDate = future
            ? calculateFutureDate(dateObj, days)
            : calculatePastDate(dateObj, days);

        adjustedDate.setHours(0, 0, 0, 0);
        dateObj.setHours(0, 0, 0, 0);

        const from = adjustedDate < dateObj ? adjustedDate : dateObj;
        const to = adjustedDate < dateObj ? dateObj : adjustedDate;

        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
        };

        const startDateString = from.toLocaleString(undefined, options);
        const endDateString = to.toLocaleString(undefined, options);

        return { from: startDateString, to: endDateString };
    } catch (err) {
        log('getDateRange threw', { errorData: err });
        return { from: 'Invalid Date', to: 'Invalid Date' };
    }
}

export function calculateFutureDate(date: Date, dayNumber: number) {
    const clonedDate = parseDate(date);
    let newDay = clonedDate.getDate();
    let newMonth = clonedDate.getMonth();
    let newYear = clonedDate.getFullYear();
    const daysInCurrentMonth = getDaysInMonth(newYear, newMonth);

    if (newDay + dayNumber <= daysInCurrentMonth) {
        newDay += dayNumber;
    } else {
        let daysToAdd = dayNumber - (daysInCurrentMonth - newDay);
        while (daysToAdd > 0) {
            newMonth += 1;

            if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
            }

            const daysInNextMonth = getDaysInMonth(newYear, newMonth);
            newDay = daysToAdd <= daysInNextMonth ? daysToAdd : daysInNextMonth;
            daysToAdd -= daysInNextMonth;
        }
    }
    return new Date(newYear, newMonth, newDay);
}

export function calculatePastDate(date: Date, dayNumber: number) {
    const clonedDate = parseDate(date);

    let newDay = clonedDate.getDate();
    let newMonth = clonedDate.getMonth();
    let newYear = clonedDate.getFullYear();

    if (newDay >= dayNumber) {
        newDay -= dayNumber;
    } else {
        if (newMonth - 1 < 0) {
            newMonth = 11;
            newYear = newYear - 1;    
        }
        let daysInPreviousMonth = getDaysInMonth(newYear, newMonth - 1);

        while (newDay < dayNumber) {
            newMonth -= 1;

            if (newMonth < 0) {
                newMonth = 11;
                newYear -= 1;
            }

            newDay += daysInPreviousMonth;
            daysInPreviousMonth = getDaysInMonth(newYear, newMonth - 1);
        }

        newDay -= dayNumber;
    }

    return new Date(newYear, newMonth, newDay);
}

export default {
    calculateFutureDate,
    calculatePastDate,
    dayNumberFromDate,
    endOfWeek,
    formatDate,
    getDateRange,
    getDayName,
    getDaysInMonth,
    getMonthName,
    getNumberOfDays,
    getMonthNumberFromDate,
    getMonthNameByNumber,
    getVisibleDayNumbersInArray,
    incrementDayByOne,
    parseDate,
    startOfWeek,
};

