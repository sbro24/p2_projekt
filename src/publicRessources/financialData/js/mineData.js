const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthMapping = {"january": "Jan", "february": "Feb", "march": "Mar", "april": "Apr", "may": "May", "june": "Jun",
                      "july": "Jul", "august": "Aug", "september": "Sep", "october": "Oct", "november": "Nov", "december": "Dec"};
const monthMappingForStorage = {"Jan": "January", "Feb": "February", "Mar": "March", "Apr": "April", "May": "May", "Jun": "June",
                                "Jul": "July", "Aug": "August", "Sep": "September", "Oct": "October", "Nov": "November", "Dec": "December"};                      
let companyData = null;
let userId = null;

/**
 * Transforms the months from the data.json to match generateTables.js
 * @param {apiMonths, the months object from data.json}
 * @returns {orderedMonths, the transformed months object}
 */
function TransformMonthsforDisplay(apiMonths) {
    // If apiMonths doesn't exist, return an empty object
    if (!apiMonths) {
        return {}
    }
    const transformedMonths = {};
    // Begin by mapping API keys to display keys
    for (const apiKey in apiMonths) {
        const displayKey = monthMapping[apiKey.toLowerCase()]; // Convert API key to lowercase and map it to the display key
        if (displayKey) {
            transformedMonths[displayKey] = apiMonths[apiKey]; // Map the API key to the display key
        } else {
            transformedMonths[apiKey] = apiMonths[apiKey]; // Keep the original key if no mapping exists
        }
    }
    // Ensure all months are present, and in order
    const orderedMonths = {}
    months.forEach(mKey => {
        // Check if the month exists in the transformed months, if not, default to 0
        orderedMonths[mKey] = transformedMonths[mKey] !== undefined ? transformedMonths[mKey] : 0
    })
    return orderedMonths;
} 

/**
 * Takes a single financial item and filters its data for the selected year, and transforms the months
 * @param {rawItem, the financial item from data.json} 
 * @param {yearToFilter, the selected year from the dropdown menu} 
 * @returns {New item object, containing only the transformed financial item for the selected year}
 */
function TransformAndFilterItemForYear(rawItem, selectedYear) {
    if (!rawItem || !Array.isArray(rawItem.data)) { // Check if rawItem exists and is an array
        // Return an empty object, that generateTables.js can handle
        return {
            name: rawItem ? rawItem.name : "Ukendt",
            characteristics: rawItem ? rawItem.characteristics : "Undefined",
            data: []
        }
    }

    const yearSpecificEntry = rawItem.data.find(entry => String(entry.year) === String(selectedYear)) // Find the entry for the selected year
    if (yearSpecificEntry) {
        return { // Return the transformed item for the selected year
            name: rawItem.name,
            characteristics: rawItem.characteristics,
            data: [{
                year: yearSpecificEntry.year,
                months: TransformMonthsforDisplay(yearSpecificEntry.months) // Transform the months for display
            }]
        }
    } else {
        return { // If no entry for the selected year, return an empty object
            name: rawItem.name,
            characteristics: rawItem.characteristics,
            data: []
        }
    }

}

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

/** 
 * Updates the displayed year based on the selected year from the dropdown menu
 * Calls functions from generateTables.js to populate the tables
 */
