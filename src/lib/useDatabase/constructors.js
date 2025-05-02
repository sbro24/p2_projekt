// classes and constructers for adding data to the JSON database
class Company {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    };
}

class CompanyData {
    constructor(companyId) {
        this.result = {
            revenue: {},
            expense: {}
        };
        this.budget = {
            revenue: {},
            expense: {}
        };
        this.forecast = {
            revenue: {},
            expense: {}
        };
    };
}

class FinancialMetric {
    constructor(name) {
        this.name = name;
        this.data = Array(0);
    };
}

class FinancialYear {
    constructor (year) {
        this.year = year
        this.months = {
            january: 0,
            february: 0,
            march: 0,
            april: 0,
            may: 0,
            june: 0,
            july: 0,
            august: 0,
            september: 0,
            october: 0,
            november: 0,
            december: 0
        }
    };
}

export {Company, CompanyData, FinancialMetric, FinancialYear};