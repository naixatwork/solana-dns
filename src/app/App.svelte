<script lang="ts">
    import {AppBar, AppShell, getToastStore, initializeStores, Toast} from "@skeletonlabs/skeleton";
    import {WalletMultiButton} from '@svelte-on-solana/wallet-adapter-ui'
    import WalletInit from "#/core/wallet/WalletInit.svelte";
    import Router, {link, replace} from 'svelte-spa-router'
    import wrap from "svelte-spa-router/wrap";
    import Redirect from "#/shared/router/Redirect.svelte";
    import active from 'svelte-spa-router/active'
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
    import {filter, first, firstValueFrom, lastValueFrom, map, of, timeout, timer} from "rxjs";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {fromPromise} from "rxjs/internal/observable/innerFrom";

    initializeStores();
    const toastStore = getToastStore();
    const routes = {
        '/': wrap({
            component: Redirect,
            props: {
                link: '/domain'
            }
        }),
        '/domain': wrap({
            asyncComponent: () => import('#/business/domain/DomainRoutes.svelte'),
        }),
        '/domain/*': wrap({
            asyncComponent: () => import('#/business/domain/DomainRoutes.svelte')
        }),
        '/register': wrap({
            asyncComponent: () => import('#/business/register/RegisterRoutes.svelte'),
            conditions: [
                async () => {
                    const result = await firstValueFrom(timer(300)
                        .pipe(
                            map(() =>  $walletStore.connected),
                            first()
                        )
                    )
                    if (!result) {
                        toastStore.trigger({
                            message: 'Connect your wallet.',
                            background: 'variant-filled-error',
                            timeout: 6000
                        })
                        replace('/').then()
                        return false
                    }
                    return true
                }
            ]
        }),
        '/register/*': wrap({
            asyncComponent: () => import('#/business/register/RegisterRoutes.svelte'),
            conditions: [
                async () => {
                    const result = await firstValueFrom(timer(300)
                        .pipe(
                            map(() =>  $walletStore.connected),
                            first()
                        )
                    )
                    if (!result) {
                        toastStore.trigger({
                            message: 'Connect your wallet.',
                            background: 'variant-filled-error',
                            timeout: 6000
                        })
                        replace('/').then()
                        return false
                    }
                    return true
                }
            ]
        }),
    }
</script>

<Toast position="b"/>
<WalletInit/>
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
            <svelte:fragment slot="default">
                <div class="flex gap-2">
                    <a class="btn"
                       href="/domain"
                       use:link
                       use:active={{
                    path: '/domain/*',
                    className: 'variant-ghost-primary',
                    inactiveClassName: 'variant-glass'
                }}>Public Domains</a>
                    <a class="btn"
                       href="/register"
                       use:link
                       use:active={{
                    path: '/register/*',
                    className: 'variant-ghost-primary',
                    inactiveClassName: ''
                }}>Register Domain</a>
                </div>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <WalletMultiButton/>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <div class="p-4 pt-10 h-full container mx-auto">
        <Router {routes}/>
    </div>
</AppShell>
