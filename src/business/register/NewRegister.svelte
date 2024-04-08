<script lang="ts">
    import {onMount} from "svelte";
    import {getDnsIdl, programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import {Keypair, PublicKey} from "@solana/web3.js";
    import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
    import base58 from "bs58";

    onMount(() => {
        $programStore.account.adminConfig.all().then(console.log)
    })

    const callback = async () => {
        console.log($dnsStateStore)
        if (!$workSpace.baseAccount) return;
        if (!$dnsStateStore.publicKey) return;
        const domainSeed = 'domain';
        const dnsStateSeed = 'dns_state';
        const name = 'name'
        const domainSeeds = [Buffer.from(dnsStateSeed), Buffer.from(domainSeed), Buffer.from(name)];
        console.log($programStore.programId.toString())
        const domainPDA = PublicKey.createProgramAddressSync(domainSeeds, $programStore.programId /*7Af91tKWF5mUN69h6EJf3xp1nNjyjCgkbR1XygkgmNCL*/);
        console.log(domainPDA.toString())
        $programStore.account.adminConfig.all().then(console.log)
        await $programStore.methods.registerDomain(
            'birthday',
            1,
            $workSpace.baseAccount.publicKey,
            "https://sara-bday.vercel.app/game",
            "birthday game",
            "sol"
        ).accounts({
            domain: domainPDA, // E8CJKMLpZbzZwWXYHvSAs1vsFYKZUmBbdnHpyChaPmzk
            state: $dnsStateStore.publicKey,
            receiver: $workSpace.baseAccount.publicKey,
            authority: $workSpace.baseAccount.publicKey,
            chainlinkFeed: Keypair.generate().publicKey,
            chainlinkProgram: Keypair.generate().publicKey,
            receiverAta: null,
            payerAta: null,
            mintAuthority: $workSpace.baseAccount.publicKey,
            mint: $workSpace.baseAccount.publicKey,
            metadata: getDnsIdl().metadata.address,
            rent: web3.SYSVAR_RENT_PUBKEY,
            tokenAccount: $workSpace.baseAccount.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: new PublicKey(base58.decode("7Af91tKWF5mUN69h6EJf3xp1nNjyjCgkbR1XygkgmNCL")),
            masterEdition: Keypair.generate().publicKey,
            systemProgram: web3.SystemProgram.programId,
        }).signers([$workSpace.baseAccount]).rpc().then(console.log).catch(console.log)
    }
</script>

<h1>lol</h1>
<button on:click={callback}>call</button>
