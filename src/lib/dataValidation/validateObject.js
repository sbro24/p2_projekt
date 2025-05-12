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