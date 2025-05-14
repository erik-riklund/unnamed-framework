import { rmSync, watch } from 'node:fs';
import { initializeEndpoints } from './tasks/endpoints';
import { initializePages } from './tasks/pages';
import { processTemplates } from './tasks/templates';

console.log('Build process started...');

/**
 * Clean the runtime folder in preparation for the build if the `--no-clean` flag is not passed.
 * This is necessary to ensure that the build process starts with a clean slate.
 */
if (!process.argv.includes('--no-clean'))
{
  rmSync('./runtime', { recursive: true, force: true });
}

/**
 * Specify the folders to process and their source/target paths.
 */
const folders =
{
  endpoints: { source: './app/routes/api', target: './runtime/endpoints.ts' },
  pages: { source: './app/routes/pages', target: './runtime/pages' },
  templates: { source: './app/ui', target: './runtime/templates' },
};

/**
 * Run the build process.
 */
await Promise.all([
  initializeEndpoints(folders.endpoints.source, folders.endpoints.target),
  initializePages(folders.pages.source, folders.pages.target),
  processTemplates(folders.templates.source, folders.templates.target)
]);

/**
 * Watch for changes in the source folders and re-run the build process.
 * This is only active when the `--dev` flag is passed.
 */
if (process.argv.includes('--dev'))
{
  // endpoints
  watch(folders.endpoints.source, { recursive: true },
    async (e) => e === 'rename' && await initializeEndpoints(folders.endpoints.source, folders.endpoints.target)
  );
  // pages
  watch(folders.pages.source, { recursive: true },
    async () => await initializePages(folders.pages.source, folders.pages.target)
  );
  // templates
  watch(folders.templates.source, { recursive: true },
    async () => await processTemplates(folders.templates.source, folders.templates.target)
  );
}