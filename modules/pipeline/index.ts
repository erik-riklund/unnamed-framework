import type { Pipeline, TaskMap } from './types';

/**
 * Creates a pipeline of tasks. Each task is a function that takes an input and returns a result.
 * 
 * @param tasks - The tasks to include in the pipeline.
 */
export const usePipeline = <T extends TaskMap> (tasks: T) => 
{
  const pipeline: Pipeline<T> =
  {
    executeTask (name, input)
    {
      if (!(name in tasks))
      {
        throw new Error(`Task "${ String(name) }" not found in pipeline.`);
      }

      return tasks[name](input);
    },

    executeTaskAsync (name, input)
    {
      if (!(name in tasks))
      {
        throw new Error(`Task "${ String(name) }" not found in pipeline.`);
      }

      const wrapper = async () => tasks[name](input);

      return wrapper();
    },
  };

  return pipeline;
};

/**
 * A helper function to define a task. It provides type safety for the input and output types of the task.
 */
export const defineTask = <I, R> (task: (input: I) => R) => task;