import { writeFileSync } from 'node:fs';
import { defineTask } from 'module/pipeline';

import type { ComponentDeclaration } from 'types/core';

/**
 * Save the component metadata to a JSON file.
 */
export default defineTask(
  (declarations: ComponentDeclaration[]) =>
  {
    const metadata = Object.fromEntries(
      declarations.map((component) => [
        component.name, {
          dependencies: component.dependencies,
          stylesheet: component.stylesheet !== null
        }
      ])
    );

    const jsonOutput = JSON.stringify(metadata, null, 2);
    writeFileSync('./runtime/components.json', jsonOutput);
  }
);