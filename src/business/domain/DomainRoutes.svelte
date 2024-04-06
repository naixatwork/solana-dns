<script lang="ts">
    import DomainList from "#/business/domain/DomainList.svelte";
    import DomainDetails from "#/business/domain/DomainDetails.svelte";
    import Router from "svelte-spa-router";
    import wrap from "svelte-spa-router/wrap";
    import Redirect from "#/shared/router/Redirect.svelte";
    import {getToastStore} from "@skeletonlabs/skeleton";
    import {onMount} from "svelte";
    const toastStore = getToastStore();

    const prefix = "/domain"
    const routes = {
        "/": wrap({
            component: Redirect,
            props: {
                link: `${prefix}/list`
            }
        }),
        "/list": DomainList,
        "/:publicKey": DomainDetails,
    }
</script>

<Router {routes} {prefix}/>
