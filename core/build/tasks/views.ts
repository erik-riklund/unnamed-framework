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
    print(`\ncompiling {magenta:views} @ {yellow:${ targetFolder }}`);

    const declarations = pipeline.executeTask('getViewDeclarations', { targetFolder });

    for (const view of declarations)
    {
      pipeline.executeTask('compileViewTemplate', view);
    }
  }
);