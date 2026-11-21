import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosNovaVenda, Venda } from '../models/venda';

@Injectable({ providedIn: 'root' })
export class VendaService {
  private http = inject(HttpClient);
  private url =
    typeof window !== 'undefined' && window.location.port === '4200'
      ? 'http://localhost:3000/api/vendas'
      : '/api/vendas';

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.url);
  }

  buscarPorId(id: string): Observable<Venda> {
    return this.http.get<Venda>(`${this.url}/${id}`);
  }

  criar(dados: DadosNovaVenda): Observable<Venda> {
    return this.http.post<Venda>(this.url, dados);
  }
}
