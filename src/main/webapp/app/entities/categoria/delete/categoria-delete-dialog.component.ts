import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICategoria } from '../categoria.model';
import { CategoriaService } from '../service/categoria.service';

@Component({
  templateUrl: './categoria-delete-dialog.component.html',
})
export class CategoriaDeleteDialogComponent {
  categoria?: ICategoria;

  constructor(protected categoriaService: CategoriaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.categoriaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
