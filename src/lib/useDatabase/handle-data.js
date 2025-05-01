const { Company, CompanyData, FinancialMetric, FinancialYear } = require('./constructors');
const {JsonWriteFile, JsonReadFile, JsonReadFileCb, JsonWriteFileCb} = require ('./handle-json');

const path = '../../data/data.json' 

// helper-functions for adding data to the JSON database in a structured manner according to the use cases

/**
 * Adds a new profile to the JSON file. 
 * It creates and pushed the company object to the companies array.
 * It creates the dataById object with the company id. 
 * @param {string: 6 digits id on company} id 
 * @param {string: name of the company in the new profil} name 
 */

function AddNewProfile (id, name) {
    let newCompany = new Company (id, name);
    let newCompanyData = new CompanyData(id);
    
    JsonReadFile(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        data.companies.push(newCompany);
        data.dataById[id] = newCompanyData;

        JsonWriteFile(path, data, JsonWriteFileCb);

        console.log(data);
    });
}

/**
 * Adds new financial metrics in data.json to an existing company
 * @param {string: existing id of the company} companyId 
 * @param {string: result || budget || forecast} financialType 
 * @param {string: revenue || expenses} financialCategory 
 * @param {string: user defined name of the financial metric fx "sales"} financialMetric
 */

function AddNewFinancialMetric(companyId, financialType, financialCategory, financialMetric){
    
    let newFinancialMetric = new FinancialMetric(financialMetric);
    let metricName = newFinancialMetric.name;
    console.log(`Metric Name:`, metricName);
    
    JsonReadFile(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        data.dataById[companyId][financialType][financialCategory][metricName] = newFinancialMetric;

        JsonWriteFile(path, data, JsonWriteFileCb);
        console.log(data);
    });
}

/**
 * Adds a new year to data on an existing metric in a company
 * @param {string: existing id of the company} companyId 
 * @param {string: result || budget || forecast} financialType 
 * @param {string: revenue || expenses} financialCategory 
 * @param {string: user defined name of the financial metric fx "sales"} financialMetric 
 * @param {string: user defined year fx "2024"} financialYear 
 */

function AddNewFinancialYear (companyId, financialType, financialCategory, financialMetric, financialYear) {
    let newFinancialYear = new FinancialYear(financialYear);
    
    JsonReadFile(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");
        data.dataById[companyId][financialType][financialCategory][financialMetric].data.push(newFinancialYear);

        JsonWriteFile(path, data, JsonWriteFileCb);
        console.log(data);
    });
}

function filterData (name) {

    let companyLoggedIn = {};

    JsonReadFile(path, (err, data) => {
        if (err) {
            console.log(err);
        }

        console.log("data read successfully");

        const result = data.companies.find(company => company.name === name);
        
        if (result) {
            companyLoggedIn = result;
            console.log("Company found:", companyLoggedIn);
            let companyData = data.dataById[companyLoggedIn.id];
            console.log(companyData); 
        } else {
            console.log("Company not found");
        }
    });

    return companyLoggedIn;
};

module.exports = {AddNewProfile, AddNewFinancialMetric, AddNewFinancialYear, filterData}