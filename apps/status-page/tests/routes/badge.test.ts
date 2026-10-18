import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vite-plus/test';
import { workerConfig } from '@flarewatch/config/worker';
import { Route } from '@/routes/api/badge';
import { callBadge, stubBadgeView } from '../helpers/badge';
import { forgetViewAroundEachTest } from '../helpers/snapshots';

// Viewio patch (upstream issue pending): the badge tests read their own monitor, not the fork's config.
const userMonitors = workerConfig.monitors;
const originalMonitors: typeof workerConfig.monitors = [
  {
    id: 'demo_example',
    name: 'Example Domain',
    method: 'GET',
    target: 'https://example.com',
    expectedCodes: [200],
    timeout: 10000,
    link: false,
  },
];
beforeEach(() => {
  workerConfig.monitors = originalMonitors;
});
afterAll(() => {
  workerConfig.monitors = userMonitors;
});
afterEach(() => {
  workerConfig.monitors = originalMonitors;
});
forgetViewAroundEachTest();

const get = (path = '/api/badge?id=demo_example') => callBadge(Route, path);

describe('GET /api/badge', () => {
  it('serves unknown before a monitor reports its first result and refuses a missing monitor', async () => {
    stubBadgeView('up', { startedAt: undefined });
    const firstResultPending = await get();
    expect(firstResultPending.status).toBe(200);
    expect(await firstResultPending.json()).toMatchObject({
      message: 'unknown',
      color: 'lightgrey',
    });

    expect((await get('/api/badge?id=no_such_monitor')).status).toBe(404);
  });
});
