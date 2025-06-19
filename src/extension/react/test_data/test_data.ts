export const events = [
  {
    serialNumber: 1,
    direction: 'renderer-to-main',
    channel: 'ping',
    args: [],
    timestamp: 1749114386179,
  },
  {
    serialNumber: 12,
    timestamp: 1749114386181,
    direction: 'main-to-renderer',
    channel: 'test-ipc',
    args: [
      {
        hello: 'world from main',
      },
    ],
    processId: 5240,
  },
  {
    serialNumber: 123,
    direction: 'renderer-to-main',
    channel: 'hello-renderer',
    args: ['random string as argument lol'],
    timestamp: 1749114386627,
  },
  {
    direction: 'renderer-to-main',
    channel: 'ping',
    args: [],
    timestamp: 1749114387250,
  },
  {
    timestamp: 1749114387251,
    direction: 'main-to-renderer',
    channel: 'test-ipc',
    args: [
      {
        id: 10234,
        username: 'coolcat42',
        email: 'coolcat42@example.com',
        profile: {
          first_name: 'Lena',
          last_name: 'Martinez',
          age: 27,
          verified: true,
          preferences: {
            newsletter: false,
            theme: 'dark',
            language: 'en-US',
          },
        },
        friends: [
          { id: 203, name: 'Jake', online: true },
          { id: 204, name: 'Mira', online: false },
        ],
        last_login: '2025-06-05T08:23:14Z',
        tags: ['photography', 'travel', 'books'],
        metrics: {
          posts: 142,
          likes: 3892,
          followers: 521,
        },
      },
    ],
    processId: 5240,
  },
];
