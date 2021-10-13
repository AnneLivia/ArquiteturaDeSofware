jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { FornecedorService } from '../service/fornecedor.service';
import { IFornecedor, Fornecedor } from '../fornecedor.model';

import { FornecedorUpdateComponent } from './fornecedor-update.component';

describe('Component Tests', () => {
  describe('Fornecedor Management Update Component', () => {
    let comp: FornecedorUpdateComponent;
    let fixture: ComponentFixture<FornecedorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let fornecedorService: FornecedorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FornecedorUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(FornecedorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FornecedorUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      fornecedorService = TestBed.inject(FornecedorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const fornecedor: IFornecedor = { id: 456 };

        activatedRoute.data = of({ fornecedor });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(fornecedor));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Fornecedor>>();
        const fornecedor = { id: 123 };
        jest.spyOn(fornecedorService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ fornecedor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fornecedor }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(fornecedorService.update).toHaveBeenCalledWith(fornecedor);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Fornecedor>>();
        const fornecedor = new Fornecedor();
        jest.spyOn(fornecedorService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ fornecedor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: fornecedor }));
        saveSubject.complete();

        // THEN
        expect(fornecedorService.create).toHaveBeenCalledWith(fornecedor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Fornecedor>>();
        const fornecedor = { id: 123 };
        jest.spyOn(fornecedorService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ fornecedor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(fornecedorService.update).toHaveBeenCalledWith(fornecedor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
