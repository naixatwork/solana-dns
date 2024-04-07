import {derived, writable} from "svelte/store";
import DnsIdl from "#/core/program/dns.json";
import {AnchorProvider, Program} from "@project-serum/anchor";
import type {Dns} from "#/core/program/dns";
import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor"
import {Connection} from "@solana/web3.js";

export const getDnsIdl = (): typeof DnsIdl & Dns => {
    return DnsIdl as typeof DnsIdl & Dns;
};

export const networkStore = writable<string>('');

export const anchorProviderStore = derived([walletStore, workSpace, networkStore], ([$walletStore, $workSpace, $networkStore]) => {
    const connection: Connection = new Connection(
        $networkStore,
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
