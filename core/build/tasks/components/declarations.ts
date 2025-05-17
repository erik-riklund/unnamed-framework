import { defineTask } from 'module/pipeline';

import type { ComponentDeclaration, FilePath, TargetFolder } from 'types/core';
import type { ScanFolderInput, ScanFolderResult } from '../helpers/scan-folder';

/**
 * Reads component declarations from JSON files in the specified folder.
 */
export default defineTask<TargetFolder, ComponentDeclaration[]>(
  (pipeline, input) =>
  {
    const declarations: ComponentDeclaration[] = [];
    const { files } = pipeline.executeTask<ScanFolderInput, ScanFolderResult>(
      'scanFolder', { glob: '**/component.json', targetFolder: input.targetFolder }
    );

    for (const relativeFilePath of files)
    {
      const filePath = `${ input.targetFolder }/${ relativeFilePath }`;

      declarations.push(
        pipeline.executeTask<FilePath, ComponentDeclaration>('loadComponentDeclaration', { filePath })
      );
    }

    return declarations;
  }
);