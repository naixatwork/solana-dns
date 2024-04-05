import {defineConfig} from 'vitest/config'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import path from "path";

export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            '#': path.resolve(__dirname, 'src/'),
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest/setup-tests.ts",
        mockReset: true,
    },
})
