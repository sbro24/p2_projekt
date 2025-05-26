export {
    CalcRSS,
    CalcForecastVariance,
    FlatForecast,
    CalcAIC,
    CalcAICc,
    SelectOrder,
    RunForecast,
    Model,
    Forecast
};
import { exec as execCallback } from 'child_process'; // Import the exec function from the child_process module
import fs from 'fs'; // Import the fs module to handle file operations
import util from 'util';   // For promisify
const exec = util.promisify(execCallback); // Create a Promise-based version of exec
import ARIMA from 'arima' // Import the ARIMA library
import { GetFinancialDataById, UpdateCompanyObject } from '../../lib/useDatabase/handle-data.js';
import { FinancialMetric, FinancialYear } from '../../lib/useDatabase/constructors.js';
//import {jsonReadFile} from 'src/lib/useDatabase/handle-json.js'
//const jsonFilePath = 'src/data/data.json' // Path to the JSON file

class Model { // Class to construct an ARIMA model
    constructor(data, order, AIC, prediction) {
        this.data = data // The time series data given
        this.order = order // The order of the ARIMA model: {p, d, q, c}
        this.AIC = AIC // The AIC of the ARIMA model
        this.prediction = prediction // The predicted values from the model
    }
}

class Forecast { // Class to store the ARIMA models
    constructor() {
        this.models = [] // Array to store the models
        this.bestModel = null // The best ARIMA model found
        this.bestOrder = null // The best order of the ARIMA model found
        this.bestAIC = Infinity // The best AIC of the ARIMA model found
    }
    addModel(model) {
        this.models.push(model) // Add a model to the array
    }
    setBestModel(model) {
        this.bestModel = model // Set the best ARIMA model
    }
    setBestOrder(order) {
        this.bestOrder = order // Set the best order of the ARIMA model
    }
    setBestAIC(AIC) {
        this.bestAIC = AIC // Set the best AIC of the ARIMA model
    }
    getAllModels() {
        return this.models // Return all models, so they are accessible for later use
    }
    getBestModel() {
        return this.bestModel // Return the best ARIMA model, so it is accessible for later use
    }
    getBestOrder() {
        return this.bestOrder // Return the best order of the ARIMA model, so it is accessible for later use
    }
    getBestAIC() {
        return this.bestAIC // Return the best AIC of the ARIMA model, so it is accessible for later use
    }
}

/** Calculates the residual sum of squares (RSS), to be used by the AIC
    @param {data = the financial data given}
    @param {forecast = the predicted values from the model}
    Output: rss = the residual sum of squares (RSS)
*/
function CalcRSS(data, forecast) { // Calculate the residual sum of squares (RSS)
    const recentData = data.slice(-forecast.length) // Get the most recent data points to compare with the forecast
    const rss = recentData.reduce((sum, dataValue, i) => {
        const residual = dataValue - forecast[i]; // Calculate the residual for each observation
        return sum + (residual)**2; // Calculates the residual sum of squares (RSS)
    }, 0) // 0 is the start value of the sum 
    return rss;
}

/** Calculates the variance of the predicted values, to be used by flatForecast
    @param {forecast = the predicted values from the model}
 */
function CalcForecastVariance(forecast) { // Calculate the variance of the data
    const n = forecast.length // Number of forecasted values
    const mean = forecast.reduce((sum, value) => sum + value, 0) / n // Calculate the mean of the data
    const variance = forecast.reduce((sum, value) => sum + (value - mean) **2, 0) / n; // Calculate the variance of the data
    return variance;
}
/** Checks if the forecast is flat, i.e. all values are the same
    @param {variance = the variance of the data}
*/
function FlatForecast(forecast) {
    const tolerance = 1e-2 // Set a tolerance for variation in forecast values
    const variance = CalcForecastVariance(forecast) // Call the function to calculate the variance of the forecast
    return variance < tolerance // If variance is lower than the tolerance, return true
}

