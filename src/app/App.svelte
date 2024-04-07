<script lang="ts">
    import {AppBar, AppShell, getToastStore, initializeStores, storePopup, Toast} from "@skeletonlabs/skeleton";
    import {WalletMultiButton} from '@svelte-on-solana/wallet-adapter-ui'
    import WalletInit from "#/core/wallet/WalletInit.svelte";
    import Router, {link, replace} from 'svelte-spa-router'
    import wrap from "svelte-spa-router/wrap";
    import Redirect from "#/shared/router/Redirect.svelte";
    import active from 'svelte-spa-router/active'
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
    import {first, firstValueFrom, map, timer} from "rxjs";
    import DnsState from "#/business/dns/DnsState.svelte";
    import {arrow, autoUpdate, computePosition, flip, offset, shift} from '@floating-ui/dom';
    import LoadingRoute from "#/shared/router/LoadingRoute.svelte";
    import {NETWORK} from "#/app/main";
    import {networkStore} from "#/core/program/program.store";
    import logger, {info} from "#/shared/log/logger";

    networkStore.set(NETWORK)
    initializeStores();
    storePopup.set({computePosition, autoUpdate, offset, shift, flip, arrow});
    const toastStore = getToastStore();
    const routes = {
        '/': wrap({
            component: Redirect,
            props: {
                link: '/domain'
            }
        }),
        /** documentation itself uses this api for handling nested routes. */
        '/domain': wrap({
            asyncComponent: () => import('#/business/domain/DomainRoutes.svelte'),
            loadingComponent: LoadingRoute,
        }),
        '/domain/*': wrap({
            asyncComponent: () => import('#/business/domain/DomainRoutes.svelte'),
            loadingComponent: LoadingRoute,
        }),
        '/register': wrap({
            asyncComponent: () => import('#/business/register/RegisterRoutes.svelte'),
            loadingComponent: LoadingRoute,
            conditions: [
                async () => {
                    const result = await firstValueFrom(timer(500)
                        .pipe(
                            map(() => $walletStore.connected),
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
            loadingComponent: LoadingRoute,
            conditions: [
                async () => {
                    const result = await firstValueFrom(timer(500)
                        .pipe(
                            map(() => $walletStore.connected),
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
<WalletInit network={NETWORK} />
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
                        inactiveClassName: 'variant-glass'
                    }}>Register Domain</a>
                    <span class="divider-vertical mx-2 "/>
                    <DnsState/>
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
