import type { PageConfig } from '@flarewatch/shared';

// Written in the Viewio repository (docs/INFRA.md §15.7) and committed here by OpenTofu.
export const pageConfig: PageConfig = {
  title: 'Viewio',
  links: [{ label: 'viewio.me', link: 'https://viewio.me/' }],
  group: {
    Viewio: ['studio', 'install', 'links', 'catalogues', 'metadata', 'indexer', 'posters'],
    Débrideurs: ['alldebrid', 'torbox'],
  },
};
