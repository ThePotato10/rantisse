import { Router } from 'express';
import { rants } from './rants/rants';
import { auth } from './auth/auth';

export const api = Router();

api.use("/rants", rants);
api.use("/auth", auth);