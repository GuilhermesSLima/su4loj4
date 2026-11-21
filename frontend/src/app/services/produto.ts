import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosProduto, Produto } from '../models/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private url =
    typeof window !== 'undefined' && window.location.port === '4200'
      ? 'http://localhost:3000/api/produtos'
      : '/api/produtos';

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url);
  }

  criar(dados: DadosProduto): Observable<Produto> {
    return this.http.post<Produto>(this.url, dados);
  }

  atualizar(id: string, dados: DadosProduto): Observable<Produto> {
    return this.http.put<Produto>(`${this.url}/${id}`, dados);
  }

  remover(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
