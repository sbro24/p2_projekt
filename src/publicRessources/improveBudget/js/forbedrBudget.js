// improveBudget/script.js

// Create the functionality for the html document to help improve the budget
// On the left hand side there should be two graphs: 1. displaying the differences between - budget, forecast and results
// 2. Displaying the historical data with forcast for greater overview
// On the right hand side there should be a tabel displaying the top 5 highest differences between budget and forecast
// Under the tabel a textbox with valuable information to the user
// On the bottom of the page there should be three dropdown bars each containing their own tabel: budget, forecast and results.
// The tables should be editable and when the user presses save the database hould be updated and the new forecast should be dispplayed
console.log("Script loaded - starting initialization");

// Month configuration
const monthMappingForStorage = {
    "Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April",
    "May": "May", "Jun": "June", "Jul": "July", "Aug": "August",
    "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"
};

const monthIndex = {
    january: 0, february: 1, march: 2, april: 3,
    may: 4, june: 5, july: 6, august: 7,
    september: 8, october: 9, november: 10, december: 11
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthMapping = {
    "january": "Jan", "february": "Feb", "march": "Mar", "april": "Apr",
    "may": "May", "june": "Jun", "july": "Jul", "august": "Aug",
    "september": "Sep", "october": "Oct", "november": "Nov", "december": "Dec"
};

// Global variables
let companyData = null;
let userId = null;
const chartInstances = {};

// ----------------------------
// HELPER FUNCTIONS
// ----------------------------

function sumMonthlyValues(months) {
    return Object.values(months).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function extractAllMonthlyData(dataSection) {
    const monthlySums = Array(12).fill(0);
    if (!dataSection || typeof dataSection !== 'object') return monthlySums;

    Object.values(dataSection).forEach(category => {
        category?.data?.forEach(yearData => {
            if (yearData.months) {
                Object.entries(yearData.months).forEach(([month, value]) => {
                    const index = monthIndex[month.toLowerCase()];
                    if (index !== undefined) {
                        monthlySums[index] += Number(value) || 0;
                    }
                });
            }
        });
    });

    return monthlySums;
}

function calculateCategoryTotal(categoryData) {
    if (!categoryData?.data) return 0;
    // FIX: Added missing parenthesis around (sum, yearData) in reduce callback
    return categoryData.data.reduce((sum, yearData) =>
        sum + (yearData.months ? sumMonthlyValues(yearData.months) : 0), 0);
}

function getTop5Differences(budgetData, forecastData) {
    if (!budgetData || !forecastData) return [];

    const allCategories = new Set([...Object.keys(budgetData), ...Object.keys(forecastData)]);

    return Array.from(allCategories).map(category => {
        const budgetTotal = calculateCategoryTotal(budgetData[category] || { data: [] });
        const forecastTotal = calculateCategoryTotal(forecastData[category] || { data: [] });
        const absoluteDifference = Math.abs(budgetTotal - forecastTotal);

        return {
            category,
            budget: budgetTotal,
            forecast: forecastTotal,
            absoluteDifference,
            difference: budgetTotal - forecastTotal,
            direction: budgetTotal > forecastTotal ? "Over" : "Under"
        };
    })
    .filter(item => item.absoluteDifference > 0)
    .sort((a, b) => b.absoluteDifference - a.absoluteDifference)
    .slice(0, 5);
}

// ----------------------------
// CHART FUNCTIONS
// ----------------------------

function createOrUpdateChart(chartId, type, data, options) {
    const ctx = document.getElementById(chartId)?.getContext('2d');
    if (!ctx) {
        console.error(`Canvas context not found for ${chartId}`);
        return null;
    }

    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
    }

    chartInstances[chartId] = new Chart(ctx, {
        type,
        data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            ...options
        }
    });

    return chartInstances[chartId];
}

// ----------------------------
// TABLE UTILITY FUNCTIONS (COPIED AND CORRECTED FROM genTabel.js)
// ----------------------------

/**
 * Transforms the months from the data.json to match display format.
 */
