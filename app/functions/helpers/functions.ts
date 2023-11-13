/**
 * Debounces a function to be called after a specified delay.
 *
 * @param func The function to debounce.
 * @param delay The delay (in milliseconds) before the debounced function is called.
 * @param args The arguments to pass to the debounced function.
 * @example
 * debounce(searchAddress, 300, searchString);
 */

type debounceProps<T> = {
  func: (args: T) => void;
  delay: number;
  args: T;
};
function debounce<T>({ func, delay, args }: debounceProps<T>): void {
  let debounceTimer: NodeJS.Timeout | null = null;

  function setTimer() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      func(args);
    }, delay);
  }

  setTimer();
}

/**
 * Get a date range based on a given date and a specified number of days.
 *
 * @param date - The reference date. Defaults to the current date.
 * @param days - The number of days to go back from the reference date. Defaults to 0.
 * @param future - Set to true to get a future date range, false for a past date range. Defaults to true.
 * @returns An object with "from" set to the oldest date and "to" set to the most recent date.
 *
 */
export function getDateRange(
  date: Date | string = new Date(),
  days = 0,
  future = true,
): { from: Date; to: Date } {
  let dateObj;

  if (typeof date === "string") {
    const parsedDate = new Date(date);

    if (!isNaN(parsedDate.getTime())) {
      dateObj = parsedDate;
    } else {
      throw new Error("Invalid date string provided.");
    }
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    throw new Error("Invalid date type provided.");
  }

  const today = new Date();

  if (future) {
    dateObj.setDate(dateObj.getDate() + days);
  } else {
    dateObj.setDate(dateObj.getDate() - days);
  }

  dateObj.setHours(0, 0, 0, 0);

  today.setHours(23, 59, 59, 999);
  const from = dateObj < today ? dateObj : today;
  const to = dateObj < today ? today : dateObj;

  return { from, to };
}

/**
 * MISC
 */

type colorKey =
  | "reset"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white";

const colors: Record<colorKey, string> = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

export function log(color: colorKey, ...args: any[]): void {
  // Check if a color is specified
  const colorCode = colors[color];
  const formattedText = colorCode
    ? `${colorCode}${args.join(" ")}${colors.reset}`
    : args.join(" ");

  console.log(formattedText);
}
