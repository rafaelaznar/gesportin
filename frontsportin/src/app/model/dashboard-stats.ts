export interface IClubResumen {
  totalJugadores: number;
  totalEquipos: number;
  totalPartidos: number;
  totalNoticias: number;
  totalPagos: number;
  totalPagosRecibidos: number;
  totalDeudas: number;
  partidosJugados: number;
  partidosPendientes: number;
}

export interface IEstadoPagos {
  pagados: number;
  pendientes: number;
}

export interface IEquiposPorCategoria {
  categoria: string;
  totalEquipos: number;
}

export interface IPartidoMensual {
  mes: string;
  jugados: number;
  victorias: number;
}

export interface IIngresoMensual {
  mes: string;
  total: number;
}

export interface IDeudaPorEquipo {
  equipo: string;
  deuda: number;
}

export interface IDeudaMensual {
  mes: string;
  total: number;
}

export interface IEquipoDetalle {
  equipo: string;
  categoria: string;
  numJugadores: number;
  partidosJugados: number;
  victorias: number;
}

export interface IDashboardState {
  resumen: IClubResumen;
  pagosEstado: IEstadoPagos;
  equiposCat: IEquiposPorCategoria[];
  partidosMes: IPartidoMensual[];
  ingresos: IIngresoMensual[];
  deudaEquipo: IDeudaPorEquipo[];
  deudaMensual: IDeudaMensual[];
  equiposDetalle: IEquipoDetalle[];
}

export interface IResumenUsuario {
  totalEquipos: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  totalNoticiasClub: number;
}
