<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import {fromPromise} from "rxjs/internal/observable/innerFrom";
    import {getToastStore} from "@skeletonlabs/skeleton";
    import logger, {error, info} from "#/shared/log/logger";
    import {PublicKey} from "@solana/web3.js";
    import * as anchor from "@project-serum/anchor"
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";

    const toastStore = getToastStore()
    const reInitializeDnsState = async () => {
        if (!$dnsStateStore.publicKey) {
            toastStore.trigger({
                message: "Couldn't get current DNS public key.",
                background: "variant-filled-error"
            })
            return;
        }
        if (!$walletStore.wallet?.publicKey) {
            toastStore.trigger({
                message: "Couldn't find wallet publicKey.",
                background: "variant-filled-error"
            })
            return;
        }

        const topDomains = $dnsStateStore.account?.allowedTopDomains as string[]

        /* throws Error: Invalid seeds, address must fall off the curve*/
        // const dnsStatePDA = PublicKey.createProgramAddressSync([Buffer.from('dns_state')], $programStore.programId);

        /* throws constraint seeds? */
        // const dnsStatePDA = await PublicKey.createWithSeed($dnsStateStore.publicKey, 'dns_state', $programStore.programId);

        const [dnsStatePDA] = PublicKey.findProgramAddressSync([Buffer.from('dns_state')], $programStore.programId)

        fromPromise($programStore.methods.initDns(topDomains).accounts({
            // dnsState: $dnsStateStore?.publicKey, // weird, only for testing
            dnsState: dnsStatePDA,
            signer: $walletStore.wallet.publicKey,
            systemProgram: web3.SystemProgram.programId
        })
            .signers([$walletStore.wallet])
            .rpc())
            .subscribe({
                next: (response) => {
                    logger(info, "reInitializeDnsState", "reinitialized", {response})
                    toastStore.trigger({
                        message: "Reinitialized DNS state",
                        background: "variant-filled-success"
                    })
                },
                error: (err) => {
                    logger(error, "reInitializeDnsState", "Already Initialized", {err})
                    toastStore.trigger({
                        message: `Already Initialized`,
                        background: "variant-filled-error"
                    })
                }
            })
    }
</script>

<button on:click={reInitializeDnsState} class="btn variant-ghost-warning">DEMO ONLY - Reinitialize DNS state</button>
