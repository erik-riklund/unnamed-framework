import { pipeline } from './build/pipeline';
import { print } from 'library/helpers/print';

const start = Date.now();

/**
 * Display a message indicating the start of the build process.
 */
print(`${ '\n'.repeat(60) }{gray:${ '-'.repeat(80) }}\n`);
print('{yellow:initializing pipeline ...}\n');

/**
 * ?
 */
pipeline.executeTask('buildComponents', { targetFolder: './app/ui' });
pipeline.executeTask('buildLayouts', { targetFolder: './app/routes' });

/**
 * Display a message indicating the completion of the build process.
 */
print(`\n{gray:${ '-'.repeat(80) }}`);
print(`completed in {green:${ Date.now() - start } ms}.`);
print(`{gray:${ '-'.repeat(80) }}`);


// --- import the build task contexts -----------------------------------------