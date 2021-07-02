import { Router } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { getUserLikedRant } from '../../utils/getUserLikedRant';
import { getRantData } from '../../utils/getRantData';

export const rants = Router();
const url = require('../../credentials');

class Rant {
    text: string;
    likes: number;
    date: number;
    authorName: string
    authorId: ObjectId;

    constructor(text: string, authorId: ObjectId, authorName: string) {
        this.likes = 0;
        this.text = text;
        this.authorId = authorId;
        this.authorName = authorName;
        this.date = Date.now();
    }
}

rants.get("/getRant", async (req, res, next) => {
    if (typeof req.query.rantId === "string") res.send(await getRantData(req.query.rantId));
    else res.status(400).send();
});

rants.post("/newRant", async (req, res, next) => {
    if (req.cookies.uidtoken) {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        try {
            const authorNamePromise = await client.db("rantisse")
                .collection("users")
                .findOne({ _id: { $eq: new ObjectId(req.cookies.uidtoken) } });

            const rant = new Rant(req.body.rant, new ObjectId(req.cookies.uidtoken), await authorNamePromise.username);
            const response = await client.db("rantisse")
                .collection("rants")
                .insertOne(rant);

            res.send({ error: false, rantUrl: response.insertedId.toString() });
        } catch {
            res.status(500).send({ error: true, message: "Internal Server Error, possibly invalid login cookie. Please relogin and try again" });
        }

        client.close();
    } else {
        res.status(401).send({ error: true, message: "Account required to post rant" });
    }
});

rants.post("/likeEvent", async (req, res, next) => {
    if (req.cookies.uidtoken) {
        try {
            if (typeof req.query.rantId === "string") {
                const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();

                const liked = await getUserLikedRant(req.cookies.uidtoken, req.query.rantId);

                if (!liked) {
                    res.status(200).send({ error: false, likeStatus: true });

                    await client.db("rantisse")
                        .collection("likes")
                        .insertOne({ userId: new ObjectId(req.cookies.uidtoken), rantId: new ObjectId(req.query.rantId) });

                    await client.db("rantisse")
                        .collection("rants")
                        .updateOne({ _id: new ObjectId(req.query.rantId) }, { $inc: { likes: 1 } });
    
                } else {
                    res.status(200).send({ error: false, likeStatus: false });
                    
                    await client.db("rantisse")
                        .collection("likes")
                        .deleteOne({ userId: new ObjectId(req.cookies.uidtoken), rantId: new ObjectId(req.query.rantId) });

                    await client.db("rantisse")
                        .collection("rants")
                        .updateOne({ _id: new ObjectId(req.query.rantId) }, { $inc: { likes: -1 } });
                }

                client.close();

            } else res.status(400).send({ error: true, message: "Bad request. Please try again" });
        } catch { res.status(500).send({ error: true, message: "Internal Server Error, possibly invalid login cookie. Please relogin and try again" }) }
    } else res.status(401).send({ error: true, message: "Account required to like rant" });
});