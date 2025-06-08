const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { resolve } = require('path');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Set up a proxy for API requests in web development
    if (config.devServer) {
        config.devServer.proxy = {
            '/api': {
                target: 'http://localhost:8000', // Change this to your API server
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
                secure: false,
            }
        };
    }

    // Add resolve aliases for web compatibility
    config.resolve.alias = {
        ...config.resolve.alias,
        'react-native$': 'react-native-web',
        'react-native-linear-gradient': 'react-native-web-linear-gradient',
    };

    // Fix issues with MIME types
    config.module.rules.push({
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
            resolve(__dirname, 'node_modules/react-native-reanimated'),
            resolve(__dirname, 'node_modules/@react-native'),
        ],
    });

    return config;
}; 