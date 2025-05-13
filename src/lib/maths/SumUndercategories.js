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
        OvercategoryRunner("Variable omkostninger", company, Year)
        OvercategoryRunner("Faste Omkostninger", company, Year)
    }

}

function OvercategoryRunner (overCategory, company, Year) {

    let omsætningYear = new FinancialYear(Year)

    let metrics = {};
    
    metrics[`${overCategory} Sum`] = new FinancialMetric(`${overCategory} Sum`);

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
    } else if (overCategory === "Variable omkostninger") {
        Object.keys(company.result.expense).forEach(key => {
            const revenueItem = company.result.expense[key];
            if (revenueItem.name === 'Variable omkostninger sum' || revenueItem.name === 'Variable omkost. i alt') {
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
            if (revenueItem.name === 'Faste omkostninger sum' || revenueItem.name === 'Faste omkost. i alt') {
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

    metrics[`${overCategory} Sum`].data.push(omsætningYear)
    console.log(overCategory)

    if (overCategory === "revenue") {
        if (!company.result.revenue[metrics[`${overCategory} Sum`].name]) {
            company.result.revenue[metrics[`${overCategory} Sum`].name] = metrics[`${overCategory} Sum`];
        } else {
            company.result.revenue[metrics[`${overCategory} Sum`].name].data.forEach((index, i) => {
                if (Number(index.year) === Number(Year)) {
                    company.result.revenue[metrics[`${overCategory} Sum`].name].data[i] = omsætningYear;
                    return;
                }
            })
            company.result.revenue[metrics[`${overCategory} Sum`].name].data.forEach((index, i) => {
                if (Number(index.year) > Number(Year)) {
                    company.result.revenue[metrics[`${overCategory} Sum`].name].data[i-1].push(omsætningYear);
                    return;
                }
            })
        }
    } else {
        if (!company.result.expense[metrics[`${overCategory} Sum`].name]) {
            company.result.expense[metrics[`${overCategory} Sum`].name] = metrics[`${overCategory} Sum`];
        } else {
            company.result.expense[metrics[`${overCategory} Sum`].name].data.forEach((index, i) => {
                if (Number(index.year) === Number(Year)) {
                    company.result.expense[metrics[`${overCategory} Sum`].name].data[i] = omsætningYear;
                    return;
                }
            })
            company.result.expense[metrics[`${overCategory} Sum`].name].data.forEach((index, i) => {
                if (Number(index.year) > Number(Year)) {
                    company.result.expense[metrics[`${overCategory} Sum`].name].data[i-1].push(omsætningYear);
                    return;
                }
            })
        }
    }

    console.log(omsætningYear)
    console.log(company.result.revenue[metrics[`${overCategory} Sum`].name])
    console.log(company.result.expense[metrics[`${overCategory} Sum`].name])
    console.log(company.result.expense)
}

export {SumUndercategories, OvercategoryFinder, OvercategoryRunner}