/**  Calculates the AIC for parameter selection 
    @param {data = the time series data given}
    @param {config = the order of the ARIMA model}
    @param {forecast = the predicted values from the model}
    @returns {AIC of the given ARIMA model}
*/
function CalcAIC(data, config, forecast) { // Calculate the AIC for the given ARIMA model
    const n = forecast.length // Number of observations used for RSS
    const rss = CalcRSS(data, forecast) // Call the function to calculate RSS
    const sigmaSquared = rss / n // Sigma squared is the residual variance
    if (FlatForecast(forecast)) { // Check if the forecast is flat
        return Infinity; // If the forecast is flat, return infinity (the worst AIC possible)
    }
    let k = config.p + config.q  // the amount of parameters in the model
        if (config.constant) { // If a constant is included in the model, add 1 to k
            k += 1
        }
    const logLikelihood = -(n / 2) * (Math.log(2 * Math.PI)) -(n / 2) * (Math.log(sigmaSquared)) // Calculates the log-likelihood
    const AIC = -2 * logLikelihood + 2 * k // Calculates the AIC
    return AIC;
}

/**  Calculates the AICc for parameter selection 
    @param {data = the time series data given}
    @param {config = the order of the ARIMA model}
    @param {forecast = the predicted values from the model}
    @returns {AICc of the given ARIMA model}
*/
function CalcAICc(data, config, forecast) { // Calculate the AICc for the given ARIMA model
    const AIC = CalcAIC(data, config, forecast) // Call the function to calculate AIC 
    const n = forecast.length // Number of observations used for RSS
    let k = config.p + config.q // the amount of parameters in the model
        if (config.constant) { // If a constant is included in the model, add 1 to k
            k += 1
    }   
    const AICc = AIC + (2 * k * (k + 1)) / (n - k - 1) // Calculates the AICc
    return AICc;
}
// calls a python script (adf_script.py) to do an adf test and determin the ARIMA parameter d
async function adf_test(data){
    let i = 0
    let fileName = './src/data/temp.json'
    while (fs.existsSync(fileName)) {
        fileName = `./src/data/temp${i}.json`
        i++
    }
    fs.writeFileSync('./src/data/temp.json', JSON.stringify(data)); // Write the data array to a file named temp.json
    await exec('python ./adf_script.py --tempfile ./src/data/temp.json') // calls the py script
    const result = JSON.parse(fs.readFileSync('./src/data/temp.json', 'utf-8')); // Read the contents of temp.json
    const d = result.d;
    //fs.unlinkSync('./src/data/temp.json'); // Delete the temp.json file
    console.log(`d: ${d}`)
    return d;
}

/** Selects the best ARIMA model based on the AIC, and stores all the tested models in 
    @param {data = the time series data given}
    @returns {bestModel.order = The best ARIMA model order}
 */
async function SelectOrder(data) {
    const forecastHandler = new Forecast() // Create a forecast handler
    let bestAICc = Infinity // Initialize the best AIC to infinity
    const minComplexity = 1;
    let d = await adf_test(data) // get the differencing order
    if (d > 2){ console.log("WHAT THE FUCK")}
    for (let c = 0; c <= 1; c++) { // Loop through, to check if the constant should be included
            for (let p = 1; p <= 5; p++) { //Æ Loop through the AR orders
                for (let q = 0; q <= 5; q++) { // Loop through the MA orders

                if (p + q <= minComplexity) { // Check if the model is too simple
                    continue; // Skip this iteration if the model is too simple
                }
                const config = {p: p, d: d, q: q, auto: false, verbose: false, constant: c === 1} // Sets the order of the ARIMA model to the current parameters and a constant if c === 1
                    
                let AICc
                const arima = new ARIMA(config).train(data) // Create a new ARIMA model using the config
                const [testForecast, errors] = arima.predict(12) // Predict the next 12 months using the ARIMA model
                AICc = CalcAICc(data, config, testForecast) // calculate the AICc of the current ARIMA model
                const model = new Model(data, config, AICc, testForecast) // Create a new model object
                forecastHandler.addModel(model) // Add the model to the forecast class          

                if (AICc < bestAICc) { // If the AIC is lower than the best AIC found so far
                    bestAICc = AICc // Update the best AIC
                    forecastHandler.setBestOrder(config)// Update the best model parameters
                    forecastHandler.setBestModel(model) // Update the best model
                    forecastHandler.setBestAIC(AICc) // Update the best AIC
                }  
            }
        }
    }   
    if (forecastHandler.bestOrder) { // If a best model was found return the forecast handler 
        return forecastHandler
    } else {
        throw new Error("No ARIMA model found") // If no model was found, throw an error
    }  
}

