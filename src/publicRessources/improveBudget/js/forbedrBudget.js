// improveBudget/script.js

// Create the functionality for the html document to help improve the budget
// On the left hand side there should be two graphs: 1. displaying the differences between - budget, forecast and results
// 2. Displaying the historical data with forcast for greater overview
// On the right hand side there should be a tabel displaying the top 5 highest differences between budget and forecast
// Under the tabel a textbox with valuable information to the user
// On the bottom of the page there should be two dropdown bars each containing their own tabel: budget and forecast.
// The tables should be editable and when the user presses save the database hould be updated and the new forecast should be dispplayed

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

// Data Model Classes (from user's provided snippet)
class FinancialMetric {
    constructor(name) {
        this.name = name;
        this.data = []; // Initialize as empty array
    }
}

class FinancialYear {
    constructor (year) {
        this.year = year;
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
        };
    }
}

// Global variables
let companyData = null;
let userId = null;
const chartInstances = {};
const staticYear = "2025"; // All tables will now display data for 2025

// ----------------------------
// HELPER FUNCTIONS (General logs removed, core logic remains)
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
    if (!categoryData?.data) {
        return 0;
    }
    const total = categoryData.data.reduce((sum, yearData) => {
        const monthlySum = yearData.months ? sumMonthlyValues(yearData.months) : 0;
        return sum + monthlySum;
    }, 0);
    return total;
}

function getTop5Differences(budgetData, forecastData) {
    if (!budgetData || !forecastData) {
        return [];
    }

    const budgetCategories = new Set(Object.keys(budgetData));
    const forecastCategories = new Set(Object.keys(forecastData));

    const commonCategories = Array.from(budgetCategories).filter(category => 
        forecastCategories.has(category)
    );

    //const allCategories = new Set([...Object.keys(budgetData), ...Object.keys(forecastData)]);
// Array.from(allCategories).map(category
    const differences = commonCategories.map(category => {
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

    return differences;
}

// ----------------------------
// CHART FUNCTIONS (General logs removed)
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
// TABLE UTILITY FUNCTIONS (General logs removed, specific logs for new object creation)
// ----------------------------

/**
 * Transforms the months from the data.json to match display format.
 * Ensures the output object has months in Jan-Dec order.
 */
function TransformMonthsforDisplay(apiMonths) {
    if (!apiMonths) {
        return {};
    }

    const transformedMonths = {};
    for (const apiKey in apiMonths) {
        const displayKey = monthMapping[apiKey.toLowerCase()];
        if (displayKey) {
            transformedMonths[displayKey] = apiMonths[apiKey];
        } else {
            const foundMonthKey = months.find(m => m.toLowerCase() === apiKey.toLowerCase());
            if (foundMonthKey) {
                transformedMonths[foundMonthKey] = apiMonths[apiKey];
            } else {
                transformedMonths[apiKey] = apiMonths[apiKey];
            }
        }
    }

    const orderedMonths = {};
    months.forEach(mKey => {
        orderedMonths[mKey] = transformedMonths[mKey] !== undefined ? transformedMonths[mKey] : 0;
    });
    return orderedMonths;
}


/**
 * Takes a single financial item, filters its data for the selected year, and transforms the months.
 */
function TransformAndFilterItemForYear(rawItem, selectedYear) {
    if (!rawItem || !Array.isArray(rawItem.data) || rawItem.data.length === 0) {
        return {
            name: rawItem ? rawItem.name : "Ukendt",
            characteristics: rawItem ? rawItem.characteristics : "Undefined",
            data: []
        }
    }

    let yearSpecificEntry = rawItem.data.find(entry => String(entry.year) === String(selectedYear));

    if (!yearSpecificEntry && selectedYear === staticYear) {
        const potentialEntryWithoutYear = rawItem.data.find(entry => entry.year === undefined || entry.year === null || String(entry.year).trim() === '');
        if (potentialEntryWithoutYear) {
            yearSpecificEntry = potentialEntryWithoutYear;
            yearSpecificEntry.year = selectedYear;
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
        return {
            name: rawItem.name,
            characteristics: rawItem.characteristics,
            data: []
        }
    }
}

/**
 * Clears table data while preserving headers.
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


// ----------------------------
// TABLE CONTROL FUNCTIONS (Focused logs for new object creation/updates)
// ----------------------------

/**
 * Reads data from an HTML table and returns it as an array of FinancialMetric objects.
 * This function is designed to read from editable tables with input fields.
 * @param {HTMLTableElement} tableElement - The actual HTML table DOM element.
 * @param {string} year - The year for which data is being read.
 * @returns {Array<FinancialMetric>} An array of FinancialMetric objects.
 */
function getTableData(tableElement, year) {
    const underCategories = [];
    if (!tableElement) {
        console.error("getTableData: Table element is null or undefined.");
        return underCategories;
    }

    const rows = tableElement.querySelectorAll('tbody tr');
    console.log(`getTableData: Processing table '${tableElement?.className || tableElement?.id}'. Found ${rows.length} rows.`);

    rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 14) { // Ensure enough cells (category name + 12 months + 1 total)
            const categoryName = cells[0].textContent.trim();
            const newMetric = new FinancialMetric(categoryName);
            const newYearData = new FinancialYear(year);
            console.log(`  getTableData: Creating new FinancialMetric for '${categoryName}'.`);
            console.log(`  getTableData: Creating new FinancialYear for year '${year}' for '${categoryName}'.`);


            months.forEach((monthKey, index) => {
                const inputElement = cells[index + 1].querySelector('input');
                let value;
                if (inputElement) {
                    value = Number(inputElement.value) || 0;
                } else {
                    const textValue = cells[index + 1].textContent.replace(' kr', '').trim();
                    value = parseFloat(textValue.replace(/\./g, '').replace(',', '.')) || 0;
                }
                newYearData.months[monthKey.toLowerCase()] = value;
            });
            newMetric.data.push(newYearData);
            underCategories.push(newMetric);
            console.log(`  getTableData: Populated months for '${categoryName}':`, newYearData.months);
            console.log(`  getTableData: Final newMetric object for '${categoryName}':`, newMetric);

        } else {
            console.warn(`  getTableData: Skipping row ${rowIndex} in table '${tableElement?.className || tableElement?.id}' due to insufficient cells (${cells.length}).`);
        }
    });
    console.log(`getTableData: Finished processing table '${tableElement?.className || tableElement?.id}'. Total categories extracted: ${underCategories.length}.`);
    return underCategories;
}


