import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IJogo } from '../jogo.model';
import { JogoService } from '../service/jogo.service';
import { JogoDeleteDialogComponent } from '../delete/jogo-delete-dialog.component';

@Component({
  selector: 'jhi-jogo',
  templateUrl: './jogo.component.html',
})
export class JogoComponent implements OnInit {
  jogos?: IJogo[];
  isLoading = false;

  constructor(protected jogoService: JogoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.jogoService.query().subscribe(
      (res: HttpResponse<IJogo[]>) => {
        this.isLoading = false;
        this.jogos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IJogo): number {
    return item.id!;
  }

  delete(jogo: IJogo): void {
    const modalRef = this.modalService.open(JogoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.jogo = jogo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
