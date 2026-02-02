export interface IFactura {
  id: number
  fecha: string
  usuario: IUsuario
  compras: number
}

export interface IUsuario {
  id: number
  nombre: string
  apellido1: string
  apellido2: string
  username: string
  password: string
  fechaAlta: string
  genero: number
  tipousuario: ITipousuario
  rolusuario: IRolusuario
  club: IClub
  comentarios: number
  puntuaciones: number
  comentarioarts: number
  carritos: number
  facturas: number
}

export interface ITipousuario {
  id: number
  descripcion: string
  usuarios: number
}

export interface IRolusuario {
  id: number
  descripcion: string
  usuarios: number
}

export interface IClub {
  id: number
  nombre: string
  direccion: string
  telefono: string
  fechaAlta: string
  imagen: any
  temporadas: number
  noticias: number
  tipoarticulos: number
  usuarios: number
}