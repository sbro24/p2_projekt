const saveBtn = document.getElementById("saveButton")

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

document.addEventListener("DOMContentLoaded", (event) => {
    const saveBtn = document.getElementById("saveButton")
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


