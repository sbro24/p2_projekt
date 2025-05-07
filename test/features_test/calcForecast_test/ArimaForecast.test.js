const ARIMA = require('arima')

function read_from_database()

function format_data()

function write_to_database()

function get_q()

function get_d()

function get_p()

function calculate_forecast(parameters=[], data, steps){
    const arima = new ARIMA(parameters).train(data)
    const [prediction, errors] = arima.predict(steps)
}


