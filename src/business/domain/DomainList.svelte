<script>
    import {first, firstValueFrom} from "rxjs";
    import {fade, slide} from 'svelte/transition';
    import {fromPromise} from "rxjs/internal/observable/innerFrom";
    import {programStore} from "#/core/program/program.store";
    import {Globe, WifiOff} from "lucide-svelte";

    const domainList$ = firstValueFrom(
        fromPromise($programStore.account.domain.all()).pipe(first())
    )
</script>
<h1 class="h1 mb-10">
    <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone uppercase">domains</span>
</h1>
{#await domainList$}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="placeholder animate-pulse h-24" />
        <div class="placeholder animate-pulse h-24" />
        <div class="placeholder animate-pulse h-24" />
        <div class="placeholder animate-pulse h-24" />
    </div>
{:then domains}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        {#each domains as domain}
            <aside class="alert variant-ghost-primary" transition:slide|global={{ duration: 300 }}>
                <div class="min-w-[56px] flex items-center justify-center">
                    {#if domain.account.profile.avatar}
                        <img src={domain.account.profile.avatar.toString()} alt="icon"/>
                    {:else}
                        <Globe size={56}/>
                    {/if}
                </div>
                <div class="alert-message">
                    <h3 class="h3 flex items-center gap-2">
                        {domain.account.name} <span class="badge variant-filled-success uppercase">active</span></h3>
                    <p class="truncate w-full">{domain.account.metadata}</p>
                </div>
                <div class="alert-actions">
                    <a href={`#/domain/${domain.publicKey}`} class="btn variant-filled-primary">Details</a>
                </div>
            </aside>
        {/each}
    </div>
{:catch err}
    <div class="grid grid-cols-1 md:grid-cols-3">
        <div/>
        <aside class="alert variant-ghost-error" transition:fade|local={{ duration: 300 }}>
            <WifiOff size={56}/>
            <div class="alert-message">
                <h3 class="h3">Error 404</h3>
                <p class="truncate">couldn't retrieve domains, {err}</p>
            </div>
        </aside>
    </div>
{/await}
