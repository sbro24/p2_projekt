const ARIMA = require('arima')

function read_from_database()

function format_data()

function write_to_database()

function get_d()

function calcAIC() {
let observed = [3, 5, 7, 9, 2]

let predicted = [3.5, 4.5, 6.5, 9.5, 2.5]

    function get_p()

    function get_q()
}



function calculate_forecast(parameters=[], data, steps){
    const arima = new ARIMA(parameters).train(data)
    const [prediction, errors] = arima.predict(steps)
}


