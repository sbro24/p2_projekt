import fs from 'fs'
import process from 'process';
import { GenSessionToken } from '../../lib/cookies/sessionToken.js';

const dbPath = process.cwd() + '/src/data/data.json';

function loadUsers() {
    let data = fs.readFileSync(dbPath);
    data = JSON.parse(data);
    return data.companies;
}

function CheakLogin(companyName) {
    const users = loadUsers();
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === companyName) return users[i];
    }
    return false;
}

function LoginDataValidation(data) {
    //TODO
    return true;
}

// Function to register a company using name and password
function Login(data) {
    let result = {
        response: '',
        data: {},
    }
    
    if (LoginDataValidation(data) === false) {
        result.response = 'data validation';
        return result
    }

    let user = CheakLogin(data.companyName);

    if (user === false) {
        result.response = 'wrong login';
        return result
    }

    let token = GenSessionToken()
    
    //EditProfile(id, 'what to edit', data)

    result.response = 'logged in';
    result.data = { sessionToken: token }
    return result
}

const testData = {
    companyName: "Testname5",
    password: "password123"
}

console.log(Login(testData))