<script lang="ts">
    import Router from "svelte-spa-router";
    import wrap from "svelte-spa-router/wrap";
    import Redirect from "#/shared/router/Redirect.svelte";
    import NewRegister from "#/business/register/NewRegister.svelte";

    const prefix = "/register"
    const routes = {
        "/": wrap({
            component: Redirect,
            props: {
                link: `${prefix}/new`
            }
        }),
        "/new": NewRegister,
    }
</script>

<Router {routes} {prefix}/>
