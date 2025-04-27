const fs = require('fs')

//necessary data
let path = '../../data/financialMetricsObject.json'

class FinancialYear {
    constructor (year) {
        this.year = year
        this.months = Array(12).fill(0)
    }
}

class FinancialEntity {
    constructor(name) {
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
    }
}
  
class Company {
    constructor(id, name, additional = '') {
        this.id = id;
        this.name = name;
    }
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

function jsonAddCompany(path, obj) {
    jsonRead(path, (err, data) => {
        if (err){
            console.log(err);
        } else {
            data[0].companies.push(obj);
        }
    });
}

function jsonWrite(filePath, data) {
    let json = JSON.stringify(data, null, 4);

    // Post-process: replace all "year": [ <multi-line> ] to one-liners
    json = json.replace(/"year": \[\s+([^\]]*?)\s+\]/g, (match, inner) => {
        // Remove newlines and extra spaces
        const compactArray = inner
            .split('\n')
            .map(line => line.trim().replace(/,$/, '')) // trim and remove trailing commas
            .filter(Boolean)
            .join(', ');
        return `"year": [${compactArray}]`;
    });

    fs.writeFile(filePath, json, err => {
        if (err) {
            console.log(err);
        } else {
            console.log('successfully written');
        }
    });
}

function AddCompany(id, name) {
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

function AddFinancialEntity (CompanyId, FinancialType, FinancialCategory, EntityName) {
    
    let newFinancialEntity = new FinancialEntity(EntityName);
    
    jsonRead(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        
        data.dataById[CompanyId][FinancialType][FinancialCategory][EntityName] = {
            characteristics: [],
        };

        jsonWrite(path, data);
        console.log('Financial entity added successfully');
    });
}

function AddFinancialYear(CompanyId, FinancialType, FinancialCategory, EntityName, year) {
    jsonRead(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        
        let entity = data.dataById[CompanyId][FinancialType][FinancialCategory][EntityName];

        if (!entity.year) {
            entity.year = {};
        }

        entity.year.push(new FinancialYear(year));

        jsonWrite(path, data);
        console.log('Financial entity added successfully');
    });
}

AddFinancialYear(111111, "result", "revenue", "Sales", "2024");

//AddCompany(111111, "Test af constructor igen");

//AddFinancialEntity(111111, "result", "revenue", "Sales");

/* jsonRead(path, (err, data) => {
    if (err) {
        console.log(err);
    } else {
        
        let selectCompany = 2;
        let companyId = data.companies[selectCompany].id;

        console.log(data.companies[2]);
        console.log(data.dataById[companyId]);
    }
}); */