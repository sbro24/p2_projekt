import ARIMA from 'arima' // Import the ARIMA library

class Model { // Class to construct an ARIMA model
    constructor(data, order, AIC, prediction) {
        this.data = data // The time series data given
        this.order = order // The order of the ARIMA model: {p, d, q, c}
        this.AIC = AIC // The AIC of the ARIMA model
        this.prediction = prediction // The predicted values from the model

        // Model Averaging Values:
        this.deltaAIC = 0 // Difference in AIC between this model and the best model
        this.P = 0 // Relative Likelihood to the best model, i.e this model is P as likely to be true as the best model
        this.w = 0 // Aikaike Weight; Normalized probability that a model is the best
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

const forecastHandler = new Forecast() // Create a forecast handler

// Test data
const data = [
    248, 393, 777, 909, 320, 973, 191, 643, 41, 213, 629, 357,
    604, 164, 327, 26, 432, 393, 122, 308, 411, 198, 846, 278,
    225, 80, 397, 873, 968, 905, 433, 457, 154, 938, 370, 695,
    62, 598, 379, 986, 281, 412, 300, 305, 27, 520, 929, 384
  ];
  
const dataCompany = [555866	,174701	,458500	,323800	,30750	,456900	,194000	,
    416297	,303865	,448050	,178515	,168222	,333520	,330090	,325457	,367068	,
    327179	,247301	,340363	,553907	,361974	,242516	,124659	,223538	,108450	,
    306087	,340362	,388343	,448847	,107248	,428296	,324494	,922040]; 

const dataCompanyResult = [394335	,330600	,630237	,86555	,290790, 788550 ,
    77700	,109050	,318261	,160350	,72089	,376368	];


//function ReadFromDatabase()


//function FormatData()

//function WriteToDatabase()

//function Get_d()

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

function CalcVariance(rss, n) { // Calculate the variance of the data
    const variance = rss / (n) // Calculate the variance of the data
    return variance; // Return the variance
}
/** Checks if the forecast is flat, i.e. all values are the same
    @param {forecast = the predicted values from the model}
*/
function flatForecast(forecast, variance) {
    const tolerance = 1e-2 // Set a tolerance for variation in forecast values
    return variance < tolerance // If variance is lower than the tolerance, return true
}

/**  Calculates the (AIC) for parameter selection 
    @param {data = the time series data given}
    @param {config = the order of the ARIMA model}
    @param {forecast = the predicted values from the model}
    @returns {AIC of the given ARIMA model}
*/
function CalcAIC(data, config, forecast) { // Calculate the AIC for the given ARIMA model
    const n = data.length // Number of observations used for RSS
    const rss = CalcRSS(data, forecast) // Call the function to calculate RSS
    const sigmaSquared = CalcVariance(rss, n) // Sigma squared is the residual variance
    if (flatForecast(forecast, rss)) { // Check if the forecast is flat
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


// ############### NEW STUFF NOT TESTED ##########################
/*
function CalcDeltaAIC(bestAIC, AIC){
    return bestAIC - AIC
}

function CalcRelativeLikelihood(deltaAIC){
    return Math.exp(-deltaAIC/2)
}

function CalcAikaikeWeight(models, model){
    let sum = 0
    for (let i=0; i<=models.length; i++){
        sum = sum + models[i].P
    }
    return model.P/sum
}

// Thresholds:  (Needs more explanation)
// DeltaAIC < 4
// Aikaike Weight w > 0.1 (10%)

// Screens all created models, excluding models that fail the abovementioned tresholds

function GetBestModels(models, bestAIC){
    let bestModels = []
    let screenedModels = []

    for (let i=0; i<=models.length; i++){
        let model = models[i]
        model.deltaAIC = CalcDeltaAIC(bestAIC, model.AIC)
        if (model.deltaAIC < 4){  // deltaAIC filter
            model.P = CalcRelativeLikelihood(deltaAIC)
            screenedModels.push(model)
        }
    }
    for (let j=0; j<=screenedModels.length; j++){
        let model = screenedModels[j]
        model.w = CalcAikaikeWeight(models, model)
        if (model.w > 0.1){  // aikaike weight filter
            bestModels.push(model)
        }
    }
}


// Treats forecast.models like a matrix, calculating the average of each column
// to create an averaged result of the best models

function ModelAverage(models){
    bestModels = GetBestModels(models, bestAIC)
    let averagedForecast = []
    for (let i=0; i<=bestModels[0].data.length; i++){ // handles Column index
        for (let j=0; j<=bestModels.length; j++){ // Handles Row index
            if (averagedForecast[i] === undefined){ // handles first iteration, where the array is empty
                averagedForecast[i].push(bestModels[j].data[i])
            } else {
                averagedForecast[i] = averagedForecast[i] + bestModels[j].data[i] // calculates sum of current column
            }
        }
        averagedForecast[i] = averagedForecast[i] / bestModels[j].data.length // calculates average of current column
    }
    return averagedForecast
}   


*/

// function createConfig() // Create a config object for the ARIMA model


/** Selectes the best ARIMA model based on the AIC, and stores all the tested models in 
    @param {data = the time series data given}
    @returns {bestModel.order = The best ARIMA model order}
 */
function SelectOrder(data) {
    // const d = 0 // Get_d(data) // Call the function to get the differencing order
    let bestAIC = Infinity // Initialize the best AIC to infinity
    const minComplexity = 1;
    for (let c = 0; c <= 1; c++) { // Loop through, to check if the constant should be included
        for (let d = 0; d <= 2; d++) { // Loop through the differencing orders
            for (let p = 0; p <= 5; p++) { // Loop through the AR orders
                for (let q = 0; q <= 5; q++) { // Loop through the MA orders
                    
                    if (p + q <= minComplexity) { // Check if the model is too simple
                        continue; // Skip this iteration if the model is too simple
                    }
                    if (d > 0) { // Check if the differencing order is greater than 0
                        c = 1 // sets the constant to be included in the model
                    }
                    const config = {p: p, d: d, q: q, verbose: false, constant: c === 1} // Sets the order of the ARIMA model to the current parameters and a constant if c === 1
                        
                    const arima = new ARIMA(config).train(data) // Create a new ARIMA model using the config
                    const [testForecast, errors] = arima.predict(12) // Predict the next 12 months using the ARIMA model
                        if (flatForecast(testForecast)) { // Check if the forecast is flat
                            continue; // Skip this iteration if the forecast is flat
                        }  
                    const aic = CalcAIC(data, config, testForecast) // calculate the AIC of the current ARIMA model
                    const model = new Model(data, config, aic, testForecast) // Create a new model object
                    forecastHandler.addModel(model) // Add the model to the forecast class
                    console.log("Order", config) // Log the model to the console   
                    console.log("AIC", aic) // Log the AIC to the console
                    
                    if (aic < bestAIC) { // If the AIC is lower than the best AIC found so far
                        bestAIC = aic // Update the best AIC
                        forecastHandler.setBestOrder(config)// Update the best model parameters
                        forecastHandler.setBestModel(model) // Update the best model
                        forecastHandler.setBestAIC(aic)
                    }
                }  
            }
        }
    }   
    if (forecastHandler.bestOrder) { // If a best model was found // Set the best order in the forecast handler 
    } else {
        throw new Error("No ARIMA model found") // If no model was found, throw an error
    }  
}

SelectOrder(data)

console.log("Best ARIMA model: ", forecastHandler.getBestModel()) // Log the best ARIMA model
console.log("Best ARIMA model order: ", forecastHandler.getBestOrder()) // Log the best ARIMA model order
console.log("Best ARIMA model AIC: ", forecastHandler.getBestAIC()) // Log the best ARIMA model AIC

