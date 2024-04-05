<script>
    import {push} from 'svelte-spa-router'
    import {onMount} from "svelte";

    export let link = ''

    onMount(() => {
        console.log(link)
        push(link)
    })
</script>
