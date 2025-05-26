/**
* Converts CSV text to HTML table format
* @param {string} text - The CSV content to convert
*/
function toTableRevenue(company, Year, revenueTable, variabelExpenseTable, fastExpenseTable) {

    const DELIMITER = ";"

    // Check that text and tables exist
    if (!revenueTable || !variabelExpenseTable || !fastExpenseTable) {
        console.error("No text or tables found!");
        return;
    }

    // Clear existing table data while preserving headers
    clearTableData(revenueTable);
    clearTableData(variabelExpenseTable);
    clearTableData(fastExpenseTable)
    
    console.log(company)

    // Define table headers
    var headers = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Add headers if they don't exist
    if (revenueTable.rows.length === 0) {
        addHeaders(revenueTable, headers);
    }
    
    if (variabelExpenseTable.rows.length === 0) {
        addHeaders(variabelExpenseTable, headers);
    }
    if (fastExpenseTable.rows.length === 0) {
        addHeaders(fastExpenseTable, headers);
    }
    

    Object.keys(company.result.revenue).forEach(key => {
        const revenueItem = company.result.revenue[key];
        var dataOmsætning = "1";
        console.log(dataOmsætning)
        revenueItem.data.forEach(index => {
            if (Number(index.year) === Number(Year)) {
                Object.keys(index.months).forEach(month => {
                    dataOmsætning += ";" + String(index.months[month].toFixed(2))
                })
            var cols = dataOmsætning.split(DELIMITER)
            var data = cols.slice(1)
            addRow(revenueTable, revenueItem.name, data);
            }
        })
    })

    Object.keys(company.result.expense).forEach(key => {
        const variabelExpenseItem = company.result.expense[key];
        if (variabelExpenseItem.characteristics === "Variabel") {
            var dataVariabelExpense = "1";
            variabelExpenseItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        dataVariabelExpense += ";" + String(index.months[month].toFixed(2))
                    })
                    var cols = dataVariabelExpense.split(DELIMITER)
                    var data = cols.slice(1)
                    addRow(variabelExpenseTable, variabelExpenseItem.name, data);
                }
            })
        } else {
            var dataVariabelExpense = "1";
            variabelExpenseItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        dataVariabelExpense += ";" + String(index.months[month].toFixed(2))
                    })
                    var cols = dataVariabelExpense.split(DELIMITER)
                    var data = cols.slice(1)
                    addRow(fastExpenseTable, variabelExpenseItem.name, data);
                }
            })
        }
    })
}


function ToTableForecast(company, Year, revenueTable, fastExpenseTable, variabelExpenseTable) {
    const DELIMITER = ";"

    // Check that text and tables exist
    if (!revenueTable || !variabelExpenseTable || !fastExpenseTable) {
        console.error("No text or tables found!");
        return;
    }

    // Clear existing table data while preserving headers
    clearTableData(revenueTable);
    clearTableData(variabelExpenseTable);
    clearTableData(fastExpenseTable)
    

    // Define table headers
    var headers = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Add headers if they don't exist
    if (revenueTable.rows.length === 0) {
        addHeaders(revenueTable, headers);
    }
    
    if (variabelExpenseTable.rows.length === 0) {
        addHeaders(variabelExpenseTable, headers);
    }
    if (fastExpenseTable.rows.length === 0) {
        addHeaders(fastExpenseTable, headers);
    }
    

    Object.keys(company.forecast.revenue).forEach(key => {
        const revenueItem = company.forecast.revenue[key];
        var dataOmsætning = "1";
        revenueItem.data.forEach(index => {
        if (Number(index.year) === Number(Year)) {
            Object.keys(index.months).forEach(month => {
                dataOmsætning += ";" + String(index.months[month].toFixed(2))
            })
            var cols = dataOmsætning.split(DELIMITER)
            var data = cols.slice(1)
            addRow1(revenueTable, revenueItem.name, data);
        }
    })
})

    Object.keys(company.forecast.expense).forEach(key => {
        const variabelExpenseItem = company.forecast.expense[key];
        if (variabelExpenseItem.characteristics === "Variabel") {
            var dataVariabelExpense = "1";
            variabelExpenseItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        dataVariabelExpense += ";" + String(index.months[month].toFixed(2))
                    })
                    var cols = dataVariabelExpense.split(DELIMITER)
                    var data = cols.slice(1)
                    addRow1(variabelExpenseTable, variabelExpenseItem.name, data);
                }
            })
        } else {
            var dataVariabelExpense = "1";
            variabelExpenseItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        dataVariabelExpense += ";" + String(index.months[month].toFixed(2))
                    })
                    var cols = dataVariabelExpense.split(DELIMITER)
                    var data = cols.slice(1)
                    addRow1(fastExpenseTable, variabelExpenseItem.name, data);
                }
            })
        }
    })
}

