import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { JogoService } from '../service/jogo.service';

import { JogoComponent } from './jogo.component';

describe('Component Tests', () => {
  describe('Jogo Management Component', () => {
    let comp: JogoComponent;
    let fixture: ComponentFixture<JogoComponent>;
    let service: JogoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JogoComponent],
      })
        .overrideTemplate(JogoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JogoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(JogoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.jogos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
