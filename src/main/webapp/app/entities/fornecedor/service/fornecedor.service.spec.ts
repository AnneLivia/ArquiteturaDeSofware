import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFornecedor, Fornecedor } from '../fornecedor.model';

import { FornecedorService } from './fornecedor.service';

describe('Fornecedor Service', () => {
  let service: FornecedorService;
  let httpMock: HttpTestingController;
  let elemDefault: IFornecedor;
  let expectedResult: IFornecedor | IFornecedor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FornecedorService);
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

    it('should create a Fornecedor', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Fornecedor()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fornecedor', () => {
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

    it('should partial update a Fornecedor', () => {
      const patchObject = Object.assign({}, new Fornecedor());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fornecedor', () => {
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

    it('should delete a Fornecedor', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFornecedorToCollectionIfMissing', () => {
      it('should add a Fornecedor to an empty array', () => {
        const fornecedor: IFornecedor = { id: 123 };
        expectedResult = service.addFornecedorToCollectionIfMissing([], fornecedor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fornecedor);
      });

      it('should not add a Fornecedor to an array that contains it', () => {
        const fornecedor: IFornecedor = { id: 123 };
        const fornecedorCollection: IFornecedor[] = [
          {
            ...fornecedor,
          },
          { id: 456 },
        ];
        expectedResult = service.addFornecedorToCollectionIfMissing(fornecedorCollection, fornecedor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fornecedor to an array that doesn't contain it", () => {
        const fornecedor: IFornecedor = { id: 123 };
        const fornecedorCollection: IFornecedor[] = [{ id: 456 }];
        expectedResult = service.addFornecedorToCollectionIfMissing(fornecedorCollection, fornecedor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fornecedor);
      });

      it('should add only unique Fornecedor to an array', () => {
        const fornecedorArray: IFornecedor[] = [{ id: 123 }, { id: 456 }, { id: 54320 }];
        const fornecedorCollection: IFornecedor[] = [{ id: 123 }];
        expectedResult = service.addFornecedorToCollectionIfMissing(fornecedorCollection, ...fornecedorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fornecedor: IFornecedor = { id: 123 };
        const fornecedor2: IFornecedor = { id: 456 };
        expectedResult = service.addFornecedorToCollectionIfMissing([], fornecedor, fornecedor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fornecedor);
        expect(expectedResult).toContain(fornecedor2);
      });

      it('should accept null and undefined values', () => {
        const fornecedor: IFornecedor = { id: 123 };
        expectedResult = service.addFornecedorToCollectionIfMissing([], null, fornecedor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fornecedor);
      });

      it('should return initial array if no Fornecedor is added', () => {
        const fornecedorCollection: IFornecedor[] = [{ id: 123 }];
        expectedResult = service.addFornecedorToCollectionIfMissing(fornecedorCollection, undefined, null);
        expect(expectedResult).toEqual(fornecedorCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
