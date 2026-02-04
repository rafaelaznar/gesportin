import { ICategoria } from "./cuota";
import { IUsuario } from "./usuario";

export interface IEquipo {
  id?: number;
  nombre?: string;
  categoria?: ICategoria;
  entrenador?: IUsuario;
  jugadores?: number;
}
