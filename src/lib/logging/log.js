import fs from "fs";
import process from 'process';
import util from "util";
import { StartTimestamp, TimestampFormatter } from "../time/time.js";
import { ErrorToString } from "../errorHandling/error.js";

const logDirectory = process.cwd() + '/logs';
const startupTime = StartTimestamp();

/**Logs messages to the console and a log file.
 * @param {string | Error} message 
 * @param {string} type - Type of log message. Can be 'info', 'error', 'warn', 'debug',. Default is 'info'.
 */
export function Log(content, type = 'info') {
    type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(); //capitalize first letter and lowercase the rest.
    const validTypes = ['Info', 'Error', 'Warn', 'Debug'];
    if (!validTypes.includes(type)) type = 'Info'; //default to info if type is not valid.
    
    //convert error to string.
    if (content instanceof Error) type = 'Error';

    //figure out the log file name and path.
    const fileName = TimestampFormatter(startupTime, 'YYYY-DD-HH_HH-mm-ss') + '.log';
    const filePath = logDirectory + '/' + fileName;
    
    //create log directory and file if it doesn't exist
    if (!fs.existsSync(filePath)) CreateLogFile()
    
    //create time stamp and log message.
    const currentTime = new Date();
    const timestamp = `[${TimestampFormatter(currentTime, 'HH:mm:ss')}/${type}]: `;
    
    //log to console
    process.stdout.write(timestamp);
    console.log(content);
    
    const formattedMessage = util.format(content)
    //log to file.
    fs.appendFile(filePath, timestamp + formattedMessage + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });  
}

/**Creates a log file and logs directory if they don't already exist.
 */
export function CreateLogFile() {
    //create log directory it dosen't exist
    if (!fs.existsSync(logDirectory)) {
        try {
            console.log(`[${TimestampFormatter(startupTime, 'HH:mm:ss')}/Info]: Creating log directory...`);
            fs.mkdirSync(logDirectory, { recursive: true });
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    //figure out the log file name and path.
    const fileName = TimestampFormatter(startupTime, 'YYYY-DD-HH_HH-mm-ss') + '.log';
    const filePath = logDirectory + '/' + fileName;

    //generate log directory if not exists
    try {
        fs.writeFileSync(filePath, '', { flag: 'a' });
        Log('Creating log file...')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}