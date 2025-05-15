/**
 * Represents a pipeline of tasks.
 */
export interface Pipeline
{
  /**
   * A record of tasks in the pipeline.
   */
  tasks: Record<string, PipelineFunction<any, any>>;

  /**
   * Executes the specified sequence of tasks in the pipeline.
   * 
   * @param tasks - An array of task names to execute in sequence.
   * @param input - The input to pass to the first task in the sequence.
   * @returns The result of the last task in the sequence.
   */
  executeSequence<I = any, R = any> (tasks: string[], input: I): R;

  /**
   * Executes the specified task in the pipeline.
   * 
   * @param name - The name of the task to execute.
   * @param input - The input to pass to the task.
   * @returns The result of the task.
   */
  executeTask<I = any, R = any> (name: string, input: I): R;

  /**
   * Registers a new task in the pipeline.
   * 
   * @param name - The name of the task to register.
   * @param task - The function that defines the task.
   */
  registerTask (name: string, task: PipelineFunction<any, any>): void;
}

/**
 * Represents a function that defines a task in the pipeline.
 */
export type PipelineFunction<I, R> = (pipeline: Pipeline, input: I) => R;