import { useTasks } from 'module/automate'

/**
 * Used to adapt the build process to the current environment.
 */
const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * ?
 */
