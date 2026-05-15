import type Categoria from "./Categoria";
import type Usuario from "./Usuario";

export default interface Produto {
    nome: string;
    descricao: string;
    id: number;
    titulo: string;
    texto: string;
    data: string;
    categoria: Categoria | null;
    usuario: Usuario | null;

}