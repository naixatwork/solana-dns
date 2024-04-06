<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import * as anchor from '@project-serum/anchor'
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";

    // console.log($workSpace?.baseAccount)
    $programStore.methods.initDns(['sol']).accounts({
        dnsState: $walletStore.wallet.publicKey,
        signer: $workSpace?.baseAccount?.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
    }).signers([$workSpace?.baseAccount]).rpc().then(console.log).catch(console.log)
</script>

<h1>lol</h1>
