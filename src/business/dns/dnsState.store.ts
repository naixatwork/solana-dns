import {writable} from 'svelte/store'
import {type PublicKey} from "@solana/web3.js";
import logger, {info} from "#/shared/log/logger";

export type DnsState = {
    publicKey: PublicKey | null,
    account: Record<string, any>
}

const dnsStateStore = writable<DnsState>({
    publicKey: null,
    account: {}
})

dnsStateStore.subscribe((dnsState) => {
    logger(info, "reacting to dnsStateStore", {dnsState})
})

export default dnsStateStore

