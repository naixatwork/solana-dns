<script lang="ts">
    import {first, firstValueFrom, tap} from "rxjs";
    import {slide} from 'svelte/transition';
    import {fromPromise} from "rxjs/internal/observable/innerFrom";
    import {programStore} from "#/core/program/program.store";
    import {AtSign, Globe, Link, Link2} from "lucide-svelte";
    import {Avatar} from "@skeletonlabs/skeleton";

    export let params = {
        publicKey: ''
    }

    const domainDetail$ = firstValueFrom(
        fromPromise($programStore.account.domain.fetch(params.publicKey)).pipe(first(), tap(console.log))
    )
</script>

<h1 class="h1 mb-10">
    <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone uppercase">
        domain -
        {#await domainDetail$}
            loading
        {:then domainDetail}
            {domainDetail.name}
        {/await}
    </span>
</h1>

<div>
    {#await domainDetail$}
        <div class="placeholder animate-pulse h-24"/>
    {:then domain}
        <div class="flex flex-col gap-5 mb-5">
            <h3 class="h3">Profile</h3>
            <aside class="alert variant-glass-primary" transition:slide|global={{ duration: 300 }}>
                <div class="min-w-[56px] flex items-center justify-center">
                    <Avatar src={domain.profile.avatar.toString()} size={56}/>
                </div>
                <div class="alert-message">
                    <h3 class="h3 flex items-center gap-2">
                        Name: {domain.profile.name} - <span
                            class="badge variant-filled-tertiary uppercase">website: {domain.profile.website}</span>
                    </h3>
                    <div class="flex flex-wrap gap-2 justify-center items-center">
                        <p class="truncate w-full">shortbio: {domain.profile.shortbio}</p>
                        <p class="truncate w-full">location: {domain.profile.location}</p>
                    </div>
                </div>
            </aside>
        </div>
        <div class="flex flex-col gap-5 mb-5">
            <h3 class="h3">Sub domains</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <aside class="alert variant-ghost-secondary" transition:slide|global={{ duration: 300 }}>
                    <div class="min-w-[56px] flex items-center justify-center">
                        <Link2 size={56}/>
                    </div>
                    <div class="alert-message">
                        <h3 class="h3 flex items-center gap-2">
                            Mock sub domain <span class="badge variant-filled-success uppercase">active</span></h3>
                    </div>
                    <div class="alert-actions">
                        <a target="_blank" href={''} class="btn btn-icon variant-filled-primary">
                            <Link/>
                        </a>
                    </div>
                </aside>
                <aside class="alert variant-ghost-secondary" transition:slide|global={{ duration: 300 }}>
                    <div class="min-w-[56px] flex items-center justify-center">
                        <Link2 size={56}/>
                    </div>
                    <div class="alert-message">
                        <h3 class="h3 flex items-center gap-2">
                            Mock sub domain <span class="badge variant-filled-success uppercase">active</span></h3>
                    </div>
                    <div class="alert-actions">
                        <a target="_blank" href={''} class="btn btn-icon variant-filled-primary">
                            <Link/>
                        </a>
                    </div>
                </aside>
                {#each domain.subdomains as subDomain}
                    <aside class="alert variant-ghost-secondary" transition:slide|global={{ duration: 300 }}>
                        <div class="min-w-[56px] flex items-center justify-center">
                            <Globe size={56}/>
                        </div>
                        <div class="alert-message">
                            <h3 class="h3 flex items-center gap-2">
                                {subDomain?.name} <span class="badge variant-filled-success uppercase">active</span></h3>
                        </div>
                        <div class="alert-actions">
                            <a target="_blank" href={subDomain?.name} class="btn btn-icon variant-filled-primary">
                                <Link/>
                            </a>
                        </div>
                    </aside>
                {/each}
            </div>
        </div>
        <div class="flex flex-col gap-5">
            <h3 class="h3">Socials</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                {#each Object.entries(domain.socials) as [key, value]}
                    <aside class="alert variant-ghost-secondary" transition:slide|global={{ duration: 300 }}>
                        <div class="min-w-[56px] flex items-center justify-center">
                            <AtSign size={56}/>
                        </div>
                        <div class="alert-message">
                            <h3 class="h3 flex items-center gap-2">{key}</h3>
                            <p class="truncate w-full">link: {value}</p>
                        </div>
                        <div class="alert-actions">
                            <a target="_blank" href={''} class="btn btn-icon variant-filled-primary">
                                <Link/>
                            </a>
                        </div>
                    </aside>
                {/each}
            </div>
        </div>
    {/await}
</div>
