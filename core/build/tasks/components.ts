import { defineTask } from 'module/pipeline';
import { print } from 'library/helpers/print';

import type { ComponentDeclaration, TargetFolder } from 'types/core';

/**
 * ?
 */
export default defineTask(
  (pipeline) =>
  {
    // print('compiling components @ {yellow:./app/ui}');

    // const declarations = pipeline.executeTask('getComponentDeclarations', { targetFolder3: './app/ui' });

    // console.log(declarations);

    // pipeline.executeTask<ComponentDeclaration[]>('compileComponents', declarations);
    // pipeline.executeTask<ComponentDeclaration[]>('saveComponentMetadata', declarations);
  }
);