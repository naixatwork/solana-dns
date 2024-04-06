<script>
	import {first, firstValueFrom, tap} from "rxjs";
	import {fromPromise} from "rxjs/internal/observable/innerFrom";
	import {programStore} from "#/core/program/program.store";

	export let params = {
		publicKey: ''
	}
	const domainDetail$ = firstValueFrom(
		fromPromise($programStore.account.domain.fetch(params.publicKey)).pipe(first(), tap((domainDetail) => {
			console.log({domainDetail})
		}))
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

{#await domainDetail$}
    <div class="placeholder animate-pulse h-24"/>
{:then domain}
    <p>{domain.name}</p>
{/await}
