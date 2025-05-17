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
    print(`\ncompiling layouts @ {yellow:${ targetFolder }}`);

    const declarations = pipeline.executeTask(
      'getLayoutDeclarations', { targetFolder }
    );

    pipeline.executeTask('compileLayouts', declarations);
    pipeline.executeTask('saveLayoutMetadata', declarations);
  }
);