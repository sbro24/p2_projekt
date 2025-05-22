fetch('/api/user/profile/')
.then(response => response.json())
.then(data => document.getElementById('username').innerHTML = data.name)
.catch(error => {
    console.error('Error:', error)
    document.getElementById('username').innerHTML = '';
});

function UpdateUsername() {
    const newUsername = window.prompt("Nyt Brugernavn");
    fetch('/api/user/update/username', {
        method: 'POST',
        headers: { 'Content-Type': 'text/txt' },
        body: newUsername
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'saved') {
            document.getElementById('username').innerHTML = newUsername;
        } else {
            alert('Brugernavnet kunne ikke ændres');
            console.error('failed:', data);
        }
    })
}

function UpdatePassword() {
    const newPassword = window.prompt("Nyt Brugernavn");
    fetch('/api/user/update/password', {
        method: 'POST',
        headers: { 'Content-Type': 'text/txt' },
        body: newPassword
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 'saved') {
            document.getElementById('username').innerHTML = newUsername;
        } else {
            alert('Brugernavnet kunne ikke ændres');
            console.error('failed:', data);
        }
    })
}