function TransformMonthsforDisplay(apiMonths) {
    console.log("TransformMonthsforDisplay: Input apiMonths", apiMonths);
    if (!apiMonths) {
        console.warn("TransformMonthsforDisplay: apiMonths is null or undefined.");
        return {}
    }
    const transformedMonths = {};
    for (const apiKey in apiMonths) {
        const displayKey = monthMapping[apiKey.toLowerCase()];
        if (displayKey) {
            transformedMonths[displayKey] = apiMonths[apiKey];
        } else {
            transformedMonths[apiKey] = apiMonths[apiKey];
        }
    }
    const orderedMonths = {}
    months.forEach(mKey => {
        orderedMonths[mKey] = transformedMonths[mKey] !== undefined ? transformedMonths[mKey] : 0
    })
    console.log("TransformMonthsforDisplay: Output orderedMonths", orderedMonths);
    return orderedMonths;
}

/**
 * Takes a single financial item, filters its data for the selected year, and transforms the months.
 * IMPORTANT: Hardcodes year to 2025 if not present in API data as per user request.
 */
function TransformAndFilterItemForYear(rawItem, selectedYear) {
    console.log("TransformAndFilterItemForYear: rawItem", rawItem, "selectedYear", selectedYear);
    if (!rawItem || !Array.isArray(rawItem.data) || rawItem.data.length === 0) {
        console.warn("TransformAndFilterItemForYear: Invalid rawItem or empty data array.", rawItem);
        return {
            name: rawItem ? rawItem.name : "Ukendt",
            characteristics: rawItem ? rawItem.characteristics : "Undefined",
            data: []
        }
    }

    // --- CRITICAL FIX: Hardcode year to 2025 as API data doesn't provide it ---
    // Assuming the first item in data array is for the selected year (2025)
    const yearSpecificEntry = rawItem.data[0];
    if (yearSpecificEntry) {
        yearSpecificEntry.year = selectedYear; // Ensure the year is explicitly set
        console.log("TransformAndFilterItemForYear: Hardcoded year to", selectedYear, "for entry:", yearSpecificEntry);
    }
    // --- END CRITICAL FIX ---

    if (yearSpecificEntry) {
        const result = {
            name: rawItem.name,
            characteristics: rawItem.characteristics,
            data: [{
                year: yearSpecificEntry.year,
                months: TransformMonthsforDisplay(yearSpecificEntry.months)
            }]
        };
        console.log("TransformAndFilterItemForYear: Returning result:", result);
        return result;
    } else {
        console.warn("TransformAndFilterItemForYear: No year-specific entry found after processing.");
        return {
            name: rawItem.name,
            characteristics: rawItem.characteristics,
            data: []
        }
    }
}

/**
 * Prepares raw company data for table display, including characteristics for expenses.
 */
function PrepareDataForTable(rawData, selectedYear) {
    console.log("PrepareDataForTable: Input rawData", rawData, "selectedYear", selectedYear);
    if (!rawData) {
        console.error("PrepareDataForTable: No data provided.");
        return null;
    }
    const dataForTable = {
        result: { revenue: {}, expense: {} },
        budget: { revenue: {}, expense: {} },
        forecast: { revenue: {}, expense: {} }
    }

    const processCategory = (source, target, type) => {
        console.log(`PrepareDataForTable: Processing ${type} category. Source:`, source);
        if (source) {
            for (const key in source) {
                let characteristics = "Undefined";

                if (type === 'expense') {
                    // Define your rules for "Fast" vs "Variabel" expenses here
                    // Ensure these match your actual 'Fast' expense category names EXACTLY (case-sensitive)
                    if (key === "Salaries" || key === "Maintenance" || key === "Rent") { // Adjust these as needed
                        characteristics = "Fast";
                    } else {
                        characteristics = "Variabel";
                    }
                    console.log(`  Category: ${key}, Type: ${type}, Assigned characteristics: ${characteristics}`);
                } else { // For revenue types
                     characteristics = "Revenue";
                     console.log(`  Category: ${key}, Type: ${type}, Assigned characteristics: ${characteristics}`);
                }

                target[key] = TransformAndFilterItemForYear({
                    name: key,
                    characteristics: characteristics,
                    data: source[key].data
                }, selectedYear);
            }
        } else {
            console.warn(`PrepareDataForTable: Source for ${type} is null or undefined.`);
        }
    };

    // Process all data sections
    processCategory(rawData.result?.revenue, dataForTable.result.revenue, 'revenue');
    processCategory(rawData.result?.expense, dataForTable.result.expense, 'expense');
    processCategory(rawData.budget?.revenue, dataForTable.budget.revenue, 'revenue');
    processCategory(rawData.budget?.expense, dataForTable.budget.expense, 'expense');
    processCategory(rawData.forecast?.revenue, dataForTable.forecast.revenue, 'revenue');
    processCategory(rawData.forecast?.expense, dataForTable.forecast.expense, 'expense');

    console.log("PrepareDataForTable: Output dataForTable", dataForTable);
    return dataForTable;
}

