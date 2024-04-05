import type {Dns} from "#/core/program/dns";

import type {
    AccountNamespace,
    IdlAccounts,
    ProgramAccount,
} from "@project-serum/anchor/dist/cjs/program/namespace";

export type DnsAccountName = keyof AccountNamespace<Dns>;

export type DnsAccount<T extends DnsAccountName> = ProgramAccount<
    IdlAccounts<Dns>[T]
>;
