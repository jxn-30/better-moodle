import viteConfig from './vite.config';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            include: ['__tests__/**/*.test.tsx', '__tests__/**/*.test.ts'],
            environment: 'jsdom',
            setupFiles: ['__tests__/gm_mocks.ts', '__tests__/matchers.ts'],
            coverage: { include: ['src/**/*.tsx', 'src/**/*.ts'] },
        },
    })
);
