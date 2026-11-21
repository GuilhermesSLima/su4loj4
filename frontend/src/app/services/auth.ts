import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private logado = signal<boolean>(false);

  estaLogado(): boolean {
    if (typeof window !== 'undefined') {
      const salvo = localStorage.getItem('admin_logado');
      if (salvo === 'true') {
        this.logado.set(true);
      }
    }
    return this.logado();
  }

  login(email: string, chave: string): boolean {
    if (email === 'admin@mercado.com' && chave === 'admin123') {
      this.logado.set(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_logado', 'true');
      }
      return true;
    }
    return false;
  }

  logout() {
    this.logado.set(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logado');
    }
  }
}
