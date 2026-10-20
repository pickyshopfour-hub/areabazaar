/**
 * AreaBazaar Finance Receiver Google App Script
 * To be deployed as a Web App with 15-minute time-driven trigger
 */

const CONFIG = {
    BANK_EMAIL: "alerts@somebank.com", // Replace with actual bank email
    SHEET_ID: "YOUR_GOOGLE_SHEET_ID_HERE", // Replace with target spreadsheet ID
    SHEET_NAME: "PushLogs", // Sheet where data is appended
    WEBHOOK_URL: "https://your-areabazaar-domain.com/api/webhook/bank-reports", // Receiver endpoint
    API_KEY: "areabazaar-finance-secret-key" // Secret parameter
};

function checkAndPushBankReports() {
    // 1. Access preset Gmail inbox, get unread messages from specific sender
    const query = `is:unread from:${CONFIG.BANK_EMAIL}`;
    const threads = GmailApp.search(query, 0, 50);

    if (threads.length === 0) {
        Logger.log("No new bank reports found.");
        return;
    }

    let reports = [];

    // 2. Extract different parts of the bank report into an array of objects
    threads.forEach(thread => {
        const messages = thread.getMessages();

        messages.forEach(msg => {
            if (!msg.isUnread()) return;

            const content = msg.getPlainBody();
            const subject = msg.getSubject();

            // Basic extraction logic (needs adjustment based on real bank email format)
            // Example regexes string matching:
            const amountMatch = content.match(/Amount:?[\s]*[A-Z]{3}?[\s]*([0-9,.]+)/i);
            const refMatch = content.match(/Reference:?[\s]*([A-Za-z0-9_-]+)/i);
            const narrationMatch = content.match(/Narration:?[\s]*(.*)/i);
            const dateMatch = content.match(/Date:?[\s]*(.*)/i);

            if (amountMatch && refMatch) {
                let report = {
                    bank_ref: refMatch[1].trim(),
                    amount: amountMatch[1].replace(/,/g, ''),
                    raw_narration: narrationMatch ? narrationMatch[1].trim() : subject,
                    transaction_date: dateMatch ? new Date(dateMatch[1].trim()).toISOString() : new Date().toISOString()
                };
                reports.push(report);

                // 3. Mark message as read and add label "extracted"
                msg.markRead();
            }
        });

        // Add "extracted" label
        let label = GmailApp.getUserLabelByName("extracted");
        if (!label) {
            label = GmailApp.createLabel("extracted");
        }
        thread.addLabel(label);
    });

    if (reports.length > 0) {
        pushToWebhook(reports);
    }
}

function pushToWebhook(reports) {
    // 4. Push data payload to webhook
    const payload = JSON.stringify({
        auth_key: CONFIG.API_KEY,
        reports: reports
    });

    const options = {
        method: "post",
        contentType: "application/json",
        payload: payload,
        muteHttpExceptions: true
    };

    let resultStatus = "push-failed";
    let responseText = "";

    try {
        const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
        responseText = response.getContentText();
        if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
            resultStatus = "pushed";
        }
    } catch (e) {
        responseText = e.toString();
    }

    // 5. Append to Google Sheet
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);

    reports.forEach(report => {
        sheet.appendRow([
            new Date(),
            report.bank_ref,
            report.amount,
            report.raw_narration,
            resultStatus,
            responseText
        ]);
    });
}

/**
 * Custom Menu script attached to the Google Sheet
 */
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('AreaBazaar Finance')
        .addItem('Retry Failed Pushes', 'retryFailedPushes')
        .addToUi();
}

function retryFailedPushes() {
    const sheet = SpreadsheetApp.openById(CONFIG.SHEET_ID).getSheetByName(CONFIG.SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    let toRetry = [];
    let rowIndices = [];

    // Assuming row 0 is headers, data is: [Timestamp, Ref, Amount, Narration, Status, Response]
    for (let i = 1; i < data.length; i++) {
        if (data[i][4] === "push-failed") {
            toRetry.push({
                bank_ref: data[i][1],
                amount: data[i][2],
                raw_narration: data[i][3],
                transaction_date: data[i][0] // fallback date
            });
            rowIndices.push(i + 1); // 1-indexed for Sheet rows
        }
    }

    if (toRetry.length === 0) {
        SpreadsheetApp.getUi().alert("No failed pushes to retry.");
        return;
    }

    const payload = JSON.stringify({
        auth_key: CONFIG.API_KEY,
        reports: toRetry
    });

    const options = {
        method: "post",
        contentType: "application/json",
        payload: payload,
        muteHttpExceptions: true
    };

    try {
        const response = UrlFetchApp.fetch(CONFIG.WEBHOOK_URL, options);
        if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
            // Update statuses to pushed
            rowIndices.forEach(row => {
                sheet.getRange(row, 5).setValue("pushed-retry");
                sheet.getRange(row, 6).setValue(response.getContentText());
            });
            SpreadsheetApp.getUi().alert("Successfully retried " + toRetry.length + " reports.");
        } else {
            SpreadsheetApp.getUi().alert("Retry failed with code: " + response.getResponseCode());
        }
    } catch (e) {
        SpreadsheetApp.getUi().alert("Retry fetch failed: " + e.toString());
    }
}
