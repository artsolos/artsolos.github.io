// Portable entry point, including shells where npm is not on PATH.
process.env.ASTRO_TELEMETRY_DISABLED ??= '1';
await import('../node_modules/astro/bin/astro.mjs');
