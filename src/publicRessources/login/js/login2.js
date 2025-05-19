

document.addEventListener("DOMContentLoaded", (event) => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
    
        const data = {}; 
        for (var element of loginForm) {
            if (element.type === "submit") continue;
            data[element.name] = element.value;
        }

        const validationMessage = ValidationLoginData(data);
        if (validationMessage !== '') {
            alert('Validation error: ' + validationMessage);
            return;
        }

        // Send the data to the server
        fetch('/api/login/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data === 'success') {
                window.location.href = '/profil'; // Redirect to home page on success
            } else {
                alert('Login failed: ' + data); // Show error message
            }
        })
    
    
    });

    function ValidationLoginData(data) {
        if (data.username.length > 128) return 'username must be less than 128 characters';
        if (data.password.length > 128) return 'password must be less than 128 characters';
        if (data.username.length < 4) return 'Username must be at least 4 characters long';
        if (data.password.length < 8) return 'Password must be at least 8 characters long';
        return '';
    }
});