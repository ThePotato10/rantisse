import bcrypt from 'bcrypt';
import { MongoClient } from 'mongodb';
import { Router } from 'express';
import { ValidationResults, validateSignup } from '../../utils/validateSignup';

export const auth = Router();

auth.post("/login", async (req, res, next) => {
    const client = new MongoClient(require('../../credentials'), { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const user = await client.db("rantisse").collection("users").findOne({ $or: [{ email: req.body.username }, { username: req.body.username }] });

    if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) res.status(500).send({ error: true, message: "Internal Server Error, please try again" });
            else {
                if (result) {
                    console.log(`User with id ${user._id.toString()} logged in`);
                    res.cookie("uidtoken", user._id.toString(), { httpOnly: true, maxAge: 99999999, sameSite: true });
                    res.send({ error: false, message: "ok" });
                } else {
                    res.status(401).send({ error: true, message: "Password is incorrect" });
                }
            }
        });
    } else {
        res.status(401).send({ error: true, message: "Username or email not found" });
    }

    client.close();
});

auth.post("/signup", async (req, res, next) => {
    const validation = await validateSignup(req.body);

    if (validation === ValidationResults.ok) {
        const client = new MongoClient(require('../../credentials'), { useNewUrlParser: true, useUnifiedTopology: true });
        const saltRounds = 10;
        await client.connect();

        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            if (err) res.status(500).send({ error: true, message: "Internal Server Error, please try again" });
            else {
                const response = await client.db("rantisse").collection("users").insertOne({
                    email: req.body.email,
                    username: req.body.username,
                    password: hash
                });

                console.log(`New account with id ${response.insertedId.toString()} created`);
                res.cookie('uidtoken', response.insertedId.toString(), { httpOnly: true, maxAge: 9999999, sameSite: true });
                res.send({ error: false, message: "ok" });
            }
        });

        client.close();
    } else {
        res.status(401).send({ error: true, message: ValidationResults[validation] });
    }
});