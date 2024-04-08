<script lang="ts">
    import {onMount} from "svelte";
    import {getDnsIdl, programStore} from "#/core/program/program.store";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import {Keypair, PublicKey} from "@solana/web3.js";
    import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
    import base58 from "bs58";
    import {utf8} from "@project-serum/anchor/dist/cjs/utils/bytes";

    onMount(() => {
        $programStore.account.adminConfig.all().then(console.log)
    })

    const callback = async () => {
        console.log($dnsStateStore)
        if (!$workSpace.baseAccount) return;
        if (!$dnsStateStore.publicKey) return;
        const domainSeed = 'domain';
        const name = 'birthday'
        const domainSeeds = [utf8.encode(domainSeed), utf8.encode(name)];
        const [domainPDA] = PublicKey.findProgramAddressSync(domainSeeds, $programStore.programId);
        await $programStore.methods.registerDomain(
            name,
            1,
            Keypair.generate().publicKey,
            "https://sara-bday.vercel.app/game",
            "birthday game",
            "sol"
        ).accounts({
            domain: domainPDA,
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
