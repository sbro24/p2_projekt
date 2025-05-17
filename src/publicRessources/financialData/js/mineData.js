const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const saveBtn = document.getElementById("saveButton")
let companyData = null;

/*
document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/user/data')
    .then(response => response.json())
    .then(data => TableHandler(data))
})    


function TableHandler(company) {
    RevenueHandler(company.result.revenue)
}
// object.result.revenue.abekat.data
function RevenueHandler(revenue) {
    console.log(revenue)
    for (const key in revenue) {
        console.log(revenue[key].data)  
    }
}

function ExpenseHandler(data) {

}

function BudgetHandler(data) {

}
*/

/** 
 * Updates the displayed year based on the selected year from the dropdown menu
 * Calls functions from generateTables.js to populate the tables
 */
function UpdateDisplayedYear() {
    const yearSelect = document.getElementById("yearSelect")
    const selectedYear = yearSelect.value

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
        const budgetRevenueTable = activeYearDiv.querySelector('.budget-revenue-table')
        const budgetFixedExpenseTable = activeYearDiv.querySelector('.budget-fixed-expense-table')
        const budgetVariableExpenseTable = activeYearDiv.querySelector('.budget-variable-expense-table') 
        
        // Call the functions from generateTables to populate the result tables
        if (resultsRevenueTable && resultsFixedExpenseTable && resultsVariableExpenseTable) {
            toTableRevenue(data, selectedYear, resultsRevenueTable, resultsVariableExpenseTable)
        } else {
            console.error("No results tables found!");
        }
        // Call the functions from generateTables to populate the budget tables
        if (budgetRevenueTable && budgetFixedExpenseTable && budgetVariableExpenseTable) {
            toTableRevenue(data, selectedYear, budgetRevenueTable, budgetVariableExpenseTable)
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
    const years = ["2024", "2023", "2022", "2021", "2020"]
    const container = document.getElementById("dynamicContentContainer")

    const templateHTMLStructure = `<section class="results-section">
            <h2 class="section-header">Mine resultater YEAR</h2> 
            <div>
                <h3>Omsætning</h3>      
                <form>
                    <table border="1" class="results-revenue-table revenue-table"> <thead>
                            <tr>
                                <th>Indtægt</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </thead>
                        <tbody></tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny indtægt</button>
            </div>        
            <div>    
                <h3>Faste Omkostninger</h3>             
                <form>
                    <table border="1" class="results-fixed-expense-table expense-table"> <thead>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </thead>
                        <tbody></tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
            </div>
            <div>
                <h3>Variable Omkostninger</h3>             
                <form>
                    <table border="1" class="results-variable-expense-table expense-table"> <thead>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </thead>
                        <tbody></tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
            </div>
        </section>
                
        <section class="budget-section">
            <h2 class="section-header">Min budget YEAR</h2>    
            <div>
                <h3>Omsætning</h3>      
                <form>
                    <table border="1" class="budget-revenue-table revenue-table"> <thead>
                            <tr>
                                <th>Indtægt</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </thead>
                        <tbody></tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny indtægt</button>
            </div>        
            <div>    
                <h3>Faste Omkostninger</h3>             
                <form>
                    <table border="1" class="budget-fixed-expense-table expense-table"> <thead>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </thead>
                        <tbody></tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
            </div>
            <div>
                <h3>Variable Omkostninger</h3>             
                <form>
                    <table border="1" class="budget-variable-expense-table expense-table"> <thead>
                            <tr>
                                <th>Omkostning</th>
                                <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>Maj</th><th>Jun</th>
                                <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                            </tr> 
                        </thead>
                        <tbody></tbody>
                    </table>
                </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
            </div>
        </section>`

    // Checks if the div with the id "data-YEAR" already exists, if not, create it
    years.forEach(year => {
         if (!document.getElementById(`data-${year}`)) {
            const newYearDiv = document.createElement("div");
            newYearDiv.id = `data-${year}`;
            newYearDiv.className = "year-data-content";
            newYearDiv.innerHTML = templateHTMLStructure.replace(/YEAR/g, year);
            container.appendChild(newYearDiv);
         }
    })
}
    
// Load the HTML structure when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    BuildHTMLStructure() // build the HTML structure for each year
    yearSelect.addEventListener("change", UpdateDisplayedYear) // Event listener for year selection
    UpdateDisplayedYear() // Call the function to display the selected year data
    /* NEED CSV PARSER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /const fileInput = document.getElementById('fileInput');
    const file = event.target.files[0];*/
    if (dynamicContentContainer) {
        dynamicContentContainer.addEventListener("click", (event) => {
            if (event.target.classlist.contains("btnInsertCategory")) {
                const targetTable = event.target.previousElementSibling.querySelector("table"); // Refers to the form, then looks inside form for the table
                let tableName = "Ukendt tabel"

                if (targetTable && targetTable.tagName === "TABLE") { // Checks if the target found is a table
                    // Checks classlist of the table to determine name for tables
                    if (targetTable.classlist.contains("results-revenue-table")) tableName = "Resultater Omsætning"
                    else if (targetTable.classlist.contains("results-fixed-expense-table")) tableName = "Resultater Faste Omkostninger"
                    else if (targetTable.classlist.contains("results-variable-expense-table")) tableName = "Resultater Variable Omkostninger"
                    else if (targetTable.classlist.contains("budget-revenue-table")) tableName = "Budget Omsætning"
                    else if (targetTable.classlist.contains("budget-fixed-expense-table")) tableName = "Budget Faste Omkostninger"
                    else if (targetTable.classlist.contains("budget-variable-expense-table")) tableName = "Budget Variable Omkostninger"                        
                }
            }
        })
    }
})


/*
function BuildTables(tableClass, prefix = "", year) {
    let tables = document.getElementsByClassName(tableClass);
    for (let table of tables) {
            // Overwrite existing tables
            let tbody = table.querySelector("tbody");
            if (tbody) {
                tbody.remove();
            }
            tbody = document.createElement("tbody");

            let row = document.createElement("tr");
            let yearCell = document.createElement("td");
            yearCell.textContent = year;
            row.appendChild(yearCell);

            months.forEach(month => {
                let cell = document.createElement("td");
                let input = document.createElement("input");
                input.type = "number";
                input.name = `${prefix}${month.toLowerCase()}${year}`;
                input.placeholder = "0.00"
                cell.appendChild(input);
                row.appendChild(cell);
            });
            tbody.appendChild(row);
            table.appendChild(tbody);
    };
}

function GenerateAllTables() {
    const selectedYear = document.getElementById("yearSelect").value;
    BuildTables("revenue-table", "rev_", selectedYear);
    BuildTables("expense-table", "exp_", selectedYear);
}

document.addEventListener("DOMContentLoaded", () => {
    GenerateAllTables();

    const yearSelect = document.getElementById("yearSelect");
    yearSelect.addEventListener("change", () => {
        GenerateAllTables();
    });

    const btnManuelInput = document.querySelector("#btnManuelInput");
    btnManuelInput.addEventListener("click", () => {
        const confirmation = confirm("Advarsel: Alle eksisterende data i tabellerne vil blive overskrevet. Vil du fortsætte?");
        if (confirmation) {  
            GenerateAllTables();
    }}); 
});
*/




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