/** Runs the ARIMA forecast on each metric sent by the user, and saves the metric and predictions to the database
    @param {metrics = the metrics to be forecasted}
    @param {data = the financial data given}
    @returns {predictionArray = The array of metric predictions}
 */
async function RunForecast(data) {
    return new Promise(async (resolve) => {
        const predictionArray = [] // Initialize the prediction array
        const forecast = await SelectOrder(data/* get data from router */)
        let bestModel = forecast.getBestModel() // Get the best model
        predictionArray.push(bestModel.prediction) // Push the metric's best model's predictions to the prediction array
        //await database.saveForecast(bestModel.prediction) // Save the forecast to the database
        resolve(predictionArray)  // Return the array of metric predictions
    });


}

export async function InitializeForecast(id) {
    let companyData = await GetFinancialDataById(id)

    let financialDataObject = {revenue: {}, expense: {}};

    const companyRevenue = companyData.result.revenue;
    const companyExpense = companyData.result.expense;

    const CombineYears = (item) => {
        let array = [];
        item.data.forEach(year => {
            for (const monthNum in year.months) array.push(year.months[monthNum])
        })
        return array;
    }

    for (const itemNum in companyRevenue) {
        let item = companyRevenue[itemNum];
        financialDataObject.revenue[item.name] = CombineYears(item);
    }

    for (const itemNum in companyExpense) {
        let item = companyExpense[itemNum];
        financialDataObject.expense[item.name] = CombineYears(item);
    }

    companyData.forecast = { revenue: {}, expense: {} }
    
    for (const category in financialDataObject.revenue) {
        if (companyRevenue[category].characteristics === 'Fast') continue;
        let year = '2025'
        let forecastRevenue = companyData.forecast.revenue;
        let item = financialDataObject.revenue[category];
        forecastRevenue[category] = new FinancialMetric(category);
        forecastRevenue[category].data = [new FinancialYear(year)];

        let forecast = await RunForecast(item);
        let i = 0;
        for (const month in forecastRevenue[category].data[0].months) {
            forecastRevenue[category].data[0].months[month] = forecast[0][i];
            i++
        }
        forecastRevenue[category].characteristics = companyRevenue[category].characteristics

    }

    for (const category in financialDataObject.expense) {
        if (companyExpense[category].characteristics === 'Fast') continue;
        let year = '2025'
        let forecastExpense = companyData.forecast.expense;
        let item = financialDataObject.expense[category];
        forecastExpense[category] = new FinancialMetric(category);
        forecastExpense[category].data = [new FinancialYear(year)];

        let forecast = await RunForecast(item);
        let i = 0;
        for (const month in forecastExpense[category].data[0].months) {
            forecastExpense[category].data[0].months[month] = forecast[0][i];
            i++
        }
        forecastExpense[category].characteristics = companyExpense[category].characteristics
       
    }   

    let result = {
        userId: id,
        data: companyData
    } 
    UpdateCompanyObject(result);
    console.log(result)
}
/*
console.log(RunForecast([96000	,123000	,236000	,81600	,28800	,21000	,47600	,
    17600	,11800	,69600	,107000	,163500	,117600	,126000	,166000	,84800	,33900	,
    19800	,42400	,22600	,8800	,73600	,98000	,127500	,97200	,126000	,200000	,
    74400	,24900	,23200	,36800	,16800	,11700	,95200	,102000	,172500	,104400	,
    172500	,218000	,82400	,26700	,21400	,33200	,20400	,8500	,92000	,99000	,
    168000	,108000	,135000	,208000	,78400	,30600	,17400	,44800	,17200	,10700	,
    95200	,119000	,166500
])) // Log the result to the console
 */