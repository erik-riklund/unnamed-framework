import { defineTask } from 'module/pipeline';
import type { ComponentDeclaration, FilePath, TargetFolder } from 'types/core';

/**
 * Reads component declarations from JSON files in the specified folder.
 */
export default defineTask(
  (pipeline, { targetFolder }: TargetFolder) =>
  {
    const declarations: ComponentDeclaration[] = [];

    // const declarations: ComponentDeclaration[] = [];
    // const { files } = pipeline.executeTask<ScanFolderInput, ScanFolderResult>(
    //   'scanFolder', { glob: '**/component.json', targetFolder: input.targetFolder }
    // );

    // for (const relativeFilePath of files)
    // {
    //   const filePath = `${ input.targetFolder }/${ relativeFilePath }`;

    //   declarations.push(
    //     pipeline.executeTask<FilePath, ComponentDeclaration>('loadComponentDeclaration', { filePath })
    //   );
    // }

    return declarations;
  }
);