import { Glob } from 'bun';
import { defineTask } from 'module/pipeline';
import type { TargetFolder } from 'types/core';

export type ScanFolderInput = { glob: string } & TargetFolder;
export type ScanFolderResult = { files: string[]; } & TargetFolder;

/**
 * Scans a folder for files matching a specified glob pattern.
 */
export default defineTask<ScanFolderInput, ScanFolderResult>(
  (pipeline, input) =>
  {
    const files: string[] = [];
    const { glob, targetFolder } = input;

    for (const file of new Glob(glob).scanSync(targetFolder))
    {
      files.push(file.replaceAll('\\', '/'));
    }

    return { files, targetFolder };
  }
);