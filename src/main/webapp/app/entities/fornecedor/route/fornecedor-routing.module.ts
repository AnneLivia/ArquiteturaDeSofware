import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FornecedorComponent } from '../list/fornecedor.component';
import { FornecedorDetailComponent } from '../detail/fornecedor-detail.component';
import { FornecedorUpdateComponent } from '../update/fornecedor-update.component';
import { FornecedorRoutingResolveService } from './fornecedor-routing-resolve.service';

const fornecedorRoute: Routes = [
  {
    path: '',
    component: FornecedorComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FornecedorDetailComponent,
    resolve: {
      fornecedor: FornecedorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FornecedorUpdateComponent,
    resolve: {
      fornecedor: FornecedorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FornecedorUpdateComponent,
    resolve: {
      fornecedor: FornecedorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(fornecedorRoute)],
  exports: [RouterModule],
})
export class FornecedorRoutingModule {}
