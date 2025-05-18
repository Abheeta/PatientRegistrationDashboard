// worker-process.ts
import { PGlite } from '@electric-sql/pglite';
import { live } from '@electric-sql/pglite/live';
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init(options) {
    // const meta = options?.meta;

    const db = await PGlite.create(options?.dataDir ?? 'idb://my-pgdata', {
      extensions: { live },
    });

    return db;
  },
});
