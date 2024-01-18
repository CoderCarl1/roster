import { dates } from '~/functions';

describe('DATE FUNCTIONS', () => {
    describe('parseDate', () => {
        const { parseDate } = dates;
        test('should parse a valid date string and return a Date object', () => {
            const input = '2022-01-01T12:34:56.789Z';
            const result = parseDate(input);

            expect(result).toBeInstanceOf(Date);
            expect(result.toISOString()).toBe(input);
        });

        test('should return a Date object unchanged', () => {
            const input = new Date('2022-01-01T12:34:56.789Z');
            const result = parseDate(input);

            expect(result.toISOString()).toBe(input.toISOString());
        });

        test('should throw an error for an invalid date string', () => {
            const invalidDateString = 'invalid-date-string';

            expect(() => parseDate(invalidDateString)).toThrow(
                'Invalid date string provided.'
            );
        });

        test('should throw an error for an invalid date object', () => {
            const invalidDateObject = new Date('invalid-date-string');

            expect(() => parseDate(invalidDateObject)).toThrow(
                'Invalid date provided.'
            );
        });

        test('should throw an error for an invalid input type', () => {
            const invalidInput = 42; // Not a string or Date

            expect(() => parseDate(invalidInput)).toThrow(
                'Invalid date type provided.'
            );
        });
    });
    describe('localTimeStringFromDate', () => {
        const { localTimeStringFromDate } = dates;
        test('should return a string in the format of hh:mm in 24hour time', () => {
            const input = new Date(2022, 1, 1, 12, 34);
            const hours = input.getHours();
            const minutes = input.getMinutes();
            const result = localTimeStringFromDate(input);

            expect(typeof result).toBe('string');
            expect(result.split(':').length).toBe(2);
            expect(result).toBe(`${hours}:${minutes}`);
        });
    });
    describe('dayNumberFromDate', () => {
        const { dayNumberFromDate } = dates;
        test('should return the day number for a valid date string', () => {
            const input = '2022-01-15T12:34:56.789Z';
            const expectedResult = '15';
            const result = dayNumberFromDate(input);
            expect(result).toBe(expectedResult);
        });
    });

    describe('startOfWeek', () => {
        const { startOfWeek } = dates;

        test('should return the start of the week for a date in the middle of the week', () => {
            const inputDate = new Date('2022-01-12'); // Wednesday
            const expectedResult = new Date('2022-01-09'); // Sunday
            const result = startOfWeek(inputDate);

            expect(result.toISOString()).toBe(expectedResult.toISOString());
        });
        test('should return the start of the week for a date at the beginning of the week', () => {
            const inputDate = new Date('2022-01-09'); // Sunday
            const expectedResult = new Date('2022-01-09'); // Sunday
            const result = startOfWeek(inputDate);

            expect(result.toISOString()).toBe(expectedResult.toISOString());
        });
        test('should return the start of the week for a date at the end of the week', () => {
            const inputDate = new Date('2022-01-15'); // Saturday
            const expectedResult = new Date('2022-01-09'); // Sunday
            const result = startOfWeek(inputDate);

            expect(result.toISOString()).toBe(expectedResult.toISOString());
        });
    });

    describe('endOfWeek', () => {
        const { endOfWeek } = dates;

        test('should return the end of the week for a date in the middle of the week', () => {
            const inputDate = new Date('2022-01-12'); // Wednesday
            const expectedResult = new Date('2022-01-15'); // Saturday of the same week
            const result = endOfWeek(inputDate);

            expect(result.toISOString()).toBe(expectedResult.toISOString());
        });

        test('should return the end of the week for a date at the beginning of the week', () => {
            const inputDate = new Date('2022-01-09'); // Sunday
            const expectedResult = new Date('2022-01-15'); // Saturday of the same week
            const result = endOfWeek(inputDate);

            expect(result.toISOString()).toBe(expectedResult.toISOString());
        });

        test('should return the end of the week for a date at the end of the week', () => {
            const inputDate = new Date('2022-01-15'); // Saturday
            const expectedResult = new Date('2022-01-15'); // Saturday of the same week
            const result = endOfWeek(inputDate);

            expect(result.toISOString()).toBe(expectedResult.toISOString());
        });
    });

    describe('getDaysInMonth', () => {
        const { getDaysInMonth } = dates;

        test('should return the correct number of days for a month with 31 days', () => {
            const result = getDaysInMonth(2022, 7); // August 2022
            expect(result).toBe(31);
        });

        test('should return the correct number of days for a month with 30 days', () => {
            const result = getDaysInMonth(2022, 3); // April 2022
            expect(result).toBe(30);
        });

        test('should return the correct number of days for a leap year', () => {
            const result = getDaysInMonth(2020, 1); // February 2020
            expect(result).toBe(29);
        });
        test('should throw an error for an invalid month (less than 0)', () => {
            expect(() => getDaysInMonth(2021, -1)).toThrow(
                'Invalid month provided: -1'
            );
        });

        test('should throw an error for an invalid month (greater than 11)', () => {
            expect(() => getDaysInMonth(2021, 12)).toThrow(
                'Invalid month provided: 12'
            );
        });
    });

    describe('getNumberOfDays', () => {
        const { getNumberOfDays } = dates;

        test('should return the correct number of days for a range within the same month', () => {
            const start = new Date('2022-01-10');
            const end = new Date('2022-01-20');
            const result = getNumberOfDays(start, end);

            expect(result).toBe(11); // Including both start and end dates
        });

        test('should return the correct number of days for a range spanning multiple months', () => {
            const start = new Date('2022-01-25');
            const end = new Date('2022-02-05');
            const result = getNumberOfDays(start, end);

            expect(result).toBe(12); // Including both start and end dates
        });

        test('should return the correct number of days for a range spanning multiple years', () => {
            const start = new Date('2021-12-25');
            const end = new Date('2022-01-05');
            const result = getNumberOfDays(start, end);

            expect(result).toBe(12); // Including both start and end dates
        });

        test('should return 1 for the same start and end date', () => {
            const date = new Date('2022-03-15');
            const result = getNumberOfDays(date, date);

            expect(result).toBe(1);
        });

        test('should throw an error for an invalid start date', () => {
            const invalidStartDate = 'invalid-date-string';
            const end = new Date('2022-03-20');
            let result;
            try {
                // @ts-ignore
                getNumberOfDays(invalidStartDate, end);
            } catch (err) {
                result = err;
            }

            expect(result instanceof Error).toBe(true);
        });

        test('should throw an error for an invalid end date', () => {
            const start = new Date('2022-03-15');
            const invalidEndDate = 'invalid-date-string';
            let result;

            try {
                // @ts-ignore
                getNumberOfDays(start, invalidEndDate);
            } catch (err) {
                result = err;
            }

            expect(result instanceof Error).toBe(true);
        });
    });

    describe('incrementDayByOne', () => {
        const { incrementDayByOne } = dates;

        test('should increment a date by one day', () => {
            const inputDate = new Date('2022-01-15');
            const expectedDate = new Date('2022-01-16');
            const result = incrementDayByOne(inputDate);

            expect(result.toISOString()).toBe(expectedDate.toISOString());
        });
        test('should handle leap years correctly', () => {
            const inputDate = new Date('2020-02-28'); // Leap year
            const expectedDate = new Date('2020-02-29'); // Next day
            const result = incrementDayByOne(inputDate);

            expect(result.toISOString()).toBe(expectedDate.toISOString());
        });
        test('should handle the end of a month correctly', () => {
            const inputDate = new Date('2022-01-31');
            const expectedDate = new Date('2022-02-01'); // Next day and next month
            const result = incrementDayByOne(inputDate);

            expect(result.toISOString()).toBe(expectedDate.toISOString());
        });
        test('should not modify the input date', () => {
            const inputDate = new Date('2022-01-15');
            const result = incrementDayByOne(inputDate);

            expect(result).not.toBe(inputDate); // Ensure the input date is not modified
        });
    });

    describe('getDayName', () => {
        const { getDayName } = dates;

        test('should return the correct day name for a specific date', () => {
            const inputDate = new Date('2022-01-15');
            const expectedDayName = 'Saturday';
            const result = getDayName(inputDate);

            expect(result).toBe(expectedDayName);
        });
        test('should return the correct day name for a different date', () => {
            const inputDate = new Date('2022-02-01');
            const expectedDayName = 'Tuesday';
            const result = getDayName(inputDate);

            expect(result).toBe(expectedDayName);
        });
        test('should not modify the input date', () => {
            const inputDate = new Date('2022-01-15');
            const testDate = new Date('2022-01-15');
            const result = getDayName(inputDate);

            expect(result).not.toBe(inputDate); // Ensure the input date is not modified
            expect(inputDate.getDate()).toBe(testDate.getDate());
        });
        test('should handle invalid date gracefully', () => {
            const invalidDate = 'invalid-date-string';
            const result = getDayName(invalidDate as any); // @ts-ignore

            expect(result).toBe('day name not found');
        });
    });

    describe('getMonthName', () => {
        const { getMonthName } = dates;

        test('should return the correct month name for a specific date', () => {
            const inputDate = new Date('2022-01-15');
            const expectedMonthName = 'January';
            const result = getMonthName(inputDate);

            expect(result).toBe(expectedMonthName);
        });
        test('should return the correct month name for a different date', () => {
            const inputDate = new Date('2022-02-01');
            const expectedMonthName = 'February';
            const result = getMonthName(inputDate);

            expect(result).toBe(expectedMonthName);
        });
        test('should not modify the input date', () => {
            const inputDate = new Date('2022-01-15');
            const testDate = new Date('2022-01-15');
            const result = getMonthName(inputDate);

            expect(result).not.toBe(inputDate);
            expect(inputDate.getDate()).toBe(testDate.getDate());
        });
        test('should handle invalid date gracefully', () => {
            const invalidDate = 'invalid-date-string';
            const result = getMonthName(invalidDate as any); // @ts-ignore

            expect(result).toBe('month name not found');
        });
    });
    describe('getDateRange', () => {
        const { getDateRange } = dates;

        test("should return today's date range for zero days in the future", () => {
            const result = getDateRange(new Date(), 0, true);
            const today = new Date();
            const options: Intl.DateTimeFormatOptions = {
                month: 'long',
                day: 'numeric',
            };
            const expectedFrom = today.toLocaleString(undefined, options);
            const expectedTo = today.toLocaleString(undefined, options);
            expect(result).toEqual({ from: expectedFrom, to: expectedTo });
        });

        test('should return a date range in the future for positive days', () => {
            const result = getDateRange(new Date('2022-01-15'), 5, true);
            const expectedFrom = 'January 15';
            const expectedTo = 'January 20';
            expect(result).toEqual({ from: expectedFrom, to: expectedTo });
        });

        test('should return a date range in the past for negative days', () => {
            const result = getDateRange(new Date('2022-01-15'), 5, false);
            const expectedFrom = 'January 10';
            const expectedTo = 'January 15';
            expect(result).toEqual({ from: expectedFrom, to: expectedTo });
        });

        test('should handle zero days for a date in the future', () => {
            const result = getDateRange(new Date('2022-01-15'), 0, true);
            const expectedFrom = 'January 15';
            const expectedTo = 'January 15';
            expect(result).toEqual({ from: expectedFrom, to: expectedTo });
        });

        test('should handle zero days for a date in the past', () => {
            const result = getDateRange(new Date('2022-01-15'), 0, false);
            const expectedFrom = 'January 15';
            const expectedTo = 'January 15';
            expect(result).toEqual({ from: expectedFrom, to: expectedTo });
        });

        test('should handle invalid dates gracefully', () => {
            const invalidDate = 'invalid-date-string';
            const result = getDateRange(invalidDate as any, 3, true); // @ts-ignore
            expect(result).toEqual({
                from: 'Invalid Date',
                to: 'Invalid Date',
            });
        });

        test('should return invalid date obj when receive negative days ', () => {
            const result = getDateRange(new Date('2022-01-15'), -3, true);

            expect(result).toEqual({
                from: 'Invalid Date',
                to: 'Invalid Date',
            });
        });
    });
    describe('calculateFutureDate', () => {
        const { calculateFutureDate } = dates;

        test('should return the correct date for a future date in the same month', () => {
            const currentDate = new Date('2022-03-15');
            const futureDate = new Date('2022-03-20');
            const calculatedFutureDate = calculateFutureDate(currentDate, 5);

            expect(formatDate(calculatedFutureDate)).toBe(
                formatDate(futureDate)
            );
        });

        test('should return the correct date for a future date in the next month', () => {
            const currentDate = new Date('2022-03-25');
            const futureDate = new Date('2022-04-04');
            const calculatedFutureDate = calculateFutureDate(currentDate, 10);

            expect(formatDate(calculatedFutureDate)).toBe(
                formatDate(futureDate)
            );
        });

        test('should return the correct date for a future date spanning multiple months', () => {
            const currentDate = new Date('2022-01-25');
            const futureDate = new Date('2022-09-04');
            const calculatedFutureDate = calculateFutureDate(currentDate, 222);

            expect(formatDate(calculatedFutureDate)).toBe(
                formatDate(futureDate)
            );
        });

        test('should handle leap years correctly', () => {
            const currentDate = new Date('2020-02-28');
            const futureDate = new Date('2020-03-04');
            const calculatedFutureDate = calculateFutureDate(currentDate, 5);

            expect(formatDate(calculatedFutureDate)).toBe(
                formatDate(futureDate)
            );
        });
    });

    describe('calculatePastDate', () => {
        const { calculatePastDate } = dates;

        test('should return the correct date for a past date in the same month', () => {
            const currentDate = new Date('2022-03-15');
            const pastDate = new Date('2022-03-10');
            const calculatedPastDate = calculatePastDate(currentDate, 5);

            expect(formatDate(calculatedPastDate)).toBe(formatDate(pastDate));
        });

        test('should return the correct date for a past date in the previous month', () => {
            const currentDate = new Date('2022-05-01');
            const pastDate = new Date('2022-04-21');
            const calculatedPastDate = calculatePastDate(currentDate, 10);

            expect(formatDate(calculatedPastDate)).toBe(formatDate(pastDate));
        });

        test('should handle leap years correctly', () => {
            const currentDate = new Date('2020-03-01');
            const pastDate = new Date('2020-02-25');
            const calculatedPastDate = calculatePastDate(currentDate, 5);

            expect(formatDate(calculatedPastDate)).toBe(formatDate(pastDate));
        });
    });
});

function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString(undefined, options);
}
