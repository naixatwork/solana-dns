<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {onMount} from "svelte";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";

    onMount(async () => {
        $programStore.methods.setPrimaryDomain("alchemy").accounts({
            systemProgram: $workSpace.systemProgram.programId,
            domain: $walletStore.wallet?.publicKey,
            primaryDomain: $walletStore.wallet?.publicKey,
            authority: $walletStore.wallet?.publicKey
        }).signers([$workSpace.baseAccount]).rpc().then(console.log).catch(console.log)
    })
</script>

<h1>lol</h1>
