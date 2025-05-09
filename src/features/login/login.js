import fs from 'fs'
import process from 'process';
import { GenSessionToken } from '../../lib/cookies/sessionToken.js';
import { GetCompanyies } from '../../lib/useDatabase/handle-data.js';

const dbPath = process.cwd() + '/src/data/data.json';

function CheakLogin(data) {
    return new Promise((resolve) => {
        GetCompanyies()
        .then(companies => {
            for (const company of companies) {
                if (company.name === data.username && company.password === data.password) resolve(company);
            }
            resolve('false');
        })
        .catch(err => {
            console.error("Could not get companies array from database", err);
            resolve('error');
        });
    });
}

function LoginDataValidation(data) {
    //TODO
    return true;
}

// Function to register a company using name and password
export async function Login(data) {
    return new Promise(async function (resolve) {
        let result = {
            response: '',
            data: {}
        }
        
        if (LoginDataValidation(data) === false) {
            result.response = 'data validation';
            resolve(result);
        }

        const cheakLogin = await CheakLogin(data);
        console.log(cheakLogin);
        if (cheakLogin === 'false') {
            result.response = 'wrong login';
            resolve(result);
        }

        resolve(result);
    })
}