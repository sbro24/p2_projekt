import {
    CalcRSS,
    CalcForecastVariance,
    FlatForecast,
    CalcAIC,
    CalcAICc,
    SelectOrder,
    Model,
    Forecast} from '../../../src/features/calcForecast/ArimaForecast.js'

const exponentialData = Array.from({ length: 12 }, (_, i) => Math.pow(2, i));
const linearData = Array.from({ length: 12 }, (_, i) => i * 2);
const seasonalData = Array.from({ length: 12 }, (_, i) => 10 + 5 * Math.sin((2 * Math.PI * i) / 12));
const nonSeasonalData = Array.from({ length: 12 }, (_, i) => i * 3 + 5);
const whiteNoiseData = Array.from({ length: 12 }, () => Math.random() * 2 - 1);
const stationaryData = Array.from({ length: 12 }, () => 5);
const nonStationaryData = Array.from({ length: 12 }, (_, i) => i * 2 + Math.random() * 5);

const dataCompanySeasonal = [96000	,123000	,236000	,81600	,28800	,21000	,47600	,
    17600	,11800	,69600	,107000	,163500	,117600	,126000	,166000	,84800	,33900	,
    19800	,42400	,22600	,8800	,73600	,98000	,127500	,97200	,126000	,200000	,
    74400	,24900	,23200	,36800	,16800	,11700	,95200	,102000	,172500	,104400	,
    172500	,218000	,82400	,26700	,21400	,33200	,20400	,8500	,92000	,99000	,
    168000	,108000	,135000	,208000	,78400	,30600	,17400	,44800	,17200	,10700	,
    95200	,119000	,166500
]


    //const quadraticData = Array.from({ length: 12 }, (_, i) => i * i);
    //const logarithmicData = Array.from({ length: 12 }, (_, i) => Math.log(i + 1));
    //const cubicData = Array.from({ length: 12 }, (_, i) => i * i * i);
    //const stepData = Array.from({ length: 12 }, (_, i) => (i < 6 ? 10 : 20));
    //const spikeData = Array.from({ length: 12 }, (_, i) => (i === 6 ? 100 : 10));
    //const dampedTrendData = Array.from({ length: 12 }, (_, i) => i * 2 * Math.exp(-i / 5));
    //const sinusoidalTrendData = Array.from({ length: 12 }, (_, i) => i * 2 + Math.sin(i));


//const forecastHandler = new Forecast() // Create a forecast handler
const forecastHandler = SelectOrder(dataCompanySeasonal)
console.log("Best Forecast: ", forecastHandler.getBestModel()) // Log the best ARIMA model
console.log("Best Model: ", forecastHandler.getBestOrder()) // Log the best ARIMA model
console.log("Best AIC Score: ", forecastHandler.getBestAIC()) // Log the best ARIMA model



