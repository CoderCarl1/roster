type colorKey =
    | 'reset'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white';

const colors: Record<colorKey, string> = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};

function logStackTrace(stackTrace: string): void {
    console.error(`${colors.red}${stackTrace}${colors.reset}`);
}

function log(...args: unknown[]): void {
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    let color: colorKey = 'reset'; // Default color

    // Check if 'color' is present in the arguments
    const colorArgIndex = args.findIndex(
        (arg) => typeof arg === 'object' && arg !== null && 'color' in arg
    );

    if (colorArgIndex !== -1) {
        color = (args[colorArgIndex] as { color: colorKey }).color || 'reset';

        // Remove the 'color' argument from the array
        args.splice(colorArgIndex, 1);
    }

    const colorCode = colors[color];
    let formattedText = '';
    const nonText: unknown[] = [];
    let errStack;

    args.forEach((arg) => {
        if (typeof arg === 'string') {
            formattedText += colorCode
                ? `${colorCode}${arg}${colors.reset}`
                : arg;
        } else if (arg instanceof Error) {
            formattedText += `${colors.red}${arg.message}${colors.reset}`;
            errStack = arg.stack;
        } else if (typeof arg === 'object' && arg !== null) {
            if ('errorData' in arg) {
                formattedText += `${colors.red}${arg.errorData}${colors.reset}`;
            } else if ('data' in arg) {
                formattedText += `${colorCode}${JSON.stringify(
                    arg.data,
                    null,
                    2
                )}${colors.reset}`;
            }
        } else {
            nonText.push(arg);
        }
    });

    console.log(formattedText);

    if (errStack !== undefined) {
        logStackTrace(errStack);
    }

    if (nonText.length > 0) {
        console.log(...nonText);
    }
}

export default log;