/**
 * Updates a specific section (revenue or expense) of the companyData object
 * with new data read from the tables.
 */
function updateCompanySectionData(targetSection, newCategoryDataArray, selectedYear, defaultCharacteristic) {
    console.log(`updateCompanySectionData: Starting update for section. Target: ${targetSection === companyData.budget?.revenue ? 'Budget Revenue' : targetSection === companyData.budget?.expense ? 'Budget Expense' : targetSection === companyData.forecast?.revenue ? 'Forecast Revenue' : targetSection === companyData.forecast?.expense ? 'Forecast Expense' : 'Unknown'}, Year: ${selectedYear}. New categories to process: ${newCategoryDataArray.length}`);
    
    const existingMetricMap = new Map(Object.entries(targetSection));
    
    newCategoryDataArray.forEach(newMetric => {
        const existingMetric = existingMetricMap.get(newMetric.name);

        if (existingMetric) {
            let yearDataFound = false;
            for (let i = 0; i < existingMetric.data.length; i++) {
                if (String(existingMetric.data[i].year) === String(selectedYear)) {
                    existingMetric.data[i].months = newMetric.data[0].months;
                    yearDataFound = true;
                    console.log(`  updateCompanySectionData: Updated existing year data for '${newMetric.name}' for year ${selectedYear}.`);
                    break;
                }
            }
            if (!yearDataFound) {
                existingMetric.data.push(newMetric.data[0]);
                existingMetric.data.sort((a, b) => Number(a.year) - Number(b.year));
                console.log(`  updateCompanySectionData: Added new year data for '${newMetric.name}' for year ${selectedYear} to existing metric.`);
            }
            if (!existingMetric.characteristics || existingMetric.characteristics === "Undefined") {
                 existingMetric.characteristics = newMetric.characteristics || defaultCharacteristic;
            }
            existingMetricMap.delete(newMetric.name);
        } else {
            newMetric.characteristics = newMetric.characteristics || defaultCharacteristic;
            targetSection[newMetric.name] = newMetric;
            console.log(`  updateCompanySectionData: ADDED NEW OBJECT: '${newMetric.name}' to target section. Full object:`, newMetric);
        }
    });

    existingMetricMap.forEach((value, key) => {
        console.log(`  updateCompanySectionData: Removing metric '${key}' (deleted from table).`);
        delete targetSection[key];
    });

    console.log("updateCompanySectionData: Section update complete. Current targetSection state:", targetSection);
}


