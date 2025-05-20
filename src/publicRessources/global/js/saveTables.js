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

function EditResultData(company, Year) {

    updateCompanyDataFromTables(company, Year);

};

/**
     * Updates the company object with current table data
     */
function updateCompanyDataFromTables(company, Year, revenuetable, variabelexpensetable, fastexpensetable,) {

    var revenueUndercategories = getTableData(revenuetable, Year);
    var variabelExpenseUndercategories = getTableData(variabelexpensetable, Year);
    var fastExpenseUndercategories = getTableData(fastexpensetable, Year);
    
    //Take each new under-category object and compare it to the existing company data object
    revenueUndercategories.forEach(category => {
        CheckIfCategoryDataExists(category, variableOmkostninger, fasteOmkostninger, company)
    })
    variabelExpenseUndercategories.forEach(category => {
        CheckIfCategoryDataExists(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
    })
    fastExpenseUndercategories.forEach(category => {
        CheckIfCategoryDataExists(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
    })

};

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

function getTableData(tableId, Year) {

    var underCategories = []

    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tr'); 
    const data = [];
    
    // Skip header row (index 0)
    for (let k = 1; k < rows.length; k++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length > 0) {
            let newCompany = new FinancialMetric(cells[0])
            let newCompanyUndercategoryData = new FinancialYear(Year)
            Object.keys(newCompanyUndercategoryData.months).forEach((month, i) => {
                newCompanyUndercategoryData.months[month] = cells[i+1]
            });
            newCompany.data.push(newCompanyUndercategoryData)
            underCategories.push(newCompany)
        }
    }
    return underCategories;
};
