import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategoria, getCategoriaIdentifier } from '../categoria.model';

export type EntityResponseType = HttpResponse<ICategoria>;
export type EntityArrayResponseType = HttpResponse<ICategoria[]>;

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categorias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(categoria: ICategoria): Observable<EntityResponseType> {
    return this.http.post<ICategoria>(this.resourceUrl, categoria, { observe: 'response' });
  }

  update(categoria: ICategoria): Observable<EntityResponseType> {
    return this.http.put<ICategoria>(`${this.resourceUrl}/${getCategoriaIdentifier(categoria) as number}`, categoria, {
      observe: 'response',
    });
  }

  partialUpdate(categoria: ICategoria): Observable<EntityResponseType> {
    return this.http.patch<ICategoria>(`${this.resourceUrl}/${getCategoriaIdentifier(categoria) as number}`, categoria, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategoria>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategoria[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCategoriaToCollectionIfMissing(
    categoriaCollection: ICategoria[],
    ...categoriasToCheck: (ICategoria | null | undefined)[]
  ): ICategoria[] {
    const categorias: ICategoria[] = categoriasToCheck.filter(isPresent);
    if (categorias.length > 0) {
      const categoriaCollectionIdentifiers = categoriaCollection.map(categoriaItem => getCategoriaIdentifier(categoriaItem)!);
      const categoriasToAdd = categorias.filter(categoriaItem => {
        const categoriaIdentifier = getCategoriaIdentifier(categoriaItem);
        if (categoriaIdentifier == null || categoriaCollectionIdentifiers.includes(categoriaIdentifier)) {
          return false;
        }
        categoriaCollectionIdentifiers.push(categoriaIdentifier);
        return true;
      });
      return [...categoriasToAdd, ...categoriaCollection];
    }
    return categoriaCollection;
  }
}
