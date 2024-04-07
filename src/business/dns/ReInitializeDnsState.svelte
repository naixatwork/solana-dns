<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import {fromPromise} from "rxjs/internal/observable/innerFrom";
    import {getToastStore} from "@skeletonlabs/skeleton";
    import logger, {error, info} from "#/shared/log/logger";

    const toastStore = getToastStore()
    const reInitializeDnsState = async () => {
        if (!$dnsStateStore.publicKey) {
            toastStore.trigger({
                message: "Couldn't get current DNS public key.",
                background: "variant-filled-error"
            })
            return;
        }
        if (!$workSpace?.baseAccount) {
            toastStore.trigger({
                message: "Couldn't verify user to sign the transaction.",
                background: "variant-filled-error"
            })
            return;
        }

        const topDomains = $dnsStateStore.account?.allowedTopDomains as string[]

        fromPromise($programStore.methods.initDns(topDomains).accounts({
            dnsState: $dnsStateStore?.publicKey, // weird, only for testing
            signer: $workSpace?.baseAccount?.publicKey,
            systemProgram: web3.SystemProgram.programId
        })
            .signers([$workSpace.baseAccount])
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
