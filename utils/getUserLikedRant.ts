import { MongoClient, ObjectId, } from 'mongodb';
import type { MongoError, Db, Collection } from 'mongodb';

let db: Db;
let likesCollection: Collection;

const url = require('../credentials');
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err: MongoError, database) {
    if (err) throw err;

    db = database.db('rantisse');
    likesCollection = db.collection("likes");

});

export async function getUserLikedRant(userid: string, rantid: string): Promise<boolean> {
    const liked = await likesCollection.findOne({ userId: new ObjectId(userid), rantId: new ObjectId(rantid) });
    return liked ? true : false;
}