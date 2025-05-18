import { pipeline } from 'core/build/pipeline';
import { defineTask } from 'module/pipeline';

import type { FilePath, ViewDeclaration } from 'types/core';

/**
 * Load the layout declaration from a JSON file.
 */
export default defineTask(
  ({ filePath }: FilePath) =>
  {
    const declaration: ViewDeclaration = pipeline.executeTask('loadJsonFile', { filePath });
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
    
    declaration.template = `${ folderPath }/${ declaration.template }`;

    if (declaration.handler !== null)
    {
      declaration.handler = `${ folderPath }/${ declaration.handler }`;
    }

    if (declaration.stylesheet !== null)
    {
      declaration.stylesheet = `${ folderPath }/${ declaration.stylesheet }`;
    }

    return declaration;
  }
);