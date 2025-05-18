import { defineTask } from 'module/pipeline';
import { writeFileSync } from 'node:fs';

type Input = { fileName: string, content: string | string[]; };

/**
 * Writes a file to the runtime directory.
 */
export default defineTask(
  ({ fileName, content }: Input) =>
  {
    if (Array.isArray(content))
    {
      content = content.join('\n');
    }

    writeFileSync(`./runtime/${ fileName }`, content, { encoding: 'utf-8' });
  }
);