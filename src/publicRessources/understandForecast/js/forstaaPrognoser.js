

const xValues = ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];

const chartRevenue = new Chart("chartRevenue", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478,4732,1374],
      borderColor: "red",
      //fill: false
    }, { 
      data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000,1700,1900],
      borderColor: "green",
      //fill: false
    }, { 
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100,6000,4000],
      borderColor: "blue",
      //fill: false
    }]
  },
  options: {
    legend: {display: false}
  }
});

/*
 *  // Draw
 *  const chart = new google.visualization.LineChart(document.getElementById('chartExpenses'));
 *  //chart.draw(dataExpenses, options);
 *  chart.draw(dataBudget, options);
 * 
 */