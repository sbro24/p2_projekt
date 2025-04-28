let fs = require('fs');

//necessary data
let path = '../../data/financialMetricsObject.json'

// classes and constructers for adding data to the JSON database
class Company {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    };
}

class CompanyData {
    constructor(companyId) {
        this.result = {
            revenue: {},
            expense: {}
        };
        this.budget = {
            revenue: {},
            expense: {}
        };
        this.forecast = {
            revenue: {},
            expense: {}
        };
    };
}

class FinancialMetric {
    constructor(name) {
        this.name = name;
        this.data = Array(0);
    };
}

class FinancialYear {
    constructor (year) {
        this.year = year
        this.months = {
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0
        }
    };
}

/* let company = new Company("123456", "Test");
console.log(`Company:`, company);

let companyData = new CompanyData("123456");
console.log(`Company data:`, companyData);

let financialMetric = new FinancialMetric("Sales");
console.log(`Financial Metric:`, financialMetric);

let financialYear = new FinancialYear ("2025");
console.log(`Financial year:`, financialYear); */


//helper-functions to work with JSON data
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

function jsonWrite(filePath, data) {
    let json = JSON.stringify(data, null, 4);

    fs.writeFile(filePath, json, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('successfully written');
        }
    });
}


// helper-functions for adding data to the JSON database in a structured manner according to the use cases

function AddNewProfile (id, name) {
    let newCompany = new Company (id, name);
    let newCompanyData = new CompanyData(id);
    
    jsonRead(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        data.companies.push(newCompany);
        data.dataById[id] = newCompanyData;

        jsonWrite(path, data);
        console.log(data);
    });
}

function AddNewFinancialMetric(companyId, financialType, financialCategory, financialMetric){
    
    let newFinancialMetric = new FinancialMetric(financialMetric);
    let metricName = newFinancialMetric.name;
    console.log(`Metric Name:`, metricName);
    
    jsonRead(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        data.dataById[companyId][financialType][financialCategory][metricName] = newFinancialMetric;

        jsonWrite(path, data);
        console.log(data);
    });
}

function AddNewFinancialYear (companyId, financialType, financialCategory, financialMetric, financialYear) {
    let newFinancialYear = new FinancialYear(financialYear);
    
    jsonRead(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        data.dataById[companyId][financialType][financialCategory][financialMetric].data.push(newFinancialYear);

        jsonWrite(path, data);
        console.log(data);
    });
}

// AddNewProfile("222222", "Test af add company");
// AddNewFinancialMetric ("222222", "result", "revenue", "sales");
// AddNewFinancialYear ("222222", "result", "revenue", "sales", "2025");

/* jsonRead(path, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Raw data:", JSON.stringify(data, null, 2));
        console.log("firma");
        console.log(data.dataById["123456"].result.revenue.sales.data);
    }
}); */