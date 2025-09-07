import { vi } from 'vitest';

// For now we don't need any complex mocking, we just need the Method to be defined
vi.stubGlobal('GM_listValues', () => [] as string[]);
