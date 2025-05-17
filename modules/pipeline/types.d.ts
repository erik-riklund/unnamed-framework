/**
 * Represents a pipeline of typed tasks.
 */
export interface Pipeline<T extends TaskMap>
{
  /**
   * Executes a task synchronously.
   * 
   * @param name - The name of the task to execute.
   * @param input - The input to pass to the task.
   * @returns The result of the task.
   */
  executeTask: <K extends keyof T>(
    name: K, input: Parameters<T[K]>[0]) => ReturnType<T[K]>;

  /**
   * Executes a task asynchronously.
   * 
   * @param name - The name of the task to execute.
   * @param input - The input to pass to the task.
   * @returns A promise that resolves to the result of the task.
   */
  executeTaskAsync: <K extends keyof T>(
    name: K, input: Parameters<T[K]>[0]) => Promise<ReturnType<T[K]>>;
}

/**
 * Represents a map of task names to their corresponding functions.
 */
export type TaskMap = { [K in string]: (input: any) => any; };