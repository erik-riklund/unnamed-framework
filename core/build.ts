import { pipeline } from './build/pipeline';
import { print } from 'library/helpers/print';

const start = Date.now();

print(
  `${ '\n'.repeat(60) }{gray:${ '-'.repeat(80) }}\n\n` +
  '{yellow:initializing pipeline ...}\n'
);

pipeline.executeTask('setupRuntimeFolder', { targetFolder: './runtime' });
pipeline.executeTask('buildComponents', { targetFolder: './app/ui' });
pipeline.executeTask('buildLayouts', { targetFolder: './app/routes' });
pipeline.executeTask('buildViews', { targetFolder: './app/routes' });
pipeline.executeTask('buildEndpoints', { targetFolder: './app/routes' });
pipeline.executeTask('buildMiddlewares', { targetFolder: './app/routes' });

print(
  `\n{gray:${ '-'.repeat(80) }}\n` +
  `build completed in {green:${ Date.now() - start } ms}.\n` +
  `{gray:${ '-'.repeat(80) }}`
);


if (process.argv.includes('--dev'))
{
  print(`\n{green:watching for changes} ...`);
  const watch = (await import('glob-watcher')).default;

  /**
   * Watch for changes to components and rebuild them.
   */
  watch('./app/ui/**/*.{json,fml,scss}', { ignoreInitial: true })
    .on('all', () => pipeline.executeTask('buildComponents', { targetFolder: './app/ui' }));

  /**
   * Watch for changes to layouts/views and rebuild them.
   */
  watch('./app/routes/**/*.{json,fml,scss}', { ignoreInitial: true }).on('all',
    () =>
    {
      pipeline.executeTask('buildLayouts', { targetFolder: './app/routes' });
      pipeline.executeTask('buildEndpoints', { targetFolder: './app/routes' });
      pipeline.executeTask('buildMiddlewares', { targetFolder: './app/routes' });
      pipeline.executeTask('buildViews', { targetFolder: './app/routes' });
    }
  );

  /**
   * Watch for changes to endpoints and rebuild them.
   */
  watch('./app/routes/**/{GET,POST,PUT,PATCH,DELETE}.ts', { ignoreInitial: true })
    .on('all', () => pipeline.executeTask('buildEndpoints', { targetFolder: './app/routes' }));

  /**
   * Watch for changes to middlewares and rebuild them.
   */
  watch('./app/routes/**/+{ALL,GET,POST,PUT,PATCH,DELETE}.ts', { ignoreInitial: true })
    .on('all', () => pipeline.executeTask('buildMiddlewares', { targetFolder: './app/routes' }));
}