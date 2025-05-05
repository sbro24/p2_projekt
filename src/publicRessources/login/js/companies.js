let activetUser = {
    companies: [],
    dataById: {}
};

// Empty company object
const companyDataTemplate = {
    result: {
        revenue: {
            sales: {
                characteristics: [],
                data: [{
                    year: new Date().getFullYear(),
                    months: {
                        January: 0,
                        February: 0,
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
                }]
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
};
