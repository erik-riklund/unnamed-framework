import { defineTask } from 'module/pipeline';
import { print } from 'library/helpers/print';

import type {
  Input as DeclarationInput,
  Result as DeclarationResult
} from './components/declarations';

import type { Input as CompileInput } from './components/compile-all';
import type { Input as MetadataInput } from './components/metadata';

/**
 * ?
 */
export default defineTask(
  (pipeline, input) =>
  {
    print('compiling components @ {yellow:./app/ui}');

    const declarations = pipeline.executeTask<DeclarationInput, DeclarationResult>(
      'getComponentDeclarations', { targetFolder: './app/ui' }
    );

    // console.log({ declarations });

    pipeline.executeTask<CompileInput>('compileComponents', declarations);
    pipeline.executeTask<MetadataInput>('saveComponentMetadata', declarations);
  }
);