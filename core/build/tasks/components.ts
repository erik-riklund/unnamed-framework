import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';
import { print } from 'library/helpers/print';

import type { TargetFolder } from 'types/core';

/**
 * ?
 */
export default defineTask(
  ({ targetFolder }: TargetFolder) =>
  {
    print(`compiling {magenta:components} @ {yellow:${ targetFolder }}`);

    const declarations = pipeline.executeTask(
      'getComponentDeclarations', { targetFolder }
    );

    for (const component of declarations)
    {
      pipeline.executeTask('compileComponentTemplate', component);
      pipeline.executeTask('compileComponentStylesheet', component);
    }

    pipeline.executeTask('saveComponentMetadata', declarations);
  }
);