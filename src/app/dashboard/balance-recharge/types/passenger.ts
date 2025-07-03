export interface PassengerLookupRS {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  balance: number; // No string, es decimal numérico en JSON
  active: boolean; // No "status", es "active" según tu clase Java
}
