

document.addEventListener("DOMContentLoaded", (event) => {
});
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {}; 
    for (var element of loginForm) {
        if (element.type === "submit") continue;
        data[element.name] = element.value;
    }
    // Send the data to the server
    
    fetch('/api/login/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    //.then(result => 
    //    alert(result.response)
    //    console.log(result)
    //)
});



//let loginButton = document.getElementById("loginButton");
//loginButton.addEventListener("click", function(event) {
//    event.preventDefault(); // Prevent the default form submission
//
//    
//    // Get the form data
//    const loginForm = document.getElementById("loginForm");
//    const data = loginForm;
//    console.log(data);
//
//
//
//    //// Send the data to the server
//    //fetch('/api/login/submit', {
//    //    method: 'POST',
//    //    headers: {
//    //        'Content-Type': 'application/json'
//    //    },
//    //    body: JSON.stringify(data)
//    //})
//    //.then(response => response.json())
//    //.then(data => {
//    //    console.log('Success:', data);
//    //    if (data.success) {
//    //        window.location.href = '/home'; // Redirect to home page on success
//    //    } else {
//    //        alert('Login failed: ' + data.message); // Show error message
//    //    }
//    //})
//    //.catch((error) => {
//    //    console.error('Error:', error);
//    //});
//});