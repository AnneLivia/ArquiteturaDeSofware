import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJogo } from '../jogo.model';
import { JogoService } from '../service/jogo.service';

@Component({
  templateUrl: './jogo-delete-dialog.component.html',
})
export class JogoDeleteDialogComponent {
  jogo?: IJogo;

  constructor(protected jogoService: JogoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jogoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
