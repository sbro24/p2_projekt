import process from "process";
import fs from 'fs'
import { AddNewProfile } from "../../lib/useDatabase/handle-data.js";
import { RandomIntFromInterval } from "../../lib/maths/random.js";


const dbPath = process.cwd() + '/src/data/data.json';

function loadUsers() {
    let data = fs.readFileSync(dbPath);
    data = JSON.parse(data);
    return data.companies;
}

function DoesCompanynameExist(companyName) {
    const users = loadUsers();
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === companyName) return true;
    }
    return false;
}

function DoesIdExist(id) {
    const users = loadUsers();
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) return true;
    }
    return false;
}

function RegisterDataValidation(data) {
    //TODO
    return true;
}

// Function to register a company using name and password
function Register(data) {
    let result = {
        response: '',
        data: {},
    }
    
    if (RegisterDataValidation(data) === false) {
        result.response = 'data validation';
        return result
    }

    if (DoesCompanynameExist(data.companyName) === true) {
        result.response = 'companyname already exists';
        return result
    }

    let id = RandomIntFromInterval(100000, 999999)
    while (DoesIdExist(id)) {
        id = RandomIntFromInterval(100000, 999999)
    }
    id = id.toString()

    let token = GenSessionToken();

    AddNewProfile(id, data.companyName, data.password, token);

    result.response = 'credited';
    return
}

const testData = {
    companyName: "Testname5",
    password: "password123"
}

console.log(Register(testData))