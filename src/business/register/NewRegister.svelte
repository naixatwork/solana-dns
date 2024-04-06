<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import * as anchor from '@project-serum/anchor'
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {Keypair} from "@solana/web3.js";

    // console.log($workSpace?.baseAccount)
    // $programStore.methods.initDns(['sol']).accounts({
    //     dnsState: $workSpace?.provider?.publicKey,
    //     signer: $workSpace?.baseAccount?.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId
    // }).signers([Keypair.fromSecretKey($workSpace?.baseAccount.secretKey)]).rpc().then(console.log).catch(console.log)
</script>

<h1>lol</h1>
