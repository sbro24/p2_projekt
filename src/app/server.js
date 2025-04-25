import http from 'http';
import fs from "fs";
import path  from "path";
import process from 'process';

export { Log }

const hostname = '127.0.0.1';
const port = 4220;

const startupTime  = new Date(); //format: YYYY-MM-DDTHH:mm:ss.sssZ
const srcDcirectory = process.cwd() + '/src';
const logDcirectory = process.cwd() + '/logs';

const server = http.createServer(RequestHandler);
function RequestHandler(req,res) {
    try {
        //processReq(req, res);
        if (req.url === '/') {
            Log(req);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHeader(200, {
                'Content-Type': 'application/json'
            });
            res.write('{"test": 1}');
            res.end();
        }
    } catch(err) {
        console.log(err);
        //errorResponse(res,500,"");
    };
};

function getTimestamp(timestamp) {
    //check if timestamp is a date object
    if (!(timestamp instanceof Date)) return undefined;
    //format : YYYY-MM-DD
    const date = timestamp.toISOString().split('T')[0];
    //format : hh-mm-ss
    const time = timestamp.toISOString().split('T')[1].split('.')[0].replace(/:/g, '-');
    //format : YYYY-MM-DD_hh-mm-ss
    return date + '_' + time;
}

function Log(message) {
    const currentTime = new Date();
    const timestamp = getTimestamp(startupTime);
    const timeWithColon = currentTime.toISOString().split('T')[1].split('.')[0];
    const filename = timestamp + '.log';
    const filepath = logDcirectory + '/' + filename;
    const timestampBox = `[${timeWithColon}]: `
    console.log(timestampBox + message);
    fs.appendFile(filepath, timestampBox + message + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });  
}

function CreateLogFile() {
    //create log directory it dosen't exist
    const timestamp = getTimestamp(startupTime);
    const timeWithColon = startupTime.toISOString().split('T')[1].split('.')[0];
    if (!fs.existsSync(logDcirectory)) {
        try {
            console.log(`[${timeWithColon}]: Creating log directory...`);
            fs.mkdirSync(logDcirectory, { recursive: true });
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    const filename = timestamp + '.log';
    const filepath = logDcirectory + '/' + filename;
    //generate log directory if not exists
    if (!fs.existsSync(filename)) {
        try {
            const content = `[${timeWithColon}]: Creating log file...`
            console.log(content);
            fs.writeFileSync(filepath, content + '\n', { flag: 'a' });
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
    }
}

function StartServer() {
    CreateLogFile();
    server.listen(port, hostname, () => {
        Log(`Server running at http://${hostname}:${port}/`);
    });
}

StartServer();