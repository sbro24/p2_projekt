import { Company, CompanyData, FinancialMetric, FinancialYear } from "./constructors.js";
import {JsonWriteFile, JsonReadFile, JsonReadFileCb, JsonWriteFileCb} from "./handle-json.js";
import fs from 'fs';

const path = '../../data/data.json';

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
        } else {
            console.log("data read successfully");
            data.companies.push(newCompany);
            data.dataById[id] = newCompanyData;
        
        }

        JsonWriteFile(path, data, JsonWriteFileCb);
    });
}

/**
 * Adds new financial metrics in data.json to an existing company
 * @param {string: existing id of the company} companyId 
 * @param {string: result || budget || forecast} financialType 
 * @param {string: revenue || expenses} financialCategory 
 * @param {string: user defined name of the financial metric fx "sales"} financialMetric
 */

function JsonReadFilePromise(path) {
    return new Promise((resolve, reject) => {
        JsonReadFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function AddNewFinancialMetric(companyId, financialType, financialCategory, financialMetric) {
    let newFinancialMetric = new FinancialMetric(financialMetric);
    let metricName = newFinancialMetric.name;

    try {
        const data = await JsonReadFilePromise(path); // Ensure the file is read completely

        console.log("Data read successfully", data);

        if (!data.dataById[companyId]) {
            console.log(`Company with ID ${companyId} not found in dataById.`);
            return;
        }

        if (!data.dataById[companyId][financialType]) {
            console.log(`Financial Type ${financialType} not found for Company ID ${companyId}.`);
            return;
        }

        if (!data.dataById[companyId][financialType][financialCategory]) {
            console.log(`Financial Category ${financialCategory} not found for ${financialType} under Company ID ${companyId}.`);
            return;
        }

        data.dataById[companyId][financialType][financialCategory][metricName] = newFinancialMetric;

        // Write updated data back to the file
        await JsonWriteFile(path, data, JsonWriteFileCb);

        console.log("Updated data:", data);

    } catch (error) {
        console.log("Error reading or writing data:", error);
    }
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

function filterData(name) {
    return new Promise((resolve, reject) => {
        let companyLoggedIn = {};

        JsonReadFile(path, (err, data) => {
            if (err) {
                console.log(err);
                reject(err); // Reject if there's an error reading the file
                return;
            }

            console.log("Data read successfully");

            const result = data.companies.find(company => company.name === name);
            
            if (result) {
                companyLoggedIn = result;
                console.log("Company found:", companyLoggedIn);
                let companyData = data.dataById[companyLoggedIn.id];
                resolve(companyData); // Resolve the promise with the company data
            } else {
                console.log("Company not found");
                resolve(null); // Resolve with null if the company isn't found
            }
        });
    });
}

async function GetFinancialMetricArray(name, financialType, financialCategory, financialMetric) {
    let financialMetricArray = [];
    
    try {
        const companyObject = await filterData(name);
        const financialMetricForecast = companyObject[financialType][financialCategory][financialMetric].data;

        financialMetricForecast.forEach(yearData => {
            // Append the months of each year to the financialMetricArray
            financialMetricArray.push(...Object.values(yearData.months));
        });

        return financialMetricArray

    } catch (error) {
        console.error("Error in GetFinancialMetricArray:", error);
        return [];
    }
}


async function logForecast() {
    const arrayForecast = await GetFinancialMetricArray("name", "result", "revenue", "sales");
    console.log("Forecast:", arrayForecast);
}

logForecast();

export {AddNewProfile, AddNewFinancialMetric, AddNewFinancialYear, filterData}