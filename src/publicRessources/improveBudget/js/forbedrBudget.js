// Create the functionality for the html document to help improve the budget
// On the left hand side there should be two graphs: 1. displaying the differences between - budget, forecast and results 
// 2. Displaying the historical data with forcast for greater overview
// On the right hand side there should be a tabel displaying the top 5 highest differences between budget and forecast
// Under the tabel a textbox with valuable information to the user
// On the bottom of the page there should be three dropdown bars each containing their own tabel: budget, forecast and results.
// The tables should be editable and when the user presses save the database hould be updated and the new forecast should be dispplayed


// A multi-line graph displaying the actual data for 2025, forecast for 2025 and budget for 2025.

//First: Fetch data from the api 

//   async function fetchData() {

//     try {
        
//         const response = await fetch('/api/user/data')

//         if(!response.ok){
//             throw new Error("Could not fetch the response")

//         } else {
//             const data = await response.json();
//             console.log(data)
//         }
        

//     } catch (error) {
//         console.log(error )
        
//     }
    
//   }

//fetch('/api/user/data')
// .then(response => response.json())
// .then(data => {
//     console.log('API Response:', data);
//     if (!data) throw new Error('Empty response');
//   })
//   .catch(error => {
//     console.error('Test Failed:', error);
//     alert('API Test Failed - Check console');
//   });
//   console.log(data);




  // Import charjs graphs: 1. Differences - between budget, forecast and results, 2. Displaying historical data for overview
  // Line graph that uses data from the "/api/user/data"

  // document.addEventListener('DOMContentLoaded', function() {


  //   // Comaprison Chart (2025)
  //   const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
  //   new Chart(comparisonCtxCtx, {
  //       type: 'line',
  //       data: {
  //           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //           datasets: [
                
  //           ]
  //       },
  //       options: {
  //           responsive: true,
  //           scales: {
  //               y: {
  //                   beginAtZero: false
  //               }
  //           }
  //       }
  //   });
  
  //   // Display Chart (2020-2025)
  //   const displayCtx = document.getElementById('displayChart').getContext('2d');
  //   new Chart(displayCtx, {
  //       type: 'line',
  //       data: {
  //           labels: ['2020','2021','2022','2023','2024','2025'],
  //           datasets: [
            
  //           ]
  //       },
  //       options: {
  //           responsive: true,
  //           scales: {
  //               y: {
  //                   beginAtZero: false
  //               }
  //           }
  //       }
  //   });
  // });
// Define month names for chart labels
// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// // Variables to store chart instances
// let comparisonChart, historicalChart;

// // Main function that runs when page loads
// document.addEventListener("DOMContentLoaded", async () => {
//     console.log("1. Page loaded, starting initialization"); // Debug log
    
//     try {
        
        
//         // fetch data1
//         console.log("3. Fetching data from /api/user/data/"); // Debug log
//         const response = await fetch('/api/user/data/', {
//             credentials: 'include',
//             headers: { 'Accept': 'application/json' }
//         });
        
//         console.log("4. Received response, status:", response.status); // Debug log
        
//         if (!response.ok) {
//             throw new Error(`Server returned ${response.status} status`);
//         }
        
//         const data = await response.json();
//         console.log("5. Parsed JSON data:", data); // Debug log

//         // 2. INITIALIZE CHARTS
//         console.log("6. Initializing charts"); // Debug log
        
//         // Get canvas elements
//         const comparisonCtx = document.getElementById('comparisonChart');
//         const historicalCtx = document.getElementById('displayChart');
        
//         if (!comparisonCtx || !historicalCtx) {
//             throw new Error("Chart canvases not found in DOM");
//         }
        
//         console.log("7. Canvas elements found"); // Debug log

//         // Destroy old charts if they exist
//         if (comparisonChart) comparisonChart.destroy();
//         if (historicalChart) historicalChart.destroy();

//         // Create comparison chart
//         comparisonChart = new Chart(comparisonCtx.getContext('2d'), {
//             type: 'line',
//             data: {
//                 labels: months,
//                 datasets: [
//                     {
//                         label: 'Budget 2025',
//                         borderColor: '#4e73df',
//                         data:data,
//                         borderWidth: 2
//                     },
//                     {
//                         label: 'Actual 2025',
//                         borderColor: '#e74a3b',
//                         data: data,
//                         borderWidth: 2
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 scales: { 
//                     y: { 
//                         beginAtZero: false
//                     }
//                 }
//             }
//         });
        
//         console.log("8. Comparison chart created"); // Debug log

//         // Create historical chart
//         const yearlyTotals = [];
//         const monthlyData = data.result?.revenue?.monthly || [];
//         console.log("9. Monthly data for history chart:", monthlyData); // Debug log
        
    
        
        
//         historicalChart = new Chart(historicalCtx.getContext('2d'), {
//             type: 'bar',
//             data: {
//                 labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
//                 datasets: [{
//                     label: 'Yearly Revenue',
//                     backgroundColor: '#36b9cc',
//                     data: yearlyTotals
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: false
//                     }
//                 }
//             }
//         });
        
//         console.log("10. Historical chart created"); // Debug log
//     } catch (error) {
//         console.error("Data load failed:", error);
//         throw error;
//     }
// });