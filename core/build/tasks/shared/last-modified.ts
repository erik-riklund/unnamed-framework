import { existsSync, statSync } from 'node:fs';
import { defineTask } from 'module/pipeline';

type Input = { sourceFilePath: string, targetFilePath: string; };

/**
 * Check if the target file is older than the source file.
 */
export default defineTask(
  ({ sourceFilePath, targetFilePath }: Input) =>
  {
    const targetFileChanged = existsSync(targetFilePath) ? statSync(targetFilePath).mtimeMs : 0;
    const sourceFileChanged = existsSync(sourceFilePath) ? statSync(sourceFilePath).mtimeMs : 0;

    // return true;
    return targetFileChanged < sourceFileChanged;
  }
);