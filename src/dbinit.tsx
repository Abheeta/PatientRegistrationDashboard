import { PGliteWorker } from '@electric-sql/pglite/worker';
import { live, type PGliteWithLive } from '@electric-sql/pglite/live';
import { makePGliteProvider } from '@electric-sql/pglite-react';

const worker = new Worker(new URL('./worker-process.ts', import.meta.url), {
  type: 'module',
});

export const db = new PGliteWorker(worker, { extensions: { live } }) as unknown as PGliteWithLive;

export const { PGliteProvider, usePGlite } = makePGliteProvider<typeof db>();
