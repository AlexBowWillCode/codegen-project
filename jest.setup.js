// jest.setup.js
jest.mock("node-fetch", () => {
  return jest.fn().mockImplementation(() => {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: { __schema: { types: [] } } }),
    });
  });
});