/**
 * Handles the saving of budget changes from the editable tables.
 * Now also handles saving forecast data.
 */
/*
async function saveBudgetChanges() {
    console.log("saveBudgetChanges: Attempting to save budget and forecast changes...");
    const saveButton = document.getElementById('saveBudgetBtn');
    const informationText = document.getElementById('informationText');

    if (saveButton) saveButton.disabled = true;
    if (informationText) informationText.innerHTML = '<div class="info-message">Saving changes...</div>';

    try {
        const budgetRevenueTable = document.querySelector('.budget-revenue-table');
        const budgetFixedExpenseTable = document.querySelector('.budget-fixed-expense-table');
        const budgetVariableExpenseTable = document.querySelector('.budget-variable-expense-table');

        console.log("saveBudgetChanges: Reading data from budget tables for saving...");
        const newBudgetRevenueData = getTableData(budgetRevenueTable, staticYear);
        const newBudgetFixedExpenseData = getTableData(budgetFixedExpenseTable, staticYear);
        const newBudgetVariableExpenseData = getTableData(budgetVariableExpenseTable, staticYear);

        console.log("ABE ABE ABE ABE", newBudgetRevenueData)

        const forecastRevenueTable = document.querySelector('.forecast-revenue-table');
        const forecastFixedExpenseTable = document.querySelector('.forecast-fixed-expense-table');
        const forecastVariableExpenseTable = document.querySelector('.forecast-variable-expense-table');

        console.log("saveBudgetChanges: Reading data from forecast tables for saving...");
        const newForecastRevenueData = getTableData(forecastRevenueTable, staticYear);
        const newForecastFixedExpenseData = getTableData(forecastFixedExpenseTable, staticYear);
        const newForecastVariableExpenseData = getTableData(forecastVariableExpenseTable, staticYear);


        if (!companyData.budget) companyData.budget = {};
        if (!companyData.budget.revenue) companyData.budget.revenue = {};
        if (!companyData.budget.expense) companyData.budget.expense = {};

        console.log("saveBudgetChanges: Updating companyData.budget object locally with new data...");
        updateCompanySectionData(companyData.budget.revenue, newBudgetRevenueData, staticYear, "Revenue");
        updateCompanySectionData(companyData.budget.expense, newBudgetFixedExpenseData, staticYear, "Fast");
        updateCompanySectionData(companyData.budget.expense, newBudgetVariableExpenseData, staticYear, "Variabel");
        console.log("saveBudgetChanges: companyData.budget updated locally. Current state:", companyData.budget);

        if (!companyData.forecast) companyData.forecast = {};
        if (!companyData.forecast.revenue) companyData.forecast.revenue = {};
        if (!companyData.forecast.expense) companyData.forecast.expense = {};

        console.log("saveBudgetChanges: Updating companyData.forecast object locally with new data...");
        updateCompanySectionData(companyData.forecast.revenue, newForecastRevenueData, staticYear, "Revenue");
        updateCompanySectionData(companyData.forecast.expense, newForecastFixedExpenseData, staticYear, "Fast");
        updateCompanySectionData(companyData.forecast.expense, newForecastVariableExpenseData, staticYear, "Variabel");
        console.log("saveBudgetChanges: companyData.forecast updated locally. Current state:", companyData.forecast);


        const apiUrl = '/api/saveData/'; // Endpoint as specified by user
        const payload = { userId: userId, data: companyData };
        console.log(`saveBudgetChanges: Sending payload to API: ${apiUrl}. Payload content:`, payload);
        console.log("saveBudgetChanges: Stringified payload size (bytes):", new TextEncoder().encode(JSON.stringify(payload)).length);
        console.log("Final companyData structure to be sent:", JSON.stringify(companyData, null, 2));
        console.log("Type of companyData.budget:", typeof companyData.budget);
        console.log("Type of companyData.forecast:", typeof companyData.forecast);
        console.log("Keys in companyData.budget:", Object.keys(companyData.budget));
        console.log("Keys in companyData.forecast:", Object.keys(companyData.forecast));
        const saveResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log(`saveBudgetChanges: API response status: ${saveResponse.status}, statusText: ${saveResponse.statusText}`);
        if (!saveResponse.ok) {
            const errorText = await saveResponse.text();
            console.error("saveBudgetChanges: API response not OK. Raw response text:", errorText);
            throw new Error(`Failed to save data: ${errorText || saveResponse.statusText}`);
        }

        console.log("saveBudgetChanges: API call successful. Re-initializing dashboard to reflect saved changes...");
        await initializeDashboard();

        if (informationText) informationText.innerHTML = '<div class="success-message">Changes saved successfully!</div>';
        console.log("Budget and forecast changes saved and dashboard re-initialized.");

    } catch (error) {
        console.error("Error saving budget/forecast changes:", error);
        if (informationText) {
            informationText.innerHTML = `<div class="error-message">Error saving changes: ${error.message}</p></div>`;
        }
    } finally {
        if (saveButton) saveButton.disabled = false;
        setTimeout(() => {
            if (informationText) informationText.innerHTML = '';
        }, 5000);
    }
}
*/

