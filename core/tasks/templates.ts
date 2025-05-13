import { file, Glob } from 'bun';
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
export const processTemplates = async (
  sourceFolder: string, targetFolder: string) =>
{
  const files = new Glob('**/*.fml');

  for await (const relativeFilePath of files.scan(sourceFolder))
  {
    processTemplate(`${ sourceFolder }/${ relativeFilePath }`, targetFolder);
  }
};

/**
 * Processes a single template file, extracting its content and directives,
 * and compiling it to the target folder.
 * 
 * @param sourceFilePath - The path to the source template file.
 * @param targetFolder - The folder where the compiled template will be saved.
 */
export const processTemplate = async (
  sourceFilePath: string, targetFolder: string) =>
{
  const sourceFile = file(sourceFilePath);
  const { template, directives } = processTemplateLines(await sourceFile.text());

  if (!directives.export)
  {
    throw new Error(`Template "${ sourceFilePath }" is missing an export directive.`);
  }
  else if (templates.has(directives.export))
  {
    throw new Error(`There is already a template with the name "${ directives.export }".`);
  }

  templates.set(directives.export, true);

  const targetFile = file(`${ targetFolder }/${ directives.export }.js`);

  if (!await targetFile.exists() || targetFile.lastModified < sourceFile.lastModified)
  {
    const content: string[] = [];

    if (directives.include)
    {
      for (const include of directives.include)
      {
        const includeFilePath = `${ targetFolder }/${ include }.js`;

        content.push(`import __${ include } from '${ includeFilePath }';`);
      }
    }

    content.push(`export default ${ compile.toString(template, {}, { recursive: directives.recursive }) };`);

    await targetFile.write(content.join('\n'));
  }
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