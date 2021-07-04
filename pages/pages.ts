import express from 'express';
import pug from 'pug';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getRantData } from '../utils/getRantData';
import { getUserLikedRant } from '../utils/getUserLikedRant';
import { fetchRecentRants } from '../utils/fetchRecentRants';

export const pages = express.Router();
const compileRant = pug.compileFile(__dirname + '/rant.pug');
const compileHome = pug.compileFile(__dirname + '/home.pug');

dayjs.extend(relativeTime);

pages.get("/", async (req, res, next) => {
    if (req.cookies.uidtoken) {
        res.send(compileHome({ rants: await fetchRecentRants(3) }));
    } else {
        res.redirect("/login");
    }
});

pages.get("/rant", async (req, res, next) => {
    if (typeof req.query.rantid === "string") {
        const rantData = await getRantData(req.query.rantid);

        if (rantData) {
            res.send(compileRant({
                likes: rantData.likes,
                liked: req.cookies.uidtoken ? await getUserLikedRant(req.cookies.uidtoken, req.query.rantid) : false,
                content: rantData.text,
                date: dayjs(rantData.date).from(dayjs(Date.now())),
                authorName: rantData.authorName,
                rantId: rantData._id
            }));
        } else {
            res.status(404).sendFile(__dirname + "/404.html");
        }
    } else {
        res.status(400).send();
    }
});

pages.get("/login", (req, res, next) => res.sendFile(__dirname + "/login.html"));
pages.get("/signup", (req, res, next) => res.sendFile(__dirname + "/signup.html"));