function UpdateDisplayedYear() {
    const yearSelect = document.getElementById("yearSelect")
    const selectedYear = yearSelect.value

    const dataForCurrentYear = PrepareDataForTable(companyData, selectedYear) // Prepare the data for the selected year
    if (!dataForCurrentYear) { // Check if data is prepared successfully
        console.error("Failed to prepare data for display for year:", selectedYear)
        return
    }

    // remove active class from all year data divs
    document.querySelectorAll(".year-data-content").forEach(div => {
        div.classList.remove('active')
    });
    // add active class to the selected year
    const activeYearDiv = document.getElementById(`data-${selectedYear}`)
    if (activeYearDiv) {
        activeYearDiv.classList.add('active');

        // Query the tables inside the active year div, using class names
        const resultsRevenueTable = activeYearDiv.querySelector('.results-revenue-table')
        const resultsFixedExpenseTable = activeYearDiv.querySelector('.results-fixed-expense-table')
        const resultsVariableExpenseTable = activeYearDiv.querySelector('.results-variable-expense-table')
        // Call the functions from generateTables to populate the result tables
        if (resultsRevenueTable && resultsFixedExpenseTable && resultsVariableExpenseTable) {
            toTableRevenue(dataForCurrentYear, selectedYear, resultsRevenueTable, resultsVariableExpenseTable, resultsFixedExpenseTable)
        } else {
            console.error("No results tables found!");
        }

        const budgetRevenueTable = activeYearDiv.querySelector('.budget-revenue-table')
        const budgetFixedExpenseTable = activeYearDiv.querySelector('.budget-fixed-expense-table')
        const budgetVariableExpenseTable = activeYearDiv.querySelector('.budget-variable-expense-table') 
        // Call the functions from generateTables to populate the budget tables
        if (budgetRevenueTable && budgetFixedExpenseTable && budgetVariableExpenseTable) {
            toTableBudget(dataForCurrentYear, selectedYear, budgetRevenueTable, budgetVariableExpenseTable, budgetFixedExpenseTable)
        } else {
            console.error("No budget tables found!");
        }
    } else {
        console.error("content div not found for year:", selectedYear);
    }
}

/**
 * Generates the HTML structure for each year data, and appends it to the dynamicContentContainer div
 */
function BuildHTMLStructure() {
    const years = ["2025", "2024", "2023", "2022", "2021", "2020"]
    const container = document.getElementById("dynamicContentContainer")

    const templateHTMLStructure = `<section class="results-section">
            <h2 class="section-header">Mine resultater YEAR</h2> 
            <div>
                <h3>Omsætning</h3>      
                <form>
                    <table border="1" class="results-revenue-table"> 
                        <tbody>
                            <tr>
                                <th>Indtægt</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny indtægt</button>
                <button class="btnDeleteCategory">Slet sidste indtægt</button>
            </div>        
            <div>    
                <h3>Faste Omkostninger</h3>             
                <form>
                    <table border="1" class="results-fixed-expense-table"> 
                        <tbody>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
                <button class="btnDeleteCategory">Slet sidste omkostning</button>
            </div>
            <div>
                <h3>Variable Omkostninger</h3>             
                <form>
                    <table border="1" class="results-variable-expense-table"> 
                        <tbody>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
                <button class="btnDeleteCategory">Slet sidste omkostning</button>
            </div>
        </section>
            
        <section class="budget-section">
            <h2 class="section-header">Min budget YEAR</h2>    
            <div>
                <h3>Omsætning</h3>      
                <form>
                    <table border="1" class="budget-revenue-table"> 
                        <tbody>
                            <tr>
                                <th>Indtægt</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny indtægt</button>
                <button class="btnDeleteCategory">Slet sidste indtægt</button>
            </div>        
            <div>    
                <h3>Faste Omkostninger</h3>             
                <form>
                    <table border="1" class="budget-fixed-expense-table"> 
                        <tbody>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
                <button class="btnDeleteCategory">Slet sidste omkostning</button>
            </div>
            <div>
                <h3>Variable Omkostninger</h3>             
                <form>
                    <table border="1" class="budget-variable-expense-table"> 
                        <tbody>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
                <button class="btnDeleteCategory">Slet sidste omkostning</button>
            </div>
        </section>`

    // Checks if the div with the id "data-YEAR" already exists, if not, create it
    years.forEach(year => {
         if (!document.getElementById(`data-${year}`)) {
            const newYearDiv = document.createElement("div")
            newYearDiv.id = `data-${year}`
            newYearDiv.className = "year-data-content"
            newYearDiv.innerHTML = templateHTMLStructure.replace(/YEAR/g, year)
            container.appendChild(newYearDiv)
         }
    })
}
 
/**
 * Extracts data from a single HTML table
 * @param {tableElement - The HTML table to extract data from}  
 * @param {currentYear - the current year selected in the dropdown, for which data is being extracted}  
 * @param {characteristics - the characteristic of the item (Variabel or Fast)} 
 * @returns {items - An object where keys are category names and values are arrays of month data}
 */
