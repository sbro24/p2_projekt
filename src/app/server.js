import http from 'http';

import { processRequest } from './router.js';
import { Log } from '../lib/logging/log.js';
import { StartTimestamp } from '../lib/time/time.js';
import { ErrorResponse } from '../lib/errorHandling/error.js';

const hostname = '127.0.0.1';
const port = 4220;

const server = http.createServer(RequestHandler);
function RequestHandler(req,res) {
    try {
        processRequest(req, res);
    } catch(err) {
        ErrorResponse(res, err, 500);
    };
};

server.listen(port, hostname, () => {
    StartTimestamp();
    Log(`Server running at http://${hostname}:${port}/`);
});
