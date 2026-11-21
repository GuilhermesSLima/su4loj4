import type { Request, Response } from 'express';
import * as VendaModel from '../models/venda.model.js';

export async function listar(_req: Request, res: Response) {
  res.json(await VendaModel.listar());
}

export async function buscarPorId(req: Request, res: Response) {
  const venda = await VendaModel.buscarPorId(String(req.params.id));
  if (!venda) return res.status(404).json({ erro: 'Venda não encontrada.' });
  res.json(venda);
}

export async function criar(req: Request, res: Response) {
  try {
    const venda = await VendaModel.criar(req.body);
    res.status(201).json(venda);
  } catch (erro: any) {
    res.status(400).json({ erro: erro.message });
  }
}
