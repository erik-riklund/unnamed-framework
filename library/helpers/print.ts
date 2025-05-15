import { colorize } from './colorize';

/**
 * Prints a message to the console with colorized text.
 * 
 * @param input The input string to print.
 */
export const print = (input: string) => console.log(colorize(input));