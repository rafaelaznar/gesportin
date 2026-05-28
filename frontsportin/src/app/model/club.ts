export interface IClub {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    latitud?: number;
    longitud?: number;
    fechaAlta: Date;
    imagen: string | null;
    temporadas: number;
    noticias: number;
    tipoarticulos: number;
    usuarios: number;
}
