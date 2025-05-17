import { defineTask } from 'module/pipeline';
import { readFileSync } from 'node:fs';

import type { LayoutDeclaration, FilePath } from 'types/core';

/**
 * Load the layout declaration from a JSON file.
 */
export default defineTask(
  ({ filePath }: FilePath) =>
  {
    const fileContent = readFileSync(filePath, 'utf-8');
    const declaration: LayoutDeclaration = JSON.parse(fileContent);

    const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
    declaration.template = `${ folderPath }/${ declaration.template }`;

    if (declaration.stylesheet !== null)
    {
      declaration.stylesheet = `${ folderPath }/${ declaration.stylesheet }`;
    }

    declaration.basePath = folderPath;

    return declaration;
  }
);