import {derived} from "svelte/store";
import DnsIdl from "#/core/program/dns.json";
import {AnchorProvider, Program} from "@project-serum/anchor";
import type {Dns} from "#/core/program/dns";
import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor"
import {Connection} from "@solana/web3.js";

export const alchemyNetwork =
    "https://solana-devnet.g.alchemy.com/v2/Tx4DSX20gm4iWR0euk93Q1cdIHF_sz-f";

export const getDnsIdl = (): typeof DnsIdl & Dns => {
    return DnsIdl as typeof DnsIdl & Dns;
};

export const anchorProviderStore = derived([walletStore, workSpace], ([$walletStore, $workSpace]) => {
    const connection: Connection = new Connection(
        alchemyNetwork,
        "processed",
    );
    return new AnchorProvider(connection, $walletStore.wallet, {
        preflightCommitment: "processed",
    });
});

export const programStore = derived(
    [anchorProviderStore],
    ([$anchorProviderStore]) => {
        const dnsIdl = getDnsIdl();
        return new Program<Dns>(
            dnsIdl,
            dnsIdl.metadata.address,
            $anchorProviderStore,
        ) as Program<Dns>;
    },
);
