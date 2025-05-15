import chalk from 'chalk';
import { file, Glob } from 'bun';
import { dirname } from 'node:path';
import { compileString } from 'sass';
import { compile } from 'module/compile';

/**
 * Interface representing the directives found in a template file.
 */
interface Directives
{
  /**
   * The unique name of the template to be exported.
   */
  export: string;

  /**
   * An array of template names to be included in the current template.
   * These templates will be imported and used within the current template.
   */
  include?: string[];

  /**
   * A flag indicating whether the template should be able to call itself recursively.
   * This allows for more complex template structures and behaviors.
   */
  recursive?: boolean;
}

/**
 * A map to store the names of templates that have been processed.
 * This prevents duplicate template names from being registered.
 */
const templates = new Map<string, boolean>();

/**
 * Procedural template processor, responsible for registering and compiling
 * templates from the source folder to the target folder.
 * 
 * @param sourceFolder - The folder containing the template files.
 * @param targetFolder - The folder where the compiled templates will be saved.
 */
export const processTemplates = async (sourceFolder: string, targetFolder: string) =>
{
  console.log(`\nscanning ${ chalk.yellow(sourceFolder) } for components ...`);

  const files = new Glob('**/*.fml');
  const metadata: Record<string, string[]> = {};

  for await (const relativeFilePath of files.scan(sourceFolder))
  {
    const template = await processTemplate(
      `${ sourceFolder }/${ relativeFilePath }`, targetFolder
    );

    if (template.dependencies)
    {
      metadata[template.name] = template.dependencies;
    }
  }

  await file(`${ targetFolder }/metadata.json`).write(JSON.stringify(metadata, null, 2));
};

/**
 * Processes a single template file, extracting its content and directives,
 * and compiling it to the target folder.
 * 
 * @param sourceFilePath - The path to the source template file.
 * @param targetFolder - The folder where the compiled template will be saved.
 */
export const processTemplate = async (sourceFilePath: string, targetFolder: string) =>
{
  const sourceFile = file(sourceFilePath);
  const { template, directives } = processTemplateLines(await sourceFile.text());

  const isUpdate = templates.size > 0;

  if (!directives.export)
  {
    throw new Error(`Template "${ sourceFilePath }" is missing an export directive.`);
  }
  else if (!isUpdate && templates.has(directives.export))
  {
    throw new Error(`There is already a template with the name "${ directives.export }".`);
  }

  templates.set(directives.export, true);

  const targetFilePath = `${ targetFolder }/${ directives.export }.js`;
  const targetFile = file(targetFilePath);

  if (!await targetFile.exists() || targetFile.lastModified < sourceFile.lastModified)
  {
    console.log(`  ${ chalk.green('template') } ${ chalk.yellow(directives.export) } -> ${ chalk.cyan(targetFilePath) }`);

    const content: string[] = [];

    if (directives.include)
    {
      for (const include of directives.include)
      {
        const includeFilePath = `${ targetFolder }/${ include }.js`;

        content.push(`import __${ include } from '${ includeFilePath }';`);
      }
    }

    const compileOptions = { recursive: directives.recursive };
    const compiledTemplate = compile.toString(template, {}, compileOptions);

    content.push(`export default ${ compiledTemplate }`);

    await targetFile.write(content.join(''));
  }
  else
  {
    console.log(chalk.gray(`  skipping "${ directives.export }" (no changes)`));
  }

  processTemplateStyles(sourceFilePath, targetFolder, directives);
  return { name: directives.export, dependencies: directives.include };
};

/**
 * Processes the lines of a template file, extracting its content and directives.
 * 
 * @param content - The content of the template file.
 * @returns An object containing the template content and its directives.
 */
const processTemplateLines = (content: string) =>
{
  const template: string[] = [];
  const directives = {} as Directives;

  for (const line of content.split(/\r?\n/))
  {
    if (line.startsWith('@') && line.endsWith(';'))
    {
      if (line === '@recursive;')
      {
        directives.recursive = true;
      }
      else
      {
        const key = line.slice(1, line.indexOf(' '));
        const value = line.slice(line.indexOf(' ') + 1, -1).trim();

        if (key === 'include')
        {
          directives.include = value.split(',').map(v => v.trim());
        }
        else
        {
          directives.export = value;
        }
      }
    }
    else
    {
      template.push(line);
    }
  }

  return { template: template.join('\n').trim(), directives };
};

/**
 * Processes the styles of a template file, compiling them to CSS.
 * 
 * @param sourceFilePath - The path to the source template file.
 * @param targetFolder - The folder where the compiled styles will be saved.
 * @param directives - The directives extracted from the template file.
 */
const processTemplateStyles = async (
  sourceFilePath: string, targetFolder: string, directives: Directives) =>
{
  const sourceFolder = dirname(sourceFilePath);
  const styleFile = file(`${ sourceFolder }/styles.scss`);

  if (await styleFile.exists())
  {
    const targetFilePath = `${ targetFolder }/${ directives.export }.css`;
    const targetFile = file(targetFilePath);

    if (!await targetFile.exists() || targetFile.lastModified < styleFile.lastModified)
    {
      console.log(`  ${ chalk.green('styles') } ${ chalk.yellow(directives.export) } -> ${ chalk.cyan(targetFilePath) }`);

      await targetFile.write(compileString(await styleFile.text(), { style: 'compressed' }).css);
    }
    else
    {
      console.log(chalk.gray(`  skipping styles for "${ directives.export }" (no changes)`));
    }
  }
};