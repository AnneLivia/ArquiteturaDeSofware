jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICategoria, Categoria } from '../categoria.model';
import { CategoriaService } from '../service/categoria.service';

import { CategoriaRoutingResolveService } from './categoria-routing-resolve.service';

describe('Categoria routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: CategoriaRoutingResolveService;
  let service: CategoriaService;
  let resultCategoria: ICategoria | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(CategoriaRoutingResolveService);
    service = TestBed.inject(CategoriaService);
    resultCategoria = undefined;
  });

  describe('resolve', () => {
    it('should return ICategoria returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategoria = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCategoria).toEqual({ id: 123 });
    });

    it('should return new ICategoria if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategoria = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCategoria).toEqual(new Categoria());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Categoria })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCategoria = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCategoria).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
