import {writable} from "svelte/store";

const validationStore = writable<Record<string, []>>()
