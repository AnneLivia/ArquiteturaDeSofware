import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJogo, Jogo } from '../jogo.model';
import { JogoService } from '../service/jogo.service';

@Injectable({ providedIn: 'root' })
export class JogoRoutingResolveService implements Resolve<IJogo> {
  constructor(protected service: JogoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJogo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((jogo: HttpResponse<Jogo>) => {
          if (jogo.body) {
            return of(jogo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Jogo());
  }
}
