import { defineTask } from 'module/pipeline';

import type {
  Input as ScanInput,
  Result as ScanResult
} from 'task/helpers/scan-folder';

import type {
  Input as LoadInput,
  Result as LoadResult
} from './load-declaration';

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
      
      declarations.push(
        pipeline.executeTask<LoadInput, LoadResult>('loadComponentDeclaration', { filePath })
      );
    }

    return declarations;
  }
);