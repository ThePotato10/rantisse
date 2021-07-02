import { MongoClient } from "mongodb";

enum ValidationResults {
    "ok",
    "Username is already in use",
    "Account with that email already exists",
    "One or more fields are blank",
    "Username is too short, it must be at least 4 characters",
    "Email is invalid"
}

interface SignupData {
    email: string
    username: string
    password: string
}

async function validateSignup(data: SignupData): Promise<ValidationResults> {
    
    async function checkEmailExists(email: string): Promise<boolean> {
        // Returns true if the email is unique

        const url = require('../credentials');
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();
        const result = await client.db("rantisse").collection("users").findOne({ email: { $eq: email } });

        client.close();
        
        if (await result) return true;
        return false;
    }

    async function checkUsernameExists(username: string): Promise<boolean> {
        // Returns true if the username is unique

        const url = require('../credentials');
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();
        const result = await client.db("rantisse").collection("users").findOne({ username: { $eq: username } });

        client.close();
        
        if (await result) return true;
        return false;
    }

    if (!data.email || !data.password || !data.username) return ValidationResults["One or more fields are blank"];
    if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(data.email))) return ValidationResults["Email is invalid"];
    if (data.username.length < 4) return ValidationResults["Username is too short, it must be at least 4 characters"];
    if (await checkEmailExists(data.email)) return ValidationResults["Account with that email already exists"];
    if (await checkUsernameExists(data.username)) return ValidationResults["Username is already in use"];

    return ValidationResults.ok
}

export { ValidationResults, SignupData, validateSignup };