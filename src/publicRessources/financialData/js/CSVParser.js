const txt_test = '../ImportExport/lololol.txt'
const test_csv = '../../../../../../Downloads/case1-result-2022(in) (1).csv'

const DELIMITER = ';'
const NEWLINE = '\n';

class FinancialMetric {
    constructor(name) {
        this.name = name;
        this.data = Array(0);
    };
}

class FinancialYear {
    constructor (year) {
        this.year = year
        this.months = {
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0
        }
    };
}

async function CSVImporter (text, company, type) {
    //var text = await ParseCSV(test_csv)

    //console.log(text)

    CSVObjectCreator(text, company, type) //Make objects with file contents and compare them to company data object
}


//Transforms parsed CSV text into arrays, either being "Omsætning", "variable omkostninger"
//or "Faste omkostninger"
function CSVObjectCreator (text, company, type) {
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

    if (type === "result") {

    omsætning.forEach(category => {
        CheckIfCategoryDataExistsResult(category, variableOmkostninger, fasteOmkostninger, company)
    })
    variableOmkostninger.forEach(category => {
        CheckIfCategoryDataExistsResult(category, variableOmkostninger, fasteOmkostninger, company)
    })
    fasteOmkostninger.forEach(category => {
        CheckIfCategoryDataExistsResult(category, variableOmkostninger, fasteOmkostninger, company)
    })

    } else {

    omsætning.forEach(category => {
        CheckIfCategoryDataExistsBudget(category, variableOmkostninger, fasteOmkostninger, company)
    })
    variableOmkostninger.forEach(category => {
        CheckIfCategoryDataExistsBudget(category, variableOmkostninger, fasteOmkostninger, company)
    })
    fasteOmkostninger.forEach(category => {
        CheckIfCategoryDataExistsBudget(category, variableOmkostninger, fasteOmkostninger, company)
    })

    }

}

//Inputs created Objects from CSVObjectCreator into the companys' object
function CheckIfCategoryDataExistsResult (UnderCategory, variableOmkostninger, fasteOmkostninger, company) {
    //Checks if the undercategory belongs to "variableomkostninger" or "fasteomkostninger" over-category
    if (variableOmkostninger.includes(UnderCategory) || fasteOmkostninger.includes(UnderCategory)) {

        //Checks if an undercategory by given undercategory name already exists in company object
        if (company.result.expense[UnderCategory.name]) {

            //Runs through the undercategory in the company object and inputs dat if data year exists
            for (let l = 0; l < company.result.expense[UnderCategory.name].data.length; l++) {
                if (Number(company.result.expense[UnderCategory.name].data[l].year) === Number(UnderCategory.data[0].year)) {
                 company.result.expense[UnderCategory.name].data[l].months = UnderCategory.data[0].months
                 return;
                }
            }

            //If the undercategory year does not exist, insert year with its data at rigth place
            for (let k = 0; k < company.result.expense[UnderCategory.name].data.length; k++) {
                if (Number(company.result.expense[UnderCategory.name].data[k].year) > Number(UnderCategory.data[0].year)) {
                    company.result.expense[UnderCategory.name].data.splice(k, 0, UnderCategory.data[0]);
                    return;
                }
            }

            company.result.expense[UnderCategory.name].data.push(UnderCategory.data[0])
            return;

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

//Inputs created Objects from CSVObjectCreator into the companys' object
function CheckIfCategoryDataExistsBudget (UnderCategory, variableOmkostninger, fasteOmkostninger, company) {
    //Checks if the undercategory belongs to "variableomkostninger" or "fasteomkostninger" over-category
    if (variableOmkostninger.includes(UnderCategory) || fasteOmkostninger.includes(UnderCategory)) {

        //Checks if an undercategory by given undercategory name already exists in company object
        if (company.budget.expense[UnderCategory.name]) {

            //Runs through the undercategory in the company object and inputs dat if data year exists
            for (let l = 0; l < company.budget.expense[UnderCategory.name].data.length; l++) {
                if (Number(company.budget.expense[UnderCategory.name].data[l].year) === Number(UnderCategory.data[0].year)) {
                 company.budget.expense[UnderCategory.name].data[l].months = UnderCategory.data[0].months
                 return;
                }
            }

            //If the undercategory year does not exist, insert year with its data at rigth place
            for (let k = 0; k < company.budget.expense[UnderCategory.name].data.length; k++) {
                if (Number(company.budget.expense[UnderCategory.name].data[k].year) > Number(UnderCategory.data[0].year)) {
                    company.budget.expense[UnderCategory.name].data.splice(k, 0, UnderCategory.data[0]);
                    return;
                }
            }

            company.budget.expense[UnderCategory.name].data.push(UnderCategory.data[0])
            return;

            //Assign undercategory characteristic
        } else {
            if (variableOmkostninger.includes(UnderCategory)) {
                UnderCategory.characteristics = "Variabel"
            } else {
                UnderCategory.characteristics = "Fast"
            }

            company.budget.expense[UnderCategory.name] = UnderCategory

        }

        //If undercategory is not an "omkostning", goes through same process but with "omsætning"
    } else {
        if (company.budget.revenue[UnderCategory.name]) {
            company.budget.revenue[UnderCategory.name].characteristics = "Variabel"
            for (let l = 0; l < company.budget.revenue[UnderCategory.name].data.length; l++) {
                if (Number(company.budget.revenue[UnderCategory.name].data[l].year) === Number(UnderCategory.data[0].year)) {
                 company.budget.revenue[UnderCategory.name].data[l].months = UnderCategory.data[0].months
                 return;
                }
            }
            
            for (let k = 0; k < company.budget.revenue[UnderCategory.name].data.length; k++) {
                if (Number(company.budget.revenue[UnderCategory.name].data[k].year) > Number(UnderCategory.data[0].year)) {
                    company.budget.revenue[UnderCategory.name].data.splice(k, 0, UnderCategory.data[0]);
                    return;
                }
            }
            
            company.budget.revenue[UnderCategory.name].data.push(UnderCategory.data[0])
            return;

        } else {
            UnderCategory.characteristics = "Variabel"
            company.budget.revenue[UnderCategory.name] = UnderCategory
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
