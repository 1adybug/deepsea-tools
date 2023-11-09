import { defineConfig } from "father"

export default defineConfig({
    esm: { input: "src" },
    cjs: { input: "src" },
    prebundle: {
        deps: {}
    },
    targets: {
        chrome: 90,
        node: 16
    },
    sourcemap: true
})