function ExtractDataFromSingleTable(tableElement, currentYear, characteristics) {
    const items = {}
    const rows = tableElement.querySelectorAll("tbody tr") // Get all rows in the table body

    rows.forEach(row => {
        const cells =row.cells
        if (cells.length < 13) return // Expecting  name column + 12 months

        const categoryName = cells[0].textContent.trim() // Get the category name from the first cell
        if (!categoryName) return // Skip if no name is found

        const monthData = {}
        for (let i = 0; i < 12; i++) { // Loop through the next 12 cells for month data
            const monthName = months[i]
            const storageMonthName = monthMappingForStorage[monthName]
            let cellValue = 0
            const inputElement = cells[i + 1].querySelector('input[type="number"], input[type="text"]') // Get the input element in the cell

            if (inputElement) {
                cellValue = parseFloat(inputElement.value) // Get the value from the input element, and parse it to a number
            }
            monthData[storageMonthName] = cellValue // Store the month data in the object
        }
        items[categoryName] = { // Store the category name and month data in the items object
            name: categoryName,
            characteristics: characteristics,
            data: [{
                year: String[currentYear],
                months: monthData
            }]
        }    
    })
    return items
}

/**
 * Function to process a single table for extraction, and merge it into newUserData
 * @param {activeYearDiv - The container div for current year}
 * @param {newUserData - Object where the extracted data will be stored}  
 * @param {year - the current year selected in the dropdown} 
 * @param {tableName - CSS class name of the table to be processed} 
 * @param {section - results or budget section (or forecast)}
 * @param {type - The type of financial data (revenue, expense)}
 * @param {characteristics - the characteristic of the tiem (Variabel or Fast)} 
 */
function ProcessTableForExtraction(activeYearDiv, newUserData, year, tableName, section, type, characteristics) {
    const tableElement = activeYearDiv.querySelector(tableName)
    if (tableElement) {
        const items = ExtractDataFromSingleTable(tableElement, year, characteristics) // Extract data from the table
        if (type === "revenue") {
            newUserData[section].revenue = { ...newUserData[section].revenue, ...items } // Merge the extracted data into newUserData's revenue section
        } else if (type === "expense") {
            newUserData[section].expense = { ...newUserData[section].expense, ...items } // Merge the extracted data into newUserData's expense section
        }
    } else {
        console.warn(`Table with class ${tableName} not found in ${section} section for year ${year}`)
    }
}

/**
 * Extracts data from all tables currently visible for the selected year
 *  @param {year - the current year selected in the dropdown, for which data is being extracted}
 *  @returns {newUserData - An object where the extracted data will be stored}
*/
function ExtractDataFromAllTables(year) {
    const activeYearDiv = document.getElementById(`data-${year}`) // Get the div for the current year
    if (!activeYearDiv) {
        console.error("Cannot find active year div for year:", year)
        return null
    }

    const newUserData = {
        result: { revenue: {}, expense: {} },
        budget: { revenue: {}, expense: {} }
    }

    // Extract data from the result tables
    ProcessTableForExtraction(activeYearDiv, newUserData, year, ".results-revenue-table", "result", "revenue", "Variabel")
    ProcessTableForExtraction(activeYearDiv, newUserData, year, ".results-fixed-expense-table", "result", "expense", "Fast")
    ProcessTableForExtraction(activeYearDiv, newUserData, year, ".results-variable-expense-table", "result", "expense", "Variabel")
    // Extract data from the budget tables
    ProcessTableForExtraction(activeYearDiv, newUserData, year, ".budget-revenue-table", "budget", "revenue", "Variabel")
    ProcessTableForExtraction(activeYearDiv, newUserData, year, ".budget-fixed-expense-table", "budget", "expense", "Fast")
    ProcessTableForExtraction(activeYearDiv, newUserData, year, ".budget-variable-expense-table", "budget", "expense", "Variabel")

    return newUserData
}

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

