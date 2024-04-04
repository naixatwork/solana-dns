<script lang="ts">

    // const routes = {
    //     '/': Counter,
    //     '/auth': Dastan,
    // }
    import {AppBar, AppShell} from "@skeletonlabs/skeleton";
</script>

<main>
    <AppShell>
        <svelte:fragment slot="header">
            <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
                <svelte:fragment slot="lead">(icon)</svelte:fragment>
                (title)
                <svelte:fragment slot="trail">(actions)</svelte:fragment>
            </AppBar>
        </svelte:fragment>
        <h1>lol</h1>
    </AppShell>
</main>