/**
 * Clears table data while preserving headers.
 * @param {HTMLTableElement} table - The table to clear.
 */
function clearTableData(table) {
    console.log("clearTableData: Clearing table", table?.className || table?.id);
    const tbody = table.querySelector('tbody');
    if (tbody) {
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }
        console.log("clearTableData: tbody cleared.");
    } else {
        // Fallback if no tbody, clear all but first row (assuming first row is header)
        console.warn("clearTableData: tbody not found, attempting to clear all but first row.");
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }
}

/**
 * Adds headers to a table.
 * @param {HTMLTableElement} table - The table to add headers to.
 * @param {Array} headers - The header labels (e.g., ["Jan", "Feb", ..., "Total"]).
 */
function addHeaders(table, headers) {
    console.log("addHeaders: Adding headers to table", table?.className || table?.id, "Headers:", headers);
    let thead = table.querySelector('thead');
    if (!thead) {
        thead = table.createTHead();
        console.log("addHeaders: Thead not found, created new one.");
    }
    let headerRow = thead.insertRow();

    // Add category/name header based on table class
    const nameTh = document.createElement('th');
    nameTh.textContent = table.classList.contains('results-revenue-table') || table.classList.contains('budget-revenue-table') ? 'Indtægt' : 'Omkostning';
    headerRow.appendChild(nameTh);

    // Add each month and total header
    headers.forEach(function (h) {
        var th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
    });
    console.log("addHeaders: Headers added.");
}

/**
 * Adds a data row to a table.
 * @param {HTMLTableElement} table - The table to add to.
 * @param {string} undercategory - The category name for the row.
 * @param {Array} data - The monthly data values including total (as strings).
 * @param {boolean} editable - Whether the cells should be editable.
 */
function addRow(table, undercategory, data, editable = false) {
    console.log("addRow: Adding row to table", table?.className || table?.id, "Category:", undercategory, "Data:", data, "Editable:", editable);
    var newRow = table.insertRow();

    // Add undercategory column
    var undercategoryCell = newRow.insertCell();
    undercategoryCell.textContent = undercategory;

    // Add monthly data columns
    data.forEach(function (d, index) {
        var cell = newRow.insertCell();
        const value = Number(d.trim()); // Convert to number for calculations/formatting

        // If editable and not the last column (Total)
        if (editable && index < data.length - 1) { // data.length - 1 excludes the 'Total' column
            console.log(`  addRow: Creating input for month ${months[index]} with value ${value}`);
            const input = document.createElement('input');
            input.type = 'number';
            input.value = value; // Set value from data
            input.dataset.month = months[index]; // Attach month data
            input.dataset.category = undercategory; // Attach category data
            cell.innerHTML = ''; // Clear text content
            cell.appendChild(input);
        } else {
            // For non-editable cells or the Total column
            console.log(`  addRow: Displaying text for month/total ${index} with value ${value}`);
            cell.textContent = value.toLocaleString('da-DK') + ' kr';
        }
    });
    console.log("addRow: Row added successfully.");
}

/**
 * Populates Result tables (logic originally from toTableRevenue in genTabel.js).
 * @param {object} companyDataObj - The prepared data object (e.g., from PrepareDataForTable).
 * @param {string} Year - The selected year.
 * @param {HTMLTableElement} revenueTable - HTML table for revenue.
 * @param {HTMLTableElement} variabelExpenseTable - HTML table for variable expenses.
 * @param {HTMLTableElement} fastExpenseTable - HTML table for fixed expenses.
 */
