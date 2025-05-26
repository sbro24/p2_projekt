import {CSVObjectCreator, CheckIfCategoryDataExistsResult, CheckIfCategoryDataExistsBudget, SplitRowsIntoCategories} from '../../../../src/publicRessources/financialData/js/CSVParser.js'

import {Company, CompanyData, FinancialMetric, FinancialYear} from '../../../../src/lib/useDatabase/constructors.js'
/*
class Company {
    constructor(id, name, password, sessionToken) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.sessionToken = sessionToken;
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
*/
/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const text_test = fs.readFileSync('test/publicRessources_test/financialData_test/assets/CSVParserTest.txt', 'utf-8');

test('Does the CSVObjectCreator function insert new undercategories into company object correctly for results', () => {

    //Initiate empty company object + an undercategory to be overwritten
    let test_company = new CompanyData("1234")
    let test_company_overwrite = new FinancialMetric("overwrite")
    let test_company_overwrite_datayear = new FinancialYear("2022")
    let overwriteData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    Object.keys(test_company_overwrite_datayear.months).forEach((month, i) => {
        month = overwriteData[i]
    })

    test_company_overwrite.data.push(test_company_overwrite_datayear)

    test_company.result.revenue["overwrite"] = test_company_overwrite



    //Initiate comparison company with expected values
    let test_company_comparison = new CompanyData("12345")

    let test_company_comparison_metrics_result = new FinancialMetric("salesItemOne")
    let test_company_comparison_metrics_variableExpense = new FinancialMetric("Advertising")
    let test_company_comparison_metrics_fastExpense = new FinancialMetric("Subscriptions")
    let test_company_comparison_metrics_overwrite = new FinancialMetric("overwrite")

    let test_company_comparison_metrics_result_datayear = new FinancialYear("2022")
    let test_company_comparison_metrics_variabelExpense_datayear = new FinancialYear("2022")
    let test_company_comparison_metrics_fastExpense_datayear = new FinancialYear("2022")
    let test_company_comparison_metrics_overwrite_datayear = new FinancialYear("2022")

    let SalesItemOneData = [16875.29, 17377.89, 17911.34, 18348.12, 18560.44, 17246.84, 16912.85, 17944.73, 16549.07, 16530.31, 16693.69, 18511.71]
    let AdvertisingData = [249.53, 250.7, 269.95, 270.46, 261.31, 281.48, 280.47, 286.19, 334.18, 290.52, 300.53, 324.67]
    let SubscriptionsData = [1308.00, 1297.00, 1330.00, 1310.00, 1295.00, 1302.00, 1329.00, 1342.00, 1300.00, 1324.00, 1318.00, 1334.00]
    let overwriteData2 = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

    Object.keys(test_company_comparison_metrics_result_datayear.months).forEach((month, i) => {
        test_company_comparison_metrics_result_datayear.months[month] = SalesItemOneData[i]
    })
    test_company_comparison_metrics_result.data.push(test_company_comparison_metrics_result_datayear)

    Object.keys(test_company_comparison_metrics_variabelExpense_datayear.months).forEach((month, i) => {
        test_company_comparison_metrics_variabelExpense_datayear.months[month] = AdvertisingData[i]
    })
    test_company_comparison_metrics_variableExpense.data.push(test_company_comparison_metrics_variabelExpense_datayear)

    Object.keys(test_company_comparison_metrics_fastExpense_datayear.months).forEach((month, i) => {
        test_company_comparison_metrics_fastExpense_datayear.months[month] = SubscriptionsData[i]
    })
    test_company_comparison_metrics_fastExpense.data.push(test_company_comparison_metrics_fastExpense_datayear)

    Object.keys(test_company_comparison_metrics_overwrite_datayear.months).forEach((month, i) => {
        test_company_comparison_metrics_overwrite_datayear.months[month] = overwriteData2[i]
    })
    test_company_comparison_metrics_overwrite.data.push(test_company_comparison_metrics_overwrite_datayear)

    test_company_comparison.result.revenue["salesItemOne"] = test_company_comparison_metrics_result
    test_company_comparison.result.expense["Advertising"] = test_company_comparison_metrics_variableExpense
    test_company_comparison.result.expense["Subscriptions"] = test_company_comparison_metrics_fastExpense
    test_company_comparison.result.revenue["overwrite"] = test_company_comparison_metrics_overwrite

    //Call the function with the test data and test company
    CSVObjectCreator(text_test, test_company, 'result')

    //Check if undercategories have been inserted correctly into results overcategory
    expect(test_company.result.revenue["salesItemOne"].name).toBe(test_company_comparison.result.revenue["salesItemOne"].name)
    expect(test_company.result.expense["Advertising"].name).toBe(test_company_comparison.result.expense["Advertising"].name)
    expect(test_company.result.expense["Subscriptions"].name).toBe(test_company_comparison.result.expense["Subscriptions"].name)

    //Test if undercategory data has been inserted correctly
    Object.keys(test_company.result.revenue["salesItemOne"].data[0].months).forEach(month => {
        expect(
            test_company.result.revenue["salesItemOne"].data[0].months[month]
        ).toBe(
            test_company_comparison.result.revenue["salesItemOne"].data[0].months[month]
        )
    })
    Object.keys(test_company.result.expense["Advertising"].data[0].months).forEach(month => {
        expect(
            test_company.result.expense["Advertising"].data[0].months[month]
        ).toBe(
            test_company_comparison.result.expense["Advertising"].data[0].months[month]
        )
    })
    Object.keys(test_company.result.expense["Subscriptions"].data[0].months).forEach(month => {
        expect(
            test_company.result.expense["Subscriptions"].data[0].months[month]
        ).toBe(
            test_company_comparison.result.expense["Subscriptions"].data[0].months[month]
        )
    })

    console.log("New undercategory insertion test passed!")

    //Check if already existing undercategory has been correctly overwritten
    Object.keys(test_company.result.revenue["overwrite"].data[0].months).forEach(month => {
        expect(
            test_company.result.revenue["overwrite"].data[0].months[month]
        ).toBe(
            test_company_comparison.result.revenue["overwrite"].data[0].months[month]
        )
    })

    console.log("Existing undercategorydata overwrite test passed!")

})