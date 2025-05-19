const xValues = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];

// Chart Revenue
const chartRevenue = new Chart("chartRevenue", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478,4732,1374], //hent rigtig data somehow
      borderColor: "red",
      fill: false
    }, { 
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100,6000,4000], //hent rigtig data somehow
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: {display: false}
  }
});

// Chart Expenses
const chartExpenses = new Chart("chartExpenses", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478,4732,1374], //hent rigtig data somehow
      borderColor: "red",
      fill: false
    }, { 
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100,6000,4000], //hent rigtig data somehow
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: {display: false}
  }
});
