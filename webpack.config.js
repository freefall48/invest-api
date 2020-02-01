const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    target: 'node',
    externals: [nodeExternals()],
    entry: './src/server.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new NodemonPlugin(),
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension
        extensions: ['.mjs', '.ts', '.js'],
        plugins: [new TsconfigPathsPlugin({})]
    },
    module: {
        rules: [
            { test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader' },
            { test: /\.graphql$/, exclude: /node_modules/, loader: 'graphql-tag/loader' }
        ]
    }
};