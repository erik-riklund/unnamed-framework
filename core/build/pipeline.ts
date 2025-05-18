import { usePipeline } from 'module/pipeline';

/**
 * ?
 */
const tasks =
{
  buildComponents,
  buildLayouts,
  buildViews,
  compareLastModified,
  compileComponentStylesheet,
  compileComponentTemplate,
  compileLayoutStylesheet,
  compileLayoutTemplate,
  compileStylesheet,
  compileTemplate,
  compileViewStylesheet,
  compileViewTemplate,
  createRoutePath,
  getComponentDeclarations,
  getLayoutDeclarations,
  getViewDeclarations,
  loadComponentDeclaration,
  loadJsonFile,
  loadLayoutDeclaration,
  loadViewDeclaration,
  resolveLayouts,
  saveComponentMetadata,
  saveLayoutMetadata,
  saveViewMetadata,
  scanFolder,
  setupRuntimeFolder,
  writeFile
};

/**
 * Initialize the pipeline for the build process.
 */
export const pipeline = usePipeline(tasks);


// // --- shared tasks -----------------------------------------------------------

import compareLastModified from './tasks/shared/last-modified';
import compileStylesheet from './tasks/shared/compile-stylesheet';
import compileTemplate from './tasks/shared/compile-template';
import createRoutePath from './tasks/shared/create-route-path';
import loadJsonFile from './tasks/shared/load-json';
import resolveLayouts from './tasks/views/resolve-layouts';
import scanFolder from './tasks/shared/scan-folder';
import setupRuntimeFolder from './tasks/setup-runtime';
import writeFile from './tasks/shared/write-file';

// // --- build tasks ------------------------------------------------------------

import buildComponents from './tasks/components';
import buildLayouts from './tasks/layouts';
import buildViews from './tasks/views';
import compileComponentStylesheet from './tasks/components/compile/stylesheet';
import compileComponentTemplate from './tasks/components/compile/template';
import compileLayoutStylesheet from './tasks/layouts/compile/stylesheet';
import compileLayoutTemplate from './tasks/layouts/compile/template';
import compileViewStylesheet from './tasks/views/compile/stylesheet';
import compileViewTemplate from './tasks/views/compile/template';
import getComponentDeclarations from './tasks/components/declarations';
import getLayoutDeclarations from './tasks/layouts/declarations';
import getViewDeclarations from './tasks/views/declarations';
import loadComponentDeclaration from './tasks/components/load-declaration';
import loadLayoutDeclaration from './tasks/layouts/load-declaration';
import loadViewDeclaration from './tasks/views/load-declaration';
import saveComponentMetadata from './tasks/components/metadata';
import saveLayoutMetadata from './tasks/layouts/metadata';
import saveViewMetadata from './tasks/views/metadata';