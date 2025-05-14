console.log('Current working directory:', process.cwd());
process.chdir('../src/features/calcForecast/');
console.log('Changed working directory to:', process.cwd());

//const ArimaForecast = require('../src/features/calcForecast/ArimaForecast.js')


const data = [  555866, 174701, 458500, 323800, 30750, 456900, 194000, 416297 ,303865, 448050, 178515, 168222,
    333520, 330090, 325457, 367068, 327179, 247301, 340363, 553907, 361974, 242516, 124659, 223538,
    108450, 306087, 340362, 388343, 448847, 107248, 428296, 324494, 922040, 
    394335, 330600, 630237, 86555, 290790, 788550, 77700, 109050, 318261, 160350, 72089, 376368]; 

//SelectOrder(data)
// test exponential
// test seasonal
// test linear growth
// test non-seasonal trends
// test non-stationary cases
// test real case
// analyze best models 