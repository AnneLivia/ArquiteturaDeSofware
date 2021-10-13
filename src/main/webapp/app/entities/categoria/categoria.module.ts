import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategoriaComponent } from './list/categoria.component';
import { CategoriaDetailComponent } from './detail/categoria-detail.component';
import { CategoriaUpdateComponent } from './update/categoria-update.component';
import { CategoriaDeleteDialogComponent } from './delete/categoria-delete-dialog.component';
import { CategoriaRoutingModule } from './route/categoria-routing.module';

@NgModule({
  imports: [SharedModule, CategoriaRoutingModule],
  declarations: [CategoriaComponent, CategoriaDetailComponent, CategoriaUpdateComponent, CategoriaDeleteDialogComponent],
  entryComponents: [CategoriaDeleteDialogComponent],
})
export class CategoriaModule {}