/**
 * Adds a new row to a specific table.
 */
function addRowToTable(table) {
    console.log(`addRowToTable: Attempting to add row to table: ${table?.className || table?.id}`);
    const tbody = table.querySelector('tbody');
    if (!tbody) {
        console.error("addRowToTable: tbody not found for table", table?.className || table?.id);
        return;
    }

    const newCategoryName = prompt("Enter new category name:");
    if (!newCategoryName) {
        console.log("addRowToTable: User cancelled adding new category.");
        return;
    }
    console.log(`addRowToTable: New category name entered: ${newCategoryName}`);

    // const initialMonthlyData = {};
    // months.forEach(monthKey => {
    //     initialMonthlyData[monthKey] = 0;
    // });
    const initialMonthlyData = Array(12).fill("0");

    const isEditable = table.classList.contains('budget-revenue-table') ||
                       table.classList.contains('budget-fixed-expense-table') ||
                       table.classList.contains('budget-variable-expense-table') ||
                       table.classList.contains('forecast-revenue-table') ||
                       table.classList.contains('forecast-fixed-expense-table') ||
                       table.classList.contains('forecast-variable-expense-table');

    addRow(table, newCategoryName, initialMonthlyData, isEditable);
    console.log(`addRowToTable: New row added for category: ${newCategoryName}.`);
}

/**
 * Deletes the last row from a specific table.
 */
