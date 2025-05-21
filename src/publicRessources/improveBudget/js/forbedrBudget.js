// improveBudget/script.js

// Create the functionality for the html document to help improve the budget
// On the left hand side there should be two graphs: 1. displaying the differences between - budget, forecast and results
// 2. Displaying the historical data with forcast for greater overview
// On the right hand side there should be a tabel displaying the top 5 highest differences between budget and forecast
// Under the tabel a textbox with valuable information to the user
// On the bottom of the page there should be two dropdown bars each containing their own tabel: budget and forecast.
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
const staticYear = "2025"; // All tables will now display data for 2025

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
// TABLE UTILITY FUNCTIONS
// ----------------------------

/**
 * Transforms the months from the data.json to match display format.
 */
function TransformMonthsforDisplay(apiMonths) {
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
    return orderedMonths;
}

/**
 * Takes a single financial item, filters its data for the selected year, and transforms the months.
 * This function is now simplified to only look for the staticYear (2025) or an entry without a year.
 */
function TransformAndFilterItemForYear(rawItem, selectedYear) {
    if (!rawItem || !Array.isArray(rawItem.data) || rawItem.data.length === 0) {
        console.warn(`TransformAndFilterItemForYear: Invalid rawItem or empty data array for ${rawItem?.name}.`);
        return {
            name: rawItem ? rawItem.name : "Ukendt",
            characteristics: rawItem ? rawItem.characteristics : "Undefined",
            data: []
        }
    }

    let yearSpecificEntry = rawItem.data.find(entry => String(entry.year) === String(selectedYear));

    // If no entry found with explicit year, try to find an entry without a year property
    // and assign it the selectedYear (2025) if it makes sense.
    if (!yearSpecificEntry && selectedYear === staticYear) {
        const potentialEntryWithoutYear = rawItem.data.find(entry => entry.year === undefined || entry.year === null || String(entry.year).trim() === '');

        if (potentialEntryWithoutYear) {
            yearSpecificEntry = potentialEntryWithoutYear;
            yearSpecificEntry.year = selectedYear; // Assign the static year
        }
    }

    if (yearSpecificEntry) {
        const result = {
            name: rawItem.name,
            characteristics: yearSpecificEntry.characteristics || rawItem.characteristics,
            data: [{
                year: yearSpecificEntry.year,
                months: TransformMonthsforDisplay(yearSpecificEntry.months)
            }]
        };
        return result;
    } else {
        console.warn(`TransformAndFilterItemForYear: No data found for year ${selectedYear} for item ${rawItem.name}. Returning empty data.`);
        return {
            name: rawItem.name,
            characteristics: rawItem.characteristics,
            data: []
        }
    }
}

/**
 * Extracts and filters data for a specific section (e.g., revenue or expense) for a given year.
 * @param {object} rawDataSection - The raw revenue or expense section from companyData.
 * @param {string} selectedYear - The year to filter data for.
 * @returns {object} An object with categories and their data filtered for the selected year.
 */
function getYearlySectionData(rawSection, selectedYear) {
    const yearlyData = {};
    if (!rawSection || typeof rawSection !== 'object') return yearlyData;

    for (const key in rawSection) {
        let characteristics = "Undefined";

        // Determine characteristics for expense items
        if (rawSection === companyData.budget?.expense || rawSection === companyData.forecast?.expense) {
            if (key === "Funktionaerloen (inkl. ATP m.m.)" || key === "El, vand og varme" || key === "Lokaleleje" || key === "Reperation og vedligeholdelse af lokaler") {
                characteristics = "Fast";
            } else {
                characteristics = "Variabel";
            }
        } else if (rawSection === companyData.budget?.revenue || rawSection === companyData.forecast?.revenue) {
            characteristics = "Revenue";
        } else if (rawSection[key].characteristics) {
             characteristics = rawSection[key].characteristics;
        }

        const transformedItem = TransformAndFilterItemForYear({
            name: key,
            characteristics: characteristics,
            data: rawSection[key].data
        }, selectedYear);

        if (transformedItem.data.length > 0) {
            yearlyData[key] = transformedItem;
        }
    }
    return yearlyData;
}

/**
 * Clears table data while preserving headers.
 * @param {HTMLTableElement} table - The table to clear.
 */
