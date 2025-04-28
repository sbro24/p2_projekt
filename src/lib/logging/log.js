import fs from "fs";
import process from 'process';
import { StartTimestamp, TimestampFormatter } from "../time/time.js";

const logDirectory = process.cwd() + '/logs';
const startupTime = StartTimestamp();

export function Log(message) {
    const currentTime = new Date();

    const fileName = TimestampFormatter(startupTime, 'YYYY-DD-HH_HH-mm-ss') + '.log';
    const filePath = logDirectory + '/' + fileName;

    console.log(`[${TimestampFormatter(currentTime, 'HH:mm:ss')}]: ${message}`);
    fs.appendFile(filePath, `[${TimestampFormatter(currentTime, 'HH:mm:ss')}]: ${message}\n`, (err) => {
        if (err) {
            console.log(err);
        }
    });  
}

export function CreateLogFile() {
    //create log directory it dosen't exist
    if (!fs.existsSync(logDirectory)) {
        try {
            console.log(`[${TimestampFormatter(startupTime, 'HH:mm:ss')}]: Creating log directory...`);
            fs.mkdirSync(logDirectory, { recursive: true });
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    }

    const fileName = TimestampFormatter(startupTime, 'YYYY-DD-HH_HH-mm-ss') + '.log';
    const filePath = logDirectory + '/' + fileName;
    //generate log directory if not exists
    if (!fs.existsSync(filePath)) {
        try {
            const content = `[${TimestampFormatter(startupTime, 'HH:mm:ss')}]: Creating log file...`
            console.log(content);
            fs.writeFileSync(filePath, content + '\n', { flag: 'a' });
          } catch (err) {
            console.error(err);
            process.exit(1);
          }
    }
}