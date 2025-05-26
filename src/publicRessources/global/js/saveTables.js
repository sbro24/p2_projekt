function EditResultData(company, Year) {

    updateCompanyDataFromTables(company, Year);

};

/**
     * Updates the company object with current table data
     */
function updateCompanyDataFromTables(company, Year, revenuetable, variabelexpensetable, fastexpensetable, Type) {

    var revenueUndercategories = getTableData(revenuetable, Year);
    var variabelExpenseUndercategories = getTableData(variabelexpensetable, Year);
    var fastExpenseUndercategories = getTableData(fastexpensetable, Year);
    
    //Take each new under-category object and compare it to the existing company data object
    if (Type === "result") {
        revenueUndercategories.forEach(category => {
            CheckIfCategoryDataExistsResult(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
        })
        variabelExpenseUndercategories.forEach(category => {
            CheckIfCategoryDataExistsResult(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
        })
        fastExpenseUndercategories.forEach(category => {
            CheckIfCategoryDataExistsResult(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
        })
    } else {
        revenueUndercategories.forEach(category => {
            CheckIfCategoryDataExistsBudget(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
        })
        variabelExpenseUndercategories.forEach(category => {
            CheckIfCategoryDataExistsBudget(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
        })
        fastExpenseUndercategories.forEach(category => {
            CheckIfCategoryDataExistsBudget(category, variabelExpenseUndercategories, fastExpenseUndercategories, company)
        })
    }

};

function CheckIfCategoryDataExistsResult (UnderCategory, variableOmkostninger, fasteOmkostninger, company) {
    //Checks if the undercategory belongs to "variableomkostninger" or "fasteomkostninger" over-category
    if (variableOmkostninger.includes(UnderCategory) || fasteOmkostninger.includes(UnderCategory)) {

        //Checks if an undercategory by given undercategory name already exists in company object
        if (company.result.expense[UnderCategory.name]) {

            for (let l = 0; l < company.result.expense[UnderCategory.name].data.length; l++) {
                if (Number(company.result.expense[UnderCategory.name].data[l].year) === Number(UnderCategory.data[0].year)) {
                    const numericMonths = {};
                    Object.entries(UnderCategory.data[0].months).forEach(([month, value]) => {
                        // Convert to number using parseFloat or Number
                        numericMonths[month] = parseFloat(value) || 0; // fallback to 0 if conversion fails
                    });
                     company.result.expense[UnderCategory.name].data[l].months = numericMonths
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
                const numericMonths = {};
                Object.entries(UnderCategory.data[0].months).forEach(([month, value]) => {
                    // Convert to number using parseFloat or Number
                    numericMonths[month] = parseFloat(value) || 0; // fallback to 0 if conversion fails
                });
                 company.result.revenue[UnderCategory.name].data[l].months = numericMonths
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

function CheckIfCategoryDataExistsBudget (UnderCategory, variableOmkostninger, fasteOmkostninger, company) {
        //Checks if the undercategory belongs to "variableomkostninger" or "fasteomkostninger" over-category
        if (variableOmkostninger.includes(UnderCategory) || fasteOmkostninger.includes(UnderCategory)) {

            //Checks if an undercategory by given undercategory name already exists in company object
            if (company.budget.expense[UnderCategory.name]) {
    
                for (let l = 0; l < company.budget.expense[UnderCategory.name].data.length; l++) {
                    if (Number(company.budget.expense[UnderCategory.name].data[l].year) === Number(UnderCategory.data[0].year)) {
                        const numericMonths = {};
                        Object.entries(UnderCategory.data[0].months).forEach(([month, value]) => {
                            // Convert to number using parseFloat or Number
                            numericMonths[month] = parseFloat(value) || 0; // fallback to 0 if conversion fails
                        });
                         company.budget.expense[UnderCategory.name].data[l].months = numericMonths
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
                    const numericMonths = {};
                    Object.entries(UnderCategory.data[0].months).forEach(([month, value]) => {
                        // Convert to number using parseFloat or Number
                        numericMonths[month] = parseFloat(value) || 0; // fallback to 0 if conversion fails
                    });
                     company.budget.revenue[UnderCategory.name].data[l].months = numericMonths
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

function getTableData(tableId, Year) {

    var underCategories = []

    const table = tableId;
    const rows = table.querySelectorAll('tr');
    const data = [];
    
    // Skip header row (index 0)
    for (let k = 0; k < rows.length; k++) {
        const cells = rows[k].querySelectorAll('td');
        if (cells.length > 0) {
            let newCompany = new FinancialMetric(cells[0].textContent.trim())
            let newCompanyUndercategoryData = new FinancialYear(Year)
            Object.keys(newCompanyUndercategoryData.months).forEach((month, i) => {
                newCompanyUndercategoryData.months[month] = Number(cells[i+1].textContent.trim())
            });
            newCompany.data.push(newCompanyUndercategoryData)
            underCategories.push(newCompany)
        }
    }
    return underCategories;
};

/*
function PrepareDataForTable(rawData, selectedYear) {
    if (!rawData) {
        console.error("No data provided");
        return null;
    }
    const dataForTable = {
        result: { revenue: {}, expense: {} },
        budget: { revenue: {}, expense: {} }
    }
    // Nested function to process a category
    const processCategoryForTable = (category,targetCategory) => {
        if (category) {
            for (const key in category) {
                targetCategory[key] = TransformAndFilterItemForYear(category[key], selectedYear) // Transform and filter the categories for the selected year
            }
        }
    }
    // Process revenue and expense categories for both result and budget
    processCategoryForTable(rawData.result.revenue, dataForTable.result.revenue)
    processCategoryForTable(rawData.result.expense, dataForTable.result.expense)
    processCategoryForTable(rawData.budget.revenue, dataForTable.budget.revenue)
    processCategoryForTable(rawData.budget.expense, dataForTable.budget.expense)

    return dataForTable
}
*/
