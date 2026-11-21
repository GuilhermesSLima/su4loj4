import { db } from '../config/firebase.js';

export interface Produto {
  id: string;
  nome: string;
  precoCentavos: number;
  estoque: number;
}

export type DadosProduto = Omit<Produto, 'id'>;

const colecao = db.collection('produtos');

export async function listar(): Promise<Produto[]> {
  const snapshot = await colecao.get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as DadosProduto),
  }));
}

export async function buscarPorId(id: string): Promise<Produto | undefined> {
  const doc = await colecao.doc(id).get();
  if (!doc.exists) return undefined;
  return { id: doc.id, ...(doc.data() as DadosProduto) };
}

export async function criar(dados: DadosProduto): Promise<Produto> {
  const ref = await colecao.add(dados);
  return { id: ref.id, ...dados };
}

export async function atualizar(id: string, dados: DadosProduto): Promise<Produto | undefined> {
  const ref = colecao.doc(id);
  const doc = await ref.get();
  if (!doc.exists) return undefined;
  await ref.update({ ...dados });
  return { id, ...dados };
}

export async function remover(id: string): Promise<boolean> {
  const ref = colecao.doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

export default Produto;
