import type {Action} from "svelte/action";
import logger, {fatal} from "#/shared/log/logger";
import {debounceTime, distinctUntilChanged, fromEvent, fromEventPattern, map, switchMap, tap} from "rxjs";
import {programStore} from "#/core/program/program.store";
import type {ToastStore} from "@skeletonlabs/skeleton";

const noDuplicateDomainName: Action<HTMLInputElement, ToastStore> = (inputElement, toastStore: ToastStore) => {
    if (!inputElement) {
        logger(fatal, "noDuplicateDomainName", "no inputElement element provided")
        throw new Error('no inputElement element provided')
    }
    const checkDuplication = (value: string) => {
        programStore.subscribe((program) => {
            program.account.domain.all().then((domains) => {
                domains.forEach((domain) => {
                    if (domain.account.name === value) {
                        toastStore.trigger({
                            message: "Domain name already exists. are you sure?",
                            background: "variant-ghost-warning"
                        })
                    }
                })
                console.log('reached')
            })
        })
    }

    const subscription = fromEvent(inputElement, 'change')
        .pipe(
            debounceTime(300),
            distinctUntilChanged(),
            map(() => {
                return inputElement.value
            }),
            tap(console.log)
        )
        .subscribe({
            next: checkDuplication
        })

    return {
        destroy: () => {
            subscription.unsubscribe()
        }
    }
}

export default noDuplicateDomainName
