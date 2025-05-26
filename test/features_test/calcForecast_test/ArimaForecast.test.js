/*
 * @jest-environment jsdom
 */

jest.unmock('fs');
jest.unmock('child_process');
jest.unmock('util');
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


//############### Test Data ##################
const salesItemOne = [null,14856.93,16533.33,14479.39,14906.26,16303.87,14837.41,17069.76,14757.08,16170.71,15996.31,16668.58,15088.2,14906.54,16279.98,16102.26,16790.69,17809.66,16155.75,16387.12,16051.74,15785.31,17468.07,15595.31,16875.29,17377.89,17911.34,18348.12,18560.44,17246.84,16912.85,17944.73,16549.07,16530.31,16693.69,18511.71,18057.14,16785.03,19023.66,19588.15,20208.35,18784.36,18502.32,19722.55,16816.31,19008.68,16650.84,17395.55,15838.27,20260.48,14731.11,12226.22,12850.82,13884.72,14360.78,13837.25,13167.88,13875.93,12950.49,14209.36];
const salesItemTwo = [2242.47, 2038.29, 2195.51, 2186.65, 2217.69, 2011.06, 3105.93, 2777.65, 2166.16, 2828.31, 2336.44, 3009.81, 2618.55, 1896.94, 2260.54, 2051.89, 2241.16, 2839.86, 1751.25, 2027.1, 2820.21, 2116.9, 3484.01, 3770.55, 4383.92, 4011.6, 4030.4, 4494.45, 5366.09, 4524.18, 6063.14, 5083.52, 7938.27, 8201.41, 9040.92, 7941.73, 13119.67, 14054.16, 14463.67, 13524.43, 12017.08, 12967.58, 15570.54, 15801.56, 18240.68, 15872.26, 18891.17, 15617.53, 25225.76, 18252.93, 26096.15, 21104.15, 21334.42, 27777.8, 20291.7, 24069.72, 16734.47, 23210.92, 17339.73, 15027.46];
const salesItemThree = [2599, 2409.48, 2410.55, 2586.44, 2218.95, 2659.6, 2236.21, 2736.01, 2919.76, 2152.07, 2052.76, 2458.98, 2859.81, 2717.46, 2093.22, 2758.08, 2140.58, 2234.54, 2864.49, 2821.62, 2844.35, 2879.02, 2755.58, 2211.4, 2000.17, 2946.75, 2266.57, 2722.01, 2148.82, 2700.35, 2708.18, 2409.13, 2653.12, 2827.59, 2993.73, 2165.85, 2802.06, 2991.54, 2212.1, 2123.98, 2415.53, 2460.7, 2560.79, 2986.53, 2745.78, 2297.89, 2567.8, 2416.36, 2707.18, 2994.77, 2779.95, 2963.29, 2185.7, 2376.1, 2260.28, 2022.05, 2658.9, 2955.07, 2702.86, 2809.16];
const advertising = [0, 204.83, 195.13, 221.95, 206.09, 231.01, 234.29, 206.81, 220.68, 216.49, 210.79, 224.92, 205.38, 236.15, 236.74, 244.38, 227.3, 245.64, 213.97, 251.42, 222.21, 221.08, 238.51, 247.35, 249.53, 250.7, 269.95, 270.46, 261.31, 281.48, 280.47, 286.19, 334.18, 290.52, 300.53, 324.67, 352.02, 341.63, 391.73, 360.67, 376.77, 385.25, 379.83, 398.19, 368.52, 451.86, 388.2, 413.28, 449.55, 508.44, 517.26, 375.65, 423.21, 484.88, 389.72, 369.07, 501.63, 376.56, 397.28, 435.9];
const costPrizeItemOne = [4793.28, 4458.62, 4907.12, 4258.52, 4390.59, 4769.02, 4432.15, 5042.69, 4418.83, 4849.21, 4884.22, 4992.52, 4514.26, 4491.03, 4904.12, 4826.01, 5132.95, 5423.05, 4759.68, 4999.16, 4918.12, 4651.85, 5123.45, 4737.73, 4955.9, 5173.54, 5317.54, 5422.16, 5634.23, 5165.94, 5032.11, 5420.49, 4905.19, 5074.03, 5097.17, 5505.46, 5403.07, 5068.93, 5815.43, 5945.34, 6060.66, 5539.28, 5570.9, 5961.17, 5107.77, 5770.69, 4912.47, 5211.19, 4773.67, 6164.91, 4321.64, 3685.02, 3915.17, 4224.87, 4370.77, 4249.14, 3992.44, 4120.21, 3940.19, 4179.52];
const costPrizeItemTwo = [667.56, 609.22, 663.43, 652.39, 660.2, 611.2, 930.69, 815.62, 662.19, 840.34, 685.17, 894.04, 784.49, 569.51, 673.33, 622.23, 658.93, 847.06, 537.43, 606.28, 867.06, 627.03, 1030.18, 1116.51, 1330.4, 1189.57, 1181.88, 1369.92, 1578.99, 1353.27, 1780.38, 1553.09, 2404.24, 2455.97, 2735.9, 2390.25, 3918.23, 4263.69, 4366.77, 4000.3, 3524.85, 3818.57, 4780.53, 4839.73, 5456.48, 4875.17, 5708.06, 4631.71, 7542.99, 5392.66, 7824.04, 6349.48, 6421.35, 8315.46, 6161.59, 7227, 4990.51, 7093.95, 5165.21, 4514.77];
const costPrizeItemThree = [782.36, 711.77, 719.89, 763.14, 673.98, 789.04, 673.76, 828.62, 875.62, 648.41, 617.52, 747.71, 874.89, 817.72, 634.86, 828.86, 648.03, 665.64, 866.45, 863.22, 869.29, 862.22, 831.9, 648.52, 609.12, 887.43, 669.92, 800.7, 651.09, 800.43, 800.12, 708.97, 784.43, 855.21, 889.98, 653.05, 826.52, 909.44, 671.89, 642.78, 709.24, 741.93, 773.04, 904.47, 817.1, 702.05, 767.4, 727.1, 814.51, 903.96, 839.51, 870.92, 671.24, 722.67, 686.1, 612.39, 802.21, 892.62, 793.68, 822.96];
const transactionFees = [219.2, 205.8, 200.05, 225.34, 205.84, 225.37, 226.89, 208.7, 222.15, 215.98, 207.9, 225.45, 210.3, 233.64, 232.17, 244.17, 225.71, 250.57, 224.7, 248.06, 224.69, 218.12, 244.82, 253.56, 254.87, 248.43, 271.52, 273.08, 262.28, 284.02, 284.06, 281.78, 325.32, 298.87, 308.2, 327.05, 356.56, 341.27, 380.32, 363.17, 363.71, 379.86, 391.84, 403.05, 386.33, 432, 385.35, 402.87, 453.62, 509.49, 513.44, 395.26, 439.81, 469.29, 393.79, 369.25, 504.06, 373.49, 388.58, 453.43];
const shipping = [857.1, 818.99, 787.1, 867.65, 783.73, 945.05, 896.32, 805.27, 899.5, 890.15, 837.28, 848.59, 872.79, 968.57, 923.54, 915.89, 920.02, 976.63, 878.05, 969.48, 909.06, 925.69, 1006.05, 999.1, 1017.98, 1023.01, 1141.78, 1054.92, 1121.59, 1110.51, 1153.79, 1129.31, 1267.83, 1218.26, 1198.86, 1322.83, 1404.97, 1343.26, 1599.62, 1470.72, 1495.72, 1546.35, 1561.98, 1509.02, 1484.38, 1743.36, 1582.71, 1563.98, 1753.21, 1944.1, 2107.57, 1476, 1803.45, 1963.71, 1545.99, 1566.78, 1912.66, 1506.27, 1607.82, 1740.71];

