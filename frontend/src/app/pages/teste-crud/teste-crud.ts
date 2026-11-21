import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Produto } from '../../models/produto';
import { ProdutoService } from '../../services/produto';

@Component({
  selector: 'app-teste-crud',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './teste-crud.html',
  styleUrl: './teste-crud.css',
})
export class TesteCrud implements OnInit {
  private service = inject(ProdutoService);

  produtos = signal<Produto[]>([]);
  erro = signal('');
  idEditando = signal<string | null>(null);

  nome = '';
  preco = 0;
  estoque = 0;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe({
      next: (lista) => this.produtos.set(lista),
      error: (e) => this.mostrarErro(e),
    });
  }

  salvar() {
    this.erro.set('');

    const dados = {
      nome: this.nome,
      precoCentavos: Math.round(this.preco * 100),
      estoque: this.estoque,
    };

    const id = this.idEditando();
    const requisicao = id === null
      ? this.service.criar(dados)
      : this.service.atualizar(id, dados);

    requisicao.subscribe({
      next: () => {
        this.limpar();
        this.carregar();
      },
      error: (e) => this.mostrarErro(e),
    });
  }

  editar(p: Produto) {
    this.idEditando.set(p.id);
    this.nome = p.nome;
    this.preco = p.precoCentavos / 100;
    this.estoque = p.estoque;
  }

  excluir(p: Produto) {
    if (!confirm(`Excluir "${p.nome}"?`)) return;

    this.service.remover(p.id).subscribe({
      next: () => this.carregar(),
      error: (e) => this.mostrarErro(e),
    });
  }

  limpar() {
    this.idEditando.set(null);
    this.nome = '';
    this.preco = 0;
    this.estoque = 0;
  }

  private mostrarErro(e: any) {
    this.erro.set(e.error?.erro ?? 'Não foi possível falar com o servidor.');
  }
}
