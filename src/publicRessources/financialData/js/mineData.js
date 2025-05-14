const saveBtn = document.getElementById("saveButton")

let years = [2020, 2021, 2022, 2023, 2024];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function BuildResultTables(tableClass, prefix = "") {
    let tables = document.getElementsByClassName(tableClass);
    for (let table of tables) {
            let row = document.createElement("tr");
            let labelCell = document.createElement("td");
            labelCell.textContent = "Resultat";
            row.appendChild(labelCell);

            years.forEach(year => {
                let cell = document.createElement("td");
                let input = document.createElement("input");
                input.type = "number";
                input.name = `${prefix}result${year}`;
                input.placeholder = "0.00"
                cell.appendChild(input);
                row.appendChild(cell);
            });
            table.appendChild(row);
    };
}

function BuildRevenueAndExpenseTables(tableClass, prefix = "") {
    let tables = document.getElementsByClassName(tableClass);
    for (let table of tables) {
        years.forEach(year => {
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
            table.appendChild(row);
    })};
}

function BuildBudgetTables(tableClass, prefix = "") {
    let tables = document.getElementsByClassName(tableClass);
    for (let table of tables) {
        years.forEach(year => {
            let row = document.createElement("tr");
            let yearCell = document.createElement("td");
            yearCell.textContent = year;
            row.appendChild(yearCell);

            months.forEach(month => {
                let cell = document.createElement("td");
                let input = document.createElement("input");
                input.type = "ænumber";
                input.name = `${prefix}${month.toLowerCase()}${year}`;
                input.placeholder = "0.00"
                cell.appendChild(input);
                row.appendChild(cell);
            });
            table.appendChild(row);
    })};
}

const btnManuelInput = document.querySelector("#btnManuelInput");

btnManuelInput.addEventListener("click", function() {
    BuildResultTables("result-table", "res_");
    BuildRevenueAndExpenseTables("revenue-table", "rev_");
    BuildRevenueAndExpenseTables("expense-table", "exp_");
    BuildBudgetTables("budget-table", "bud_");
});


document.addEventListener("DOMContentLoaded", (event) => {
    const saveBtn = document.getElementById("saveButton")
    
    saveBtn.addEventListener("click", () => {
        console.log("Button clicked");
        fetch('/api/user/data')
        .then(response => response.json())
        .then(data => toTableRevenue(data, '2024'))
        
    
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


