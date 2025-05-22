fetch("/api/checkAuth/")
.then(response => response.json())
.then(data => { if (data === 'false') document.getElementById("login").hidden = false} )