const saveBtn = document.getElementById("saveButton")
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const mockCompanyData = {
    result: {
        revenue: {
            "sales": { 
                name: "Salg af Produkter", 
                data: [
                    { year: "2024", months: { Jan: 1200, Feb: 1300, Mar: 1250, Apr: 1400, May: 1500, Jun: 1600, Jul: 1550, Aug: 1650, Sep: 1700, Okt: 1800, Nov: 1900, Dec: 2000 } },
                    { year: "2023", months: { Jan: 1000, Feb: 1100, Mar: 1050, Apr: 1200, May: 1300, Jun: 1400, Jul: 1350, Aug: 1450, Sep: 1500, Okt: 1600, Nov: 1700, Dec: 1800 } },
                    { year: "2022", months: { Jan: 800, Feb: 900, Mar: 850, Apr: 1000, May: 1100, Jun: 1200, Jul: 1150, Aug: 1250, Sep: 1300, Okt: 1400, Nov: 1500, Dec: 1600 } },
                ]
            },
            "services": { 
                name: "Konsulentydelser", 
                data: [
                    { year: "2024", months: { Jan: 500, Feb: 550, Mar: 600, Apr: 520, May: 580, Jun: 610, Jul: 600, Aug: 620, Sep: 650, Okt: 700, Nov: 720, Dec: 750 } },
                    { year: "2023", months: { Jan: 400, Feb: 450, Mar: 500, Apr: 420, May: 480, Jun: 510, Jul: 500, Aug: 520, Sep: 550, Okt: 600, Nov: 620, Dec: 650 } },
                ]
            }
        },
        expense: {
            "salaries": { 
                name: "Lønninger", 
                characteristics: "Fast", 
                data: [
                    { year: "2024", months: { Jan: 600, Feb: 600, Mar: 600, Apr: 610, May: 610, Jun: 610, Jul: 620, Aug: 620, Sep: 620, Okt: 630, Nov: 630, Dec: 630 } },
                    { year: "2023", months: { Jan: 500, Feb: 500, Mar: 500, Apr: 510, May: 510, Jun: 510, Jul: 520, Aug: 520, Sep: 520, Okt: 530, Nov: 530, Dec: 530 } },
                ]
            },
            "rent": { 
                name: "Husleje", 
                characteristics: "Fast", 
                data: [
                    { year: "2024", months: { Jan: 200, Feb: 200, Mar: 200, Apr: 200, May: 200, Jun: 200, Jul: 200, Aug: 200, Sep: 200, Okt: 210, Nov: 210, Dec: 210 } },
                    { year: "2023", months: { Jan: 180, Feb: 180, Mar: 180, Apr: 180, May: 180, Jun: 180, Jul: 180, Aug: 180, Sep: 180, Okt: 190, Nov: 190, Dec: 190 } },
                ]
            },
            "marketing": { 
                name: "Markedsføring", 
                characteristics: "Variabel", 
                data: [
                    { year: "2024", months: { Jan: 100, Feb: 120, Mar: 90, Apr: 150, May: 130, Jun: 100, Jul: 110, Aug: 140, Sep: 160, Okt: 120, Nov: 100, Dec: 180 } },
                    { year: "2023", months: { Jan: 80, Feb: 100, Mar: 70, Apr: 130, May: 110, Jun: 80, Jul: 90, Aug: 120, Sep: 140, Okt: 100, Nov: 80, Dec: 160 } },
                ]
            }
        }
    },
    forecast: { // Assuming similar structure for forecast data, including year property in data items
        revenue: {
            "projSales": { 
                name: "Forventet Salg (Produkt A)", 
                data: [ // Data should be an array of objects, each with a year
                    { year: "2024", months: { Jan: 1300, Feb: 1400, Mar: 1350, Apr: 1500, May: 1600, Jun: 1700, Jul: 1650, Aug: 1750, Sep: 1800, Okt: 1900, Nov: 2000, Dec: 2100 } },
                    { year: "2023", months: { Jan: 1100, Feb: 1200, Mar: 1150, Apr: 1300, May: 1400, Jun: 1500, Jul: 1450, Aug: 1550, Sep: 1600, Okt: 1700, Nov: 1800, Dec: 1900 } },
                ]
            }
        },
        expense: {
            "projMarketing": { 
                name: "Forventet Markedsføring", 
                characteristics: "Variabel", 
                data: [
                    { year: "2024", months: { Jan: 110, Feb: 130, Mar: 100, Apr: 160, May: 140, Jun: 110, Jul: 120, Aug: 150, Sep: 170, Okt: 130, Nov: 110, Dec: 190 } },
                    { year: "2023", months: { Jan: 90, Feb: 110, Mar: 80, Apr: 140, May: 120, Jun: 90, Jul: 100, Aug: 130, Sep: 150, Okt: 110, Nov: 90, Dec: 170 } },
                ]
            },
             "projSalaries": { 
                name: "Forventede Lønninger", 
                characteristics: "Fast", 
                data: [
                    { year: "2024", months: { Jan: 620, Feb: 620, Mar: 620, Apr: 630, May: 630, Jun: 630, Jul: 640, Aug: 640, Sep: 640, Okt: 650, Nov: 650, Dec: 650 } },
                    { year: "2023", months: { Jan: 520, Feb: 520, Mar: 520, Apr: 530, May: 530, Jun: 530, Jul: 540, Aug: 540, Sep: 540, Okt: 550, Nov: 550, Dec: 550 } },
                ]
            }
        }
    }
};

