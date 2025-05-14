const saveBtn = document.getElementById("saveButton")

let years = [2020, 2021, 2022, 2023, 2024];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateTable(sectionClass, isExpense = false) {
    let tables = document.getElementByClassName(sectionClass);
    for (let table of tables) {
        let count = 0;
        years.forEach(year => {
            let row = `<tr><td>${year}</td>`;
            months.forEach(month => {
                let inputName = isExpense ? `exp_${month.toLowerCase()}${year}` : `${month.toLowerCase()}${year}`;
                row += `<td><input type='number' name='${inputName}' placeholder="0.00"></td>`;
                count++;
            });
            row += `</tr>`;
            table.innerHTML += row;
    })};
}

const btnManuelInput = document.querySelector("#btnManuelInput");

btnManuelInput.addEventListener("click", function() {
    generateTable("result-table");
    generateTable("budget-table", true);
});


document.addEventListener("DOMContentLoaded", (event) => {
    const saveBtn = document.getElementById("saveButton")
    var revenueTable = document.getElementById('revenue-table'); // Revenue table element
    var variabelExpenseTable = document.getElementById('variabel-expense-table'); // Expenses table element
    var fastExpenseTable = document.getElementById('fast-expense-table'); // Expenses table element
    
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


