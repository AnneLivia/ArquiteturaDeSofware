import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJogo, getJogoIdentifier } from '../jogo.model';

export type EntityResponseType = HttpResponse<IJogo>;
export type EntityArrayResponseType = HttpResponse<IJogo[]>;

@Injectable({ providedIn: 'root' })
export class JogoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jogos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(jogo: IJogo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jogo);
    return this.http
      .post<IJogo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(jogo: IJogo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jogo);
    return this.http
      .put<IJogo>(`${this.resourceUrl}/${getJogoIdentifier(jogo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(jogo: IJogo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jogo);
    return this.http
      .patch<IJogo>(`${this.resourceUrl}/${getJogoIdentifier(jogo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IJogo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJogo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addJogoToCollectionIfMissing(jogoCollection: IJogo[], ...jogosToCheck: (IJogo | null | undefined)[]): IJogo[] {
    const jogos: IJogo[] = jogosToCheck.filter(isPresent);
    if (jogos.length > 0) {
      const jogoCollectionIdentifiers = jogoCollection.map(jogoItem => getJogoIdentifier(jogoItem)!);
      const jogosToAdd = jogos.filter(jogoItem => {
        const jogoIdentifier = getJogoIdentifier(jogoItem);
        if (jogoIdentifier == null || jogoCollectionIdentifiers.includes(jogoIdentifier)) {
          return false;
        }
        jogoCollectionIdentifiers.push(jogoIdentifier);
        return true;
      });
      return [...jogosToAdd, ...jogoCollection];
    }
    return jogoCollection;
  }

  protected convertDateFromClient(jogo: IJogo): IJogo {
    return Object.assign({}, jogo, {
      ano: jogo.ano?.isValid() ? jogo.ano.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ano = res.body.ano ? dayjs(res.body.ano) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((jogo: IJogo) => {
        jogo.ano = jogo.ano ? dayjs(jogo.ano) : undefined;
      });
    }
    return res;
  }
}
