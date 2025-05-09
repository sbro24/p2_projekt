import {RunForecast, SelectOrder} from './ArimaForecast.js'

import { GetCompaniesArray, AddNewCompany, UpdateCompanyName, UpdateSessionToken, GetFinancialMetricArray, UpdateCompanyObject, GetCompanyObject } from '../../lib/useDatabase/handle-data.js'


async function getMetric () {
    let companyObject = await GetCompanyObject("Test af add company")

    let financialMetricArray = [];

    const financialMetricForecast = companyObject["result"]["revenue"]["sales"].data;

    financialMetricForecast.forEach(yearData => {
        // Append the months of each year to the financialMetricArray
        financialMetricArray.push(...Object.values(yearData.months)); //uses the spread operator to push them into the array as indiviual elements
    });

    return financialMetricArray;
}

async function calcForecast(){
    let array = await getMetric();
    console.log(array);
    let forecastArray = RunForecast(array);
    console.log(forecastArray);
}

calcForecast();