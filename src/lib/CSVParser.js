import {Company, CompanyData, FinancialMetric, FinancialYear} from '../lib/useDatabase/constructors.js'

//Parses CSV file content into one long string of text, with each new column seperated 
//by NEWLINE
function ParseCSV (file) {
    // Check that the file is valid and FileReader API is supported
    if (!file || !FileReader) {
        console.error("File or FileReader not available");
        return;
    }

    // Create a new FileReader
    var reader = new FileReader();

    // Read the content of the file as a text string
    return reader.readAsText(file);
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

function CSVObjectCreator (text) {
    // Check that text and tables exist
    if (!text) {
        console.error("No text or tables found!");
        return;
    }
    
    // Split the text into arrays
    var first_rows = text.split(/Omsætning|Variable omkostninger|Faste omkostninger/i);

    //Seperate year from the read CSV file
    var year_array = rows[0].split(DELIMITER);
    let year = year_array[0];

    //Remove index [0] from the array
    var rows = first_rows.split(0,1);


    var omsætningsDeler = rows[0].split(NEWLINE);
    var variableOmkostningerDeler = rows[1].split(NEWLINE)
    var fasteOmkostningerDeler = rows[2].split(NEWLINE)


    var omsætning = omsætningsDeler.map(r => SplitRowsIntoCategories(r, year))
    var variableOmkostninger = variableOmkostningerDeler.map(r => SplitRowsIntoCategories(r, year))
    var fasteOmkostninger = fasteOmkostningerDeler.map(r => SplitRowsIntoCategories(r, year))


    CheckIfCategoryDataExists(omsætning)

}

//Inputs created Objects from CSVObjectCreator into the companys' object
function CheckIfCategoryDataExists (omsætning, variableOmkostninger, fasteOmkostninger) {
    if (UnderCategory) {
        if (Company.result.revenue[UnderCategory]) {
            for (l = 0; l < Company.result.revenue[UnderCategory].data.length; l++) {
                if (Company.result.revenue[omsætning].data[l].year === omsætning.data[0].year) {
                 Company.result.revenue[omsætning].data[l].months = omsætning.data[0].months
                 return;
                }
            }
            for (k = 0; k < Company.result.revenue[omsætning].data.length; k++) {
                if (Number(Company.result.revenue[omsætning].data[k].year) > Number(omsætning.data[0].year))
                Company.result.revenue[omsætning].data[k-1].push(omsætning.data[0])
                return;
            }
        } else {
            Company.result.revenue.push(omsætning)
        }
    } else {

    }
}

function SplitRowsIntoCategories (r, year) {
    r = r.trim(); // Remove whitespace

    if (!r) return; // Skip empty rows

    var cols = r.split(DELIMITER);
    if (cols.length === 0) return; // Skip if no columns

    var type = cols[0]; // "sales" property in the object
    var data = cols.slice(1).map(Number); // Monthly data

    let salesObject = new FinancialMetric(cols[0])
    let dataObject = new FinancialYear(year)

    let i = 0;
    dataObject.months.keys(months).forEach(key => {
        key = data[i];
        i++;
    })

    salesObject.data.push(dataObject)

    return salesObject
}

let hest1 = "hest1";
let hest = new FinancialMetric(hest1)
console.log(hest1)
