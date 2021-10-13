import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IJogo, Jogo } from '../jogo.model';
import { JogoService } from '../service/jogo.service';
import { IFornecedor } from 'app/entities/fornecedor/fornecedor.model';
import { FornecedorService } from 'app/entities/fornecedor/service/fornecedor.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';

@Component({
  selector: 'jhi-jogo-update',
  templateUrl: './jogo-update.component.html',
})
export class JogoUpdateComponent implements OnInit {
  isSaving = false;

  fornecedorsSharedCollection: IFornecedor[] = [];
  categoriasSharedCollection: ICategoria[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    ano: [],
    descricao: [],
    preco: [],
    image: [],
    estoque: [],
    fornecedor: [],
    categorias: [],
  });

  constructor(
    protected jogoService: JogoService,
    protected fornecedorService: FornecedorService,
    protected categoriaService: CategoriaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jogo }) => {
      this.updateForm(jogo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jogo = this.createFromForm();
    if (jogo.id !== undefined) {
      this.subscribeToSaveResponse(this.jogoService.update(jogo));
    } else {
      this.subscribeToSaveResponse(this.jogoService.create(jogo));
    }
  }

  trackFornecedorById(index: number, item: IFornecedor): number {
    return item.id!;
  }

  trackCategoriaById(index: number, item: ICategoria): number {
    return item.id!;
  }

  getSelectedCategoria(option: ICategoria, selectedVals?: ICategoria[]): ICategoria {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJogo>>): void {
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

  protected updateForm(jogo: IJogo): void {
    this.editForm.patchValue({
      id: jogo.id,
      nome: jogo.nome,
      ano: jogo.ano,
      descricao: jogo.descricao,
      preco: jogo.preco,
      image: jogo.image,
      estoque: jogo.estoque,
      fornecedor: jogo.fornecedor,
      categorias: jogo.categorias,
    });

    this.fornecedorsSharedCollection = this.fornecedorService.addFornecedorToCollectionIfMissing(
      this.fornecedorsSharedCollection,
      jogo.fornecedor
    );
    this.categoriasSharedCollection = this.categoriaService.addCategoriaToCollectionIfMissing(
      this.categoriasSharedCollection,
      ...(jogo.categorias ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.fornecedorService
      .query()
      .pipe(map((res: HttpResponse<IFornecedor[]>) => res.body ?? []))
      .pipe(
        map((fornecedors: IFornecedor[]) =>
          this.fornecedorService.addFornecedorToCollectionIfMissing(fornecedors, this.editForm.get('fornecedor')!.value)
        )
      )
      .subscribe((fornecedors: IFornecedor[]) => (this.fornecedorsSharedCollection = fornecedors));

    this.categoriaService
      .query()
      .pipe(map((res: HttpResponse<ICategoria[]>) => res.body ?? []))
      .pipe(
        map((categorias: ICategoria[]) =>
          this.categoriaService.addCategoriaToCollectionIfMissing(categorias, ...(this.editForm.get('categorias')!.value ?? []))
        )
      )
      .subscribe((categorias: ICategoria[]) => (this.categoriasSharedCollection = categorias));
  }

  protected createFromForm(): IJogo {
    return {
      ...new Jogo(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      ano: this.editForm.get(['ano'])!.value,
      descricao: this.editForm.get(['descricao'])!.value,
      preco: this.editForm.get(['preco'])!.value,
      image: this.editForm.get(['image'])!.value,
      estoque: this.editForm.get(['estoque'])!.value,
      fornecedor: this.editForm.get(['fornecedor'])!.value,
      categorias: this.editForm.get(['categorias'])!.value,
    };
  }
}
