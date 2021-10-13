import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CategoriaDetailComponent } from './categoria-detail.component';

describe('Component Tests', () => {
  describe('Categoria Management Detail Component', () => {
    let comp: CategoriaDetailComponent;
    let fixture: ComponentFixture<CategoriaDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CategoriaDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ categoria: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(CategoriaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CategoriaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load categoria on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.categoria).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
