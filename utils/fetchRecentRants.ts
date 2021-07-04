import { MongoClient } from 'mongodb';
import type { ObjectId, MongoError, Collection } from 'mongodb';

interface Rant {
    _id: ObjectId
    text: string;
    likes: number;
    date: number;
    authorName: string;
    formattedDate: string;
}

let rantCollection: Collection<Rant>;

MongoClient.connect(require('../credentials'), { useNewUrlParser: true, useUnifiedTopology: true }, (err: MongoError, result: MongoClient) => {
    if (err) throw err;
    rantCollection = result.db("rantisse").collection("rants");
});

export function fetchRecentRants(number: number): Promise<Array<Rant>> {
    const recent = Date.now() - 86400000; // The Unix timestamp date of exactly 1 day ago

    return rantCollection
        .find({ date: { $gte: recent }})
        .limit(number)
        .toArray();
}