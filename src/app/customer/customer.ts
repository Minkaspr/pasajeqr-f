export type TransactionType = 'RECHARGE' | 'PAYMENT'; 

export interface TransactionDetail {
  type: TransactionType;
  amount: number;
  transactionDate: string;
  description: string;
}

export interface PassengerBalanceHistory {
  currentBalance: number;
  transactions: TransactionDetail[];
}
export interface TripQrValidationRS{
  tripId: number;
  tripCode: string;
  status: "SCHEDULED" | "CANCELED" | "IN_PROGRESS" | "COMPLETED";
}
