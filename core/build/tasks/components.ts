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
    print(`compiling components @ {yellow:${ targetFolder }}`);

    const declarations = pipeline.executeTask(
      'getComponentDeclarations', { targetFolder }
    );

    pipeline.executeTask('compileComponents', declarations);
    pipeline.executeTask('saveComponentMetadata', declarations);
  }
);