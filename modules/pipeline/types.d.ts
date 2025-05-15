/**
 * Represents a pipeline of tasks.
 */
export interface Pipeline
{
  /**
   * A record of tasks in the pipeline.
   */
  tasks: Record<string, PipelineFunction<any>>;

  /**
   * Executes the specified sequence of tasks in the pipeline.
   * 
   * @param tasks - An array of task names to execute in sequence.
   * @param context - The shared context to pass to each task.
   */
  executeSequence (tasks: string[], context: any): void;

  /**
   * Executes the specified task in the pipeline.
   * 
   * @param name - The name of the task to execute.
   * @param context - The context to pass to the task.
   */
  executeTask (name: string, context: any): void;

  /**
   * Registers a new task in the pipeline.
   * 
   * @param name - The name of the task to register.
   * @param task - The function that defines the task.
   */
  registerTask (name: string, task: PipelineFunction<any>): void;
}

/**
 * Represents a function that defines a task in the pipeline.
 */
export type PipelineFunction<C> = (pipeline: Pipeline, context: C) => void;