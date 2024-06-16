const { google } = require('googleapis');
const keys = require('./service-account.json'); // Adjust if necessary

const auth = new google.auth.GoogleAuth({
    keyFile: './service-account.json', // Adjust the path to your service account JSON file
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1Kmopb_-adko3-n8Pgxfuf1v7T3mwuoPC1uQpELq7drs'; // Replace with your Google Sheet ID

const appendToSheet = async (data) => {
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'publicity!A1', // Adjust the range according to your sheet
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [data],
            },
        });
        console.log('Data appended to Google Sheet');
    } catch (error) {
        console.error('Error appending data to Google Sheet:', error);
    }
};

module.exports = { appendToSheet };
