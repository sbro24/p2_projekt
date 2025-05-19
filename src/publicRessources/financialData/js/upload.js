document.addEventListener("DOMContentLoaded", (event) => {
    const uploadForm = document.getElementById("uploadForm");
    uploadForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const file = document.querySelector("input[type=file]").files[0];
        console.log(file.type);
   

        // Read the file
        const reader = new FileReader();
        reader.onload = () => {
            content = reader.result;
            //function
        };
        reader.onerror = () => {
            showMessage("Error reading the file. Please try again.", "error");
        };
        reader.readAsText(file);
    });
})