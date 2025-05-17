import { readFileSync } from 'node:fs';
import { defineTask } from 'module/pipeline';

import type { FilePath } from 'types/core';

/**
 * Load a JSON file and parse its content.
 */
export default defineTask(
  ({ filePath }: FilePath) => JSON.parse(readFileSync(filePath, 'utf-8'))
);