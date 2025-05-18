import { defineTask } from 'module/pipeline';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import type { TargetFolder } from 'types/core';

/**
 * Create the specified runtime folder if it doesn't exist.
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    if (process.argv.includes('--clean'))
    {
      rmSync(targetFolder, { recursive: true, force: true });
    }

    const subFolders = ['components', 'layouts', 'views'];

    subFolders.forEach(
      (subFolder) =>
      {
        const folderPath = `${ targetFolder }/${ subFolder }`;

        if (!existsSync(folderPath))
        {
          mkdirSync(folderPath, { recursive: true });
        }
      }
    );
  }
);