export interface IJugador {
  id: number;
  dorsal: number;
  posicion: string;
  capitan: boolean;
  imagen: string | null;
  usuario: IUsuario;
  equipo: IEquipo;
  pagos: number;
}

export interface IUsuario {
  id: number;
  nombre: string;
  apellido1: string;
  apellido2: string;
  username: string;
}

export interface IEquipo {
  id: number;
  nombre: string;
}

