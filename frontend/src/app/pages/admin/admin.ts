import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Produto } from '../../models/produto';
import { Venda } from '../../models/venda';
import { ProdutoService } from '../../services/produto';
import { VendaService } from '../../services/venda';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  private produtoService = inject(ProdutoService);
  private vendaService = inject(VendaService);
  private auth = inject(AuthService);
  private router = inject(Router);

  produtos = signal<Produto[]>([]);
  vendas = signal<Venda[]>([]);
  carregando = signal<boolean>(true);
  abaAtiva = signal<'dashboard' | 'estoque'>('dashboard');
  busca = signal<string>('');
  formularioAberto = signal<boolean>(false);
  idEditando = signal<string | null>(null);

  nome = '';
  preco = 0;
  estoque = 0;
  mensagem = signal<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  produtosFiltrados = computed(() => {
    const termo = this.busca().toLowerCase().trim();
    if (!termo) return this.produtos();
    return this.produtos().filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.id.toLowerCase().includes(termo)
    );
  });

  totalEstoque = computed(() =>
    this.produtos().reduce((soma, p) => soma + p.estoque, 0)
  );

  alertasBaixoEstoque = computed(() =>
    this.produtos().filter((p) => p.estoque <= 5)
  );

  totalFaturadoCentavos = computed(() =>
    this.vendas().reduce((soma, v) => soma + v.totalCentavos, 0)
  );

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.carregando.set(true);
    this.produtoService.listar().subscribe({
      next: (listaProdutos) => {
        this.produtos.set(listaProdutos);
        this.vendaService.listar().subscribe({
          next: (listaVendas) => {
            this.vendas.set(listaVendas);
            this.carregando.set(false);
          },
          error: () => this.carregando.set(false),
        });
      },
      error: () => {
        this.mensagem.set({ tipo: 'erro', texto: 'Erro ao carregar os dados.' });
        this.carregando.set(false);
      },
    });
  }

  trocarAba(aba: 'dashboard' | 'estoque') {
    this.abaAtiva.set(aba);
  }

  abrirNovo() {
    this.idEditando.set(null);
    this.nome = '';
    this.preco = 0;
    this.estoque = 0;
    this.formularioAberto.set(true);
  }

  editar(p: Produto) {
    this.idEditando.set(p.id);
    this.nome = p.nome;
    this.preco = p.precoCentavos / 100;
    this.estoque = p.estoque;
    this.formularioAberto.set(true);
    this.abaAtiva.set('estoque');
  }

  fecharFormulario() {
    this.formularioAberto.set(false);
    this.idEditando.set(null);
    this.nome = '';
    this.preco = 0;
    this.estoque = 0;
  }

  salvar() {
    this.mensagem.set(null);

    const dados = {
      nome: this.nome,
      precoCentavos: Math.round(this.preco * 100),
      estoque: this.estoque,
    };

    const id = this.idEditando();
    const requisicao =
      id === null
        ? this.produtoService.criar(dados)
        : this.produtoService.atualizar(id, dados);

    requisicao.subscribe({
      next: () => {
        this.mensagem.set({
          tipo: 'sucesso',
          texto: id === null ? 'Produto cadastrado com sucesso!' : 'Produto atualizado com sucesso!',
        });
        this.fecharFormulario();
        this.carregarDados();
      },
      error: (e) => {
        this.mensagem.set({
          tipo: 'erro',
          texto: e.error?.erro ?? 'Erro ao salvar o produto.',
        });
      },
    });
  }

  excluir(p: Produto) {
    if (!confirm(`Deseja realmente excluir "${p.nome}"?`)) return;

    this.produtoService.remover(p.id).subscribe({
      next: () => {
        this.mensagem.set({ tipo: 'sucesso', texto: 'Produto excluído com sucesso!' });
        this.carregarDados();
      },
      error: (e) => {
        this.mensagem.set({ tipo: 'erro', texto: e.error?.erro ?? 'Erro ao excluir o produto.' });
      },
    });
  }

  sair() {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
