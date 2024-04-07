<script lang="ts">
    import {onMount} from "svelte";
    import {programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";

    onMount(() => {
        $programStore.account.primaryDomain.all().then(console.log)
    })

    const callback = async () => {
        console.log($dnsStateStore)
        if (!$workSpace.baseAccount) return;
        if (!$dnsStateStore.publicKey) return;
        $programStore.methods.setPrimaryDomain("dev").accounts({
            primaryDomain: $dnsStateStore.publicKey,
            domain: $dnsStateStore.publicKey,
            authority: $workSpace.baseAccount.publicKey,
            systemProgram: web3.SystemProgram.programId
        }).signers([$workSpace.baseAccount]).rpc().then(console.log).catch(console.log)
        // const primaryDomain = $dnsStateStore.account.primaryDomains
        // const domain = await $programStore.account.primaryDomain.all()
        // console.log(domain)
        //
        // await $programStore.methods.registerDomain(
        //     "test",
        //     1,
        //     $workSpace.baseAccount.publicKey,
        //     "https://sara-bday.vercel.app/game",
        //     "birthday game",
        //     "sol"
        // ).accounts({
        //     domain: domain[0].publicKey,
        //     state: $dnsStateStore.publicKey,
        //     receiver: $workSpace.baseAccount.publicKey,
        //     authority: $workSpace.baseAccount.publicKey,
        //     chainlinkFeed: Keypair.generate().publicKey,
        //     chainlinkProgram: Keypair.generate().publicKey,
        //     receiverAta: null,
        //     payerAta: null,
        //     mintAuthority: $workSpace.baseAccount.publicKey,
        //     mint: $workSpace.baseAccount.publicKey,
        //     metadata: getDnsIdl().metadata.address,
        //     rent: web3.SYSVAR_RENT_PUBKEY,
        //     tokenAccount: $workSpace.baseAccount.publicKey,
        //     tokenProgram: TOKEN_PROGRAM_ID,
        //     tokenMetadataProgram: new PublicKey(base58.decode("7Af91tKWF5mUN69h6EJf3xp1nNjyjCgkbR1XygkgmNCL")),
        //     masterEdition: Keypair.generate().publicKey,
        //     systemProgram: web3.SystemProgram.programId,
        // }).signers([$workSpace.baseAccount]).rpc().then(console.log).catch(console.log)
    }
</script>

<h1>lol</h1>
<button on:click={callback}>call</button>
