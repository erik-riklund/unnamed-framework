import { defineTask } from 'module/pipeline';

/**
 * Create a route path from a file path.
 */
export default defineTask(
  (filePath: string) =>
  {
    const routeSegments: string[] = [];
    const relativeFilePath = filePath.replace(/^\.\/app\/routes\//, '');

    for (const segment of relativeFilePath.split('/').slice(0, -1))
    {
      if (segment.startsWith('-'))
      {
        continue; // skip grouping segments.
      }

      if (segment.startsWith('$'))
      {
        const paramName = segment.slice(1);

        routeSegments.push(`:${ paramName }`);
      }
      else
      {
        routeSegments.push(segment);
      }
    }

    return routeSegments.length > 0 ? routeSegments.join('/') : '/';
  }
);