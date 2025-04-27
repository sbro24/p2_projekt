const fs = require('fs')

//necessary data
let path = '../../data/financialMetrics.json'

class Company {
    constructor (name, revenue, expenses) {
        this.name = name;
        this.revenue = revenue;
        this.expenses = expenses;    
    }
};

const financialMetrics = {
    name: "virksomhed 1",
    revenue: 1000,
    expenses: 1234,
};

const secondFinancialMetrics = {
    name: "virksomhed 2",
    revenue: 2000,
    expenses: 2234,
};

let financialMetricsArray = [financialMetrics];

//defining functions
function jsonWrite(filePath, data) {
    fs.writeFile(path, JSON.stringify(data, null, 4), err => {
        if (err){
            console.log (err);
        } else {
            console.log('successfully written');
        }
    });    
}

function jsonRead(filePath, cb) {
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

function jsonChangeName(path, name) {
    jsonRead(path, (err, data) => {
        if (err){
            console.log(err);
        } else {
            data[0].name = name;
            jsonWrite(path, data);
        }
    });
}

function jsonAdd(path, obj) {
    jsonRead(path, (err, data) => {
        if (err){
            console.log(err);
        } else {
            data.push(obj);
            jsonWrite(path, data);
        }
    });
}


//call functions
//jsonWrite(path, financialMetricsArray);

jsonRead(path, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log(data);
    }
});

//jsonChangeName(path, "Nyt navn");

let nytFirma = new Company("NYT FIRMA", 123234, 345098);

jsonAdd(path, nytFirma);

