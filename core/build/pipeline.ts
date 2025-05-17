import { usePipeline } from 'module/pipeline';

/**
 * ?
 */
const tasks =
{
  buildComponents,
  buildLayouts,
  compareLastModified,
  compileComponents,
  compileComponentStylesheet,
  compileComponentTemplate,
  compileLayouts,
  compileLayoutStylesheet,
  compileLayoutTemplate,
  compileScss,
  compileTemplate,
  createRoutePath,
  getComponentDeclarations,
  getLayoutDeclarations,
  loadComponentDeclaration,
  loadLayoutDeclaration,
  saveComponentMetadata,
  saveLayoutMetadata,
  scanFolder
};

/**
 * Initialize the pipeline for the build process.
 */
export const pipeline = usePipeline(tasks);


// // --- shared tasks -----------------------------------------------------------

import compareLastModified from './tasks/shared/last-modified';
import compileScss from './tasks/shared/compile-scss';
import compileTemplate from './tasks/shared/compile-template';
import createRoutePath from './tasks/shared/create-route-path';
import scanFolder from './tasks/shared/scan-folder';

// // --- build tasks ------------------------------------------------------------

import buildComponents from './tasks/components';
import buildLayouts from './tasks/layouts';
import compileComponents from './tasks/components/compile-all';
import compileComponentStylesheet from './tasks/components/compile/stylesheet';
import compileComponentTemplate from './tasks/components/compile/template';
import compileLayouts from './tasks/layouts/compile-all';
import compileLayoutStylesheet from './tasks/layouts/compile/stylesheet';
import compileLayoutTemplate from './tasks/layouts/compile/template';
import getComponentDeclarations from './tasks/components/declarations';
import getLayoutDeclarations from './tasks/layouts/declarations';
import loadComponentDeclaration from './tasks/components/load-declaration';
import loadLayoutDeclaration from './tasks/layouts/load-declaration';
import saveComponentMetadata from './tasks/components/metadata';
import saveLayoutMetadata from './tasks/layouts/metadata';