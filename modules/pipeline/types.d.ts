/**
 * Represents a collection of tasks organized as a pipeline.
 */
export interface Pipeline<T extends TaskMap>
{
  /**
   * A record of the tasks registered in the pipeline.
   */
  tasks: T;

  /**
   * Executes the specified task in the pipeline.
   * 
   * @param name - The name of the task to execute.
   * @param input - The input to pass to the task.
   * @returns The result of the task.
   */
  executeTask<K extends keyof T> (name: K, input: Parameters<T[K]>[1]): ReturnType<T[K]>;
}

/**
 * Represents a function that defines a task in the pipeline.
 */
export type PipelineFunction<T extends TaskMap, I, R = void> = (pipeline: Pipeline<TaskMapFor<T>>, input: I) => R;

/**
 * Represents a map defining the tasks in the pipeline.
 */
export type TaskMap = { [K in string]: (pipeline: any, input: any) => any; };

/**
 * ?
 */
export type TaskMapFor<T extends TaskMap> = {
  [K in keyof T]: T[K] extends (pipeline: Pipeline<TaskMapFor<T>>, input: infer I) => infer R ? PipelineFunction<T, I, R> : never;
};