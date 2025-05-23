// "Read more" button
document.getElementById("readMore").onclick = function () {
    window.location.href = "/about/";
};

// Charts
const xValues = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];

// Chart Revenue
const chartRevenue = new Chart("chartRevenue", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{ 
            label: 'Indtægt - Prognose',
            data: [-2116498,-2359971,-988380,-1292124,-1595898,-1450928,-1046572,-1102130,-1352841,-1167317,-1989371,-2212521],
            borderColor: "red",
            borderwidth: 2,
            fill: false
        }, { 
            label: 'Indtægt - Budget',
            data: [-1876498,-2660192,-768383,-1234524,-1395898,-1452124,-1146572,-1302130,-1332841,-867317,-1489371,-2782749],
            borderColor: "blue",
            borderwidth: 2,
            fill: false
        }]
    },
    options: {
        legend: {display: false}
    },
    scales: {
        y: {
            beginAtZero: false,
            ticks: { callback: value => `${value.toLocaleString()} kr` }
        }
    }
});

// Chart Expenses
const chartExpenses = new Chart("chartExpenses", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{ 
            label: 'Udgifter - Prognose',
            data: [1576498,1860192,1368383,1434524,1395898,1297851,1282345,1070630,1132841,1367317,1589371,1882749], 
            borderColor: "red",
            borderwidth: 2,
            fill: false
        }, { 
            label: 'Udgifter - Budget',
            data: [1876498,2660192,768383,1234524,1395898,1467851,1162345,1270630,1332841,867317,1489371,2782749], 
            borderColor: "blue",
            borderwidth: 2,
            fill: false
        }]
    },
    options: {
        legend: {display: false}
    },
    scales: {
        y: {
            beginAtZero: false,
            ticks: { callback: value => `${value.toLocaleString()} kr` }
        }
    }
});
