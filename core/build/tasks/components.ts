import { defineTask } from 'module/pipeline';
import { print } from 'library/helpers/print';

import type { ComponentDeclaration, TargetFolder } from 'types/core';

/**
 * ?
 */
export default defineTask(
  (pipeline, input) =>
  {
    print('compiling components @ {yellow:./app/ui}');

    const declarations = pipeline.executeTask<TargetFolder, ComponentDeclaration[]>(
      'getComponentDeclarations', { targetFolder: './app/ui' }
    );

    pipeline.executeTask<ComponentDeclaration[]>('compileComponents', declarations);
    pipeline.executeTask<ComponentDeclaration[]>('saveComponentMetadata', declarations);
  }
);