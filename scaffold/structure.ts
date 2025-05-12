/**
 * ?
 */
export const structure: Record<string, any> =
{
  app:
  {
    assets: {
      images: { '.gitkeep': './scaffold/.gitkeep' },
      styles: { '.gitkeep': './scaffold/.gitkeep' }
    },

    routes: {
      api: { '.gitkeep': './scaffold/.gitkeep' },
      '-pages': { '.gitkeep': './scaffold/.gitkeep' }
    },

    ui: { '.gitkeep': './scaffold/.gitkeep' }
  },

  core:
  {
    // not implemented yet.
  },

  '.vscode': {
    'settings.json': './scaffold/.vscode/settings.json'
  },

  'package.json': './scaffold/package.json',
  'tsconfig.json': './scaffold/tsconfig.json'
};