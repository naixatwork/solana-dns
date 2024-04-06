<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
    import * as anchor from '@project-serum/anchor'
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {web3} from "@project-serum/anchor";

    $programStore.methods.initDns(['sol']).accounts({
        dnsState: $walletStore.publicKey,
        signer: $walletStore.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
    }).signers([web3.Keypair.fromSecretKey($workSpace?.baseAccount?.secretKey)]).rpc().then(console.log).catch(console.log)

</script>

<h1>lol</h1>
