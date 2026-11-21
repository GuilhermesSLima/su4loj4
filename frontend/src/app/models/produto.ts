export interface Produto {
  id: string;
  nome: string;
  precoCentavos: number;
  estoque: number;
}

export type DadosProduto = Omit<Produto, 'id'>;
