import { usePipeline } from 'module/pipeline';

/**
 * Initialize the pipeline for the build process.
 */
export const pipeline = usePipeline();

/**
 * Register the available helper tasks in the pipeline.
 */
pipeline.registerTask('scanFolder', scanFolder);

/**
 * Register the available build tasks in the pipeline.
 */
pipeline.registerTask('buildComponents', buildComponents);
pipeline.registerTask('compileComponents', compileComponents);
pipeline.registerTask('compileComponentStylesheet', compileComponentStylesheet);
pipeline.registerTask('compileComponentTemplate', compileComponentTemplate);
pipeline.registerTask('getComponentDeclarations', getComponentDeclarations);
pipeline.registerTask('loadComponentDeclaration', loadComponentDeclaration);
pipeline.registerTask('saveComponentMetadata', saveComponentMetadata);

// --- import helper tasks -------------------------------------------------

import scanFolder from './tasks/helpers/scan-folder';

// --- import the build tasks -------------------------------------------------

import buildComponents from './tasks/components';
import compileComponents from './tasks/components/compile-all';
import compileComponentStylesheet from './tasks/components/compile/stylesheet';
import compileComponentTemplate from './tasks/components/compile/template';
import getComponentDeclarations from './tasks/components/declarations';
import loadComponentDeclaration from './tasks/components/load-declaration';
import saveComponentMetadata from './tasks/components/metadata';