const originalApiUrl = process.env.REACT_APP_API_URL;

afterEach(() => {
  if (originalApiUrl === undefined) {
    delete process.env.REACT_APP_API_URL;
  } else {
    process.env.REACT_APP_API_URL = originalApiUrl;
  }
  jest.resetModules();
});

test('uses the configured API root once when building a route URL', () => {
  process.env.REACT_APP_API_URL = 'https://api.example.test/api/';

  jest.isolateModules(() => {
    const api = require('./api').default;
    expect(api.defaults.baseURL).toBe('https://api.example.test/api');
    expect(api.getUri({ url: '/v1/users/login' })).toBe('https://api.example.test/api/v1/users/login');
  });
});

test('uses a same-origin API fallback when no build variable is configured', () => {
  delete process.env.REACT_APP_API_URL;

  jest.isolateModules(() => {
    const api = require('./api').default;
    expect(api.defaults.baseURL).toBe('/api');
  });
});
