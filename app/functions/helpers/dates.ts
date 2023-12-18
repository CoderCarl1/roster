export function formatDate(dateString: Date | string) {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false, // Use 24-hour format
        timeZoneName: 'short',
    };

    // Format the date according to the user's locale
    return date.toLocaleString(undefined, options);
}
