import { writeFileSync } from 'node:fs';
import { defineTask } from 'module/pipeline';

import type { LayoutDeclaration } from 'types/core';

/**
 * Save the layout metadata to a JSON file.
 */
export default defineTask(
  (declarations: LayoutDeclaration[]) =>
  {
    const metadata = Object.fromEntries(
      declarations.map((component) => [
        component.name,
        {
          basePath: component.basePath,
          dependencies: component.dependencies,
          stylesheet: component.stylesheet !== null
        }
      ])
    );

    const jsonOutput = JSON.stringify(metadata, null, 2);
    writeFileSync('./runtime/layouts.json', jsonOutput);
  }
);