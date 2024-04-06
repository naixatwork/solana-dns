<script lang="ts">
    import DomainList from "#/business/domain/DomainList.svelte";
    import DomainDetails from "#/business/domain/DomainDetails.svelte";
    import Router, {replace} from "svelte-spa-router";
    import wrap from "svelte-spa-router/wrap";
    import Redirect from "#/shared/router/Redirect.svelte";

    const prefix = "/domain"
    const routes = {
        "/": wrap({
            component: Redirect,
            props: {
                link: '/domain/list'
            }
        }),
        "/list": DomainList,
        "/:publicKey": DomainDetails,
    }
</script>

<Router {routes} {prefix}/>