/**
 * Updates the displayed content based on the selected year.
 * Calls functions from generateTables.js to populate the tables.
 */
function updateDisplayedYear() {
    const yearSelect = document.getElementById('yearSelect');
    if (!yearSelect) {
        console.error("Year select element not found!");
        return;
    }
    const selectedYear = yearSelect.value;
    
    // Hide all year-data-content divs
    document.querySelectorAll('.year-data-content').forEach(div => {
        div.classList.remove('active'); 
    });

    // Show the selected year's content div
    const activeYearDiv = document.getElementById(`data-${selectedYear}`);
    if (activeYearDiv) {
        activeYearDiv.classList.add('active'); 

        // Get table elements for "Results"
        const resultsRevenueTable = activeYearDiv.querySelector('.results-revenue-table');
        const resultsFixedExpenseTable = activeYearDiv.querySelector('.results-fixed-expense-table');
        const resultsVariableExpenseTable = activeYearDiv.querySelector('.results-variable-expense-table');

        // Get table elements for "Budget" (Forecast)
        const budgetRevenueTable = activeYearDiv.querySelector('.budget-revenue-table');
        const budgetFixedExpenseTable = activeYearDiv.querySelector('.budget-fixed-expense-table');
        const budgetVariableExpenseTable = activeYearDiv.querySelector('.budget-variable-expense-table');
        
        // Populate "Results" tables
        if (typeof toTableRevenue === 'function') {
            if (resultsRevenueTable && resultsFixedExpenseTable && resultsVariableExpenseTable) {
                 toTableRevenue(mockCompanyData, selectedYear, resultsRevenueTable, resultsVariableExpenseTable, resultsFixedExpenseTable);
            } else {
                console.error(`Could not find all 'results' table elements for year ${selectedYear} within the active year div. Check class names.`);
            }
        } else {
            console.error("toTableRevenue function not found. Ensure generateTables.js is loaded correctly and before mainScript.js.");
        }

        // Populate "Budget" (Forecast) tables
        if (typeof ToTableForecast === 'function') {
            if (budgetRevenueTable && budgetFixedExpenseTable && budgetVariableExpenseTable) {
                ToTableForecast(mockCompanyData, selectedYear, budgetRevenueTable, budgetVariableExpenseTable, budgetFixedExpenseTable);
            } else {
                 console.error(`Could not find all 'budget' (forecast) table elements for year ${selectedYear} within the active year div. Check class names.`);
            }
        } else {
            console.error("ToTableForecast function not found. Ensure generateTables.js is loaded correctly and before mainScript.js.");
        }

    } else {
        console.warn(`Content div for year ${selectedYear} (id: data-${selectedYear}) not found. Ensure ensureYearContentBlocksExist() has run and created this div.`);
    }
}
        
/**
 * Generates the HTML structure for each year and appends it to the dynamicContentContainer.
 */
