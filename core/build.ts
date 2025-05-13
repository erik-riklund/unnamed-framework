import { rmSync, watch } from 'node:fs';
import { initializeEndpoints } from './tasks/endpoints';
import { initializeViews } from './tasks/views';
import { processTemplates } from './tasks/templates';

/**
 * Clean the runtime folder in preparation for the build if the `--no-clean` flag is not passed.
 * This is necessary to ensure that the build process starts with a clean slate.
 */
if (!process.argv.includes('--no-clean'))
{
  rmSync('./runtime', { recursive: true });
}

/**
 * Specify the folders to process and their source/target paths.
 */
const folders =
{
  endpoints: { source: './app/routes/api', target: './runtime/endpoints.ts' },
  templates: { source: './app/ui', target: './runtime/templates' },
  views: { source: './app/routes/pages', target: './runtime/views.js' },
};

/**
 * Run the build process.
 */
await Promise.all([
  initializeEndpoints(folders.endpoints.source, folders.endpoints.target),
  initializeViews(folders.views.source, folders.views.target),
  processTemplates(folders.templates.source, folders.templates.target),
]);

/**
 * Watch for changes in the source folders and re-run the build process.
 * This is only active when the `--dev` flag is passed.
 */
if (process.argv.includes('--dev'))
{
  // templates
  watch(folders.templates.source, { recursive: true },
    async () => await processTemplates(folders.templates.source, folders.templates.target)
  );
  // views
  watch(folders.views.source, { recursive: true },
    async () => await initializeViews(folders.views.source, folders.views.target)
  );
}