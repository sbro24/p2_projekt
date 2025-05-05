//Registration form
document.addEventListener('DOMContentLoaded', function() {
    // Use querySelector to get the first element with this class
    const regForm = document.querySelector(".registration.form"); // Note the dot between classes
    
    regForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const companyname = document.getElementById("name");
        const password = document.getElementById("password");
        
        if (companyname.value == "" || password.value == "") {
            alert("Ensure you input a value in both fields!");
        } else {
            alert("This form has been successfully submitted!");
            console.log(`Companyname: ${companyname.value}, Password: ${password.value}`);
            
            companyname.value = "";
            password.value = "";
        }
    });
});

//Login form (Under development)

document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const companyName = document.getElementById('companyName').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyName, password })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Registration successful! Company ID: ' + result.companyId);
            window.location.href = 'login.html';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        alert('Network error - please try again');
    }
});