function ensureYearContentBlocksExist() {
    const years = ["2024", "2023", "2022", "2021", "2020"]; // Years from your dropdown
    const container = document.getElementById('dynamicContentContainer');
    if (!container) {
        console.error("Dynamic content container (id: dynamicContentContainer) not found!");
        return;
    }

    // HTML template for a single year's content sections
    // Using class "section-header" as it seems to be a style you might have.
    const templateHtmlStructure = `
            <section>
                <h2 class="section-header">Mine resultater YEAR</h2>   

                <h2>Omsætning</h2>      
                    <form>
                        <table border="1" id="results-revenue-table">
                            <thead>
                                <tr>
                                    <th>Indtægt</th>
                                    <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                                    <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                                </tr> 
                            </thead>
                        </table>
                    </form>
                <button class="btnInsertCategory">Indsæt ny indtægt</button>
                        
                <h2>Faste Omkostninger</h2>             
                    <form>
                        <table border="1" id="results-faste-expense-table">
                            <thead>
                                <tr>
                                    <th>Omkostning</th>
                                    <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                                    <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                                </tr> 
                            </thead>
                        </table>
                    </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>

                <h2>Variable Omkostninger</h2>             
                    <form>
                        <table border="1" id="results-variable-expense-table">
                            <thead>
                                <tr>
                                    <th>Omkostning</th>
                                    <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                                    <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                                </tr> 
                            </thead>
                        </table>
                    </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
            </section>
                        
            <section>
                <h2 class="section-header">Min budget YEAR</h2>    
                
                <h2>Omsætning</h2>      
                    <form>
                        <table border="1" id="budget-revenue-table">
                            <thead>
                                <tr>
                                    <th>Indtægt</th>
                                    <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                                    <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                                </tr> 
                            </thead>
                        </table>
                    </form>
                <button class="btnInsertCategory">Indsæt ny indtægt</button>
                        
                <h2>Faste Omkostninger</h2>             
                    <form>
                        <table border="1" id="budget-faste-expense-table">
                            <thead>
                                <tr>
                                    <th>Omkostning</th>
                                    <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                                    <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                                </tr> 
                            </thead>
                        </table>
                    </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>

                <h2>Variable Omkostninger</h2>             
                    <form>
                        <table border="1" id="budget-variable-expense-table">
                            <thead>
                                <tr>
                                    <th>Omkostning</th>
                                    <th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>
                                    <th>Jul</th><th>Aug</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Dec</th>
                                </tr> 
                            </thead>
                        </table>
                    </form>
                <button class="btnInsertCategory">Indsæt ny omkostning</button>
            </section>
        `;

    years.forEach(year => {
        // Create the div for the year if it doesn't already exist
        if (!document.getElementById(`data-${year}`)) {
            const newYearDiv = document.createElement('div');
            newYearDiv.id = `data-${year}`;
            newYearDiv.className = 'year-data-content'; 
            newYearDiv.innerHTML = templateHtmlStructure.replace(/YEAR/g, year); // Replace YEAR placeholder
            container.appendChild(newYearDiv);
        }
    });
}

// Main execution block after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('yearSelect');
    const btnManuelInput = document.getElementById('btnManuelInput');
    const manuelInputSection = document.getElementById('manuelInputSection');
    const currentYearSpan = document.getElementById('currentYear');
    const dynamicContentContainer = document.getElementById('dynamicContentContainer');

    if(currentYearSpan) {
        // Update footer year dynamically if it's not already set or is a placeholder
        const currentSystemYear = new Date().getFullYear();
        if (currentYearSpan.textContent !== currentSystemYear.toString()) {
             currentYearSpan.textContent = currentSystemYear;
        }
    }
    
    ensureYearContentBlocksExist(); // Generate the HTML structure for all years

    if (yearSelect) {
        yearSelect.addEventListener('change', updateDisplayedYear);
        updateDisplayedYear(); // Initial population for the default selected year
    } else {
        console.error("Year select dropdown (id: yearSelect) not found.");
    }

    if (btnManuelInput && manuelInputSection) {
        btnManuelInput.addEventListener('click', () => {
            manuelInputSection.style.display = manuelInputSection.style.display === 'none' ? 'block' : 'none';
        });
    } else {
        if (!btnManuelInput) console.warn("Button with id 'btnManuelInput' not found.");
        if (!manuelInputSection) console.warn("Section with id 'manuelInputSection' not found.");
    }
    
    const fileInput = document.getElementById('fileInput'); // Corrected ID from 'file' to 'fileInput'
    if(fileInput) {
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log("File selected:", file.name);
                // Future: Implement CSV parsing and table update logic here
                alert("CSV file handling not yet implemented in this example.");
            }
        });
    } else {
        console.warn("File input with id 'fileInput' not found.");
    }

    // Event delegation for "Indsæt ny kategori" buttons
    if (dynamicContentContainer) {
        dynamicContentContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('btnInsertCategory')) {
                const yearSelectForAlert = document.getElementById('yearSelect');
                const selectedYearValue = yearSelectForAlert ? yearSelectForAlert.value : "Ukendt år";
                
                const targetTable = event.target.previousElementSibling; 
                const categoryType = event.target.textContent;
                let tableName = "ukendt tabel";
                if (targetTable && targetTable.tagName === 'TABLE') {
                    // Try to identify table based on its class
                    if (targetTable.classList.contains('results-revenue-table')) tableName = "Resultater Omsætning";
                    else if (targetTable.classList.contains('results-fixed-expense-table')) tableName = "Resultater Faste Omk.";
                    else if (targetTable.classList.contains('results-variable-expense-table')) tableName = "Resultater Variable Omk.";
                    else if (targetTable.classList.contains('budget-revenue-table')) tableName = "Budget Omsætning";
                    else if (targetTable.classList.contains('budget-fixed-expense-table')) tableName = "Budget Faste Omk.";
                    else if (targetTable.classList.contains('budget-variable-expense-table')) tableName = "Budget Variable Omk.";
                }
                alert(`${categoryType} - Funktion ikke implementeret endnu for tabel: ${tableName} i år ${selectedYearValue}`);
            }
        });
    } else {
        console.error("Dynamic content container (id: dynamicContentContainer) not found for event delegation.");
    }
});


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


