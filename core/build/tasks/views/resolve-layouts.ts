import { pipeline } from 'core/build/pipeline';
import { defineTask } from 'module/pipeline';
import type { FilePath, LayoutMetadata } from 'types/core';

let metadata: MaybeNull<Record<string, LayoutMetadata>> = null;

/**
 * Resolve the layout(s) for a given file path.
 */
export default defineTask(
  ({ filePath }: FilePath) =>
  {
    if (metadata === null)
    {
      metadata = pipeline.executeTask(
        'loadJsonFile', { filePath: './runtime/layouts.json' }
      );
    }

    const layouts: { name: string; basePath: string; }[] = [];

    Object.entries(metadata!).forEach(
      ([name, layout]) =>
      {
        if (filePath.startsWith(`${ layout.basePath }/`))
        {
          layouts.push({ name, basePath: layout.basePath });
        }
      }
    );

    layouts.sort((a, b) =>
      a.basePath.length - b.basePath.length
    );

    return layouts;
  }
);