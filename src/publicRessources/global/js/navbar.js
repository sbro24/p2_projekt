const navbar = `
    <div class="navbar">
        <nav aria-label="Main Navigation">
            <ul>
                <li><a href="/minSide">Min side</a></li>
                <li><a href="/mineData">Mine data</a></li>
                <li><a href="/forbedrBudget">Forbedr mit budget</a></li>
                <li><a href="/opfolgning">Følg op på budget</a></li>
                <li><a href="/forstaaPrognoser">Forstå mine prognoser</a></li>
            </ul>
        </nav>
    </div>
`;

// Inject the navbar into the <header> or another container
const header = document.querySelector('header');
if (header) {
    header.insertAdjacentHTML('afterend', navbar);
}
