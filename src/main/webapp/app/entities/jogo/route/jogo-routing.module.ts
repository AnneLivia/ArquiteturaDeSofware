import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JogoComponent } from '../list/jogo.component';
import { JogoDetailComponent } from '../detail/jogo-detail.component';
import { JogoUpdateComponent } from '../update/jogo-update.component';
import { JogoRoutingResolveService } from './jogo-routing-resolve.service';

const jogoRoute: Routes = [
  {
    path: '',
    component: JogoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JogoDetailComponent,
    resolve: {
      jogo: JogoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JogoUpdateComponent,
    resolve: {
      jogo: JogoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JogoUpdateComponent,
    resolve: {
      jogo: JogoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(jogoRoute)],
  exports: [RouterModule],
})
export class JogoRoutingModule {}
