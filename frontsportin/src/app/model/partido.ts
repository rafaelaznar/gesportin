import { IEstadopartido } from "./estadopartido";
import { ILiga } from "./liga";

export interface IPartido {
    id: number;
    rival: string;
    liga: ILiga;
    local: boolean;
    resultado: string;
    fecha?: string;
    lugar: string;
    estadopartido?: IEstadopartido;
    comentario?: string;
}

