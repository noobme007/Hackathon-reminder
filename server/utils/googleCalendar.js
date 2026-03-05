const { google } = require('googleapis');

/**
 * Creates an event in the user's Google Calendar.
 */
const addEventToGoogleCalendar = async (user, hackathon) => {
    try {
        if (!user.accessToken) {
            console.error('❌ No Google Access Token for user:', user.email);
            return null;
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: user.accessToken,
            refresh_token: user.refreshToken
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const event = {
            summary: `🚀 Hackathon Deadline: ${hackathon.name}`,
            description: `Registration and PPT deadlines for ${hackathon.name}. Keep hacking!`,
            start: {
                dateTime: new Date(hackathon.registrationDeadline).toISOString(),
                timeZone: 'UTC',
            },
            end: {
                dateTime: new Date(new Date(hackathon.registrationDeadline).getTime() + 60 * 60 * 1000).toISOString(),
                timeZone: 'UTC',
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 1 day before
                    { method: 'popup', minutes: 60 },      // 1 hour before
                ],
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        console.log(`✅ Google Calendar event created: ${response.data.htmlLink}`);
        return response.data.htmlLink;
    } catch (error) {
        console.error('❌ Failed to add to Google Calendar:', error.message);
        return null;
    }
};

module.exports = { addEventToGoogleCalendar };
