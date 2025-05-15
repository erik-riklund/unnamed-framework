import type { Pipeline, PipelineFunction } from './types';

/**
 * Creates a pipeline object that allows registering and executing tasks.
 */
export const usePipeline = (): Pipeline =>
{
  return {
    tasks: {},

    executeSequence (tasks, input)
    {
      let result = input;

      for (const name of tasks)
      {
        result = this.executeTask(name, result);
      }

      return result as any;
    },

    executeTask (name, input)
    {
      if (!this.tasks[name])
      {
        throw new Error(`Task "${ name }" does not exist.`);
      }

      return this.tasks[name](this, input);
    },

    registerTask (name, task)
    {
      if (this.tasks[name])
      {
        throw new Error(`Task "${ name }" already exists.`);
      }

      this.tasks[name] = task;
    }
  };
};

/**
 * Helper function to define a task in the pipeline.
 */
export const defineTask = <I, R> (task: PipelineFunction<I, R>) => task;