function toTableRevenue(companyDataObj, Year, revenueTable, variabelExpenseTable, fastExpenseTable) {
    console.log("toTableRevenue: Starting population for Results tables. Year:", Year, "Data:", companyDataObj.result);
    const DELIMITER = ";";
    const headers = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
                    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec", "Total"];

    if (!revenueTable || !variabelExpenseTable || !fastExpenseTable) {
        console.error("toTableRevenue: One or more tables are missing! Check your HTML selectors.");
        return;
    }

    clearTableData(revenueTable);
    clearTableData(variabelExpenseTable);
    clearTableData(fastExpenseTable);

    // Ensure headers exist (your HTML already has them, but this is a safeguard)
    if (!revenueTable.querySelector('thead tr')) addHeaders(revenueTable, headers);
    if (!variabelExpenseTable.querySelector('thead tr')) addHeaders(variabelExpenseTable, headers);
    if (!fastExpenseTable.querySelector('thead tr')) addHeaders(fastExpenseTable, headers);


    // --- Revenue ---
    console.log("toTableRevenue: Populating Revenue table for Results.");
    Object.keys(companyDataObj.result.revenue).forEach(key => {
        const revenueItem = companyDataObj.result.revenue[key];
        console.log("  Processing Result Revenue Item:", revenueItem.name);
        const yearData = revenueItem.data.find(entry => String(entry.year) === String(Year));

        if (yearData && yearData.months) {
            let rowDataString = "";
            let total = 0;
            months.forEach(monthKey => {
                const value = yearData.months[monthKey] || 0;
                rowDataString += ";" + String(value);
                total += Number(value);
            });
            rowDataString += ";" + String(total);

            const cols = rowDataString.split(DELIMITER);
            const data = cols.slice(1);
            addRow(revenueTable, revenueItem.name, data, true); // Results are not editable
        } else {
            console.warn(`  Result Revenue Item ${revenueItem.name} has no data for year ${Year}.`);
        }
    });

    // --- Expenses (Variabel & Fast) ---
    console.log("toTableRevenue: Populating Expense tables for Results.");
    Object.keys(companyDataObj.result.expense).forEach(key => {
        const expenseItem = companyDataObj.result.expense[key];
        console.log("  Processing Result Expense Item:", expenseItem.name, "Characteristics:", expenseItem.characteristics);
        const yearData = expenseItem.data.find(entry => String(entry.year) === String(Year));

        if (yearData && yearData.months) {
            let rowDataString = "";
            let total = 0;
            months.forEach(monthKey => {
                const value = yearData.months[monthKey] || 0;
                rowDataString += ";" + String(value);
                total += Number(value);
            });
            rowDataString += ";" + String(total);

            const cols = rowDataString.split(DELIMITER);
            const data = cols.slice(1);

            if (expenseItem.characteristics === "Variabel") {
                addRow(variabelExpenseTable, expenseItem.name, data, true); // Results are not editable
            } else if (expenseItem.characteristics === "Fast") {
                addRow(fastExpenseTable, expenseItem.name, data, true); // Results are not editable
            } else {
                console.warn(`  Result Expense Item ${expenseItem.name} has unhandled characteristic: ${expenseItem.characteristics}`);
            }
        } else {
            console.warn(`  Result Expense Item ${expenseItem.name} has no data for year ${Year}.`);
        }
    });
    console.log("toTableRevenue: Finished populating Results tables.");
}

/**
 * Populates Forecast tables (logic originally from ToTableForecast in genTabel.js, corrected).
 * @param {object} companyDataObj - The prepared data object (e.g., from PrepareDataForTable).
 * @param {string} Year - The selected year.
 * @param {HTMLTableElement} revenueTable - HTML table for revenue.
 * @param {HTMLTableElement} variabelExpenseTable - HTML table for variable expenses.
 * @param {HTMLTableElement} fastExpenseTable - HTML table for fixed expenses.
 * @param {boolean} editable - Whether the cells should contain input fields for editing.
 */
