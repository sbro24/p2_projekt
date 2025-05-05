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
        console.log("Company added to database successfully");

    } catch (err) {
        console.error("Not able to add new company to database:", err);
        return null;
    }
}

async function UpdateCompanyName (fromName, toName) {
    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);
        console.log("data read successfully");

        //Find a rename the company    
        const companyToRename = data.companies.find(company => company.name === fromName);

        if (companyToRename) {
            companyToRename.name = toName;
            console.log(`Renamed company from '${fromName}' to '${toName}'`);
        } else {
            console.log("Company name is not in the database");
        }

        //async writing to database
        await JsonWriteFile(filePathDatabase, data);
        console.log("Company name updated successfully");
    
    } catch (err) {
        console.error("Not able to update company name:", err);
        return null;
    }
}

async function UpdateSessionToken (companyName, newSessionToken) {
    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);
        console.log("data read successfully");

        //Find a rename the company    
        const companySessionTokenToUpdate = data.companies.find(company => company.name === companyName);

        if (companySessionTokenToUpdate) {
            companySessionTokenToUpdate.sessionToken = newSessionToken;
            console.log(`The token for company ${companyName} has been updated to ${newSessionToken}`);
        } else {
            console.log("Company name is not in the database");
        }

        //async writing to database
        await JsonWriteFile(filePathDatabase, data);
        console.log("Session token updated successfully");
    
    } catch (err) {
        console.error("Not able to update session token:", err);
        return null;
    }
}

async function GetCompanyObject () {

}

async function UpdateCompanyObject () {

}

async function GetFinancialMetricArray (id, financialType, financialCategory, financialMetric) {
    let financialMetricArray = [];
    
    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);
        console.log("data read successfully");
        
        //get company object
        const companyObject = data.dataById[id];
        const financialMetricForecast = companyObject[financialType][financialCategory][financialMetric].data;

        //loops through all years in the data array on the relevant metric
        financialMetricForecast.forEach(yearData => {
            // Append the months of each year to the financialMetricArray
            financialMetricArray.push(...Object.values(yearData.months)); //uses the spread operator to push them into the array as indiviual elements
        });

        return financialMetricArray

    } catch (error) {
        console.error("Error in GetFinancialMetricArray:", error);
        return [];
    }
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

//AddNewCompany("Mikkels test3", "999999", "");

async function LogResult (inputFunction) {
    const result = await inputFunction;
    console.log("result:", result);
}

//LogResult(GetCompaniesArray());
//LogResult(UpdateCompanyName("name", "newName"))
//LogResult(UpdateSessionToken("newName", "123401470983274"));
LogResult(GetFinancialMetricArray("123456", "result", "revenue", "sales"));


export {GetCompaniesArray};