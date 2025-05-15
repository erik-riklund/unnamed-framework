import { writeFileSync } from 'node:fs';
import { defineTask } from 'module/pipeline';
import type { ComponentDeclaration } from 'types/core';

export type Input = ComponentDeclaration[];

/**
 * Save the component metadata to a JSON file.
 */
export default defineTask<Input>(
  (pipeline, input) =>
  {
    const metadata = Object.fromEntries(
      input.map((d) => [d.name, d.dependencies])
    );

    writeFileSync('./runtime/components.json', JSON.stringify(metadata));
  }
);