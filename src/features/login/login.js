import process from 'process';
import crypto from 'crypto';
import { GenSessionToken } from '../../lib/cookies/sessionToken.js';
import { GetCompanyies, UpdateSessionToken } from '../../lib/useDatabase/handle-data.js';
import { allowedChars, ValidateObjectStructureStrict, ValidatePassword, ValidateUsername } from '../../lib/dataValidation/validateObject.js';

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
    const expected = {
        username: '',
        password: ''
    }

    if (!ValidateObjectStructureStrict(data, expected)) return false;
    if (!ValidateUsername(data.username)) return false;
    if (!ValidatePassword(data.password)) return false;
    
    return true;
}

// Function to register a company using name and password
export async function Login(data) {
    return new Promise(async function (resolve) {
        let result = {
            response: '',
            cookie: []
        }
        
        if (LoginDataValidation(data) === false) {
            result.response = 'validation error';
            resolve(result);
        }

        data.password = crypto.createHash('sha256').update(data.password).digest('hex');

        const cheakLogin = await CheakLogin(data);
        if (cheakLogin === 'false') {
            result.response = 'wrong login';
            resolve(result);
        }

        const sessionToken = GenSessionToken();
        await UpdateSessionToken(cheakLogin.id, sessionToken);

        result.response = 'success';
        result.cookie = [`sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=Session; SameSite=Strict; Secure;`];
        resolve(result);
    })
}