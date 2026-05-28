export interface IPaymentSession {
  id?: number;
  sessionToken: string;
  tipo: string;
  idReferencia?: number;
  idCuota?: number;
  estado: string;
  importe: number;
  descripcion: string;
  fecha?: string;
  idResultado?: number;
}

export interface IPaymentConfirm {
  titular: string;
  numeroTarjeta: string;
  caducidad: string;
  cvv: string;
}

export interface IPaymentSessionToken {
  sessionToken: string;
}
