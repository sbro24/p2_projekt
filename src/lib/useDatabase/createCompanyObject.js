const fs = require('fs')

//necessary data
let path = '../../data/financialMetricsObject.json'

function jsonAddCompany(path, obj) {
    jsonRead(path, (err, data) => {
        if (err){
            console.log(err);
        } else {
            data[0].companies.push(obj);
        }
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