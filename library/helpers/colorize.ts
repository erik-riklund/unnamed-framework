import chalk from 'chalk';

/**
 * Maps color names to `chalk` functions.
 */
const colors =
{
  red: chalk.red,
  green: chalk.green,
  blue: chalk.blue,
  yellow: chalk.yellow,
  magenta: chalk.magenta,
  cyan: chalk.cyan,
  white: chalk.white,
  gray: chalk.gray,
  black: chalk.black,
};

/**
 * Colorizes a string using the specified color codes.
 * 
 * @param input The input string to colorize.
 * @returns The colorized string.
 */
export const colorize = (input: string) =>
{
  return input.replaceAll(/\{(\w+):([^}]+)\}/g,
    (_, color, text) => colors[color as keyof typeof colors](text)
  );
};