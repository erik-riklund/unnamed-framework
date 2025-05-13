import { file, write, Glob } from 'bun';

/**
 * ?
 */
export const initializeViews = async (sourceFolder: string, targetFile: string) =>
{
  // ...

  await file(targetFile).write('export const views = [];');
};