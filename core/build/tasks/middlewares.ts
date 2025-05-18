import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { TargetFolder } from 'types/core';

/**
 * ?
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    print(`\nprocessing {magenta:middleware} @ {yellow:${ targetFolder }}\n`);
    print(`  {gray:not implemented yet ...}`);
  }
);