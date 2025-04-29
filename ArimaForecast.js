const ARIMA = require('arima')

data = [5, 3, 7, 2, 7, 4, 6, 8, 4, 9] // Test data

function ReadFromDatabase()

function FormatData()

function WriteToDatabase()

function Get_d()

/** Calculates the residual sum of squares (RSS), to be used by the AIC
    @param {data = the financial data given}
    @param {predicted = the predicted values from the model}
    Output: rss = the residual sum of squares (RSS)
*/
function CalcRSS(data, predicted) { // Calculate the residual sum of squares (RSS)
    const rss = data.reduce((sum, dataValue, i) => {
        const residual = dataValue - predicted[i]; // Calculate the residual for each observation
        return sum + (residual)**2; // Calculates the residual sum of squares (RSS)
    }, 0) // 0 is the start value of the sum
        
    return rss;
}

/**  Calculates the (AIC) for parameter selection 
    @param {data = the financial data given}
    @param {p = the AR parameter}
    @param {q = the MA parameter}
    @param {c = the constant, if included in the model}
    Output: AIC of the given ARIMA model
*/
function CalcAIC(config, data) { 
    const n = data.length // Total number of observations
    const rss = CalcRSS(data) // Call the function to calculate RSS
    let k = config.p + config.q  // the amount of parameters in the model
        if (config.c) { // If a constant is included in the model, add 1 to k
            k += 1
        }
    const sigmaSquared = rss / n // Sigma squared is the residual variance
    const logLikelihood = -(n / 2) * (Math.log(2 * Math.PI)) -(n / 2) * (Math.log(sigmaSquared)) -(1 / (2 * sigmaSquared)) * rss // Calculates the log-likelihood
    const AIC = -2 * logLikelihood + 2 * k // Calculates the AIC
    return AIC;
}



function SelectBestModel(data) {
    const d = Get_d(data) // Call the function to get the differencing order
    for (let c = 0; c <= 1; c++) { // Loop through, to check if the constant should be included
        for (let p = 0; p <= 5; p++) { // Loop through the AR parameters
            for (let q = 0; q <= 5; q++) { // Loop through the MA parameters
                const bestAIC = Infinity // Initialize the best AIC to infinity
                let bestModel = [] // Initialize the best model parameters'
                let config; // Initialize config variable
                if (c === 0) {
                    config = { p, d, q, c: false} // Sets the order of the ARIMA model to the current parameters
                } else {
                    config = { p, d, q, c: true} // Sets the order of ARIMA model to the current parameters and a constant
                }    
                const ARIMA = new ARIMA(config).train(data) // Create a new ARIMA model using the config
                const forecast = ARIMA.predict(data.length) // Predict the next value using the ARIMA model
                const aic = CalcAIC(forecast, config, data) // 
                    
                    if (aic < bestAIC) { // If the AIC is lower than the best AIC found so far
                        bestAIC = aic // Update the best AIC
                        bestModel = [p, d, q] // Update the best model parameters
                    }
            }
        }
    } 
}

function Get_p()

function Get_q()


function CalculateForecast(parameters=[], data, steps) {
    const arima = new ARIMA(parameters).train(data)
    const [prediction, errors] = arima.predict(steps)
}


