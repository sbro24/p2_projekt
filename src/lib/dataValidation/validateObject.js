export function ValidateObjectStructure(x, y) {
    if (typeof x !== typeof y) return false;
    if (typeof x === 'object') {
        for (const key in x) {
            if (typeof x[key] !== typeof y[key]) return false;
            if (typeof x[key] === 'object' && !Array.isArray(x[key])) {
                if (!ValidateObjectStructure(x[key], y[key])) return false;
            }
        }
        for (const key in y) {
            if (typeof y[key] !== typeof x[key]) return false;
            if (typeof y[key] === 'object' && !Array.isArray(y[key])) {
                if (!ValidateObjectStructure(x[key], y[key])) return false;
            }
        }
    }
    return true;
}

export function ValidateObjectStructureStrict(x, y) {
    if (typeof x !== typeof y) return false;
    if (typeof x === 'object') {
        for (const key in x) {
            if (typeof x[key] !== typeof y[key]) return false;
            if (typeof x[key] === 'object') {
                if (!ValidateObjectStructure(x[key], y[key])) return false;
            }
        }
        for (const key in y) {
            if (typeof y[key] !== typeof x[key]) return false;
            if (typeof y[key] === 'object') {
                if (!ValidateObjectStructure(x[key], y[key])) return false;
            }
        }
    }
    return true;
}

export function allowedChars(srting, chars) {
    for (let i = 0; i < srting.length; i++) {
        if (!chars.includes(srting[i])) return false;
    }
    return true;
}

export function ValidateUsername(username) {
    if (typeof username !== 'string') return false
    if (username.length > 128) return false
    if (username.length < 4) return false
    const regExp = /[a-zA-Z0-9\ \-\_\:\&\!\?\.]+/g
    if (username.match(regExp) === null) return false;
    return true;
}

export function ValidatePassword(password) {
    if (typeof password !== 'string') return false
    if (password.length > 128) return false
    if (password.length < 8) return false
    const regExp = /[a-zA-Z0-9\ \-\_\:\&\!\?\.\#\%\+]+/g
    if (!password.match(regExp) === null) return false;
    return true;
}