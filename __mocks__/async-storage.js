let store = new Map();

module.exports = {
  setItem: async (key, value) => {
    store.set(key, value);
  },
  getItem: async (key) => {
    return store.get(key) ?? null;
  },
  removeItem: async (key) => {
    store.delete(key);
  },
  clear: async () => {
    store.clear();
  },
  multiGet: async (keys) => {
    return keys.map(k => [k, store.get(k) ?? null]);
  },
  multiRemove: async (keys) => {
    keys.forEach(k => store.delete(k));
  },
  getAllKeys: async () => Array.from(store.keys())
};

