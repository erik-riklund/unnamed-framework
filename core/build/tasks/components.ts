import { defineTask } from 'module/pipeline';
import { print } from 'library/helpers/print';

import type { Input, Result } from './components/declarations';
import type { Input as MetadataInput } from './components/metadata';

/**
 * ?
 */
export default defineTask(
  (pipeline, input) =>
  {
    print('building components @ {yellow:./app/ui}');

    const declarations = pipeline.executeTask<Input, Result>(
      'getComponentDeclarations', { targetFolder: './app/ui' }
    );

    // console.log({ declarations });

    pipeline.executeTask<MetadataInput>('saveComponentMetadata', declarations);
  }
);