function clearTableData(table) {
    const tbody = table.querySelector('tbody');
    if (tbody) {
        while (tbody.rows.length > 0) {
            tbody.deleteRow(0);
        }
    } else {
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
    let thead = table.querySelector('thead');
    if (!thead) {
        thead = table.createTHead();
    }
    let headerRow = thead.insertRow();

    const nameTh = document.createElement('th');
    nameTh.textContent = table.classList.contains('budget-revenue-table') || table.classList.contains('forecast-revenue-table') ? 'Indtægt' : 'Omkostning';
    headerRow.appendChild(nameTh);

    headers.forEach(function (h) {
        var th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
    });
}

/**
 * Adds a data row to a table.
 * @param {HTMLTableElement} table - The table to add to.
 * @param {string} undercategory - The category name for the row.
 * @param {Array} data - The monthly data values including total (as strings).
 * @param {boolean} editable - Whether the cells should be editable.
 */
function addRow(table, undercategory, data, editable = false) {
    var newRow = table.insertRow();

    var undercategoryCell = newRow.insertCell();
    undercategoryCell.textContent = undercategory;

    data.forEach(function (d, index) {
        var cell = newRow.insertCell();
        const value = Number(d.trim());

        if (editable && index < data.length - 1) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = value;
            input.dataset.month = months[index];
            input.dataset.category = undercategory;
            cell.innerHTML = '';
            cell.appendChild(input);
        } else {
            cell.textContent = value.toLocaleString('da-DK') + ' kr';
        }
    });
}

/**
 * Populates a set of tables (revenue, variable expense, fixed expense) for a specific financial section (budget or forecast).
 * @param {object} sectionData - Object containing 'revenue' and 'expense' sub-objects for a specific year and type.
 * @param {string} Year - The year for which data is being displayed (now always 2025).
 * @param {HTMLTableElement} revenueTable - HTML table for revenue.
 * @param {HTMLTableElement} variabelExpenseTable - HTML table for variable expenses.
 * @param {HTMLTableElement} fastExpenseTable - HTML table for fixed expenses.
 * @param {boolean} editable - Whether the cells should contain input fields for editing.
 */
function populateTableSection(sectionData, Year, revenueTable, variabelExpenseTable, fastExpenseTable, editable = false) {
    const DELIMITER = ";";
    const headers = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun",
                    "Jul", "Aug", "Sep", "Okt", "Nov", "Dec", "Total"];

    if (!revenueTable || !variabelExpenseTable || !fastExpenseTable) {
        console.error("populateTableSection: One or more tables are missing! Check your HTML selectors.");
        return;
    }

    clearTableData(revenueTable);
    clearTableData(variabelExpenseTable);
    clearTableData(fastExpenseTable);

    if (!revenueTable.querySelector('thead tr')) addHeaders(revenueTable, headers);
    if (!variabelExpenseTable.querySelector('thead tr')) addHeaders(variabelExpenseTable, headers);
    if (!fastExpenseTable.querySelector('thead tr')) addHeaders(fastExpenseTable, headers);

    // --- Revenue ---
    Object.keys(sectionData.revenue).forEach(key => {
        const revenueItem = sectionData.revenue[key];
        const yearData = revenueItem.data[0];

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
            addRow(revenueTable, revenueItem.name, data, editable);
        } else {
            console.warn(`Revenue Item ${revenueItem.name} has no data for year ${Year} in this section.`);
        }
    });

    // --- Expenses (Variabel & Fast) ---
    Object.keys(sectionData.expense).forEach(key => {
        const expenseItem = sectionData.expense[key];
        const yearData = expenseItem.data[0];

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
                addRow(variabelExpenseTable, expenseItem.name, data, editable);
            } else if (expenseItem.characteristics === "Fast") {
                addRow(fastExpenseTable, expenseItem.name, data, editable);
            } else {
                console.warn(`Expense Item ${expenseItem.name} has unhandled characteristic: ${expenseItem.characteristics}`);
            }
        } else {
            console.warn(`Expense Item ${expenseItem.name} has no data for year ${Year} in this section.`);
        }
    });
}


// ----------------------------
// TABLE CONTROL FUNCTIONS
// ----------------------------

/**
 * Adds a new row to a specific table.
 * @param {HTMLTableElement} table - The table to add the row to.
 */
function addRowToTable(table) {
    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error("addRowToTable: tbody not found for table", table?.className || table?.id);
        return;
    }

    const newCategoryName = prompt("Enter new category name:");
    if (!newCategoryName) {
        return;
    }

    const newRowData = Array(months.length).fill(0);
    const total = newRowData.reduce((sum, val) => sum + val, 0);
    const dataWithTotal = newRowData.map(String);
    dataWithTotal.push(String(total));

    const isEditable = table.classList.contains('budget-revenue-table') ||
                       table.classList.contains('budget-fixed-expense-table') ||
                       table.classList.contains('budget-variable-expense-table');

    addRow(table, newCategoryName, dataWithTotal, isEditable);
}

