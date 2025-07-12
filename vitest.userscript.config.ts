import { join } from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig, { fileName } from './vite.config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            reporters: ['default', 'json'],
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
            testTimeout: 300_000_000, // 5 million minutes
            //testTimeout: 30_000, // 30s
            hookTimeout: 30_000, // 30s
            provide: { userscriptFile: join(__dirname, 'dist', fileName) },
        },
    })
);
