import { ISaverAccountType } from "../../../shared/types/saverAccountType.interface";

export const allSaverBankAccountTypes: ISaverAccountType[] = [
    {
       saving_id: 1,
       account_name: "Saver",
       interest: 2.5,
       money_limit: 10000,
       account_duration: 12,
       created_at: "2023-01-01T00:00:00Z",
    },
    {
       saving_id: 2,
       account_name: "ISA",
       interest: 3.0,
       money_limit: 20000,
       account_duration: 24,
       created_at: "2025-02-08T00:00:00Z", 
    }
]