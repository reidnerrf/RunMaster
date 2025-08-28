// Define a minimal global expo object before any preset runs
if (!globalThis.expo) {
  globalThis.expo = { EventEmitter: function() {} };
}

