<script lang="ts">
    import {Server, ServerCog, ServerCrash} from "lucide-svelte";
    import {first, firstValueFrom, map, tap} from "rxjs";
    import {fromPromise} from "rxjs/internal/observable/innerFrom";
    import {programStore} from "#/core/program/program.store";
    import {getToastStore, popup, type PopupSettings} from "@skeletonlabs/skeleton";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import ReInitializeDnsState from "#/business/dns/ReInitializeDnsState.svelte";

    const toastStore = getToastStore()

    const dnsState$ = firstValueFrom(fromPromise($programStore.account.dnsState.all()).pipe(
        map((dnsStates) => {
            if (!dnsStates[0]) {
                toastStore.trigger({
                    message: "Couldn't get DNS state",
                    background: "variant-filled-error"
                })
            }
            return dnsStates[0]
        }),
        tap((dnsState) => {
            dnsStateStore.set(dnsState)
        }),
        first(),
    ))

    const popupFeatured: PopupSettings = {
        event: 'click',
        target: 'popupFeatured',
        placement: 'bottom',
    };
</script>

{#await dnsState$}
    <button type="button" class="btn variant-glass-warning" use:popup={popupFeatured}>
        <span><ServerCog/></span>
        <span class="capitalize">reinitialize | <span class="uppercase">dns</span></span>
    </button>
{:then dnsState}
    <button type="button" class="btn variant-ghost-success" use:popup={popupFeatured}>
        <span><Server/></span>
        <span class="capitalize">reinitialize | <span class="uppercase">dns</span></span>
    </button>
{:catch error}
    <button type="button" class="btn variant-ghost-error" use:popup={popupFeatured}>
        <span><ServerCrash/></span>
        <span class="capitalize">reinitialize | <span class="uppercase">dns</span></span>
    </button>
{/await}


<div class="card p-5 px-8 shadow-xl" data-popup="popupFeatured">
    {#await dnsState$}
        <p class="text-xl">loading DNS state</p>
    {:then dnsState}
        <div class="flex flex-col gap-2">
            <h5 class="h5 capitalize">primary domains</h5>
            <div class="flex gap-1 mb-5">
                {#each dnsState.account.allowedTopDomains as topDomains}
                    <span class="badge variant-filled-tertiary">{topDomains}</span>
                {/each}
            </div>
            <h5 class="h5 capitalize">reinitialize DNS state</h5>
            <ReInitializeDnsState />
        </div>
        {:catch error}
        <p class="text-xl text-error-400-500-token">Error while loading DNS state</p>
    {/await}
</div>
