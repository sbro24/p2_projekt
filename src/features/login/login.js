//Functions for reading and writing with the JSON file to use for login and register system

import fs from 'fs'
import process from 'process';

const dbPath = process.cwd() + '/src/data/data.json';

// (Helper function) Load user data
function loadUsers() {
    if (!fs.existsSync(dbPath)) { //Check if file can be opened/exists in the path
        fs.writeFileSync(dbPath, JSON.stringify({})); //"overwrites" the JSON file with an empty object 
    }                                                //to be filled with user data when it has been gathered from the register form
    let data = fs.readFileSync(dbPath); //Stores the JSON in the variable "data". The file is stored as a string. 
    data = JSON.parse(data); //By using the parse function it transfrom the file from strings to usuable objects
    return data.companies; //By using the parse function it transfrom the file from strings to usuable objects
}

// (Helper function) Function to save user data
function saveUsers(users) {
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2)); //This function allows to write to a file using (value, replacer, space).
                                                             // The function opens the filepath and writes the new user object inside
}

// Function to register a company using name and password
function register(companyName, password) {
    const users = loadUsers(); // Load the users from the JSON file
    console.log(users)

    if (users[companyName]) { //Check if the entered company name is already inside the JSON file
        console.log(`Company "${companyName}" already exists.`); // Log a error message to the user if company name exists
        return;
    }



    //users[companyName] = { //Adds password to the company object
    //    password, 
    //}; 
    //saveUsers(users); //Writes the new company object into the original JSON file
    //console.log(`Company "${companyName}" registered successfully.`);
}


// Create a run function that executes the login functions when they are called. 

// Function to log in if company name is found in database
function login(companyName) {
    const users = loadUsers(); //Loads the users from the database and returns the file as objects
    if (users[companyName]) { //If the user is found in the JSON file by their name 
        console.log(`Login successful. Welcome, ${companyName}!`); //Log in succesful
    } else {
        console.log(`Login failed. Company "${companyName}" not found.`); //If not it fails
    }
}
// (Helper function) To generate a unique id
function generateId() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function runLogin(data) {
    console.log(data)
    return 
}

export function runRegister(data) {



    register(data.companyName, data.password)
    return {
        response: '',
        data: {},
    }
}


const testData = {
    companyName: "someCompanyName",
    password: "password123"
}

//runLogin(testData)
//runRegister(testData)