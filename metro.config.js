const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Use port 19000 for Metro bundler
config.server = {
  ...config.server,
  port: 19000,
};

module.exports = config; 