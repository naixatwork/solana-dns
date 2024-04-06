import {derived} from "svelte/store";
import {clusterApiUrl, Connection} from "@solana/web3.js";
import DnsIdl from "#/core/program/dns.json";
import {AnchorProvider, Program} from "@project-serum/anchor";
import type {Dns} from "#/core/program/dns";
import {walletStore} from "@svelte-on-solana/wallet-adapter-core";

const commitmentLevel = "processed";

export const getDnsIdl = (): typeof DnsIdl & Dns => {
    return DnsIdl as typeof DnsIdl & Dns;
}

export const anchorProviderStore = derived(walletStore, ($walletStore) => {
        const connection: Connection = new Connection(clusterApiUrl('devnet'), commitmentLevel);
        return new AnchorProvider(connection, $walletStore.wallet, {
            preflightCommitment: commitmentLevel,
        })
    }
)

export const programStore = derived([anchorProviderStore, walletStore], ([$anchorProviderStore, $walletStore]) => {
    const dnsIdl = getDnsIdl()
    const program = new Program<Dns>(
        dnsIdl,
        dnsIdl.metadata.address,
        $anchorProviderStore
    ) as Program<Dns>

    // if ($walletStore.publicKey) {
    //     program.methods.initDns(['sol']).accounts({
    //         dnsState: getDnsIdl().metadata.address,
    //         systemProgram: anchor.web3.SystemProgram.programId,
    //         signer: $walletStore.publicKey.toString()
    //     }).rpc().then(console.log)
    // }

    return program
})
