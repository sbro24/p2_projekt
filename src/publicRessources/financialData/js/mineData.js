const object = {
    "123456": {
        result: {
            revenue: {
                sales: {
                    characteristics: [],
                    data: [
                        {
                            year: 2025,
                            months: {
                                January: 0,
                                February: 100,
                                March: 0,
                                April: 0,
                                May: 0,
                                June: 0,
                                July: 0,
                                August: 0,
                                September: 0,
                                October: 0,
                                November: 0,
                                December: 0
                            }
                        },
                        {
                            year: 2025,
                            months: {
                                January: 1,
                                February: 1,
                                March: 1,
                                April: 0,
                                May: 0,
                                June: 0,
                                July: 0,
                                August: 0,
                                September: 0,
                                October: 0,
                                November: 0,
                                December: 0
                            }
                        }
                    ]
                }
            },
            expense: {}
        },
        budget: {
            revenue: {},
            expense: {}
        },
        forecast: {
            revenue: {},
            expense: {}
        }
    }
};

document.addEventListener("DOMContentLoaded", (event) => {
    const saveBtn = document.getElementById("saveButton")
    
    saveBtn.addEventListener("click", () => {
        console.log("Button clicked");
        fetch('/api/user/data')
        .then(response => response.json())
        .then(data => toTableRevenue(data, '2024'))
        
    
        //fetch('/api/saveData', {
        //    method: 'POST',
        //    headers: { 'Content-Type': 'application/json' },
        //    body: JSON.stringify(object)
        //})
        //    .then(res => res.json())
        //    .then(response => {
        //        console.log("Server response:", response);
        //        // You can update the DOM here if needed
        //        console.log("fetch is made");
        //    })
        //    .catch(error => {
        //        console.error("Error saving data:", error);
        //    });
    })
});


