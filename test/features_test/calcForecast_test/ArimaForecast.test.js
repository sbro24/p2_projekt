/*
 * @jest-environment jsdom
 */

jest.unmock('fs');
import fs from 'fs';
import path from 'path';
import {
    CalcRSS,
    CalcForecastVariance,
    FlatForecast,
    CalcAIC,
    CalcAICc,
    SelectOrder,
    Model,
    Forecast} from '../../../src/features/calcForecast/ArimaForecast.js'
import { test, expect } from '@jest/globals';
import { log } from "console";


//############### Report Handling ##################
function WriteReport(data, expected, result, model, test_case, test_result){
    const outputFilePath = path.join('./', `${test_case}.txt`);
    let outputData = `Test Passed: ${test_result} - Best Model:${JSON.stringify(model)}\n`; 
    outputData += `Test Data:\n`;
    data.forEach(item => {
        outputData += `${item}\n`;
    });
    outputData += `Expected Result:\n`;
    expected.forEach(item => {
        outputData += `${item}\n`;
    });    
    outputData += `Best Forecast:\n`;
    result.forEach(item => {
        outputData += `${item}\n`;
    });
    fs.writeFileSync(outputFilePath, outputData);
} 

//############### Test Processing ##################

// Runs the arima forecast and returns the result with the best AIC
function RunForecast(data){
    const forecastHandler = SelectOrder(data)
    const bestModel = forecastHandler.getBestModel().prediction
    const bestOrder = forecastHandler.getBestOrder();
    log(bestModel)
    log(`Best Model: p:${bestOrder['p']} d:${bestOrder['d']} q:${bestOrder['q']}`)
    return forecastHandler
}

// Evaluates the prediction compared to the expected result (Generally the last 12 points of the original data)
// And pass/fails each point according to a given x% threshold.
// if all points passes, returns true to indicate succesful test, else fails.
function CheckResult(expected, result, threshold){
    let points = 0
    const absoluteTolerance = 0.3
    for (let i=0; i<expected.length; i++){
        let upperBound = expected[i] * (1 + threshold / 100);
        let lowerBound = expected[i] * (1 - threshold / 100);
        if (result[i] <= upperBound && result[i] >= lowerBound){
            points++
        }else if(Math.abs(result[i] - expected[i]) <= absoluteTolerance){
            points++
        }
    }
    log(`${Math.round((points / expected.length) * 100)}% of forecast within threshold`);
    if(points == 12){
        return true;
    }else{
        return false;
    }
}



//############### Test Cases ##################

const threshold = 15 // x% leniency for test result
const intervals = [12,24,36,48,60] // array of lengths of data to generate. affects number of tests
let genericData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]; // data for the first case

/*
This first test is designed for external input data, and so does not generate any iterations or mutations,
simply evaluates a single forecast.
*/


// Test case desgined for generic input data

const caseGeneric = 'generic'
test('Forecast on generic data', () => {
    let expected = genericData.slice(-12);
    let forecast = RunForecast(genericData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(genericData, expected, result, model, caseGeneric, testResult)
    expect(testResult).toBe(true)
    }
)

/*
These test cases (except the first) function by generating their own data using the
"intervals" variable, with 1,..,n iterations and each nth iteration has intervals[i] datapoints.
The tests are evaluated using the CheckResult function, which uses the "threshold" variable.
*/

for (let i=0; i<intervals.length; i++){

    // Test case desgined for generated exponential data
    const caseExponential = `exponential_${intervals[i]}`
    test(`Forecast on data of exponential growth with ${intervals[i]} datapoints`, () => {
        let exponentialData = Array.from({ length: intervals[i] }, (_, i) => Math.pow(2, i));
        let expected = exponentialData.slice(-12);
        let forecast = RunForecast(exponentialData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(exponentialData, expected, result, model, caseExponential, testResult)
        expect(testResult).toBe(false)
    }   
    )

    // Test case desgined for generated data with linear growth
    const caseLineargrowth = `growth_${intervals[i]}`
    test(`Forecast on data of linear growth with ${intervals[i]} datapoints`, () => {
        let growthData = Array.from({ length: intervals[i] }, (_, i) => i * 2);
        let expected = growthData.slice(-12);
        let forecast = RunForecast(growthData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(growthData, expected, result, model, caseLineargrowth, testResult)
        expect(testResult).toBe(true)
    }
    )

    // Test case designed for generated data with linear decline
    const caseLineardecline = `decline_${intervals[i]}`
    test(`Forecast on data of linear decline with ${intervals[i]} datapoints`, () => {
        let declineData = Array.from({ length: intervals[i] }, (_, i) => intervals[i] * 2 - i * 2);
        let expected = declineData.slice(-12);
        let forecast = RunForecast(declineData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(declineData, expected, result, model, caseLineardecline, testResult)
        expect(testResult).toBe(true)
    }
    )

    // Test case desgined for generated seasonal data
    const caseSeasonal = `seasonal_${intervals[i]}`
    test(`Forecast on seasonal data with ${intervals[i]} datapoints`, () => {
        let seasonalData = Array.from({ length: intervals[i] }, (_, i) => 10 + 5 * Math.sin((2 * Math.PI * i) / 12));
        let expected = seasonalData.slice(-12);
        let forecast = RunForecast(seasonalData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(seasonalData, expected, result, model, caseSeasonal, testResult)
        expect(testResult).toBe(true)
    }
    )

    // Test case desgined for generated white noise
    const caseWhitenoise = `noise_${intervals[i]}`
    test(`Forecast on white noise with ${intervals[i]} datapoints`, () => {
        let whiteNoiseData = Array.from({ length: intervals[i] }, () => Math.random() * 2 - 1);
        let expected = whiteNoiseData.slice(-12);
        let forecast = RunForecast(whiteNoiseData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(whiteNoiseData, expected, result, model, caseWhitenoise, testResult)
        expect(testResult).toBe(false)
    }
    )

    // Test case desgined for generated logarithmic data
    const caseLogarithmic = `log_${intervals[i]}`
    test(`Forecast on logarithmic data with ${intervals[i]} datapoints`, () => {
        let logarithmicData = Array.from({ length: intervals[i] }, (_, i) => Math.log(i + 1));
        let expected = logarithmicData.slice(-12);
        let forecast = RunForecast(logarithmicData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(logarithmicData, expected, result, model, caseLogarithmic, testResult)
        expect(testResult).toBe(true)
    }
    )

    // Test case desgined for generated non-stationary data with outlier
    const caseSpike = `spike_${intervals[i]}`
    test(`Forecast on data containing outlier with ${intervals[i]} datapoints`, () => {
        let spikeData = Array.from({ length: intervals[i] }, (_, i) => {
            if (i % 15 === 0) {
                return Math.random() * 50 + 50; // Sudden spike
            }
            return Math.random() * 10; // Normal data
        });
        let expected = spikeData.slice(-12);
        let forecast = RunForecast(spikeData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(spikeData, expected, result, model, caseSpike, testResult)
        expect(testResult).toBe(true)
    }
    )

}
    




