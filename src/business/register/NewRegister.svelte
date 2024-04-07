<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {onMount} from "svelte";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";

    // onMount(async () => {
    //     $programStore.methods.initDns(['sol']).accounts({
    //         dnsState: $walletStore.wallet?.publicKey,
    //         signer: $workSpace?.baseAccount?.publicKey,
    //         systemProgram: $workSpace?.systemProgram?.programId
    //     }).signers([$workSpace?.baseAccount]).rpc().then(console.log).catch(console.log)
    // })
</script>

<h1>lol</h1>
