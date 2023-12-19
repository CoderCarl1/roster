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


export function startOfWeek(date: Date){
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDate = new Date(date);
    const currentDayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' })
    const currentDayIndex = daysOfWeek.indexOf(currentDayName.toLowerCase());

    const sundayDate = new Date(currentDate);
    sundayDate.setDate(currentDate.getDate() - currentDayIndex);
    console.log("returning date of ", sundayDate.getDay())
    return sundayDate;
}