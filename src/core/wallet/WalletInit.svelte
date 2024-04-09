<script lang="ts">
    import {WalletProvider} from '@svelte-on-solana/wallet-adapter-ui'
    import {onMount} from "svelte";
    import type {Adapter} from "@solana/wallet-adapter-base";
    import {getDnsIdl} from "#/core/program/program.store";
    import {AnchorConnectionProvider} from "@svelte-on-solana/wallet-adapter-anchor";

    export let network: string;

    const localStorageKey = 'solWalletAdapter'
    let wallets: Adapter[] = []
    onMount(async () => {
        const {PhantomWalletAdapter, SolflareWalletAdapter} = await import('@solana/wallet-adapter-wallets')
        wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
    })
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect/>
<AnchorConnectionProvider idl={getDnsIdl()} config="processed" {network}/>
