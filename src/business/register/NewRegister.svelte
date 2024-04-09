<script lang="ts">
    import {anchorProviderStore, getDnsIdl, programStore} from "#/core/program/program.store";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import {Keypair, PublicKey} from "@solana/web3.js";
    import {
        type Account,
        createInitializeMetadataPointerInstruction,
        createInitializeMintInstruction,
        createMint,
        getOrCreateAssociatedTokenAccount,
        TOKEN_2022_PROGRAM_ID,
        TOKEN_PROGRAM_ID
    } from "@solana/spl-token";
    import {utf8} from "@project-serum/anchor/dist/cjs/utils/bytes";
    import {Badge, Wallet} from "lucide-svelte";
    import {walletStore} from "@svelte-on-solana/wallet-adapter-core";
    import logger, {error, info} from "#/shared/log/logger";
    import {getToastStore} from "@skeletonlabs/skeleton";
    import {firstValueFrom} from "rxjs";
    import {fromPromise} from "rxjs/internal/observable/innerFrom";
    import {workSpace} from "@svelte-on-solana/wallet-adapter-anchor";

    const toastStore = getToastStore()

    const currentBalance$ = firstValueFrom(fromPromise(
        $anchorProviderStore.connection.getBalance($walletStore.wallet?.publicKey)
    ))

    let createdMint: PublicKey = Keypair.generate().publicKey;
    let createdTokenAccount: Account;

    const generateToken = async () => {
        if (!$workSpace?.baseAccount || !$workSpace.program) return;

        const mint = await createMint(
            $anchorProviderStore.connection,
            $workSpace.baseAccount,
            $walletStore.wallet?.publicKey,
            null,
            9
        ).catch((err) => {
            console.log(err)
            logger(error, "createMint", {err})
            toastStore.trigger({
                message: `there was a problem with creating mint ${err?.message}`,
                background: "variant-filled-error"
            })
            if (!err.message) return
            toastStore.trigger({
                message: err.message,
                background: "variant-filled-error"
            })
        })

        if (!mint) {
            logger(error, "createMint", "no mint")
            return;
        }

        createdMint = mint;

        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            $anchorProviderStore.connection,
            $workSpace.baseAccount,
            mint as PublicKey,
            $walletStore.wallet?.publicKey
        );

        if (!tokenAccount) {
            logger(error, "getOrCreateAssociatedTokenAccount", "no tokenAccount")
            return;
        }

        createdTokenAccount = tokenAccount;
        logger(info, "tokenAccount", {createdTokenAccount})
    }

    const registerDomain = async () => {
        if (!$workSpace.baseAccount) return;
        if (!$walletStore.wallet.publicKey) return;
        if (!$dnsStateStore.publicKey) return;
        const name = 'birthday'
        const domainSeeds = [utf8.encode('domain'), utf8.encode(name)];
        const [domainPDA] = PublicKey.findProgramAddressSync(domainSeeds, $programStore.programId);

        const initializedMetadataPointerIx = createInitializeMetadataPointerInstruction(
            createdMint,
            $workSpace?.baseAccount.publicKey,
            createdMint,
            TOKEN_2022_PROGRAM_ID
        )

        await $programStore.methods.registerDomain(
            name,
            1,
            createdMint,
            "https://sara-bday.vercel.app/game",
            "birthday game",
            "sol"
        ).accounts({
            domain: domainPDA,
            state: $dnsStateStore.publicKey,
            receiver: $walletStore.wallet.publicKey,
            authority: $walletStore.wallet.publicKey,
            chainlinkFeed: Keypair.generate().publicKey,
            chainlinkProgram: Keypair.generate().publicKey,
            receiverAta: null,
            payerAta: null,
            mintAuthority: $walletStore.wallet.publicKey,
            mint: createdMint,
            metadata: getDnsIdl().metadata.address,
            rent: web3.SYSVAR_RENT_PUBKEY,
            tokenAccount: createdTokenAccount?.address || Keypair.generate().publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: initializedMetadataPointerIx.programId,
            masterEdition: Keypair.generate().publicKey,
            systemProgram: web3.SystemProgram.programId,
        }).signers([
            $workSpace.baseAccount,
            // dnsState signer missing ?
        ]).rpc()
            .then(console.log)
            .catch(console.log)
    }
</script>

<div class="flex flex-wrap justify-between items-center">
    <h1 class="h1 mb-10">
        <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone uppercase">Register Domain</span>
    </h1>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <aside class="alert variant-soft-primary">
        <!-- Icon -->
        <div>
            <Badge size={50}/>
        </div>
        <!-- Message -->
        <div class="alert-message bg-gradient-to-br from-green-500 to-purple-400 bg-clip-text text-transparent box-decoration-clone">
            <h3 class="h3">Solana Token</h3>
            <p class="font-bold">A token is needed for domain registration.</p>
        </div>
        <!-- Actions -->
        <div class="alert-actions">
            <button on:click={generateToken} class="uppercase btn variant-filled-tertiary">generate token</button>
        </div>
    </aside>
    <aside class="alert variant-soft-primary">
        <!-- Icon -->
        <div>
            <Wallet size={50}/>
        </div>
        <!-- Message -->
        <div class="alert-message bg-gradient-to-br from-green-500 to-purple-400 bg-clip-text text-transparent box-decoration-clone">
            <h3 class="h3">Balance: {#await currentBalance$} loading... {:then balance} {balance} SOL {/await}</h3>
            <p class="font-bold">{$walletStore.wallet.publicKey.toString()}</p>
        </div>
    </aside>
</div>
<div>

</div>
<button on:click={registerDomain}>call</button>
