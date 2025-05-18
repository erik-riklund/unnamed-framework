import { defineTask } from 'module/pipeline';
import { pipeline } from 'core/build/pipeline';

import type { ViewDeclaration, ViewMetadata } from 'types/core';

/**
 * Generates metadata for views and writes it to a JSON file.
 */
export default defineTask(
  (declarations: ViewDeclaration[]) =>
  {
    const metadata: Record<string, ViewMetadata> = {};

    for (const { template, stylesheet, dependencies } of declarations)
    {
      const id = Bun.hash(pipeline.executeTask('createRoutePath', template)).toString(24);
      const layouts = pipeline.executeTask('resolveLayouts', { filePath: template });

      metadata[id] = {
        dependencies,
        stylesheet: stylesheet !== null,
        layouts: layouts.map((layout) => layout.name)
      };
    }

    pipeline.executeTask('writeFile',
      { fileName: 'views.json', content: JSON.stringify(metadata, null, 2) }
    );
  }
);