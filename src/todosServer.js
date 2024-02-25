import express from 'express';
import cors from 'cors';
import path from 'node:path';

import { router as todoRouter } from './routers/todo.router.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();

app.use(express.static(path.resolve('../../public')));// get all files from address
app.use(cors());
app.use(express.json());

app.use('/todos', todoRouter);

app.use(errorMiddleware);

export default app;
