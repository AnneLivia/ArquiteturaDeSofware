import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFornecedor, Fornecedor } from '../fornecedor.model';
import { FornecedorService } from '../service/fornecedor.service';

@Injectable({ providedIn: 'root' })
export class FornecedorRoutingResolveService implements Resolve<IFornecedor> {
  constructor(protected service: FornecedorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFornecedor> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fornecedor: HttpResponse<Fornecedor>) => {
          if (fornecedor.body) {
            return of(fornecedor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Fornecedor());
  }
}
