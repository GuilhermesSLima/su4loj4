import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import route from './routes/index.js';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use('/api', route);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let pastaFront = path.resolve(__dirname, '../../frontend/dist/frontend/browser');
if (!existsSync(pastaFront)) {
  pastaFront = path.resolve(__dirname, '../../frontend/dist/frontend');
}

if (existsSync(pastaFront)) {
  app.use(express.static(pastaFront));
  app.use((_req: Request, res: Response) => {
    res.sendFile(path.join(pastaFront, 'index.html'));
  });
}

export default app;
