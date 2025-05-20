import { Company, CompanyData } from "./constructors.js";
import { promises as fs } from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
import { Log } from "../logging/log.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePathDatabase = path.join(__dirname, '../../data/data.json');


export function GetCompanyies() {
    return new Promise(async (resolve) => {
        try {
            const data = await JsonReadFile(filePathDatabase);
            if (!data || !Array.isArray(data.companies)) {
                console.warn("There is no valid companies array");
                 resolve([]);
            };
            resolve(data.companies);
        } catch (err) {
            console.error("Could not get companies array from database", err);
            resolve([]);
        }
    });
}

export async function GetCompanyProfileById(id) {
    try {
        GetCompanyies()
        .then(companies => {
            return companies.filter(company => company.id === id);
        });
    } catch (err) {
        console.error("Could not get companies array from database", err);
        return [];
    }
}

export async function GetCompanyProfileByName(name) {
    try {
        GetCompanyies()
        .then(companies => {
            return companies.filter(company => company.name === name);
        });
    } catch (err) {
        console.error("Could not get companies array from database", err);
        return [];
    }
}

export async function GetCompanyProfileByToken(token) {
    return new Promise((resolve) => {
        try {
            GetCompanyies()
            .then(companies => {
                resolve(companies.filter(company => company.sessionToken === token)[0]);
            });
        } catch (err) {
            console.error("Could not get companies array from database", err);
            resolve();
        }
    });
}

export async function AddNewCompany(id, name, password, sessionToken) {

    let newCompany = new Company(id, name, password, sessionToken);
    let newCompanyData = new CompanyData(id);

    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);

        //data validation before writing to database
        if (data.companies.some(company => company.name === name)) {
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

    } catch (err) {
        console.error("Not able to add new company to database:", err);
        return null;
    }
}

export async function UpdateCompanyName(companyId, toName) {
    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);

        //Find a rename the company    
        const companyToRename = data.companies.find(company => company.id === companyId);

        if (companyToRename) {
            companyToRename.name = toName;
            console.log(`Renamed company '${companyId}' to '${toName}'`);
        } else {
            console.log("Company name is not in the database");
        }

        //async writing to database
        await JsonWriteFile(filePathDatabase, data);

    } catch (err) {
        console.error("Not able to update company name:", err);
        return null;
    }
}

export async function UpdateSessionToken(companyId, newSessionToken) {
    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);

        //Find a rename the company    
        const companySessionTokenToUpdate = data.companies.find(company => company.id === companyId);

        if (companySessionTokenToUpdate) {
            companySessionTokenToUpdate.sessionToken = newSessionToken;
            Log(`The token for company ${companyId} has been updated to ${newSessionToken}`);
        } else {
            Log(Error(`Company with id ${companyId} is not in the database`));
        }

        //async writing to database
        await JsonWriteFile(filePathDatabase, data);

    } catch (err) {
        Log(Error(err));
        return null;
    }
}

export async function GetFinancialDataById(id) {
    return new Promise(async (resolve) => {
        try {
            //async reading of database
            const data = await JsonReadFile(filePathDatabase);
            resolve(data.dataById[id]);
    
        } catch (err) {
            console.error("Not able to get company object:", err);
            resolve(null);
        }
    });
}

export async function UpdateCompanyObject(companyObject) {
    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);
        
        if (!data) {
            Log(Error("Could not read data from database"));
        }

        const id = companyObject[Object.keys(companyObject)[0]];
        Log(`Updating company object with id ${id}`);

        //Find a rename the company    
        data.dataById[id] = companyObject.data;

        //async writing to database
        await JsonWriteFile(filePathDatabase, data);

    } catch (err) {
        Log(err);
        return null;
    }
}

export async function GetFinancialMetricArray(id, financialType, financialCategory, financialMetric) {
    let financialMetricArray = [];

    try {
        //async reading of database
        const data = await JsonReadFile(filePathDatabase);

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

export async function JsonReadFile(filePath) {
    try {
        const jsonString = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(jsonString);
    } catch (err) {
        console.error("Error reading or parsing JSON:", err);
        return null;
    }
}

export async function JsonWriteFile(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 2); // pretty print
        await fs.writeFile(filePath, jsonString, 'utf-8');
    } catch (err) {
        console.error("Error writing JSON to file:", err);
        throw err;
    }
}

async function LogResult(inputFunction) {
    const result = await inputFunction;
    console.log("result:", result);
}


export async function ConvertResultsToArray(id) {
    let companyData = await GetFinancialDataById(id)

    let financialDataObject = {revenue: {}, expense: {}};

    const companyRevenue = companyData.result.revenue;
    const companyExpense = companyData.result.expense;

    console.log(companyRevenue)

    for (const itemNum in companyRevenue) {
        let item = companyRevenue[itemNum]
        item.data.forEach(year => {
            console.log(year);
        })
    }

    //companyRevenue.forEach( => {
    //    let sortYear = []
    //    for (const year in item.data) {
    //        sortYear.push(year.year)
    //    }
    //    console.log(sortYear)
    //});

    return financialDataObject;
}

//functions and object for testing

//LogResult(GetCompaniesArray());
//LogResult(AddNewCompany("Mikkels test3", "999999", ""));
//LogResult(UpdateCompanyName("name", "newName"))
//LogResult(UpdateSessionToken("newName", "123401470983274"));
//LogResult(GetFinancialMetricArray("123456", "result", "revenue", "sales"));
//LogResult(UpdateCompanyObject(companyObject));
//LogResult(GetCompanyObject("newName"));

/* const companyObject = {
    "123234": {
      result: {
        revenue: {
          sales: {
            characteristics: [],
            data: [
              {
                year: 2025,
                months: {
                  January: 0,
                  February: 100,
                  March: 0,
                  April: 0,
                  May: 0,
                  June: 0,
                  July: 0,
                  August: 0,
                  September: 0,
                  October: 0,
                  November: 0,
                  December: 0
                }
              },
              {
                year: 2025,
                months: {
                  January: 1,
                  February: 1,
                  March: 1,
                  April: 0,
                  May: 0,
                  June: 0,
                  July: 0,
                  August: 0,
                  September: 0,
                  October: 0,
                  November: 0,
                  December: 0
                }
              }
            ]
          }
        },
        expense: {}
      },
      budget: {
        revenue: {},
        expense: {}
      },
      forecast: {
        revenue: {},
        expense: {}
      }
    }
  }; */