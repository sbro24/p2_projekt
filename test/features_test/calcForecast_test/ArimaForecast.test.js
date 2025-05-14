/*
 * @jest-environment jsdom
 */


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

//############### Test Data ##################

const genericData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const linearData = Array.from({ length: 60 }, (_, i) => i * 2);
const seasonalData = Array.from({ length: 60 }, (_, i) => 10 + 5 * Math.sin((2 * Math.PI * i) / 12));
const whiteNoiseData = Array.from({ length: 60 }, () => Math.random() * 2 - 1);
const nonStationaryData = [100.0, 98.5, 96.8, 95.2, 93.7, 91.9, 90.3, 88.6, 86.9, 85.4, 83.7, 82.0, 80.5, 78.8, 77.2, 75.6, 74.0, 72.5, 71.0, 69.4, 67.9, 66.3, 64.8, 63.5, 62.1, 60.7, 59.3, 58.0, 56.7, 55.4, 54.2, 53.0, 51.8, 50.7, 59.6, 68.6, 67.6, 66.7, 65.8, 64.9, 64.1, 73.3, 72.6, 71.9, 71.2, 70.6, 70.0, 79.5, 79.0, 78.5, 38.1, 37.7, 37.3, 37.0, 36.7, 36.4, 36.2, 36.0, 35.8, 35.6];
const logarithmicData = Array.from({ length: 60 }, (_, i) => Math.log(i + 1));
const spikeData = Array.from({ length: 60 }, (_, i) => {
    if (i % 15 === 0) {
        return Math.random() * 50 + 50; // Sudden spike
    }
    return Math.random() * 10; // Normal data
});

//############### Test Processing ##################

function RunForecast(data){
    const forecastHandler = SelectOrder(data)
    const bestModel = forecastHandler.getBestModel().prediction
    const bestOrder = forecastHandler.getBestOrder();
    console.log("Best Model: ", bestOrder)
    return bestModel
}

function CheckResult(expected, result, threshold){
    let points = 0
    for (let i=0; i<expected.length; i++){
        if (result[i] <= expected[i]*(1+threshold/100) && result[i] >= expected[i]*(1-threshold/100)){
            points++
        }
    }
    console.log((points/100)*12+'% of result within threshold')
    if(points === 12){
        return true
    } else {
        return false
    }
}

//############### Test Cases ##################

// Test case desgined for generic input data
test('Forecast on generic data', () => {
    const expected = genericData.slice(-12);
    result = RunForecast(genericData)
    testResult = CheckResult(expected, result)
    expect(testResult).toBe(true)
    }
)

 
// Test case desgined for generated exponential data

test('Forecast on exponential data', () => {
    const intervals = [12,24,36,48,60]
    for (let i=0; i<intervals.length; i++){
        const data = Array.from({ length: intervals[i] }, (_, i) => Math.pow(2, i));
        result = RunForecast(data)
        testResult = CheckResult(expected, result)
        expect(testResult).toBe(true)
    }
    }
)


        
    









//############### Report Handling ##################

//const outputFilePath = path.join('./', 'model_output.txt');


//let outputData = `Best Model Order: ${JSON.stringify(bestOrder)}\nBest AIC Score: ${bestAIC}\n`;
//outputData += `Test Data:\n`;
//data.forEach(item => {
//    outputData += `${item}\n`;
//});
//outputData += `Best Forecast:\n`;
//bestModel.forEach(item => {
//    outputData += `${item}\n`;
//});


//fs.writeFile(outputFilePath, outputData, (err) => {
//    if (err) {
//        console.error('Error writing to file:', err);
//    } else {
//        console.log('Model order and AIC score written to file:', outputFilePath);
//    }
//}oihdsfoihfe);


