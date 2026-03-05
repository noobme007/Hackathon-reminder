/**
 * Generates a Google Calendar link for a hackathon deadline.
 */
const generateGoogleCalendarLink = (name, deadline, type = 'Registration') => {
    const title = `${type} Deadline: ${name}`;
    const details = `Reminder for your hackathon: ${name}. Don't miss the ${type} deadline!`;

    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const startDate = new Date(deadline);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const gCalUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&sf=true&output=xml`;

    return gCalUrl;
};

module.exports = { generateGoogleCalendarLink };
