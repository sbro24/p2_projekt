document.addEventListener("DOMContentLoaded", function () {
    // Determine the base path based on the current page's location
    const isInPagesFolder = window.location.pathname.includes('/publicRessources/');
    const basePath = isInPagesFolder ? '../../' : '';
    
    const navbar = `
        <div class="navbar">
            <nav aria-label="Frontpage Navigation">
                <ul>
                    <li><a href="${basePath}index.html">Startside</a></li>
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