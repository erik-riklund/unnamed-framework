import { usePipeline } from 'module/pipeline';

/**
 * ?
 */
const tasks =
{
  buildComponents,
  buildLayouts,
  compileComponents,
  compileComponentStylesheet,
  compileComponentTemplate,
  compileScss,
  getComponentDeclarations,
  loadComponentDeclaration,
  saveComponentMetadata,
  scanFolder
};

/**
 * Initialize the pipeline for the build process.
 */
export const pipeline = usePipeline(tasks);

// // --- helper tasks -----------------------------------------------------------

import compileScss from './tasks/helpers/compile-scss';
import scanFolder from './tasks/helpers/scan-folder';

// // --- build tasks ------------------------------------------------------------

import buildComponents from './tasks/components';
import buildLayouts from './tasks/layouts';
import compileComponents from './tasks/components/compile-all';
import compileComponentStylesheet from './tasks/components/compile/stylesheet';
import compileComponentTemplate from './tasks/components/compile/template';
import getComponentDeclarations from './tasks/components/declarations';
import loadComponentDeclaration from './tasks/components/load-declaration';
import saveComponentMetadata from './tasks/components/metadata';