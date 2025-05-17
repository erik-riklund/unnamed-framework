import { existsSync, mkdirSync } from 'node:fs';
import { defineTask } from 'module/pipeline';

import type { TargetFolder } from 'types/core';

/**
 * Create the specified runtime folder if it doesn't exist.
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
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