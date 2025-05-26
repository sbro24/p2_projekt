async function GetUsername() {
    return fetch('/api/user/profile/')
    .then(response => response.json())
    .then(data => { return data.name })
    .catch(error => {
        console.error('Error:', error)
        return '';
    });
}

function UpdateUsername() {
    const newUsername = window.prompt("Nyt Brugernavn");
    fetch('/api/user/update/username', {
        method: 'POST',
        headers: { 'Content-Type': 'text/txt' },
        body: newUsername
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'saved') {
            document.getElementById('username').innerHTML = newUsername;
        } else {
            alert('Brugernavnet kunne ikke ændres');
            console.error('failed:', data);
        }
    })
}

function UpdatePassword() {
    const newPassword = window.prompt("Ny Adgangskode");
    fetch('/api/user/update/password', {
        method: 'POST',
        headers: { 'Content-Type': 'text/txt' },
        body: newPassword
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'saved') {
            alert('Adgangskode skiftet');
        } else {
            alert('Adgangskode kunne ikke ændres');
            console.error('failed:', data);
        }
    })
}

async function DeleteUser() {
    const username = await GetUsername();
    const usernamePromt = window.prompt(`Skriv dit brugernavn "${username}" for at slætte din konto`);
    if (usernamePromt === username) {
        fetch('/api/user/delete/', {
            method: 'POST',
            headers: { 'Content-Type': 'text/txt' },
            body: username
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'deleted') {
                alert('Konto slettet');
                window.location.href = '/';
            } else {
                alert('Konto kunne ikke slettes');
                console.error('failed:', data);
            }
        })
    } else {
        alert('Forkert brugernavn');
    }
    
}

GetUsername()
.then(username => document.getElementById('username').innerHTML = username)