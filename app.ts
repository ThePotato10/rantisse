import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { api } from './api/api';
import { pages } from './pages/pages';

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('pages/public'));

app.use("/api", api);
app.use("/", pages);

app.listen(3000, () => console.log("App running on port 3000"));