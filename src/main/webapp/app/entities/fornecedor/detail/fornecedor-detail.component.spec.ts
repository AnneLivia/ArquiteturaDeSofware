import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FornecedorDetailComponent } from './fornecedor-detail.component';

describe('Component Tests', () => {
  describe('Fornecedor Management Detail Component', () => {
    let comp: FornecedorDetailComponent;
    let fixture: ComponentFixture<FornecedorDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [FornecedorDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ fornecedor: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(FornecedorDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(FornecedorDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load fornecedor on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.fornecedor).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
