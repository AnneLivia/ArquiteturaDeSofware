import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CategoriaService } from '../service/categoria.service';

import { CategoriaComponent } from './categoria.component';

describe('Component Tests', () => {
  describe('Categoria Management Component', () => {
    let comp: CategoriaComponent;
    let fixture: ComponentFixture<CategoriaComponent>;
    let service: CategoriaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CategoriaComponent],
      })
        .overrideTemplate(CategoriaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CategoriaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(CategoriaService);

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
      expect(comp.categorias?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
