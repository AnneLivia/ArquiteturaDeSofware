jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CategoriaService } from '../service/categoria.service';
import { ICategoria, Categoria } from '../categoria.model';

import { CategoriaUpdateComponent } from './categoria-update.component';

describe('Component Tests', () => {
  describe('Categoria Management Update Component', () => {
    let comp: CategoriaUpdateComponent;
    let fixture: ComponentFixture<CategoriaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let categoriaService: CategoriaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CategoriaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CategoriaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoriaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      categoriaService = TestBed.inject(CategoriaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const categoria: ICategoria = { id: 456 };

        activatedRoute.data = of({ categoria });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(categoria));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Categoria>>();
        const categoria = { id: 123 };
        jest.spyOn(categoriaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ categoria });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: categoria }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(categoriaService.update).toHaveBeenCalledWith(categoria);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Categoria>>();
        const categoria = new Categoria();
        jest.spyOn(categoriaService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ categoria });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: categoria }));
        saveSubject.complete();

        // THEN
        expect(categoriaService.create).toHaveBeenCalledWith(categoria);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Categoria>>();
        const categoria = { id: 123 };
        jest.spyOn(categoriaService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ categoria });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(categoriaService.update).toHaveBeenCalledWith(categoria);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
