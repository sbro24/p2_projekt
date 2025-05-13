import {Company, CompanyData, FinancialMetric, FinancialYear} from '../useDatabase/constructors.js'

import {JsonReadFile, JsonWriteFile, JsonReadFileCb, JsonWriteFileCb} from '../useDatabase/handle-json.js'

import { companyDataTemplate } from '../../publicRessources/login/js/companies.js'

import {SumUndercategories, OvercategoryFinder, OvercategoryRunner} from '../maths/SumUndercategories.js'

const txt_test = '../ImportExport/lololol.txt'
const test_csv = '../../../../../../Downloads/case1-2020(in)rettedhestabe.csv'

/*
async function CSVHest (file) {
const hest123 = await ParseCSV(file)
console.log(hest123);
}
*/

const DELIMITER = ';'
const NEWLINE = '\n';


async function CSVImporter (file, company) {
    const csvText = await ParseCSV(file) //Read the file

    CSVObjectCreator(csvText, company) //Make objects with file contents and compare them to company data object

    SumUndercategories(company, "2021")
}

//Parses CSV file content into one long string of text, with each new column seperated 
//by NEWLINE
async function ParseCSV (file) {
    // Check that the file is valid and FileReader API is supported
    if (!file) {
        console.error("File not available");
        return;
    }

    //Read contents of file, return as one long string
    try {
        const data = await readFile(file, 'utf8');
        return data;
    } catch (err) {
        console.error('Error reading CSV:', err);
      }
}

//Transforms parsed CSV text into arrays, either being "Omsætning", "variable omkostninger"
//or "Faste omkostninger"
function CSVObjectCreator (text, company) {
    // Check that text and tables exist
    if (!text) {
        console.error("No text or tables found!");
        return;
    }
    
    // Split the text into arrays
    var first_rows = text.split(/Omsaetning|Variable omkostninger|Faste omkostninger/i);

    //Seperate year from the read CSV file
    var year_array = first_rows[0].split(DELIMITER);
    let year = year_array[0];

    //Remove index [0] from the array
    var rows = first_rows.slice(1);

    //Split each over-categorys' under-categories into an array seperated by NEWLINE
    var omsætningsDeler = rows[0].split(NEWLINE);
    var variableOmkostningerDeler = rows[1].split(NEWLINE)
    var fasteOmkostningerDeler = rows[2].split(NEWLINE)

    //Take undercategories and create dataobjects with constructors based on undercategory name and
    //its data
    var omsætning = omsætningsDeler.map(r => SplitRowsIntoCategories(r, year)).filter(Boolean)
    var variableOmkostninger = variableOmkostningerDeler.map(r => SplitRowsIntoCategories(r, year)).filter(Boolean)
    var fasteOmkostninger = fasteOmkostningerDeler.map(r => SplitRowsIntoCategories(r, year)).filter(Boolean)

    //Take each new under-category object and compare it to the existing company data object
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
    //Checks if the undercategory belongs to "variableomkostninger" or "fasteomkostninger" over-category
    if (variableOmkostninger.includes(UnderCategory) || fasteOmkostninger.includes(UnderCategory)) {

        //Checks if an undercategory by given undercategory name already exists in company object
        if (company.result.expense[UnderCategory.name]) {

            //Runs through the undercategory in the company object and inputs dat if data year exists
            for (let l = 0; l < company.result.expense[UnderCategory.name].data.length; l++) {
                if (company.result.expense[UnderCategory.name].data[l].year === UnderCategory.data[0].year) {
                 company.result.expense[UnderCategory.name].data[l].months = UnderCategory.data[0].months
                 return;
                }
            }

            //If the undercategory year does not exist, insert year with its data at rigth place
            for (let k = 0; k < company.result.expense[UnderCategory.name].data.length; k++) {
                if (Number(company.result.expense[UnderCategory.name].data[k].year) > Number(UnderCategory.data[0].year))
                company.result.expense[UnderCategory.name].data[k-1].push(UnderCategory.data[0])
                return;
            }

            //Assign undercategory characteristic
        } else {
            if (variableOmkostninger.includes(UnderCategory)) {
                UnderCategory.characteristics = "Variabel"
            } else {
                UnderCategory.characteristics = "Fast"
            }

            company.result.expense[UnderCategory.name] = UnderCategory

        }

        //If undercategory is not an "omkostning", goes through same process but with "omsætning"
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
    if (cols.every(col => !col.trim())) return null;
    if (cols.length === 0) return null; // Skip if no columns

    var type = cols[0]; // "sales" property in the object
    var data = cols.slice(1).map(cell => {
        let normalized = cell.replace(/\./g, '').replace(',', '.'); // Remove thousands separator, fix decimal
        return Number(normalized);
    });

    let salesObject = new FinancialMetric(type) //Create new undercategory object with undercategory name
    let dataObject = new FinancialYear(year) //Create new "year" object which goes in "data" array

    //Insert data into "year" object
    let i = 0;
    Object.keys(dataObject.months).forEach(key => {
        dataObject.months[key] = data[i];
        i++;
    });

    //Push "year" object into data array in undercategory object
    salesObject.data.push(dataObject)

    return salesObject
}

let hest1 = "Abekat";
let hest2 = "2023";
let hest = new FinancialMetric(hest1)
let hest5 = new FinancialYear(hest2)
hest.data.push(hest5)

let sss
let company = new CompanyData(sss);
company.result.revenue["Abekat"] = hest

CSVImporter(test_csv, company)

import { readFile } from 'fs/promises';

export {SplitRowsIntoCategories, CheckIfCategoryDataExists, CSVObjectCreator, ParseCSV}
