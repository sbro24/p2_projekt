const saveBtn = document.getElementById("saveButton")
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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


