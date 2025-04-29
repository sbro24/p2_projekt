const ARIMA = require('arima')

class forecast {
    constructor(model) {
    class model {
        constructor(data, order, AIC) {
            this.data = data // The financial data given
            this.order = order // The order of the ARIMA model
            this.AIC = AIC // The AIC of the ARIMA model
        }
    } 
    }
}

// Test data
const data = [
    102.3, 101.7, 103.5, 104.1, 105.6, 106.2, 107.0, 108.5, 109.8, 111.1, 110.5, 112.0,
    113.4, 114.0, 113.2, 114.9, 115.7, 117.3, 118.1, 119.0, 118.6, 120.4, 121.7, 123.3,
    122.8, 124.6, 125.0, 126.5, 127.3, 128.0, 129.1, 130.5, 132.2, 131.8, 133.0, 134.4,
    135.1, 136.6, 137.3, 136.8, 138.2, 139.9, 141.0, 140.4, 142.1, 143.5, 144.3, 145.6
  ];   

function ReadFromDatabase()

function FormatData()

function WriteToDatabase()

function Get_d()

/** Calculates the residual sum of squares (RSS), to be used by the AIC
    @param {data = the financial data given}
    @param {forecast = the predicted values from the model}
    Output: rss = the residual sum of squares (RSS)
*/
function CalcRSS(data, forecast) { // Calculate the residual sum of squares (RSS)
    const recentData = data.slice(data.length - forecast.length) // Get the most recent data points to compare with the forecast
    const rss = data.reduce((sum, dataValue, i) => {
        const residual = dataValue - recentData[i]; // Calculate the residual for each observation
        return sum + (residual)**2; // Calculates the residual sum of squares (RSS)
    }, 0) // 0 is the start value of the sum
        
    return rss;
}

/**  Calculates the (AIC) for parameter selection 
    @param {data = the financial data given}
    @param {config = the order of the ARIMA model}
    @param {forecast = the predicted values from the model}
    Output: AIC of the given ARIMA model
*/
function CalcAIC(data, config, forecast) { // Calculate the AIC for the given ARIMA model
    const n = data.slice(data.length - forecast.length) // Number of observations used for RSS
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



function SelectOrder(data) {
    const d = Get_d(data) // Call the function to get the differencing order
    for (let c = 0; c <= 1; c++) { // Loop through, to check if the constant should be included
        for (let p = 0; p <= 5; p++) { // Loop through the AR orders
            for (let q = 0; q <= 5; q++) { // Loop through the MA orders
                const bestAIC = Infinity // Initialize the best AIC to infinity
                let bestOrder = [] // Initialize the best model
                let config; // Initialize config variable
                    if (c === 0) {
                        config = { p, d, q, c: false} // Sets the order of the ARIMA model to the current parameters
                    } else {
                        config = { p, d, q, c: true} // Sets the order of the ARIMA model to the current parameters and a constant
                    }    

                const arima = new ARIMA(config).train(data) // Create a new ARIMA model using the config
                const testForecast = arima.predict(12) // Predict the next 12 months using the ARIMA model
                const aic = CalcAIC(data, config, testForecast) // calculate the AIC of the current ARIMA model
                        
                    if (aic < bestAIC) { // If the AIC is lower than the best AIC found so far
                        bestAIC = aic // Update the best AIC
                        bestOrder = [p, d, q] // Update the best model parameters
                    }
            }
        }
    }
    return bestOrder;  
}

function CalculateForecast(order, data) {
    const arima = new ARIMA(order).train(data)
    const [prediction, errors] = arima.predict(12)
}

CalculateForecast(config,)
