import dotenv from 'dotenv';
import { isCI } from 'ci-info';
import { join } from 'node:path';
import { scriptFileName } from './tooling/context/config';
import viteConfig from './vite.config';
import { defineConfig, mergeConfig } from 'vitest/config';

const extendedEnv = { VITEST_USERSCRIPT: 'true' };

// @ts-expect-error because process.env may also include undefined values
dotenv.populate(process.env, extendedEnv, { debug: true });

// console.log(process.env);

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
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
            hookTimeout: 60_000, // 60s should be enough. 30s also works but is a little optimistic sometimes
            provide: {
                userscriptFile: join(__dirname, 'dist', scriptFileName),
            },
        },
    })
);
