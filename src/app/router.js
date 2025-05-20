import fs from 'fs';

import { Log } from '../lib/logging/log.js';
import { ErrorResponse } from '../lib/errorHandling/error.js';
import { Wait } from '../lib/time/time.js';
import path from 'path';

const featureDirctoryPath = process.cwd() + '/src/features/';
const featureDirctoryRelativePath = '../features/';

const publicRessourcesDirctoryPath = process.cwd() + '/src/PublicRessources/';

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
    if (!req.url.endsWith('/')) req.url += '/';

    const pathFeatureFiles = fs.readdirSync(featureDirctoryPath);
    for (const feature of pathFeatureFiles) {
        if (!fs.existsSync(featureDirctoryPath + feature + '/router.js')) continue;
        const routerPath = featureDirctoryRelativePath + feature + '/router.js';
        import(routerPath)
        .then(execute => execute.router(req, res, data))
        .catch(err => Log(err));
    }
    await Wait(200);
    if (!res.writableFinished) ErrorResponse(res, Error(`${req.url} not found`), 404);
}

/**
 * Extracts the body from the request.
 * @param {object} req 
 * @returns {Promise<string>} - Returns a promise that resolves to the body of the request.
 */

function ExtractBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString()
            if (body.length > 1e7) { 
                // Protect against attacks.
                request.connection.destroy();
                reject(Error('Request body too large'));
            }
        });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

function guessMimeType(fileName){
    const fileExtension=fileName.split('.').pop().toLowerCase();
    const ext2Mime = {
        "txt": "text/txt",
        "html": "text/html",
        "ico": "image/ico",
        "js": "text/javascript",
        "json": "application/json", 
        "css": 'text/css',
        "png": 'image/png',
        "jpg": 'image/jpeg',
        "wav": 'audio/wav',
        "mp3": 'audio/mpeg',
        "svg": 'image/svg+xml',
        "pdf": 'application/pdf',
        "doc": 'application/msword',
        "docx": 'application/msword'
        };
    return (ext2Mime[fileExtension] || "text/plain");
}

function guessDataType(data){
    let type = typeof data;
    const type2Mime = {
        "string": "text/txt",
        "number": "text/txt",
        "object": "application/json", 
        };
    return (type2Mime[type] || "text/plain");
}

export function FileResponse(res, filePath, cookies = []) {
    if (filePath.startsWith('/')) filePath = filePath.substring(1);

    let extension = filePath.split('.').pop().toLowerCase();
    let ressourceFolder = filePath.split('/')[0];
    filePath = filePath.split('/').splice(1).join('/');

    if (extension !== 'js' && extension !== 'html' && extension !== 'css') extension = 'assets';
    
    let ressourcePath = path.join(publicRessourcesDirctoryPath, ressourceFolder, extension, filePath);

    fs.readFile(ressourcePath, (err, data) => {
      if (err) {
        ErrorResponse(res, err, 404)
      } else {

        Log(`${res.req.method} @ "${res.req.url}" => "${path.join(ressourceFolder, extension, filePath)}"`);
        res.statusCode = 200;
        res.setHeader('Set-Cookie', cookies);
        res.setHeader('Content-Type', guessMimeType(filePath));
        res.write(data);
        res.end('\n');
      }
    })
}

export function DataResponse(res, data = 'undefined', cookies = []) {
    res.statusCode = 200;
    res.setHeader('Set-Cookie', cookies);
    res.setHeader('Content-Type', guessDataType(data));
    res.write(JSON.stringify(data));
    res.end('\n');
}