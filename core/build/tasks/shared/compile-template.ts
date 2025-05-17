import { compile } from 'module/compile';
import { defineTask } from 'module/pipeline';
import { readFileSync } from 'node:fs';

type Input = { template: string; recursive?: boolean; };

/**
 * Compile a template file into a JavaScript module.
 */
export default defineTask(
  ({ template, recursive }: Input) =>
  {
    const templateContent = readFileSync(template, 'utf-8');
    const compiledTemplate = compile.toString(templateContent, {}, { recursive });

    return `export default ${ compiledTemplate }`;
  }
);