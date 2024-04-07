<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {onMount} from "svelte";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
    import {web3} from "@project-serum/anchor";

    onMount(async () => {
        $programStore.account.dnsState.all().then(console.log)
        const dnsState = await $programStore.account.dnsState.all()
        $programStore.methods.initDns(['sol', 'solana', 'mvx']).accounts({
            dnsState: dnsState[0].publicKey,
            signer: $workSpace.baseAccount.publicKey,
            systemProgram: web3.SystemProgram.programId
        }).signers([$workSpace.baseAccount]).rpc().then(console.log).catch(console.error)
    })
</script>

<h1>lol</h1>
