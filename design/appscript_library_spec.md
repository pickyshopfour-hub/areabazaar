# Appscript Library Specification - AreaBazaar (Phase 3)

This document defines the core Google Appscript Library system, following a modular architecture to handle Workspace operations as a "Bridge" for the AreaBazaar platform.

## 1. Library Modules (Handlers)

### A. `EmailMessageHandlers`
Responsible for throttled and queued communication.
- **`sendUrgentEmail(to, subject, body, attachments)`**: Bypasses the queue for critical alerts (e.g., surveillance flags).
- **`queueEmail(to, subject, body, attachments)`**: Appends email data to a `QueueSheet`.
- **`processEmailQueue()`**: Triggered every 5-15m. Sends a maximum of 5 emails per block, ensuring 5m gaps between blocks to stay within Google's quota limits.
- **`getQuotaStatus()`**: Checks remaining daily email recipients.

### B. `AccessControl & FolderOperationsHandlers`
Manages identity, file-level permissions, and directory structure.
- **`verifyPartnerAccess(userId, partnerType)`**: Checks if the user has access to specific warehouse or logistics folders.
- **`setUserPermissions(fileOrFolderId, email, role)`**: Assigns or changes access permissions for a user or group (viewer, editor, owner).
- **`getOrCreateFolder(path, parentId)`**: Navigates or creates a directory structure in Google Drive.
- **`cloneTemplate(templateId, destinationFolderId, newName)`**: Creates working copies of master sheets/docs.

### C. `FileExportHandlers`
Converts and exports data for SBAs/ZBDps.
- **`exportToPDF(fileId, folderId)`**: Converts Docs/Sheets to PDF.
- **`exportDocsTablesToJSON(docId)`**: Extracts all tables from a Google Doc and returns them as a structured JSON object.
- **`exportToJSON(data, fileName)`**: Saves data objects as .json files in Drive.
- **`exportToCSV(sheetId, folderId, fileName)`**: Generates static CSV snapshots.

### D. `FileContentManipulateHandlers`
The "CRUD" engine for document and sheet content.
- **`readDocBetweenMarkers(docId, startMarker, endMarker)`**: Returns content between two unique string markers in a Doc.
- **`substituteDocBetweenMarkers(docId, startMarker, endMarker, newContent)`**: Replaces content between markers with new text.
- **`readSheetByA1(sheetId, a1Key)`**: Returns the value (as JSON) from a sheet referenced by an A1 key (e.g., 'Sheet1!A1').
- **`replacePlaceholders(docId, replacementMap)`**: Uses regex to replace `{{marker}}` strings.
- **`appendRow(sheetId, values)`**: Thread-safe row addition.

### E. `BulkDataImportHandlers`
Handles complex ingestion and orchestration of data.
- **`importCSVToSheet(fileId, sheetId, range)`**: Parses a CSV file and writes it into a specific sheet range.
- **`importJSONToSheet(jsonData, sheetId, range)`**: Writes JSON data structures into a sheet.
- **`sortSheetRange(sheetId, range, columnIdx, ascending)`**: Sorts a data range by a specific column index.
- **`autoProjectRow(originSheetId, destSheetId, conditions)`**: Real-time projection of a row to a destination sheet if certain fields meet matching criteria.
- **`syncSheetToMySQL(sheetId, apiEndpoint)`**: Pushes rows to the backend REST service.

---

## 2. Shared Library Logic (Core Utils)

### `AuthManager`
- Manages the `OAuth2` service for authenticated requests back to the AreaBazaar REST API.
- Stores secure credentials in `PropertiesService`.

### `ResponseHandler`
- Standardizes JSON responses from the PHP backend.
- Handles standard I/O for `side-panel` UIs (error mapping, success toasts).

---

## 3. Deployment Strategy

### Script Structure
1.  **`AB_Library_Base`**: The core logic scripts (.gs files) containing the above handlers.
2.  **`AB_Operational_Scripts`**: Individual scripts attached to WHM/SBA Sheets that reference the `AB_Library_Base` via a shared Script ID.

### Referencing Logic
- Libraries are added via **Script ID** in the "Libraries" section of the Appscript IDE.
- Versioning: Use specific version tags (e.g., `v1.2`) to prevent breaking operational sheets during base library updates.
