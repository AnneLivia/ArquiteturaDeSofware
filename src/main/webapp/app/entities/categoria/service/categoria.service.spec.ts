import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICategoria, Categoria } from '../categoria.model';

import { CategoriaService } from './categoria.service';

describe('Categoria Service', () => {
  let service: CategoriaService;
  let httpMock: HttpTestingController;
  let elemDefault: ICategoria;
  let expectedResult: ICategoria | ICategoria[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CategoriaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Categoria', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Categoria()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Categoria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Categoria', () => {
      const patchObject = Object.assign({}, new Categoria());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Categoria', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Categoria', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCategoriaToCollectionIfMissing', () => {
      it('should add a Categoria to an empty array', () => {
        const categoria: ICategoria = { id: 123 };
        expectedResult = service.addCategoriaToCollectionIfMissing([], categoria);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categoria);
      });

      it('should not add a Categoria to an array that contains it', () => {
        const categoria: ICategoria = { id: 123 };
        const categoriaCollection: ICategoria[] = [
          {
            ...categoria,
          },
          { id: 456 },
        ];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, categoria);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Categoria to an array that doesn't contain it", () => {
        const categoria: ICategoria = { id: 123 };
        const categoriaCollection: ICategoria[] = [{ id: 456 }];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, categoria);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categoria);
      });

      it('should add only unique Categoria to an array', () => {
        const categoriaArray: ICategoria[] = [{ id: 123 }, { id: 456 }, { id: 55908 }];
        const categoriaCollection: ICategoria[] = [{ id: 123 }];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, ...categoriaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const categoria: ICategoria = { id: 123 };
        const categoria2: ICategoria = { id: 456 };
        expectedResult = service.addCategoriaToCollectionIfMissing([], categoria, categoria2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categoria);
        expect(expectedResult).toContain(categoria2);
      });

      it('should accept null and undefined values', () => {
        const categoria: ICategoria = { id: 123 };
        expectedResult = service.addCategoriaToCollectionIfMissing([], null, categoria, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categoria);
      });

      it('should return initial array if no Categoria is added', () => {
        const categoriaCollection: ICategoria[] = [{ id: 123 }];
        expectedResult = service.addCategoriaToCollectionIfMissing(categoriaCollection, undefined, null);
        expect(expectedResult).toEqual(categoriaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
