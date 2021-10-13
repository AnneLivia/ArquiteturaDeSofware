import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { JogoDetailComponent } from './jogo-detail.component';

describe('Component Tests', () => {
  describe('Jogo Management Detail Component', () => {
    let comp: JogoDetailComponent;
    let fixture: ComponentFixture<JogoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [JogoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ jogo: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(JogoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(JogoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load jogo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.jogo).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
