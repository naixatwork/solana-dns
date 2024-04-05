<script lang="ts">
    import {AppBar, AppShell} from "@skeletonlabs/skeleton";
    import {WalletMultiButton} from '@svelte-on-solana/wallet-adapter-ui'
    import WalletConnection from "../core/wallet/WalletInit.svelte";
</script>

<WalletConnection/>
<AppShell>
    <svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
            <svelte:fragment slot="lead">
                <div class="flex gap-5 items-center">
                    <img class="aspect-square w-10" src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=029"
                         alt="solana"/>
                    <p class="font-bold text-2xl">solana - dns</p>
                </div>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <WalletMultiButton/>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <div class="p-4 h-full">
        <h1>content</h1>
    </div>
</AppShell>
