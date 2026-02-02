export interface ITipoarticulo {
  id: number
  descripcion: string
  club: IClub
  articulos: number
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
