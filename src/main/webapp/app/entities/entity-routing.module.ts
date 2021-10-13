import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'jogo',
        data: { pageTitle: 'gameseApp.jogo.home.title' },
        loadChildren: () => import('./jogo/jogo.module').then(m => m.JogoModule),
      },
      {
        path: 'fornecedor',
        data: { pageTitle: 'gameseApp.fornecedor.home.title' },
        loadChildren: () => import('./fornecedor/fornecedor.module').then(m => m.FornecedorModule),
      },
      {
        path: 'categoria',
        data: { pageTitle: 'gameseApp.categoria.home.title' },
        loadChildren: () => import('./categoria/categoria.module').then(m => m.CategoriaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
