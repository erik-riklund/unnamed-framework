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
    print(`\ncompiling {magenta:layouts} @ {yellow:${ targetFolder }}`);

    const declarations = pipeline.executeTask(
      'getLayoutDeclarations', { targetFolder }
    );

    for (const layout of declarations)
    {
      pipeline.executeTask('compileLayoutTemplate', layout);
      pipeline.executeTask('compileLayoutStylesheet', layout);
    }

    pipeline.executeTask('saveLayoutMetadata', declarations);
  }
);