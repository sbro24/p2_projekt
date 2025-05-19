// Inject the navbar into the <header> or another container
document.addEventListener('DOMContentLoaded', async (event) => {
    const navbar = `
        <div class="navbar">
            <nav aria-label="Main Navigation">
                <ul>
                    <li><a href="/">Forside</a></li>
                    <li><a href="/profil">Profil</a></li>
                    <li><a href="/mineData">Mine data</a></li>
                    <li><a href="/forbedrBudget">Forbedr mit budget</a></li>
                    <li><a href="/forstaaPrognoser">Forstå mine prognoser</a></li>
                    ${await loginLink()}
                </ul>
            </nav>
        </div>
    `;

    const header = document.querySelector('header');
    header.insertAdjacentHTML('afterend', navbar);
});

async function loginLink() {
    return new Promise((resolve) => {
        fetch('/api/checkAuth')
        .then(response => response.json())
        .then(data => {
            if (data === 'true') {
                resolve(`<li><a href="#" onclick="logOut()">Log ud</a></li>`);
            } else {
                resolve(`<li><a href="/login">Log in</a></li>`);
            }
        })
        .catch(error => {
            console.error('Error fetching login status:', error)
            resolve(`<li><a href="/logout">Log ud</a></li>`)
        });
    })
}

function logOut() {
    fetch('/logout')
    .then(res => res.text())
    .then(data => {
        console.log(data);
        window.location.href = '/'
    })
}
