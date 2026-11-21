import { db } from '../config/firebase.js';
import * as ProdutoModel from './product.model.js';

export interface ItemVenda {
  produtoId: string;
  nome: string;
  precoUnitarioCentavos: number;
  quantidade: number;
  subtotalCentavos: number;
}

export interface Venda {
  id: string;
  itens: ItemVenda[];
  subtotalCentavos: number;
  descontoCentavos: number;
  totalCentavos: number;
  criadoEm: string;
}

export interface ItemEntrada {
  produtoId: string;
  quantidade: number;
}

export interface DadosNovaVenda {
  itens: ItemEntrada[];
}

const colecao = db.collection('vendas');

export async function listar(): Promise<Venda[]> {
  const snapshot = await colecao.orderBy('criadoEm', 'desc').get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Venda, 'id'>),
  }));
}

export async function buscarPorId(id: string): Promise<Venda | undefined> {
  const doc = await colecao.doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...(doc.data() as Omit<Venda, 'id'>) };
}

export async function criar(dados: DadosNovaVenda): Promise<Venda> {
  if (!dados.itens || dados.itens.length === 0) {
    throw new Error('A compra precisa ter pelo menos um item.');
  }

  const itensVenda: ItemVenda[] = [];
  const produtosAtualizar: { id: string; novoProduto: ProdutoModel.DadosProduto }[] = [];

  for (const item of dados.itens) {
    if (!item.quantidade || item.quantidade <= 0) {
      throw new Error('Quantidade inválida para os itens.');
    }

    const produto = await ProdutoModel.buscarPorId(item.produtoId);
    if (!produto) {
      throw new Error(`Produto não encontrado: ${item.produtoId}`);
    }

    if (produto.estoque < item.quantidade) {
      throw new Error(`Estoque insuficiente para o produto "${produto.nome}". Disponível: ${produto.estoque}.`);
    }

    const subtotalCentavos = produto.precoCentavos * item.quantidade;

    itensVenda.push({
      produtoId: produto.id,
      nome: produto.nome,
      precoUnitarioCentavos: produto.precoCentavos,
      quantidade: item.quantidade,
      subtotalCentavos,
    });

    produtosAtualizar.push({
      id: produto.id,
      novoProduto: {
        nome: produto.nome,
        precoCentavos: produto.precoCentavos,
        estoque: produto.estoque - item.quantidade,
      },
    });
  }

  const subtotalCentavos = itensVenda.reduce((soma, i) => soma + i.subtotalCentavos, 0);
  const temDesconto = subtotalCentavos > 20000;
  const descontoCentavos = temDesconto ? Math.round(subtotalCentavos * 0.05) : 0;
  const totalCentavos = subtotalCentavos - descontoCentavos;

  for (const p of produtosAtualizar) {
    await ProdutoModel.atualizar(p.id, p.novoProduto);
  }

  const novaVenda = {
    itens: itensVenda,
    subtotalCentavos,
    descontoCentavos,
    totalCentavos,
    criadoEm: new Date().toISOString(),
  };

  const ref = await colecao.add(novaVenda);
  return { id: ref.id, ...novaVenda };
}

export default Venda;
