import { Glob } from 'bun';
import { defineTask } from 'module/pipeline';

/**
 * Represents the input for the `scanFolder` task.
 */
export type Input = { glob: string, targetFolder: string; };

/**
 * Represents the result of the `scanFolder` task.
 */
export type Result = { files: string[]; targetFolder: string; };

/**
 * Scans a folder for files matching a specified glob pattern.
 * 
 * @param input - The input for the task, including the glob pattern and target folder.
 */
export default defineTask<Input, Result>(
  (pipeline, input) =>
  {
    const files: string[] = [];
    const { glob, targetFolder } = input;

    for (const file of new Glob(glob).scanSync(targetFolder))
    {
      files.push(file.replaceAll('\\', '/'));
    }

    return { files, targetFolder };
  }
);