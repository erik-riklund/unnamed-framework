import { defineTask } from 'module/pipeline';
import { readFileSync } from 'node:fs';

import type { ComponentDeclaration, FilePath } from 'types/core';

/**
 * ?
 */
export default defineTask(
  (pipeline, input) =>
  {
    // const { filePath } = input;

    // const declaration: ComponentDeclaration = JSON.parse(readFileSync(filePath, 'utf-8'));
    
    // const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
    // declaration.template = `${ folderPath }/${ declaration.template }`;

    // if (declaration.stylesheet !== null)
    // {
    //   declaration.stylesheet = `${ folderPath }/${ declaration.stylesheet }`;
    // }

    // return declaration;
  }
);