function deleteLastRowFromTable(table) {
    console.log(`deleteLastRowFromTable: Attempting to delete last row from table: ${table?.className || table?.id}`);
    const tbody = table.querySelector('thead');
    console.log(table)
    if (tbody && tbody.rows.length > 0) {
        const userConfirmed = window.confirm('Are you sure you want to delete the last category?');
        if (userConfirmed) {
            tbody.deleteRow(tbody.rows.length - 1);
            console.log(`deleteLastRowFromTable: Last row deleted from table: ${table?.className || table?.id}.`);
        } else {
            console.log("deleteLastRowFromTable: User cancelled deletion.");
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
// DASHBOARD INITIALIZATION (General logs removed)
// ----------------------------

/**
 * Main function to initialize the dashboard, fetching data and setting up UI.
 */
async function initializeDashboard(budgetRevenueTable, budgetFixedExpenseTable, budgetVariableExpenseTable, forecastRevenueTable, forecastFixedExpenseTable, forecastVariableExpenseTable) {
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
        } else {
            console.error("Dashboard: Unexpected API response structure. No financial data found.", apiResponse);
            throw new Error("Unexpected API response structure. No financial data found.");
        }
        console.log("Dashboard: companyData after API response processing (check this for initial data):", companyData);


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


        //initializeTables();
        if (companyData) {
                UpdateDisplayedYear(budgetRevenueTable, budgetFixedExpenseTable, budgetVariableExpenseTable, forecastRevenueTable, forecastFixedExpenseTable, forecastVariableExpenseTable)
        }

        setupTableControls();

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

function UpdateDisplayedYear(budgetRevenueTable, budgetFixedExpenseTable, budgetVariableExpenseTable, forecastRevenueTable, forecastFixedExpenseTable, forecastVariableExpenseTable) {
    const selectedYear = "2025"

    const dataForCurrentYear = PrepareDataForTable(companyData, selectedYear) // Prepare the data for the selected year
    if (!dataForCurrentYear) { // Check if data is prepared successfully
        console.error("Failed to prepare data for display for year:", selectedYear)
        return
    }
        // Call the functions from generateTables to populate the result tables
        if (forecastRevenueTable && forecastFixedExpenseTable && forecastVariableExpenseTable) {
        ToTableForecast(dataForCurrentYear, selectedYear, forecastRevenueTable, forecastFixedExpenseTable, forecastVariableExpenseTable)
        } else {
            console.error("No results tables found!");
        }

        // Call the functions from generateTables to populate the budget tables
        if (budgetRevenueTable && budgetFixedExpenseTable && budgetVariableExpenseTable) {
            toTableBudget(dataForCurrentYear, selectedYear, budgetRevenueTable, budgetVariableExpenseTable, budgetFixedExpenseTable, "forbedr")
        } else {
            console.error("No budget tables found!");
        }
}

function PrepareDataForTable(rawData, selectedYear) {
    if (!rawData) {
        console.error("No data provided");
        return null;
    }
    const dataForTable = {
        forecast: { revenue: {}, expense: {} },
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
    processCategoryForTable(rawData.forecast.revenue, dataForTable.forecast.revenue)
    processCategoryForTable(rawData.forecast.expense, dataForTable.forecast.expense)
    processCategoryForTable(rawData.budget.revenue, dataForTable.budget.revenue)
    processCategoryForTable(rawData.budget.expense, dataForTable.budget.expense)

    return dataForTable
}

function addRow1(table, undercategory, data) {
    var newRow = table.insertRow(); // Create new row

    // Add year column
    var undercategoryCell = newRow.insertCell();
    undercategoryCell.textContent = undercategory;

    // Add monthly data columns
    data.forEach(function (d) {
        var cell = newRow.insertCell();
        cell.textContent = d.trim();
        cell.setAttribute('contenteditable', 'true'); // Make cells editable
    });

    const Total = calculateCategoryDataTotal(data);

    var totalCell = newRow.insertCell();
    totalCell.textContent = Total.toLocaleString('da-DK') + ' kr';
}

function calculateCategoryDataTotal (data) {

    let sum = 0

    data.forEach (index => {
        sum = sum + Number(index);
    })

    return sum;
}


document.addEventListener('DOMContentLoaded', () => {
    const budgetRevenueTable = document.querySelector('.budget-revenue-table');
    const budgetFixedExpenseTable = document.querySelector('.budget-fixed-expense-table');
    const budgetVariableExpenseTable = document.querySelector('.budget-variable-expense-table');

    const forecastRevenueTable = document.querySelector('.forecast-revenue-table');
    const forecastFixedExpenseTable = document.querySelector('.forecast-fixed-expense-table');
    const forecastVariableExpenseTable = document.querySelector('.forecast-variable-expense-table');

    const saveButton = document.getElementById('saveBudgetBtn');
    

    initializeDashboard(budgetRevenueTable, budgetFixedExpenseTable, budgetVariableExpenseTable, forecastRevenueTable, forecastFixedExpenseTable, forecastVariableExpenseTable);

    if (saveButton) {
        saveButton.addEventListener("click", () => {
            console.log("Save button clicked")
            console.log("Table content at time of button click:", document.querySelector(".budget-revenue-table").innerHTML);

            if (!userId) {
                console.error("User ID is not set. Cannot save data.")
                alert("Bruger ID er ikke sat. Venligst log ind igen.")
                return
            }
            setTimeout(() => {
            
            let yearSelect = "2025"
            updateCompanyDataFromTables(companyData, yearSelect, budgetRevenueTable, budgetVariableExpenseTable, budgetFixedExpenseTable, "budget") // Extract data from the tables
            dataToSave = companyData
            
            if (!dataToSave) {
                console.error("Failed to extract data from tables")
                alert("Kunne ikke udtrække data fra tabellerne")
                return
            }
            console.log("Saving company data:", userId, dataToSave)

            const payload = {
                userId: userId,
                data: dataToSave
            }

            console.log(payload)
            console.log(JSON.stringify(payload))
            
            fetch('/api/saveData', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload) // Send the company data as JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                return response.json()
            })    
            .then(saveResponse => {
                console.log("Server response from save:", saveResponse);
                alert("Data gemt!");
            })
            .catch(error => {
                console.error("Error saving data:", error);
                alert(`Fejl ved gemning af data.${error.message}`);
            });
            
        })
    }, 100);
    }



});