const ARIMA = require('arima')

function ReadFromDatabase()

function FormatData()

function WriteToDatabase()

function Get_d()

/** Calculates the residual sum of squares (RSS) for the AIC
    inputs:
    data = the data used to fit the model
    predicted = the predicted values from the model
    Output:
    rss = the residual sum of squares (RSS)
*/
function CalcRSS(data, predicted) { 
    data = [3, 5, 7, 9, 2] // Example data values
    predicted = [3.5, 4.5, 6.5, 9.5, 2.5] // Example predicted valuess

    const mean = data.reduce((sum, value) => sum + value, 0) / data.length 
    const rss = observed.reduce((sum, dataValue, i) => {
        const residual = dataValue - predicted[i]; // Calculate the residual for each observation
        return sum + (residual)**2; // Calculates the residual sum of squares (RSS)
    }, 0) // 0 is the start value of the sum
        
    return rss;
}

/**  Calculates the (AIC) for parameter selection 
    inputs:
    obs = All of the observed months of data
    k = number of parameters in the model
    Output: AIC of the given ARIMA model
*/
function CalcAIC(obs, k) { 
    const observed = obs.length
    const rss = CalcRSS() // Call the function to calculate RSS
    const sigmaSquared = rss /  // sigma squared is the residual variance
    const logLikelihood = -(n / 2) * (Math.log(2 * Math.PI)) -(n / 2) * (Math.log(sigmaSquared)) -(1 / (2 * sigmaSquared)) * rss // Calculates the log-likelihood
    const AIC = -2 * logLikelihood + 2 * k // Calculates the AIC
    return AIC;
}

function SelectBestModel(data, AIC) {
    
}

function Get_p()

function Get_q()


function CalculateForecast(parameters=[], data, steps) {

    const arima = new ARIMA(parameters).train(data)
    const [prediction, errors] = arima.predict(steps)
}


