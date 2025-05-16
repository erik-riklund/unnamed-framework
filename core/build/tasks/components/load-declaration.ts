import { defineTask } from 'module/pipeline';
import { readFileSync } from 'node:fs';

import type { ComponentDeclaration } from 'types/core';

export type Input = { filePath: string; };
export type Result = ComponentDeclaration;

/**
 * ?
 */
export default defineTask<Input, Result>(
  (pipeline, input) =>
  {
    const { filePath } = input;

    const declaration: ComponentDeclaration = JSON.parse(readFileSync(filePath, 'utf-8'));
    
    const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
    declaration.template = `${ folderPath }/${ declaration.template }`;

    if (declaration.stylesheet !== null)
    {
      declaration.stylesheet = `${ folderPath }/${ declaration.stylesheet }`;
    }

    return declaration;
  }
);