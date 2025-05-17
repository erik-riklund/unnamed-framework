import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';
import type { ComponentDeclaration } from 'types/core';

/**
 * Compile all components based on their declarations.
 */
export default defineTask(
  (declarations: ComponentDeclaration[]) =>
  {
    for (const component of declarations)
    {
      pipeline.executeTask('compileComponentTemplate', component);
      pipeline.executeTask('compileComponentStylesheet', component);
    }
  }
);