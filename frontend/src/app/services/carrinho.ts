import { computed, Injectable, signal } from '@angular/core';
import { Produto } from '../models/produto';

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  itens = signal<ItemCarrinho[]>([]);

  totalItens = computed(() =>
    this.itens().reduce((soma, item) => soma + item.quantidade, 0)
  );

  subtotalCentavos = computed(() =>
    this.itens().reduce(
      (soma, item) => soma + item.produto.precoCentavos * item.quantidade,
      0
    )
  );

  temDesconto = computed(() => this.subtotalCentavos() > 20000);

  descontoCentavos = computed(() =>
    this.temDesconto() ? Math.round(this.subtotalCentavos() * 0.05) : 0
  );

  totalCentavos = computed(
    () => this.subtotalCentavos() - this.descontoCentavos()
  );

  adicionar(produto: Produto, quantidade = 1) {
    const atual = this.itens();
    const index = atual.findIndex((i) => i.produto.id === produto.id);

    if (index > -1) {
      const novaQtd = atual[index].quantidade + quantidade;
      if (novaQtd > produto.estoque) {
        throw new Error(`Estoque máximo disponível: ${produto.estoque}`);
      }
      this.itens.update((itens) => {
        const copia = [...itens];
        copia[index] = { ...copia[index], quantidade: novaQtd };
        return copia;
      });
    } else {
      if (quantidade > produto.estoque) {
        throw new Error(`Estoque máximo disponível: ${produto.estoque}`);
      }
      this.itens.update((itens) => [...itens, { produto, quantidade }]);
    }
  }

  atualizarQuantidade(produtoId: string, quantidade: number) {
    if (quantidade <= 0) {
      this.remover(produtoId);
      return;
    }

    this.itens.update((itens) =>
      itens.map((item) => {
        if (item.produto.id === produtoId) {
          const qtd = Math.min(quantidade, item.produto.estoque);
          return { ...item, quantidade: qtd };
        }
        return item;
      })
    );
  }

  remover(produtoId: string) {
    this.itens.update((itens) =>
      itens.filter((i) => i.produto.id !== produtoId)
    );
  }

  limpar() {
    this.itens.set([]);
  }
}
