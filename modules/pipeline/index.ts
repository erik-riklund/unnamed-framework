import type { Pipeline, PipelineFunction } from './types';

/**
 * Creates a pipeline object that allows registering and executing tasks.
 */
export const usePipeline = (): Pipeline =>
{
  return {
    tasks: {},

    executeTask (name, context)
    {
      if (!this.tasks[name])
      {
        throw new Error(`Task "${ name }" does not exist.`);
      }

      this.tasks[name](this, context);
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
export const defineTask = <C> (task: PipelineFunction<C>) => task;