function ToTableForecast(companyDataObj, Year, revenueTable, variabelExpenseTable, fastExpenseTable, editable = true) { // CHANGED: editable default to false
    console.log("ToTableForecast: Starting population for Forecast tables. Year:", Year, "Data:", companyDataObj.forecast, "Editable:", editable);
    const DELIMITER = ";";
    const headers = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
                    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec", "Total"];

    if (!revenueTable || !variabelExpenseTable || !fastExpenseTable) {
        console.error("ToTableForecast: One or more tables are missing! Check your HTML selectors.");
        return;
    }

    clearTableData(revenueTable);
    clearTableData(variabelExpenseTable);
    clearTableData(fastExpenseTable);

    // Ensure headers exist (your HTML already has them, but this is a safeguard)
    if (!revenueTable.querySelector('thead tr')) addHeaders(revenueTable, headers);
    if (!variabelExpenseTable.querySelector('thead tr')) addHeaders(variabelExpenseTable, headers);
    if (!fastExpenseTable.querySelector('thead tr')) addHeaders(fastExpenseTable, headers);


    // --- Revenue ---
    console.log("ToTableForecast: Populating Revenue table for Forecast.");
    Object.keys(companyDataObj.forecast.revenue).forEach(key => { // Target forecast data
        const revenueItem = companyDataObj.forecast.revenue[key];
        console.log("  Processing Forecast Revenue Item:", revenueItem.name);
        const yearData = revenueItem.data.find(entry => String(entry.year) === String(Year));

        if (yearData && yearData.months) {
            let rowDataString = "";
            let total = 0;
            months.forEach(monthKey => {
                const value = yearData.months[monthKey] || 0;
                rowDataString += ";" + String(value);
                total += Number(value);
            });
            rowDataString += ";" + String(total);

            const cols = rowDataString.split(DELIMITER);
            const data = cols.slice(1);
            addRow(revenueTable, revenueItem.name, data, editable = true); // Pass editable status
        } else {
            console.warn(`  Forecast Revenue Item ${revenueItem.name} has no data for year ${Year}.`);
        }
    });

    // --- Expenses (Variabel & Fast) ---
    console.log("ToTableForecast: Populating Expense tables for Forecast.");
    Object.keys(companyDataObj.forecast.expense).forEach(key => { // Target forecast data
        const expenseItem = companyDataObj.forecast.expense[key];
        console.log("  Processing Forecast Expense Item:", expenseItem.name, "Characteristics:", expenseItem.characteristics);
        const yearData = expenseItem.data.find(entry => String(entry.year) === String(Year));

        if (yearData && yearData.months) {
            let rowDataString = "";
            let total = 0;
            months.forEach(monthKey => {
                const value = yearData.months[monthKey] || 0;
                rowDataString += ";" + String(value);
                total += Number(value);
            });
            rowDataString += ";" + String(total);

            const cols = rowDataString.split(DELIMITER);
            const data = cols.slice(1);

            if (expenseItem.characteristics === "Variabel") {
                addRow(variabelExpenseTable, expenseItem.name, data, editable); // Pass editable status
            } else if (expenseItem.characteristics === "Fast") {
                addRow(fastExpenseTable, expenseItem.name, data, editable); // Pass editable status
            } else {
                console.warn(`  Forecast Expense Item ${expenseItem.name} has unhandled characteristic: ${expenseItem.characteristics}`);
            }
        } else {
            console.warn(`  Forecast Expense Item ${expenseItem.name} has no data for year ${Year}.`);
        }
    });
    console.log("ToTableForecast: Finished populating Forecast tables.");
}
// --- END TABLE UTILITY FUNCTIONS ---


// ----------------------------
// TABLE CONTROL FUNCTIONS
// ----------------------------

/**
 * Adds a new row to a specific table.
 * @param {HTMLTableElement} table - The table to add the row to.
 */
function addRowToTable(table) {
    console.log("addRowToTable: Initiating add row for table", table?.className || table?.id);
    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error("addRowToTable: tbody not found for table", table?.className || table?.id);
        return;
    }

    const newCategoryName = prompt("Enter new category name:"); // Simple prompt for category name
    if (!newCategoryName) {
        console.log("addRowToTable: New category name not provided, operation cancelled.");
        return; // User cancelled or entered empty name
    }

    const newRowData = Array(months.length).fill(0); // 12 months, all starting at 0
    const total = newRowData.reduce((sum, val) => sum + val, 0);
    const dataWithTotal = newRowData.map(String);
    dataWithTotal.push(String(total));

    // Determine if the table should be editable based on its class
    // Only tables with 'budget-*-table' classes are editable in your HTML
    const isEditable = table.classList.contains('budget-revenue-table') ||
                       table.classList.contains('budget-fixed-expense-table') ||
                       table.classList.contains('budget-variable-expense-table');

    addRow(table, newCategoryName, dataWithTotal, isEditable);
    console.log("addRowToTable: New row added successfully.");
}

/**
 * Deletes the last row from a specific table.
 * @param {HTMLTableElement} table - The table to delete the row from.
 */
function deleteLastRowFromTable(table) {
    console.log("deleteLastRowFromTable: Initiating delete row for table", table?.className || table?.id);
    const tbody = table.querySelector('tbody');
    // Ensure there's a tbody and at least one data row (more than 0 rows in tbody)
    if (tbody && tbody.rows.length > 0) {
        if (confirm('Are you sure you want to delete the last category?')) {
            tbody.deleteRow(tbody.rows.length - 1);
            console.log("deleteLastRowFromTable: Last row deleted.");
        } else {
            console.log("deleteLastRowToTable: Delete operation cancelled by user.");
        }
    } else {
        console.warn("deleteLastRowFromTable: No rows to delete or tbody not found.");
    }
}

