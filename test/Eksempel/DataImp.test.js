/**
 * @jest-environment jsdom
 */

const dataImporterFunctions = require('../assets/js/dataImporter.js')

test('Does UpdateCompanyName function work correctly', () => {
    let companyNameInput = 'Hest'
    let company = {name: ""}
    dataImporterFunctions.updateCompanyName(company,companyNameInput)
    expect(company.name).toBe('Hest')
})

test('Does updateCompanyDataFromTables function work correctly', () => {
    let company = {revenue: 3, expenses: 3}
    let revenue = 10
    let expense = 12
    dataImporterFunctions.updateCompanyDataFromTables(company, revenue, expense);
    expect(company.revenue).toBe(10)
    expect(company.expenses).toBe(12)
})