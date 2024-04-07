import {writable} from 'svelte/store'
import type {Dns} from "#/core/program/dns";
import {Keypair, type PublicKey} from "@solana/web3.js";

export type DnsState = {
    publicKey: PublicKey | null
}

const dnsStateStore = writable<DnsState>({
    publicKey: null
})

export default dnsStateStore
