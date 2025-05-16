import { defineTask } from 'module/pipeline';
import type { ComponentDeclaration } from 'types/core';
import type { CompileStylesheetInput } from './compile/stylesheet';
import type { CompileTemplateInput } from './compile/template';

export type Input = ComponentDeclaration[];

/**
 * Compile all components based on their declarations.
 */
export default defineTask<Input>(
  (pipeline, input) =>
  {
    const declarations = input;

    for (const component of declarations)
    {
      pipeline.executeTask<CompileTemplateInput>('compileComponentTemplate', component);
      pipeline.executeTask<CompileStylesheetInput>('compileComponentStylesheet', component);
    }
  }
);