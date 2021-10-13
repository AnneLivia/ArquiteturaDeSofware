jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IFornecedor, Fornecedor } from '../fornecedor.model';
import { FornecedorService } from '../service/fornecedor.service';

import { FornecedorRoutingResolveService } from './fornecedor-routing-resolve.service';

describe('Fornecedor routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: FornecedorRoutingResolveService;
  let service: FornecedorService;
  let resultFornecedor: IFornecedor | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(FornecedorRoutingResolveService);
    service = TestBed.inject(FornecedorService);
    resultFornecedor = undefined;
  });

  describe('resolve', () => {
    it('should return IFornecedor returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFornecedor = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFornecedor).toEqual({ id: 123 });
    });

    it('should return new IFornecedor if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFornecedor = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultFornecedor).toEqual(new Fornecedor());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Fornecedor })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultFornecedor = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultFornecedor).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
