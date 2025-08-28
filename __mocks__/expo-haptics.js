module.exports = new Proxy({}, {
  get: () => async () => {}
});

