export interface IFornecedor {
  id?: number;
  nome?: string | null;
}

export class Fornecedor implements IFornecedor {
  constructor(public id?: number, public nome?: string | null) {}
}

export function getFornecedorIdentifier(fornecedor: IFornecedor): number | undefined {
  return fornecedor.id;
}
