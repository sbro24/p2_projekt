import {
    SelectOrder,
} from './ArimaForecast.js'

const data = [/*Get from server/JSON*/ ] 

const forecast = SelectOrder(data)
console.log("Best company ARIMA model: ", forecast.getBestModel()) // Log the best ARIMA model */
/*
SelectOrder(dataCompanySeasonal)
console.log("Best seasonal ARIMA model: ", forecastHandler.getBestModel()) // Log the best ARIMA model
*/
/*
SelectOrder(dataCompanyLinearGrowth)
console.log("Best linear growth ARIMA model: ", forecastHandler.getBestModel()) // Log the best ARIMA model
*/
    