/**
 * Sets up event listeners for table control buttons (add/delete category).
 */
function setupTableControls() {
    console.log("setupTableControls: Setting up event listeners for table buttons.");
    document.querySelectorAll('.btnInsertCategory').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission if button is inside a form
            console.log("setupTableControls: 'Insert new category' button clicked.");
            const table = e.target.closest('div').querySelector('table');
            if (table) {
                addRowToTable(table);
            } else {
                console.error("setupTableControls: Could not find table for 'Insert new category' button.");
            }
        });
    });

    document.querySelectorAll('.btnDeleteCategory').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            console.log("setupTableControls: 'Delete last category' button clicked.");
            const table = e.target.closest('div').querySelector('table');
            if (table) {
                deleteLastRowFromTable(table);
            } else {
                console.error("setupTableControls: Could not find table for 'Delete last category' button.");
            }
        });
    });
    console.log("setupTableControls: Event listeners set up.");
}

// ----------------------------
// DASHBOARD INITIALIZATION
// ----------------------------

/**
 * Initializes the tables by populating them with data.
 */
function initializeTables() {
    console.log("initializeTables: Starting table initialization.");
    if (!companyData){
        console.log("initializeTables: companyData is null, returning.");
        return;
    }
    // Hardcode selectedYear to 2025 as per your requirement for this page
    const selectedYear = "2025";
    const tableData = PrepareDataForTable(companyData, selectedYear);
    console.log("initializeTables: Prepared table data for improveBudget:", tableData);
    if (!tableData) {
        console.log("initializeTables: tableData is null after PrepareDataForTable, returning.");
        return;
    }

    try {
        // Get HTML table elements for Results (under "Mit Budget" heading in HTML)
        console.log("initializeTables: Attempting to get Results tables ('.results-*-table').");
        const resultsRevenueTable = document.querySelector('.results-revenue-table');
        const resultsFixedExpenseTable = document.querySelector('.results-fixed-expense-table');
        const resultsVariableExpenseTable = document.querySelector('.results-variable-expense-table');
        console.log("  Results Revenue Table found:", !!resultsRevenueTable);
        console.log("  Results Fixed Expense Table found:", !!resultsFixedExpenseTable);
        console.log("  Results Variable Expense Table found:", !!resultsVariableExpenseTable);

        // Call our local toTableRevenue function for Results data (not editable)
        console.log("initializeTables: Calling toTableRevenue for Results data.");
        toTableRevenue(tableData, selectedYear, resultsRevenueTable, resultsVariableExpenseTable, resultsFixedExpenseTable);

        // Get HTML table elements for Forecast (under "Mit forecast" heading in HTML)
        console.log("initializeTables: Attempting to get Forecast tables ('.budget-*-table').");
        const forecastRevenueTable = document.querySelector('.budget-revenue-table'); // Matches HTML
        const forecastFixedExpenseTable = document.querySelector('.budget-fixed-expense-table'); // Matches HTML
        const forecastVariableExpenseTable = document.querySelector('.budget-variable-expense-table'); // Matches HTML
        console.log("  Forecast Revenue Table found:", !!forecastRevenueTable);
        console.log("  Forecast Fixed Expense Table found:", !!forecastFixedExpenseTable);
        console.log("  Forecast Variable Expense Table found:", !!forecastVariableExpenseTable);


        // Call our local ToTableForecast function for Forecast data (non-editable, like budget)
        console.log("initializeTables: Calling ToTableForecast for Forecast data (non-editable).");
        ToTableForecast(tableData, selectedYear, forecastRevenueTable, forecastVariableExpenseTable, forecastFixedExpenseTable, false); // CHANGED: passed false for editable

        // Reminder: As your HTML only has two sets of tables,
        // the original 'budget' data from your API (companyData.budget)
        // will not have a dedicated table to display in this setup.
        console.log("initializeTables: Table initialization complete.");

    } catch (error) {
        console.error("initializeTables: Table initialization error:", error);
    }
}

/**
 * Main function to initialize the dashboard, fetching data and setting up UI.
 */
