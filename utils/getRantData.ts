import { MongoClient, ObjectId } from 'mongodb';

const url = require('../credentials');

interface Rant {
    _id: ObjectId
    text: string;
    likes: number;
    date: number;
    authorName: string
}

export async function getRantData(rantid: string): Promise<Rant|undefined> {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const response: Rant|undefined = await client.db("rantisse")
        .collection("rants")
        .findOne({ _id: new ObjectId(rantid) });

    client.close();

    if (response) {
        return { _id: response._id, text: response.text, likes: response.likes, date: response.date, authorName: response.authorName };
    } else {
        return undefined;
    }
}