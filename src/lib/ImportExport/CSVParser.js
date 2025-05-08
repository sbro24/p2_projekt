import {Company, CompanyData, FinancialMetric, FinancialYear} from '../useDatabase/constructors.js'

import {JsonReadFile, JsonWriteFile, JsonReadFileCb, JsonWriteFileCb} from '../useDatabase/handle-json.js'

const txt_test = '../ImportExport/lololol.txt'

const DELIMITER = ';'
const NEWLINE = '\n';

//Parses CSV file content into one long string of text, with each new column seperated 
//by NEWLINE
async function ParseCSV (file) {
    // Check that the file is valid and FileReader API is supported
    if (!file) {
        console.error("File not available");
        return;
    }

    try {
        const data = await readFile(file, 'utf8');
        return data;
    } catch (err) {
        console.error('Error reading CSV:', err);
      }
}

//Transforms parsed CSV text into arrays, either being "Omsætning", "variable omkostninger"
//or "Faste omkostninger"
//Divides each new line inside these arrays into its own array
//Takes the name from column[0] and creates a new object using a constructor, consisting
//of a "characteristics" array and a "data" array as its properties
//Takes data from column[1] to column [12] and inputs it into each month under the "month"
//property of the "data" array
//It will also need to be able to read the year at the top of the csv file, which it will
//need to input under the "year" property of the "data" array
//Also needs to recognize which "omsætning", "variable omkostninger" or "Faste omkostninger"
//array the data it taken from and input it into the "characteristics" array under the
//object created from the column[0] name

async function CSVObjectCreator (text, company) {
    // Check that text and tables exist
    if (!text) {
        console.error("No text or tables found!");
        return;
    }
    
    // Split the text into arrays
    var first_rows = text.split(/Omsætning|Variable omkostninger|Faste omkostninger/i);

    //Seperate year from the read CSV file
    var year_array = first_rows[0].split(DELIMITER);
    let year = year_array[0];

    //Remove index [0] from the array
    var rows = first_rows.slice(1);

    var omsætningsDeler = rows[0].split(NEWLINE);
    var variableOmkostningerDeler = rows[1].split(NEWLINE)
    var fasteOmkostningerDeler = rows[2].split(NEWLINE)

    var omsætning = omsætningsDeler.map(r => SplitRowsIntoCategories(r, year)).filter(Boolean)
    var variableOmkostninger = variableOmkostningerDeler.map(r => SplitRowsIntoCategories(r, year)).filter(Boolean)
    var fasteOmkostninger = fasteOmkostningerDeler.map(r => SplitRowsIntoCategories(r, year)).filter(Boolean)

    omsætning.forEach(category => {
        CheckIfCategoryDataExists(category, variableOmkostninger, fasteOmkostninger, company)
    })
    variableOmkostninger.forEach(category => {
        CheckIfCategoryDataExists(category, variableOmkostninger, fasteOmkostninger, company)
    })
    fasteOmkostninger.forEach(category => {
        CheckIfCategoryDataExists(category, variableOmkostninger, fasteOmkostninger, company)
    })

}

//Inputs created Objects from CSVObjectCreator into the companys' object
function CheckIfCategoryDataExists (UnderCategory, variableOmkostninger, fasteOmkostninger, company) {
    if (variableOmkostninger.includes(UnderCategory) || fasteOmkostninger.includes(UnderCategory)) {
        if (company.result.expense[UnderCategory.name]) {
            for (let l = 0; l < company.result.expense[UnderCategory.name].data.length; l++) {
                if (company.result.expense[UnderCategory.name].data[l].year === UnderCategory.data[0].year) {
                 company.result.expense[UnderCategory.name].data[l].months = UnderCategory.data[0].months
                 return;
                }
            }

            for (let k = 0; k < company.result.expense[UnderCategory.name].data.length; k++) {
                if (Number(company.result.expense[UnderCategory.name].data[k].year) > Number(UnderCategory.data[0].year))
                company.result.expense[UnderCategory.name].data[k-1].push(UnderCategory.data[0])
                return;
            }

        } else {
            if (variableOmkostninger.includes(UnderCategory)) {
                UnderCategory.characteristics = "Variabel"
            } else {
                UnderCategory.characteristics = "Fast"
            }

            company.result.expense[UnderCategory.name] = UnderCategory

        }

    } else {
        if (company.result.revenue[UnderCategory.name]) {
            company.result.revenue[UnderCategory.name].characteristics = "Variabel"
            for (let l = 0; l < company.result.revenue[UnderCategory.name].data.length; l++) {
                if (Number(company.result.revenue[UnderCategory.name].data[l].year) === Number(UnderCategory.data[0].year)) {
                 company.result.revenue[UnderCategory.name].data[l].months = UnderCategory.data[0].months
                 return;
                }
            }
            
            for (let k = 0; k < company.result.revenue[UnderCategory.name].data.length; k++) {
                if (Number(company.result.revenue[UnderCategory.name].data[k].year) > Number(UnderCategory.data[0].year)) {
                    company.result.revenue[UnderCategory.name].data.splice(k, 0, UnderCategory.data[0]);
                    return;
                }
            }
            
            company.result.revenue[UnderCategory.name].data.push(UnderCategory.data[0])
            return;

        } else {
            UnderCategory.characteristics = "Variabel"
            company.result.revenue[UnderCategory.name] = UnderCategory
        }
    } 
}

function SplitRowsIntoCategories (r, year) {
    r = r.trim(); // Remove whitespace
    year = year.trim();

    if (!r) return null; // Skip empty rows

    var cols = r.split(DELIMITER);
    if (cols.length === 0) return null; // Skip if no columns

    var type = cols[0]; // "sales" property in the object
    var data = cols.slice(1).map(Number); // Monthly data

    let salesObject = new FinancialMetric(type)
    let dataObject = new FinancialYear(year)

    let i = 0;
    Object.keys(dataObject.months).forEach(key => {
        dataObject.months[key] = data[i];
        i++;
    });

    salesObject.data.push(dataObject)

    return salesObject
}
import { readFile } from 'fs/promises';

/*
let hest1 = "Abekat";
let hest2 = "2023";
let hest = new FinancialMetric(hest1)
let hest5 = new FinancialYear(hest2)
hest.data.push(hest5)

let sss
let company = new CompanyData(sss);
company.result.revenue["Abekat"] = hest


import { readFile } from 'fs/promises';

try {
  const affe = await ParseCSV(txt_test)
  CSVObjectCreator(affe)
  
  console.log(company.result)
  console.log(company.result.revenue)
  Object.values(company.result.revenue).forEach(metric => {
    console.log(metric.data); // metric is each FinancialMetric
  });
  let filepath = '../ImportExport/hest.json'
  JsonWriteFile(filepath, company, function (err) {
    if (err) {
        console.error("Error writing file:", err);
    } else {
        console.log("File written successfully!");
    }
});
  
} catch (err) {
  console.error('Error reading file:', err);
}
*/

export {SplitRowsIntoCategories, CheckIfCategoryDataExists, CSVObjectCreator, ParseCSV}
