import { usePipeline } from 'module/pipeline';

/**
 * Initialize the pipeline for the build process.
 */
export const pipeline = usePipeline(
  {
    // buildComponents,
    // buildLayouts,
    // compileComponents,
    // compileComponentStylesheet,
    // compileComponentTemplate,
    // getComponentDeclarations,
    // loadComponentDeclaration,
    // saveComponentMetadata,
    // scanFolder
  }
);

// --- helper tasks -----------------------------------------------------------

import scanFolder from './tasks/helpers/scan-folder';

// --- build tasks ------------------------------------------------------------

import buildComponents from './tasks/components';
import buildLayouts from './tasks/layouts';
import compileComponents from './tasks/components/compile-all';
import compileComponentStylesheet from './tasks/components/compile/stylesheet';
import compileComponentTemplate from './tasks/components/compile/template';
import getComponentDeclarations from './tasks/components/declarations';
import loadComponentDeclaration from './tasks/components/load-declaration';
import saveComponentMetadata from './tasks/components/metadata';