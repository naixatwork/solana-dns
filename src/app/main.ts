import "./styles.scss"
import App from './App.svelte'
import logger, {error, info} from "#/shared/log/logger";

export const NETWORK: string = import.meta.env.VITE_NETWORK;

if (!NETWORK) {
    logger(error, 'could not initialize environment variables', {NETWORK})
    throw new Error('NETWORK environment variable is missing');
}

logger(info, 'environment variables initialized', {NETWORK})

const app = new App({
    target: document.getElementById('app')!,
})

export default app
