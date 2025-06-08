const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // Additional features can be added here
});

// Customize resolver for web compatibility
config.resolver.sourceExts = process.env.RN_SRC_EXT
    ? [...process.env.RN_SRC_EXT.split(',').map(ext => ext.trim()), ...config.resolver.sourceExts]
    : config.resolver.sourceExts;

// Add specific file extensions for web
config.resolver.sourceExts.push('web.js', 'web.ts', 'web.tsx');

// Handle specific package resolutions
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'react-native-web': require.resolve('react-native-web'),
};

module.exports = config; 