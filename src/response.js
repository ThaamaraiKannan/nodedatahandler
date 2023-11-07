const { format } = require('date-fns');

function buildHeaders(context, methods = '', origin = '*', headers = 'Content-Type') {
  try {
    const utcTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    const awsRequestId = context.awsRequestId || 'Unknown';

    console.log('Time > ', utcTime);
    console.log('AWS Request ID > ', awsRequestId);

    const defaultMethods = 'OPTIONS,GET,POST';
    return {
      'Access-Control-Allow-Headers': headers,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': methods ? `${defaultMethods},${methods}` : defaultMethods
    };
  } catch (e) {
    console.error(`An error occurred in buildHeaders: ${e.message}`);
    // Return default headers if an error occurs
    return {
      'Access-Control-Allow-Headers': headers,
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'
    };
  }
}

function buildResponse(event, context, response, statusCode = 200, methods = '') {
  try {
    return {
      statusCode: statusCode,
      headers: buildHeaders(context, methods),
      body: JSON.stringify(response)
    };
  } catch (e) {
    console.error(`An error occurred in buildResponse: ${e.message}`);
    // Return a 500 Internal Server Error if something goes wrong
    return {
      statusCode: 500,
      headers: buildHeaders(context),
      body: JSON.stringify({ "error": "Internal Server Error" })
    };
  }
}

module.exports = { buildHeaders, buildResponse };