import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFornecedor, getFornecedorIdentifier } from '../fornecedor.model';

export type EntityResponseType = HttpResponse<IFornecedor>;
export type EntityArrayResponseType = HttpResponse<IFornecedor[]>;

@Injectable({ providedIn: 'root' })
export class FornecedorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fornecedors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fornecedor: IFornecedor): Observable<EntityResponseType> {
    return this.http.post<IFornecedor>(this.resourceUrl, fornecedor, { observe: 'response' });
  }

  update(fornecedor: IFornecedor): Observable<EntityResponseType> {
    return this.http.put<IFornecedor>(`${this.resourceUrl}/${getFornecedorIdentifier(fornecedor) as number}`, fornecedor, {
      observe: 'response',
    });
  }

  partialUpdate(fornecedor: IFornecedor): Observable<EntityResponseType> {
    return this.http.patch<IFornecedor>(`${this.resourceUrl}/${getFornecedorIdentifier(fornecedor) as number}`, fornecedor, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFornecedor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFornecedor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFornecedorToCollectionIfMissing(
    fornecedorCollection: IFornecedor[],
    ...fornecedorsToCheck: (IFornecedor | null | undefined)[]
  ): IFornecedor[] {
    const fornecedors: IFornecedor[] = fornecedorsToCheck.filter(isPresent);
    if (fornecedors.length > 0) {
      const fornecedorCollectionIdentifiers = fornecedorCollection.map(fornecedorItem => getFornecedorIdentifier(fornecedorItem)!);
      const fornecedorsToAdd = fornecedors.filter(fornecedorItem => {
        const fornecedorIdentifier = getFornecedorIdentifier(fornecedorItem);
        if (fornecedorIdentifier == null || fornecedorCollectionIdentifiers.includes(fornecedorIdentifier)) {
          return false;
        }
        fornecedorCollectionIdentifiers.push(fornecedorIdentifier);
        return true;
      });
      return [...fornecedorsToAdd, ...fornecedorCollection];
    }
    return fornecedorCollection;
  }
}
