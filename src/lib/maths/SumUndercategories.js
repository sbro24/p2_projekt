import {Company, CompanyData, FinancialMetric, FinancialYear} from '../useDatabase/constructors.js'

function SumUndercategories (company, Year){

    Object.keys(company.result).forEach(key => {
        console.log(key)
        OvercategoryFinder (key, company, Year)
    })

}

function OvercategoryFinder (category, company, Year) {

    if (category === "revenue") {
        OvercategoryRunner ("revenue", company, Year)
    } else {
        OvercategoryRunner("Variable expenses", company, Year)
        OvercategoryRunner("Faste expenses", company, Year)
    }

}

function OvercategoryRunner (overCategory, company, Year) {

    let omsætningYear = new FinancialYear(Year)

    let metrics = {};
    
    metrics[`${overCategory} sum`] = new FinancialMetric(`${overCategory} sum`);

    if (overCategory === "revenue") {
        Object.keys(company.result.revenue).forEach(key => {
            const revenueItem = company.result.revenue[key];
            if (revenueItem.name === 'revenue sum' || revenueItem.name === 'Oms. i alt') {
                return;
            } else {
            revenueItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        omsætningYear.months[month] += Number(index.months[month]);
                    })
                }
            })
        }
        })
    } else if (overCategory === "Variable expenses") {
        Object.keys(company.result.expense).forEach(key => {
            const revenueItem = company.result.expense[key];
            if (revenueItem.name === 'Variable expenses sum' || revenueItem.name === 'Variable omkost. i alt') {
                return;
            } else {
                if (revenueItem.characteristics === "Variabel") {
                    revenueItem.data.forEach(index => {
                        if (Number(index.year) === Number(Year)) {
                            Object.keys(index.months).forEach(month => {
                                omsætningYear.months[month] += Number(index.months[month]);
                            })
                        }
                    })
                }
            }
        })
    } else {
        Object.keys(company.result.expense).forEach(key => {
            const revenueItem = company.result.expense[key];
            if (revenueItem.name === 'Faste expenses sum' || revenueItem.name === 'Faste omkost. i alt') {
                return;
            } else {
                if (revenueItem.characteristics === "Fast") {
                    revenueItem.data.forEach(index => {
                        if (Number(index.year) === Number(Year)) {
                            Object.keys(index.months).forEach(month => {
                                omsætningYear.months[month] += Number(index.months[month]);
                            })
                        }
                    })
                }
            }
        })
    }    

    metrics[`${overCategory} sum`].data.push(omsætningYear)

    if (overCategory === "revenue") {
        if (!company.result.revenue[metrics[`${overCategory} sum`].name]) {
            company.result.revenue[metrics[`${overCategory} sum`].name] = metrics[`${overCategory} sum`];
        } else {
            company.result.revenue[metrics[`${overCategory} sum`].name].data.forEach((index, i) => {
                if (Number(index.year) === Number(Year)) {
                    company.result.revenue[metrics[`${overCategory} sum`].name].data[i] = omsætningYear;
                    return;
                }
            })
            company.result.revenue[metrics[`${overCategory} sum`].name].data.forEach((index, i) => {
                if (Number(index.year) > Number(Year)) {
                    company.result.revenue[metrics[`${overCategory} sum`].name].data[i-1].push(omsætningYear);
                    return;
                }
            })
        }
    } else {
        if (!company.result.expense[metrics[`${overCategory} sum`].name]) {
            company.result.expense[metrics[`${overCategory} sum`].name] = metrics[`${overCategory} sum`];
        } else {
            company.result.expense[metrics[`${overCategory} sum`].name].data.forEach((index, i) => {
                if (Number(index.year) === Number(Year)) {
                    company.result.expense[metrics[`${overCategory} sum`].name].data[i] = omsætningYear;
                    return;
                }
            })
            company.result.expense[metrics[`${overCategory} sum`].name].data.forEach((index, i) => {
                if (Number(index.year) > Number(Year)) {
                    company.result.expense[metrics[`${overCategory} sum`].name].data[i-1].push(omsætningYear);
                    return;
                }
            })
        }
    }

    console.log(company.result.revenue[metrics[`${overCategory} sum`].name])
    console.log(company.result.expense[metrics[`${overCategory} sum`].name])
    console.log(company.result.revenue)
}

function SumUndercategories1 (company, Year, name){

    if (name === "omsætning") {
        return OvercategoryFinder1("revenue", company, Year)
    } else if (name === "omkostning") {
        return OvercategoryFinder1("expense", company, Year)
    }

}

function OvercategoryFinder1 (category, company, Year) {

    if (category === "revenue") {
        return OvercategoryRunner1 ("revenue", company, Year)
    } else {
        let hest = {}
        hest["Variable expenses"] = OvercategoryRunner1("Variable expenses", company, Year)
        hest["Faste expenses"] = OvercategoryRunner1("Faste expenses", company, Year)
        return hest;
    }

}

function OvercategoryRunner1 (overCategory, company, Year) {

    let omsætningYear = new FinancialYear(Year)

    let metrics = {};
    
    metrics[`${overCategory} sum`] = new FinancialMetric(`${overCategory} sum`);

    if (overCategory === "revenue") {
        Object.keys(company.result.revenue).forEach(key => {
            const revenueItem = company.result.revenue[key];
            if (revenueItem.name === 'revenue sum' || revenueItem.name === 'Oms. i alt') {
                return;
            } else {
            revenueItem.data.forEach(index => {
                if (Number(index.year) === Number(Year)) {
                    Object.keys(index.months).forEach(month => {
                        omsætningYear.months[month] += Number(index.months[month]);
                    })
                }
            })
        }
        })
    } else if (overCategory === "Variable expenses") {
        Object.keys(company.result.expense).forEach(key => {
            const revenueItem = company.result.expense[key];
            if (revenueItem.name === 'Variable expenses sum' || revenueItem.name === 'Variable omkost. i alt') {
                return;
            } else {
                if (revenueItem.characteristics === "Variabel") {
                    revenueItem.data.forEach(index => {
                        if (Number(index.year) === Number(Year)) {
                            Object.keys(index.months).forEach(month => {
                                omsætningYear.months[month] += Number(index.months[month]);
                            })
                        }
                    })
                }
            }
        })
    } else {
        Object.keys(company.result.expense).forEach(key => {
            const revenueItem = company.result.expense[key];
            if (revenueItem.name === 'Faste expenses sum' || revenueItem.name === 'Faste omkost. i alt') {
                return;
            } else {
                if (revenueItem.characteristics === "Fast") {
                    revenueItem.data.forEach(index => {
                        if (Number(index.year) === Number(Year)) {
                            Object.keys(index.months).forEach(month => {
                                omsætningYear.months[month] += Number(index.months[month]);
                            })
                        }
                    })
                }
            }
        })
    }    

    metrics[`${overCategory} sum`].data.push(omsætningYear);
    return metrics[`${overCategory} sum`]
}

export {SumUndercategories, OvercategoryFinder, OvercategoryRunner, SumUndercategories1, OvercategoryFinder1, OvercategoryRunner1}