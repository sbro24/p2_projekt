const saveBtn = document.getElementById("saveButton")

let object = {
    name: "Mikkel",
    age: "38"
}

saveBtn.addEventListener("click", () => {
    const companyObject = object;

    fetch('/api/saveData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyObject)
    })
        .then(res => res.json())
        .then(response => {
            console.log("Server response:", response);
            // You can update the DOM here if needed
        })
        .catch(error => {
            console.error("Error saving data:", error);
        });
    console.log("fetch is made");
})