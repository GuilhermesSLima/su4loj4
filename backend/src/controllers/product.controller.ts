import type { Request, Response } from 'express';
import * as ProdutoModel from '../models/product.model.js';

export async function listar(_req: Request, res: Response) {
  res.json(await ProdutoModel.listar());
}

export async function buscarPorId(req: Request, res: Response) {
  const produto = await ProdutoModel.buscarPorId(String(req.params.id));
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.json(produto);
}

export async function criar(req: Request, res: Response) {
  const { nome, precoCentavos, estoque } = req.body;
  const produto = await ProdutoModel.criar({ nome: nome.trim(), precoCentavos, estoque });
  res.status(201).json(produto);
}

export async function atualizar(req: Request, res: Response) {
  const id = String(req.params.id);
  const { nome, precoCentavos, estoque } = req.body;
  const produto = await ProdutoModel.atualizar(id, { nome: nome.trim(), precoCentavos, estoque });
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.json(produto);
}

export async function remover(req: Request, res: Response) {
  const id = String(req.params.id);
  const removido = await ProdutoModel.remover(id);
  if (!removido) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.status(204).send();
}
