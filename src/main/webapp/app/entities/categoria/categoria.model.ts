import { IJogo } from 'app/entities/jogo/jogo.model';

export interface ICategoria {
  id?: number;
  nome?: string | null;
  jogos?: IJogo[] | null;
}

export class Categoria implements ICategoria {
  constructor(public id?: number, public nome?: string | null, public jogos?: IJogo[] | null) {}
}

export function getCategoriaIdentifier(categoria: ICategoria): number | undefined {
  return categoria.id;
}
