import { defineTask } from 'module/pipeline';
import { compileString, type StringOptions } from 'sass';

const compileOptions: StringOptions<'sync'> =
{
  charset: false,
  style: 'expanded',
  sourceMap: false,

  loadPaths: [] // array of paths used to resolve imports.
};

/**
 * Compile a SCSS string into CSS.
 */
export default defineTask(
  (input: string) => compileString(input, compileOptions).css
);