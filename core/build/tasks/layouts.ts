import { print } from 'library/helpers/print';
import { defineTask } from 'module/pipeline';

/**
 * ?
 */
export default defineTask(
  (pipeline, input) =>
  {
    print('\ncompiling layouts @ {yellow:./app/routes}');

    // ...
  }
);