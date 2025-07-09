import { join } from 'node:path';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig, { fileName } from './vite.config';

// console.log(join(__dirname, 'dist', fileName));
// viteConfig.define.__USERSCRIPT_FILE__ = join(__dirname, 'dist', fileName);

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            include: [
                '__tests__/__userscript__/**/*.test.tsx',
                '__tests__/__userscript__/**/*.test.ts',
            ],
            environment: 'node',
            setupFiles: ['__tests__/matchers.ts'],
            testTimeout: 300_000_000, // 5 million minutes
            //testTimeout: 30_000, // 30s
            hookTimeout: 30_000, // 30s
            provide: { userscriptFile: join(__dirname, 'dist', fileName) },
        },
    })
);
