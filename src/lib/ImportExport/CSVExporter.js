import {JsonReadFile, JsonWriteFile, JsonReadFileCb, JsonWriteFileCb} from '../useDatabase/handle-json.js'
import {SplitRowsIntoCategories, CheckIfCategoryDataExists, CSVObjectCreator, ParseCSV} from '../ImportExport/CSVParser.js'
import {Company, CompanyData, FinancialMetric, FinancialYear} from '../useDatabase/constructors.js'

const DELIMITER = ';'
const NEWLINE = '\n';
let Year = "2025";

function ExportToCSV(company, Year) {
    var rows = []; //Initiate rows array
    //Initiate headers array with the given year and every month
    var headers = [Year, "Januar", "Februar", "Marts", "April", "May", "Juni", 
                  "Juli", "August", "September", "October", "November", "December", NEWLINE];

    rows.push(headers.join(DELIMITER)); // Add headers

    ExtractOmsætningData (company, Year, rows) //Run ExtractOmsætningData function with specific year

    rows[rows.length-1] = rows[rows.length-1] + ";\n" //Add NEWLINE

    ExtractOmkostningData (company, Year, rows) //Run ExtractOmkostningData function with specific year

    const hest = { name: "Cool Company" }; //CSV file name

    DownloadCSVToDisk(rows, hest) //Run "DownloadCSVToDisk" function
};

import { writeFile } from 'fs/promises';
import path from 'path';


async function DownloadCSVToDisk(rows, lompany) {
    const NEWLINE = '\n';

    //csvContent = each overcategory and its undercategories joined together by NEWLINE
    //This means csvContent is now one long string
    const csvContent = rows.join(NEWLINE);

    //
    const filename = lompany?.name
        ? `${lompany.name.replace(/[^a-z0-9]/gi, '_')}_data.csv`
        : 'financial_data.csv';

    const outputDir = 'C:/Users/keanv/Downloads'; //Folder to store new csv file
    const filePath = path.join(outputDir, filename); //filepath contains folder and name of csv file

    //Write csv into filepath using the long string from csvContent
    try {
        await writeFile(filePath, csvContent, 'utf8');
        console.log(`CSV file saved to: ${filePath}`);
    } catch (err) {
        console.error('Error saving CSV:', err);
    }
}

function ExtractOmsætningData (company, Year, rows) {
    //Push "omsætning" overcategory name into rows
    rows.push("Omsætning:")

    //Push undercategory name and the given years' data into rowData array, and join each index
    //in the rowData array with a DELIMITER and push into "rows" array.
    Object.values(company.result.revenue).forEach(metric => {
        let rowData = []
        for (let l = 0; l < metric.data.length; l++) {
            if (Number(metric.data[l].year) === Number(Year)) {
                rowData.push(metric.name)
                Object.values(metric.data[l].months).forEach(r => {
                    rowData.push(r)
                })
                rows.push(rowData.join(DELIMITER));
            }
        }
    });
}

function ExtractOmkostningData (company, Year, rows) {
    //Initiate "rowDataVariabel" array, which will act as "rowData" but
    //for "Variabel Omkostning" overcategory
    let rowDataVariabel = []
    let rowDataFast = [] //Same as "rowDataVariabel" but for "faste omkostninger" overcategory

    //Same as in "ExtractOmsætningData" but checks for "characteristic" first to know which array
    //to place data into
    Object.values(company.result.expense).forEach(metric => {
        let rowData = []
        for (let k = 0; k < metric.data.length; k++) {
            if (Number(metric.data[k].year) === Number(Year)) {
                if (metric.characteristics === "Variabel") {
                    rowData.push(metric.name)
                    Object.values(metric.data[k].months).forEach(r => {
                        rowData.push(r)
                    })
                 rowDataVariabel.push(rowData.join(DELIMITER))
             } else {
                rowData.push(metric.name)
                Object.values(metric.data[k].months).forEach(r => {
                    rowData.push(r)
                })
                rowDataFast.push(rowData.join(DELIMITER))
              }
            }
        }
    });

    rows.push("Variable omkostninger:") //Push overcategory name
    rows.push(rowDataVariabel.join(NEWLINE)) //join "rowDataVariabel" index' with newline and push to "rows"
    rows[rows.length-1] = rows[rows.length-1] + ";\n"

    rows.push("Faste omkostninger:") //push overcategory name
    rows.push(rowDataFast.join(NEWLINE)) //join "rowDataFast" index' with newline and push to "rows"
    rows[rows.length-1] = rows[rows.length-1] + ";\n"
}

ExportToCSV(company, Year)

export {DownloadCSVToDisk, ExportToCSV}
