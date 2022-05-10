// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// development config
const { resolve } = require('path');
const { merge } = require('webpack-merge');
const commonConfig = require('./common');
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

//Loads .env.local file and injects environment variables
dotenv.config({
    path: path.resolve(__dirname, '../../.env.dev'),
});

module.exports = merge(commonConfig, {
    mode: 'development',
    entry: [
        './index.tsx', // the entry point of our app
    ],
    output: {
        path: resolve(__dirname, '../../dist'),
        filename: 'main.js',
        publicPath: '/',
        clean: true,
    },
    devServer: {
        historyApiFallback: true,
        open: true,
        https: true,
        hot: true,
        compress: true,
        port: 8080,
    },
    // https://webpack.js.org/configuration/devtool/
    devtool: 'cheap-module-source-map',
    // Inject environmental variables during compile
    plugins: [
        new webpack.DefinePlugin({
            IS_DEBUG: process.env.IS_DEBUG,
            APP_ID: JSON.stringify(process.env.APP_ID),
            GRAPH_SCOPES: process.env.GRAPH_SCOPES,
        }),
    ],
});
