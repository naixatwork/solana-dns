<script lang="ts">

    import {AppBar, AppShell} from "@skeletonlabs/skeleton";
</script>

<AppShell>
    <svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
            <svelte:fragment slot="lead">
                <div class="flex gap-2">
                    <img class="aspect-square w-5" src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=029"
                         alt="solana"/>
                    <p class="font-bold">solana - dns</p>
                </div>
            </svelte:fragment>
            <svelte:fragment slot="trail">wallet</svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <div class="p-4 overflow-scroll h-full">
        <h1>content</h1>
    </div>
</AppShell>
