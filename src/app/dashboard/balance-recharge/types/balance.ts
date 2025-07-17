export type TransactionType = 'RECHARGE' | 'DEBIT' | 'REFUND'; // ajusta si tienes más

export interface RechargeRQ {
  amount: number; // string si viene de un input, o BigDecimal
  description?: string;
}

export interface FarePaymentRQ {
  amount: number
  description: string
}

export interface BalanceTransactionDetailRS {
  id: number;
  userId: number;
  userFullName: string;
  type: TransactionType;
  amount: number;
  transactionDate: string; // ISO string
  description?: string;
}

