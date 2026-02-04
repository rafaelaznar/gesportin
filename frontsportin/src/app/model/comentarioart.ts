import { IArticulo } from "./articulo"

export interface IComentarioart {
    id: number
    contenido: string
    idArticulo: number
    idUsuario: number
    articulo?: IArticulo
    usuario?: IUsuario
}
