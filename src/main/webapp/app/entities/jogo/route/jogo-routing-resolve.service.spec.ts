jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IJogo, Jogo } from '../jogo.model';
import { JogoService } from '../service/jogo.service';

import { JogoRoutingResolveService } from './jogo-routing-resolve.service';

describe('Jogo routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: JogoRoutingResolveService;
  let service: JogoService;
  let resultJogo: IJogo | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [Router, ActivatedRouteSnapshot],
    });
    mockRouter = TestBed.inject(Router);
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    routingResolveService = TestBed.inject(JogoRoutingResolveService);
    service = TestBed.inject(JogoService);
    resultJogo = undefined;
  });

  describe('resolve', () => {
    it('should return IJogo returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultJogo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultJogo).toEqual({ id: 123 });
    });

    it('should return new IJogo if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultJogo = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultJogo).toEqual(new Jogo());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Jogo })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultJogo = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultJogo).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
