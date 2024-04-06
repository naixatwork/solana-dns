<script lang="ts">
    import {ConnectionProvider, WalletProvider} from '@svelte-on-solana/wallet-adapter-ui'
    import {clusterApiUrl} from '@solana/web3.js'
    import {onMount} from "svelte";
    import type {Adapter} from "@solana/wallet-adapter-base";
    import {alchemyWallet} from "#/core/program/program.store";

    const network = alchemyWallet
    const localStorageKey = 'solWalletAdapter'
    let wallets: Adapter[] = []
    onMount(async () => {
        const {PhantomWalletAdapter} = await import('@solana/wallet-adapter-wallets')
        wallets = [new PhantomWalletAdapter()]
    })
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect/>
<ConnectionProvider {network}/>
