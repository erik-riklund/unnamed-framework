import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { LayoutDeclaration } from 'types/core';

/**
 * ?
 */
export default defineTask(
  (declarations: LayoutDeclaration[]) =>
  {
    for (const layout of declarations)
    {
      pipeline.executeTask('compileLayoutTemplate', layout);
      // pipeline.executeTask('compileLayoutStylesheet', layout);
    }
  }
);