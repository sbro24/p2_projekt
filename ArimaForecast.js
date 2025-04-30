import ARIMA from 'arima' // Import the ARIMA library

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
    }
    addModel(model) {
        this.models.push(model) // Add a model to the array
    }
    setBestModel(model) {
        this.bestOrder = model // Set the best ARIMA model
    }
    setBestOrder(order) {
        this.bestOrder = order // Set the best order of the ARIMA model
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
    
}

const forecastHandler = new Forecast() // Create a forecast handler

// Test data
const data = [
    102, 98, 101, 97, 103, 100, 99, 98, 101, 100, 102, 99,
    101, 100, 98, 97, 99, 100, 101, 102, 98, 97, 99, 100,
    101, 99, 98, 100, 102, 101, 100, 99, 101, 100, 98, 97,
    100, 101, 102, 98, 99, 100, 98, 101, 100, 99, 101, 100
  ];   



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

/**  Calculates the (AIC) for parameter selection 
    @param {data = the time series data given}
    @param {config = the order of the ARIMA model}
    @param {forecast = the predicted values from the model}
    @returns {AIC of the given ARIMA model}
*/
function CalcAIC(data, config, forecast) { // Calculate the AIC for the given ARIMA model
    const n = forecast.length // Number of observations used for RSS
    const rss = CalcRSS(data, forecast) // Call the function to calculate RSS
    let k = config.p + config.q  // the amount of parameters in the model
        if (config.c) { // If a constant is included in the model, add 1 to k
            k += 1
        }
    const sigmaSquared = rss / n // Sigma squared is the residual variance
    const logLikelihood = -(n / 2) * (Math.log(2 * Math.PI)) -(n / 2) * (Math.log(sigmaSquared)) -(1 / (2 * sigmaSquared)) * rss // Calculates the log-likelihood
    const AIC = -2 * logLikelihood + 2 * k // Calculates the AIC
    return AIC;
}

/** Selectes the best ARIMA model based on the AIC, and stores all the tested models in 
    @param {data = the time series data given} }
    @returns {bestModel.order = The best ARIMA model order}
 */
function SelectOrder(data) {
    // const d = 0 // Get_d(data) // Call the function to get the differencing order
    let bestModel = null // Initialize the best model to null
    let bestAIC = Infinity // Initialize the best AIC to infinity
    for (let c = 0; c <= 1; c++) { // Loop through, to check if the constant should be included
        for (let d = 0; d <= 2; d++) { // Loop through the differencing orders
            for (let p = 0; p <= 5; p++) { // Loop through the AR orders
                for (let q = 0; q <= 5; q++) { // Loop through the MA orders
                    if (p == 0 && q == 0) { // If both p and q are 0, skip this iteration
                        continue
                    }
                    if (d > 0 && c === 1) { // If d > 0 and c = 1, skip this iteration
                        continue
                    }    
                    
                    let config // Initialize config variable
                        config = {p, d, q, verbose: false, constant: c === 1} // Sets the order of the ARIMA model to the current parameters and a constant if c === 1
                    try {
                        const arima = new ARIMA(config).train(data) // Create a new ARIMA model using the config
                        const testForecast = arima.predict(12) // Predict the next 12 months using the ARIMA model
                        const aic = CalcAIC(data, config, testForecast) // calculate the AIC of the current ARIMA model
                        const model = new Model(data, config, aic, testForecast) // Create a new model object
                        
                        forecastHandler.addModel(model) // Add the model to the forecast class

                        if (aic < bestAIC) { // If the AIC is lower than the best AIC found so far
                            bestAIC = aic // Update the best AIC
                            bestModel = model // Update the best model parameters
                        }
                    } catch (error) {
                        console.warn(`Skipping config [${p}, ${d}, ${q}, ${c === 1 ? 'with constant' : 'no constant'}]: due to non-stationary AR part.`, error.message)
                        continue
                    }    
                }
            }
        }   
    }
    if (bestModel) { // If a best model was found
        forecastHandler.setBestModel(bestModel) // Set the best model in the forecast handler;
        forecastHandler.setBestOrder([bestModel.order.p, bestModel.order.d, bestModel.order.q, bestModel.order.c]) // Set the best order in the forecast handler
        return bestModel.order;  
    } else {
        throw new Error("No ARIMA model found") // If no model was found, throw an error
    }  
}
SelectOrder(data)

console.log("Best model", forecastHandler.getBestModel()) // Print the best model parameters
console.log("Best order", forecastHandler.getBestOrder()) // Print the best order of the model
console.log("Best AIC", forecastHandler.getBestModel().AIC) // Print the AIC of the best model
console.log("Best prediction", forecastHandler.getBestModel().prediction) // Print the predicted values of the best model
for (let i = 0; i < forecastHandler.getAllModels().length; i++) { // Loop through all models in the forecast handler
    console.log("Current model", forecastHandler.getAllModels()[i]) // Print the model parameters
    console.log("Current order", forecastHandler.getAllModels()[i].order) // Print the AIC of the model
    console.log("Current AIC", forecastHandler.getAllModels()[i].AIC) // Print the AIC of the model
    console.log("Current prediction", forecastHandler.getAllModels()[i].prediction) // Print the predicted values of the model
}