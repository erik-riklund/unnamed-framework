import { dirname } from 'node:path';

/**
 * Creates a route path from a file path.
 * 
 * @param filePath - The path to the file.
 * @param prefix - The prefix to be added to the route path.
 */
export const createRoutePath = (filePath: string, prefix: string = '') =>
{
  const pathSegments: string[] = [];
  const rawPathSegments = dirname(filePath).split('/');

  for (const segment of rawPathSegments)
  {
    if (segment.startsWith('-'))
    {
      continue; // grouping segment, should be ignored.
    }
    else if (segment.startsWith('$'))
    {
      pathSegments.push(`:${ segment.slice(1) }`); // parameter segment.
    }
    else
    {
      pathSegments.push(segment); // static segment.
    }
  }

  return `${ prefix }/${ pathSegments.join('/') }`;
};