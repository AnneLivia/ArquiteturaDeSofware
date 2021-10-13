import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FornecedorComponent } from './list/fornecedor.component';
import { FornecedorDetailComponent } from './detail/fornecedor-detail.component';
import { FornecedorUpdateComponent } from './update/fornecedor-update.component';
import { FornecedorDeleteDialogComponent } from './delete/fornecedor-delete-dialog.component';
import { FornecedorRoutingModule } from './route/fornecedor-routing.module';

@NgModule({
  imports: [SharedModule, FornecedorRoutingModule],
  declarations: [FornecedorComponent, FornecedorDetailComponent, FornecedorUpdateComponent, FornecedorDeleteDialogComponent],
  entryComponents: [FornecedorDeleteDialogComponent],
})
export class FornecedorModule {}
