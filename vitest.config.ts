import viteConfig from './vite.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            include: ['__tests__/**/*.test.tsx', '__tests__/**/*.test.ts'],
            exclude: ['__tests__/__userscript__'],
            environment: 'jsdom',
            setupFiles: ['__tests__/gm_mocks.ts', '__tests__/matchers.ts'],
            reporters: ['verbose'],
            coverage: {
                include: ['src/**/*.tsx', 'src/**/*.ts'],
                reporter: ['text', 'html', 'clover', 'json', 'json-summary'],
            },
        },
    })
);
