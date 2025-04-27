

class Year {
    constructor (year) {
        year: Array(12).fill(0)
    }
}

class FinancialCategory {
    constructor(name = "RevenueType") {
        this[name] = {
            characteristics: ["?"],
            year: Array(12).fill(0)
        };
    }
}

class CompanyData {
    constructor(companyId) {
    this.result = {
        revenue: new FinancialCategory('result'),
        expense: new FinancialCategory('result')
    };
    this.budget = {
        revenue: new FinancialCategory('budget'),
        expense: new FinancialCategory('budget')
    };
    this.forecast = {
        revenue: new FinancialCategory('forecast'),
        expense: new FinancialCategory('forecast')
    };
    }
}
  
class Company {
    constructor(id, name, additional = '') {
        this.id = id;
        this.name = name;
    }
}