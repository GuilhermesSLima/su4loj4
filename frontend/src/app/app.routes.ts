import { Routes } from '@angular/router';
import { Loja } from './pages/loja/loja';
import { AdminLogin } from './pages/admin-login/admin-login';
import { Admin } from './pages/admin/admin';
import { TesteCrud } from './pages/teste-crud/teste-crud';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Loja },
  { path: 'admin/login', component: AdminLogin },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'teste', component: TesteCrud },
  { path: '**', redirectTo: '' },
];
