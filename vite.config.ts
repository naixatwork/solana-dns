import {defineConfig} from 'vitest/config'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import path from "path";
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
    plugins: [
        svelte(),
    ],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true,
                }),
            ]
        }
    },
    resolve: {
        alias: {
            '#': path.resolve(__dirname, 'src/'),
        },
    },
    define: {
        'process.env.ANCHOR_BROWSER': true
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./vitest/setup-tests.ts",
        mockReset: true,
    },
})
