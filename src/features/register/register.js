import process from "process";
import crypto from "crypto";

import { RandomIntFromInterval } from "../../lib/maths/random.js";
import { AddNewCompany, GetCompanyies } from "../../lib/useDatabase/handle-data.js";
import { GenSessionToken } from "../../lib/cookies/sessionToken.js";
import { ValidateObjectStructureStrict } from "../../lib/dataValidation/validateObject.js";
import { Log } from "../../lib/logging/log.js";

const dbPath = process.cwd() + '/src/data/data.json';


export function DoesCompanynameExist(name) {
        return new Promise((resolve) => {
            GetCompanyies()
            .then(companies => {
                for (const company of companies) {
                    if (company.name === name) resolve(true);
                }
                resolve(false);
            })
            .catch(err => {
                Log(err);
                resolve(true);
            });
        });
}

function DoesIdExist(id) {
        return new Promise((resolve) => {
            GetCompanyies()
            .then(companies => {
                for (const company of companies) {
                    if (company.id === id) resolve(true);
                }
                resolve(false);
            })
            .catch(err => {
                console.error("Could not get companies array from database", err);
                resolve(err);
            });
        });
}

function RegisterDataValidation(data) {
    const expected = {
        username: '',
        password: ''
    }

    if (ValidateObjectStructureStrict(data, expected) === false) return false;
    if (data.username.length > 128 || data.password.length > 128) return false
    if (data.username.length < 4 || data.password.length < 8) return false
    return true;
}

// Function to register a company using name and password
export async function Register(data) {
    let result = {
        response: '',
    }
    
    if (RegisterDataValidation(data) === false) {
        result.response = 'validation error';
        return result
    }
    
    if (await DoesCompanynameExist(data.username)) {
        result.response = 'companyname already exists';
        return result
    }
    
    let id = GenId();
    while (await DoesIdExist(id) || typeof id === 'error') {
        id = GenId()
    }
    
    if (typeof id === 'error') {
        result.response = 'error';
        return result
    }

    let token = GenSessionToken();
    
    data.password = crypto.createHash('sha256').update(data.password).digest('hex');

    AddNewCompany(id, data.username, data.password, token)
    result.response = 'success';
    return result
}

function GenId() {
    let result = '';
    const n = 18
    const chars = '1234567890'
    const min = 0
    const max = chars.length - 1
    for (let i = 0; i < n; i++) {
        result += chars.charAt(RandomIntFromInterval(min, max));
    }
    return result
}