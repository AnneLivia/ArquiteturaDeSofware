jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JogoService } from '../service/jogo.service';
import { IJogo, Jogo } from '../jogo.model';
import { IFornecedor } from 'app/entities/fornecedor/fornecedor.model';
import { FornecedorService } from 'app/entities/fornecedor/service/fornecedor.service';
import { ICategoria } from 'app/entities/categoria/categoria.model';
import { CategoriaService } from 'app/entities/categoria/service/categoria.service';

import { JogoUpdateComponent } from './jogo-update.component';

describe('Component Tests', () => {
  describe('Jogo Management Update Component', () => {
    let comp: JogoUpdateComponent;
    let fixture: ComponentFixture<JogoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jogoService: JogoService;
    let fornecedorService: FornecedorService;
    let categoriaService: CategoriaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JogoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JogoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JogoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jogoService = TestBed.inject(JogoService);
      fornecedorService = TestBed.inject(FornecedorService);
      categoriaService = TestBed.inject(CategoriaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Fornecedor query and add missing value', () => {
        const jogo: IJogo = { id: 456 };
        const fornecedor: IFornecedor = { id: 70932 };
        jogo.fornecedor = fornecedor;

        const fornecedorCollection: IFornecedor[] = [{ id: 42750 }];
        jest.spyOn(fornecedorService, 'query').mockReturnValue(of(new HttpResponse({ body: fornecedorCollection })));
        const additionalFornecedors = [fornecedor];
        const expectedCollection: IFornecedor[] = [...additionalFornecedors, ...fornecedorCollection];
        jest.spyOn(fornecedorService, 'addFornecedorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ jogo });
        comp.ngOnInit();

        expect(fornecedorService.query).toHaveBeenCalled();
        expect(fornecedorService.addFornecedorToCollectionIfMissing).toHaveBeenCalledWith(fornecedorCollection, ...additionalFornecedors);
        expect(comp.fornecedorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Categoria query and add missing value', () => {
        const jogo: IJogo = { id: 456 };
        const categorias: ICategoria[] = [{ id: 58629 }];
        jogo.categorias = categorias;

        const categoriaCollection: ICategoria[] = [{ id: 9223 }];
        jest.spyOn(categoriaService, 'query').mockReturnValue(of(new HttpResponse({ body: categoriaCollection })));
        const additionalCategorias = [...categorias];
        const expectedCollection: ICategoria[] = [...additionalCategorias, ...categoriaCollection];
        jest.spyOn(categoriaService, 'addCategoriaToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ jogo });
        comp.ngOnInit();

        expect(categoriaService.query).toHaveBeenCalled();
        expect(categoriaService.addCategoriaToCollectionIfMissing).toHaveBeenCalledWith(categoriaCollection, ...additionalCategorias);
        expect(comp.categoriasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jogo: IJogo = { id: 456 };
        const fornecedor: IFornecedor = { id: 34782 };
        jogo.fornecedor = fornecedor;
        const categorias: ICategoria = { id: 3287 };
        jogo.categorias = [categorias];

        activatedRoute.data = of({ jogo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jogo));
        expect(comp.fornecedorsSharedCollection).toContain(fornecedor);
        expect(comp.categoriasSharedCollection).toContain(categorias);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Jogo>>();
        const jogo = { id: 123 };
        jest.spyOn(jogoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ jogo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jogo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jogoService.update).toHaveBeenCalledWith(jogo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Jogo>>();
        const jogo = new Jogo();
        jest.spyOn(jogoService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ jogo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jogo }));
        saveSubject.complete();

        // THEN
        expect(jogoService.create).toHaveBeenCalledWith(jogo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Jogo>>();
        const jogo = { id: 123 };
        jest.spyOn(jogoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ jogo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jogoService.update).toHaveBeenCalledWith(jogo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackFornecedorById', () => {
        it('Should return tracked Fornecedor primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFornecedorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCategoriaById', () => {
        it('Should return tracked Categoria primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCategoriaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCategoria', () => {
        it('Should return option if no Categoria is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedCategoria(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Categoria for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedCategoria(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Categoria is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedCategoria(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
