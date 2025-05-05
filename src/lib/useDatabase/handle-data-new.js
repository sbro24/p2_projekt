import { Company, CompanyData, FinancialMetric, FinancialYear } from "./constructors.js";
import { promises as fs } from 'fs';

const filePathDatabase = '../../data/data.json';

async function GetCompaniesArray () {
    try {
        const data = await JsonReadFile(filePathDatabase);
        if (!data || !Array.isArray(data.companies)) {
            console.warn("There is no valid companies array");
            return [];
        }
        return data.companies;
    } catch (err) {
        console.error("Could not get companies array from database", err);
        return [];
    }
}

async function AddNewCompany (name, id, sessionToken) {
    
    let newCompany = new Company (id, name, sessionToken);
    let newCompanyData = new CompanyData(id);

    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);
        console.log("data read successfully");
        
        //data validation before writing to database
        if (data.companies.some (company => company.name === name)) {
            console.log(`A company with the name "${name}" already exists`);
            return null;
        }

        if (data.dataById.hasOwnProperty(id)) {
            console.error(`A company with the id "${id}" already exists`);
            return null;
        }
        
        //adding data to the object
        //the company is pushed to the companies array
        //dataById is added as an object since a object with that id does not exist
        data.companies.push(newCompany);
        data.dataById[id] = newCompanyData;

        //async writing to database
        await JsonWriteFile(filePathDatabase, data);
        console.log("Company added to database successfully")

    } catch (err) {
        console.error("Not able to add new company to database:", err);
        return null;
    }
}

async function UpdateCompany () {

}

async function UpdateSessionToken () {

}

async function GetCompanyObject () {

}

async function UpdateCompanyObject () {

}

async function GetFinancialMetricArray () {

}

async function JsonReadFile(filePath) {
    try {
        const jsonString = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("Error reading or parsing JSON:", err);
        return null;
    }
}

async function JsonWriteFile(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 2); // pretty print
        await fs.writeFile(filePath, jsonString, 'utf-8');
    } catch (err) {
        console.error("Error writing JSON to file:", err);
        throw err;
    }
}

AddNewCompany("Mikkels test3", "999999", "");

/* async function LogResult (inputFunction) {
    const result = await inputFunction;
    console.log(result);
}

LogResult(GetCompaniesArray()); */

export {GetCompaniesArray};