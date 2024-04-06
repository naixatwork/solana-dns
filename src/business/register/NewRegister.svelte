<script lang="ts">
    import {programStore} from "#/core/program/program.store";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
    import * as anchor from '@project-serum/anchor'
    import {Wallet} from "@project-serum/anchor";

    const walletSigners = $walletStore.wallets.map((wallet: Wallet) => new anchor.Wallet(wallet));
    $programStore.methods.initDns(['sol']).accounts({
        dnsState: $walletStore.publicKey,
        signer: $walletStore.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId
    }).signers(walletSigners).rpc().then(console.log).catch(console.log)
</script>

<h1>lol</h1>