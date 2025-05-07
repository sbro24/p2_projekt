import fs from 'fs';

import { Log } from '../lib/logging/log.js';
import { ErrorResponse } from '../lib/errorHandling/error.js';
import { Wait } from '../lib/time/time.js';

const featureDirctoryPath = process.cwd() + '/src/features/';
const featureDirctoryRelativePath = '../features/';

const publicRessourcesDirctoryPath = process.cwd() + '/src/PublicRessources/';
const dataJsonPath = process.cwd() + '/data/data.json';

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
    console.log(req, res, data);
    const pathFeatureFiles = fs.readdirSync(featureDirctoryPath);
    for (const feature of pathFeatureFiles) {
        if (!fs.existsSync(featureDirctoryPath + feature + '/router.js')) continue;
        const routerPath = featureDirctoryRelativePath + feature + '/router.js';
        import(routerPath)
        .then(execute => execute.router(req, res, data))
        .catch(err => Log(err));
    }
    await Wait(100);
    if (!res.writableFinished) ErrorResponse(res, Error(`${req.url} not found`), 404);
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

export function FileResponse(res, filePath) {
    let path = publicRessourcesDirctoryPath + filePath
    console.log(path)
    fs.readFile(path, (err, data) => {
      if (err) {
        ErrorResponse(res, err, 404)
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', guessMimeType(filePath));
        res.write(data);
        res.end('\n');
      }
    })
}