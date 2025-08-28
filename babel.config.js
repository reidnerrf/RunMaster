module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['@react-native/babel-preset'],
    plugins: ['@babel/plugin-transform-flow-strip-types'],
  };
};

