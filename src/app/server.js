import http from 'http';
import fs from "fs";
import process from 'process';

import { CreateLogFile, Log } from '../lib/logging/log.js';
import { StartTimestamp } from '../lib/time/time.js';

StartTimestamp();
const hostname = '127.0.0.1';
const port = 4220;

const logDcirectory = process.cwd() + '/logs';


const server = http.createServer(RequestHandler);
function RequestHandler(req,res) {
    try {
        //processReq(req, res);
        Log(req);
        if (req.url === '/') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHeader(200, {
                'Content-Type': 'application/json'
            });
            res.write('{"test": 1}');
            res.end();
        }
    } catch(err) {
        Log(err);
        //errorResponse(res,500,"");
    };
};

function StartServer() {
    CreateLogFile();
    server.listen(port, hostname, () => {
        Log(`Server running at http://${hostname}:${port}/`);
    });
}

StartServer();