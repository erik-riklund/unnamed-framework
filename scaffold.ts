import { file, write } from 'bun';
import { exists } from 'node:fs/promises';
import { structure } from './scaffold/structure';

/**
 * ?
 */
const rootFolder = `${ process.cwd() }/..`;

/**
 * ?
 */
const createFolder = async (name: string, content: Record<string, any>) =>
{
  const absoluteFolderPath = `${ rootFolder }/${ name }`;

  for (const [item, nestedContent] of Object.entries(content))
  {
    if (typeof nestedContent === 'object')
    {
      await createFolder(`${ name }/${ item }`, nestedContent);
    }
    else
    {
      await write(`${ absoluteFolderPath }/${ item }`,
        nestedContent.startsWith('./') ? file(nestedContent) : nestedContent
      );
    }
  }
};

/**
 * ?
 */
const initializeProjectStructure = async (projectName: string) =>
{
  console.log(`Creating project: ${ projectName }`);
  const absoluteFolderPath = `${ rootFolder }/${ projectName }`;

  if (await exists(absoluteFolderPath))
  {
    // console.error('A project with the given name already exists.');
    // return; // early exit - the destination directory already exists.
  }

  try
  {
    console.log('Copying boilerplate files...');
    await createFolder(projectName, structure);

    console.log('Project structure created successfully. :)');
  }
  catch (error)
  {
    console.error('Failed to create project structure:', error);
  }
};

/**
 * Executes the scaffolding script if a directory name is provided.
 */
if (process.argv[2]?.length)
{
  initializeProjectStructure(process.argv[2]);
}
else console.error(
  'Please provide a directory name to create the project structure.'
);