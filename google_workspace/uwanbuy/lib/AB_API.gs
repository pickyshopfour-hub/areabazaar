/**
 * AB_API.gs
 * Central REST API client and webhook dispatcher for AreaBazaar and UwanBuy
 * Google Workspace operations.
 */

/**
 * Executes a REST call against the backend or invokes AB_Mock when mock mode is enabled.
 *
 * @param {string} endpointKey Key from AB.ENDPOINTS (e.g. 'PRODUCTS_LIST', 'INTAKE_POST')
 * @param {Object} [payload] Request payload for POST/PUT calls
 * @return {Object} Parsed JSON response
 */
function abApi(endpointKey, payload) {
  const endpoint = AB.ENDPOINTS[endpointKey];
  if (!endpoint) {
    throw new Error('Unknown API endpoint key: ' + endpointKey);
  }

  // Intercept and route to Mock fixtures when AB_MOCK_MODE is enabled
  if (abIsMock()) {
    if (typeof AB_Mock !== 'undefined' && AB_Mock.handle) {
      return AB_Mock.handle(endpointKey, payload);
    }
  }

  const baseUrl = abGetApiBase().replace(/\/+$/, '');
  const url = baseUrl + endpoint.path;
  const apiKey = abGetProp_(AB.PROPS.API_KEY, '');

  let userEmail = 'system@areabazaar.com';
  try {
    userEmail = Session.getActiveUser().getEmail() || userEmail;
  } catch (e) {
    // Outside Apps Script active session
  }

  const options = {
    method: endpoint.method.toLowerCase(),
    contentType: 'application/json',
    headers: {
      'X-AB-KEY': apiKey,
      'X-AB-STORE': AB.STORE,
      'X-AB-WORKSPACE-USER': userEmail,
      'Accept': 'application/json'
    },
    muteHttpExceptions: true
  };

  if (payload && (endpoint.method.toLowerCase() === 'post' || endpoint.method.toLowerCase() === 'put')) {
    options.payload = JSON.stringify(payload);
  }

  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    const body = response.getContentText();

    if (code < 200 || code >= 300) {
      throw new Error(`API Error [HTTP ${code}] at ${endpoint.path}: ${body}`);
    }

    return JSON.parse(body);
  } catch (err) {
    throw new Error(`abApi invocation failed for [${endpointKey}]: ${err.message}`);
  }
}

/**
 * Quick zero-argument test runner for the Apps Script Editor toolbar.
 * Select 'test_abApi' from the function dropdown and click Run to test.
 */
function test_abApi() {
  Logger.log('Testing abApi with endpoint PRODUCTS_LIST...');
  const res = abApi('PRODUCTS_LIST');
  Logger.log('Mock Response Received:\n' + JSON.stringify(res, null, 2));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { abApi };
}