async function initializeDashboard() {
    console.log("Initializing dashboard...");
    try {
        // Show loading state
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = 'block';
        console.log("Dashboard: Loading indicator shown.");

        // Load user profile
        console.log("Dashboard: Fetching user profile...");
        const profileResponse = await fetch('/api/user/profile', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });
        if (!profileResponse.ok) throw new Error('Failed to load profile');
        const profile = await profileResponse.json();
        userId = String(profile.id);
        console.log("Dashboard: User profile loaded:", profile);

        // Load company data
        console.log("Dashboard: Fetching company data...");
        const dataResponse = await fetch('/api/user/data/', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }

        });
        if (!dataResponse.ok) throw new Error(`API Error: ${dataResponse.status}`);
        companyData = await dataResponse.json();
        console.log("Dashboard: Raw companyData from API:", companyData);

        // Initialize charts
        console.log("Dashboard: Initializing charts...");
        createOrUpdateChart('comparisonChart', 'line', {
            labels: months,
            datasets: [
                {
                    label: 'Budget Revenue',
                    data: extractAllMonthlyData(companyData.budget?.revenue),
                    borderColor: '#4CAF50',
                    borderWidth: 2
                },
                {
                    label: 'Forecast Revenue',
                    data: extractAllMonthlyData(companyData.forecast?.revenue),
                    borderColor: '#2196F3',
                    borderWidth: 2
                },
                {
                    label: 'Actual Revenue',
                    data: extractAllMonthlyData(companyData.result?.revenue),
                    borderColor: '#9C27B0',
                    borderWidth: 2
                },
                {
                    label: 'Budget Expense',
                    data: extractAllMonthlyData(companyData.budget?.expense),
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    borderDash: [5, 5]
                },
                {
                    label: 'Forecast Expense',
                    data: extractAllMonthlyData(companyData.forecast?.expense),
                    borderColor: '#2196F3',
                    borderWidth: 2,
                    borderDash: [5, 5]
                },
                {
                    label: 'Actual Expense',
                    data: extractAllMonthlyData(companyData.result?.expense),
                    borderColor: '#9C27B0',
                    borderWidth: 2,
                    borderDash: [5, 5]
                }
            ]
        }, {
            plugins: { title: { display: true, text: '2025 Revenue Comparison' } },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { callback: value => `${value.toLocaleString()} kr` }
                }
            }
        });

        // Top Differences Chart
        console.log("Dashboard: Calculating top differences for display chart.");
        const revenueDifferences = getTop5Differences(companyData.budget?.revenue, companyData.forecast?.revenue);
        const expenseDifferences = getTop5Differences(companyData.budget?.expense, companyData.forecast?.expense);
        const allDifferences = [...revenueDifferences, ...expenseDifferences]
            .sort((a, b) => b.absoluteDifference - a.absoluteDifference)
            .slice(0, 5);

        createOrUpdateChart('displayChart', 'bar', {
            labels: allDifferences.map(item => `${item.category} (${item.direction})`),
            datasets: [
                {
                    label: 'Budget',
                    data: allDifferences.map(item => item.budget),
                    backgroundColor: '#4CAF50',
                    borderColor: '#388E3C',
                    borderWidth: 1
                },
                {
                    label: 'Forecast',
                    data: allDifferences.map(item => item.forecast),
                    backgroundColor: '#2196F3',
                    borderColor: '#1976D2',
                    borderWidth: 1
                }
            ]
        }, {
            plugins: {
                title: { display: true, text: 'Top 5 Budget vs Forecast Differences' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.raw.toLocaleString();
                            const diff = allDifferences[context.dataIndex];
                            const diffValue = Math.abs(diff.difference).toLocaleString();
                            return [
                                `${label}: ${value} kr`,
                                `Difference: ${diffValue} kr ${diff.direction}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount (kr)' },
                    ticks: { callback: value => `${value.toLocaleString()} kr` }
                }
            }
        });

        // Initialize tables and setup controls
        console.log("Dashboard: Initializing tables and setting up controls.");
        initializeTables();
        setupTableControls();

        console.log("Dashboard initialized successfully");

    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        const errorDisplay = document.getElementById('informationText');
        if (errorDisplay) {
            errorDisplay.innerHTML = `
                <div class="error-message">
                    <h4>Error Loading Dashboard</h4>
                    <p>${error.message}</p>
                </div>
            `;
        }
    } finally {
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = 'none';
        console.log("Dashboard: Loading indicator hidden.");
    }
}

// Start the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    initializeDashboard();
});