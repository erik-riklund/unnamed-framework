import { writeFileSync } from 'node:fs';
import { defineTask } from 'module/pipeline';

import type { ComponentDeclaration } from 'types/core';

/**
 * Save the component metadata to a JSON file.
 */
export default defineTask<ComponentDeclaration[]>(
  (pipeline, input) =>
  {
    const metadata = Object.fromEntries(
      input.map((component) => [
        component.name, {
          dependencies: component.dependencies,
          stylesheet: component.stylesheet !== null
        }
      ])
    );

    writeFileSync('./runtime/components.json', JSON.stringify(metadata, null, 2));
  }
);