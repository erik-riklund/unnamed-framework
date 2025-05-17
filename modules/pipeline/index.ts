import type { Pipeline, PipelineFunction, TaskMap, TaskMapFor } from './types';

/**
 * Creates a pipeline object that allows registering and executing tasks.
 */
export const usePipeline = <T extends TaskMap> (taskList: T) =>
{
  const tasks = Object.fromEntries(
    Object.entries(taskList).map(([key, task]) => [key, task])) as TaskMapFor<T>;

  const pipeline: Pipeline<TaskMapFor<T>> =
  {
    tasks,

    executeTask: <K extends keyof TaskMapFor<T>> (
      name: K, input: Parameters<TaskMapFor<T>[K]>[1]) =>
    {
      return tasks[name](pipeline, input) as ReturnType<TaskMapFor<T>[K]>;
    },
  };

  return pipeline;
};

/**
 * Helper function to define a task in the pipeline.
 */
export const defineTask = <I, R> (task: (pipeline: Pipeline<any>, input: I) => R) => task;