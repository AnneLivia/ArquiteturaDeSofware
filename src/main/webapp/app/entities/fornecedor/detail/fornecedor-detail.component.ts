import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFornecedor } from '../fornecedor.model';

@Component({
  selector: 'jhi-fornecedor-detail',
  templateUrl: './fornecedor-detail.component.html',
})
export class FornecedorDetailComponent implements OnInit {
  fornecedor: IFornecedor | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fornecedor }) => {
      this.fornecedor = fornecedor;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