let revenuetable = ".results-revenue-table";
let variabelexpensetable = ".results-variable-expense-table";
let fastexpensetable = ".results-fixed-expense-table";

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

    const table = document.querySelector(tableId);
    console.log(table)
    const rows = table.querySelectorAll('tbody tr'); 
    console.log(rows)
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

function ProcessFile(selectedFile, uploadType) {
    if (!selectedFile) {
        console.error("No CSV file selected")
        alert("Ingen CSV fil indlæst")
        return
    }
}

// Load the HTML structure when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    BuildHTMLStructure() // build the HTML structure for all the years year
    const yearSelect = document.getElementById("yearSelect")
    const fileInput = document.getElementById("uploadForm")
    const uploadResultsBtn = document.getElementById("uploadResultsBtn")
    const uploadBudgetBtn = document.getElementById("uploadBudgetBtn")
    const dynamicContentContainer = document.getElementById("dynamicContentContainer")
    const saveBtn = document.getElementById("saveButton")
    const exportButton = document.getElementById('exportButton');
    const popupMenu = document.getElementById('popupMenu');
    const exportResultButton = document.getElementById('exportResult');
    const exportBudgetButton = document.getElementById('exportBudget');

    fetch('/api/user/profile')
    .then(profile => {
        if (!profile.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return profile.json()
    })
    .then(apiProfile => {
        console.log("Fetched profile", apiProfile)
        fetch('/api/user/data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json() // Parses the JSON response, returns a promise
        })
        .then(apiResponse => {
            console.log("Fetched API response:", apiResponse)

            let userData = null
            // Check if the API response contains dataById and if it has any IDs 
            if (apiResponse) {
                userId = String(apiProfile.id) // Get the current user ID
                userData = apiResponse // Get the data for that user ID
                console.log("User id:", userId)
            } else if (apiResponse && !apiResponse.dataById) {
                    // Fallback: If dataById is missing, but other top-level keys (result, budget, forecast) exist, 
                    // assume the entire response is the data for a single user.
                    console.warn("API response does not have 'dataById'. Assuming response is the user's actual company data.");
                    userData = apiResponse;
            }

            if (userData) {
                companyData = userData // Assign the data to the global variable, used for the tables
                console.log("Company data:", companyData)
                // Call the function to populate the tables with the data
                if (yearSelect) {
                    yearSelect.addEventListener("change", UpdateDisplayedYear)
                    UpdateDisplayedYear()
                }
            }
        })
        .catch(error => { // Handle any errors that occur during the fetch
            console.error("Error fetching or processing company data:", error)
        })
    })
    
    let fileContent = null
    // Add event listener for the file input element 
    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
        event.preventDefault();

        const file = document.querySelector("input[type=file]").files[0];
        console.log(file.type);
   
        // Read the file
        const reader = new FileReader();
        reader.onload = () => {
            fileContent = reader.result;
            
        };
        reader.onerror = () => {
            showMessage("Error reading the file. Please try again.", "error");
        };
        reader.readAsText(file);
        });
    }

    // Add event listener for the upload results button
    if (uploadResultsBtn) {
        uploadResultsBtn.addEventListener("click", (event) => {
            event.preventDefault()
            if (fileContent) {
                CSVObjectCreator(fileContent, companyData, "result")
            }
        })
    }
    // Add event listener for the upload budget button
    if (uploadBudgetBtn) {
        uploadBudgetBtn.addEventListener("click", (event) => {
            console.log("Budget button clicked")
            event.preventDefault()
            if (fileContent) {
                CSVObjectCreator(fileContent, companyData, "budget")
            }
        })
    }

    // Event listener for the dynamicContentContainer to handle all click events inside the container
    if (dynamicContentContainer) {
        dynamicContentContainer.addEventListener("click", (event) => {
            const targetButton = event.target // Get the clicked button
            let action = null
            if (targetButton.classList.contains("btnInsertCategory")) {
                action = "add" // Set action to add
            } else if (targetButton.classList.contains("btnDeleteCategory")) {
                action = "delete" // Set action to delete
            }
            
            if (action) {    
                let formElement = event.target.previousElementSibling  // Get the form element before the button
                if (formElement && formElement.tagName !== "FORM") { // If the previous element is not a form (e.g. it's a button), get the next one
                    formElement = formElement.previousElementSibling
                }
                const targetTable = formElement && formElement.tagName === "FORM" ? formElement.querySelector("table") : null // If a formElement is found, get the first <table> found
            
                let tableName = "Ukendt tabel"

                if (targetTable && targetTable.tagName === "TABLE") {
                    if (targetTable.classList.contains("results-revenue-table")) tableName = "Resultater Omsætning"
                    else if (targetTable.classList.contains("results-fixed-expense-table")) tableName = "Resultater Faste Omkostninger"
                    else if (targetTable.classList.contains("results-variable-expense-table")) tableName = "Resultater Variable Omkostninger"
                    else if (targetTable.classList.contains("budget-revenue-table")) tableName = "Budget Omsætning"
                    else if (targetTable.classList.contains("budget-fixed-expense-table")) tableName = "Budget Faste Omkostninger"
                    else if (targetTable.classList.contains("budget-variable-expense-table")) tableName = "Budget Variable Omkostninger" 
                    
                    const tableBody = targetTable.querySelector("tbody")
                    if (tableBody) {
                        if (action === "add") {
                            const newCategoryName = prompt("Indtast navn for den nye kategori:", "Ny kategori")
                            
                            if (newCategoryName && newCategoryName.trim() !== "") { // Check if the user entered a name
                                const newRowData = Array(12).fill("") // Create a new row
                                addRow(tableBody, newCategoryName.trim(), newRowData) // Add the new row to the table
                            } else if (newCategoryName === null) {
                                alert("Venligst indtast et navn for den nye kategori")
                            }
                        } else if (action === "delete") {
                            if (confirm("Er du sikker på, at du vil slette den sidste kategori?")) {
                                deleteLastRow(tableBody) // Delete the last row from the table
                            }
                        }
                    }
                }
            } 
        }) 
    }
    if (saveBtn) {
        saveBtn.addEventListener("click", () => {
            console.log("Save button clicked")

            if (!userId) {
                console.error("User ID is not set. Cannot save data.")
                alert("Bruger ID er ikke sat. Venligst log ind igen.")
                return
            }
            
            updateCompanyDataFromTables(companyData, yearSelect.value, revenuetable, variabelexpensetable, fastexpensetable) // Extract data from the tables
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
    }

    // Toggle the popup visibility when the export button is clicked
    exportButton.addEventListener('click', function () {
    // Toggle the display of the popup
    const isVisible = popupMenu.style.display === 'block';
    popupMenu.style.display = isVisible ? 'none' : 'block';

    // Position the popup above the button
    const buttonRect = exportButton.getBoundingClientRect(); // Get button's position
    popupMenu.style.top = buttonRect.top + window.scrollY - popupMenu.offsetHeight + 'px'; // Position the popup above the button
    popupMenu.style.left = buttonRect.left + 'px'; // Align with the button's left edge
    });

// Hide the popup if clicked outside
    document.addEventListener('click', function (event) {
        if (!exportButton.contains(event.target) && !popupMenu.contains(event.target)) {
            popupMenu.style.display = 'none';
        }
    });

// Handle Export Result click
    exportResultButton.addEventListener('click', function () {
    // You can call your export function here
        const dataToSave = ExtractDataFromAllTables(yearSelect.value)
        console.log(dataToSave)
        ExportToCSV(companyData, "filename", yearSelect.value, "result")
        popupMenu.style.display = 'none'; // Hide the menu after selection
    });

// Handle Export Budget click
    exportBudgetButton.addEventListener('click', function () {
    // You can call your export function here
        const dataToSave = ExtractDataFromAllTables(yearSelect.value)
        console.log(dataToSave)
        ExportToCSV(companyData, "filename", yearSelect.value, "budget")
        popupMenu.style.display = 'none'; // Hide the menu after selection
    });

/*
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            const dataToSave = ExtractDataFromAllTables(yearSelect.value)
            console.log(dataToSave)
            ExportToCSV(companyData, "filename", yearSelect.value, "budget")
        })
    }
        */
})   

