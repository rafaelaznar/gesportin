export interface IArticulo {
  id: number
  descripcion: string
  precio: number
  descuento: number
  imagen: any
  tipoarticulo: ITipoarticulo
  comentarioarts: number
  compras: number
  carritos: number
}

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





