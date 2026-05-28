import { ICuota } from "./cuota";
import { IJugador } from "./jugador";
import { IPaymentSession } from "./payment-session";

export interface IPago {
  id: number;
  cuota: ICuota;
  jugador: IJugador;
  paymentSession?: IPaymentSession | null;
  fecha: string;
}

