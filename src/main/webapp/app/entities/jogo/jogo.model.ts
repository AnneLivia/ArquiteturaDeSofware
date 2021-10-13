import * as dayjs from 'dayjs';
import { IFornecedor } from 'app/entities/fornecedor/fornecedor.model';
import { ICategoria } from 'app/entities/categoria/categoria.model';

export interface IJogo {
  id?: number;
  nome?: string | null;
  ano?: dayjs.Dayjs | null;
  descricao?: string | null;
  preco?: number | null;
  image?: string | null;
  estoque?: number | null;
  fornecedor?: IFornecedor | null;
  categorias?: ICategoria[] | null;
}

export class Jogo implements IJogo {
  constructor(
    public id?: number,
    public nome?: string | null,
    public ano?: dayjs.Dayjs | null,
    public descricao?: string | null,
    public preco?: number | null,
    public image?: string | null,
    public estoque?: number | null,
    public fornecedor?: IFornecedor | null,
    public categorias?: ICategoria[] | null
  ) {}
}

export function getJogoIdentifier(jogo: IJogo): number | undefined {
  return jogo.id;
}
