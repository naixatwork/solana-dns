import {writable} from 'svelte/store'
import type {Dns} from "#/core/program/dns";
import {Keypair, type PublicKey} from "@solana/web3.js";

export type DnsState = {
    publicKey: PublicKey | null,
    account: Record<string, any>
}

const dnsStateStore = writable<DnsState>({
    publicKey: null,
    account: {}
})

export default dnsStateStore
