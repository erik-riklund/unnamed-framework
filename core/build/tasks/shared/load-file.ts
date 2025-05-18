import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

/**
 * ?
 */
export default defineTask(
  (filePath: string) =>
  {
    console.log('Hello world');
  }
);