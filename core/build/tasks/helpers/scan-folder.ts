import { Glob } from 'bun';
import { defineTask } from 'module/pipeline';
import type { TargetFolder } from 'types/core';

type Input = { glob: string; } & TargetFolder;

/**
 * Scans a folder for files matching a specified glob pattern.
 */
export default defineTask(
  ({ glob, targetFolder }: Input) =>
  {
    const files: string[] = [];

    for (const file of new Glob(glob).scanSync(targetFolder))
    {
      files.push(file.replaceAll('\\', '/'));
    }

    return { files, targetFolder };
  }
);