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
pipeline.registerTask('getComponentDeclarations', getComponentDeclarations);
pipeline.registerTask('saveComponentMetadata', saveComponentMetadata);

// --- import helper tasks -------------------------------------------------

import scanFolder from './tasks/helpers/scan-folder';

// --- import the build tasks -------------------------------------------------

import buildComponents from './tasks/components';
import getComponentDeclarations from './tasks/components/declarations';
import saveComponentMetadata from './tasks/components/metadata';