import { defineTask } from 'module/pipeline';
import type { LayoutDeclaration } from 'types/core';

/**
 * ?
 */
export default defineTask(
  (declaration: LayoutDeclaration) =>
  {
    console.log('Hello world');
  }
);