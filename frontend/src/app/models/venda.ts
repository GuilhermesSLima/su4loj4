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
