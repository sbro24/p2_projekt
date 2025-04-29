import http from 'http';
import fs from "fs";
import process from 'process';

import { processRequest } from './router.js';
import { CreateLogFile, Log } from '../lib/logging/log.js';
import { StartTimestamp } from '../lib/time/time.js';
import { ErrorResponse } from '../lib/errorHandling/error.js';

const hostname = '127.0.0.1';
const port = 4220;

const logDcirectory = process.cwd() + '/logs';
StartTimestamp();

const server = http.createServer(RequestHandler);
function RequestHandler(req,res) {
    try {
        processRequest(req, res);
    } catch(err) {
        ErrorResponse(res, err, 500);
    };
};

function StartServer() {
    server.listen(port, hostname, () => {
        Log(`Server running at http://${hostname}:${port}/`);
    });
}

StartServer();