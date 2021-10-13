import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFornecedor, Fornecedor } from '../fornecedor.model';
import { FornecedorService } from '../service/fornecedor.service';

@Component({
  selector: 'jhi-fornecedor-update',
  templateUrl: './fornecedor-update.component.html',
})
export class FornecedorUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
  });

  constructor(protected fornecedorService: FornecedorService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fornecedor }) => {
      this.updateForm(fornecedor);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fornecedor = this.createFromForm();
    if (fornecedor.id !== undefined) {
      this.subscribeToSaveResponse(this.fornecedorService.update(fornecedor));
    } else {
      this.subscribeToSaveResponse(this.fornecedorService.create(fornecedor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFornecedor>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(fornecedor: IFornecedor): void {
    this.editForm.patchValue({
      id: fornecedor.id,
      nome: fornecedor.nome,
    });
  }

  protected createFromForm(): IFornecedor {
    return {
      ...new Fornecedor(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
    };
  }
}
