import { defineConfig } from "father"

export default defineConfig({
    esm: { input: "src", output: "dist" },
    targets: { chrome: 90 },
    sourcemap: true
})
