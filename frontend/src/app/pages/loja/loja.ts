import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto';
import { CarrinhoService } from '../../services/carrinho';
import { VendaService } from '../../services/venda';
import { Venda } from '../../models/venda';

@Component({
  selector: 'app-loja',
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './loja.html',
})
export class Loja implements OnInit {
  private produtoService = inject(ProdutoService);
  carrinho = inject(CarrinhoService);
  private vendaService = inject(VendaService);

  produtos = signal<Produto[]>([]);
  carregando = signal<boolean>(true);
  erro = signal<string>('');
  carrinhoAberto = signal<boolean>(false);
  finalizando = signal<boolean>(false);
  vendaFinalizada = signal<Venda | null>(null);

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.carregando.set(true);
    this.produtoService.listar().subscribe({
      next: (lista) => {
        this.produtos.set(lista);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar a lista de produtos.');
        this.carregando.set(false);
      },
    });
  }

  abrirCarrinho() {
    this.carrinhoAberto.set(true);
  }

  fecharCarrinho() {
    this.carrinhoAberto.set(false);
  }

  adicionarAoCarrinho(p: Produto) {
    try {
      this.carrinho.adicionar(p, 1);
      this.carrinhoAberto.set(true);
    } catch (e: any) {
      alert(e.message);
    }
  }

  finalizarCompra() {
    if (this.carrinho.itens().length === 0) return;

    this.finalizando.set(true);
    const dados = {
      itens: this.carrinho.itens().map((i) => ({
        produtoId: i.produto.id,
        quantidade: i.quantidade,
      })),
    };

    this.vendaService.criar(dados).subscribe({
      next: (venda) => {
        this.vendaFinalizada.set(venda);
        this.carrinho.limpar();
        this.finalizando.set(false);
        this.carrinhoAberto.set(false);
        this.carregarProdutos();
      },
      error: (e) => {
        alert(e.error?.erro ?? 'Erro ao processar a compra.');
        this.finalizando.set(false);
      },
    });
  }

  fecharRecibo() {
    this.vendaFinalizada.set(null);
  }
}
