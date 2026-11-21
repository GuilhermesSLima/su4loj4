import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = 'admin@mercado.com';
  chave = 'admin123';
  mostrarSenha = signal<boolean>(false);
  erro = signal<string>('');

  toggleMostrarSenha() {
    this.mostrarSenha.update((v) => !v);
  }

  entrar() {
    this.erro.set('');
    const sucesso = this.auth.login(this.email.trim(), this.chave.trim());
    if (sucesso) {
      this.router.navigate(['/admin']);
    } else {
      this.erro.set('Credenciais inválidas. Use o e-mail e chave cadastrados.');
    }
  }
}
