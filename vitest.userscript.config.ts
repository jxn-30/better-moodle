import { isCI } from 'ci-info';
import { join } from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig, { fileName } from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            css: {
                include: /.+/,
                modules: {
                    ...viteConfig.css.modules, // we want to use the same config as for builds to ensure the same class names and IDs
                    classNameStrategy: 'scoped',
                },
            },
            include: [
                '__tests__/__userscript__/**/*.test.tsx',
                '__tests__/__userscript__/**/*.test.ts',
            ],
            coverage: {
                thresholds: {
                    lines: 80,
                    branches: 80,
                    functions: 80,
                    statements: 80,
                },
            },
            environment: 'node',
            setupFiles: ['__tests__/matchers.ts'],
            testTimeout: isCI ? 30_000 : 300_000_000, // 30s on CI, 5 million minutes locally
            hookTimeout: 30_000, // 30s
            provide: { userscriptFile: join(__dirname, 'dist', fileName) },
        },
    })
);
