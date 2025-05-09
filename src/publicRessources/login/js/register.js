

document.addEventListener("DOMContentLoaded", (event) => {
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
    
        const data = {}; 
        for (var element of registerForm) {
            if (element.type === "submit") continue;
            data[element.name] = element.value;
        }
        // Send the data to the server

        fetch('/api/register/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data === 'success') {
                window.location.href = '/login'; // Redirect to home page on success
            } else {
                alert(data); // Show error message
            }
        })
    
    });
});
