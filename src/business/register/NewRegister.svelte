<script lang="ts">
    import {anchorProviderStore, getDnsIdl, programStore} from "#/core/program/program.store";
    import {web3} from "@project-serum/anchor";
    import dnsStateStore from "#/business/dns/dnsState.store";
    import {Keypair, PublicKey} from "@solana/web3.js";
    import {
        type Account,
        createInitializeMetadataPointerInstruction,
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
    import noDuplicateDomainName from "#/core/form/noDuplicateDomainName.action"
    import base58 from "bs58";

    const toastStore = getToastStore()

    const currentBalance$ = firstValueFrom(fromPromise(
        $anchorProviderStore.connection.getBalance($walletStore.wallet?.publicKey)
    ))

    let createdMint: PublicKey = Keypair.generate().publicKey;
    let createdTokenAccount: Account;
    let formElement: HTMLFormElement;
    let domainName = "";
    let periodYear = 1;
    let title = "";
    let creatorPubKey = "";
    let url = "";
    let paymentToken = "";
    let tokenAccountPubKey = "";
    let chainlinkFeed = Keypair.generate().publicKey;
    let chainlinkProgram = Keypair.generate().publicKey;

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

    const registerDomain = async (_: SubmitEvent) => {
        if (!formElement.checkValidity()) {
            formElement.reportValidity()
        }
        if (!$workSpace.baseAccount) return;
        if (!$walletStore.wallet.publicKey) return;
        if (!$dnsStateStore.publicKey) return;
        const name = 'birthday'
        const domainSeeds = [utf8.encode('domain'), utf8.encode(domainName)];
        const [domainPDA] = PublicKey.findProgramAddressSync(domainSeeds, $programStore.programId);

        const initializedMetadataPointerIx = createInitializeMetadataPointerInstruction(
            createdMint,
            $workSpace?.baseAccount.publicKey,
            createdMint,
            TOKEN_2022_PROGRAM_ID
        )

        console.log({
            paymentToken
        })

        const creator = new PublicKey(base58.decode(creatorPubKey)) || createdMint || $walletStore.publicKey

        await $programStore.methods.registerDomain(
            domainName,
            periodYear,
            creator,
            url,
            title,
            paymentToken
        ).accounts({
            domain: domainPDA,
            state: $dnsStateStore.publicKey,
            receiver: $walletStore.wallet.publicKey,
            authority: createdTokenAccount?.address,
            chainlinkFeed: chainlinkFeed,
            chainlinkProgram: chainlinkProgram,
            receiverAta: null,
            payerAta: null,
            mintAuthority: creator,
            mint: createdMint,
            metadata: getDnsIdl().metadata.address,
            rent: web3.SYSVAR_RENT_PUBKEY,
            tokenAccount: tokenAccountPubKey || createdTokenAccount?.address || Keypair.generate().publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenMetadataProgram: initializedMetadataPointerIx.programId,
            masterEdition: Keypair.generate().publicKey,
            systemProgram: web3.SystemProgram.programId,
        }).signers([
            $workSpace.baseAccount,
            // dnsState signer missing ?
        ]).rpc()
            .then(() => {
                toastStore.trigger({
                    message: "domain registered.",
                    background: "variant-filled-success"
                })
            })
            .catch((err) => {
                toastStore.trigger({
                    message: `failed to register domain`,
                    background: "variant-filled-error"
                })
                if (!err.message) return
                toastStore.trigger({
                    message: err.message,
                    background: "variant-filled-error"
                })
            })
    }
</script>

<div class="flex flex-wrap justify-between items-center">
    <h1 class="h1 mb-10">
        <span class="bg-gradient-to-br from-blue-500 to-cyan-300 bg-clip-text text-transparent box-decoration-clone uppercase">Register Domain</span>
    </h1>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
            <h3 class="h3">Balance:
                {#await currentBalance$} loading...{:then balance} {balance} SOL{/await}
            </h3>
            <p class="font-bold">{$walletStore.wallet.publicKey.toString()}</p>
        </div>
    </aside>
</div>
<form bind:this={formElement} on:submit|preventDefault={registerDomain}
      class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
    <div>
        <label class="label mb-2">
            <span class="capitalize">domain name</span>
            <input name="domainName" use:noDuplicateDomainName={toastStore} class="input variant-ghost-primary"
                   type="text"
                   placeholder="try amir.sol"
                   required
                   bind:value={domainName}
            />
        </label>
        <p class="text-warning-500">demo - try a domain name (amir.sol) that already exists.</p>
    </div>
    <label class="label">
        <span class="capitalize">Period (Years)</span>
        <input name="period" class="input variant-ghost-primary" type="number"
               placeholder="Period"
               required
               min={0}
               bind:value={periodYear}
        />
    </label>
    <label class="label">
        <span class="capitalize">Title</span>
        <input name="url" class="input variant-ghost-primary" type="text"
               placeholder={'title'}
               bind:value={title}
               required
        />
    </label>
    <label class="label">
        <span class="capitalize">URL (PublicKey)</span>
        <input name="url" class="input variant-ghost-primary" type="text"
               placeholder={'https://'}
               bind:value={url}
               required
        />
    </label>
    <label class="label">
        <span class="capitalize">payment token</span>
        <select required bind:value={paymentToken} name="paymentToken" class="select variant-ghost-primary">
            <option value="sol">sol</option>
        </select>
    </label>
    <div>
        <label class="label mb-2">
            <span class="capitalize">Token Account (PublicKey)</span>
            <input name="mint" class="input variant-ghost-primary" type="text"
                   placeholder={Keypair.generate().publicKey.toString()}
                   bind:value={tokenAccountPubKey}
            />
        </label>
    </div>
    <div>
        <label class="label mb-2">
            <span class="capitalize">Creator (PublicKey)</span>
            <input name="mint" class="input variant-ghost-primary" type="text"
                   placeholder={Keypair.generate().publicKey.toString()}
                   bind:value={creatorPubKey}
            />
        </label>
        <div class="flex flex-wrap gap-2">
            <p class="text-secondary-500">Could also be Mint (PublicKey) or You can generate Solana Token</p>
            <button type="button" class="btn btn-sm variant-filled-tertiary uppercase"
                    on:click|preventDefault={generateToken}>generate token
            </button>
        </div>
    </div>
    <label class="label">
        <span class="capitalize">chainlink feed (PublicKey)</span>
        <input name="chainlinkFeed" class="input variant-ghost-primary" type="text"
               placeholder={'chainlink feed'}
               bind:value={chainlinkFeed}
               required
        />
    </label>
    <label class="label">
        <span class="capitalize">chainlink program (PublicKey)</span>
        <input name="url" class="input variant-ghost-primary" type="text"
               placeholder={'chainlink program'}
               bind:value={chainlinkProgram}
               required
        />
    </label>
    <div class="self-end col-span-3 flex justify-end mb-10">
        <button class="btn variant-filled-primary capitalize" type="submit">
            register domain
        </button>
    </div>
</form>