//############### Test Processing ##################

// Runs the arima forecast and returns the result with the best AIC

async function RunForecast(data){
    const forecastHandler = await SelectOrder(data)
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

const timeout = 10000
const threshold = 35 // x% leniency for test result
const intervals = [24,36,48,60] // array of lengths of data to generate. affects number of tests
let genericData = [96000	,123000	,236000	,81600	,28800	,null	,null	,
    null	,null	,null	,null	,null	,117600	,126000	,166000	,84800	,33900	,
    19800	,42400	,22600	,8800	,73600	,98000	,127500	,97200	,126000	,200000	,
    74400	,24900	,23200	,36800	,16800	,11700	,95200	,102000	,172500	,104400	,
    172500	,218000	,82400	,26700	,21400	,33200	,20400	,8500	,92000	,99000	,
    168000	,108000	,135000	,208000	,78400	,30600	,17400	,44800	,17200	,10700	,
    95200	,119000	,166500
]
/*
This first test is designed for external input data, and so does not generate any iterations or mutations,
simply evaluates a single forecast.
*/


// Test case desgined for generic input data


test('Forecast on generic data', async () => {
    let testCase = 'generic'
    let trainingData = genericData.slice(0, -12);
    let expected = genericData.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(genericData, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on salesItemOne', async () => {
    let testCase = 'salesItemOne'
    let trainingData = salesItemOne.slice(0, -12);
    let expected = salesItemOne.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(salesItemOne, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on salesItemTwo', async () => {
    let testCase = 'salesItemTwo'
    let trainingData = salesItemTwo.slice(0, -12);
    let expected = salesItemTwo.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(salesItemTwo, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on salesItemThree', async () => {
    let testCase = 'salesItemThree'
    let trainingData = salesItemThree.slice(0, -12);
    let expected = salesItemThree.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(salesItemThree, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on advertising', async () => {
    let testCase = 'advertising'
    let trainingData = advertising.slice(0, -12);
    let expected = advertising.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(advertising, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on costPrizeItemOne', async () => {
    let testCase = 'costPrizeItemOne'
    let trainingData = costPrizeItemOne.slice(0, -12);
    let expected = costPrizeItemOne.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(costPrizeItemOne, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on costPrizeItemTwo', async () => {
    let testCase = 'costPrizeItemTwo'
    let trainingData = costPrizeItemTwo.slice(0, -12);
    let expected = costPrizeItemTwo.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(costPrizeItemTwo, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on costPrizeItemThree', async () => {
    let testCase = 'costPrizeItemThree'
    let trainingData = costPrizeItemThree.slice(0, -12);
    let expected = costPrizeItemThree.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(costPrizeItemThree, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on transactionFees', async () => {
    let testCase = 'transactionFees'
    let trainingData = transactionFees.slice(0, -12);
    let expected = transactionFees.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(transactionFees, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)

test('Forecast on shipping', async () => {
    let testCase = 'shipping'
    let trainingData = shipping.slice(0, -12);
    let expected = shipping.slice(-12);
    let forecast = await RunForecast(trainingData)
    let result = forecast.getBestModel().prediction
    let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
    let testResult = CheckResult(expected, result, threshold)
    WriteReport(shipping, expected, result, model, testCase, testResult)
    expect(testResult).toBe(true)
    },timeout
)


/*
These test cases function by generating their own data using the
"intervals" variable, with 1,..,n iterations and each nth iteration has intervals[i] datapoints.
The tests are evaluated using the CheckResult function, which uses the "threshold" variable.
*/

for (let i=0; i<intervals.length; i++){

    // Test case desgined for generated exponential data
    
    test(`Forecast on data of exponential growth with ${intervals[i]} datapoints`, async () => {
        let testCase = `exponential_${intervals[i]}`
        let exponentialData = Array.from({ length: intervals[i] }, (_, i) => Math.pow(2, i));
        let trainingData = exponentialData.slice(0, -12);

        let expected = exponentialData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(exponentialData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(false)
    }   
    )

    // Test case desgined for generated data with linear growth
    
    test(`Forecast on data of linear growth with ${intervals[i]} datapoints`, async () => {
        let testCase = `growth_${intervals[i]}`
        let growthData = Array.from({ length: intervals[i] }, (_, i) => i * 2);
        let trainingData = growthData.slice(0, -12);

        let expected = growthData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(growthData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(true)
    },timeout
    )

    // Test case designed for generated data with linear decline
    
    test(`Forecast on data of linear decline with ${intervals[i]} datapoints`, async () => {
        let testCase = `decline_${intervals[i]}`
        let declineData = Array.from({ length: intervals[i] }, (_, i) => i - (i*2));
        let trainingData = declineData.slice(0, -12);

        let expected = declineData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(declineData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(true)
    },timeout
    )

    // Test case desgined for generated seasonal data
    
    test(`Forecast on seasonal data with ${intervals[i]} datapoints`, async () => {
        let testCase = `seasonal_${intervals[i]}`
        let seasonalData = Array.from({ length: intervals[i] }, (_, i) => 10 + 5 * Math.sin((2 * Math.PI * i) / 12));
        let trainingData = seasonalData.slice(0, -12);

        let expected = seasonalData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(seasonalData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(true)
    },timeout
    )

    // Test case desgined for generated white noise
    
    test(`Forecast on white noise with ${intervals[i]} datapoints`, async () => {
        let testCase = `noise_${intervals[i]}`
        let whiteNoiseData = Array.from({ length: intervals[i] }, () => Math.random() * 2 - 1);
        let trainingData = whiteNoiseData.slice(0, -12);

        let expected = whiteNoiseData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(whiteNoiseData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(false)
    }
    )

    // Test case desgined for generated logarithmic data
    
    test(`Forecast on logarithmic data with ${intervals[i]} datapoints`, async () => {
        let testCase = `log_${intervals[i]}`
        let logarithmicData = Array.from({ length: intervals[i] }, (_, i) => Math.log(i + 1));
        let trainingData = logarithmicData.slice(0, -12);

        let expected = logarithmicData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(logarithmicData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(true)
    },timeout
    )

    // Test case desgined for generated non-stationary data with outlier
    
    test(`Forecast on data containing outlier with ${intervals[i]} datapoints`, async () => {
        let testCase = `spike_${intervals[i]}`
        let spikeData = Array.from({ length: intervals[i] }, (_, i) => {
            if (i % 15 === 0) {
                return Math.random() * 50 + 50; // Sudden spike
            }
            return Math.random() * 10; // Normal data
        });
        let trainingData = spikeData.slice(0, -12);

        let expected = spikeData.slice(-12);
        let forecast = await RunForecast(trainingData)
        let result = forecast.getBestModel().prediction
        let model = `p: ${forecast.getBestOrder()['p']} d: ${forecast.getBestOrder()['d']} q: ${forecast.getBestOrder()['q']}`
        let testResult = CheckResult(expected, result, threshold)
        WriteReport(spikeData, expected, result, model, testCase, testResult)
        expect(testResult).toBe(true)
    },timeout
    )

}
    