/**
 * Deletes the last row from a specific table.
 * @param {HTMLTableElement} table - The table to delete the row from.
 */
function deleteLastRowFromTable(table) {
    const tbody = table.querySelector('tbody');
    if (tbody && tbody.rows.length > 0) {
        if (confirm('Are you sure you want to delete the last category?')) {
            tbody.deleteRow(tbody.rows.length - 1);
        }
    } else {
        console.warn("deleteLastRowFromTable: No rows to delete or tbody not found.");
    }
}

/**
 * Sets up event listeners for table control buttons (add/delete category).
 */
function setupTableControls() {
    document.querySelectorAll('.btnInsertCategory').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
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
            e.preventDefault();
            const table = e.target.closest('div').querySelector('table');
            if (table) {
                deleteLastRowFromTable(table);
            } else {
                console.error("setupTableControls: Could not find table for 'Delete last category' button.");
            }
        });
    });
}

// ----------------------------
// DASHBOARD INITIALIZATION
// ----------------------------

/**
 * Initializes the tables by populating them with data.
 */
function initializeTables() {
    if (!companyData){
        console.log("initializeTables: companyData is null, returning.");
        return;
    }

    try {
        // Select budget tables (now using unique class names for budget section)
        const budgetRevenueTable = document.querySelector('.budget-revenue-table');
        const budgetFixedExpenseTable = document.querySelector('.budget-fixed-expense-table');
        const budgetVariableExpenseTable = document.querySelector('.budget-variable-expense-table');

        // Select forecast tables (now using unique class names for forecast section)
        const forecastRevenueTable = document.querySelector('.forecast-revenue-table');
        const forecastFixedExpenseTable = document.querySelector('.forecast-fixed-expense-table');
        const forecastVariableExpenseTable = document.querySelector('.forecast-variable-expense-table');

        // Prepare and populate Budget tables (always 2025, editable)
        const budgetRevenueData = getYearlySectionData(companyData.budget?.revenue, staticYear);
        const budgetExpenseData = getYearlySectionData(companyData.budget?.expense, staticYear);
        populateTableSection(
            { revenue: budgetRevenueData, expense: budgetExpenseData },
            staticYear,
            budgetRevenueTable,
            budgetVariableExpenseTable,
            budgetFixedExpenseTable,
            true // Editable
        );

        // Prepare and populate Forecast tables (always 2025, not editable)
        const forecastRevenueData = getYearlySectionData(companyData.forecast?.revenue, staticYear);
        const forecastExpenseData = getYearlySectionData(companyData.forecast?.expense, staticYear);
        populateTableSection(
            { revenue: forecastRevenueData, expense: forecastExpenseData },
            staticYear,
            forecastRevenueTable,
            forecastVariableExpenseTable,
            forecastFixedExpenseTable,
            false // Not editable
        );

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
        const loader = document.getElementById('loadingIndicator');
        if (loader) loader.style.display = 'block';

        const profileResponse = await fetch('/api/user/profile', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
        });
        if (!profileResponse.ok) throw new Error('Failed to load profile');
        const profile = await profileResponse.json();
        userId = String(profile.id);
        console.log("Dashboard: User profile loaded.");

        const dataResponse = await fetch('/api/user/data/', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }

        });
        if (!dataResponse.ok) throw new Error(`API Error: ${dataResponse.status}`);
        const apiResponse = await dataResponse.json();

        if (apiResponse && apiResponse.dataById && userId && apiResponse.dataById[userId]) {
            companyData = apiResponse.dataById[userId];
        } else if (apiResponse && (apiResponse.result || apiResponse.budget || apiResponse.forecast)) {
            companyData = apiResponse;
            console.warn("Dashboard: 'dataById' missing or userId not found. Assuming raw response is company data.");
        } else {
            console.error("Dashboard: Unexpected API response structure. No financial data found.", apiResponse);
            throw new Error("Unexpected API response structure. No financial data found.");
        }


        // Initialize charts
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
                    label: 'Actual Revenue', // This label still refers to 'result' data
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
                    label: 'Actual Expense', // This label still refers to 'result' data
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
    }
}

// Start the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    initializeDashboard();
});