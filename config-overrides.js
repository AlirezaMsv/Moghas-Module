const { override } = require("customize-cra");

const addWebpackResolveFallback = (config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: false,
    buffer: false,
  };
  return config;
};

module.exports = override(addWebpackResolveFallback);
