import {JsonReadFile, JsonWriteFile, JsonReadFileCb, JsonWriteFileCb} from '../useDatabase/handle-json.js'
import {SplitRowsIntoCategories, CheckIfCategoryDataExists, CSVObjectCreator, ParseCSV} from '../ImportExport/CSVParser.js'
import {Company, CompanyData, FinancialMetric, FinancialYear} from '../useDatabase/constructors.js'

const txt_test = '../ImportExport/lololol.txt'

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
  CSVObjectCreator(affe, company)
  console.log(company.result)
  console.log(company.result.revenue)
  Object.values(company.result.revenue).forEach(metric => {
    console.log(metric.data); // metric is each FinancialMetric
  });
} catch (err) {
    console.error('Error reading file:', err);
}

console.log(company)

const DELIMITER = ';'
const NEWLINE = '\n';

function ExportToCSV() {
    let Year = "2025";
    var rows = [];
    var headers = [Year, "Januar", "Februar", "Marts", "April", "May", "Juni", 
                  "Juli", "August", "September", "October", "November", "December", NEWLINE];

    // Add headers
    rows.push(headers.join(DELIMITER));

    ExtractOmsætningData (company, Year, rows)

    rows[rows.length-1] = rows[rows.length-1] + ";\n"

    ExtractOmkostningData (company, Year, rows)

    const hest = { name: "Cool Company" };

    DownloadCSVToDisk(rows, hest)
};

import { writeFile } from 'fs/promises';
import path from 'path';


async function DownloadCSVToDisk(rows, lompany) {
    const NEWLINE = '\n';
    const csvContent = rows.join(NEWLINE);

    const filename = lompany?.name
        ? `${lompany.name.replace(/[^a-z0-9]/gi, '_')}_data.csv`
        : 'financial_data.csv';

    const outputDir = 'C:/Users/keanv/Downloads'; // Make sure to use forward slashes or escape backslashes
    const filePath = path.join(outputDir, filename);

    try {
        await writeFile(filePath, csvContent, 'utf8');
        console.log(`CSV file saved to: ${filePath}`);
    } catch (err) {
        console.error('Error saving CSV:', err);
    }
}

function ExtractOmsætningData (company, Year, rows) {
    rows.push("Omsætning:")
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
    let rowDataVariabel = []
    let rowDataFast = []

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

    rows.push("Variable omkostninger:")
    rows.push(rowDataVariabel.join(NEWLINE))
    rows[rows.length-1] = rows[rows.length-1] + ";\n"

    rows.push("Faste omkostninger:")
    rows.push(rowDataFast.join(NEWLINE))
    rows[rows.length-1] = rows[rows.length-1] + ";\n"
}

ExportToCSV()

export {DownloadCSVToDisk, ExportToCSV}
