import type { Request, Response } from 'express';
import * as CaminhoModel from '../models/api.model.js';



export async function apresentar(_req: Request, res: Response) {
  res.json(await CaminhoModel.apresentar());
}

