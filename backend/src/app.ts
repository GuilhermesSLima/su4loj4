import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import route from './routes/index.js';

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send({ status: 'Caminho inicial'} );
});

app.use('/api', route);

export default app;