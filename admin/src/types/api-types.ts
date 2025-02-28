import {
  AnimalData,
  CreatorData,
  MedicalData,
  IndividualData,
  BotanyData,
  IUser,
  IDonator,
  ISubscription,
  IPlan,
  ITransaction,
} from "./type";

export type UserResponse = {
  success: boolean;
  user: IUser;
};

export type AllUsersResponse = {
  success: boolean;
  count: number;
  resultPerPage: number;
  filteredUsersCount: number;
  users: IUser[];
};

export type TransactionResponse = {
  success: boolean;
  transaction: ITransaction;
};

export type AllTransactionsResponse = {
  success: boolean;
  count: number;
  resultPerPage: number;
  filteredTransactionsCount: number;
  transactions: ITransaction[];
};

export type DonatorResponse = {
  success: boolean;
  donator: IDonator;
};

export type AllDonatorsResponse = {
  success: boolean;
  count: number;
  resultPerPage: number;
  filteredDonatorsCount: number;
  donators: IDonator[];
};

export type PlanResponse = {
  success: boolean;
  plan: IPlan;
};

export type AllPlansResponse = {
  success: boolean;
  count: number;
  resultPerPage: number;
  filteredPlanCount: number;
  plans: IPlan[];
};

export type SubscriptionResponse = {
  success: boolean;
  subscription: ISubscription;
};

export type AllSubscriptionResponse = {
  success: boolean;
  count: number;
  resultPerPage: number;
  filteredSubscriptionsCount: number;
  subscriptions: ISubscription[];
};

export type CardResponse = {
  success: boolean;
  card: BotanyData | IndividualData | MedicalData | CreatorData | AnimalData;
};

export type AllCardsResponse = {
  success: boolean;
  count: number;
  resultPerPage: number;
  cards:
    | BotanyData[]
    | IndividualData[]
    | MedicalData[]
    | CreatorData[]
    | AnimalData[];
};
