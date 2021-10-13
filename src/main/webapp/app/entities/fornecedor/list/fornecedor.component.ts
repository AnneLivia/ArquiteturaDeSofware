import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFornecedor } from '../fornecedor.model';
import { FornecedorService } from '../service/fornecedor.service';
import { FornecedorDeleteDialogComponent } from '../delete/fornecedor-delete-dialog.component';

@Component({
  selector: 'jhi-fornecedor',
  templateUrl: './fornecedor.component.html',
})
export class FornecedorComponent implements OnInit {
  fornecedors?: IFornecedor[];
  isLoading = false;

  constructor(protected fornecedorService: FornecedorService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fornecedorService.query().subscribe(
      (res: HttpResponse<IFornecedor[]>) => {
        this.isLoading = false;
        this.fornecedors = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IFornecedor): number {
    return item.id!;
  }

  delete(fornecedor: IFornecedor): void {
    const modalRef = this.modalService.open(FornecedorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fornecedor = fornecedor;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
