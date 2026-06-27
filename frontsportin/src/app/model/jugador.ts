
import { IEquipo } from "./equipo";
import { IUsuario } from "./usuario";

export interface IJugador {
  id: number;
  dorsal: number;
  posicion: string;
  capitan: boolean;  
  usuario: IUsuario;
  equipo: IEquipo;
  pagos: number;
}
