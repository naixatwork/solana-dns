import "./styles.scss"
import App from './App.svelte'

export const NETWORK: string = import.meta.env.VITE_NETWORK;

if (!NETWORK) {
  throw new Error('NETWORK environment variable is missing');
}

const app = new App({
  target: document.getElementById('app')!,
})

export default app
