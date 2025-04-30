import { Log } from "../logging/log.js";

/**
 * sends an error response to the client.
 * @param {object} res 
 * @param {number} code 
 * @param {string} message 
 */
function SendErrorResponse(res, code, message) {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/txt');
    res.write(message);
    res.end("\n");
}

/**
 * Logs and creates an error response.
 * @param {object} res 
 * @param {Error} error 
 * @param {number} code 
 */
export function ErrorResponse(res, error, code) {
    Log (error, 'error');
    let message = '';
    switch (code) {
        case 400: message = 'Validation Error'; break;
        case 404: message = 'Page Not Found'; break;
        default: message = 'Internal Server Error';
    }
    SendErrorResponse(res, code, message);
}

/**Converts an error to a string.
 * @param { Error } error 
 * @returns { string } - Returns the error message as a string.
 */
export function ErrorToString(error) {
    if (error instanceof Error) {
        let cause = '';
        if (error.cause !== undefined) cause = `\n  [cause]: '${error.cause}'`;
        return error.stack + cause;
    }
}