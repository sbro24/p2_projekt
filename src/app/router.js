import fs from 'fs';

import { Log } from '../lib/logging/log.js';
import { ErrorResponse } from '../lib/errorHandling/error.js';
import { Wait } from '../lib/time/time.js';

const pathHandlerDirctory = process.cwd() + '/src/app/pathHandlers/';
const relativePathHandlerDirctory = './pathHandlers/';

/**
 * Looks at the request method and calls the appropriate function.
 * @param {object} req 
 * @param {object} res 
 */
export function processRequest(req, res) {
    switch (req.method) {
        case 'POST':
            ExtractBody(req)
            .then(body => GetResponse(req, res, body))
            .catch(err => ErrorResponse(res, err, 500));
            break;
        case 'GET':
            GetResponse(req, res);
            break;
        default:
            ErrorResponse(res, Error('Method not allowed'), 405);
            break;
    }
}

/**
 * runs through all the .js files in the pathHandlers directory and calls the execute function in each file.
 * @param {object} req 
 * @param {object} res 
 * @param {string} data 
 */
async function GetResponse(req, res, data) {
    const pathHandlerFiles = fs.readdirSync(pathHandlerDirctory).filter(file => file.endsWith('.js'));
    for (const file of pathHandlerFiles) {
        import(relativePathHandlerDirctory + file)
        .then(router => router.execute(req, res, data))
        .catch(err => Log(err));
    }
    await Wait(100);
    if (!res.writableFinished) ErrorResponse(res, Error('Page not found'), 404);
}

/**
 * Extracts the body from the request.
 * @param {object} req 
 * @returns {Promise<string>} - Returns a promise that resolves to the body of the request.
 */
function ExtractBody(req) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
        return body
    });
}