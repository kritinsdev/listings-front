export const relativeTime = (dateString) => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    givenDate.setUTCHours(0, 0, 0, 0);

    const differenceInDays = (currentDate - givenDate) / (1000 * 60 * 60 * 24);

    const formatTime = (date) => {
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();

        // Pad the minutes with a leading zero if necessary
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes}`;
    }

    if (differenceInDays === 0) {
        return `Today at ${formatTime(new Date(dateString))}`;
    } else if (differenceInDays === 1) {
        return `Yesterday at ${formatTime(new Date(dateString))}`;
    } else {
        return `${differenceInDays} days ago at ${formatTime(new Date(dateString))}`;
    }
}