import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IJogo, Jogo } from '../jogo.model';

import { JogoService } from './jogo.service';

describe('Jogo Service', () => {
  let service: JogoService;
  let httpMock: HttpTestingController;
  let elemDefault: IJogo;
  let expectedResult: IJogo | IJogo[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JogoService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
      ano: currentDate,
      descricao: 'AAAAAAA',
      preco: 0,
      image: 'AAAAAAA',
      estoque: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ano: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Jogo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ano: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.create(new Jogo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Jogo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          ano: currentDate.format(DATE_FORMAT),
          descricao: 'BBBBBB',
          preco: 1,
          image: 'BBBBBB',
          estoque: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Jogo', () => {
      const patchObject = Object.assign(
        {
          nome: 'BBBBBB',
          ano: currentDate.format(DATE_FORMAT),
          image: 'BBBBBB',
          estoque: 1,
        },
        new Jogo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Jogo', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          ano: currentDate.format(DATE_FORMAT),
          descricao: 'BBBBBB',
          preco: 1,
          image: 'BBBBBB',
          estoque: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Jogo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addJogoToCollectionIfMissing', () => {
      it('should add a Jogo to an empty array', () => {
        const jogo: IJogo = { id: 123 };
        expectedResult = service.addJogoToCollectionIfMissing([], jogo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jogo);
      });

      it('should not add a Jogo to an array that contains it', () => {
        const jogo: IJogo = { id: 123 };
        const jogoCollection: IJogo[] = [
          {
            ...jogo,
          },
          { id: 456 },
        ];
        expectedResult = service.addJogoToCollectionIfMissing(jogoCollection, jogo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Jogo to an array that doesn't contain it", () => {
        const jogo: IJogo = { id: 123 };
        const jogoCollection: IJogo[] = [{ id: 456 }];
        expectedResult = service.addJogoToCollectionIfMissing(jogoCollection, jogo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jogo);
      });

      it('should add only unique Jogo to an array', () => {
        const jogoArray: IJogo[] = [{ id: 123 }, { id: 456 }, { id: 32299 }];
        const jogoCollection: IJogo[] = [{ id: 123 }];
        expectedResult = service.addJogoToCollectionIfMissing(jogoCollection, ...jogoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jogo: IJogo = { id: 123 };
        const jogo2: IJogo = { id: 456 };
        expectedResult = service.addJogoToCollectionIfMissing([], jogo, jogo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jogo);
        expect(expectedResult).toContain(jogo2);
      });

      it('should accept null and undefined values', () => {
        const jogo: IJogo = { id: 123 };
        expectedResult = service.addJogoToCollectionIfMissing([], null, jogo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jogo);
      });

      it('should return initial array if no Jogo is added', () => {
        const jogoCollection: IJogo[] = [{ id: 123 }];
        expectedResult = service.addJogoToCollectionIfMissing(jogoCollection, undefined, null);
        expect(expectedResult).toEqual(jogoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
