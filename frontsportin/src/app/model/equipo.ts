export interface IPersonaRef {
  id?: number;
  nombre?: string;
  apellido1?: string;
}

export interface ICategoriaRef {
  id?: number;
  nombre?: string;
}

export interface IEquipo {
  id?: number;
  nombre?: string;
  categoria?: ICategoriaRef;
  entrenador?: IPersonaRef;
  jugadores?: number;
}
