import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICategoria, Categoria } from '../categoria.model';
import { CategoriaService } from '../service/categoria.service';

@Injectable({ providedIn: 'root' })
export class CategoriaRoutingResolveService implements Resolve<ICategoria> {
  constructor(protected service: CategoriaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICategoria> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((categoria: HttpResponse<Categoria>) => {
          if (categoria.body) {
            return of(categoria.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Categoria());
  }
}
