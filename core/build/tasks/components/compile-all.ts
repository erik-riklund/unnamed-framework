import { defineTask } from 'module/pipeline';
import type { ComponentDeclaration } from 'types/core';

/**
 * Compile all components based on their declarations.
 */
export default defineTask<ComponentDeclaration[]>(
  (pipeline, input) =>
  {
    const declarations = input;

    for (const component of declarations)
    {
      pipeline.executeTask<ComponentDeclaration>('compileComponentTemplate', component);
      pipeline.executeTask<ComponentDeclaration>('compileComponentStylesheet', component);
    }
  }
);