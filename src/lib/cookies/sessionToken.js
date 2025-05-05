


export function GenSessionToken() {
    let result = '';
    const n = 20
    const chars = '1234567890abcdefghifklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
    const min = 0
    const max = chars.length - 1
    for (let i = 0; i < n; i++) {
        result += chars.charAt(randomIntFromInterval(min, max));
    }
    return result
}
console.log(GenSessionToken(20))

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function CompareSessionTokens(token1, token2) {
    if (token1 === token2) return true
    return false
}