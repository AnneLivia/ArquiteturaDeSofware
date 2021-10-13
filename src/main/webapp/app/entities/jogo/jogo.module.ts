import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JogoComponent } from './list/jogo.component';
import { JogoDetailComponent } from './detail/jogo-detail.component';
import { JogoUpdateComponent } from './update/jogo-update.component';
import { JogoDeleteDialogComponent } from './delete/jogo-delete-dialog.component';
import { JogoRoutingModule } from './route/jogo-routing.module';

@NgModule({
  imports: [SharedModule, JogoRoutingModule],
  declarations: [JogoComponent, JogoDetailComponent, JogoUpdateComponent, JogoDeleteDialogComponent],
  entryComponents: [JogoDeleteDialogComponent],
})
export class JogoModule {}
