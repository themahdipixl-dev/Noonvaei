// Lets Metro bundle .glb models as assets (used later when you add real models).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('glb', 'bin');

module.exports = config;
