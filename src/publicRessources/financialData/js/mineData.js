const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthMapping = {"january": "Jan", "february": "Feb", "march": "Mar", "april": "Apr", "may": "May", "june": "Jun",
                      "july": "Jul", "august": "Aug", "september": "Sep", "october": "Oct", "november": "Nov", "december": "Dec"};
let companyData = null;

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
    
// Load the HTML structure when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    BuildHTMLStructure() // build the HTML structure for all the years year
    const yearSelect = document.getElementById("yearSelect")
    const saveBtn = document.getElementById("saveButton")


    fetch('/api/user/data')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json() // Parses the JSON response, returns a promise
    })
    .then(apiResponse => {
        console.log("Fetched API response:", apiResponse)

        let userId = null
        let userData = null
        // Check if the API response contains dataById and if it has any IDs 
        if (apiResponse && apiResponse.dataById && Object.keys(apiResponse.dataById).length > 0) {
            userId = Object.keys(apiResponse.dataById)[0] // Get the current user ID
            userData = apiResponse.dataById[userId] // Get the data for that user ID
        } else if (apiResponse && !apiResponse.dataById && (apiResponse.result || apiResponse.budget || apiResponse.forecast)) {
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
    
    // Add event listener for the file input element 
    const fileInput = document.getElementById("fileInput")
    if (fileInput) {
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0] // Get the selected file
            if (file) {
                console.log("File selected:", file.name)
            }
        })
    }

    // Event listener for the dynamicContentContainer to handle all click events inside the container
    const dynamicContentContainer = document.getElementById("dynamicContentContainer")
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
})        


/* Old code, not used anymore
document.addEventListener("DOMContentLoaded", (event) => {
    var revenueTable = document.getElementById('revenue-table'); // Revenue table element
    //var variabelExpenseTable = document.getElementById('variabel-expense-table'); // Expenses table element
    //var fastExpenseTable = document.getElementById('fast-expense-table'); // Expenses table element
    
    saveBtn.addEventListener("click", () => {
        console.log("Button clicked");
        fetch('/api/user/data')
        .then(response => response.json())
        .then(data => toTableRevenue(data, '2022', revenueTable, variabelExpenseTable, fastExpenseTable))
        
    
        //fetch('/api/saveData', {
        //    method: 'POST',
        //    headers: { 'Content-Type': 'application/json' },
        //    body: JSON.stringify(object)
        //})
        //    .then(res => res.json())
        //    .then(response => {
        //        console.log("Server response:", response);
        //        // You can update the DOM here if needed
        //        console.log("fetch is made");
        //    })
        //    .catch(error => {
        //        console.error("Error saving data:", error);
        //    });
    })
});
*/

