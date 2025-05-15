import chalk from 'chalk';
import watch from 'glob-watcher';
import { rmSync } from 'node:fs';
import { initializeEndpoints } from './tasks/endpoints';
import { initializePages, processPageTemplates } from './tasks/pages';
import { processTemplates } from './tasks/templates';

/**
 * Clean the runtime folder in preparation for the build if the `--clean` flag is passed.
 * This is necessary to ensure that the build process starts with a clean slate.
 */
if (process.argv.includes('--clean'))
{
  console.log(chalk.yellow('cleaning the runtime folder ...'));

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

console.log('\n'.repeat(50) + chalk.gray('-'.repeat(80)));
console.log('starting the build process ...');

await initializeEndpoints(folders.endpoints.source, folders.endpoints.target);
await initializePages(folders.pages.source, folders.pages.target);
await processPageTemplates(folders.pages.source, folders.pages.target);
await processTemplates(folders.templates.source, folders.templates.target);

/**
 * Watch for changes in the source folders and re-run the build process.
 * This is only active when the `--dev` flag is passed.
 */
if (process.argv.includes('--dev'))
{
  console.log(chalk.green('\nwatching for changes ...'));

  // endpoints are rebuilt when declaration files are added or removed.
  const endpoints = watch(`${ folders.endpoints.source }/**/{GET,POST,PUT,PATCH,DELETE}.ts`);
  endpoints.on('all', (e) => (e === 'add' || e === 'unlink') &&
    initializeEndpoints(folders.endpoints.source, folders.endpoints.target)
  );
  // pages are rebuilt when declaration files are added or removed.
  const pages = watch(`${ folders.pages.source }/**/route.json`);
  pages.on('all', (e) => (e === 'add' || e === 'unlink') &&
    initializePages(folders.pages.source, folders.pages.target)
  );

  // endpoints
  // watch(folders.endpoints.source, { recursive: true },
  //   async (e) => e === 'rename' && await initializeEndpoints(folders.endpoints.source, folders.endpoints.target)
  // );
  // pages
  // watch(folders.pages.source, { recursive: true },
  //   async () => await initializePages(folders.pages.source, folders.pages.target)
  // );
  // templates
  // watch(folders.templates.source, { recursive: true },
  //   async (e, file) =>
  //   {
  //     // await processTemplates(folders.templates.source, folders.templates.target)
  //     console.log({ e, file });
  //   }
  // );
}