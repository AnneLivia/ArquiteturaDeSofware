import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FornecedorService } from '../service/fornecedor.service';

import { FornecedorComponent } from './fornecedor.component';

describe('Component Tests', () => {
  describe('Fornecedor Management Component', () => {
    let comp: FornecedorComponent;
    let fixture: ComponentFixture<FornecedorComponent>;
    let service: FornecedorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [FornecedorComponent],
      })
        .overrideTemplate(FornecedorComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(FornecedorComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(FornecedorService);

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
      expect(comp.fornecedors?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
