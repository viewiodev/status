import type { WorkerConfig } from '@flarewatch/shared';

/**
 * Viewio's public status (docs/INFRA.md §15.7 in the Viewio repository; this file is written there and
 * committed here by OpenTofu, so an edit made here is overwritten).
 *
 * Each component reads the service's own `status.json`, judged on its recent real traffic, so a cached
 * answer cannot hide a broken dependency. A missing or unreadable file fails the check. `degraded` stays
 * green: only `down` opens an incident. No URL here holds a token.
 */
const component = (id: string, name: string, host: string, key: string) => ({
  id,
  name,
  method: 'GET' as const,
  target: `https://${host}/status.json`,
  expectedCodes: [200],
  responseKeyword: `"${key}":`,
  responseForbiddenKeyword: `"${key}":"down"`,
  timeout: 10000,
  downAfterChecks: 3,
  link: false as const,
});

export const workerConfig: WorkerConfig = {
  monitors: [
    {
      id: 'studio',
      name: 'Studio',
      method: 'GET',
      target: 'https://viewio.me/',
      expectedCodes: [200],
      timeout: 10000,
      maxLatencyMs: 3000,
      downAfterChecks: 3,
      link: 'https://viewio.me/',
    },
    {
      id: 'install',
      name: 'Installation',
      method: 'GET',
      target: 'https://addon.viewio.me/manifest.json',
      expectedCodes: [200],
      responseJsonPath: '$.id',
      responseJsonValue: 'com.viewio.addon',
      timeout: 10000,
      downAfterChecks: 3,
      link: false,
    },
    component('links', 'Liens de lecture', 'addon.viewio.me', 'links'),
    component('catalogues', 'Catalogues', 'addon.viewio.me', 'catalogues'),
    component('metadata', 'Fiches des films et séries', 'addon.viewio.me', 'metadata'),
    component('indexer', 'Nouveautés', 'addon.viewio.me', 'indexer'),
    component('posters', 'Affiches', 'posters.viewio.me', 'posters'),
    {
      id: 'alldebrid',
      name: 'AllDebrid',
      method: 'GET',
      target: 'https://api.alldebrid.com/v4/ping',
      expectedCodes: [200],
      responseJsonPath: '$.data.ping',
      responseJsonValue: 'pong',
      timeout: 10000,
      downAfterChecks: 3,
      link: 'https://alldebrid.com/',
    },
    {
      id: 'torbox',
      name: 'TorBox',
      method: 'GET',
      target: 'https://api.torbox.app/',
      expectedCodes: [200],
      responseJsonPath: '$.success',
      responseJsonValue: true,
      timeout: 10000,
      downAfterChecks: 3,
      link: 'https://torbox.app/',
    },
  ],
  notification: {
    gracePeriod: 3,
    timeZone: 'Europe/Paris',
  },
};
