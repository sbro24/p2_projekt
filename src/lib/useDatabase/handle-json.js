import fs from 'fs'

//helper-functions to read from and write to JSON data
function JsonReadFile(filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, jsonString) => {
        if (err) {
            return cb && cb(err);
        }

        try {
            const data = JSON.parse(jsonString);
            return cb && cb(null, data);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

function JsonWriteFile(filePath, data, cb) {
    const json = JSON.stringify(data, null, 4);
    
    fs.writeFile(filePath, json, err => {
        cb(err);
    });
}


function JsonReadFileCb (err, data) {
    if (err) {
        console.log(err);
    } else {
        console.log('Read successful')
    }
}

function JsonWriteFileCb (err) {
    if (err) {
        console.error('Write failed:', err);
    } else {
        console.log('Write successful');
    }
};

export {JsonReadFile, JsonWriteFile, JsonReadFileCb, JsonWriteFileCb};