function toTableBudget(company, Year, revenueTable, variabelExpenseTable, fastExpenseTable, Type) {

    // Check that text and tables exist
    if (!revenueTable || !variabelExpenseTable || !fastExpenseTable) {
        console.error("No text or tables found!");
        return;
    }

    // Clear existing table data while preserving headers
    clearTableData(revenueTable);
    clearTableData(variabelExpenseTable);
    clearTableData(fastExpenseTable)

    // Define table headers
    var headers = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Add headers if they don't exist
    if (revenueTable.rows.length === 0) {
        addHeaders(revenueTable, headers);
    }
    
    if (variabelExpenseTable.rows.length === 0) {
        addHeaders(variabelExpenseTable, headers);
    }
    if (fastExpenseTable.rows.length === 0) {
        addHeaders(fastExpenseTable, headers);
    }
    
    writeDataForRow (company, Year, Type, revenueTable, variabelExpenseTable, fastExpenseTable)

}

/**
 * Clears table data while preserving headers
 * @param {HTMLTableElement} table - The table to clear
 */
function clearTableData(table) {
    // Keep the header row (index 0) and remove all others
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
}

/**
 * Adds headers to a table
 * @param {HTMLTableElement} table - The table to add headers to
 * @param {Array} headers - The header labels
 */
function addHeaders(table, headers) {
    var headerRow = table.createTHead().insertRow(); // Create header row

    // Add each header cell
    headers.forEach(function (h) {
        var th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
    });
}

/**
 * Adds a data row to a table
 * @param {HTMLTableElement} table - The table to add to
 * @param {string} year - The year for the row
 * @param {Array} data - The monthly data values
 */
function addRow(table, undercategory, data) {
    const tbody = table.querySelector('tbody');
    var newRow = tbody.insertRow(); // Create new row

    // Add year column
    var undercategoryCell = newRow.insertCell();
    undercategoryCell.textContent = undercategory;

    // Add monthly data columns
    data.forEach(function (d) {
        var cell = newRow.insertCell();
        cell.textContent = d.trim();
        cell.setAttribute('contenteditable', 'true'); // Make cells editable
    });
}

/**
 * Deletes the last row of a table
 * @param {HTMLTableElement} table - The table delete from
 */
function deleteLastRow(table) {
    if (!table) {
        return;
    }
    if (table.rows.length > 0) {
        table.deleteRow(-1); // -1 deletes the last row
    } else {
        console.error("No rows to delete.");
        alert("Fejl: Ingen rækker at slette.");
    }  
}

function writeDataForRow (company, Year, Type, revenueTable, variabelExpenseTable, fastExpenseTable) {

    const DELIMITER = ";"

    Object.keys(company.budget.revenue).forEach(key => {
        const revenueItem = company.budget.revenue[key];
        var dataOmsætning = "1";
        revenueItem.data.forEach(index => {
            if (Number(index.year) === Number(Year)) {
                Object.keys(index.months).forEach(month => {
                    dataOmsætning += ";" + String(index.months[month].toFixed(2))
                })
            }
            console.log(dataOmsætning)
            var cols = dataOmsætning.split(DELIMITER)
            var data = cols.slice(1)
            console.log(data)
            if (Type === "forbedr") {
                addRow1(revenueTable, revenueItem.name, data);
            } else {
                addRow(revenueTable, revenueItem.name, data);
            }
        })
    })

    Object.keys(company.budget.expense).forEach(key => {
        const variabelExpenseItem = company.budget.expense[key];
        if (variabelExpenseItem.characteristics === "Variabel") {
            var dataVariabelExpense = "1";
            variabelExpenseItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        dataVariabelExpense += ";" + String(index.months[month].toFixed(2))
                    })
                }
                console.log(dataVariabelExpense)
                var cols = dataVariabelExpense.split(DELIMITER)
                var data = cols.slice(1)
                console.log(data)
                if (Type === "forbedr") {
                    addRow1(variabelExpenseTable, variabelExpenseItem.name, data);
                } else {
                    addRow(variabelExpenseTable, variabelExpenseItem.name, data);
                }
            })
        } else {
            var dataVariabelExpense = "1";
            variabelExpenseItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        dataVariabelExpense += ";" + String(index.months[month].toFixed(2))
                    })
                }
                console.log(dataVariabelExpense)
                var cols = dataVariabelExpense.split(DELIMITER)
                var data = cols.slice(1)
                console.log(data)
                if (Type === "forbedr") {
                    addRow1(fastExpenseTable, variabelExpenseItem.name, data);
                } else {
                    addRow(fastExpenseTable, variabelExpenseItem.name, data);
                }
            })
        }
    })
}

