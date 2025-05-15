import type {
  Input as ScanInput,
  Result as ScanResult
} from 'task/helpers/scan-folder';

import { readFileSync } from 'node:fs';
import { defineTask } from 'module/pipeline';
import type { ComponentDeclaration } from 'types/core';

export type Input = { targetFolder: string; };
export type Result = ComponentDeclaration[];

/**
 * Reads component declarations from JSON files in the specified folder.
 */
export default defineTask<Input, Result>(
  (pipeline, input) =>
  {
    const declarations: ComponentDeclaration[] = [];
    const { files } = pipeline.executeTask<ScanInput, ScanResult>(
      'scanFolder', { glob: '**/component.json', targetFolder: input.targetFolder }
    );

    for (const relativeFilePath of files)
    {
      const filePath = `${ input.targetFolder }/${ relativeFilePath }`;
      const declaration = JSON.parse(readFileSync(filePath, 'utf-8'));

      declaration.template = relativeFilePath.includes('/')
        ? `${ relativeFilePath.split('/').slice(0, -1).join('/') }/${ declaration.template }`
        : `${ input.targetFolder }/${ declaration.template }`;

      declarations.push(declaration);
    }

    return declarations;
  }
);