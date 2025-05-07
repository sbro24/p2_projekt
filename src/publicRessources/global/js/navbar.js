document.addEventListener("DOMContentLoaded", function () {
    // Determine the base path based on the current page's location
    const isInPublicRessouces = window.location.pathname.includes('/publicRessources/');
    const basePath = isInPublicRessouces ? '../../../' : '';
    
    const navbar = `
        <div class="navbar">
            <nav aria-label="Main Navigation">
                <ul>
                    <li><a href="${basePath}publicRessources/userData/html/minSide.html">Min side</a></li>
                    <li><a href="${basePath}publicRessources/financialData/html/mineData.html">Mine data</a></li>
                    <li><a href="${basePath}publicRessources/improveBudget/html/forbedrBudget.html">Forbedr mit budget</a></li>
                    <li><a href="${basePath}publicRessources/followUpBudget/html/opfolgning.html">Følg op på budget</a></li>
                    <li><a href="${basePath}publicRessources/understandForecast/html/forstaaPrognoser.html">Forstå mine prognoser</a></li>
                </ul>
            </nav>
        </div>
    `;

    // Inject the navbar into the <header> or another container
    const header = document.querySelector('header');
    if (header) {
        header.insertAdjacentHTML('afterend', navbar);
    }
});